import unittest

from src.cirq_runner import CirqRunner


class TestCirqRunner(unittest.TestCase):
    def setUp(self):
        self.logger = None  # ロガーのモックまたは実際のロガーを設定
        self.cirq_runner = CirqRunner(self.logger)

    def test_initialization(self):
        assert self.cirq_runner is not None  # unittestスタイルのassertを通常のassertに変更

    def test_build_circuit(self):
        qubit_count = 1
        circuit_qni = [
            [{'type': 'H', 'targets': [0]}],
        ]

        circuit, measurement_moment = self.cirq_runner.build_circuit(
            qubit_count, circuit_qni)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0].gate) == 'H'

    # 他のテストメソッドを追加することができます
    # 例: build_circuit, run_circuit_until_step_index など


if __name__ == '__main__':
    unittest.main()
