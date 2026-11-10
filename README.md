# Pair Me

A minimal, Pinterest-inspired color palette generator for discovering harmonious color combinations and matching Google Font pairings.

**Live demo:** https://jc-glitchsys.github.io/pair-me/

## Features

- Generate palettes with 2–5 colors.
- Explore soft pastel and more saturated color combinations.
- Browse curated Google Font pairings and shuffle typography.
- Lock individual colors while regenerating the rest.
- Copy individual HEX values or an entire palette.
- Save and unsave favorite palettes with toast feedback.
- Prevent duplicate saved palettes.
- Search by palette name, HEX code, or font.
- Explore curated photography hosted by Unsplash, with graceful image fallbacks.
- Download a palette preview as a PNG.
- Responsive layout, keyboard navigation, focus management, and reduced-motion support.
- Saved palettes persist in browser localStorage.

## Tech stack

- HTML5
- Tailwind CSS 3.4.17
- Vanilla JavaScript with ES modules
- Vite
- PostCSS and Autoprefixer
- Google Fonts
- Unsplash-hosted photography
- Canvas API
- localStorage

## Project structure

```text
pair-me/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── .gitignore
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── color.js
│   ├── data.js
│   ├── images.js
│   ├── storage.js
│   └── ui.js
└── README.md
```

## Run locally

Install [Node.js](https://nodejs.org/) first.

```bash
npm install
npm run dev
```

Vite will print a local development URL in your terminal.

## Production build

```bash
npm run build
npm run preview
```

The optimized production site is generated in the `dist/` folder.

## Deploy to GitHub Pages

For a project site hosted at `https://<username>.github.io/pair-me/`, set the Vite base path to `/pair-me/` in `vite.config.js` (included in the repository) before building. Then deploy the contents of `dist/` using GitHub Actions or your preferred Pages workflow.

## Photography

Photo inspiration uses curated image URLs hosted by Unsplash. The integration does not require an API key. An image that fails to load is gracefully hidden so the rest of the palette experience remains usable.

## Accessibility

Pair Me includes semantic buttons, accessible labels, visible keyboard focus, keyboard-operable palette cards, modal focus trapping, Escape-to-close behavior, live toast announcements, and reduced-motion support.

## License

No license has been specified. Add a `LICENSE` file if you want to grant others explicit permission to reuse or modify this project.
