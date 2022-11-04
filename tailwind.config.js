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
            gray: colors.gray,
        },
        textColor: {
            white: colors.white,
            black: "#000",
            main: "#561F37",
            secondary: "#253237",
            gray: colors.gray
        },
        extend: {},
        fontFamily: {
            signika: ["Signika", "sans-serif"],
        },
    },
    // ...
};
