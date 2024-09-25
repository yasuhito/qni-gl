from __future__ import annotations

from enum import Enum
from typing import TypeAlias, TypedDict

MeasuredBitsType: TypeAlias = dict[int, int]
AmplitudeType: TypeAlias = tuple[float, float]
QiskitAmplitudeType: TypeAlias = complex
QiskitStepAmplitudesType: TypeAlias = dict[int, QiskitAmplitudeType]
StepAmplitudesType: TypeAlias = dict[int, AmplitudeType]


class StepResultWithoutAmplitudes(TypedDict):
    measuredBits: MeasuredBitsType


class StepResultWithAmplitudes(TypedDict):
    amplitudes: StepAmplitudesType
    measuredBits: MeasuredBitsType


class QiskitStepResultWithAmplitudes(TypedDict):
    amplitudes: QiskitStepAmplitudesType
    measuredBits: MeasuredBitsType


StepResult: TypeAlias = StepResultWithAmplitudes | StepResultWithoutAmplitudes
QiskitStepResult: TypeAlias = QiskitStepResultWithAmplitudes | StepResultWithoutAmplitudes


class DeviceType(Enum):
    """
    DeviceType is an enumeration that represents the type of device (CPU or GPU) used for quantum circuit simulation.
    """

    CPU = "CPU"
    GPU = "GPU"
