from __future__ import annotations

import json
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from werkzeug.datastructures import ImmutableMultiDict

from qni.types import DeviceType


def steps_type(parameter: str) -> list[dict]:
    return json.loads(parameter)


def amplitude_indices_type(parameter: str) -> list[int]:
    return [int(each) for each in parameter.split(",") if each.isdigit()]


def device_type(parameter: str) -> DeviceType:
    return DeviceType(parameter)


class RequestData:
    def __init__(self, form: ImmutableMultiDict[str, str]):
        self.circuit_id: str = form.get("id", "")
        self.qubit_count: int = form.get("qubitCount", 0, type=int)
        self.until_step_index: int = form.get("untilStepIndex", 0, type=int)
        self.steps: list[dict] = form.get("steps", [], type=steps_type)
        self.amplitude_indices: list[int] = form.get("amplitudeIndices", [], type=amplitude_indices_type)
        self.device: DeviceType = form.get("device", DeviceType.CPU, type=device_type)
