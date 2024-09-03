import unittest

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestWrite1(unittest.TestCase):
    def setUp(self):
        self.cirq_runner = CirqRunner()

    def test_build_circuit(self):
        step = [
            [{"type": "|1>", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "reset(q(0))"
        assert str(circuit[1].operations[0]) == "X(q(0))"

    # Write1|0⟩=|1>
    def test_Write1_0(self):
        steps = [
            [{"type": "|1>", "targets": [0]}],
        ]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)

    # Write1|1⟩=|1>
    def test_Write1_1(self):
        steps = [
            [{"type": "X", "targets": [0]}],
            [{"type": "|1>", "targets": [0]}],
        ]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)
