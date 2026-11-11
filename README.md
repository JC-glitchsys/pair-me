# Pair Me

Pinterest-inspired color palette and font pairing studio. Vite, Tailwind CSS 3.4.17, vanilla ES modules.

## Setup
    npm install
    npm run dev       # http://localhost:5173/pair-me/
    npm run build     # output in dist/
    npm run preview

## Environment variables (optional)
Copy `.env.example` to `.env` and set `VITE_UNSPLASH_KEY` to your Unsplash Access Key to search photos by palette name and category. Without it, photos come from the ID lists in `js/images.js`. Never commit `.env`; the key ends up in the built JS, so use only the public Access Key, never the Secret Key.

## Deploy (GitHub Pages)
`vite.config.js` sets `base: "/pair-me/"` (the repository name). Push to `main`; `.github/workflows/deploy.yml` builds and deploys. In repo Settings > Pages, set Source to GitHub Actions. If you rename the repo, change `base`.

## Add palettes
Append a row to `ROWS` in `js/palettes.js`: `["Name", "Category", "HEX,HEX,HEX", "Heading font", "Body font"]`. IDs come from row position, so never reorder or delete rows (saved palettes use the ID). The console warns about invalid HEX, duplicates, or unknown categories. New fonts must also be added to the Google Fonts link in `index.html`.

## Structure
`js/data.js` fonts and hues, `palettes.js` curated data, `palette.js` generation, `images.js` photos, `storage.js` state, saved (key `pairme_saved_v2`, migrates old `pm_saved`) and share links, `modal.js`, `export.js` (PNG), `app.js` grid, filters, search.
