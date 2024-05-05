const runTests = () => {
  describe("After the game ends", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/");
      cy.get("button").contains("START").click();
      // score 10 points
      for (let i = 0; i < 10; i++) {
        cy.get("[data-testid=challenge-note]")
          .invoke("text")
          .then((challengeNote) => {
            cy.get("[data-testid=fretboard] button")
              .contains(challengeNote)
              .click({ force: true });
          });
      }
      // wait up to 10 seconds for game to end ("Time's Up!" visible)
      cy.get("[data-testid=game-over-text]", { timeout: 10000 });
    });

    it("should render the game over card and 'play again' button", () => {
      cy.get("[data-testid=game-over-card]").should("exist").and("be.visible");
      cy.get("[data-testid=game-over-card]").contains("You scored 10 points.");
      cy.get("[data-testid=play-again-button]")
        .should("exist")
        .and("be.visible");
    });

    it("should save the score to local storage", () => {
      const expectedValues = {
        points: 10,
        tuning: "E Standard",
        instrument: "guitar",
        hardMode: false,
      };
      cy.window().then((window) => {
        const scores = JSON.parse(window.localStorage.getItem("scores"));
        expect(scores).to.be.an("array").and.to.have.lengthOf(1);
        expect(scores[0]).to.include(expectedValues);
        expect(typeof scores[0].timestamp).to.equal("string");
      });
    });

    it("should display the score in history", () => {
      cy.get("h2").contains("History");
      cy.get("[data-testid=history-table] tbody").then(($tbody) => {
        // Check if the tbody has exactly one row
        cy.wrap($tbody).find("tr").should("have.length", 1);
      });
      // history table has a td which contains the score points
      cy.get("[data-testid=history-table] tbody td").contains("10");
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
