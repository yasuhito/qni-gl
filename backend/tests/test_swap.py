import unittest

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestSwap(unittest.TestCase):
    def setUp(self):
        self.logger = None
        self.cirq_runner = CirqRunner(self.logger)

    def test_build_circuit(self):
        step = [
            [{"type": "Swap", "targets": [0, 1]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]) == "SWAP(q(0), q(1))"

    def test_build_circuit_with_one_swap_gate(self):
        step = [
            [{"type": "Swap", "targets": [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == "I(q(0))"

    def test_build_circuit_with_three_swap_gates(self):
        step = [
            [{"type": "Swap", "targets": [0, 1, 2]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 3
        assert str(circuit[0].operations[0]) == "I(q(0))"
        assert str(circuit[0].operations[1]) == "I(q(1))"
        assert str(circuit[0].operations[2]) == "I(q(2))"

    # Swap|0⟩=|0⟩
    def test_swap_0(self):
        steps = [[{"type": "Swap", "targets": [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)

    # (Swap,Swap)|00⟩ = |00⟩
    def test_swap_swap_00(self):
        steps = [[{"type": "Swap", "targets": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    # (Swap,Swap)|01> = |10>
    def test_swap_swap_01(self):
        steps = [[{"type": "X", "targets": [0]}],
                 [{"type": "Swap", "targets": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 1, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    # (Swap,Swap)|10> = |01>
    def test_swap_swap_10(self):
        steps = [[{"type": "X", "targets": [1]}],
                 [{"type": "Swap", "targets": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    # (Swap,Swap)|11> = |11>
    def test_swap_swap_11(self):
        steps = [[{"type": "X", "targets": [0, 1]}],
                 [{"type": "Swap", "targets": [0, 1]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(
            circuit, steps, measurement_moment)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 1, 0)
