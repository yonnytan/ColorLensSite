/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Remove the auto-fit grid template since we're using dynamic columns
    },
  },
  plugins: [],
};
