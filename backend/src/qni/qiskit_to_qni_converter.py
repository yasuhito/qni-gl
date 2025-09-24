"""Module for converting Qiskit QuantumCircuit objects to Qni's cols/steps
representation.
"""

from qiskit import QuantumCircuit
from qiskit.converters import circuit_to_dag

QISKIT_TO_QNI_GATE = {
    "H": "H",
    "X": "X",
    "Y": "Y",
    "Z": "Z",
    "SX": "X^½",
    "S": "S",
    "SDG": "S†",
    "T": "T",
    "TDG": "T†",
    "SWAP": "Swap",
    "MEASURE": "Measure",
}


def _map_controlled_gate(op_type: str) -> str | None:
    """Map Qiskit controlled gate names to Qni gate names.

    Returns:
        str | None: Qni gate name or None

    """
    gate_map = {
        "CX": "X",
        "CY": "Y",
        "CZ": "Z",
        "CH": "H",
        "CS": "S",
        "CSDG": "S†",
        "CT": "T",
        "CTDG": "T†",
        "CSX": "X^½",
    }
    return gate_map.get(op_type)


def convert_qiskit_circuit_to_qni(
    qc: QuantumCircuit,
) -> tuple[list[list[dict]], list[list[str | None]], int]:
    """Convert a Qiskit QuantumCircuit to Qni's cols/steps representation.

    Returns:
        tuple[list[list[dict]], list[list[str | None]], int]: (steps, cols, num_qubits)

    """
    num_qubits = qc.num_qubits
    dag = circuit_to_dag(qc)
    pending_reset = [False] * num_qubits

    circuit_cols = []
    circuit_steps = []

    for layer in dag.layers():
        column, operations_in_step = _build_column_for_layer(
            layer, qc, num_qubits, pending_reset
        )

        if any(x is not None for x in column):
            circuit_cols.append(column)
            circuit_steps.append(operations_in_step)

    return circuit_steps, circuit_cols, num_qubits


def _build_column_for_layer(
    layer: dict,
    qc: QuantumCircuit,
    num_qubits: int,
    pending_reset: list[bool],
) -> tuple[list[str | None], list[dict]]:
    """Build a single column (time slice) for the given DAG layer.

    Handles multi-controlled, controlled, and single-qubit gates,
    as well as resets and pending resets.

    Returns:
        tuple[list[str | None], list[dict]]: (column, operations_in_step)

    """
    column = [None for _ in range(num_qubits)]
    operations_in_step = []
    processed_qubits: set[int] = set()

    _handle_multi_and_controlled_gates(
        layer, qc, column, operations_in_step, processed_qubits
    )

    _handle_single_qubit_gates_and_reset(
        layer, qc, column, operations_in_step, processed_qubits, pending_reset
    )

    _finalize_pending_resets(column, operations_in_step, pending_reset)

    return column, operations_in_step


def _handle_multi_and_controlled_gates(
    layer: dict,
    qc: QuantumCircuit,
    column: list[str | None],
    operations_in_step: list[dict],
    processed_qubits: set[int],
) -> None:
    """Handle multi-controlled gates, 2-qubit controlled gates, and SWAP gates."""
    for node in layer["graph"].op_nodes():
        op_type = node.op.name.upper()
        qargs = [qc.qubits.index(q) for q in node.qargs]

        # Multi-controlled gates
        if hasattr(node.op, "num_ctrl_qubits") and node.op.num_ctrl_qubits > 0:
            ctrl_count = node.op.num_ctrl_qubits
            controls = qargs[:ctrl_count]
            targets = qargs[ctrl_count:]
            gate_name = getattr(node.op, "base_gate", node.op).name.upper()
            qni_gate = QISKIT_TO_QNI_GATE.get(gate_name, gate_name)

            for ctrl in controls:
                column[ctrl] = "•"
                processed_qubits.add(ctrl)
                operations_in_step.append({
                    "type": "•",
                    "targets": [ctrl],
                    "controls": [],
                })

            for tgt in targets:
                column[tgt] = qni_gate
                processed_qubits.add(tgt)
                operations_in_step.append({
                    "type": qni_gate,
                    "targets": [tgt],
                    "controls": controls,
                })

            continue

        # MCX/CCX (Toffoli etc.)
        if op_type in {"MCX", "CCX"}:
            controls = qargs[:-1]
            target = qargs[-1]

            for ctrl in controls:
                column[ctrl] = "•"
                processed_qubits.add(ctrl)
                operations_in_step.append({
                    "type": "•",
                    "targets": [ctrl],
                    "controls": [],
                })

            column[target] = "X"
            processed_qubits.add(target)
            operations_in_step.append({
                "type": "X",
                "targets": [target],
                "controls": controls,
            })

            continue

        # 2-qubit controlled gates (CX, CY, etc.)
        qni_gate = _map_controlled_gate(op_type)
        num_qubits_for_controlled_gate = 2
        if qni_gate and len(qargs) == num_qubits_for_controlled_gate:
            ctrl, tgt = qargs
            column[ctrl] = "•"
            column[tgt] = qni_gate
            processed_qubits.update([ctrl, tgt])
            operations_in_step.extend([
                {"type": "•", "targets": [ctrl], "controls": []},
                {"type": qni_gate, "targets": [tgt], "controls": [ctrl]},
            ])
            continue

        # SWAP
        if op_type == "SWAP":
            for q in qargs:
                column[q] = "Swap"
                processed_qubits.add(q)
                operations_in_step.append({"type": "Swap", "targets": [q]})
            continue


