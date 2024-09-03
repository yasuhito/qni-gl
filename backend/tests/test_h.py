import unittest
from math import sqrt

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestH(unittest.TestCase):
    def setUp(self):
        self.logger = None
        self.cirq_runner = CirqRunner(self.logger)

    def test_build_circuit_with_h_gate(self):
        qubit_count = 1
        step = [
            [{"type": "H", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "H(q(0))"

    # H|0⟩=1/√2(|0⟩+|1⟩)
    def test_h_0(self):
        qubit_count = 1
        steps = [
            [{"type": "H", "targets": [0]}],
        ]
        circuit, measurement_moment = self.cirq_runner.build_circuit(
            qubit_count, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 0, steps, [0, 1])

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1 / sqrt(2), 0)
        assert_complex_approx(amplitudes[1], 1 / sqrt(2), 0)

    # H|1⟩=1/√2(|0⟩-|1⟩)
    def test_h_1(self):
        qubit_count = 1
        steps = [
            [{"type": "X", "targets": [0]}],
            [{"type": "H", "targets": [0]}],
        ]
        circuit, measurement_moment = self.cirq_runner.build_circuit(
            qubit_count, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1])

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 1 / sqrt(2), 0)
        assert_complex_approx(amplitudes[1], -1 / sqrt(2), 0)
