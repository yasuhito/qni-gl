import unittest

from qni.qiskit_runner import QiskitRunner
from tests.conftest import assert_complex_approx


class TestControlledSDagger(unittest.TestCase):
    def setUp(self):
        self.qiskit_runner = QiskitRunner()

    def test_controlled_s_dagger_00(self):
        steps = [[{"type": "S†", "targets": [1], "controls": [0]}]]

        result = self.qiskit_runner.run_circuit(steps)

        amplitudes = result[0]["amplitudes"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    def test_controlled_s_dagger_01(self):
        steps = [[{"type": "X", "targets": [0]}], [{"type": "S†", "targets": [1], "controls": [0]}]]

        result = self.qiskit_runner.run_circuit(steps)

        amplitudes = result[1]["amplitudes"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    def test_controlled_s_dagger_10(self):
        steps = [[{"type": "X", "targets": [1]}], [{"type": "S†", "targets": [1], "controls": [0]}]]

        result = self.qiskit_runner.run_circuit(steps)

        amplitudes = result[1]["amplitudes"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 1, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    def test_controlled_s_dagger_11(self):
        steps = [[{"type": "X", "targets": [0, 1]}], [{"type": "S†", "targets": [1], "controls": [0]}]]

        result = self.qiskit_runner.run_circuit(steps)

        amplitudes = result[1]["amplitudes"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, -1)

    def test_controlled_s_dagger_2_controls_000(self):
        steps = [[{"type": "S†", "targets": [2], "controls": [0, 1]}]]

        result = self.qiskit_runner.run_circuit(steps)

        amplitudes = result[0]["amplitudes"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_controlled_s_dagger_2_controls_011(self):
        steps = [[{"type": "X", "targets": [0, 1]}], [{"type": "S†", "targets": [2], "controls": [0, 1]}]]

        result = self.qiskit_runner.run_circuit(steps)

        amplitudes = result[1]["amplitudes"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 1, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_controlled_s_dagger_1_control_2_targets(self):
        steps = [[{"type": "S†", "targets": [1, 2], "controls": [0]}]]

        result = self.qiskit_runner.run_circuit(steps)

        amplitudes = result[0]["amplitudes"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_controlled_s_dagger_1_control_2_targets_011(self):
        steps = [[{"type": "X", "targets": [0]}], [{"type": "S†", "targets": [1, 2], "controls": [0]}]]

        result = self.qiskit_runner.run_circuit(steps)

        amplitudes = result[1]["amplitudes"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)
