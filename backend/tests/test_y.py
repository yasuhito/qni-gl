import unittest

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestY(unittest.TestCase):
    def setUp(self):
        self.cirq_runner = CirqRunner()

    # Y|0⟩=i|1⟩
    def test_y_0(self):
        steps = [[{"type": "Y", "targets": [0]}]]

        result = self.cirq_runner.run_circuit(steps)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 1)

    # Y|1⟩=-i|0⟩
    def test_y_1(self):
        steps = [[{"type": "X", "targets": [0]}], [{"type": "Y", "targets": [0]}]]

        result = self.cirq_runner.run_circuit(steps)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, -1)
        assert_complex_approx(amplitudes[1], 0, 0)
