/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      pblack: ['Pretendard-Black'],
      pextralight: ['Pretendard-ExtraLight'],
      plight: ['Pretendard-Light'],
      pregular: ['Pretendard-Regular'],
      pmedium: ['Pretendard-Medium'],
      pbold: ['Pretendard-Bold'],
      pextrabold: ['Pretendard-ExtraBold'],
      psemibold: ['Pretendard-SemiBold'],
      pthin: ['Pretendard-Thin'],
      title: ['BagelFatOne-Regular'],
    },
    extend: {
      colors: {
        primary: '#769BFF',
        secondary: '#93AAE7',
        background: '#EAF0FF',
      },
    },
  },
  plugins: [],
};
