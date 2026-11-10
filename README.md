# Pair Me

A minimal, Pinterest-inspired color palette generator that helps you discover beautiful pastel color combinations and matching Google Font pairings.

**[Explore Pair Me →](https://jc-glitchsys.github.io/pair-me/)**

---

## Preview

Discover soft pastel palettes, explore typography combinations, and save your favorite color inspirations in one place.

## Features

- **Palette Generation** – Generate 12 unique color palettes at a time.
- **Color Filters** – Choose between 2, 3, 4, or 5 colors per palette.
- **Pastel Mode** – Explore softer, lighter color combinations.
- **Font Pairings** – Discover complementary heading and body font combinations.
- **Shuffle Fonts** – Randomize typography while keeping your current palettes.
- **Color Locking** – Keep selected colors when generating new palettes.
- **Palette Details** – View individual colors, HEX codes, and font previews.
- **Copy HEX Codes** – Quickly copy individual colors or an entire palette.
- **Download Palettes** – Export palette designs as PNG images.
- **Find Pictures** – Explore visual inspiration based on palette colors.
- **Save Favorites** – Save palettes and access them through the Saved tab.
- **Search** – Find saved palettes by name, HEX code, or font name.
- **Responsive Layout** – Browse palettes on desktop and mobile devices.

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Custom styling and animations |
| JavaScript | Palette generation and interactions |
| Tailwind CSS 3.4.17 | Utility-first styling |
| Google Fonts | Typography pairings |
| LocalStorage | Saving favorite palettes |
| HTML Canvas | PNG image exporting |
| SVG | Generated visual scenes |

## Project Structure

```text
pair-me/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── data.js
│   └── app.js
│
└── README.md
```

## Getting Started

Pair Me does not require a build process or backend.

1. Clone the repository:

```bash
git clone https://github.com/JC-glitchsys/pair-me.git
```

2. Navigate to the project folder:

```bash
cd pair-me
```

3. Open `index.html` in your browser.

Alternatively, use a local development server for a smoother development experience.

## Live Demo

**[https://jc-glitchsys.github.io/pair-me/](https://jc-glitchsys.github.io/pair-me/)**

## Design Philosophy

Pair Me follows a minimal and clean visual direction:

- Pure white background
- Inter typography for the interface
- Soft pastel color combinations
- Rounded palette cards
- Subtle transitions and animations
- Pinterest-inspired masonry layout
- Simple and intuitive interactions

The goal is to make discovering color combinations and typography both enjoyable and effortless.

## Future Improvements

- [ ] Integrate real Unsplash photography.
- [ ] Improve mobile HEX code interactions.
- [ ] Enhance keyboard navigation and accessibility.
- [ ] Add save and unsave toast notifications.
- [ ] Improve palette color distribution.
- [ ] Prevent duplicate saved palettes.
- [ ] Refactor JavaScript into separate modules.
- [ ] Optimize rendering performance.
- [ ] Replace Tailwind CDN with a production-ready setup.

## Deployment

Pair Me is hosted using **GitHub Pages**.

Every update pushed to the configured deployment branch can be published through GitHub Pages.

## License

This project is intended for personal and educational use.

---

**Pair Me** — Find your colors. Match your fonts. Create your palette.
