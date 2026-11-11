# Pair Me

Pinterest-inspired color palette and font pairing studio. Vite, Tailwind CSS 3.4.17, vanilla ES modules.

## Setup
    npm install
    npm run dev       # http://localhost:5173/pair-me/
    npm run build     # output in dist/
    npm run preview

## Deploy (GitHub Pages)
`vite.config.js` sets `base: "/pair-me/"` (the repository name). Push to `main`; `.github/workflows/deploy.yml` builds and deploys. In repo Settings > Pages, set Source to GitHub Actions. If you rename the repo, change `base`.

## Add palettes
Append a row to `ROWS` in `js/palettes.js`: `["Name", "Category", "HEX,HEX,HEX", "Heading font", "Body font"]`. IDs come from row position, so never reorder or delete rows (saved palettes use the ID). The console warns about invalid HEX, duplicates, or unknown categories. New fonts must also be added to the Google Fonts link in `index.html`.

## Structure
`js/data.js` fonts and hues, `palettes.js` curated data, `palette.js` generation, `mockups.js` design previews, `storage.js` state, saved (key `pairme_saved_v2`, migrates old `pm_saved`) and share links, `modal.js`, `export.js` (PNG), `app.js` grid, filters, search.

## Categories and moods
Categories are listed in `CATEGORIES` in `js/palettes.js` (add a name there, then use it in a row). Moods are computed from the colors in `js/mood.js` (edit the rules or the `MOODS` list there), so every palette, curated or generated, gets them automatically.
