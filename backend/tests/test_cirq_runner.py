import unittest
from math import sqrt

import pytest

from src.cirq_runner import CirqRunner
from tests.conftest import assert_complex_approx


class TestCirqRunner(unittest.TestCase):
    def setUp(self):
        self.cirq_runner = CirqRunner()

    def test_build_circuit_with_unknown_operation(self):
        step = [
            [{"type": "UnknownGate", "targets": [0]}],
        ]

        with pytest.raises(ValueError, match="Unknown operation: UnknownGate"):
            self.cirq_runner.build_circuit(step)


if __name__ == "__main__":
    unittest.main()
