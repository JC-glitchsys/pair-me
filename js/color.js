const random = (min, max) => min + Math.random() * (max - min);
const pick = (items) => items[Math.floor(Math.random() * items.length)];

export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const channel = (n) => {
    const k = (n + h / 30) % 12;
    const value = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * value).toString(16).padStart(2, "0");
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`.toUpperCase();
}

export function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return { h: (h * 60 + 360) % 360, s: s * 100, l: l * 100 };
}

export function createColor(hue, index, pastel) {
  const hueOffset = random(-9, 9);
  const saturation = pastel ? random(38, 62) : random(42, 68);
  const lightness = pastel ? random(82, 93) : random(68, 84);
  return hslToHex(hue + hueOffset, saturation, lightness);
}

// Uses a rotating harmony scheme instead of repeatedly sampling one narrow hue band.
export function createPaletteColors(count, pastel, lockedColors = [], lockedFlags = []) {
  const baseHue = random(0, 360);
  const schemes = [
    (i) => i * 28,
    (i) => i * 42,
    (i) => i % 2 === 0 ? i * 18 : 180 + (i - 1) * 18,
    (i) => i * 137.5,
  ];
  const scheme = pick(schemes);
  const result = [];
  const flags = [];

  for (let i = 0; i < count; i += 1) {
    if (lockedFlags[i] && lockedColors[i]) {
      result.push(lockedColors[i]);
      flags.push(true);
      continue;
    }

    let color = "";
    for (let attempt = 0; attempt < 16; attempt += 1) {
      color = createColor(baseHue + scheme(i), i, pastel);
      const candidate = hexToHsl(color);
      const sufficientlyDifferent = result.every((existing) => {
        const previous = hexToHsl(existing);
        const hueGap = Math.min(Math.abs(candidate.h - previous.h), 360 - Math.abs(candidate.h - previous.h));
        return hueGap > 10 || Math.abs(candidate.l - previous.l) > 8;
      });
      if (sufficientlyDifferent) break;
    }
    result.push(color);
    flags.push(false);
  }
  return { colors: result, locks: flags };
}

export function colorFamilyName(hex) {
  const { h } = hexToHsl(hex);
  if (h < 15 || h >= 345) return "rose";
  if (h < 40) return "peach";
  if (h < 68) return "yellow";
  if (h < 165) return "green";
  if (h < 215) return "blue";
  if (h < 255) return "indigo";
  if (h < 290) return "lavender";
  return "pink";
}

export function paletteSignature(palette) {
  return palette.colors.map((color) => color.toUpperCase()).join("|");
}
