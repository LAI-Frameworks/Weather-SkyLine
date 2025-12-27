/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Simple colors without CSS variables
        background: '#0f172a',
        foreground: '#ffffff',
        primary: '#3b82f6',
        secondary: '#1e293b',
        muted: '#64748b',
        border: '#334155',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0c4a6e 100%)',
      },
    },
  },
  plugins: [],
}