def _handle_reset_gates(
    op_type: str,
    qargs: list[int],
    pending_reset: list[bool],
) -> bool:
    """Handle RESET gates.

    Returns:
        bool: True if handled, False otherwise.

    """
    if op_type == "RESET":
        for q in qargs:
            pending_reset[q] = True
        return True
    return False


def _handle_x_gates(
    op_type: str,
    qargs: list[int],
    column: list[str | None],
    operations_in_step: list[dict],
    pending_reset: list[bool],
) -> bool:
    """Handle X gates and X after RESET.

    Returns:
        bool: True if handled, False otherwise.

    """
    if op_type == "X":
        for q in qargs:
            if pending_reset[q]:
                gate = "|1>"
                pending_reset[q] = False
            else:
                gate = "X"
            column[q] = gate
            operations_in_step.append({"type": gate, "targets": [q]})
        return True
    return False


def _handle_pending_reset_gates(
    qargs: list[int],
    column: list[str | None],
    operations_in_step: list[dict],
    pending_reset: list[bool],
) -> None:
    """Handle RESET gates."""
    for q in qargs:
        if pending_reset[q]:
            gate = "|0>"
            pending_reset[q] = False
            column[q] = gate
            operations_in_step.append({"type": gate, "targets": [q]})


def _handle_other_single_qubit_gates(
    op_type: str,
    qargs: list[int],
    column: list[str | None],
    operations_in_step: list[dict],
) -> None:
    """Handle X gates and X after RESET."""
    gate = QISKIT_TO_QNI_GATE.get(op_type)
    if gate:
        for q in qargs:
            column[q] = gate
            operations_in_step.append({"type": gate, "targets": [q]})


def _handle_single_qubit_gates_and_reset(
    layer: dict,
    qc: QuantumCircuit,
    column: list[str | None],
    operations_in_step: list[dict],
    processed_qubits: set[int],
    pending_reset: list[bool],
) -> None:
    """Handle single-qubit gates and reset/X logic, including pending resets."""
    for node in layer["graph"].op_nodes():
        op_type = node.op.name.upper()
        qargs = [qc.qubits.index(q) for q in node.qargs]
        if any(q in processed_qubits for q in qargs):
            continue

        if _handle_reset_gates(op_type, qargs, pending_reset):
            continue

        if _handle_x_gates(op_type, qargs, column, operations_in_step, pending_reset):
            continue

        _handle_pending_reset_gates(qargs, column, operations_in_step, pending_reset)
        _handle_other_single_qubit_gates(op_type, qargs, column, operations_in_step)


def _finalize_pending_resets(
    column: list[str | None],
    operations_in_step: list[dict],
    pending_reset: list[bool],
) -> None:
    """After all gates in the layer, finalize any remaining pending resets as |0>."""
    for q, pending in enumerate(pending_reset):
        if pending:
            column[q] = "|0>"
            operations_in_step.append({"type": "|0>", "targets": [q]})
            pending_reset[q] = False


def cols_to_steps(
    cols: list[list[str | int | None]],
) -> list[list[dict]]:
    """Convert Qni's cols representation to a list of step dictionaries.

    for simulation/export.

    Each step is a list of operation dictionaries,

    with optional "controls" for controlled gates.

    Args:
        cols (list[list[str | int | None]]): Qni column representation.

    Returns:
        list[list[dict]]: List of steps,

        each step is a list of operation dicts.

    """
    steps = []
    for col in cols:
        controls = [i for i, v in enumerate(col) if v == "•"]
        step = []
        for idx, gate in enumerate(col):
            if gate is None or gate in {"•", 1}:
                continue
            op = {"type": gate, "targets": [idx]}
            if controls:
                op["controls"] = controls
            step.append(op)
        steps.append(step)
    return steps
