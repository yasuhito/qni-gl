from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from flask import Flask, jsonify, request
from flask_cors import CORS

if TYPE_CHECKING:
    from qni.types import QubitAmplitudesType

from qni.cached_qiskit_runner import CachedQiskitRunner
from qni.circuit_request_data import CircuitRequestData

LOG_FORMAT = "[%(asctime)s] [%(levelname)s] %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S %z"
LOG_FILE = "backend.log"

app = Flask(__name__)
CORS(app)

cached_qiskit_runner = CachedQiskitRunner(app.logger)


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
    circuit_request_data = CircuitRequestData(request.form)
    _log_request_data(circuit_request_data)

    step_results = cached_qiskit_runner.run(circuit_request_data)
    step_results_filtered = _filter_and_convert_step_results(step_results, circuit_request_data)

    return jsonify(step_results_filtered)


def _log_request_data(request_data: CircuitRequestData):
    app.logger.debug("circuit_id = %s", request_data.circuit_id)
    app.logger.debug("qubit_count = %d", request_data.qubit_count)
    app.logger.debug("until_step_index = %d", request_data.until_step_index)
    app.logger.debug("amplitude_indices = %s", request_data.amplitude_indices)
    app.logger.debug("steps = %s", request_data.steps)
    app.logger.debug("device = %s", request_data.device)


def _filter_and_convert_step_results(step_results: list[dict], circuit_request_data: CircuitRequestData) -> list[dict]:
    return [_convert_step_result(result, circuit_request_data) for result in step_results]


def _convert_step_result(step_result: dict, circuit_request_data: CircuitRequestData) -> dict:
    new_step_result = {}

    if "amplitudes" in step_result:
        new_step_result["amplitudes"] = _flatten_amplitude(
            _filter_amplitudes(step_result["amplitudes"], circuit_request_data.amplitude_indices)
        )

    new_step_result["measuredBits"] = step_result["measuredBits"]

    return new_step_result


def _filter_amplitudes(statevector: dict[int, complex], amplitude_indices: list[int]) -> dict[int, complex]:
    if len(amplitude_indices) == 0:
        return statevector

    return {index: statevector[index] for index in amplitude_indices}


def _flatten_amplitude(amplitude: dict[int, complex]) -> QubitAmplitudesType:
    return {index: (float(each.real), float(each.imag)) for index, each in amplitude.items()}
