const config = {
  plugins: ["@tailwindcss/postcss"],
    theme: {
    extend: {
      keyframes: {
        pop: {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      animation: {
        pop: 'pop 0.3s ease-out forwards',
      },
    },
  },
};

export default config;
