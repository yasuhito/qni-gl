import unittest

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestZ(unittest.TestCase):
    def setUp(self):
        self.logger = None
        self.cirq_runner = CirqRunner(self.logger)

    def test_build_circuit(self):
        qubit_count = 1
        step = [
            [{"type": "Z", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "Z(q(0))"

    # Z|0⟩=|0⟩
    def test_z_0(self):
        steps = [[{"type": "Z", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)

    # Z|1⟩=-|1⟩
    def test_z_1(self):
        steps = [[{"type": "X", "targets": [0]}],
                 [{"type": "Z", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], -1, 0)
