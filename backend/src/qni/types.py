from __future__ import annotations

from typing import Literal, TypedDict

MeasuredBitsType = dict[int, int]


class StepResultsWithoutAmplitudes(TypedDict):
    measuredBits: MeasuredBitsType


device_type = Literal["CPU", "GPU"]
