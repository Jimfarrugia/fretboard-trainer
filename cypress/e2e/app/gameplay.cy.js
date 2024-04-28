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
      cy.get("button").contains("Quit Game").should("exist").and("be.visible");
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
    cy.get("[data-testid=play-again-button]").should("exist").and("be.visible");
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
