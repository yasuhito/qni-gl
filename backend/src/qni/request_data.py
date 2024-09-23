from __future__ import annotations

import json
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from werkzeug.datastructures import ImmutableMultiDict

from qni.types import DeviceType


class RequestData:
    def __init__(self, form: ImmutableMultiDict[str, str]):
        self.circuit_id: str = form.get("id", "")
        self.qubit_count: int = form.get("qubitCount", 0, type=int)
        self.until_step_index: int = form.get("untilStepIndex", 0, type=int)
        self.steps: list[dict] = form.get("steps", [], type=self._steps_type)
        self.amplitude_indices: list[int] = form.get("amplitudeIndices", [], type=self._amplitude_indices_type)
        self.device: DeviceType = form.get("device", DeviceType.CPU, type=self._device_type)
        self.cache_enabled: bool = form.get("cacheEnabled", False, type=bool)

    def _steps_type(self, parameter: str) -> list[dict]:
        return json.loads(parameter)

    def _amplitude_indices_type(self, parameter: str) -> list[int]:
        return [int(each) for each in parameter.split(",") if each.isdigit()]

    def _device_type(self, parameter: str) -> DeviceType:
        return DeviceType(parameter)
