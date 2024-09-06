import unittest

from src.cirq_runner import CirqRunner
from src.write1 import Write1
from tests.conftest import assert_complex_approx


class TestWrite1(unittest.TestCase):
    def setUp(self):
        self.cirq_runner = CirqRunner()

    def test_repr(self):
        w = Write1()
        assert repr(w) == "Write1()"

    def test_build_circuit(self):
        step = [
            [{"type": "|1>", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "|1>(q(0))"

    # Write1|0⟩=|1>
    def test_write1_0(self):
        steps = [
            [{"type": "|1>", "targets": [0]}],
        ]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, measurements)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)

    # Write1|1⟩=|1>
    def test_write1_1(self):
        steps = [
            [{"type": "X", "targets": [0]}],
            [{"type": "|1>", "targets": [0]}],
        ]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, measurements)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)
