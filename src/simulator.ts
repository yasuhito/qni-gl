import { Circuit } from "./circuit";
import { StateVector } from "@qni/simulator"

export class Simulator {
  circuit: Circuit

  constructor(circuit: Circuit) {
    this.circuit = circuit
    // console.dir(this.circuit)
    // circuit.qubitCount
  }

  stateVectorAt(_stepIndex: number) {
    return new StateVector("".padStart(this.circuit.qubitCount, '0'))
  }
}
