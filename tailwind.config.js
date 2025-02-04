/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./templates/**/*.html.twig", "./assets/**/*.tsx", "./assets/**/*.js"],
    theme: {
        extend: {
            colors: {
                primary: "#093C6F",
                secondary: "#D6AD3A",
                dark: {
                    primary: "#1D1D1F",
                    secondary: "#2C2C2C",
                },
            },
        },
    },
    plugins: [],
};
