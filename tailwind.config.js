/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            fontFamily: {
                // From index.html: 'Inter', sans-serif for body, 'Outfit', sans-serif for headers
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
