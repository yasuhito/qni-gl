from __future__ import annotations

import json
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from werkzeug.datastructures import ImmutableMultiDict

from qni.types import DeviceType


class AmplitudeIndicesType:
    def __init__(self, amplitude_indices_parameter):
        if isinstance(amplitude_indices_parameter, str):
            self.amplitude_indices = [int(each) for each in amplitude_indices_parameter.split(",") if each.isdigit()]
        else:
            self.amplitude_indices = []

    def __repr__(self):
        return repr(self.amplitude_indices)

    def __str__(self):
        return str(self.amplitude_indices)

    def __iter__(self):
        return iter(self.amplitude_indices)


class StepsType:
    def __init__(self, steps_parameter):
        self.steps = json.loads(steps_parameter)

    def __repr__(self):
        return repr(self.steps)

    def __str__(self):
        return str(self.steps)

    def __iter__(self):
        return iter(self.steps)

    def __len__(self):
        return len(self.steps)


def steps(steps_parameter: str) -> list[dict]:
    return StepsType(steps_parameter).steps


def amplitude_indices(amplitude_indices_parameter: str) -> list[int]:
    return AmplitudeIndicesType(amplitude_indices_parameter).amplitude_indices


class RequestData:
    def __init__(self, form: ImmutableMultiDict[str, str]):
        self.circuit_id: str = form.get("id", "")
        self.qubit_count: int = form.get("qubitCount", 0, type=int)
        self.until_step_index: int = form.get("untilStepIndex", 0, type=int)
        self.steps: list[dict] = form.get("steps", [], type=steps)
        self.amplitude_indices: list[int] = form.get("amplitudeIndices", [], type=amplitude_indices)
        self.device: DeviceType = self._get_device_type(form, DeviceType.CPU)

    @staticmethod
    def _get_device_type(form: ImmutableMultiDict[str, str], default: DeviceType) -> DeviceType:
        return DeviceType.GPU if form.get("useGpu", "false").lower() == "true" else default
