import unittest

from src.cirq_runner import CirqRunner
from src.write0 import Write0
from tests.conftest import assert_complex_approx


class TestWrite0(unittest.TestCase):
    def setUp(self):
        self.cirq_runner = CirqRunner()

    def test_str(self):
        w = Write0()
        assert str(w) == "|0>"

    def test_repr(self):
        w = Write0()
        assert repr(w) == "Write0()"

    # Write0|0⟩=|0>
    def test_write0_0(self):
        steps = [
            [{"type": "|0>", "targets": [0]}],
        ]

        result = self.cirq_runner.run_circuit(steps)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)

    # Write0|1⟩=|0>
    def test_write0_1(self):
        steps = [
            [{"type": "X", "targets": [0]}],
            [{"type": "|0>", "targets": [0]}],
        ]

        result = self.cirq_runner.run_circuit(steps)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
