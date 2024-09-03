import cirq
from cirq.circuits import InsertStrategy


class CirqRunner:
    VALID_SWAP_TARGET_COUNT = 2
    MINIMAL_CZ_CONTROL_COUNT = 2

    def __init__(self, logger=None):
        self.logger = logger

    def build_circuit(self, steps, qubit_count=None):
        if qubit_count is None:
            qubit_count = (
                max(
                    max((max(gate.get("targets", [-1]))
                        for step in steps for gate in step), default=-1),
                    max((max(gate.get("controls", [-1]))
                        for step in steps for gate in step), default=-1),
                )
                + 1
            )
        circuit_from_qni = []

        # Function to reverse and sort the target and control bits
        def reverse_and_sort(bits, qubit_count):
            return sorted(qubit_count - bit - 1 for bit in bits)

        for step in steps:
            for gate in step:
                if "targets" in gate:
                    gate["targets"] = reverse_and_sort(
                        gate["targets"], qubit_count)
                if "controls" in gate:
                    gate["controls"] = reverse_and_sort(
                        gate["controls"], qubit_count)
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
                moment = [[cirq.I(qubits[bit])] for bit in range(qubit_count)]

            for gate in step:
                if gate["type"] == "H":
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.H(target) for target in targets]
                elif gate["type"] == "X":
                    targets = self._target_qubits(qubits, gate)
                    if "controls" not in gate:
                        operations = [cirq.X(target) for target in targets]
                    else:
                        control_qubits = [qubits[control]
                                          for control in gate["controls"]]
                        operations = [cirq.ControlledOperation(
                            control_qubits, cirq.X(target)) for target in targets]
                elif gate["type"] == "Y":
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.Y(target) for target in targets]
                elif gate["type"] == "Z":
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.Z(target) for target in targets]
                elif gate["type"] == "X^½":
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.X(target) ** 0.5 for target in targets]
                elif gate["type"] == "S":
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.Z(target) ** 0.5 for target in targets]
                elif gate["type"] == "S†":
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.Z(target) ** (-0.5)
                                  for target in targets]
                elif gate["type"] == "T":
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.Z(target) ** 0.25 for target in targets]
                elif gate["type"] == "T†":
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.Z(target) ** (-0.25)
                                  for target in targets]
                elif gate["type"] == "Swap":
                    operations = []
                    if self._is_valid_swap(gate):
                        target0 = qubits[gate["targets"][0]]
                        target1 = qubits[gate["targets"][1]]
                        operations.append(cirq.SWAP(target0, target1))
                    else:
                        operations = [cirq.I(qubits[target])
                                      for target in gate["targets"]]
                elif gate["type"] == "•":
                    targets = self._target_qubits(qubits, gate)
                    if self._is_invalid_cz(gate):
                        operations = [cirq.I(qubits[gate["targets"][0]])]
                    elif self._is_minimally_valid_cz(gate):
                        operations = [
                            cirq.CZ(qubits[gate["targets"][0]], qubits[gate["targets"][1]])]
                    else:
                        controls = [qubits[gate["targets"][index]]
                                    for index in range(len(gate["targets"]) - 2)]
                        operations = [
                            cirq.ControlledOperation(
                                controls, cirq.CZ(
                                    qubits[gate["targets"][-2]], qubits[gate["targets"][-1]])
                            )
                        ]
                elif gate["type"] == "|0>":
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.ops.reset(target) for target in targets]
                elif gate["type"] == "|1>":
                    targets = self._target_qubits(qubits, gate)
                    operations = [cirq.ops.reset(target) for target in targets]
                    operations.append([cirq.X(target) for target in targets])
                elif gate["type"] == "Measure":
                    targets = self._target_qubits(qubits, gate)
                    operations = [
                        cirq.measure(
                            targets[index], key=self._measurement_key(measurement_label_number + index))
                        for index in range(len(targets))
                    ]
                    measurement_ids = [self._measurement_key(
                        measurement_label_number + index) for index in range(len(targets))]
                    measurement_pairs = [
                        [measurement_ids[index], gate["targets"][index]] for index in range(len(targets))
                    ]
                    measurement_moment[moment_index].append(measurement_pairs)
                    measurement_label_number = measurement_label_number + \
                        len(targets)
                else:
                    msg = "Unknown operation: {}".format(gate["type"])
                    raise ValueError(msg)

                for each in operations:
                    moment.append(each)

            circuit.append(moment, strategy=InsertStrategy.NEW_THEN_INLINE)
            moment_index = moment_index + 1

        return circuit, measurement_moment

    def run_circuit(self, circuit, steps, measurement_moment):
        return self.run_circuit_until_step_index(circuit, measurement_moment, len(steps) - 1, steps)

    # TODO: 引数 step_index を最後にし、省略した場合には「最後のステップまで実行」という意味にする
    def run_circuit_until_step_index(self, c, measurement_moment, step_index, steps, targets=None):
        if targets is None:
            qubit_count = len(c.all_qubits())
            targets = list(range(2**qubit_count))

        cirq_simulator = cirq.Simulator()
        _data = []
        counter = -1
        sleep_flag = 0  # we need padding for |1> because implimented as R + X
        for _counter, step in enumerate(cirq_simulator.simulate_moment_steps(c)):
            if sleep_flag == 0:
                counter = counter + 1
            dic = {}
            dic[":blochVectors"] = {}
            dic[":measuredBits"] = {}
            if sleep_flag == 0:
                for _d in steps[counter]:
                    if "type" in _d and _d["type"] == "|1>":
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
                    if steps[counter][_bloch_index]["type"] == "Bloch":
                        bloch_index = _bloch_index
                #                print("bloch_index ", bloch_index)
                #                sys.stdout.flush()
                if bloch_index != -1:
                    for _bloch_target in steps[counter][bloch_index]["targets"]:
                        blochxyz = cirq.qis.bloch_vector_from_state_vector(
                            step.state_vector(), _bloch_target)
                        dic[":blochVectors"][_bloch_target] = blochxyz
            #                        print("bloch sphere: ", blochxyz)
            #                        sys.stdout.flush()
            if counter == step_index:
                dic[":amplitude"] = step.state_vector()

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
                            _data[i][":measuredBits"][_qubit] = _value
        #        print("_data ", _data)
        #        sys.stdout.flush()
        # targets に必要な振幅のインデックスが入っているので、
        # _data.amplitudes のうち、targets に含まれるインデックスのみを返す
        # _data['amplitudes'] = {}

        target_amplitudes = _data[step_index][":amplitude"]
        _data[step_index][":amplitude"] = {}

        for _target in targets:
            _data[step_index][":amplitude"][_target] = target_amplitudes[_target]

        return _data

    def _measurement_key(self, number):
        return "m" + str(number)

    def _target_qubits(self, qubits, gate):
        return [qubits[each] for each in gate["targets"]]

    def _is_valid_swap(self, gate):
        return len(gate["targets"]) == self.VALID_SWAP_TARGET_COUNT

    def _is_invalid_cz(self, gate):
        return len(gate["targets"]) < self.MINIMAL_CZ_CONTROL_COUNT

    def _is_minimally_valid_cz(self, gate):
        return len(gate["targets"]) == self.MINIMAL_CZ_CONTROL_COUNT
