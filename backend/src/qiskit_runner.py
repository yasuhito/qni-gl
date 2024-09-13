from __future__ import annotations

from qiskit import ClassicalRegister, QuantumCircuit
from qiskit.circuit.library import Measure, XGate, ZGate
from qiskit_aer import Aer


class QiskitRunner:
    _PAIR_OPERATION_COUNT = 2
    _STATEVECTOR_LABEL = "state_at_until_step"

    def __init__(self, logger=None):
        self.logger = logger
        self.measured_bits = []

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
        step_results = []

        circuit = self._build_circuit(steps, qubit_count=qubit_count, until_step_index=until_step_index)

        if self.logger:
            self.logger.debug(circuit.draw(output="text"))

        if circuit.depth() == 0:
            return step_results

        result = self._run_backend(circuit)
        statevector = self._get_statevector(result)

        has_measurements = any(isinstance(instr.operation, Measure) for instr in circuit.data)

        if has_measurements:
            counts = result.get_counts()
            count = next(iter(counts.keys()))
            bit_strings = count.split()

            for measured_bits in self.measured_bits:
                if len(measured_bits) == 0:
                    continue
                bit_string = bit_strings.pop()
                for bit in measured_bits:
                    measured_bits[bit] = int(bit_string[len(bit_string) - bit - 1])

        if until_step_index is None:
            until_step_index = self._last_step_index(steps)

        for step_index in range(len(steps)):
            step_result = {":measuredBits": self.measured_bits[step_index]}
            if step_index == until_step_index:
                step_result[":amplitude"] = statevector
            step_results.append(step_result)

        if amplitude_indices is None:
            return step_results

        return self._filter_amplitudes(step_results, amplitude_indices)

    def _build_circuit(
        self, steps: list, *, qubit_count: int | None = None, until_step_index: int | None = None
    ) -> tuple:
        if qubit_count is None:
            qubit_count = self._get_qubit_count(steps)

        if until_step_index is None:
            until_step_index = self._last_step_index(steps)

        return self._process_step_operations(steps, qubit_count, until_step_index)

    def _filter_amplitudes(self, step_results, amplitude_indices):
        for step_result in step_results:
            amplitudes = step_result.get(":amplitude")
            if amplitudes is not None:
                filtered_amplitudes = {index: amplitudes[index] for index in amplitude_indices}
                step_result[":amplitude"] = filtered_amplitudes

        return step_results

    def _last_step_index(self, steps: list) -> int:
        if len(steps) == 0:
            return 0
        return len(steps) - 1

    def _get_qubit_count(self, steps: list) -> int:
        return (
            max(
                max((max(gate.get("targets", [-1])) for step in steps for gate in step), default=-1),
                max((max(gate.get("controls", [-1])) for step in steps for gate in step), default=-1),
            )
            + 1
        )

    def _process_step_operations(self, steps: list, qubit_count: int, until_step_index: int) -> QuantumCircuit:
        circuit = QuantumCircuit(qubit_count)

        # if qubit_count > 0:
        #     creg = ClassicalRegister(qubit_count)
        #     circuit.add_register(creg)

        for step_index, step in enumerate(steps):
            i_targets = list(range(qubit_count))
            self.measured_bits.append({})

            for operation in step:
                i_targets = list(set(i_targets) - set(operation["targets"]))
                if "controls" in operation:
                    i_targets = list(set(i_targets) - set(operation["controls"]))

                self._apply_operation(circuit, operation, step_index)

            for each in i_targets:
                circuit.id(each)

            if step_index == until_step_index:
                circuit.save_statevector(label=self._STATEVECTOR_LABEL)

        return circuit

    def _apply_operation(self, circuit: QuantumCircuit, operation: dict, step_index: int):
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
            self.measured_bits[step_index] = {target: None for target in operation["targets"]}
            creg = ClassicalRegister(circuit.num_qubits)
            circuit.add_register(creg)
            for target in operation["targets"]:
                circuit.measure(target, creg[target])
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

    def _run_backend(self, circuit: QuantumCircuit):
        backend = Aer.get_backend("aer_simulator_statevector")
        return backend.run(circuit, shots=1, memory=True).result()

    def _get_statevector(self, result) -> list | None:
        return result.data()[self._STATEVECTOR_LABEL]
