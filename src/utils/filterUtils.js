import { hexToHSL, isColorInRange } from './colorUtils';

export const hasVariedHues = (colors) => {
  const hues = colors.map((color) => hexToHSL(color).h);
  const uniqueHues = new Set(hues.map((h) => Math.round(h / 30))); // Group similar hues
  return uniqueHues.size >= 3; // At least 3 different hue groups
};

export const hasSimilarHues = (colors) => {
  const hues = colors.map((color) => hexToHSL(color).h);
  const hueRange = Math.max(...hues) - Math.min(...hues);
  return hueRange <= 45; // All hues within 45 degrees
};

export const filterByCategory = (palettes, category) => {
  if (!category || category === "all") return palettes;

  return palettes.filter((palette) => {
    switch (category) {
      case "dark":
        return palette.colors.filter((color) => {
          const { l } = hexToHSL(color);
          return l < 50;
        }).length >= Math.ceil(palette.colors.length / 2);

      case "light":
        return palette.colors.filter((color) => {
          const { l } = hexToHSL(color);
          return l > 50;
        }).length >= Math.ceil(palette.colors.length / 2);

      case "colorful":
        return palette.colors.every((color) => {
          const { s } = hexToHSL(color);
          return s > 30;
        }) && hasVariedHues(palette.colors);

      case "monochrome":
        return hasSimilarHues(palette.colors);

      case "warm":
        return palette.colors.filter((color) => {
          const { h } = hexToHSL(color);
          return (h >= 0 && h <= 60) || h >= 300;
        }).length >= Math.ceil(palette.colors.length / 2);

      case "cool":
        return palette.colors.filter((color) => {
          const { h } = hexToHSL(color);
          return h > 60 && h < 300;
        }).length >= Math.ceil(palette.colors.length / 2);

      default:
        return true;
    }
  });
};

export const filterByColor = (palettes, selectedColor) => {
  if (!selectedColor || selectedColor === "all") return palettes;
  
  return palettes.filter((palette) =>
    palette.colors.some((color) => isColorInRange(color, selectedColor))
  );
};

export const sortPalettes = (palettes, sortBy) => {
  if (!sortBy || sortBy === "default") return palettes;

  return [...palettes].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.name || "").localeCompare(b.name || "");

      case "brightness":
        const avgBrightnessA =
          a.colors.reduce((sum, color) => sum + hexToHSL(color).l, 0) /
          a.colors.length;
        const avgBrightnessB =
          b.colors.reduce((sum, color) => sum + hexToHSL(color).l, 0) /
          b.colors.length;
        return avgBrightnessB - avgBrightnessA;

      case "saturation":
        const avgSaturationA =
          a.colors.reduce((sum, color) => sum + hexToHSL(color).s, 0) /
          a.colors.length;
        const avgSaturationB =
          b.colors.reduce((sum, color) => sum + hexToHSL(color).s, 0) /
          b.colors.length;
        return avgSaturationB - avgSaturationA;

      default:
        return 0;
    }
  });
}; 