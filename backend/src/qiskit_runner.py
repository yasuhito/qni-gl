from __future__ import annotations

from typing import TYPE_CHECKING

import numpy as np

if TYPE_CHECKING:
    from qiskit.result import Result  # type: ignore

from typing import TypedDict

from qiskit import ClassicalRegister, QuantumCircuit  # type: ignore
from qiskit.circuit.library import XGate, ZGate  # type: ignore
from qiskit_aer import AerSimulator  # type: ignore

from src.types import MeasuredBitsType, StepResultsWithoutAmplitudes, device_type

amplitude_type = complex


class StepResultsWithAmplitudes(TypedDict):
    amplitudes: list[amplitude_type]
    measuredBits: MeasuredBitsType


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
        amplitude_indices: list[int] | None = None,
        device: device_type = "CPU",
    ):
        """
        Execute the specified quantum circuit and return the results of each step.

        Args:
            steps (list): A list of steps to execute.
            qubit_count (int | None, optional): The number of qubits. Defaults to None.
            until_step_index (int | None, optional): The index of the step until which to execute. Defaults to None.
            amplitude_indices (list[int] | None, optional): The indices of the amplitudes to return. Defaults to None.
            device (str, optional): The device to use ("CPU" or "GPU"). Defaults to "CPU".

        Returns:
            list: A list containing the results of each step. Each result is a dictionary including measured bits and amplitudes.
        """
        step_results: list[StepResultsWithAmplitudes | StepResultsWithoutAmplitudes] = []

        self.steps = steps
        self.circuit = self._build_circuit(qubit_count=qubit_count, until_step_index=until_step_index)

        if self.logger:
            self.logger.debug(self.circuit.draw(output="text"))

        if self.circuit.depth() == 0:
            return step_results

        result = self._run_backend(device=device)
        statevector = self._get_statevector(result)
        measured_bits = self._extract_measurement_results(result)

        if until_step_index is None:
            until_step_index = self._last_step_index()

        for step_index in range(len(self.steps)):
            if step_index == until_step_index:
                step_results.append(
                    StepResultsWithAmplitudes(
                        measuredBits=measured_bits[step_index],
                        amplitudes=self._filter_amplitudes(statevector, amplitude_indices),
                    )
                )
            else:
                step_results.append(StepResultsWithoutAmplitudes(measuredBits=measured_bits[step_index]))

        return step_results

    def _build_circuit(self, *, qubit_count: int | None = None, until_step_index: int | None = None) -> QuantumCircuit:
        if qubit_count is None:
            qubit_count = self._get_qubit_count()

        if until_step_index is None:
            until_step_index = self._last_step_index()

        return self._process_step_operations(qubit_count, until_step_index)

    def _filter_amplitudes(
        self, statevector: list[amplitude_type], amplitude_indices: list[int] | None
    ) -> list[amplitude_type]:
        if amplitude_indices is None:
            return statevector

        return [statevector[index] for index in amplitude_indices]

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

    def _process_step_operations(self, qubit_count: int, until_step_index: int) -> QuantumCircuit:
        circuit = QuantumCircuit(qubit_count)

        for step_index, step in enumerate(self.steps):
            if len(step) == 0:
                circuit.id(list(range(qubit_count)))

            for operation in step:
                self._apply_operation(circuit, operation)

            if step_index == until_step_index:
                circuit.save_statevector(label=self._STATEVECTOR_LABEL)

        return circuit

    class UnknownOperationError(ValueError):
        def __init__(self, operation_type):
            super().__init__(f"Unknown operation: {operation_type}")

    def _apply_operation(self, circuit: QuantumCircuit, operation: dict) -> None:
        operation_type = operation["type"]
        operation_methods = {
            "H": self._apply_h_operation,
            "X": self._apply_x_operation,
            "Y": self._apply_y_operation,
            "Z": self._apply_z_operation,
            "X^½": self._apply_x_half_operation,
            "S": self._apply_s_operation,
            "S†": self._apply_sdg_operation,
            "T": self._apply_t_operation,
            "T†": self._apply_tdg_operation,
            "Swap": self._apply_swap_operation,
            "•": self._apply_controlled_z_operation,
            "|0>": self._apply_write0,
            "|1>": self._apply_write1,
            "Measure": self._apply_measure_operation,
        }

        if operation_type in operation_methods:
            operation_methods[operation_type](circuit, operation)
        else:
            raise self.UnknownOperationError(operation_type)

    def _apply_h_operation(self, circuit: QuantumCircuit, operation: dict) -> None:
        circuit.h(operation["targets"])

    def _apply_x_operation(self, circuit: QuantumCircuit, operation: dict) -> None:
        if "controls" in operation:
            for target in operation["targets"]:
                circuit.mcx(operation["controls"], target)
        else:
            circuit.x(operation["targets"])

    def _apply_y_operation(self, circuit: QuantumCircuit, operation: dict) -> None:
        circuit.y(operation["targets"])

    def _apply_z_operation(self, circuit: QuantumCircuit, operation: dict) -> None:
        circuit.z(operation["targets"])

    def _apply_x_half_operation(self, circuit: QuantumCircuit, operation: dict) -> None:
        circuit.append(XGate().power(1 / 2), operation["targets"])

    def _apply_s_operation(self, circuit: QuantumCircuit, operation: dict) -> None:
        circuit.s(operation["targets"])

    def _apply_sdg_operation(self, circuit: QuantumCircuit, operation: dict) -> None:
        circuit.sdg(operation["targets"])

    def _apply_t_operation(self, circuit: QuantumCircuit, operation: dict) -> None:
        circuit.t(operation["targets"])

    def _apply_tdg_operation(self, circuit: QuantumCircuit, operation: dict) -> None:
        circuit.tdg(operation["targets"])

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

    def _apply_write0(self, circuit: QuantumCircuit, operation: dict) -> None:
        circuit.reset(operation["targets"])

    def _apply_write1(self, circuit: QuantumCircuit, operation: dict) -> None:
        circuit.reset(operation["targets"])
        circuit.x(operation["targets"])

    def _apply_measure_operation(self, circuit: QuantumCircuit, operation: dict) -> None:
        creg = ClassicalRegister(circuit.num_qubits)
        circuit.add_register(creg)
        for target in operation["targets"]:
            circuit.measure(target, creg[target])

    def _run_backend(self, device: str) -> Result:
        backend = AerSimulator(method="statevector")
        if device == "GPU":
            backend.set_options(device="GPU", cuStateVec_enable=True)

        return backend.run(self.circuit, shots=1, memory=True).result()

    def _get_statevector(self, result: Result) -> list[amplitude_type]:
        return np.asarray(result.data().get(self._STATEVECTOR_LABEL)).tolist()

    def _extract_measurement_results(self, result: Result) -> list[MeasuredBitsType]:
        measured_bits: list[MeasuredBitsType] = [{} for _ in self.steps]

        circuit_has_measurements = any(operation["type"] == "Measure" for step in self.steps for operation in step)

        if not circuit_has_measurements:
            return measured_bits

        tmp_measured_bits = [
            {target: None for operation in step if operation["type"] == "Measure" for target in operation["targets"]}
            for step in self.steps
        ]

        bit_strings = next(iter(result.get_counts().keys())).split()

        for index, each in enumerate(tmp_measured_bits):
            if each:
                bit_string = bit_strings.pop()
                for bit in each:
                    measured_bits[index][bit] = int(bit_string[-(bit + 1)])

        return measured_bits
