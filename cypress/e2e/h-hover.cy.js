import { App } from "../../app";

describe("hover H gate", () => {
  it("passes", () => {
    cy.visit("/");
    // cy.get("#app").trigger("mousemove", { clientX: 174, clientY: 48 });
    cy.get("#app").trigger("mousemove", 174, 48);
    cy.percySnapshot();
  });
});
