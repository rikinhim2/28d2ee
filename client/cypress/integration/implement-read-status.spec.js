/// <reference types="cypress" />

const thomas = {
  username: "thomas",
  password: "123456",
};

describe("Implement read status", () => {
  it("Thomas has 12 unread messages from Hualing", () => {
    cy.login(thomas.username, thomas.password);
    cy.contains("hualing").parent().parent().contains("12");
  });
});
