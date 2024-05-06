// This tells VS Code to autocomplete cypress
/// <reference types="cypress" />
describe("Validate events api call", () => {
    it("Validate events api call", () => {
        cy.request({
            method: "GET",
            url: "https://joinmeapi.onrender.com/api/events",
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.not.be.null;
            expect(response.body[0]).to.have.property("_id");
            expect(response.body[0]).to.have.property("name");
            expect(response.body[0]).to.have.property("description");
            expect(response.body[0]).to.have.property("startDate");
            expect(response.body[0]).to.have.property("endDate");
            expect(response.body[0]).to.have.property("location");
        });
    });
});
