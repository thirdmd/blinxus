/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.tsx",
    "./blinxus/src/**/*.{js,jsx,ts,tsx}",
    "./blinxus/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        'dark-primary': '#0B1426',
        'dark-secondary': '#1A2332',
        'dark-tertiary': '#243040',
        'dark-text': '#FFFFFF',
        'dark-text-secondary': '#B8C5D1',
        'dark-text-tertiary': '#8A9BA8',
        'dark-border': '#2A3441',
        'dark-subtle': '#1F2937',
      },
    },
  },
  plugins: [],
} 