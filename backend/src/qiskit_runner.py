from __future__ import annotations

from qiskit import ClassicalRegister, QuantumCircuit
from qiskit.circuit.library import Measure, XGate, ZGate
from qiskit_aer import Aer


class QiskitRunner:
    _PAIR_OPERATION_COUNT = 2

    def __init__(self, logger=None):
        self.logger = logger

    def run_circuit(
        self,
        steps: list,
        options: dict | None = None,
    ):
        """
        Execute the specified quantum circuit and return the results of each step.

        Args:
            steps (list): A list of steps to execute.
            options (dict | None, optional): A dictionary containing optional parameters such as qubit_count, until_step_index, and amplitude_indices. Defaults to None.

        Returns:
            list: A list containing the results of each step. Each result is a dictionary including measured bits and amplitudes.
        """
        if options is None:
            options = {}

        qubit_count = options.get('qubit_count')
        until_step_index = options.get('until_step_index')
        amplitude_indices = options.get('amplitude_indices')

        circuit = self._build_circuit(steps, qubit_count)

        if self.logger:
            self.logger.debug(circuit.draw(output='text'))
        
        print(circuit.draw(output='text'))

        until_step_index = self._get_until_step_index(until_step_index, steps)
        print(f"until_step_index: {until_step_index}")

        actual_until_step_index = self.actual_step_index(steps, until_step_index)

        print(f"actual_until_step_index: {actual_until_step_index}")

        return self._run_qiskit(circuit, steps, until_step_index, actual_until_step_index, amplitude_indices)

    def _build_circuit(self, steps: list, qubit_count: int | None = None) -> tuple:
        qubit_count = qubit_count or self._get_qubit_count(steps)
        print(f"qubit_count: {qubit_count}")
        circuit = self._process_step_operations(steps, qubit_count)
        if qubit_count > 0:
            circuit.save_statevector()

        return circuit

    def _run_qiskit(
        self,
        circuit: QuantumCircuit,
        steps: list,
        until_step_index: int,
        actual_until_step_index: int,
        amplitude_indices: list | None = None,
    ) -> list:
        amplitude_indices = self._get_amplitude_indices(amplitude_indices, circuit)

        simulator = Aer.get_backend('aer_simulator')

        # 測定があるかどうかを確認
        has_measurements = any(isinstance(instr.operation, Measure) for instr in circuit.data)

        if has_measurements:
            job = simulator.run(circuit, shots=1, memory=True)
        else:
            job = simulator.run(circuit, shots=1)

        result = job.result()
        if circuit.depth() > 0:
            statevector = result.get_statevector()
        else:
            statevector = None
        memory = result.get_memory() if has_measurements else None
        print(f"memory: {memory}")
        
        step_results = []
        if circuit.depth() == 0:
            return step_results
        
        for step_index in range(len(steps)):
            step_result = self._process_step_result(step_index, statevector, memory, until_step_index)
            step_results.append(step_result)

        return self._filter_amplitudes(step_results, until_step_index, actual_until_step_index, amplitude_indices)

    def _process_step_result(self, step_index, statevector, memory, until_step_index):
        result = {":measuredBits": {}}

        if step_index == until_step_index:
            result[":amplitude"] = statevector

        if memory:
            for bit_index, bit_value in enumerate(reversed(memory[0])):  # ビット列を逆にする
                result[":measuredBits"][bit_index] = int(bit_value)

        return result

    def _filter_amplitudes(self, step_results, until_step_index, actual_until_step_index, amplitude_indices):
        print(f"step_results: {step_results}")

        amplitudes = step_results[until_step_index][":amplitude"]
        if amplitudes is None:
            return step_results

        filtered_amplitudes = {index: amplitudes[index] for index in amplitude_indices}
        step_results[until_step_index][":amplitude"] = filtered_amplitudes

        # # original_until_step_index を使用して結果を調整
        # if until_step_index != actual_until_step_index:
        #     step_results[actual_until_step_index] = step_results.pop(until_step_index)

        return step_results

    def _get_until_step_index(self, until_step_index, steps):
        if len(steps) == 0:
            return 0
        return len(steps) - 1 if until_step_index is None else until_step_index

    def _get_amplitude_indices(self, amplitude_indices, circuit):
        qubit_count = len(circuit.qubits)

        if amplitude_indices is None:
            amplitude_indices = list(range(2**qubit_count))

        return amplitude_indices

    def _get_qubit_count(self, steps: list) -> int:
        return (
            max(
                max((max(gate.get("targets", [-1])) for step in steps for gate in step), default=-1),
                max((max(gate.get("controls", [-1])) for step in steps for gate in step), default=-1),
            )
            + 1
        )

    def _process_step_operations(self, steps, qubit_count):
        circuit = QuantumCircuit(qubit_count)
        classical_bits = 0

        for step in steps:
            for gate in step:
                if gate["type"] == "Measure":
                    classical_bits = max(classical_bits, max(gate.get("targets", [-1])) + 1)

        if classical_bits > 0:
            creg = ClassicalRegister(classical_bits)
            circuit.add_register(creg)

        for step in steps:
            i_targets = list(range(qubit_count))

            for operation in step:
                if "targets" in operation:
                    i_targets = list(set(i_targets) - set(operation["targets"]))
                if "controls" in operation:
                    i_targets = list(set(i_targets) - set(operation["controls"]))

                if operation["type"] == "H":
                    circuit.h(operation["targets"])
                elif operation["type"] == "X":
                    if "controls" in operation:
                        for target in operation["targets"]:
                            circuit.mcx(operation["controls"], target)
                    else:
                        circuit.x(operation["targets"])
                elif operation["type"] == "Y":
                    circuit.y(operation["targets"])
                elif operation["type"] == "Z":
                    circuit.z(operation["targets"])
                elif operation["type"] == "X^½":
                    circuit.append(XGate().power(1/2), operation["targets"])
                elif operation["type"] == "S":
                    circuit.s(operation["targets"])
                elif operation["type"] == "S†":
                    circuit.sdg(operation["targets"])
                elif operation["type"] == "T":
                    circuit.t(operation["targets"])
                elif operation["type"] == "T†":
                    circuit.tdg(operation["targets"])
                elif operation["type"] == "Swap":
                    if len(operation["targets"]) == self._PAIR_OPERATION_COUNT:
                        circuit.swap(operation["targets"][0], operation["targets"][1])
                    else:
                        circuit.id(operation["targets"])
                elif operation["type"] == "•":
                    if len(operation["targets"]) >= 2:
                        U1 = ZGate().control(num_ctrl_qubits = len(operation["targets"]) - 1)
                        circuit.append(U1, qargs = operation["targets"])
                    else:
                        circuit.id(operation["targets"])
                elif operation["type"] == "|0>":
                    circuit.reset(operation["targets"][0])
                elif operation["type"] == "|1>":
                    circuit.reset(operation["targets"][0])
                    circuit.x(operation["targets"][0])
                elif operation["type"] == "Measure":
                    for target in operation["targets"]:
                        circuit.measure(target, target)
                else:
                    msg = "Unknown operation: {}".format(operation["type"])
                    raise ValueError(msg)

            for each in i_targets:
                circuit.id(each)

        return circuit

    def actual_step_index(self, steps, step_index):
        actual_index = step_index

        for i, step in enumerate(steps[:step_index]):
            for operation in step:
                if operation["type"] == "|1>":
                    actual_index += 1
                if operation["type"] == "X" and "controls" in operation:
                    if len(operation["controls"]) > 0 and len(operation["targets"]) > 1:
                        actual_index += len(operation["targets"]) - 1
                    
        return actual_index

