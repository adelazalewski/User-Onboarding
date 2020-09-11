describe("Testinf the new user form", () => {
    beforeEach(() => {
        cy.visit("/")
    })
    it("fills out form inputs", () => {
        const cyName = "Adela Zalewski";
        const cyEmail = "paliuadela@yahoo.com";
        const cyPassword = "Adelaza9";
        const cyConfirmPassword = cyPassword;

    //fill out the name and make sure it's the right name
    cy.get('[type="text"]').type(cyName).should("have.value", cyName)

    //get the email input and type in an email address
    cy.get('[type="email"]').type(cyEmail).should("have.value", cyEmail)

    //get the password input and type in a password
    cy.get('[name="password"]').type(cyPassword).should('have.value', cyPassword)

    //get confirm password input and type the value
    cy.get('[name="confirmPassword"]').type(cyConfirmPassword).should('have.value', cyConfirmPassword)

    //choose an option from the select input
    cy.get('[data-cy=dropdown]').select("Ravenclaw").should('have.value', "ravenclaw")

    //check terms of service
    cy.get('#checkbox').check().should('be.checked')

    //check to see if a user can submit the form
    cy.get('form').submit() //true shows that i can get a POST request so it passes

    //leave an input empty and check for form validation 
    cy.get('[data-cy=description]').should('have.value', '')
    cy.get('[data-cy="description error"]').contains("We would like to get to know you as soon as possible :)")
})
})
