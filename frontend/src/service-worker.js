import { Simulator } from "@qni/simulator";
import { BACKEND_URL } from "./constants";

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
  const amplitudes = [];

  for (let i = 0; i < vector.height; i++) {
    const c = vector.element(0, i);
    if (c.isOk()) {
      amplitudes.push([c.value.real, c.value.imag]);
    }
  }

  async function call_backend() {
    try {
      const params = new URLSearchParams({
        id: circuitJson,
        qubitCount: qubitCount,
        stepIndex: stepIndex,
        targets: targets,
        steps: JSON.stringify(steps),
        useGpu: false,
      });

      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // URLSearchParams を使用する場合
        },
        body: params.toString(), // パラメータをボディに設定
      });

      if (!response.ok) {
        if (response.status === 502) {
          console.error(
            "502 Bad Gateway: The backend server is currently down. It is likely that the uWSGI server is down."
          );
        } else {
          console.error(
            `HTTP error ${response.status}: ${response.statusText}`
          );
        }

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
      console.error(error);
    }

    self.postMessage({ type: "finish" });
  }

  call_backend();
});
