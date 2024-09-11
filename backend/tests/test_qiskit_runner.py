import unittest

import pytest

from src.qiskit_runner import QiskitRunner


class TestQiskitRunner(unittest.TestCase):
    def setUp(self):
        self.qiskit_runner = QiskitRunner()

    def test_run_empty_circuit(self):
        results = self.qiskit_runner.run_circuit([])

        assert len(results) == 0

    def test_simple_circuit(self):
        steps = [
            [{"type": "H", "targets": [0]}],
            [],
            [],
            [],
            [],
        ]

        results = self.qiskit_runner.run_circuit(steps, {"qubit_count": 2})

        assert len(results) == 5
        # assert len(results[0]) == 2

    def test_build_circuit_with_unknown_operation(self):
        steps = [
            [{"type": "UnknownGate", "targets": [0]}],
        ]

        with pytest.raises(ValueError, match="Unknown operation: UnknownGate"):
            self.qiskit_runner.run_circuit(steps)


if __name__ == "__main__":
    unittest.main()
