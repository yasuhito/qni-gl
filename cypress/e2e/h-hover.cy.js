import { HGate } from "../../h-gate";

describe("hover H gate", () => {
  it("passes", () => {
    cy.visit("/");

    // TODO: H ゲートの位置を取得する
    cy.get("canvas")
      .realMouseMove(174 + HGate.size / 2, 48 + HGate.size / 2)
      .percySnapshot("Hover over the H gate");
  });
});
