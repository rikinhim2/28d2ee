/// <reference types="cypress" />

const alice = {
  username: "Alice",
  email: "alice@example.com",
  password: "Z6#6%xfLTarZ9U",
};
const bob = {
  username: "Bob",
  email: "bob@example.com",
  password: "L%e$xZHC4QKP@F",
};

describe("Bug Fix: Sending Messages", () => {
  it("setup", () => {
    cy.signup(alice.username, alice.email, alice.password);
    cy.logout();
    cy.signup(bob.username, bob.email, bob.password);
    cy.logout();
  });

  it("sends message in a new conversation", () => {
    cy.login(alice.username, alice.password);

    cy.get("input[name=search]").type("Bob");
    cy.contains("Bob").click();

    cy.get("input[name=text]").type("First message{enter}");
    cy.get("input[name=text]").type("Second message{enter}");
    cy.get("input[name=text]").type("Third message{enter}");

    cy.contains("First message");
    cy.contains("Second message");
    cy.contains("Third message");
  });

  it("displays messages in correct order", () => {
    cy.reload();
    cy.login(alice.username, alice.password);
    cy.contains("Bob").click();

    cy.contains("First message").then(() => {
      // Select the message list DOM by finding the closest common ancestor
      // between two messages.
      const $firstMessage = Cypress.$(':contains("First message")');
      const $secondMessage = Cypress.$(':contains("Second message")');
      const $list = $firstMessage.parents().has($secondMessage).first();

      // Verify message ordering.
      cy.wrap($list).children().eq(0).should("contain", "First message");
      cy.wrap($list).children().eq(1).should("contain", "Second message");
      cy.wrap($list).children().eq(2).should("contain", "Third message");
    });
  });

  it("sends message in an existing conversation", () => {
    cy.login(alice.username, alice.password);

    cy.get("input[name=search]").type("Bob");
    cy.contains("Bob").click();

    cy.get("input[name=text]").type("Fourth message{enter}");
    cy.get("input[name=text]").type("Fifth message{enter}");
    cy.get("input[name=text]").type("Sixth message{enter}");

    cy.contains("Fourth message");
    cy.contains("Fifth message");
    cy.contains("Sixth message");
  });
});
