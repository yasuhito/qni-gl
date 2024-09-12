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
        *,
        qubit_count: int | None = None,
        until_step_index: int | None = None,
        amplitude_indices: list | None = None,
    ):
        """
        Execute the specified quantum circuit and return the results of each step.

        Args:
            steps (list): A list of steps to execute.
            qubit_count (int | None, optional): The number of qubits. Defaults to None.
            until_step_index (int | None, optional): The index of the step until which to execute. Defaults to None.
            amplitude_indices (list | None, optional): The indices of the amplitudes to return. Defaults to None.

        Returns:
            list: A list containing the results of each step. Each result is a dictionary including measured bits and amplitudes.
        """
        circuit = self._build_circuit(steps, qubit_count=qubit_count)
        circuit_partial = self._build_circuit(steps, qubit_count=qubit_count, until_step_index=until_step_index)

        if self.logger:
            self.logger.debug(circuit.draw(output="text"))
            self.logger.debug(circuit_partial.draw(output="text"))

        step_results = []
        if circuit_partial.depth() == 0:
            return step_results

        simulator = Aer.get_backend("aer_simulator_statevector")

        # 測定結果取得用の実行
        memory = None
        has_measurements = any(isinstance(instr.operation, Measure) for instr in circuit.data)
        if has_measurements:
            job = simulator.run(circuit, shots=1, memory=True)
            result = job.result()
            memory = result.get_memory()

        # 状態ベクトル取得用の実行
        job = simulator.run(circuit_partial, shots=1)
        result = job.result()
        statevector = result.get_statevector() if circuit_partial.depth() > 0 else None

        if until_step_index is None:
            until_step_index = self._get_until_step_index(steps)

        for step_index in range(len(steps)):
            step_result = self._process_step_result(step_index, statevector, memory, until_step_index)
            step_results.append(step_result)

        amplitude_indices = self._get_amplitude_indices(amplitude_indices, circuit)

        return self._filter_amplitudes(step_results, until_step_index, amplitude_indices)

    def _build_circuit(
        self, steps: list, *, qubit_count: int | None = None, until_step_index: int | None = None
    ) -> tuple:
        if qubit_count is None:
            qubit_count = self._get_qubit_count(steps)

        if until_step_index is None:
            until_step_index = self._get_until_step_index(steps)
            circuit = self._process_step_operations(steps, qubit_count)
        else:
            circuit = self._process_step_operations(steps[: until_step_index + 1], qubit_count)

        if qubit_count > 0:
            circuit.save_statevector()

        return circuit

    def _process_step_result(self, step_index, statevector, memory, until_step_index):
        result = {":measuredBits": {}}

        if step_index == until_step_index:
            result[":amplitude"] = statevector

        if memory:
            for bit_index, bit_value in enumerate(reversed(memory[0])):  # ビット列を逆にする
                result[":measuredBits"][bit_index] = int(bit_value)

        return result

    def _filter_amplitudes(self, step_results, until_step_index, amplitude_indices):
        amplitudes = step_results[until_step_index][":amplitude"]
        if amplitudes is None:
            return step_results

        filtered_amplitudes = {index: amplitudes[index] for index in amplitude_indices}
        step_results[until_step_index][":amplitude"] = filtered_amplitudes

        # # original_until_step_index を使用して結果を調整
        # if until_step_index != actual_until_step_index:
        #     step_results[actual_until_step_index] = step_results.pop(until_step_index)

        return step_results

    def _get_until_step_index(self, steps: list) -> int:
        if len(steps) == 0:
            return 0
        return len(steps) - 1

    def _get_amplitude_indices(self, amplitude_indices: list | None, circuit: QuantumCircuit) -> list:
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

    def _process_step_operations(self, steps: list, qubit_count: int) -> QuantumCircuit:
        circuit = QuantumCircuit(qubit_count)
        classical_bits = self._get_classical_bits(steps)

        if classical_bits > 0:
            creg = ClassicalRegister(classical_bits)
            circuit.add_register(creg)

        for step in steps:
            i_targets = list(range(qubit_count))

            for operation in step:
                i_targets = list(set(i_targets) - set(operation["targets"]))
                if "controls" in operation:
                    i_targets = list(set(i_targets) - set(operation["controls"]))

                self._apply_operation(circuit, operation)

            for each in i_targets:
                circuit.id(each)

        return circuit

    def _get_classical_bits(self, steps: list) -> int:
        classical_bits = 0
        for step in steps:
            for gate in step:
                if gate["type"] == "Measure":
                    classical_bits = max(classical_bits, max(gate.get("targets", [-1])) + 1)
        return classical_bits

    def _apply_operation(self, circuit: QuantumCircuit, operation: dict):
        if operation["type"] == "H":
            circuit.h(operation["targets"])
        elif operation["type"] == "X":
            self._apply_x_operation(circuit, operation)
        elif operation["type"] == "Y":
            circuit.y(operation["targets"])
        elif operation["type"] == "Z":
            circuit.z(operation["targets"])
        elif operation["type"] == "X^½":
            circuit.append(XGate().power(1 / 2), operation["targets"])
        elif operation["type"] == "S":
            circuit.s(operation["targets"])
        elif operation["type"] == "S†":
            circuit.sdg(operation["targets"])
        elif operation["type"] == "T":
            circuit.t(operation["targets"])
        elif operation["type"] == "T†":
            circuit.tdg(operation["targets"])
        elif operation["type"] == "Swap":
            self._apply_swap_operation(circuit, operation)
        elif operation["type"] == "•":
            self._apply_controlled_z_operation(circuit, operation)
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

    def _apply_x_operation(self, circuit: QuantumCircuit, operation: dict):
        if "controls" in operation:
            for target in operation["targets"]:
                circuit.mcx(operation["controls"], target)
        else:
            circuit.x(operation["targets"])

    def _apply_swap_operation(self, circuit: QuantumCircuit, operation: dict):
        if len(operation["targets"]) == self._PAIR_OPERATION_COUNT:
            circuit.swap(operation["targets"][0], operation["targets"][1])
        else:
            circuit.id(operation["targets"])

    def _apply_controlled_z_operation(self, circuit: QuantumCircuit, operation: dict):
        if len(operation["targets"]) >= self._PAIR_OPERATION_COUNT:
            u = ZGate().control(num_ctrl_qubits=len(operation["targets"]) - 1)
            circuit.append(u, qargs=operation["targets"])
        else:
            circuit.id(operation["targets"])
