import { Simulator } from "@qni/simulator";

// Install SW
self.addEventListener("install", () => {
  console.log("ServiceWorker installed");
});

// TODO: Qni の runSimulator にあたるハンドラを実行
self.addEventListener("message", (event) => {
  const circuitJson = event.data.circuitJson;
  const qubitCount = event.data.qubitCount;
  const stepIndex = event.data.stepIndex;
  const targets = event.data.targets;
  const steps = event.data.steps;
  const simulator = new Simulator("0".repeat(qubitCount));
  const vector = simulator.state.matrix.clone();
  const amplitudes: [number, number][] = [];

  for (let i = 0; i < vector.height; i++) {
    const c = vector.cell(0, i);
    amplitudes.push([c.real, c.imag]);
  }

  // バックエンドを呼ぶ
  async function call_backend() {
    try {
      // const params = new URLSearchParams({
      //   qubitCount,
      //   stepIndex,
      //   targets,
      //   backend,
      //   id: json,
      //   steps: JSON.stringify(steps),
      // })
      const params = new URLSearchParams({
        id: circuitJson,
        qubitCount: qubitCount,
        stepIndex: stepIndex,
        targets: targets,
        steps: JSON.stringify(steps),
      });

      const response = await fetch(
        `http://localhost:3000/backend.json?${params}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to connect to Qni's backend endpoint.");
      }

      const jsondata = await response.json();

      for (let i = 0; i < jsondata.length; i++) {
        const stepResult = jsondata[i];
        self.postMessage({
          type: "step",
          step: i,
          amplitudes: stepResult["amplitudes"],
          blochVectors: stepResult["blochVectors"],
          measuredBits: stepResult["measuredBits"],
          flags: {},
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  call_backend();

  self.postMessage({
    type: "finished",
    qubitCount: qubitCount,
    amplitudes: amplitudes,
  });
});
