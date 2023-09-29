import { HGate } from "../../h-gate";
import { XGate } from "../../x-gate";

describe("Gate Palette", () => {
  before(() => {
    cy.visit("/");
  });

  describe("H Gate", () => {
    it("changes style when mouseover", () => {
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

  describe("X Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/");

      cy.get("#app").then(($appEl) => {
        const xGatePosition = $appEl.data().components.gatePalette.gates.XGate;

        cy.get("canvas")
          .realMouseMove(
            xGatePosition.x + XGate.size / 2,
            xGatePosition.y + XGate.size / 2
          )
          .percySnapshot("Hover over the X gate");
      });
    });
  });
});
