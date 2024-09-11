import unittest

from src.qiskit_runner import QiskitRunner
from tests.conftest import assert_complex_approx


class TestI(unittest.TestCase):
    def setUp(self):
        self.qiskit_runner = QiskitRunner()

    # I|0⟩=|0⟩
    def test_i_0(self):
        steps = [[]]

        result = self.qiskit_runner.run_circuit(steps, options={"qubit_count": 1})

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)

    # I|1⟩=|1⟩
    def test_i_1(self):
        steps = [[{"type": "X", "targets": [0]}], []]

        result = self.qiskit_runner.run_circuit(steps)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)
