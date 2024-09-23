import shutil
import unittest
from unittest.mock import MagicMock, patch

from werkzeug.datastructures import ImmutableMultiDict

from qni.cached_qiskit_runner import CachedQiskitRunner
from qni.request_data import RequestData


class TestCachedQiskitRunner(unittest.TestCase):
    def setUp(self):
        self.logger = MagicMock()
        self.cached_runner = CachedQiskitRunner(self.logger)

    def tearDown(self):
        shutil.rmtree(self.cached_runner.cache_dir)

    @patch("qni.qiskit_runner.QiskitRunner.run_circuit")
    def test_run_with_cache_enabled_and_cache_miss(self, mock_run_circuit):
        request_data = RequestData(
            ImmutableMultiDict(
                [
                    ("id", "test_circuit"),
                    ("qubitCount", "5"),
                    ("untilStepIndex", "3"),
                    ("steps", '[{"type": "H", "targets": [0]}]'),
                    ("amplitudeIndices", "0,1,2,3"),
                    ("device", "GPU"),
                    ("cacheEnabled", "true"),
                ]
            )
        )
        mock_run_circuit.return_value = {"result": "test_result"}

        result = self.cached_runner.run(request_data)
        assert result == {"result": "test_result"}
        self.logger.info.assert_called_with("Cache miss for circuit_key: %s", ("test_circuit", 3))

    @patch("qni.qiskit_runner.QiskitRunner.run_circuit")
    def test_run_with_cache_enabled_and_cache_hit(self, mock_run_circuit):
        request_data = RequestData(
            ImmutableMultiDict(
                [
                    ("id", "test_circuit"),
                    ("qubitCount", "5"),
                    ("untilStepIndex", "3"),
                    ("steps", '[{"type": "H", "targets": [0]}]'),
                    ("amplitudeIndices", "0,1,2,3"),
                    ("device", "GPU"),
                    ("cacheEnabled", "true"),
                ]
            )
        )        
        mock_run_circuit.return_value = {"result": "test_result"}

        # First run to populate the cache
        result = self.cached_runner.run(request_data)
        assert result == {"result": "test_result"}

        # Second run to test cache hit
        result = self.cached_runner.run(request_data)
        assert result == {"result": "test_result"}
        self.logger.info.assert_called_with("Cache hit for circuit_key: %s", ("test_circuit", 3))

    @patch("qni.qiskit_runner.QiskitRunner.run_circuit")
    def test_run_without_cache(self, mock_run_circuit):
        request_data = RequestData(
            ImmutableMultiDict(
                [
                    ("id", "test_circuit"),
                    ("qubitCount", "5"),
                    ("untilStepIndex", "3"),
                    ("steps", '[{"type": "H", "targets": [0]}]'),
                    ("amplitudeIndices", "0,1,2,3"),
                    ("device", "GPU"),
                    ("cacheEnabled", "false"),
                ]
            )
        )         
        mock_run_circuit.return_value = {"result": "test_result"}

        result = self.cached_runner.run(request_data)
        assert result == {"result": "test_result"}


if __name__ == "__main__":
    unittest.main()
