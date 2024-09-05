import cirq
from cirq.circuits import InsertStrategy

from src.write0 import Write0
from src.write1 import Write1


class CirqRunner:
    VALID_SWAP_TARGET_COUNT = 2
    MINIMAL_CZ_CONTROL_COUNT = 2

    def __init__(self, logger=None):
        self.logger = logger

    def build_circuit(self, steps, qubit_count=None):
        qubit_count = qubit_count or self._get_qubit_count(steps)
        steps_cirq = self._steps_cirq(steps, qubit_count)
        circuit, measurements = self._process_step_operations(
            steps_cirq, qubit_count)

        return circuit, measurements

    def run_circuit(self, circuit, steps, measurements, until_step_index=None, amplitude_indices=None):
        qubit_count = len(circuit.all_qubits())

        if until_step_index is None:
            until_step_index = len(steps) - 1

        if amplitude_indices is None:
            qubit_count = len(circuit.all_qubits())
            amplitude_indices = list(range(2**qubit_count))

        cirq_simulator = cirq.Simulator()
        step_results = []

        for step_index, step in enumerate(cirq_simulator.simulate_moment_steps(circuit)):
            dic = {}
            dic[":measuredBits"] = {}

            if steps[step_index] == []:
                pass
            if step_index == until_step_index:
                dic[":amplitude"] = step.state_vector()

            step_results.append(dic)

            if step.measurements:
                for measurement in measurements:
                    key = measurement["key"]
                    target_bit = measurement["target_bit"]
                    if key in step.measurements:
                        _value = step.measurements[key][0]
                        step_results[step_index][":measuredBits"][qubit_count -
                                                                  target_bit - 1] = _value

        amplitudes = step_results[until_step_index][":amplitude"]
        step_results[until_step_index][":amplitude"] = {}
        for amplitude_index in amplitude_indices:
            step_results[until_step_index][":amplitude"][amplitude_index] = amplitudes[amplitude_index]

        return step_results

    def _get_qubit_count(self, steps: list) -> int:
        return (
            max(
                max((max(gate.get("targets", [-1]))
                    for step in steps for gate in step), default=-1),
                max((max(gate.get("controls", [-1]))
                    for step in steps for gate in step), default=-1),
            )
            + 1
        )

    def _steps_cirq(self, steps, qubit_count):
        steps_cirq = []

        # Function to reverse and sort the target and control bits
        def reverse_and_sort(bits, qubit_count):
            return sorted(qubit_count - bit - 1 for bit in bits)

        for step in steps:
            new_step = []
            for operation in step:
                new_operation = operation.copy()
                if "targets" in new_operation:
                    new_operation["targets"] = reverse_and_sort(
                        new_operation["targets"], qubit_count)
                if "controls" in new_operation:
                    new_operation["controls"] = reverse_and_sort(
                        new_operation["controls"], qubit_count)
                new_step.append(new_operation)
            steps_cirq.append(new_step)

        return steps_cirq

    def _process_step_operations(self, steps, qubit_count):
        circuit = cirq.Circuit()
        qubits = cirq.LineQubit.range(qubit_count)
        measurements = []

        for step_index, step in enumerate(steps):
            operations_cirq = []

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
                        qubits, operation, step_index)
                    operations_cirq.extend(_operations_cirq)
                    measurements.extend(measurement_pairs)
                else:
                    msg = "Unknown operation: {}".format(operation["type"])
                    raise ValueError(msg)

            circuit.append(cirq.Moment(operations_cirq),
                           strategy=InsertStrategy.NEW_THEN_INLINE)

        return circuit, measurements

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
        return [Write0()(target) for target in targets]

    def _process_write1_gate(self, qubits, operation):
        targets = self._target_qubits(qubits, operation)
        return [Write1()(target) for target in targets]

    def _process_measure_gate(self, qubits, operation, step_index):
        targets = self._target_qubits(qubits, operation)
        operations_cirq = [cirq.measure(target, key=self._measurement_key(
            step_index, target)) for target in targets]
        keys = [self._measurement_key(step_index, target)
                for target in targets]
        measurement_pairs = [
            {"key": keys[index], "target_bit": operation["targets"][index]} for index in range(len(targets))
        ]

        return operations_cirq, measurement_pairs

    def _measurement_key(self, step_index, target):
        return "m" + str(step_index) + "_" + str(target.x)

    def _target_qubits(self, qubits, gate):
        return [qubits[each] for each in gate["targets"]]

    def _is_valid_swap(self, gate):
        return len(gate["targets"]) == self.VALID_SWAP_TARGET_COUNT

    def _is_invalid_cz(self, gate):
        return len(gate["targets"]) < self.MINIMAL_CZ_CONTROL_COUNT

    def _is_minimally_valid_cz(self, gate):
        return len(gate["targets"]) == self.MINIMAL_CZ_CONTROL_COUNT
