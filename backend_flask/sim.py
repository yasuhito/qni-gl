from flask import Flask, make_response, request
import sys
import io
import json
import random
import logging
import maho

logger = logging.Logger('myLogger')

app = Flask(__name__)

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

@app.route('/sim', methods=["GET"])
def sim():
    print("args = ", request.args)
    id = request.args.get('id')
    qubit_count = int(request.args.get('qubitCount'))
    step_index = int(request.args.get('stepIndex'))
    targets = request.args.get('targets')
    print("targets = ", request.args.get('targets'))
    steps = json.loads(request.args.get('steps'))
    print("steps = ", steps)
    try:
        steps = insert_ident(steps, qubit_count)
        steps = reverse_targets(steps, qubit_count)
        print("steps = ", steps)

        step_results = maho_call(qubit_count, step_index, steps)
        print(step_results)
        return step_results
    except Exception as e:
        logging.exception(e)
        return "Internal Server Error ", 500

@app.route('/simold', methods=["POST"])
def simold():
    if not request.headers.get("Content-Type") == 'application/json':
        return "not supported Content-Type", 400

    req = json.loads(request.data.decode('utf-8'))
        
    try:
        return json_process(req)
    except Exception as e:
        logging.exception(e)
        return "Internal Server Error ", 500


def maho_call(qubit_count, step_index, steps):
    br = maho.cirqbridge(logger)
    circuit, measurement_moment = br.build_circuit(qubit_count, steps)
    logger.debug(str(circuit))
    result_list = br.run_circuit_until_step_index(circuit, measurement_moment, step_index, steps)
    logger.debug(result_list)

    # [complex ...] => {0: [real,img] ..}
    def convert_amp(amp):
        res = {}
        for i in range(amp.size):
            res[i] = [float(amp[i].real), float(amp[i].imag)]
        return res

    def convert_item(item):
        if ":amplitude" in item:
            return {"amplitudes": convert_amp(item[":amplitude"])}
        return {}

    return [convert_item(item) for item in result_list]

def insert_ident(steps, qubit_count):
    tmp_d = {'type': '…', 'targets': list(range(qubit_count))}
    steps.insert(1, [tmp_d])
    return steps

def reverse_targets(steps, qubit_count):
    def reverse_one(l):
        return [qubit_count-1-i for i in l]
    def reverse_one_dict(d):
        d2 = d.copy()
        d2['targets'] = reverse_one(d['targets'])
        return d2
    return [[reverse_one_dict(d) for d in step] for step in steps]


def json_process(json_dict):
    # JSON の各プロパティを (とりあえず) 変数に入れとく

    circuit_id = json_dict["id"]
    qubit_count = json_dict["qubitCount"]
    step_index = json_dict["stepIndex"]
    steps = json_dict["steps"]
    targets = json_dict["targets"]

    logger.debug(circuit_id)
    logger.debug(qubit_count)
    logger.debug(step_index)
    logger.debug(steps)
    logger.debug(targets)

    steps = insert_ident(steps, qubit_count)
    steps = reverse_targets(steps, qubit_count)
    logger.debug(steps)

    step_results = maho_call(qubit_count, step_index, steps)
    logger.debug(step_results)
    return step_results

