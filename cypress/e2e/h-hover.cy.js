import { HGate } from "../../h-gate";

describe("hover H gate", () => {
  it("passes", () => {
    cy.visit("/");

    cy.get("#app").then(($appEl) => {
      const appEl = $appEl.get(0);
      const dataComponents = JSON.parse(appEl.dataset.components);
      const hGatePosition = dataComponents.gatePalette.gates.HGate;

      cy.get("canvas")
        .realMouseMove(
          hGatePosition.x + HGate.size / 2,
          hGatePosition.y + HGate.size / 2
        )
        .percySnapshot("Hover over the H gate");
    });
  });
});
