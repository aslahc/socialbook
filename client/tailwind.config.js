/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      scrollbar: {
        thin: "2px", // Set the thin scrollbar width
      },
    },
  },
  plugins: [],
};
