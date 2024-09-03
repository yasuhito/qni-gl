import unittest

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestH(unittest.TestCase):
    def setUp(self):
        self.cirq_runner = CirqRunner()

    def test_build_circuit(self):
        step = [
            [{"type": "X", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "X(q(0))"

    # X|0⟩=|1⟩
    def test_x_0(self):
        steps = [[{"type": "X", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)

    # X|1⟩=|0⟩
    def test_x_1(self):
        steps = [[{"type": "X", "targets": [0]}],
                 [{"type": "X", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
