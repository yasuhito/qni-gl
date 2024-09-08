import unittest

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestI(unittest.TestCase):
    def setUp(self):
        self.cirq_runner = CirqRunner()

    # I|0⟩=|0⟩
    def test_i_0(self):
        steps = [[]]

        result = self.cirq_runner.run_circuit(steps, 1)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)

    # I|1⟩=|1⟩
    def test_i_1(self):
        steps = [[{"type": "X", "targets": [0]}], []]

        result = self.cirq_runner.run_circuit(steps)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)
