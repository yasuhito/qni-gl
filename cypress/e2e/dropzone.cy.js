import { Gate } from "../../gate";
import { HGate } from "../../h-gate";

describe("Dropzone", () => {
  let app;
  let gatePalette;
  let firstDropzone;

  before(() => {
    cy.visit("/").then(() => {
      cy.get("#app").then(($appEl) => {
        app = $appEl.data().app;
        gatePalette = app.gatePalette;
        firstDropzone = app.circuit.steps[0].dropzones[0];
      });
    });
  });

  it("Drag and drop H gate", () => {
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

  it("Drag and drop X gate", () => {
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

  it("Drag and drop Y gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.YGate.x + Gate.size / 2,
        gatePalette.gates.YGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.YGate.x + Gate.size / 2,
        y: gatePalette.gates.YGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop Y gate");
  });

  it("Drag and drop Z gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.ZGate.x + Gate.size / 2,
        gatePalette.gates.ZGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.ZGate.x + Gate.size / 2,
        y: gatePalette.gates.ZGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop Z gate");
  });

  it("Drag and drop √X gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.RnotGate.x + Gate.size / 2,
        gatePalette.gates.RnotGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.RnotGate.x + Gate.size / 2,
        y: gatePalette.gates.RnotGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop √X gate");
  });

  it("Drag and drop S gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.SGate.x + Gate.size / 2,
        gatePalette.gates.SGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.SGate.x + Gate.size / 2,
        y: gatePalette.gates.SGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop S gate");
  });

  it("Drag and drop S† gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.SDaggerGate.x + Gate.size / 2,
        gatePalette.gates.SDaggerGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.SDaggerGate.x + Gate.size / 2,
        y: gatePalette.gates.SDaggerGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop S† gate");
  });

  it("Drag and drop T gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.TGate.x + Gate.size / 2,
        gatePalette.gates.TGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.TGate.x + Gate.size / 2,
        y: gatePalette.gates.TGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop T gate");
  });

  it("Drag and drop T† gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.TDaggerGate.x + Gate.size / 2,
        gatePalette.gates.TDaggerGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.TDaggerGate.x + Gate.size / 2,
        y: gatePalette.gates.TDaggerGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop T† gate");
  });

  it("Drag and drop Phase gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.PhaseGate.x + Gate.size / 2,
        gatePalette.gates.PhaseGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.PhaseGate.x + Gate.size / 2,
        y: gatePalette.gates.PhaseGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop Phase gate");
  });

  it("Drag and drop Rx gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.RxGate.x + Gate.size / 2,
        gatePalette.gates.RxGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.RxGate.x + Gate.size / 2,
        y: gatePalette.gates.RxGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop Rx gate");
  });

  it("Drag and drop Ry gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.RyGate.x + Gate.size / 2,
        gatePalette.gates.RyGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.RyGate.x + Gate.size / 2,
        y: gatePalette.gates.RyGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop Ry gate");
  });

  it("Drag and drop Rz gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.RzGate.x + Gate.size / 2,
        gatePalette.gates.RzGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.RzGate.x + Gate.size / 2,
        y: gatePalette.gates.RzGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop Rz gate");
  });

  it("Drag and drop Swap gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.SwapGate.x + Gate.size / 2,
        gatePalette.gates.SwapGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.SwapGate.x + Gate.size / 2,
        y: gatePalette.gates.SwapGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop Swap gate");
  });

  it("Drag and drop Control gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.ControlGate.x + Gate.size / 2,
        gatePalette.gates.ControlGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.ControlGate.x + Gate.size / 2,
        y: gatePalette.gates.ControlGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop Control gate");
  });

  it("Drag and drop Anti Control gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.AntiControlGate.x + Gate.size / 2,
        gatePalette.gates.AntiControlGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.AntiControlGate.x + Gate.size / 2,
        y: gatePalette.gates.AntiControlGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop Anti Control gate");
  });

  it("Drag and drop |0> gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.Write0Gate.x + Gate.size / 2,
        gatePalette.gates.Write0Gate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.Write0Gate.x + Gate.size / 2,
        y: gatePalette.gates.Write0Gate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop |0> gate");
  });

  it("Drag and drop |1> gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.Write1Gate.x + Gate.size / 2,
        gatePalette.gates.Write1Gate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.Write1Gate.x + Gate.size / 2,
        y: gatePalette.gates.Write1Gate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop |1> gate");
  });

  it("Drag and drop Measurement gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.MeasurementGate.x + Gate.size / 2,
        gatePalette.gates.MeasurementGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.MeasurementGate.x + Gate.size / 2,
        y: gatePalette.gates.MeasurementGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop Measurement gate");
  });

  it("Drag and drop Bloch Sphere gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.BlochSphere.x + Gate.size / 2,
        gatePalette.gates.BlochSphere.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.BlochSphere.x + Gate.size / 2,
        y: gatePalette.gates.BlochSphere.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop Bloch Sphere gate");
  });

  it("Drag and drop QFT gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.QFTGate.x + Gate.size / 2,
        gatePalette.gates.QFTGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.QFTGate.x + Gate.size / 2,
        y: gatePalette.gates.QFTGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop QFT gate");
  });

  it("Drag and drop QFT† gate", () => {
    cy.visit("/")
      .get("#app")
      .realMouseMove(
        gatePalette.gates.QFTDaggerGate.x + Gate.size / 2,
        gatePalette.gates.QFTDaggerGate.y + Gate.size / 2
      )
      .realMouseDown({
        x: gatePalette.gates.QFTDaggerGate.x + Gate.size / 2,
        y: gatePalette.gates.QFTDaggerGate.y + Gate.size / 2,
      })
      .realMouseMove(firstDropzone.x, firstDropzone.y)
      .realMouseUp()
      .percySnapshot("Drag & Drop QFT† gate");
  });
});
