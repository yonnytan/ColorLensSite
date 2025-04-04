import { hexToHSL, isColorInRange } from "./colorUtils";

// Cache for hexToHSL conversion
const hslCache = new Map();

const cachedHexToHSL = (hex) => {
  if (hslCache.has(hex)) return hslCache.get(hex);
  const hsl = hexToHSL(hex);
  hslCache.set(hex, hsl);
  return hsl;
};

const getHueRange = (hues) => {
  const sorted = hues.sort((a, b) => a - b);
  const gaps = sorted.map((h, i) => {
    const next = sorted[(i + 1) % sorted.length];
    return (next - h + 360) % 360;
  });
  return 360 - Math.max(...gaps); // smallest arc that includes all hues
};

export const hasVariedHues = (colors) => {
  const hues = colors.map((color) => cachedHexToHSL(color).h);
  const uniqueHues = new Set(hues.map((h) => Math.round(h / 30))); // Group similar hues
  return uniqueHues.size >= 3; // At least 3 different hue groups
};

export const hasSimilarHues = (colors) => {
  const hues = colors.map((color) => cachedHexToHSL(color).h);
  return getHueRange(hues) <= 45; // All hues within 45 degrees
};

const categoryRules = {
  dark: (hslColors) =>
    hslColors.filter(({ l }) => l < 50).length >=
    Math.ceil(hslColors.length / 2),
  light: (hslColors) =>
    hslColors.filter(({ l }) => l > 50).length >=
    Math.ceil(hslColors.length / 2),
  colorful: (hslColors, colors) =>
    hslColors.every(({ s }) => s > 30) && hasVariedHues(colors),
  monochrome: (hslColors, colors) => {
    const lowSaturation = hslColors.every(({ s }) => s < 20);
    return lowSaturation || hasSimilarHues(colors);
  },
  warm: (hslColors) =>
    hslColors.filter(({ h }) => (h >= 0 && h <= 60) || h >= 300).length >=
    Math.ceil(hslColors.length / 2),
  cool: (hslColors) =>
    hslColors.filter(({ h }) => h > 60 && h < 300).length >=
    Math.ceil(hslColors.length / 2),
};

export const filterByCategory = (palettes, category) => {
  if (!category || category === "all") return palettes;
  const rule = categoryRules[category];
  if (!rule) return palettes;

  return palettes.filter((palette) => {
    const hslColors = palette.colors.map(cachedHexToHSL);
    return rule(hslColors, palette.colors);
  });
};

const hslDistance = (c1, c2) => {
  const dh = Math.min(Math.abs(c1.h - c2.h), 360 - Math.abs(c1.h - c2.h)) / 180;
  const ds = Math.abs(c1.s - c2.s) / 100;
  const dl = Math.abs(c1.l - c2.l) / 100;
  return Math.sqrt(dh * dh + ds * ds + dl * dl);
};

export const filterByColor = (palettes, selectedColor) => {
  if (!selectedColor || selectedColor === "all") return palettes;

  const selectedHSL = cachedHexToHSL(selectedColor);

  return palettes.filter((palette) =>
    palette.colors.some((color) => {
      const colorHSL = cachedHexToHSL(color);
      return (
        hslDistance(colorHSL, selectedHSL) < 0.3 ||
        isColorInRange(color, selectedColor)
      );
    })
  );
};

export const sortPalettes = (palettes, sortBy) => {
  if (!sortBy || sortBy === "default") return palettes;

  return [...palettes].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.name || "").localeCompare(b.name || "");

      case "brightness": {
        const hslColorsA = a.colors.map(cachedHexToHSL);
        const hslColorsB = b.colors.map(cachedHexToHSL);
        const avgBrightnessA =
          hslColorsA.reduce((sum, { l }) => sum + l, 0) / hslColorsA.length;
        const avgBrightnessB =
          hslColorsB.reduce((sum, { l }) => sum + l, 0) / hslColorsB.length;
        return avgBrightnessB - avgBrightnessA;
      }

      case "saturation": {
        const hslColorsA = a.colors.map(cachedHexToHSL);
        const hslColorsB = b.colors.map(cachedHexToHSL);
        const avgSaturationA =
          hslColorsA.reduce((sum, { s }) => sum + s, 0) / hslColorsA.length;
        const avgSaturationB =
          hslColorsB.reduce((sum, { s }) => sum + s, 0) / hslColorsB.length;
        return avgSaturationB - avgSaturationA;
      }

      default:
        return 0;
    }
  });
};
