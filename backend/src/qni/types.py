from __future__ import annotations

from enum import Enum
from typing import TypeAlias, TypedDict

MeasuredBits: TypeAlias = dict[int, int]
Amplitude: TypeAlias = tuple[float, float]
QiskitAmplitude: TypeAlias = complex
QiskitStepAmplitudes: TypeAlias = dict[int, QiskitAmplitude]
StepAmplitudes: TypeAlias = dict[int, Amplitude]


class StepResultWithoutAmplitudes(TypedDict):
    measuredBits: MeasuredBits


class StepResultWithAmplitudes(TypedDict):
    amplitudes: StepAmplitudes
    measuredBits: MeasuredBits


class QiskitStepResultWithAmplitudes(TypedDict):
    amplitudes: QiskitStepAmplitudes
    measuredBits: MeasuredBits


StepResult: TypeAlias = StepResultWithAmplitudes | StepResultWithoutAmplitudes


class QiskitStepResult(TypedDict, total=False):
    amplitudes: QiskitStepAmplitudes | None
    measuredBits: MeasuredBits


class DeviceType(Enum):
    """
    DeviceType is an enumeration that represents the type of device (CPU or GPU) used for quantum circuit simulation.
    """

    CPU = "CPU"
    GPU = "GPU"
