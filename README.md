# Pair Me

A minimal, Pinterest-inspired color palette generator with Google Font pairings, palette saving, and downloadable palette previews.

## Features

- Generate harmonious palettes with 2, 3, 4, or 5 colors
- Optional pastel palette mode and locked colors
- Search palettes, HEX values, and font pairings
- Unsplash photography with generated SVG fallbacks
- Tap-friendly HEX copying on mobile
- Keyboard-accessible palette cards and modal interactions
- Save and remove palettes with toast feedback
- Duplicate saved-palette prevention
- Download palette previews as PNG
- Saved palettes persist in local storage

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`.

## GitHub Pages deployment

This repository is configured for the project URL `/pair-me/` in `vite.config.js`.

1. Push the project to the `main` branch.
2. In GitHub, open **Settings → Pages**.
3. Set **Build and deployment → Source** to **GitHub Actions**.
4. The workflow at `.github/workflows/deploy.yml` builds the Vite project and deploys the `dist/` directory.

Do not upload the source files as the published site. GitHub Actions must deploy the generated `dist/` output.

## Tech stack

- HTML, CSS, and JavaScript ES modules
- Vite
- Tailwind CSS 3.4
- Google Fonts
- Unsplash Source images with local SVG data fallbacks
- Browser Local Storage and Canvas API
