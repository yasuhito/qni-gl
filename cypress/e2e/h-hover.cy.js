describe("hover H gate", () => {
  it("passes", () => {
    cy.visit("/");

    cy.get("canvas").then(($canvas) => {
      cy.wrap($canvas)
        .realMouseMove(174 + 16, 48 + 16)
        .percySnapshot("H gate");
    });
  });
});
