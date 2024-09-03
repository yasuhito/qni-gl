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
        assert str(circuit[0].operations[0]) == "CX(q(0), q(1))"

    def test_build_circuit_with_ccnot(self):
        step = [
            [{"type": "X", "targets": [0], "controls": [1, 2]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 3
        assert str(circuit[0].operations[0]) == "CCX(q(0), q(1), q(2))"

    def test_cnot_00(self):
        steps = [[{"type": "X", "targets": [1], "controls": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    def test_cnot_01(self):
        steps = [[{"type": "X", "targets": [0]}], [
            {"type": "X", "targets": [1], "controls": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 1, 0)

    def test_cnot_10(self):
        steps = [[{"type": "X", "targets": [1]}], [
            {"type": "X", "targets": [1], "controls": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 1, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    def test_cnot_11(self):
        steps = [[{"type": "X", "targets": [0, 1]}], [
            {"type": "X", "targets": [1], "controls": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    def test_ccnot_000(self):
        steps = [[{"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 0, steps, [0, 1, 2, 3, 4, 5, 6, 7]
        )

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_ccnot_001(self):
        steps = [[{"type": "X", "targets": [0]}], [
            {"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_ccnot_010(self):
        steps = [[{"type": "X", "targets": [1]}], [
            {"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 1, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_ccnot_011(self):
        steps = [[{"type": "X", "targets": [0, 1]}], [
            {"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 1, 0)

    def test_ccnot_100(self):
        steps = [[{"type": "X", "targets": [2]}], [
            {"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 1, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_ccnot_101(self):
        steps = [[{"type": "X", "targets": [0, 2]}], [
            {"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 1, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_ccnot_110(self):
        steps = [[{"type": "X", "targets": [1, 2]}], [
            {"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 1, 0)
        assert_complex_approx(amplitudes[7], 0, 0)

    def test_ccnot_111(self):
        steps = [[{"type": "X", "targets": [0, 1, 2]}], [
            {"type": "X", "targets": [2], "controls": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 1, 0)
        assert_complex_approx(amplitudes[4], 0, 0)
        assert_complex_approx(amplitudes[5], 0, 0)
        assert_complex_approx(amplitudes[6], 0, 0)
        assert_complex_approx(amplitudes[7], 0, 0)
