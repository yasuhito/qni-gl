import unittest
from math import sqrt

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestH(unittest.TestCase):
    def setUp(self):
        self.cirq_runner = CirqRunner()

    # H|0⟩=1/√2(|0⟩+|1⟩)
    def test_h_0(self):
        steps = [
            [{"type": "H", "targets": [0]}],
        ]

        result = self.cirq_runner.run_circuit(steps)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1 / sqrt(2), 0)
        assert_complex_approx(amplitudes[1], 1 / sqrt(2), 0)

    # H|1⟩=1/√2(|0⟩-|1⟩)
    def test_h_1(self):
        steps = [
            [{"type": "X", "targets": [0]}],
            [{"type": "H", "targets": [0]}],
        ]

        result = self.cirq_runner.run_circuit(steps)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 1 / sqrt(2), 0)
        assert_complex_approx(amplitudes[1], -1 / sqrt(2), 0)
