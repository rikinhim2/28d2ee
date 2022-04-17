/// <reference types="cypress" />

const thomas = {
  username: "thomas",
  password: "123456",
};

const santiago = {
  username: "santiago",
  password: "123456",
};

const hualing = {
  username: "hualing",
  password: "123456",
};

const cheng = {
  username: "cheng",
  password: "123456",
};

describe("Implement read status", () => {
  it("has 12 unread messages from Hualing", () => {
    cy.login(thomas.username, thomas.password);
    cy.contains("hualing").parent().parent().contains("12");
  });

  it("send 3 more messages to Thomas, he is having 15 unread message now", () => {
    cy.login(hualing.username, hualing.password);
    cy.contains("thomas").click();
    cy.get("input[name=text]").type("Extra message 1{enter}");
    cy.get("input[name=text]").type("Extra message 2{enter}");
    cy.get("input[name=text]").type("Extra message 3{enter}");
    
    cy.logout();

    cy.login(thomas.username, thomas.password);
    cy.contains("hualing").parent().parent().contains("15");
  });
  
  it("clean up 15 unread and receives another 11 new messages", () => {
    cy.login(thomas.username, thomas.password);
    cy.contains("hualing").parent().parent().should('contain', "15");
    cy.contains("hualing").click();
    cy.contains("hualing").parent().parent().should('not.contain', "15");
    
    cy.logout();

    cy.login(hualing.username, hualing.password);
    cy.contains("thomas").click();
    for (let i=0 ; i<11 ; i++) {
      cy.get("input[name=text]").type("new message{enter}");
    }

    cy.logout();
    cy.login(thomas.username, thomas.password);
    cy.contains("hualing").parent().parent().contains("11");
  });

  it("send receive new unread message from new conversation", () => {
    cy.login(cheng.username, cheng.password);
    cy.get("input[name=search]").type("thomas");
    cy.contains("thomas").click();
    cy.get("input[name=text]").type("First message{enter}");
    cy.get("input[name=text]").type("Second message{enter}");
    cy.get("input[name=text]").type("Third message{enter}");

    cy.logout();
    cy.login(thomas.username, thomas.password);
    cy.contains("cheng").parent().parent().contains("3");
  });

  it("contains an avatar at the last message of chat box", () => {
    cy.login(santiago.username, santiago.password);
    cy.get("input[name=search]").type("thomas");
    cy.contains("thomas").click();
    cy.get("input[name=text]").type("Hello from santiago{enter}");

    cy.logout();
    cy.login(thomas.username, thomas.password);
    cy.contains("santiago").click();

    cy.logout();
    cy.login(santiago.username, santiago.password);
    cy.contains("thomas").click();

    cy.contains("Hello from santiago").parent().parent().parent().find('img').should('have.attr', 'alt', 'thomas');
  });
});
