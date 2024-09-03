import unittest
from math import sqrt

import pytest

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestCirqRunner(unittest.TestCase):
    def setUp(self):
        self.logger = None
        self.cirq_runner = CirqRunner(self.logger)

    def test_build_circuit_with_measurement_gate(self):
        step = [
            [{"type": "Measure", "targets": [0]}],
        ]

        circuit, measurements = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]
                   ) == "cirq.MeasurementGate(1, cirq.MeasurementKey(name='m0'), ())(q(0))"
        assert str(measurements) == "[[[['m0', 0]]]]"

    def test_build_circuit_with_two_measurement_gates(self):
        step = [
            [{"type": "Measure", "targets": [0, 1]}],
        ]

        circuit, measurements = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]
                   ) == "cirq.MeasurementGate(1, cirq.MeasurementKey(name='m0'), ())(q(0))"
        assert str(circuit[0].operations[1]
                   ) == "cirq.MeasurementGate(1, cirq.MeasurementKey(name='m1'), ())(q(1))"
        assert str(measurements) == "[[[['m0', 0], ['m1', 1]]]]"

    def test_build_circuit_with_unknown_operation(self):
        step = [
            [{"type": "UnknownGate", "targets": [0]}],
        ]

        with pytest.raises(ValueError, match="Unknown operation: UnknownGate"):
            self.cirq_runner.build_circuit(step)

    def test_build_circuit_with_empty_step(self):
        step = [[]]

        circuit, _ = self.cirq_runner.build_circuit(step, 2)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]) == "I(q(0))"
        assert str(circuit[0].operations[1]) == "I(q(1))"


if __name__ == "__main__":
    unittest.main()
