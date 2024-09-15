from __future__ import annotations

import json
import logging

from flask import Flask, Response, jsonify, request
from flask_cors import CORS

from src.qiskit_runner import QiskitRunner

LOG_FORMAT = "[%(asctime)s] [%(levelname)s] %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S %z"
LOG_FILE = "backend.log"
HTTP_BAD_REQUEST = 400

app = Flask(__name__)
CORS(app)


def _add_logger_handler(handler, formatter):
    handler.setLevel(logging.DEBUG)
    handler.setFormatter(formatter)
    logging.getLogger().addHandler(handler)


def _setup_custom_logger():
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)

    formatter = logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT)

    _add_logger_handler(logging.StreamHandler(), formatter)
    _add_logger_handler(logging.FileHandler(LOG_FILE), formatter)


_setup_custom_logger()


@app.route("/backend.json", methods=["POST"])
def backend():
    """
    Handles the POST request to the /backend.json endpoint.

    This function processes the incoming request,
    runs the quantum circuit simulation using Cirq,
    and returns the simulation results in JSON format.

    Returns:
        Response: A JSON response containing the simulation results or an error message.
    """
    try:
        circuit_id, qubit_count, until_step_index, steps, amplitude_indices, device = _get_request_data()
        _log_request_data(circuit_id, qubit_count, until_step_index, amplitude_indices, steps, device)

        step_results = _run_cirq(qubit_count, until_step_index, steps, amplitude_indices, device)
        return jsonify(step_results)
    except json.decoder.JSONDecodeError as e:
        return _handle_error("Bad Request: Invalid input", f"JSON decode error: {e.doc}", HTTP_BAD_REQUEST)


def _get_request_data() -> tuple[str, int, int, list[dict], list[int], str]:
    circuit_id = request.form.get("id", "")
    qubit_count = _get_int_from_request("qubitCount", 0)
    until_step_index = _get_int_from_request("untilStepIndex", 0)
    steps = _get_steps_from_request()
    amplitude_indices = _get_amplitude_indices_from_request()
    use_gpu = request.form.get("useGpu", "false").lower() == "true"
    device = "GPU" if use_gpu else "CPU"
    return circuit_id, qubit_count, until_step_index, steps, amplitude_indices, device


def _get_int_from_request(key: str, default: int) -> int:
    return int(request.form.get(key, default))


def _get_amplitude_indices_from_request() -> list[int]:
    return [int(each) for each in request.form.get("amplitudeIndices", "").split(",") if each.isdigit()]


def _get_steps_from_request() -> list[dict]:
    return json.loads(request.form.get("steps", "[]"))


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


def _run_cirq(
    qubit_count: int, until_step_index: int, steps: list, amplitude_indices: list[int], device: str
) -> list[dict]:
    results = QiskitRunner(app.logger).run_circuit(
        steps,
        qubit_count=qubit_count,
        until_step_index=until_step_index,
        amplitude_indices=amplitude_indices,
        device=device,
    )

    return [_convert_result(result) for result in results]


def _convert_result(result: dict) -> dict:
    response = {}

    if "amplitudes" in result:
        response["amplitudes"] = _flatten_amplitude(result["amplitudes"])

    response["measuredBits"] = result["measuredBits"]

    return response


def _flatten_amplitude(amplitude: list[complex]) -> dict[int, list[float]]:
    return {index: [float(each.real), float(each.imag)] for index, each in enumerate(amplitude)}
