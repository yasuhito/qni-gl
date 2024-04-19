import cirq
import io
import sys
import numpy as np
# import qsimcirq
from sympy import *
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application, convert_xor
# sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from cirq.circuits import InsertStrategy


class cirqbridge:
    def __init__(self, logger):
        self.logger = logger
        return

    def lookup_measurement_label(self, _circuit_from_qni, label):
        numofdevices = 0
#        print("measurement_label: lookup for ", label)
#        sys.stdout.flush()
#        print("_circuit", _circuit_from_qni)
#        sys.stdout.flush()
        counter = 0
        label_found = 0
        for _i in _circuit_from_qni:
            if label_found == 1:
                break
#            print("_i, counter ", _i, counter)
#            sys.stdout.flush()
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
        label = 'm' + str(counter)
        return label

    def build_circuit(self, qubit_count, circuit_qni):
        transformations = (standard_transformations +
                           (implicit_multiplication_application,) + (convert_xor,))
        circuit_from_qni = []

        self.logger.debug("*** circuit_from_qni ***")
        self.logger.debug("qubit_count = {}".format(qubit_count))

        for step in circuit_qni:
            self.logger.debug(step)
            if len(step) > 0:
                # Cirq の最下位ビットは回路の一番下のワイヤになるので、'targets' を反転させる
                step[0]['targets'] = sorted(
                    list(map(lambda target_bit: qubit_count - target_bit - 1, step[0]['targets'])))
            circuit_from_qni.append(step)

        qubits = cirq.LineQubit.range(qubit_count)
        c = cirq.Circuit()
        m = 0
        measurement_moment = []
        _current_index = 0

        for step in circuit_from_qni:
            self.logger.debug("circuit step: {}".format(step))
            #            print("circuit column", step)
            #            sys.stdout.flush()
            moment = []
            measurement_moment.append([])

            # empty step is converted to I gate
            if len(step) == 0:
                for bit in range(qubit_count):
                    moment.append([cirq.I(qubits[bit])])

            for gate in step:
                if gate['type'] == u'H':
                    targetQubits = self._target_qubits(qubits, gate)
                    _c = [cirq.H(target) for target in targetQubits]
                elif gate['type'] == u'X':
                    targetQubits = self._target_qubits(qubits, gate)
                    if not "controls" in gate:
                        _c = [cirq.X(target) for target in targetQubits]
                    else:
                        controlQubits = [qubits[control]
                                         for control in gate['controls']]
                        _c = [cirq.ControlledOperation(
                            controlQubits, cirq.X(target)) for target in targetQubits]
                elif gate['type'] == u'Y':
                    targetQubits = self._target_qubits(qubits, gate)
                    _c = [cirq.Y(target) for target in targetQubits]
                elif gate['type'] == u'Z':
                    targetQubits = self._target_qubits(qubits, gate)
                    if not "controls" in gate:
                        _c = [cirq.Z(index) for index in targetQubits]
                    else:
                        controlQubits = [qubits[index]
                                         for index in gate['controls']]
                        _c = [cirq.ControlledOperation(
                            controlQubits, cirq.Z(index)) for index in targetQubits]
                elif gate['type'] == u'Rx':
                    _angle = gate['angle'].replace(u'π', 'pi')
                    expr = parse_expr(_angle, transformations=transformations)
                    angle = float(expr.evalf())
                    targetQubits = self._target_qubits(qubits, gate)
                    if not "controls" in gate:
                        _c = [cirq.rx(angle).on(index)
                              for index in targetQubits]
                    else:
                        controlQubits = [qubits[index]
                                         for index in gate['controls']]
                        _c = [cirq.ControlledOperation(controlQubits, cirq.rx(
                            angle).on(index)) for index in targetQubits]
                elif gate['type'] == u'Ry':
                    _angle = gate['angle'].replace(u'π', 'pi')
                    expr = parse_expr(_angle, transformations=transformations)
                    angle = float(expr.evalf())
                    targetQubits = self._target_qubits(qubits, gate)
                    if not "controls" in gate:
                        _c = [cirq.ry(angle).on(index)
                              for index in targetQubits]
                    else:
                        controlQubits = [qubits[index]
                                         for index in gate['controls']]
                        _c = [cirq.ControlledOperation(controlQubits, cirq.ry(
                            angle).on(index)) for index in targetQubits]
                elif gate['type'] == u'Rz':
                    _angle = gate['angle'].replace(u'π', 'pi')
                    expr = parse_expr(_angle, transformations=transformations)
                    angle = float(expr.evalf())
                    targetQubits = self._target_qubits(qubits, gate)
                    if not "controls" in gate:
                        _c = [cirq.rz(angle).on(index)
                              for index in targetQubits]
                    else:
                        controlQubits = [qubits[index]
                                         for index in gate['controls']]
                        _c = [cirq.ControlledOperation(controlQubits, cirq.rz(
                            angle).on(index)) for index in targetQubits]
                elif gate['type'] == u'P':
                    _angle = gate['angle'].replace(u'π', 'pi') + '/ pi'
                    expr = parse_expr(_angle, transformations=transformations)
                    angle = float(expr.evalf())
                    targetQubits = self._target_qubits(qubits, gate)
                    if not "controls" in gate:
                        _c = [cirq.ZPowGate(exponent=angle).on(index)
                              for index in targetQubits]
                    else:
                        controlQubits = [qubits[index]
                                         for index in gate['controls']]
                        _c = [cirq.ControlledOperation(controlQubits, cirq.ZPowGate(
                            exponent=angle).on(index)) for index in targetQubits]
                elif gate['type'] == u'S':
                    targetQubits = self._target_qubits(qubits, gate)
                    if not "controls" in gate:
                        _c = [cirq.Z(index)**0.5 for index in targetQubits]
                    else:
                        controlQubits = [qubits[index]
                                         for index in gate['controls']]
                        _c = [cirq.ControlledOperation(controlQubits, cirq.Z(
                            index)**0.5) for index in targetQubits]
                elif gate['type'] == u'S†':
                    targetQubits = self._target_qubits(qubits, gate)
                    if not "controls" in gate:
                        _c = [cirq.Z(index)**(-0.5) for index in targetQubits]
                    else:
                        controlQubits = [qubits[index]
                                         for index in gate['controls']]
                        _c = [cirq.ControlledOperation(controlQubits, cirq.Z(
                            index)**(-0.5)) for index in targetQubits]
                elif gate['type'] == u'T':
                    targetQubits = self._target_qubits(qubits, gate)
                    if not "controls" in gate:
                        _c = [cirq.Z(index)**0.25 for index in targetQubits]
                    else:
                        controlQubits = [qubits[index]
                                         for index in gate['controls']]
                        _c = [cirq.ControlledOperation(controlQubits, cirq.Z(
                            index)**0.25) for index in targetQubits]
                elif gate['type'] == u'T†':
                    targetQubits = self._target_qubits(qubits, gate)
                    if not "controls" in gate:
                        _c = [cirq.Z(index)**(-0.25) for index in targetQubits]
                    else:
                        controlQubits = [qubits[index]
                                         for index in gate['controls']]
                        _c = [cirq.ControlledOperation(controlQubits, cirq.Z(
                            index)**(-0.25)) for index in targetQubits]
                elif gate['type'] == u'X^½':
                    targetQubits = self._target_qubits(qubits, gate)
                    if not "controls" in gate:
                        _c = [cirq.X(index)**0.5 for index in targetQubits]
                    else:
                        controlQubits = [qubits[index]
                                         for index in gate['controls']]
                        _c = [cirq.ControlledOperation(controlQubits, cirq.X(
                            index)**0.5) for index in targetQubits]
                elif gate['type'] == u'•':
                    if "controls" in gate:
                        #                        print("control is not supported for CZ gate", gate['type'])
                        #                        sys.stdout.flush()
                        exit(1)
                    targetQubits = self._target_qubits(qubits, gate)
                    if len(targetQubits) == 2:
                        _c = [cirq.CZ(qubits[gate['targets'][0]],
                                      qubits[gate['targets'][1]])]
                    elif len(targetQubits) < 2:
                        _c = []
                    else:
                        # we regard the first and the second qubit as the target qubits,
                        # and others are controlled qubits.
                        controlQubits = []
                        for _i in range(len(gate['targets'])-2):
                            controlQubits.append(
                                qubits[gate['targets'][_i+2]])
                        sys.stdout.flush()
                        _c = [cirq.ControlledOperation(controlQubits, cirq.CZ(
                            qubits[gate['targets'][0]], qubits[gate['targets'][1]]))]
                elif gate['type'] == u'|0>':
                    targetQubits = self._target_qubits(qubits, gate)
                    _c = [cirq.ops.reset(index) for index in targetQubits]
                elif gate['type'] == u'|1>':
                    targetQubits = self._target_qubits(qubits, gate)
                    _c = [cirq.ops.reset(index) for index in targetQubits]
                    _c.append([cirq.X(index) for index in targetQubits])
                elif gate['type'] == u'Measure':
                    targetQubits = self._target_qubits(qubits, gate)
                    _c = [cirq.measure(targetQubits[index], key='m' + str(m + index))
                          for index in range(len(targetQubits))]
                    __m = ['m' + str(m + index)
                           for index in range(len(targetQubits))]
                    _m = [[__m[index], gate['targets'][index]]
                          for index in range(len(targetQubits))]
                    measurement_moment[_current_index].append(_m)
                    m = m + len(targetQubits)
                elif gate['type'] == u'Swap':
                    if len(gate['targets']) != 2:
                        _c = []
                    else:
                        targetqubit0 = qubits[gate['targets'][0]]
                        targetqubit1 = qubits[gate['targets'][1]]
                        _c = []
                        _c.append(cirq.SWAP(targetqubit0, targetqubit1))
                elif gate['type'] == u'Bloch':
                    targetQubits = self._target_qubits(qubits, gate)
                    # add a dummy gate to count Bloch operation as a step
                    _c = [cirq.ops.I(index) for index in targetQubits]
                elif gate['type'] == u'':
                    pass  # nop
                else:
                    #                    print("unsupported gate", gate['type'])
                    #                    sys.stdout.flush()
                    exit(1)
                for __c in _c:
                    moment.append(__c)
            c.append(moment, strategy=InsertStrategy.NEW_THEN_INLINE)
            _current_index = _current_index + 1
#        print(c)
#        sys.stdout.flush()
        return c, measurement_moment

    def run_circuit_until_step_index(self, c, measurement_moment, step_index, steps):
        self.logger.debug("run_circuit_until_step_index()")
        for each in str(c).split("\n"):
            self.logger.debug(each)
        self.logger.debug("steps: {}".format(steps))
        self.logger.debug("step_index (corrected): {}".format(step_index))
        self.logger.debug("steps(len): {}".format(len(steps)))

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
                        if _d['type'] == u'|1>':
                            sleep_flag = 1
            else:
                sleep_flag = 0
            if sleep_flag == 1:
                continue

            self.logger.debug("step[{}]: {}".format(counter, steps[counter]))

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
                self.logger.debug("amplitudes: {}".format(step.state_vector()))
#                print("amplitudes: ", step.state_vector())
#                sys.stdout.flush()
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
        return _data

    def _target_qubits(self, qubits, gate):
        return [qubits[each] for each in gate['targets']]
