import sys

import cirq
from cirq.circuits import InsertStrategy


class CirqRunner:
    def __init__(self, logger):
        self.logger = logger

    def lookup_measurement_label(self, _circuit_from_qni, label):
        counter = 0
        label_found = 0
        for _i in _circuit_from_qni:
            if label_found == 1:
                break
            if _i == []:
                continue
            for _p in range(len(_i)):
                if 'flag' in _i[_p]:
                    if _i[_p]['type'] == "Measure" and _i[_p]['flag'] != label:
                        counter = counter + 1
                    elif _i[_p]['type'] == "Measure" and _i[_p]['flag'] == label:
                        #                        print("found flag _i[%d]" % _p,  _i[_p]['flag'])
                        label_found = 1
                        break
            sys.stdout.flush()
#        print("counter", counter)
        return 'm' + str(counter)

    def build_circuit(self, qubit_count, circuit_qni):
        circuit_from_qni = []

        # Function to reverse and sort the target and control bits
        def reverse_and_sort(bits, qubit_count):
            return sorted(qubit_count - bit - 1 for bit in bits)

        for step in circuit_qni:
            for gate in step:
                if 'targets' in gate:
                    gate['targets'] = reverse_and_sort(
                        gate['targets'], qubit_count)
                if 'controls' in gate:
                    gate['controls'] = reverse_and_sort(
                        gate['controls'], qubit_count)
            circuit_from_qni.append(step)

        qubits = cirq.LineQubit.range(qubit_count)
        circuit = cirq.Circuit()
        measurement_label_number = 0
        measurement_moment = []
        moment_index = 0

        for step in circuit_from_qni:
            moment = []
            measurement_moment.append([])

            # empty step is converted to I gate
            if len(step) == 0:
                for bit in range(qubit_count):
                    moment.append([cirq.I(qubits[bit])])

            for gate in step:
                if gate['type'] == 'H':
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.H(target) for target in targets]
                elif gate['type'] == 'X':
                    targets = self._target_qubits(qubits, gate)
                    if "controls" not in gate:
                        operations = [cirq.X(target) for target in targets]
                    else:
                        control_qubits = [qubits[control]
                                          for control in gate['controls']]
                        operations = [cirq.ControlledOperation(
                            control_qubits, cirq.X(target)) for target in targets]
                elif gate['type'] == 'Y':
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.Y(target) for target in targets]
                elif gate['type'] == 'Z':
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.Z(target) for target in targets]
                elif gate['type'] == 'X^½':
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.X(target)**0.5 for target in targets]
                elif gate['type'] == 'S':
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.Z(target)**0.5 for target in targets]
                elif gate['type'] == 'S†':
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.Z(target)**(-0.5) for target in targets]
                elif gate['type'] == 'T':
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.Z(target)**0.25 for target in targets]
                elif gate['type'] == 'T†':
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.Z(target)**(-0.25)
                                  for target in targets]
                elif gate['type'] == 'Swap':
                    operations = []
                    if len(gate['targets']) == 2:
                        target0 = qubits[gate['targets'][0]]
                        target1 = qubits[gate['targets'][1]]
                        operations.append(cirq.SWAP(target0, target1))
                elif gate['type'] == '•':
                    targets = self._target_qubits(qubits, gate)
                    if len(targets) < 2:
                        operations = []
                    elif len(targets) == 2:
                        operations = [cirq.CZ(qubits[gate['targets'][0]],
                                      qubits[gate['targets'][1]])]
                    else:
                        controls = [qubits[gate['targets'][index]]
                                    for index in range(len(gate['targets']) - 2)]
                        operations = [cirq.ControlledOperation(
                            controls, cirq.CZ(qubits[gate['targets'][-2]], qubits[gate['targets'][-1]]))]
                elif gate['type'] == '|0>':
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.ops.reset(target) for target in targets]
                elif gate['type'] == '|1>':
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.ops.reset(target) for target in targets]
                    operations.append([cirq.X(target) for target in targets])
                elif gate['type'] == 'Measure':
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.measure(targets[index], key='m' + str(measurement_label_number + index))
                                  for index in range(len(targets))]
                    measurement_ids = ['m' + str(measurement_label_number + index)
                                       for index in range(len(targets))]
                    measurement_pairs = [[measurement_ids[index], gate['targets'][index]]
                                         for index in range(len(targets))]
                    measurement_moment[moment_index].append(measurement_pairs)
                    measurement_label_number = measurement_label_number + \
                        len(targets)
                else:
                    raise ValueError(
                        "Unknown operation: {}".format(gate['type']))

                for each in operations:
                    moment.append(each)

            circuit.append(moment, strategy=InsertStrategy.NEW_THEN_INLINE)
            moment_index = moment_index + 1

        return circuit, measurement_moment

    def run_circuit_until_step_index(self, c, measurement_moment, step_index, steps, targets):
        cirq_simulator = cirq.Simulator()
        _data = []
        counter = -1
        sleep_flag = 0  # we need padding for |1> because implimented as R + X
        for _counter, step in enumerate(cirq_simulator.simulate_moment_steps(c)):
            if sleep_flag == 0:
                counter = counter + 1
            dic = {}
            dic[':blochVectors'] = {}
            dic[':measuredBits'] = {}
            if sleep_flag == 0:
                for _d in steps[counter]:
                    if 'type' in _d:
                        if _d['type'] == '|1>':
                            sleep_flag = 1
            else:
                sleep_flag = 0
            if sleep_flag == 1:
                continue

            if steps[counter] == []:
                pass
            else:
                bloch_index = -1
                for _bloch_index in range(len(steps[counter])):
                    if steps[counter][_bloch_index]['type'] == 'Bloch':
                        bloch_index = _bloch_index
#                print("bloch_index ", bloch_index)
#                sys.stdout.flush()
                if bloch_index != -1:
                    for _bloch_target in steps[counter][bloch_index]['targets']:
                        blochxyz = cirq.qis.bloch_vector_from_state_vector(
                            step.state_vector(), _bloch_target)
                        dic[':blochVectors'][_bloch_target] = blochxyz
#                        print("bloch sphere: ", blochxyz)
#                        sys.stdout.flush()
            if counter == step_index:
                dic[':amplitude'] = step.state_vector()

            _data.append(dic)
        if len(step.measurements) != 0:
            for i in range(len(measurement_moment)):
                if len(measurement_moment[i]) != 0:
                    #                    print("searching key", measurement_moment[i])
                    for k in range(len(measurement_moment[i])):
                        for j in range(len(measurement_moment[i][k])):
                            _key = measurement_moment[i][k][j][0]
                            _qubit = measurement_moment[i][k][j][1]
                            _step = i
                            if _key not in step.measurements:
                                break
                            _value = step.measurements[_key][0]
#                            print("step: ", _step, "key:", _key, "target qubit", _qubit, "value ", _value)
#                            sys.stdout.flush()
                            _data[i][':measuredBits'][_qubit] = _value
#        print("_data ", _data)
#        sys.stdout.flush()
        # targets に必要な振幅のインデックスが入っているので、
        # _data.amplitudes のうち、targets に含まれるインデックスのみを返す
        # _data['amplitudes'] = {}

        target_amplitudes = _data[step_index][':amplitude']
        _data[step_index][':amplitude'] = {}

        for _target in targets:
            _data[step_index][':amplitude'][_target] = target_amplitudes[_target]

        return _data

    def _target_qubits(self, qubits, gate):
        return [qubits[each] for each in gate['targets']]
