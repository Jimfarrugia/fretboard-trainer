const runTests = () => {
  describe("Starting and quitting the game", () => {
    beforeEach(() => cy.visit("http://localhost:3000/"));

    it("should render the start button", () => {
      cy.get("button").contains("START").should("exist").and("be.visible");
    });

    it("should start the game when the 'Start' button is clicked", () => {
      cy.get("button").contains("START").click();
      cy.get("button").contains("START").should("not.exist");
      cy.get("[data-testid=challenge-container]")
        .contains("Find ")
        .should("exist")
        .and("be.visible");
    });

    context("During the game", () => {
      it("should render the quit button", () => {
        cy.get("button").contains("START").click();
        cy.get("button")
          .contains("Quit Game")
          .should("exist")
          .and("be.visible");
      });

      it("should end the game when the 'Quit Game' button is clicked", () => {
        cy.get("button").contains("START").click();
        cy.get("button").contains("Quit Game").click();
        cy.get("[data-testid=challenge-container]").should("not.exist");
        cy.get("button").contains("Quit Game").should("not.exist");
        cy.get("button").contains("START").should("exist").and("be.visible");
      });

      it("should not render the settings button", () => {
        cy.get("button").contains("Settings").should("exist").and("be.visible");
        cy.get("button").contains("START").click();
        cy.get("button").contains("Settings").should("not.exist");
        cy.get("button").contains("Quit Game").click();
        cy.get("button").contains("Settings").should("exist").and("be.visible");
      });
    });
  });
};

describe("On wide/desktop screens", () => {
  runTests();
});

describe("On small/mobile screens", () => {
  beforeEach(() => {
    cy.viewport(360, 660);
  });
  runTests();
});
