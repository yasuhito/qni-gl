import { Gate } from "../../gate";
import { HGate } from "../../h-gate";

describe("Dropzone", () => {
  let app;

  before(() => {
    cy.visit("/").then(() => {
      cy.get("#app").then(($appEl) => {
        app = $appEl.data().app;
      });
    });
  });

  it("H ゲートをドラッグ & ドロップ", () => {
    const gatePalette = app.gatePalette;
    const firstDropzone = app.circuit.steps[0].dropzones[0];

    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.HGate.x + Gate.size / 2,
        gatePalette.gates.HGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.HGate.x + Gate.size / 2,
        y: gatePalette.gates.HGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop H gate");
  });

  it("X ゲートをドラッグ & ドロップ", () => {
    const gatePalette = app.gatePalette;
    const firstDropzone = app.circuit.steps[0].dropzones[0];

    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.XGate.x + Gate.size / 2,
        gatePalette.gates.XGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.XGate.x + Gate.size / 2,
        y: gatePalette.gates.XGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop X gate");
  });
});
