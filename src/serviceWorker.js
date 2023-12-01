"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simulator_1 = require("@qni/simulator");
// const CACHE_NAME = "version-1";
// const urlsToCache = ["index.html", "offline.html"];
// Install SW
self.addEventListener("install", (event) => {
    console.log("SW installed");
    // event.waitUntil(
    //   caches.open(CACHE_NAME).then((cache) => {
    //     console.log("Opened cache");
    //     return cache.addAll(urlsToCache);
    //   })
    // );
});
// TODO: Qni の runSimulator にあたるハンドラを実行
self.addEventListener("message", (event) => {
    console.log(`qubitCount = ${event.data.qubitCount}`);
    const simulator = new simulator_1.Simulator("0");
    self.postMessage({ type: "finished" });
});
// Listen for requests
// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then(() => {
//       return fetch(event.request).catch(() => caches.match("offline.html"));
//     })
//   );
// });
// Activate the SW
// self.addEventListener("activate", (event) => {
//   const casheWhitelist = [];
//   casheWhitelist.push(CACHE_NAME);
//   event.waitUntil(
//     caches.keys().then((casheNames) =>
//       Promise.all(
//         casheNames.map((casheName) => {
//           if (!casheWhitelist.includes(casheName)) {
//             return cashes.delete(casheName);
//           }
//         })
//       )
//     )
//   );
// });
