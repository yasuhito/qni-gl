import unittest

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestRnot(unittest.TestCase):
    def setUp(self):
        self.cirq_runner = CirqRunner()

    def test_build_circuit(self):
        step = [
            [{"type": "X^½", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "X**0.5(q(0))"

    # X^½|0⟩=1/2((1+i)|0⟩+(1-i)|1⟩)
    def test_rnot_0(self):
        steps = [[{"type": "X^½", "targets": [0]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, steps, measurements)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1 / 2, 1 / 2)
        assert_complex_approx(amplitudes[1], 1 / 2, -1 / 2)

    # X^½|1⟩=1/2((1-i)|0⟩+(1+i)|1⟩)
    def test_rnot_1(self):
        steps = [[{"type": "X", "targets": [0]}], [{"type": "X^½", "targets": [0]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, steps, measurements)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 1 / 2, -1 / 2)
        assert_complex_approx(amplitudes[1], 1 / 2, 1 / 2)
