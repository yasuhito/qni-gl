from qiskit import QuantumCircuit, transpile
from qiskit_aer import Aer

def create_bell_state():
    circuit = QuantumCircuit(2, 2)  # 2つの量子ビットと2つの古典ビットを用意
    circuit.h(0)  # 1ビット目にアダマールゲートを適用
    circuit.h(1)
    #circuit.cx(0, 1)  # 1ビット目と2ビット目にCNOTゲートを適用
    return circuit

# 量子回路を作成
circuit = create_bell_state()

# 1ビット目を測定
# circuit.measure(0, 0)

# バリアを追加して測定後の操作を分離
# circuit.barrier()

# 2ビット目を測定
# circuit.measure(1, 1)

circuit.save_statevector()
print(circuit.draw(output='text'))

simulator = Aer.get_backend('aer_simulator_statevector')
circuit = transpile(circuit, simulator)
job = simulator.run(circuit, shots=1, memory=True)
result = job.result()

counts = result.get_counts()
# 各古典ビットの測定結果を表示
# for bitstring, count in counts.items():
#     print(f'Bitstring: {bitstring}, Count: {count}')
#     measure_0 = bitstring[1]  # 古典ビット0の値
#     measure_1 = bitstring[0]  # 古典ビット1の値
#     print(f'Measure 0: {measure_0}')
#     print(f'Measure 1: {measure_1}')


print(counts)

statevector = result.get_statevector()
print(f'Statevector: {statevector}')

print(f'backend: {result.backend_name}')
