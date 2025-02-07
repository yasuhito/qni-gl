from __future__ import annotations

from qiskit.qasm3 import dumps  # type: ignore
from qiskit import QuantumCircuit  # type: ignore

from qni.qiskit_runner import QiskitRunner  

class QiskitCircuitBuilder:
    def build_circuit_for_export(self, steps: list, qubit_count: int) -> QuantumCircuit:
        circuit = QuantumCircuit(qubit_count)

        for step_index, step in enumerate(steps):
            if len(step) == 0:
                circuit.id(list(range(qubit_count)))

            for operation in step:
                QiskitRunner()._apply_operation(circuit, operation)  

        return circuit

    def convert_to_qasm3(self, circuit: QuantumCircuit) -> str:
        return dumps(circuit)
    