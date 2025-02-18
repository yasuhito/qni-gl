"""Type definitions and data structures for the Qni quantum circuit simulator.

This module defines the core data types and structures used throughout the Qni system:
1. Quantum circuit execution results (StepResult, QiskitStepResult)
2. Amplitude representations for both internal and Qiskit-compatible formats
3. Measurement results data structures
4. Device type specifications (CPU/GPU)

Key type definitions:
- MeasuredBits: Dictionary mapping qubit indices to measured values (0 or 1)
- Amplitude: Complex numbers represented as (real, imaginary) tuples
- StepResult: Results from executing a single step in a quantum circuit
- QiskitStepResult: Qiskit-specific version of step execution results

The module uses TypedDict for structured dictionary types and TypeAlias for type aliases,
ensuring type safety throughout the application.
"""

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
    """DeviceType is an enumeration that represents the type of device (CPU or GPU) used for quantum circuit simulation."""

    CPU = "CPU"
    GPU = "GPU"
