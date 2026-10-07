/** Palette: the reference's black is replaced by deep aqua; magenta/violet accents are kept. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        abyss: '#021B20', deep: '#04282F', panel: '#073840',
        aqua: '#22E5D3', mist: '#A6F0E8', magenta: '#D31BE6', violet: '#7A2FE0',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grad-card': 'linear-gradient(135deg,#D31BE6 0%,#7A2FE0 100%)',
      },
    },
  },
  plugins: [],
}
