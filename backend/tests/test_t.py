import unittest
from math import sqrt

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestT(unittest.TestCase):
    def setUp(self):
        self.cirq_runner = CirqRunner()

    def test_build_circuit(self):
        step = [
            [{"type": "T", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "T(q(0))"

    # T|0⟩=|0⟩
    def test_t_0(self):
        steps = [[{"type": "T", "targets": [0]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, measurements)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)

    # T|1⟩=exp(iπ/4)|1⟩
    def test_t_1(self):
        steps = [[{"type": "X", "targets": [0]}], [{"type": "T", "targets": [0]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, measurements)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], sqrt(2) / 2, sqrt(2) / 2)
