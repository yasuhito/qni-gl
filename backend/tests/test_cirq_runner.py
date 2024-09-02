import unittest
import sys
from src.cirq_runner import CirqRunner


class TestCirqRunner(unittest.TestCase):
    def setUp(self):
        self.logger = None  # ロガーのモックまたは実際のロガーを設定
        self.cirq_runner = CirqRunner(self.logger)

    def test_initialization(self):
        assert self.cirq_runner is not None  # unittestスタイルのassertを通常のassertに変更

    def test_build_circuit_with_h_gate(self):
        qubit_count = 1
        circuit_qni = [
            [{'type': 'H', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(
            qubit_count, circuit_qni)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'H(q(0))'

    def test_build_circuit_with_x_gate(self):
        qubit_count = 1
        circuit_qni = [
            [{'type': 'X', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(
            qubit_count, circuit_qni)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'X(q(0))'

    def test_build_circuit_with_controlled_x_gate(self):
        qubit_count = 2
        circuit_qni = [
            [{'type': 'X', 'targets': [0], 'controls': [1]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, circuit_qni)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]) == 'CX(q(0), q(1))'

    def test_build_circuit_with_two_controlled_x_gates(self):
        qubit_count = 3
        circuit_qni = [
            [{'type': 'X', 'targets': [0], 'controls': [1, 2]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, circuit_qni)

        assert len(circuit.all_qubits()) == 3
        assert str(circuit[0].operations[0]) == 'CCX(q(0), q(1), q(2))'

    def test_build_circuit_with_y_gate(self):
        qubit_count = 1
        circuit_qni = [
            [{'type': 'Y', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, circuit_qni)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'Y(q(0))'

    def test_build_circuit_with_z_gate(self):
        qubit_count = 1
        circuit_qni = [
            [{'type': 'Z', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, circuit_qni)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'Z(q(0))'

    def test_build_circuit_with_rnot_gate(self):
        qubit_count = 1
        circuit_qni = [
            [{'type': 'X^½', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, circuit_qni)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'X**0.5(q(0))'

    def test_build_circuit_with_s_gate(self):
        qubit_count = 1
        circuit_qni = [
            [{'type': 'S', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, circuit_qni)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'S(q(0))'

    def test_build_circuit_with_s_dagger_gate(self):
        qubit_count = 1
        circuit_qni = [
            [{'type': 'S†', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, circuit_qni)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'S**-1(q(0))'

    def test_build_circuit_with_t_gate(self):
        qubit_count = 1
        circuit_qni = [
            [{'type': 'T', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, circuit_qni)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'T(q(0))'

    def test_build_circuit_with_t_dagger_gate(self):
        qubit_count = 1
        circuit_qni = [
            [{'type': 'T†', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, circuit_qni)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'T**-1(q(0))'


if __name__ == '__main__':
    unittest.main()
