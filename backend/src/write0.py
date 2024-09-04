import cirq


class Write0(cirq.Gate):
    def __init__(self):
        super(Write0, self).__init__()

    def _num_qubits_(self):
        return 1

    def _decompose_(self, qubits):
        q = qubits[0]
        return [cirq.ops.reset(q)]

    def __str__(self):
        return '|0>'

    def __repr__(self):
        return 'Write0()'
