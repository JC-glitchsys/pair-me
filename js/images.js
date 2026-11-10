import { colorFamilyName } from "./color.js";

// Curated Unsplash-hosted photography. No API key is required for these image URLs.
const UNSPLASH_PHOTOS = [
  { id: "photo-1490750967868-88aa4486c946", family: "rose", fallback: "#E9B9C8" },
  { id: "photo-1494438639946-1ebd1d20bf85", family: "peach", fallback: "#F2D3B8" },
  { id: "photo-1513519245088-0e12902e5a38", family: "yellow", fallback: "#F2E6B8" },
  { id: "photo-1500530855697-b586d89ba3ee", family: "green", fallback: "#C9DDC9" },
  { id: "photo-1497366754035-f200968a6e72", family: "blue", fallback: "#C8DDED" },
  { id: "photo-1515886657613-9f3515b0c78f", family: "indigo", fallback: "#C9C8E8" },
  { id: "photo-1490481651871-ab68de25d43d", family: "lavender", fallback: "#DCCCEB" },
  { id: "photo-1518837695005-2083093ee35b", family: "pink", fallback: "#E9C7D5" },
  { id: "photo-1470252649378-9c29740c9fa8", family: "green", fallback: "#D1DFC9" },
  { id: "photo-1490730141103-6cac27aaab94", family: "peach", fallback: "#EED7C4" },
];

function svgFallback(color, secondary) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="${secondary}"/></linearGradient></defs><rect width="800" height="560" fill="url(#g)"/><circle cx="220" cy="180" r="130" fill="#fff" opacity=".35"/><path d="M0 430 Q200 300 400 430 T800 430 V560 H0Z" fill="#fff" opacity=".3"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function getUnsplashPhotos(colors, count = 6) {
  const families = [...new Set(colors.map(colorFamilyName))];
  const ordered = [
    ...UNSPLASH_PHOTOS.filter((photo) => families.includes(photo.family)),
    ...UNSPLASH_PHOTOS.filter((photo) => !families.includes(photo.family)),
  ];
  return Array.from({ length: count }, (_, index) => {
    const photo = ordered[index % ordered.length];
    return {
      src: `https://images.unsplash.com/${photo.id}?auto=format&fit=crop&w=900&q=82`,
      fallback: svgFallback(photo.fallback, "#F8F5F2"),
      alt: `Unsplash photograph in a ${photo.family} color mood`,
    };
  });
}
