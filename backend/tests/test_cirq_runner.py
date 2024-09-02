from math import sqrt
import unittest
import numpy
from pytest import approx
from src.cirq_runner import CirqRunner


class TestCirqRunner(unittest.TestCase):
    def setUp(self):
        self.logger = None  # ロガーのモックまたは実際のロガーを設定
        self.cirq_runner = CirqRunner(self.logger)

    def test_initialization(self):
        assert self.cirq_runner is not None  # unittestスタイルのassertを通常のassertに変更

    def test_build_circuit_with_h_gate(self):
        qubit_count = 1
        step = [
            [{'type': 'H', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(
            qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'H(q(0))'

    def test_build_circuit_with_x_gate(self):
        qubit_count = 1
        step = [
            [{'type': 'X', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(
            qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'X(q(0))'

    def test_build_circuit_with_controlled_x_gate(self):
        qubit_count = 2
        step = [
            [{'type': 'X', 'targets': [0], 'controls': [1]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]) == 'CX(q(0), q(1))'

    def test_build_circuit_with_two_controlled_x_gates(self):
        qubit_count = 3
        step = [
            [{'type': 'X', 'targets': [0], 'controls': [1, 2]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 3
        assert str(circuit[0].operations[0]) == 'CCX(q(0), q(1), q(2))'

    def test_build_circuit_with_y_gate(self):
        qubit_count = 1
        step = [
            [{'type': 'Y', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'Y(q(0))'

    def test_build_circuit_with_z_gate(self):
        qubit_count = 1
        step = [
            [{'type': 'Z', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'Z(q(0))'

    def test_build_circuit_with_rnot_gate(self):
        qubit_count = 1
        step = [
            [{'type': 'X^½', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'X**0.5(q(0))'

    def test_build_circuit_with_s_gate(self):
        qubit_count = 1
        step = [
            [{'type': 'S', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'S(q(0))'

    def test_build_circuit_with_s_dagger_gate(self):
        qubit_count = 1
        step = [
            [{'type': 'S†', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'S**-1(q(0))'

    def test_build_circuit_with_t_gate(self):
        qubit_count = 1
        step = [
            [{'type': 'T', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'T(q(0))'

    def test_build_circuit_with_t_dagger_gate(self):
        qubit_count = 1
        step = [
            [{'type': 'T†', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'T**-1(q(0))'

    def test_build_circuit_with_two_swap_gates(self):
        qubit_count = 2
        step = [
            [{'type': 'Swap', 'targets': [0, 1]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]) == 'SWAP(q(0), q(1))'

    def test_build_circuit_with_one_swap_gate(self):
        qubit_count = 1
        step = [
            [{'type': 'Swap', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 0

    def test_build_circuit_with_three_swap_gates(self):
        qubit_count = 3
        step = [
            [{'type': 'Swap', 'targets': [0, 1, 2]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 0

    def test_build_circuit_with_two_control_gates(self):
        qubit_count = 2
        step = [
            [{'type': '•', 'targets': [0, 1]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]) == 'CZ(q(0), q(1))'

    def test_build_circuit_with_one_control_gate(self):
        qubit_count = 1
        step = [
            [{'type': '•', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 0
        # assert str(circuit[0].operations[0]) == 'CZ(q(0), q(1))'

    def test_build_circuit_with_three_control_gates(self):
        qubit_count = 3
        step = [
            [{'type': '•', 'targets': [0, 1, 2]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 3
        assert str(circuit[0].operations[0]) == 'CCZ(q(0), q(1), q(2))'

    def test_build_circuit_with_four_control_gates(self):
        qubit_count = 4
        step = [
            [{'type': '•', 'targets': [0, 1, 2, 3]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 4
        assert str(circuit[0].operations[0]
                   ) == 'CCCZ(q(0), q(1), q(2), q(3))'

    def test_build_circuit_with_write0_gate(self):
        qubit_count = 1
        step = [
            [{'type': '|0>', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'reset(q(0))'

    def test_build_circuit_with_write1_gate(self):
        qubit_count = 1
        step = [
            [{'type': '|1>', 'targets': [0]}],
        ]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]) == 'reset(q(0))'
        assert str(circuit[1].operations[0]) == 'X(q(0))'

    def test_build_circuit_with_measurement_gate(self):
        qubit_count = 1
        step = [
            [{'type': 'Measure', 'targets': [0]}],
        ]

        circuit, measurements = self.cirq_runner.build_circuit(
            qubit_count, step)

        assert len(circuit.all_qubits()) == 1
        assert str(circuit[0].operations[0]
                   ) == "cirq.MeasurementGate(1, cirq.MeasurementKey(name='m0'), ())(q(0))"
        assert str(measurements) == "[[[['m0', 0]]]]"

    def test_build_circuit_with_two_measurement_gates(self):
        qubit_count = 2
        step = [
            [{'type': 'Measure', 'targets': [0, 1]}],
        ]

        circuit, measurements = self.cirq_runner.build_circuit(
            qubit_count, step)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]
                   ) == "cirq.MeasurementGate(1, cirq.MeasurementKey(name='m0'), ())(q(0))"
        assert str(circuit[0].operations[1]
                   ) == "cirq.MeasurementGate(1, cirq.MeasurementKey(name='m1'), ())(q(1))"
        assert str(measurements) == "[[[['m0', 0], ['m1', 1]]]]"

    def test_build_circuit_with_unknown_operation(self):
        qubit_count = 1
        step = [
            [{'type': 'UnknownGate', 'targets': [0]}],
        ]

        with self.assertRaises(ValueError) as context:
            self.cirq_runner.build_circuit(qubit_count, step)

        self.assertEqual(str(context.exception),
                         "Unknown operation: UnknownGate")

    def test_build_circuit_with_empty_step(self):
        qubit_count = 2
        step = [[]]

        circuit, _ = self.cirq_runner.build_circuit(qubit_count, step)

        assert len(circuit.all_qubits()) == 2
        assert str(circuit[0].operations[0]) == 'I(q(0))'
        assert str(circuit[0].operations[1]) == 'I(q(1))'

    def test_run_circuit_with_h_gate(self):
        steps = [[{'type': 'H', 'targets': [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 0, steps, [0, 1])

        assert len(result) == 1

        amplitudes = result[0][':amplitude']
        assert (approx(amplitudes[0].real), approx(
            amplitudes[0].imag)) == (1/sqrt(2), 0.0)
        assert (approx(amplitudes[1].real), approx(
            amplitudes[1].imag)) == (1/sqrt(2), 0.0)
        assert result[0][':measuredBits'] == {}

    def test_run_circuit_with_x_gate(self):
        steps = [[{'type': 'X', 'targets': [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 0, steps, [0, 1])

        assert len(result) == 1

        amplitudes = result[0][':amplitude']
        assert (approx(amplitudes[0].real), approx(
            amplitudes[0].imag)) == (0.0, 0.0)
        assert (approx(amplitudes[1].real), approx(
            amplitudes[1].imag)) == (1.0, 0.0)
        assert result[0][':measuredBits'] == {}

    def test_run_circuit_with_y_gate(self):
        # Y∣0⟩=i∣1⟩
        steps = [[{'type': 'Y', 'targets': [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 0, steps, [0, 1])

        assert len(result) == 1

        amplitudes = result[0][':amplitude']
        assert (approx(amplitudes[0].real), approx(
            amplitudes[0].imag)) == (0.0, 0.0)
        assert (approx(amplitudes[1].real), approx(
            amplitudes[1].imag)) == (0.0, 1.0)
        assert result[0][':measuredBits'] == {}

        # Y∣1⟩=-i∣0⟩
        steps = [[{'type': 'X', 'targets': [0]}],
                 [{'type': 'Y', 'targets': [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1])

        assert len(result) == 2

        amplitudes = result[1][':amplitude']
        assert (approx(amplitudes[0].real), approx(
            amplitudes[0].imag)) == (0.0, -1.0)
        assert (approx(amplitudes[1].real), approx(
            amplitudes[1].imag)) == (0.0, 0.0)
        assert result[0][':measuredBits'] == {}

    def test_run_circuit_with_z_gate(self):
        # Z∣0⟩=∣0⟩
        steps = [[{'type': 'Z', 'targets': [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 0, steps, [0, 1])

        assert len(result) == 1

        amplitudes = result[0][':amplitude']
        assert (approx(amplitudes[0].real), approx(
            amplitudes[0].imag)) == (1.0, 0.0)
        assert (approx(amplitudes[1].real), approx(
            amplitudes[1].imag)) == (0.0, 0.0)
        assert result[0][':measuredBits'] == {}

        # Z∣1⟩=-∣1⟩
        steps = [[{'type': 'X', 'targets': [0]}],
                 [{'type': 'Z', 'targets': [0]}]]
        circuit, measurement_moment = self.cirq_runner.build_circuit(1, steps)

        result = self.cirq_runner.run_circuit_until_step_index(
            circuit, measurement_moment, 1, steps, [0, 1])

        assert len(result) == 2

        amplitudes = result[1][':amplitude']
        assert (approx(amplitudes[0].real), approx(
            amplitudes[0].imag)) == (0.0, 0.0)
        assert (approx(amplitudes[1].real), approx(
            amplitudes[1].imag)) == (-1.0, 0.0)
        assert result[0][':measuredBits'] == {}


if __name__ == '__main__':
    unittest.main()
