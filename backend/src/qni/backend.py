from __future__ import annotations

import json
import logging
from typing import TYPE_CHECKING, Literal, TypedDict

from flask import Flask, Response, jsonify, request
from flask_cors import CORS

if TYPE_CHECKING:
    from qni.types import MeasuredBitsType

from qni.qiskit_runner import QiskitRunner

LOG_FORMAT = "[%(asctime)s] [%(levelname)s] %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S %z"
LOG_FILE = "backend.log"
HTTP_BAD_REQUEST = 400

app = Flask(__name__)
CORS(app)

amplitude_type = tuple[float, float]
qubit_amplitudes_type = dict[int, amplitude_type]


class StepResultsWithAmplitudes(TypedDict):
    amplitudes: dict[int, qubit_amplitudes_type]
    measuredBits: MeasuredBitsType


class CachedQiskitRunner:
    def __init__(self) -> None:
        self.cache: dict = {}
        self.last_cache_key: tuple | None = None

    def run(
        self, circuit_id: str, qubit_count: int, until_step_index: int, steps: list[dict], device: Literal["CPU", "GPU"]
    ) -> dict:
        cache_key = (circuit_id, until_step_index)

        if self.last_cache_key == cache_key:
            app.logger.info("Cache hit for circuit_key: %s", cache_key)
            return self.cache

        app.logger.info("Cache miss for circuit_key: %s", cache_key)

        result = QiskitRunner(app.logger).run_circuit(
            steps,
            qubit_count=qubit_count,
            until_step_index=until_step_index,
            device=device,
        )
        self.cache = result
        self.last_cache_key = cache_key

        return result


cached_qiskit_runner = CachedQiskitRunner()


def _add_logger_handler(handler, formatter):
    handler.setLevel(logging.INFO)
    handler.setFormatter(formatter)
    logging.getLogger().addHandler(handler)


def _setup_custom_logger():
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)

    formatter = logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT)

    _add_logger_handler(logging.StreamHandler(), formatter)
    _add_logger_handler(logging.FileHandler(LOG_FILE), formatter)


_setup_custom_logger()


class RequestData:
    def __init__(self, form):
        self.circuit_id = form.get("id", "")
        self.qubit_count = self._get_int_from_request(form, "qubitCount", 0)
        self.until_step_index = self._get_int_from_request(form, "untilStepIndex", 0)
        self.steps = self._get_steps_from_request(form)
        self.amplitude_indices = self._get_amplitude_indices_from_request(form)
        self.device = "GPU" if form.get("useGpu", "false").lower() == "true" else "CPU"

    @staticmethod
    def _get_int_from_request(form, key: str, default: int) -> int:
        return int(form.get(key, default))

    @staticmethod
    def _get_amplitude_indices_from_request(form) -> list[int]:
        return [int(each) for each in form.get("amplitudeIndices", "").split(",") if each.isdigit()]

    @staticmethod
    def _get_steps_from_request(form) -> list[dict]:
        return json.loads(form.get("steps", "[]"))


@app.route("/backend.json", methods=["POST"])
def backend():
    """
    Handles the POST request to the /backend.json endpoint.

    This function processes the incoming request,
    runs the quantum circuit simulation using Qiskit,
    and returns the simulation results in JSON format.

    Returns:
        Response: A JSON response containing the simulation results or an error message.
    """
    try:
        request_data = RequestData(request.form)
        _log_request_data(
            request_data.circuit_id,
            request_data.qubit_count,
            request_data.until_step_index,
            request_data.amplitude_indices,
            request_data.steps,
            request_data.device,
        )

        step_results = cached_qiskit_runner.run(
            request_data.circuit_id,
            request_data.qubit_count,
            request_data.until_step_index,
            request_data.steps,
            request_data.device,
        )
        step_results_filtered = [_convert_result(result, request_data.amplitude_indices) for result in step_results]

        return jsonify(step_results_filtered)
    except json.decoder.JSONDecodeError as e:
        return _handle_error("Bad Request: Invalid input", f"JSON decode error: {e.doc}", HTTP_BAD_REQUEST)


def _handle_error(error_message: str, response_message: str, status_code: int) -> tuple[Response, int]:
    app.logger.exception(error_message)
    app.logger.exception(response_message)

    return jsonify({"error": error_message, "message": response_message}), status_code


def _log_request_data(
    circuit_id: str,
    qubit_count: int,
    until_step_index: int,
    amplitude_indices: list[int],
    steps: list[dict],
    device: str,
):
    app.logger.debug("circuit_id = %s", circuit_id)
    app.logger.debug("qubit_count = %d", qubit_count)
    app.logger.debug("until_step_index = %d", until_step_index)
    app.logger.debug("amplitude_indices = %s", amplitude_indices)
    app.logger.debug("steps = %s", steps)
    app.logger.debug("device = %s", device)


def _convert_result(result: dict, amplitude_indices: list[int] | None) -> dict:
    response = {}

    if "amplitudes" in result:
        response["amplitudes"] = _flatten_amplitude(_filter_amplitudes(result["amplitudes"], amplitude_indices))

    response["measuredBits"] = result["measuredBits"]

    return response


def _filter_amplitudes(statevector: dict[int, complex], amplitude_indices: list[int] | None) -> dict[int, complex]:
    if amplitude_indices is None:
        return statevector

    return {index: statevector[index] for index in amplitude_indices}


def _flatten_amplitude(amplitude: dict[int, complex]) -> qubit_amplitudes_type:
    return {index: (float(each.real), float(each.imag)) for index, each in amplitude.items()}