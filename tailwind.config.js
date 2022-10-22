const colors = require("tailwindcss/colors");

module.exports = {
    content: [
        "./screens/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",

    theme: {
        colors: {
            main: "#561F37",
            secondary: "#253237",
            white: colors.white,
        },
        textColor: {
            white: colors.white,
            black: "#000",
            main: "#561F37",
            secondary: "#253237",
        },
        extend: {},
        fontFamily: {
            signika: ["Signika", "sans-serif"],
        },
    },
    // ...
};
