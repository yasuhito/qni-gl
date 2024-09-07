import unittest

import pytest

from src.cirq_runner import CirqRunner


class TestCirqRunner(unittest.TestCase):
    def setUp(self):
        self.cirq_runner = CirqRunner()

    def test_build_circuit_with_unknown_operation(self):
        steps = [
            [{"type": "UnknownGate", "targets": [0]}],
        ]

        with pytest.raises(ValueError, match="Unknown operation: UnknownGate"):
            self.cirq_runner.run_circuit(steps)


if __name__ == "__main__":
    unittest.main()
