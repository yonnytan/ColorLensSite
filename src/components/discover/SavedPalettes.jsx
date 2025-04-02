import { usePalette } from "../../context/PaletteContext";
import { PaletteCard } from "./PaletteCard";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function SavedPalettes({
  showSavedPalettes,
  handleSavedPalettesToggle,
}) {
  const { discoverPalettes } = usePalette();

  if (!showSavedPalettes) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 md:w-96 bg-gray-900 shadow-xl z-50 overflow-y-auto transition-transform duration-300 transform translate-x-0">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Saved Palettes</h2>
          <button
            onClick={handleSavedPalettesToggle}
            className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          {discoverPalettes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {discoverPalettes.map((palette, index) => (
                <PaletteCard
                  key={`saved-${palette.name}-${index}`}
                  palette={palette}
                  index={index}
                  isSaved={true}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center px-4 py-8">
              <p className="text-sm text-gray-500">
                No saved palettes yet. Click the heart icon on any palette to
                save it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
