# TODO: /sim などで使っている "sim" → "backend" にすべて変更

from flask import Flask, Response, request
import sys
import io
import json
import logging
import maho

# logger
logger = logging.Logger('sim.py')
stderr_handler = logging.StreamHandler(sys.stderr)
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
stderr_handler.setFormatter(formatter)
logger.addHandler(stderr_handler)
logger.setLevel(logging.DEBUG)
stderr_handler.setLevel(logging.DEBUG)

app = Flask(__name__)

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


@app.route('/sim', methods=["GET"])
def sim():
    id = request.args.get('id')
    qubit_count = int(request.args.get('qubitCount'))
    step_index = int(request.args.get('stepIndex'))
    targets = request.args.get('targets')
    steps = json.loads(request.args.get('steps'))

    logger.debug("circuit_id = %s", id)
    logger.debug("qubit_count = %d", qubit_count)
    logger.debug("step_index = %d", step_index)
    logger.debug("targets = %s", targets)
    logger.debug("steps = %s", steps)

    try:
        step_results = maho_call(qubit_count, step_index, steps)
        logger.debug("step_results = %s", step_results)

        step_results_json = Response(json.dumps(step_results),
                                     mimetype='application/json')

        return step_results_json
    except Exception as e:
        logger.error("An error occurred: %s", str(e))
        return "Internal Server Error ", 500


def maho_call(qubit_count, step_index, steps):
    br = maho.cirqbridge(logger)
    circuit, measurement_moment = br.build_circuit(qubit_count, steps)

    for each in str(circuit).split("\n"):
        logger.debug(each)

    result_list = br.run_circuit_until_step_index(
        circuit, measurement_moment, step_index, steps)
    # logger.debug(result_list)

    # [complex ...] => {0: [real,img] ..}
    def convert_amp(amp):
        res = {}
        for i in range(amp.size):
            res[i] = [float(amp[i].real), float(amp[i].imag)]
        return res

    def convert_item(item):
        if ":amplitude" in item:
            if ":measuredBits" in item:
                return {"amplitudes": convert_amp(item[":amplitude"]), "measuredBits": item[":measuredBits"]}
            else:
                return {"amplitudes": convert_amp(item[":amplitude"])}
        else:
            if ":measuredBits" in item:
                return {"measuredBits": item[":measuredBits"]}
        return {}

    return [convert_item(item) for item in result_list]
