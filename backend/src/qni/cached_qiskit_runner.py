import logging
import os
import pickle
import tempfile

from qni.qiskit_runner import QiskitRunner
from qni.request_data import RequestData


class CachedQiskitRunner:
    def __init__(self, logger: logging.Logger) -> None:
        self.cache_dir = tempfile.mkdtemp()
        self.logger = logger

    def run(self, request_data: RequestData) -> dict:
        cache_key = (request_data.circuit_id, request_data.until_step_index)

        if request_data.cache_enabled:
            cached_result = self._load_from_cache(cache_key)
            if cached_result is not None:
                return cached_result
 
        result = QiskitRunner(self.logger).run_circuit(
            request_data.steps,
            qubit_count=request_data.qubit_count,
            until_step_index=request_data.until_step_index,
            device=request_data.device,
        )

        if request_data.cache_enabled:
            self._save_to_cache(cache_key, result)

        return result

    def _get_cache_path(self, cache_key: tuple) -> str:
        return os.path.join(self.cache_dir, f"{hash(cache_key)}.pkl")

    def _load_from_cache(self, cache_key: tuple) -> dict:
        cache_path = self._get_cache_path(cache_key)
        if os.path.exists(cache_path):
            self.logger.info("Cache hit for circuit_key: %s", cache_key)
            with open(cache_path, "rb") as f:
                return pickle.load(f)  # noqa: S301
        self.logger.info("Cache miss for circuit_key: %s", cache_key)
            
        return None

    def _save_to_cache(self, cache_key: tuple, result: dict) -> None:
        cache_path = self._get_cache_path(cache_key)
        with open(cache_path, "wb") as f:
            pickle.dump(result, f)
