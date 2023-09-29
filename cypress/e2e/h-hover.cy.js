import { HGate } from "../../h-gate";

describe("H gate", () => {
  it("changes style when mouseover", () => {
    cy.visit("/");

    cy.get("#app").then(($appEl) => {
      const hGatePosition = $appEl.data().components.gatePalette.gates.HGate;

      cy.get("canvas")
        .realMouseMove(
          hGatePosition.x + HGate.size / 2,
          hGatePosition.y + HGate.size / 2
        )
        .percySnapshot("Hover over the H gate");
    });
  });
});
