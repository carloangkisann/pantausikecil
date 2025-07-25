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
        'pink-faint-low' : '#F99AB6',
        'pink-faint-hard' : '#F789AC',
        'black-low' :  '#444444',
        'black-3' : '#333333',
        'black-medium' : "#141A1E",
        'gray-1': '#989898', 
        'gray-2':'#00000047',
        'gray-medium' : "#90A5B4",
        'pink-gyj' : "#F99AB6CC",
        'red-hard' : '#D4414A'
      },
      fontFamily: {
        'poppins-light': ['Poppins-Light'],
        'poppins': ['Poppins-Regular'],
        'poppins-medium': ['Poppins-Medium'],
        'poppins-semibold': ['Poppins-SemiBold'],
        'poppins-bold': ['Poppins-Bold'],
        'poppins-lightitalic' : ['Poppins-LightItalic'],
        'inter' : ['Inter']
      },
    }
  },
  plugins: [],
}

