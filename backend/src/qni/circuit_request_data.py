from __future__ import annotations

import json
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from werkzeug.datastructures import ImmutableMultiDict

from qni.types import DeviceType


class CircuitRequestData:
    """
    The `CircuitRequestData` class is designed to encapsulate and manage the quantum circuit data received from a service worker.
    It provides properties to access various parameters of the request in a structured manner.
    """

    def __init__(self, form: ImmutableMultiDict[str, str]):
        """
        Initialize the CircuitRequestData object with form data.

        :param form: The form data received from the request.
        :type form: ImmutableMultiDict[str, str]
        """
        self._form = form

    @property
    def circuit_id(self) -> str:
        """
        Retrieves the circuit ID from the form data.

        :return: The circuit ID.
        :rtype: str
        """
        return self._form.get("id", "")

    @property
    def qubit_count(self) -> int:
        """
        Retrieves the qubit count from the form data.

        :return: The qubit count.
        :rtype: int
        """
        return self._form.get("qubitCount", 0, type=int)

    @property
    def until_step_index(self) -> int:
        """
        Retrieves the index of the last step to be executed from the form data.

        :return: The index of the last step.
        :rtype: int
        """
        return self._form.get("untilStepIndex", 0, type=int)

    @property
    def steps(self) -> list[dict]:
        """
        Retrieves the list of steps from the form data.

        :return: The list of steps.
        :rtype: list[dict]
        """
        return self._form.get("steps", [], type=self._steps_type)

    @property
    def amplitude_indices(self) -> list[int]:
        """
        Retrieves the list of amplitude indices from the form data.

        :return: The list of amplitude indices.
        :rtype: list[int]
        """
        return self._form.get("amplitudeIndices", [], type=self._amplitude_indices_type)

    @property
    def device(self) -> DeviceType:
        """
        Retrieves the device type (CPU or GPU) from the form data.

        :return: The device type.
        :rtype: DeviceType
        """
        return self._form.get("device", DeviceType.CPU, type=self._device_type)

    def _steps_type(self, parameter: str) -> list[dict]:
        return json.loads(parameter)

    def _amplitude_indices_type(self, parameter: str) -> list[int]:
        return [int(each) for each in parameter.split(",") if each.isdigit()]

    def _device_type(self, parameter: str) -> DeviceType:
        return DeviceType(parameter)
