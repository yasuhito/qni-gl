describe("hover H gate", () => {
  it("passes", () => {
    cy.visit("/");

    cy.get("canvas").then(($canvas) => {
      cy.wrap($canvas).trigger("mousemove", 174 + 16, 48 + 16);
      cy.perSnapshot("H gate");
    });

    // .trigger("mousemove", 174 + 16, 48 + 16);
    // cy.percySnapshot();
  });
});
