from __future__ import annotations

from enum import Enum
from typing import TypeAlias, TypedDict

MeasuredBitsType: TypeAlias = dict[int, int]
AmplitudeType: TypeAlias = tuple[float, float]
QubitAmplitudesType: TypeAlias = dict[int, AmplitudeType]


class StepResultsWithoutAmplitudes(TypedDict):
    measuredBits: MeasuredBitsType


class StepResultsWithAmplitudes(TypedDict):
    amplitudes: dict[int, QubitAmplitudesType]
    measuredBits: MeasuredBitsType


class DeviceType(Enum):
    """
    DeviceType is an enumeration that represents the type of device (CPU or GPU) used for quantum circuit simulation.
    """

    CPU = "CPU"
    GPU = "GPU"
