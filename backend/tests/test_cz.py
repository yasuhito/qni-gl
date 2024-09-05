import unittest

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestCz(unittest.TestCase):
    def setUp(self):
        self.cirq_runner = CirqRunner()

    def test_build_circuit(self):
        step = [
            [{"type": "•", "targets": [0, 1]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]) == "CZ(q(0), q(1))"

    def test_build_circuit_with_three_control_cz(self):
        step = [
            [{"type": "•", "targets": [0, 1, 2]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 3
        assert str(circuit[0].operations[0]) == "CCZ(q(0), q(1), q(2))"

    def test_build_circuit_with_four_control_cz(self):
        step = [
            [{"type": "•", "targets": [0, 1, 2, 3]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(step)

        assert len(circuit.all_qubits()) == 4
        assert str(circuit[0].operations[0]) == "CCCZ(q(0), q(1), q(2), q(3))"

    # CZ|00⟩ = |00⟩
    def test_cz_00(self):
        steps = [[{"type": "•", "targets": [0, 1]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, measurements)

        amplitudes = result[0][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    # CZ|01⟩ = |01⟩
    def test_cz_01(self):
        steps = [[{"type": "X", "targets": [0]}],
                 [{"type": "•", "targets": [0, 1]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, measurements)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 1, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    # CZ|10⟩ = |10⟩
    def test_cz_10(self):
        steps = [[{"type": "X", "targets": [1]}],
                 [{"type": "•", "targets": [0, 1]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, measurements)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 1, 0)
        assert_complex_approx(amplitudes[3], 0, 0)

    # CZ|11⟩ = -|11⟩
    def test_cz_11(self):
        steps = [[{"type": "X", "targets": [0, 1]}],
                 [{"type": "•", "targets": [0, 1]}]]
        circuit, measurements = self.cirq_runner.build_circuit(steps)

        result = self.cirq_runner.run_circuit(circuit, measurements)

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 0, 0)
        assert_complex_approx(amplitudes[1], 0, 0)
        assert_complex_approx(amplitudes[2], 0, 0)
        assert_complex_approx(amplitudes[3], -1, 0)

    # CZ|111⟩ = -|111⟩
    def test_cz_111(self):
        steps = [[{"type": "X", "targets": [0, 1, 2]}],
                 [{"type": "•", "targets": [0, 1, 2]}]]
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
        assert_complex_approx(amplitudes[7], -1, 0)
