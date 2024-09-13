import unittest

import pytest
from src.qiskit_runner import QiskitRunner
from tests.conftest import assert_complex_approx


class TestH(unittest.TestCase):
    def setUp(self):
        self.qiskit_runner = QiskitRunner()

    @pytest.mark.gpu
    def test_30bit_circuit(self):
        steps = [
            [{"type": "H", "targets": list(range(31))}],
        ]

        result = self.qiskit_runner.run_circuit(steps, device="GPU")

        amplitudes = result[1][":amplitude"]
        assert_complex_approx(amplitudes[0], 1, 0)
        assert_complex_approx(amplitudes[1], 0, 0)

