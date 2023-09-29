import { HGate } from "../../h-gate";
import { XGate } from "../../x-gate";
import { YGate } from "../../y-gate";
import { ZGate } from "../../z-gate";
import { RnotGate } from "../../rnot-gate";
import { SGate } from "../../s-gate";

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

  describe("Z Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePaletteComponents.ZGate.x + ZGate.size / 2,
          gatePaletteComponents.ZGate.y + ZGate.size / 2
        )
        .percySnapshot("Hover over the Z gate");
    });
  });

  describe("√X Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePaletteComponents.RnotGate.x + RnotGate.size / 2,
          gatePaletteComponents.RnotGate.y + RnotGate.size / 2
        )
        .percySnapshot("Hover over the √X gate");
    });
  });

  describe("S Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePaletteComponents.SGate.x + SGate.size / 2,
          gatePaletteComponents.SGate.y + SGate.size / 2
        )
        .percySnapshot("Hover over the S gate");
    });
  });
});
