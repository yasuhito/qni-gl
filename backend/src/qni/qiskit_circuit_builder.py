from __future__ import annotations

from collections.abc import Callable
from typing import TypedDict, cast

from qiskit import (  # type: ignore
    ClassicalRegister,
    QuantumCircuit,  # type: ignore
)
from qiskit.circuit.library import (  # type: ignore
    HGate,
    SdgGate,
    SGate,
    TdgGate,
    TGate,
    XGate,
    YGate,
    ZGate,
)


class BasicOperation(TypedDict):
    type: str
    targets: list[int]


class ControllableOperation(TypedDict):
    type: str
    targets: list[int]
    controls: list[int]


OperationMethod = Callable[
    [QuantumCircuit, BasicOperation | ControllableOperation], None,
]


class QiskitCircuitBuilder:
    _PAIR_OPERATION_COUNT = 2

    def build_circuit_for_export(
        self,
        steps: list,
        qubit_count: int,
    ) -> QuantumCircuit:
        circuit = QuantumCircuit(qubit_count)

        for step in steps:
            if len(step) == 0:
                circuit.id(list(range(qubit_count)))

            for operation in step:
                self.apply_operation(circuit, operation)

        return circuit

    def apply_operation(
        self, circuit: QuantumCircuit, operation: BasicOperation | ControllableOperation,
    ) -> None:
        operation_type = operation["type"]
        operation_methods: dict[str, OperationMethod] = {
            "H": self._apply_h_operation,
            "X": self._apply_x_operation,
            "Y": self._apply_y_operation,
            "Z": self._apply_z_operation,
            "X^½": self._apply_rnot_operation,
            "S": self._apply_s_operation,
            "S†": self._apply_s_dagger_operation,
            "T": self._apply_t_operation,
            "T†": self._apply_t_dagger_operation,
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

    class UnknownOperationError(ValueError):
        """Raised when an unknown operation is specified.

        Attributes:
            operation_type (str): The type of the unknown operation.

        """

        def __init__(self, operation_type):
            super().__init__(f"Unknown operation: {operation_type}")

    def _apply_h_operation(
        self, circuit: QuantumCircuit, operation: BasicOperation | ControllableOperation,
    ) -> None:
        if "controls" in operation:
            self._apply_controlled_u(circuit, operation, HGate())
        else:
            circuit.h(operation["targets"])

    def _apply_x_operation(
        self, circuit: QuantumCircuit, operation: BasicOperation | ControllableOperation,
    ) -> None:
        if "controls" in operation:
            operation = cast("ControllableOperation", operation)
            for target in operation["targets"]:
                circuit.mcx(operation["controls"], target)
        else:
            circuit.x(operation["targets"])

    def _apply_y_operation(
        self, circuit: QuantumCircuit, operation: BasicOperation | ControllableOperation,
    ) -> None:
        if "controls" in operation:
            self._apply_controlled_u(circuit, operation, YGate())
        else:
            circuit.y(operation["targets"])

    def _apply_z_operation(
        self, circuit: QuantumCircuit, operation: BasicOperation | ControllableOperation,
    ) -> None:
        if "controls" in operation:
            self._apply_controlled_u(circuit, operation, ZGate())
        else:
            circuit.z(operation["targets"])

    def _apply_rnot_operation(
        self, circuit: QuantumCircuit, operation: BasicOperation | ControllableOperation,
    ) -> None:
        if "controls" in operation:
            self._apply_controlled_u(circuit, operation, XGate().power(1 / 2))
        else:
            circuit.append(XGate().power(1 / 2), qargs=operation["targets"])

    def _apply_s_operation(
        self, circuit: QuantumCircuit, operation: BasicOperation | ControllableOperation,
    ) -> None:
        if "controls" in operation:
            self._apply_controlled_u(circuit, operation, SGate())
        else:
            circuit.s(operation["targets"])

    def _apply_s_dagger_operation(
        self, circuit: QuantumCircuit, operation: BasicOperation | ControllableOperation,
    ) -> None:
        if "controls" in operation:
            self._apply_controlled_u(circuit, operation, SdgGate())
        else:
            circuit.sdg(operation["targets"])

    def _apply_t_operation(
        self, circuit: QuantumCircuit, operation: BasicOperation | ControllableOperation,
    ) -> None:
        if "controls" in operation:
            self._apply_controlled_u(circuit, operation, TGate())
        else:
            circuit.t(operation["targets"])

    def _apply_t_dagger_operation(
        self, circuit: QuantumCircuit, operation: BasicOperation | ControllableOperation,
    ) -> None:
        if "controls" in operation:
            self._apply_controlled_u(circuit, operation, TdgGate())
        else:
            circuit.tdg(operation["targets"])

    def _apply_swap_operation(
        self, circuit: QuantumCircuit, operation: BasicOperation,
    ) -> None:
        if len(operation["targets"]) == self._PAIR_OPERATION_COUNT:
            circuit.swap(operation["targets"][0], operation["targets"][1])
        else:
            circuit.id(operation["targets"])

    def _apply_controlled_z_operation(
        self, circuit: QuantumCircuit, operation: BasicOperation,
    ) -> None:
        if len(operation["targets"]) >= self._PAIR_OPERATION_COUNT:
            u = ZGate().control(num_ctrl_qubits=len(operation["targets"]) - 1)
            circuit.append(u, qargs=operation["targets"])
        else:
            circuit.id(operation["targets"])

    def _apply_write0(self, circuit: QuantumCircuit, operation: BasicOperation) -> None:
        circuit.reset(operation["targets"])

    def _apply_write1(self, circuit: QuantumCircuit, operation: BasicOperation) -> None:
        circuit.reset(operation["targets"])
        circuit.x(operation["targets"])

    def _apply_measure_operation(
        self, circuit: QuantumCircuit, operation: BasicOperation,
    ) -> None:
        creg = ClassicalRegister(circuit.num_qubits)
        circuit.add_register(creg)
        for target in operation["targets"]:
            circuit.measure(target, creg[target])

    def _apply_controlled_u(
        self,
        circuit: QuantumCircuit,
        operation: BasicOperation | ControllableOperation,
        gate,
    ) -> None:
        operation = cast("ControllableOperation", operation)
        u = gate.control(num_ctrl_qubits=len(operation["controls"]))
        for target in operation["targets"]:
            circuit.append(u, qargs=operation["controls"] + [target])
