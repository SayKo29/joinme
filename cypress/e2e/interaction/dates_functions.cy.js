const utils = require("../../../lib/utils");
context("Format date relative to today", () => {
    it("should show the relative day to today", () => {
        // Arrange
        const dateYesterday = new Date();
        dateYesterday.setDate(dateYesterday.getDate() - 1);
        const expectedFormattedDate = "hace 1 día";

        // Act
        const formattedDate = utils.formatDateRelative(dateYesterday);

        // Assert
        expect(formattedDate).equal(expectedFormattedDate);
    });

    it("should show the relative hour to today", () => {
        // Arrange
        const dateYesterday = new Date();
        dateYesterday.setHours(dateYesterday.getHours() - 1);
        const expectedFormattedDate = "hace 1 hora";

        // Act
        const formattedDate = utils.formatDateRelative(dateYesterday);

        // Assert
        expect(formattedDate).equal(expectedFormattedDate);
    });

    it("should show the relative minute to today", () => {
        // Arrange
        const dateYesterday = new Date();
        dateYesterday.setMinutes(dateYesterday.getMinutes() - 1);
        const expectedFormattedDate = "hace 1 minuto";

        // Act
        const formattedDate = utils.formatDateRelative(dateYesterday);

        // Assert
        expect(formattedDate).equal(expectedFormattedDate);
    });

    it("should show the relative hours in plural", () => {
        // Arrange
        const dateYesterday = new Date();
        dateYesterday.setHours(dateYesterday.getHours() - 2);
        const expectedFormattedDate = "hace 2 horas";

        // Act
        const formattedDate = utils.formatDateRelative(dateYesterday);

        // Assert
        expect(formattedDate).equal(expectedFormattedDate);
    });

    it("should show the relative days in plural", () => {
        // Arrange
        const dateYesterday = new Date();
        dateYesterday.setDate(dateYesterday.getDate() - 2);
        const expectedFormattedDate = "hace 2 días";

        // Act
        const formattedDate = utils.formatDateRelative(dateYesterday);

        // Assert
        expect(formattedDate).equal(expectedFormattedDate);
    });

    it("should show the relative minutes in plural", () => {
        // Arrange
        const dateYesterday = new Date();
        dateYesterday.setMinutes(dateYesterday.getMinutes() - 2);
        const expectedFormattedDate = "hace 2 minutos";

        // Act
        const formattedDate = utils.formatDateRelative(dateYesterday);

        // Assert
        expect(formattedDate).equal(expectedFormattedDate);
    });

    it("should return 'Fecha no valida' if date is not valid", () => {
        // Arrange
        const dateYesterday = new Date("invalid date");
        const expectedFormattedDate = "Fecha no valida";

        // Act
        const formattedDate = utils.formatDateRelative(dateYesterday);

        // Assert
        expect(formattedDate).equal(expectedFormattedDate);
    });

    it("should return 'hace unos segundos' if date is now", () => {
        // Arrange
        const dateNow = new Date();
        const expectedFormattedDate = "hace unos segundos";

        // Act
        const formattedDate = utils.formatDateRelative(dateNow);

        // Assert
        expect(formattedDate).equal(expectedFormattedDate);
    });
});
