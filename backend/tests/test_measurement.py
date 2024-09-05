import unittest

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestMeasurement(unittest.TestCase):
    def setUp(self):
        self.cirq_runner = CirqRunner()

    def test_build_circuit(self):
        step = [
            [{"type": "Measure", "targets": [0]}],
        ]

        circuit, measurements = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]
                   ) == "cirq.MeasurementGate(1, cirq.MeasurementKey(name='m0_0'), ())(q(0))"
        assert str(measurements) == "[{'key': 'm0_0', 'target_bit': 0}]"

    def test_build_circuit_with_two_measurement_gates(self):
        steps = [
            [{"type": "Measure", "targets": [0, 1]}],
        ]

        circuit, measurements = self.cirq_runner.build_circuit(steps)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]
                   ) == "cirq.MeasurementGate(1, cirq.MeasurementKey(name='m0_0'), ())(q(0))"
        assert str(circuit[0].operations[1]
                   ) == "cirq.MeasurementGate(1, cirq.MeasurementKey(name='m0_1'), ())(q(1))"
        assert str(
            measurements) == "[{'key': 'm0_0', 'target_bit': 0}, {'key': 'm0_1', 'target_bit': 1}]"

    def test_build_circuit_with_consecutive_measurement_gates(self):
        steps = [
            [{"type": "Measure", "targets": [2]}],
            [{"type": "Measure", "targets": [0]}],
            [{"type": "Measure", "targets": [1]}],
        ]

        circuit, measurements = self.cirq_runner.build_circuit(steps)

        assert len(circuit.all_qubits()) == 3
        assert str(circuit[0].operations[0]
                   ) == "cirq.MeasurementGate(1, cirq.MeasurementKey(name='m0_0'), ())(q(0))"
        assert str(circuit[1].operations[0]
                   ) == "cirq.MeasurementGate(1, cirq.MeasurementKey(name='m1_2'), ())(q(2))"
        assert str(circuit[2].operations[0]
                   ) == "cirq.MeasurementGate(1, cirq.MeasurementKey(name='m2_1'), ())(q(1))"
        assert str(
            measurements) == "[{'key': 'm0_0', 'target_bit': 0}, {'key': 'm1_2', 'target_bit': 2}, {'key': 'm2_1', 'target_bit': 1}]"

    # M|0⟩=|0⟩
    def test_measurement_0(self):
        steps = [[{"type": "Measure", "targets": [0]}]]

        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, steps, measurements)

        amplitudes = result[0][":amplitude"]
        measured_bits = result[0][":measuredBits"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert measured_bits == {0: 0}

    # M|1⟩=|1⟩
    def test_measurement_1(self):
        steps = [[{"type": "X", "targets": [0]}],
                 [{"type": "Measure", "targets": [0]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, steps, measurements)

        amplitudes = result[1][":amplitude"]
        measured_bits = result[1][":measuredBits"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)
        assert measured_bits == {0: 1}
