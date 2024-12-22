module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          500: '#4CAF50', // Зелёный для акцентов
        },
        gray: {
          900: '#212121', // Тёмный фон
          800: '#303030', // Второстепенные блоки
          700: '#424242', // Границы и клавиши
          600: '#616161', // Текст и слабая подсветка
        },
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'], // Ретро-шрифт
      },
    },
  },
  plugins: [],
};
