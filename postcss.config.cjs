// postcss.config.cjs
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const { default: daisyui } = require('daisyui');

module.exports = {
  plugins: [
    tailwindcss,
    autoprefixer,
    daisyui,
  ],
}
