import { Simulator } from "@qni/simulator";

// Install SW
self.addEventListener("install", (event) => {
  console.log("ServiceWorker installed");
});

// TODO: Qni の runSimulator にあたるハンドラを実行
self.addEventListener("message", (event) => {
  console.log(`qubitCount = ${event.data.qubitCount}`);

  const simulator = new Simulator("0");
  console.dir(simulator);

  self.postMessage({ type: "finished" });
});
