import { App } from "./app";

/** The PixiJS app Application instance, shared across the project */
export const app = App.instance;

// Expose that app to the PixiJS Devtools (https://chrome.google.com/webstore/detail/pixijs-devtools/aamddddknhcagpehecnhphigffljadon)
// so we can debug the pixi app layers
(globalThis as any).__PIXI_APP__ = app;
