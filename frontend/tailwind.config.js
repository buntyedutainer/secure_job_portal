/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { 
    extend: { 
      colors: { 
        ink: '#12203D', 
        paper: '#FAF7F0', 
        accent: '#F2A93B', 
        accentdeep: '#C97B1F', 
        line: '#E4DFD3', 
      }, 
      fontFamily: { 
          display: ['Sora', 'sans-serif'], 
          sans: ['Inter', 'sans-serif'], 
      }, 
    }, 
  }, 
  plugins: [],
}

