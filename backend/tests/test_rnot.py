import unittest

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestRnot(unittest.TestCase):
    def setUp(self):
        self.logger = None
        self.cirq_runner = CirqRunner(self.logger)

    def test_build_circuit_with_rnot_gate(self):
        qubit_count = 1
        step = [
            [{"type": "X^½", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "X**0.5(q(0))"

    # X^½|0⟩=1/2((1+i)|0⟩+(1-i)|1⟩)
    def test_rnot_0(self):
        steps = [[{"type": "X^½", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1 / 2, 1 / 2)
        assert_complex_approx(amplitudes[1], 1 / 2, -1 / 2)

    # X^½|1⟩=1/2((1-i)|0⟩+(1+i)|1⟩)
    def test_rnot_1(self):
        steps = [[{"type": "X", "targets": [0]}],
                 [{"type": "X^½", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 1 / 2, -1 / 2)
        assert_complex_approx(amplitudes[1], 1 / 2, 1 / 2)
