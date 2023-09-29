import { HGate } from "../../h-gate";
import { XGate } from "../../x-gate";
import { YGate } from "../../y-gate";
import { ZGate } from "../../z-gate";
import { RnotGate } from "../../rnot-gate";
import { SGate } from "../../s-gate";
import { SDaggerGate } from "../../s-dagger-gate";
import { TGate } from "../../t-gate";
import { TDaggerGate } from "../../t-dagger-gate";
import { PhaseGate } from "../../phase-gate";
import { RxGate } from "../../rx-gate";
import { RyGate } from "../../ry-gate";
import { RzGate } from "../../rz-gate";
import { SwapGate } from "../../swap-gate";
import { ControlGate } from "../../control-gate";

describe("Gate Palette", () => {
  let gatePalette;

  before(() => {
    cy.visit("/").then(() => {
      cy.get("#app").then(($appEl) => {
        gatePalette = $appEl.data().components.gatePalette.gates;
      });
    });
  });

  describe("H Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePalette.HGate.x + HGate.size / 2,
          gatePalette.HGate.y + HGate.size / 2
        )
        .percySnapshot("Hover over the H gate");
    });
  });

  describe("X Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePalette.XGate.x + XGate.size / 2,
          gatePalette.XGate.y + XGate.size / 2
        )
        .percySnapshot("Hover over the X gate");
    });
  });

  describe("Y Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePalette.YGate.x + YGate.size / 2,
          gatePalette.YGate.y + YGate.size / 2
        )
        .percySnapshot("Hover over the Y gate");
    });
  });

  describe("Z Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePalette.ZGate.x + ZGate.size / 2,
          gatePalette.ZGate.y + ZGate.size / 2
        )
        .percySnapshot("Hover over the Z gate");
    });
  });

  describe("√X Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePalette.RnotGate.x + RnotGate.size / 2,
          gatePalette.RnotGate.y + RnotGate.size / 2
        )
        .percySnapshot("Hover over the √X gate");
    });
  });

  describe("S Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePalette.SGate.x + SGate.size / 2,
          gatePalette.SGate.y + SGate.size / 2
        )
        .percySnapshot("Hover over the S gate");
    });
  });

  describe("S† Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePalette.SDaggerGate.x + SDaggerGate.size / 2,
          gatePalette.SDaggerGate.y + SDaggerGate.size / 2
        )
        .percySnapshot("Hover over the S† gate");
    });
  });

  describe("T Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePalette.TGate.x + TGate.size / 2,
          gatePalette.TGate.y + TGate.size / 2
        )
        .percySnapshot("Hover over the T gate");
    });
  });

  describe("T† Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePalette.TDaggerGate.x + TDaggerGate.size / 2,
          gatePalette.TDaggerGate.y + TDaggerGate.size / 2
        )
        .percySnapshot("Hover over the T† gate");
    });
  });

  describe("Phase Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePalette.PhaseGate.x + PhaseGate.size / 2,
          gatePalette.PhaseGate.y + PhaseGate.size / 2
        )
        .percySnapshot("Hover over the Phase gate");
    });
  });

  describe("Rx Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePalette.RxGate.x + RxGate.size / 2,
          gatePalette.RxGate.y + RxGate.size / 2
        )
        .percySnapshot("Hover over the Rx gate");
    });
  });

  describe("Ry Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePalette.RyGate.x + RyGate.size / 2,
          gatePalette.RyGate.y + RyGate.size / 2
        )
        .percySnapshot("Hover over the Ry gate");
    });
  });

  describe("Rz Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePalette.RzGate.x + RzGate.size / 2,
          gatePalette.RzGate.y + RzGate.size / 2
        )
        .percySnapshot("Hover over the Rz gate");
    });
  });

  describe("Swap Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePalette.SwapGate.x + SwapGate.size / 2,
          gatePalette.SwapGate.y + SwapGate.size / 2
        )
        .percySnapshot("Hover over the Swap gate");
    });
  });

  describe("Control Gate", () => {
    it("changes style when mouseover", () => {
      cy.visit("/")
        .get("canvas")
        .realMouseMove(
          gatePalette.ControlGate.x + ControlGate.size / 2,
          gatePalette.ControlGate.y + ControlGate.size / 2
        )
        .percySnapshot("Hover over the Swap gate");
    });
  });
});
