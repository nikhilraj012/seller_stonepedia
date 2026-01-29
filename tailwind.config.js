// /** @type {import('tailwindcss').Config} */
// export default {
//   theme: {
//     fontFamily: {
//       poppins: "var(--font-poppins)",
//       outfit: "var(--font-outfit)",
//     },
//   },
// };
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#871B58",
      },
    },
    fontFamily: {
      poppins: "var(--font-poppins)",
      outfit: "var(--font-outfit)",
    },
  },
};