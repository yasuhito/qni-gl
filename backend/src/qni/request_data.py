from __future__ import annotations

import json
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from werkzeug.datastructures import ImmutableMultiDict

from qni.types import DeviceType


class RequestData:
    def __init__(self, form: ImmutableMultiDict[str, str]):
        self._form = form

    @property
    def circuit_id(self) -> str:
        return self._form.get("id", "")

    @property
    def qubit_count(self) -> int:
        return self._form.get("qubitCount", 0, type=int)

    @property
    def until_step_index(self) -> int:
        return self._form.get("untilStepIndex", 0, type=int)

    @property
    def steps(self) -> list[dict]:
        return self._form.get("steps", [], type=self._steps_type)

    @property
    def amplitude_indices(self) -> list[int]:
        return self._form.get("amplitudeIndices", [], type=self._amplitude_indices_type)

    @property
    def device(self) -> DeviceType:
        return self._form.get("device", DeviceType.CPU, type=self._device_type)

    @property
    def cache_enabled(self) -> bool:
        return self._form.get("cacheEnabled", False, type=bool)

    def _steps_type(self, parameter: str) -> list[dict]:
        return json.loads(parameter)

    def _amplitude_indices_type(self, parameter: str) -> list[int]:
        return [int(each) for each in parameter.split(",") if each.isdigit()]

    def _device_type(self, parameter: str) -> DeviceType:
        return DeviceType(parameter)
