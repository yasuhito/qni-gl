from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from qiskit.result import Result

from qiskit import ClassicalRegister, QuantumCircuit
from qiskit.circuit.library import Measure, XGate, ZGate
from qiskit_aer import Aer


class QiskitRunner:
    _PAIR_OPERATION_COUNT = 2
    _STATEVECTOR_LABEL = "state_at_until_step"

    def __init__(self, logger=None):
        self.logger = logger
        self.circuit = None
        self.steps = []

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

        self.steps = steps
        self.circuit, measured_bits = self._build_circuit(qubit_count=qubit_count, until_step_index=until_step_index)

        if self.logger:
            self.logger.debug(self.circuit.draw(output="text"))

        if self.circuit.depth() == 0:
            return step_results

        result = self._run_backend()
        statevector = self._get_statevector(result)
        measured_bits = self._extract_measurement_results(result, measured_bits)

        if until_step_index is None:
            until_step_index = self._last_step_index()

        for step_index in range(len(self.steps)):
            step_result = {":measuredBits": measured_bits[step_index]}
            if step_index == until_step_index:
                step_result[":amplitude"] = statevector
            step_results.append(step_result)

        if amplitude_indices is None:
            return step_results

        return self._filter_amplitudes(step_results, amplitude_indices)

    def _build_circuit(
        self, *, qubit_count: int | None = None, until_step_index: int | None = None
    ) -> tuple[QuantumCircuit, list[dict]]:
        if qubit_count is None:
            qubit_count = self._get_qubit_count()

        if until_step_index is None:
            until_step_index = self._last_step_index()

        return self._process_step_operations(qubit_count, until_step_index)

    def _filter_amplitudes(self, step_results: list[dict], amplitude_indices: list[int]) -> list[dict]:
        for step_result in step_results:
            amplitudes = step_result.get(":amplitude")
            if amplitudes is not None:
                filtered_amplitudes = {index: amplitudes[index] for index in amplitude_indices}
                step_result[":amplitude"] = filtered_amplitudes

        return step_results

    def _last_step_index(self) -> int:
        if len(self.steps) == 0:
            return 0
        return len(self.steps) - 1

    def _get_qubit_count(self) -> int:
        return (
            max(
                max((max(gate.get("targets", [-1])) for step in self.steps for gate in step), default=-1),
                max((max(gate.get("controls", [-1])) for step in self.steps for gate in step), default=-1),
            )
            + 1
        )

    def _process_step_operations(self, qubit_count: int, until_step_index: int) -> tuple[QuantumCircuit, list[dict]]:
        circuit = QuantumCircuit(qubit_count)
        measured_bits = []

        for step_index, step in enumerate(self.steps):
            i_targets = list(range(qubit_count))
            measured_bits.append({})

            for operation in step:
                i_targets = list(set(i_targets) - set(operation["targets"]))
                if "controls" in operation:
                    i_targets = list(set(i_targets) - set(operation["controls"]))

                measured_bits = self._apply_operation(circuit, operation, step_index, measured_bits)

            for each in i_targets:
                circuit.id(each)

            if step_index == until_step_index:
                circuit.save_statevector(label=self._STATEVECTOR_LABEL)

        return circuit, measured_bits

    def _apply_operation(
        self, circuit: QuantumCircuit, operation: dict, step_index: int, measured_bits: list[dict]
    ) -> list[dict]:
        measured_bits_copy = measured_bits.copy()

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
            measured_bits_copy = self._apply_measure_operation(circuit, operation, step_index, measured_bits_copy)
        else:
            msg = "Unknown operation: {}".format(operation["type"])
            raise ValueError(msg)

        return measured_bits_copy

    def _apply_measure_operation(
        self, circuit: QuantumCircuit, operation: dict, step_index: int, measured_bits: list[dict]
    ) -> list[dict]:
        measured_bits_copy = measured_bits.copy()
        measured_bits_copy[step_index] = {target: None for target in operation["targets"]}

        creg = ClassicalRegister(circuit.num_qubits)
        circuit.add_register(creg)
        for target in operation["targets"]:
            circuit.measure(target, creg[target])

        return measured_bits_copy

    def _apply_x_operation(self, circuit: QuantumCircuit, operation: dict) -> None:
        if "controls" in operation:
            for target in operation["targets"]:
                circuit.mcx(operation["controls"], target)
        else:
            circuit.x(operation["targets"])

    def _apply_swap_operation(self, circuit: QuantumCircuit, operation: dict) -> None:
        if len(operation["targets"]) == self._PAIR_OPERATION_COUNT:
            circuit.swap(operation["targets"][0], operation["targets"][1])
        else:
            circuit.id(operation["targets"])

    def _apply_controlled_z_operation(self, circuit: QuantumCircuit, operation: dict) -> None:
        if len(operation["targets"]) >= self._PAIR_OPERATION_COUNT:
            u = ZGate().control(num_ctrl_qubits=len(operation["targets"]) - 1)
            circuit.append(u, qargs=operation["targets"])
        else:
            circuit.id(operation["targets"])

    def _run_backend(self) -> Result:
        backend = Aer.get_backend("aer_simulator_statevector")
        return backend.run(self.circuit, shots=1, memory=True).result()

    def _get_statevector(self, result: Result) -> list | None:
        return result.data()[self._STATEVECTOR_LABEL]

    def _extract_measurement_results(self, result: Result, measured_bits: list[dict]) -> list[dict]:
        if not self._circuit_has_measurements():
            return measured_bits

        measured_bits_copy = measured_bits.copy()
        count = next(iter(result.get_counts().keys()))
        bit_strings = count.split()

        for each in measured_bits_copy:
            if len(each) == 0:
                continue

            bit_string = bit_strings.pop()
            for bit in each:
                each[bit] = int(bit_string[len(bit_string) - bit - 1])

        return measured_bits_copy

    def _circuit_has_measurements(self) -> bool:
        return any(isinstance(instr.operation, Measure) for instr in self.circuit.data)
