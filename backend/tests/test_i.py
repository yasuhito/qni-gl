import unittest
from math import sqrt

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestH(unittest.TestCase):
    def setUp(self):
        self.cirq_runner = CirqRunner()

    def test_build_circuit(self):
        step = [[]]

        circuit, _ = self.cirq_runner.build_circuit(step, 1)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "I(q(0))"

    def test_build_circuit_with_two_ids(self):
        step = [[]]

        circuit, _ = self.cirq_runner.build_circuit(step, 2)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]) == "I(q(0))"
        assert str(circuit[0].operations[1]) == "I(q(1))"

    # I|0⟩=|0⟩
    def test_i_0(self):
        steps = [[]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps, 1)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)

    # I|1⟩=|1⟩
    def test_i_1(self):
        steps = [[{"type": "X", "targets": [0]}],
                 []]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)
