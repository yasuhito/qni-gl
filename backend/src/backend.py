import json
import logging
import traceback

from flask import Flask, jsonify, request
from flask_cors import CORS

from src.cirq_runner import CirqRunner

app = Flask(__name__)
CORS(app)


def setup_logger():
    """
    Gunicorn の stderr と backend.log の両方にログを出力するためのロガーをセットアップする
    """
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)

    # カスタムフォーマットを設定
    log_format = "[%(asctime)s] [%(levelname)s] %(message)s"
    date_format = "%Y-%m-%d %H:%M:%S %z"

    # Gunicorn の stderr にログを出力するためのハンドラ
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.DEBUG)
    stream_formatter = logging.Formatter(log_format, datefmt=date_format)
    stream_handler.setFormatter(stream_formatter)

    # backend.log ファイルにログを出力するためのハンドラ
    file_handler = logging.FileHandler("backend.log")
    file_handler.setLevel(logging.DEBUG)
    file_formatter = logging.Formatter(log_format, datefmt=date_format)
    file_handler.setFormatter(file_formatter)

    # ロガーにハンドラを追加
    logger.addHandler(stream_handler)
    logger.addHandler(file_handler)


setup_logger()


@app.route("/backend.json", methods=["POST"])
def backend():
    circuit_id = request.form.get("id")
    qubit_count = int(request.form.get("qubitCount"))
    step_index = int(request.form.get("stepIndex"))
    # targets には "0,1,2" のようなカンマ区切り整数が入っているので、リストに変換する
    targets = [int(x) for x in request.form.get("targets").split(",")]
    steps = json.loads(request.form.get("steps"))

    app.logger.debug("circuit_id = %s", circuit_id)
    app.logger.debug("qubit_count = %d", qubit_count)
    app.logger.debug("step_index = %d", step_index)
    app.logger.debug("targets.size = %d", len(targets))
    # app.logger.debug("steps = %s", steps)

    try:
        step_results = run_cirq(qubit_count, step_index, steps, targets)
        # app.logger.debug("step_results = %s", step_results)

        return jsonify(step_results)
    except Exception:
        app.logger.exception("An error occurred")
        app.logger.exception("Stack trace: %s", traceback.format_exc())
        return "Internal Server Error ", 500


def run_cirq(qubit_count, step_index, steps, targets):
    cirq_runner = CirqRunner(app.logger)
    circuit, measurement_moment = cirq_runner.build_circuit(steps, qubit_count)

    for each in str(circuit).split("\n"):
        app.logger.debug(each)

    result_list = cirq_runner.run_circuit_until_step_index(
        circuit, steps, measurement_moment, step_index, targets)

    # [complex ...] => {0: [real,img] ..}
    def convert_amp(amp):
        res = {}
        for i, c in amp.items():
            res[i] = [float(c.real), float(c.imag)]
        return res

    def convert_item(item):
        if ":amplitude" in item:
            if ":measuredBits" in item:
                return {"amplitudes": convert_amp(item[":amplitude"]), "measuredBits": item[":measuredBits"]}
            return {"amplitudes": convert_amp(item[":amplitude"])}
        if ":measuredBits" in item:
            return {"measuredBits": item[":measuredBits"]}
        return {}

    return [convert_item(item) for item in result_list]
