import cirq
import qsimcirq

def _create_identity_circuit(length):
    qubits = cirq.LineQubit.range(length)
    return cirq.Circuit([ cirq.I(qubits[i]) for i in range(length) ])

class GpuCirqRunner:
    def __init__(self, cirq_runner):
        self.cirq_runner = cirq_runner
        self.gpu_options = qsimcirq.QSimOptions(
            max_fused_gate_size=3,
            cpu_threads=1,
            disable_gpu=False,
            gpu_mode=1,
            verbosity=False
        )

    def build_circuit(self, qubit_count, circuit_qni):
        return self.cirq_runner.build_circuit(qubit_count, circuit_qni)

    def run_circuit_until_step_index(self, c, measurement_moment, step_index, steps, targets):
        cirq_simulator = qsimcirq.QSimSimulator(qsim_options=self.gpu_options)
        _data = []
        counter = -1
        sleep_flag = 0  # we need padding for |1> because implimented as R + X
        identity_circuit = _create_identity_circuit(len(c.all_qubits())) # To adjust the size of the state vector
        for _counter in range(len(c)):
            if sleep_flag == 0:
                counter += 1
                for _d in steps[counter]:
                    if 'type' in _d:
                        if _d['type'] == u'|1>':
                            sleep_flag = 1
            else:
                sleep_flag = 0
            if sleep_flag == 1:
                continue

            circuit = identity_circuit + c[:_counter+1]
            step = cirq_simulator.simulate(circuit)

            dic = {}
            dic[':blochVectors'] = {}
            dic[':measuredBits'] = {}
            if steps[counter] == []:
                pass
            else:
                bloch_index = -1
                for _bloch_index in range(len(steps[counter])):
                    if steps[counter][_bloch_index]['type'] == 'Bloch':
                        bloch_index = _bloch_index
                if bloch_index != -1:
                    for _bloch_target in steps[counter][bloch_index]['targets']:
                        blochxyz = cirq.qis.bloch_vector_from_state_vector(
                            step.state_vector(), _bloch_target)
                        dic[':blochVectors'][_bloch_target] = blochxyz
            if counter == step_index:
                dic[':amplitude'] = step.state_vector()

            _data.append(dic)

        if c.has_measurements():
            run_result = cirq_simulator.run(c)

            for i, _measurement in enumerate(measurement_moment):
                if len(_measurement) == 0:
                    continue

                for _measurement_step in _measurement:
                    for _m in _measurement_step:
                        _key = _m[0]
                        _qubit = _m[1]
                        if _key not in run_result.records:
                            break
                        _value = run_result.records[_key][0][0][0].item() # numpy's int64 to python int
                        _data[i][':measuredBits'][_qubit] = _value

        target_amplitudes = _data[step_index][':amplitude']
        _data[step_index][':amplitude'] = {}

        for _target in targets:
            _data[step_index][':amplitude'][_target] = target_amplitudes[_target]

        return _data