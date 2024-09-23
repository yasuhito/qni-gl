import logging
import os
import tempfile
import pickle

from qni.request_data import RequestData
from qni.qiskit_runner import QiskitRunner

class CachedQiskitRunner:
    def __init__(self, logger: logging.Logger) -> None:
        self.cache_dir = tempfile.mkdtemp()
        self.logger = logger
        self.logger.info("Cache directory created at: %s", self.cache_dir)

    def _get_cache_path(self, cache_key: tuple) -> str:
        return os.path.join(self.cache_dir, f"{hash(cache_key)}.pkl")

    def run(self, request_data: RequestData) -> dict:
        cache_key = (request_data.circuit_id, request_data.until_step_index)
        cache_path = self._get_cache_path(cache_key)

        if os.path.exists(cache_path):
            self.logger.info("Cache hit for circuit_key: %s", cache_key)
            with open(cache_path, "rb") as f:
                return pickle.load(f)  # noqa: S301

        self.logger.info("Cache miss for circuit_key: %s", cache_key)

        result = QiskitRunner(self.logger).run_circuit(
            request_data.steps,
            qubit_count=request_data.qubit_count,
            until_step_index=request_data.until_step_index,
            device=request_data.device,
        )

        with open(cache_path, "wb") as f:
            pickle.dump(result, f)

        return result

