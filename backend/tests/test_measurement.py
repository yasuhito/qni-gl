import unittest

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestMeasurement(unittest.TestCase):
    def setUp(self):
        self.cirq_runner = CirqRunner()

    # M|0⟩=|0⟩
    def test_measurement_0(self):
        steps = [[{"type": "Measure", "targets": [0]}]]

        result = self.cirq_runner.run_circuit(steps)

        amplitudes = result[0][":amplitude"]
        measured_bits = result[0][":measuredBits"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert measured_bits == {0: 0}

    # M|1⟩=|1⟩
    def test_measurement_1(self):
        steps = [[{"type": "X", "targets": [0]}], [{"type": "Measure", "targets": [0]}]]

        result = self.cirq_runner.run_circuit(steps)

        amplitudes = result[1][":amplitude"]
        measured_bits = result[1][":measuredBits"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)
        assert measured_bits == {0: 1}
