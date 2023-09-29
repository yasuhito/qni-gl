import { HGate } from "../../h-gate";
import { XGate } from "../../x-gate";
import { YGate } from "../../y-gate";

describe("Gate Palette", () => {
  let gatePaletteComponents;

  before(() => {
    cy.visit("/").then(() => {
      cy.get("#app").then(($appEl) => {
        gatePaletteComponents = $appEl.data().components.gatePalette.gates;
      });
    });
  });

  describe("H Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePaletteComponents.HGate.x + HGate.size / 2,
          gatePaletteComponents.HGate.y + HGate.size / 2
        )
        .percySnapshot("Hover over the H gate");
    });
  });

  describe("X Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePaletteComponents.XGate.x + XGate.size / 2,
          gatePaletteComponents.XGate.y + XGate.size / 2
        )
        .percySnapshot("Hover over the X gate");
    });
  });

  describe("Y Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePaletteComponents.YGate.x + YGate.size / 2,
          gatePaletteComponents.YGate.y + YGate.size / 2
        )
        .percySnapshot("Hover over the Y gate");
    });
  });
});
