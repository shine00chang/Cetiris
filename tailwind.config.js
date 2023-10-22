/** @type {import('tailwindcss').Config} */
export default {
  content: ['**/*.{js,svelte,html}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ['cupcake']
  },
  plugins: [require('daisyui')],
}

