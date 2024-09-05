import json
import logging
import traceback

from flask import Flask, jsonify, request
from flask_cors import CORS

from src.cirq_runner import CirqRunner

LOG_FORMAT = "[%(asctime)s] [%(levelname)s] %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S %z"
LOG_FILE = "backend.log"
HTTP_BAD_REQUEST = 400
HTTP_INTERNAL_SERVER_ERROR = 500

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
    try:
        circuit_id, qubit_count, step_index, targets, steps = _get_request_data()
        _log_request_data(circuit_id, qubit_count, step_index, targets, steps)

        step_results = _run_cirq(qubit_count, step_index, steps, targets)
        return jsonify(step_results)
    except json.JSONDecodeError as e:
        return _handle_error(f"An error occurred: {e!s}", "Bad Request: Invalid input", HTTP_BAD_REQUEST)
    except RuntimeError as e:
        return _handle_error(
            f"An unexpected error occurred: {
                e!s}", "Internal Server Error", HTTP_INTERNAL_SERVER_ERROR
        )


def _get_request_data():
    circuit_id = request.form.get("id", "")
    qubit_count = _get_int_from_request("qubitCount", 0)
    step_index = _get_int_from_request("stepIndex", 0)
    targets = _get_targets_from_request()
    steps = _get_steps_from_request()
    return circuit_id, qubit_count, step_index, targets, steps


def _get_int_from_request(key, default):
    return int(request.form.get(key, default))


def _get_targets_from_request():
    return [int(each) for each in request.form.get("targets", "").split(",") if each.isdigit()]


def _get_steps_from_request():
    return json.loads(request.form.get("steps", "[]"))


def _handle_error(log_message, response_message, status_code):
    app.logger.exception(log_message)
    if status_code == HTTP_INTERNAL_SERVER_ERROR:
        app.logger.exception("Stack trace: %s", traceback.format_exc())
    return response_message, status_code


def _log_request_data(circuit_id, qubit_count, step_index, targets, steps):
    app.logger.debug("circuit_id = %s", circuit_id)
    app.logger.debug("qubit_count = %d", qubit_count)
    app.logger.debug("step_index = %d", step_index)
    app.logger.debug("targets.size = %d", len(targets))
    app.logger.debug("steps = %s", steps)


def _run_cirq(qubit_count, step_index, steps, targets):
    cirq_runner = CirqRunner(app.logger)
    circuit, measurements = cirq_runner.build_circuit(steps, qubit_count)

    _log_circuit(circuit)

    results = cirq_runner.run_circuit(
        circuit, measurements, step_index, targets)

    return [_convert_result(result) for result in results]


def _log_circuit(circuit):
    for each in str(circuit).split("\n"):
        app.logger.debug(each)


def _convert_result(result):
    response = {}

    if ":amplitude" in result:
        response["amplitudes"] = _flatten_amplitude(result[":amplitude"])

    if ":measuredBits" in result:
        response["measuredBits"] = result[":measuredBits"]

    return response


def _flatten_amplitude(amplitude):
    return {index: [float(each.real), float(each.imag)] for index, each in amplitude.items()}
