import unittest

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestCnot(unittest.TestCase):
    def setUp(self):
        self.cirq_runner = CirqRunner()

    def test_build_circuit(self):
        step = [
            [{"type": "X", "targets": [0], "controls": [1]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]) == "CNOT(q(0), q(1))"

    def test_build_circuit_with_ccnot(self):
        step = [
            [{"type": "X", "targets": [0], "controls": [1, 2]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 3
        assert str(circuit[0].operations[0]) == "TOFFOLI(q(0), q(1), q(2))"

    def test_cnot_00(self):
        steps = [[{"type": "X", "targets": [1], "controls": [0]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, measurements)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    def test_cnot_01(self):
        steps = [[{"type": "X", "targets": [0]}], [{"type": "X", "targets": [1], "controls": [0]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, measurements)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 1, 0)

    def test_cnot_10(self):
        steps = [[{"type": "X", "targets": [1]}], [{"type": "X", "targets": [1], "controls": [0]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, measurements)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 1, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    def test_cnot_11(self):
        steps = [[{"type": "X", "targets": [0, 1]}], [{"type": "X", "targets": [1], "controls": [0]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, measurements)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    def test_ccnot_000(self):
        steps = [[{"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, measurements)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_ccnot_011(self):
        steps = [[{"type": "X", "targets": [0, 1]}], [{"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, measurements)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 1, 0)

    def test_ccnot_111(self):
        steps = [[{"type": "X", "targets": [0, 1, 2]}], [{"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, measurements)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 1, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_cxx_000(self):
        steps = [[{"type": "X", "targets": [1, 2], "controls": [0]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, measurements)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_cxx_001(self):
        steps = [[{"type": "X", "targets": [0]}], [{"type": "X", "targets": [1, 2], "controls": [0]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, measurements)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 1, 0)
