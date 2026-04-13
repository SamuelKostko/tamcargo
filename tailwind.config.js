/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        electric: "#B11E22",
        "electric-light": "#c9474a",
        navy: "#fff7f7",
        "navy-mid": "#fff1f1",
        "navy-light": "#ffe4e4",
        cyan: "#d96568",
        "cyan-light": "#e78f91",
      },
    },
  },
  plugins: [],
}
