import unittest

from src.cirq_runner import CirqRunner


class TestCirqRunner(unittest.TestCase):
    def setUp(self):
        self.logger = None  # ロガーのモックまたは実際のロガーを設定
        self.cirq_runner = CirqRunner(self.logger)

    def test_initialization(self):
        self.assertIsNotNone(self.cirq_runner)

    # 他のテストメソッドを追加することができます
    # 例: build_circuit, run_circuit_until_step_index など


if __name__ == '__main__':
    unittest.main()
