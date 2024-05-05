const runTests = () => {
  describe("Playing the game", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/");
      cy.get("button").contains("START").click();
    });

    it("should display the label for the note that was clicked", () => {
      // get the challenge note from the challenge container
      cy.get("[data-testid=challenge-note]")
        .invoke("text")
        .then((challengeNote) => {
          // click a button on the fretboard
          cy.get("[data-testid=fretboard] button")
            .contains(challengeNote)
            .click({ force: true });
          // check that the button label is visible
          cy.get("[data-testid=fretboard] button")
            .find("span.clicked")
            .should("exist")
            .and("be.visible");
        });
    });

    it("should display a green label when clicking a correct note", () => {
      // get the challenge note from the challenge container
      cy.get("[data-testid=challenge-note]")
        .invoke("text")
        .then((challengeNote) => {
          // click a button which contains the challenge note
          cy.get("[data-testid=fretboard] button")
            .contains(challengeNote)
            .click({ force: true });
          // check that the button label is visible and green
          cy.get("[data-testid=fretboard] button")
            .find("span.clicked")
            .should("be.visible")
            .and("have.css", "background-color", "rgb(39, 174, 96)"); // --success-color
        });
    });

    it("should display a red label when clicking an incorrect note", () => {
      // get the challenge note from the challenge container
      cy.get("[data-testid=challenge-note]")
        .invoke("text")
        .then((challengeNote) => {
          // click a button within the fretboard that does not contain the challenge note
          cy.get("[data-testid=fretboard] button")
            .not(`:contains(${challengeNote})`)
            .first() // select the first button that does not contain the challenge note
            .click({ force: true });
          // check that the button label is visible and red
          cy.get("[data-testid=fretboard] button")
            .find("span.clicked")
            .should("be.visible")
            .and("have.css", "background-color", "rgb(235, 87, 87)"); // --failure-color
        });
    });

    it("should increment the current score when a challenge is completed", () => {
      // check that the current score is 0
      cy.get("[data-testid=current-score]").contains("0");
      // get the challenge note from the challenge container
      cy.get("[data-testid=challenge-note]")
        .invoke("text")
        .then((challengeNote) => {
          // click a button which contains the challenge note
          cy.get("[data-testid=fretboard] button")
            .contains(challengeNote)
            .click({ force: true });
          // check that the current score is 1
          cy.get("[data-testid=current-score]").contains("1");
        });
    });

    it("should update the challenge when a challenge is completed", () => {
      // get the challenge note from the challenge container
      cy.get("[data-testid=challenge-note]")
        .invoke("text")
        .then((challengeNote) => {
          // click a button which contains the challenge note
          cy.get("[data-testid=fretboard] button")
            .contains(challengeNote)
            .click({ force: true });
          // check that the challenge note has changed
          cy.get("[data-testid=challenge-note]").should(
            "not.contain",
            challengeNote,
          );
        });
    });

    it("should render the skip button when failing a challenge", () => {
      // get the challenge note from the challenge container
      cy.get("[data-testid=challenge-note]")
        .invoke("text")
        .then((challengeNote) => {
          // click a button within the fretboard that does not contain the challenge note
          cy.get("[data-testid=fretboard] button")
            .not(`:contains(${challengeNote})`)
            .first() // select the first button that does not contain the challenge note
            .click({ force: true });
          // check that the skip button is visible
          cy.get("[data-testid=skip-button]").should("exist").and("be.visible");
        });
    });

    it("should update the challenge when the skip button is clicked", () => {
      // get the challenge note from the challenge container
      cy.get("[data-testid=challenge-note]")
        .invoke("text")
        .then((challengeNote) => {
          // click a button within the fretboard that does not contain the challenge note
          cy.get("[data-testid=fretboard] button")
            .not(`:contains(${challengeNote})`)
            .first() // select the first button that does not contain the challenge note
            .click({ force: true });
          // click the skip button
          cy.get("[data-testid=skip-button]").click();
          // check that the challenge has changed
          cy.get("[data-testid=challenge-note]").should(
            "not.contain",
            challengeNote,
          );
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
