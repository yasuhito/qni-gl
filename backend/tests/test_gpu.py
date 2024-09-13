import unittest

import pytest

from src.qiskit_runner import QiskitRunner


class TestH(unittest.TestCase):
    def setUp(self):
        self.qiskit_runner = QiskitRunner()

    @pytest.mark.gpu
    def test_30bit_circuit(self):
        steps = [
            [{"type": "H", "targets": list(range(30))}],
        ]

        result = self.qiskit_runner.run_circuit(steps, device="GPU")

        amplitudes = result[1][":amplitude"]
        assert len(amplitudes) == 2**30

