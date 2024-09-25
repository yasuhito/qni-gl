from __future__ import annotations

from enum import Enum
from typing import TypedDict

MeasuredBitsType = dict[int, int]


class StepResultsWithoutAmplitudes(TypedDict):
    measuredBits: MeasuredBitsType


class DeviceType(Enum):
    """
    DeviceType is an enumeration that represents the type of device (CPU or GPU) used for quantum circuit simulation.
    """

    CPU = "CPU"
    GPU = "GPU"
