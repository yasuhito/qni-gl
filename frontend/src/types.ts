import { MAX_QUBIT_COUNT } from "./constants";

type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

type ValidQubitCount =
  | Exclude<Enumerate<typeof MAX_QUBIT_COUNT>, 0>
  | typeof MAX_QUBIT_COUNT;

export type QubitCount = ValidQubitCount;

export enum WireType {
  Quantum = "quantum",
  Classical = "classical",
}

export interface SerializedGate {
  type: string;
  targets: number[];
  controls?: number[];
}
