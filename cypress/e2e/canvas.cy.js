describe("template spec", () => {
  it("passes", () => {
    cy.visit("/");
    cy.get("canvas");

    cy.percySnapshot();
  });
});
