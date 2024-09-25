from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    import logging

    from qni.circuit_request_data import CircuitRequestData
    from qni.types import QiskitStepResult

from qni.qiskit_runner import QiskitRunner


class CachedQiskitRunner:
    def __init__(self, logger: logging.Logger) -> None:
        self.logger = logger
        self.cache: list[QiskitStepResult] = []
        self.last_cache_key: tuple | None = None

    def run(self, request_data: CircuitRequestData) -> list[QiskitStepResult]:
        cache_key = (request_data.circuit_id, request_data.until_step_index)

        if self.last_cache_key == cache_key:
            self.logger.info("Cache hit for circuit_key: %s", cache_key)
            return self.cache

        self.logger.info("Cache miss for circuit_key: %s", cache_key)

        step_results = QiskitRunner(self.logger).run_circuit(
            request_data.steps,
            qubit_count=request_data.qubit_count,
            until_step_index=request_data.until_step_index,
            device=request_data.device,
        )
        self.cache = step_results
        self.last_cache_key = cache_key

        return step_results
