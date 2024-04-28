describe("Header Navigation", () => {
  beforeEach(() => cy.visit("http://localhost:3000/"));

  it("should navigate to the About page", () => {
    cy.get("[data-testid=header-nav-links]").find('a[href*="about"]').click();
    cy.url().should("include", "/about");
    cy.get("h1").contains("About");
  });

  it("should navigate to the Tips page", () => {
    cy.get("[data-testid=header-nav-links]").find('a[href*="tips"]').click();
    cy.url().should("include", "/tips");
    cy.get("h1").contains("Tips");
  });

  it("should navigate to the Sign-in page", () => {
    cy.get("[data-testid=header-nav-links]").find('a[href*="signin"]').click();
    cy.url().should("include", "/signin");
    cy.get("h2").contains("Sign In");
  });

  it("should navigate to the Home page", () => {
    cy.visit("http://localhost:3000/about");
    cy.get("[data-testid=header-nav]").find('a[href="/"]').click();
    cy.url().should("eq", "http://localhost:3000/");
    cy.get("h1").contains("Fretboard Trainer");
  });
});

describe("Mobile Header Navigation", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
    cy.viewport(360, 660);
    cy.get("[data-testid=header-nav-dropdown-button]").click();
  });

  after(() => {
    cy.viewport(1000, 600);
  });

  it("should navigate to the About page", () => {
    cy.get("[data-testid=header-nav-dropdown-links]")
      .find('a[href*="about"]')
      .click();
    cy.url().should("include", "/about");
    cy.get("h1").contains("About");
  });

  it("should navigate to the Tips page", () => {
    cy.get("[data-testid=header-nav-dropdown-links]")
      .find('a[href*="tips"]')
      .click();
    cy.url().should("include", "/tips");
    cy.get("h1").contains("Tips");
  });

  it("should navigate to the Sign-in page", () => {
    cy.get("[data-testid=header-nav-dropdown-links]")
      .find('a[href*="signin"]')
      .click();
    cy.url().should("include", "/signin");
    cy.get("h2").contains("Sign In");
  });
});

describe("Footer Navigation", () => {
  beforeEach(() => cy.visit("http://localhost:3000/"));

  it("should navigate to the About page", () => {
    cy.get("[data-testid=footer-nav-links]").find('a[href*="about"]').click();
    cy.url().should("include", "/about");
    cy.get("h1").contains("About");
  });

  it("should navigate to the Tips page", () => {
    cy.get("[data-testid=footer-nav-links]").find('a[href*="tips"]').click();
    cy.url().should("include", "/tips");
    cy.get("h1").contains("Tips");
  });

  it("should navigate to the Sign-in page", () => {
    cy.get("[data-testid=footer-nav-links]").find('a[href*="signin"]').click();
    cy.url().should("include", "/signin");
    cy.get("h2").contains("Sign In");
  });
});
