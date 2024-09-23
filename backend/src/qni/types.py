from __future__ import annotations

from enum import Enum
from typing import TypedDict

MeasuredBitsType = dict[int, int]


class StepResultsWithoutAmplitudes(TypedDict):
    measuredBits: MeasuredBitsType


class DeviceType(Enum):
    CPU = "CPU"
    GPU = "GPU"
