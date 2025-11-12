module.exports = {

  // anytime you add a new folder make sure to add the path to the content
  content: [
    "./App.tsx", 
    "./components/**/*.{js,jsx,ts,tsx}", 
    "./app/**/*"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      primary: "#5c3cff",
    },
  },
  plugins: [],
}