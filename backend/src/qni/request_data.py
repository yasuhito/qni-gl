from __future__ import annotations

import json

from qni.types import DeviceType


class RequestData:
    def __init__(self, form: dict | None = None):
        form = form or {}
        self.circuit_id: str = form.get("id", "")
        self.qubit_count: int = self._get_int_from_request(form, "qubitCount", 0)
        self.until_step_index: int = self._get_int_from_request(form, "untilStepIndex", 0)
        self.steps: list[dict] = self._get_steps_from_request(form, [])
        self.amplitude_indices: list[int] = self._get_amplitude_indices_from_request(form, [])
        self.device: DeviceType = self._get_device_type(form, DeviceType.CPU)

    @staticmethod
    def _get_int_from_request(form: dict, key: str, default: int) -> int:
        return int(form.get(key, default) or default)

    @staticmethod
    def _get_amplitude_indices_from_request(form: dict, default: list) -> list[int]:
        return [
            int(each) for each in form.get("amplitudeIndices", ",".join(map(str, default))).split(",") if each.isdigit()
        ]

    @staticmethod
    def _get_steps_from_request(form: dict, default: list) -> list[dict]:
        return json.loads(form.get("steps", json.dumps(default)))

    @staticmethod
    def _get_device_type(form: dict, default: DeviceType) -> DeviceType:
        return DeviceType.GPU if form.get("useGpu", "false").lower() == "true" else default
