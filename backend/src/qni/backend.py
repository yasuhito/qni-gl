from __future__ import annotations

from typing import TYPE_CHECKING

from flask import Flask, jsonify, request
from flask_cors import CORS

if TYPE_CHECKING:
    from qni.types import (
        QiskitStepAmplitudes,
        QiskitStepResult,
        StepAmplitudes,
        StepResult,
    )

from qni.cached_qiskit_runner import CachedQiskitRunner
from qni.circuit_request_data import CircuitRequestData
from qni.logging_config import setup_custom_logger

app = Flask(__name__)
CORS(app)

setup_custom_logger()
cached_qiskit_runner = CachedQiskitRunner(app.logger)


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

    qiskit_step_results = cached_qiskit_runner.run(circuit_request_data)
    step_results = _convert_and_filter_qiskit_step_results(qiskit_step_results, circuit_request_data)

    return jsonify(step_results)


def _log_request_data(request_data: CircuitRequestData):
    app.logger.debug("circuit_id = %s", request_data.circuit_id)
    app.logger.debug("qubit_count = %d", request_data.qubit_count)
    app.logger.debug("until_step_index = %d", request_data.until_step_index)
    app.logger.debug("amplitude_indices = %s", request_data.amplitude_indices)
    app.logger.debug("steps = %s", request_data.steps)
    app.logger.debug("device = %s", request_data.device)


def _convert_and_filter_qiskit_step_results(
    qiskit_step_results: list[QiskitStepResult],
    circuit_request_data: CircuitRequestData,
) -> list[StepResult]:
    return [_convert_qiskit_step_result(each, circuit_request_data) for each in qiskit_step_results]


def _convert_qiskit_step_result(
    qiskit_step_result: QiskitStepResult,
    circuit_request_data: CircuitRequestData,
) -> StepResult:
    measured_bits = qiskit_step_result["measuredBits"]

    amplitudes_qiskit = qiskit_step_result.get("amplitudes", None)
    if amplitudes_qiskit is None:
        return {"measuredBits": measured_bits}

    amplitudes = _flatten_amplitudes(_filter_amplitudes(amplitudes_qiskit, circuit_request_data.amplitude_indices))
    return {"amplitudes": amplitudes, "measuredBits": measured_bits}


def _filter_amplitudes(qiskit_amplitudes: QiskitStepAmplitudes, amplitude_indices: list[int]) -> QiskitStepAmplitudes:
    return {each: qiskit_amplitudes[each] for each in amplitude_indices} if amplitude_indices else qiskit_amplitudes


def _flatten_amplitudes(qiskit_amplitudes: QiskitStepAmplitudes) -> StepAmplitudes:
    return {index: (float(each.real), float(each.imag)) for index, each in qiskit_amplitudes.items()}
