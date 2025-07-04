/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",],
  presets: [
    require("nativewind/preset"),
  ],
  theme: {
    extend: {
      colors: {
        'pink-low' : '#FFE3EC',
        'pink-semi-low': '#F9C5D5',
        'pink-semi-medium' : '#FBB1C6',
        'pink-medium' :'#F789AC',
        'pink-hard':'#F1789F',
        'pink-faint': '#F9C5D5',
        'black-low' :  '#444444',
      }
    }
  },
  plugins: [],
}

