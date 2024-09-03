import unittest

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestSDagger(unittest.TestCase):
    def setUp(self):
        self.logger = None
        self.cirq_runner = CirqRunner(self.logger)

    def test_build_circuit(self):
        step = [
            [{"type": "S†", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "S**-1(q(0))"

    # S†|0⟩=|0⟩
    def test_s_dagger_0(self):
        steps = [[{"type": "S†", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 0, steps, [0, 1])

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)

    # S†|1⟩=-i|1⟩
    def test_s_dagger_1(self):
        steps = [[{"type": "X", "targets": [0]}],
                 [{"type": "S†", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1])

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, -1)
