from __future__ import annotations

import json

from qni.types import DeviceType

DEFAULT_QUBIT_COUNT: int | None = None
DEFAULT_UNTIL_STEP_INDEX: int | None = None


class RequestData:
    def __init__(self, form: dict | None = None):
        form = form or {}
        self.circuit_id: str = form.get("id", "")
        self.qubit_count: int = self._get_int_from_request(form, "qubitCount", DEFAULT_QUBIT_COUNT)
        self.until_step_index: int = self._get_int_from_request(form, "untilStepIndex", DEFAULT_UNTIL_STEP_INDEX)
        self.steps: list[dict] = self._get_steps_from_request(form)
        self.amplitude_indices: list[int] = self._get_amplitude_indices_from_request(form)
        self.device: DeviceType = DeviceType.GPU if form.get("useGpu", "false").lower() == "true" else DeviceType.CPU

    @staticmethod
    def _get_int_from_request(form: dict, key: str, default: int | None = None) -> int:
        return int(form.get(key, default or 0))

    @staticmethod
    def _get_amplitude_indices_from_request(form: dict) -> list[int]:
        return [int(each) for each in form.get("amplitudeIndices", "").split(",") if each.isdigit()]

    @staticmethod
    def _get_steps_from_request(form: dict) -> list[dict]:
        return json.loads(form.get("steps", "[]"))
