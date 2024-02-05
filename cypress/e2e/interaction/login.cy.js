/// <reference types="cypress" />

context("Log in the app", () => {
    beforeEach(() => {
        cy.visit("http://localhost:19006/");
    });

    it("Enter email and password", () => {
        // https://on.cypress.io/type

        // get placeholder element
        cy.get('[placeholder="Correo electrónico"]')
            .type("123@gmail.com")
            .should("have.value", "123@gmail.com");

        cy.get("[placeholder='Contraseña']")
            .type("11111111")
            .should("have.value", "11111111");

        // click on login button
        cy.get("[data-testid=login-button]").click();

        // Wait for login process, now is 5 seconds cause maybe the server is in sleep mode
        cy.wait(5000);

        // Verify that login was successful by checking for a specific element on the dashboard
        cy.get("[data-testid=myevents-button]").should("exist"); // Adjust the selector accordingly

        // get an element that should show when the login is successful
        cy.get("[data-testid=myevents-button]").should(
            "contain.text",
            "Mis eventos"
        );

        // confirm that the login form is no longer visible
        cy.get("[data-testid=login-button]").should("not.exist");
        cy.get('[placeholder="Correo electrónico"]').should("not.exist");
        cy.get("[placeholder='Contraseña']").should("not.exist");
    });
});
