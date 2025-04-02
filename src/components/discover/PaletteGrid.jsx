import { PaletteCard } from "./PaletteCard";
import { usePalette } from "../../context/PaletteContext";

export function PaletteGrid({
  palettes,
  searchTerm,
  selectedColor,
  selectedCategory,
  sortBy,
}) {
  const { filteredPalettes } = usePalette();

  // Get filtered palettes based on current filters
  const displayPalettes = filteredPalettes(
    palettes,
    searchTerm,
    selectedColor,
    selectedCategory,
    sortBy
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayPalettes.map((palette, index) => (
        <PaletteCard
          key={`${palette.name}-${index}`}
          palette={palette}
          index={index}
        />
      ))}
      {displayPalettes.length === 0 && (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">
            No palettes found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
