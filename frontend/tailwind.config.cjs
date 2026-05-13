module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0457b8',
          dark: '#0d2a67',
          sand: '#edf4ff',
          ink: '#102345',
          gold: '#f1bb40',
          red: '#cc2d30',
        },
      },
      boxShadow: {
        panel: '0 20px 48px rgba(16, 35, 69, 0.12)',
      },
    },
  },
  plugins: [],
};
