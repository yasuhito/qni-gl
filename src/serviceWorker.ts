import { Simulator } from "@qni/simulator";

// Install SW
self.addEventListener("install", () => {
  console.log("ServiceWorker installed");
});

// TODO: Qni の runSimulator にあたるハンドラを実行
self.addEventListener("message", (event) => {
  const qubitCount = event.data.qubitCount;
  const simulator = new Simulator("0".repeat(qubitCount));
  const vector = simulator.state.matrix.clone();
  const amplitudes: [number, number][] = [];

  for (let i = 0; i < vector.height; i++) {
    const c = vector.cell(0, i);
    amplitudes.push([c.real, c.imag]);
  }

  self.postMessage({
    type: "finished",
    qubitCount: qubitCount,
    amplitudes: amplitudes,
  });
});
