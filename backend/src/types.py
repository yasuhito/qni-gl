from __future__ import annotations

from typing import TypedDict

MeasuredBitsType = dict[int, int]


class StepResultsWithoutAmplitudes(TypedDict):
    measuredBits: MeasuredBitsType
