import unittest
from math import sqrt

import pytest

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestCirqRunner(unittest.TestCase):
    def setUp(self):
        self.logger = None
        self.cirq_runner = CirqRunner(self.logger)

    def test_initialization(self):
        assert self.cirq_runner is not None

    def test_build_circuit_with_controlled_x_gate(self):
        qubit_count = 2
        step = [
            [{"type": "X", "targets": [0], "controls": [1]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]) == "CX(q(0), q(1))"

    def test_build_circuit_with_two_controlled_x_gates(self):
        qubit_count = 3
        step = [
            [{"type": "X", "targets": [0], "controls": [1, 2]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 3
        assert str(circuit[0].operations[0]) == "CCX(q(0), q(1), q(2))"

    def test_build_circuit_with_rnot_gate(self):
        qubit_count = 1
        step = [
            [{"type": "X^½", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "X**0.5(q(0))"

    def test_build_circuit_with_s_gate(self):
        qubit_count = 1
        step = [
            [{"type": "S", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "S(q(0))"

    def test_build_circuit_with_s_dagger_gate(self):
        qubit_count = 1
        step = [
            [{"type": "S†", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "S**-1(q(0))"

    def test_build_circuit_with_t_gate(self):
        qubit_count = 1
        step = [
            [{"type": "T", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "T(q(0))"

    def test_build_circuit_with_t_dagger_gate(self):
        qubit_count = 1
        step = [
            [{"type": "T†", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "T**-1(q(0))"

    def test_build_circuit_with_two_swap_gates(self):
        qubit_count = 2
        step = [
            [{"type": "Swap", "targets": [0, 1]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]) == "SWAP(q(0), q(1))"

    def test_build_circuit_with_one_swap_gate(self):
        qubit_count = 1
        step = [
            [{"type": "Swap", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1

    def test_build_circuit_with_three_swap_gates(self):
        qubit_count = 3
        step = [
            [{"type": "Swap", "targets": [0, 1, 2]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 3

    def test_build_circuit_with_two_control_gates(self):
        qubit_count = 2
        step = [
            [{"type": "•", "targets": [0, 1]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]) == "CZ(q(0), q(1))"

    def test_build_circuit_with_one_control_gate(self):
        qubit_count = 1
        step = [
            [{"type": "•", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1

    def test_build_circuit_with_three_control_gates(self):
        qubit_count = 3
        step = [
            [{"type": "•", "targets": [0, 1, 2]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 3
        assert str(circuit[0].operations[0]) == "CCZ(q(0), q(1), q(2))"

    def test_build_circuit_with_four_control_gates(self):
        qubit_count = 4
        step = [
            [{"type": "•", "targets": [0, 1, 2, 3]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 4
        assert str(circuit[0].operations[0]) == "CCCZ(q(0), q(1), q(2), q(3))"

    def test_build_circuit_with_write0_gate(self):
        qubit_count = 1
        step = [
            [{"type": "|0>", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "reset(q(0))"

    def test_build_circuit_with_write1_gate(self):
        qubit_count = 1
        step = [
            [{"type": "|1>", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "reset(q(0))"
        assert str(circuit[1].operations[0]) == "X(q(0))"

    def test_build_circuit_with_measurement_gate(self):
        qubit_count = 1
        step = [
            [{"type": "Measure", "targets": [0]}],
        ]

        circuit, measurements = self.cirq_runner.build_circuit(
            qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]
                   ) == "cirq.MeasurementGate(1, cirq.MeasurementKey(name='m0'), ())(q(0))"
        assert str(measurements) == "[[[['m0', 0]]]]"

    def test_build_circuit_with_two_measurement_gates(self):
        qubit_count = 2
        step = [
            [{"type": "Measure", "targets": [0, 1]}],
        ]

        circuit, measurements = self.cirq_runner.build_circuit(
            qubit_count, step)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]
                   ) == "cirq.MeasurementGate(1, cirq.MeasurementKey(name='m0'), ())(q(0))"
        assert str(circuit[0].operations[1]
                   ) == "cirq.MeasurementGate(1, cirq.MeasurementKey(name='m1'), ())(q(1))"
        assert str(measurements) == "[[[['m0', 0], ['m1', 1]]]]"

    def test_build_circuit_with_unknown_operation(self):
        qubit_count = 1
        step = [
            [{"type": "UnknownGate", "targets": [0]}],
        ]

        with pytest.raises(ValueError, match="Unknown operation: UnknownGate"):
            self.cirq_runner.build_circuit(qubit_count, step)

    def test_build_circuit_with_empty_step(self):
        qubit_count = 2
        step = [[]]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]) == "I(q(0))"
        assert str(circuit[0].operations[1]) == "I(q(1))"

    def test_run_circuit_with_h_gate(self):
        steps = [[{"type": "H", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 0, steps, [0, 1])

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1 / sqrt(2), 0)
        assert_complex_approx(amplitudes[1], 1 / sqrt(2), 0)

    # X^½|0⟩=1/2((1+i)|0⟩+(1-i)|1⟩)
    def test_rnot_0ket(self):
        steps = [[{"type": "X^½", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 0, steps, [0, 1])

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1 / 2, 1 / 2)
        assert_complex_approx(amplitudes[1], 1 / 2, -1 / 2)

    # X^½|1⟩=1/2((1-i)|0⟩+(1+i)|1⟩)
    def test_rnot_1ket(self):
        steps = [[{"type": "X", "targets": [0]}],
                 [{"type": "X^½", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1])

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 1 / 2, -1 / 2)
        assert_complex_approx(amplitudes[1], 1 / 2, 1 / 2)

    # S|0⟩=|0⟩
    def test_s_0ket(self):
        steps = [[{"type": "S", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 0, steps, [0, 1])

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)

    # S|1⟩=i|1⟩
    def test_s_1ket(self):
        steps = [[{"type": "X", "targets": [0]}],
                 [{"type": "S", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1])

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 1)

    # S†|0⟩=|0⟩
    def test_s_dagger_0ket(self):
        steps = [[{"type": "S†", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 0, steps, [0, 1])

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)

    # S†|1⟩=-i|1⟩
    def test_s_dagger_1ket(self):
        steps = [[{"type": "X", "targets": [0]}],
                 [{"type": "S†", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1])

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, -1)

    # T|0⟩=|0⟩
    def test_t_0ket(self):
        steps = [[{"type": "T", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 0, steps, [0, 1])

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)

    # T|1⟩=exp(iπ/4)|1⟩
    def test_t_1ket(self):
        steps = [[{"type": "X", "targets": [0]}],
                 [{"type": "T", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1])

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], sqrt(2) / 2, sqrt(2) / 2)

    # T†|0⟩=|0⟩
    def test_t_dagger_0ket(self):
        steps = [[{"type": "T†", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 0, steps, [0, 1])

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)

    # T†|1⟩=exp(-iπ/4)|1⟩
    def test_t_dagger_1ket(self):
        steps = [[{"type": "X", "targets": [0]}],
                 [{"type": "T†", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1])

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], sqrt(2) / 2, -sqrt(2) / 2)

    # Swap|0⟩=|0⟩
    def test_swap_0ket(self):
        steps = [[{"type": "Swap", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 0, steps, [0, 1])

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)

    # Control|0⟩
    def test_control_0ket(self):
        steps = [[{"type": "•", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 0, steps, [0, 1])

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)

    # Control|1⟩
    def test_control_1ket(self):
        steps = [[{"type": "X", "targets": [0]}],
                 [{"type": "•", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1])

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)

    def test_cnot_00ket(self):
        steps = [[{"type": "X", "targets": [1], "controls": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(2, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 0, steps, [0, 1, 2, 3])

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    def test_cnot_01ket(self):
        steps = [[{"type": "X", "targets": [0]}], [
            {"type": "X", "targets": [1], "controls": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(2, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1, 2, 3])

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 1, 0)

    def test_cnot_10ket(self):
        steps = [[{"type": "X", "targets": [1]}], [
            {"type": "X", "targets": [1], "controls": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(2, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1, 2, 3])

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 1, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    def test_cnot_11ket(self):
        steps = [[{"type": "X", "targets": [0, 1]}], [
            {"type": "X", "targets": [1], "controls": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(2, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1, 2, 3])

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    def test_ccnot_000ket(self):
        steps = [[{"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(3, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 0, steps, [0, 1, 2, 3, 4, 5, 6, 7]
        )

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_ccnot_001ket(self):
        steps = [[{"type": "X", "targets": [0]}], [
            {"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(3, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1, 2, 3, 4, 5, 6, 7]
        )

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_ccnot_010ket(self):
        steps = [[{"type": "X", "targets": [1]}], [
            {"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(3, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1, 2, 3, 4, 5, 6, 7]
        )

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 1, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_ccnot_011ket(self):
        steps = [[{"type": "X", "targets": [0, 1]}], [
            {"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(3, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1, 2, 3, 4, 5, 6, 7]
        )

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 1, 0)

    def test_ccnot_100ket(self):
        steps = [[{"type": "X", "targets": [2]}], [
            {"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(3, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1, 2, 3, 4, 5, 6, 7]
        )

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 1, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_ccnot_101ket(self):
        steps = [[{"type": "X", "targets": [0, 2]}], [
            {"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(3, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1, 2, 3, 4, 5, 6, 7]
        )

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 1, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_ccnot_110ket(self):
        steps = [[{"type": "X", "targets": [1, 2]}], [
            {"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(3, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1, 2, 3, 4, 5, 6, 7]
        )

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 1, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_ccnot_111ket(self):
        steps = [[{"type": "X", "targets": [0, 1, 2]}], [
            {"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(3, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1, 2, 3, 4, 5, 6, 7]
        )

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 1, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)


if __name__ == "__main__":
    unittest.main()
