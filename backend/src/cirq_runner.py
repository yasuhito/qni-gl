import cirq
from cirq.circuits import InsertStrategy

from src.write1 import Write1


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
        steps_reversed = []

        # Function to reverse and sort the target and control bits
        def reverse_and_sort(bits, qubit_count):
            return sorted(qubit_count - bit - 1 for bit in bits)

        for step in steps:
            for operation in step:
                if "targets" in operation:
                    operation["targets"] = reverse_and_sort(
                        operation["targets"], qubit_count)
                if "controls" in operation:
                    operation["controls"] = reverse_and_sort(
                        operation["controls"], qubit_count)
            steps_reversed.append(step)

        qubits = cirq.LineQubit.range(qubit_count)
        circuit = cirq.Circuit()
        measurement_label_number = 0
        measurement_moment = []
        moment_index = 0

        for step in steps_reversed:
            operations_cirq = []
            measurement_moment.append([])

            # empty step is converted to I gate
            if len(step) == 0:
                operations_cirq.extend([cirq.I(qubits[bit])
                                       for bit in range(qubit_count)])

            for operation in step:
                if operation["type"] == "H":
                    operations_cirq.extend(
                        self._process_h_gate(qubits, operation))
                elif operation["type"] == "X":
                    operations_cirq.extend(
                        self._process_x_gate(qubits, operation))
                elif operation["type"] == "Y":
                    operations_cirq.extend(
                        self._process_y_gate(qubits, operation))
                elif operation["type"] == "Z":
                    operations_cirq.extend(
                        self._process_z_gate(qubits, operation))
                elif operation["type"] == "X^½":
                    operations_cirq.extend(
                        self._process_rnot_gate(qubits, operation))
                elif operation["type"] == "S":
                    operations_cirq.extend(
                        self._process_s_gate(qubits, operation))
                elif operation["type"] == "S†":
                    operations_cirq.extend(
                        self._process_s_dagger_gate(qubits, operation))
                elif operation["type"] == "T":
                    operations_cirq.extend(
                        self._process_t_gate(qubits, operation))
                elif operation["type"] == "T†":
                    operations_cirq.extend(
                        self._process_t_dagger_gate(qubits, operation))
                elif operation["type"] == "Swap":
                    operations_cirq.extend(
                        self._process_swap_gate(qubits, operation))
                elif operation["type"] == "•":
                    operations_cirq.extend(
                        self._process_control_gate(qubits, operation))
                elif operation["type"] == "|0>":
                    operations_cirq.extend(
                        self._process_write0_gate(qubits, operation))
                elif operation["type"] == "|1>":
                    operations_cirq.extend(
                        self._process_write1_gate(qubits, operation))
                elif operation["type"] == "Measure":
                    _operations_cirq, measurement_pairs = self._process_measure_gate(
                        qubits, operation, measurement_label_number
                    )
                    operations_cirq.extend(_operations_cirq)
                    measurement_moment[moment_index].append(measurement_pairs)
                    measurement_label_number += len(operation["targets"])
                else:
                    msg = "Unknown operation: {}".format(operation["type"])
                    raise ValueError(msg)

            circuit.append(cirq.Moment(operations_cirq),
                           strategy=InsertStrategy.NEW_THEN_INLINE)
            moment_index = moment_index + 1

        return circuit, measurement_moment

    def _process_h_gate(self, qubits, operation):
        targets = self._target_qubits(qubits, operation)
        return [cirq.H(target) for target in targets]

    def _process_x_gate(self, qubits, operation):
        targets = self._target_qubits(qubits, operation)
        if "controls" not in operation:
            return [cirq.X(target) for target in targets]

        control_qubits = [qubits[control] for control in operation["controls"]]
        return [cirq.ControlledOperation(control_qubits, cirq.X(target)) for target in targets]

    def _process_y_gate(self, qubits, operation):
        targets = self._target_qubits(qubits, operation)
        return [cirq.Y(target) for target in targets]

    def _process_z_gate(self, qubits, operation):
        targets = self._target_qubits(qubits, operation)
        return [cirq.Z(target) for target in targets]

    def _process_rnot_gate(self, qubits, operation):
        targets = self._target_qubits(qubits, operation)
        return [cirq.X(target) ** 0.5 for target in targets]

    def _process_s_gate(self, qubits, operation):
        targets = self._target_qubits(qubits, operation)
        return [cirq.Z(target) ** 0.5 for target in targets]

    def _process_s_dagger_gate(self, qubits, operation):
        targets = self._target_qubits(qubits, operation)
        return [cirq.Z(target) ** (-0.5) for target in targets]

    def _process_t_gate(self, qubits, operation):
        targets = self._target_qubits(qubits, operation)
        return [cirq.Z(target) ** 0.25 for target in targets]

    def _process_t_dagger_gate(self, qubits, operation):
        targets = self._target_qubits(qubits, operation)
        return [cirq.Z(target) ** (-0.25) for target in targets]

    def _process_swap_gate(self, qubits, operation):
        operations_cirq = []

        if self._is_valid_swap(operation):
            target0 = qubits[operation["targets"][0]]
            target1 = qubits[operation["targets"][1]]
            operations_cirq.append(cirq.SWAP(target0, target1))
        else:
            operations_cirq = [cirq.I(qubits[target])
                               for target in operation["targets"]]

        return operations_cirq

    def _process_control_gate(self, qubits, operation):
        if self._is_invalid_cz(operation):
            return [cirq.I(qubits[operation["targets"][0]])]
        if self._is_minimally_valid_cz(operation):
            return [cirq.CZ(qubits[operation["targets"][0]], qubits[operation["targets"][1]])]

        controls = [qubits[operation["targets"][index]]
                    for index in range(len(operation["targets"]) - 2)]
        return [
            cirq.ControlledOperation(
                controls, cirq.CZ(
                    qubits[operation["targets"][-2]], qubits[operation["targets"][-1]])
            )
        ]

    def _process_write0_gate(self, qubits, operation):
        targets = self._target_qubits(qubits, operation)
        return [cirq.ops.reset(target) for target in targets]

    def _process_write1_gate(self, qubits, operation):
        targets = self._target_qubits(qubits, operation)
        return [Write1()(target) for target in targets]
        # operations_cirq = [cirq.ops.reset(target) for target in targets]
        # operations_cirq.append([cirq.X(target) for target in targets])
        # return operations_cirq

    def _process_measure_gate(self, qubits, operation, measurement_label_number):
        targets = self._target_qubits(qubits, operation)
        operations_cirq = [
            cirq.measure(targets[index], key=self._measurement_key(
                measurement_label_number + index))
            for index in range(len(targets))
        ]
        measurement_ids = [self._measurement_key(
            measurement_label_number + index) for index in range(len(targets))]
        measurement_pairs = [
            [measurement_ids[index], operation["targets"][index]] for index in range(len(targets))]

        return operations_cirq, measurement_pairs

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
        for _counter, step in enumerate(cirq_simulator.simulate_moment_steps(c)):
            counter = counter + 1
            dic = {}
            dic[":blochVectors"] = {}
            dic[":measuredBits"] = {}

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
