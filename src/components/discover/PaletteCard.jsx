import { usePalette } from "../../context/PaletteContext";
import {
  HeartIcon,
  ClipboardIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { getContrastColor } from "../../utils/colorUtils";
import { useState, useEffect } from "react";
import { ConfirmationModal } from "../common/ConfirmationModal";

export function PaletteCard({ palette, index, isSaved = false }) {
  const { handleSavePalette, isPaletteSaved, handleRemovePalette } =
    usePalette();
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [colorScales, setColorScales] = useState({});
  const [hoveredColor, setHoveredColor] = useState(null);
  const [colorWidths, setColorWidths] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showUnsaveConfirmation, setShowUnsaveConfirmation] = useState(false);

  // Initialize color widths based on palette size
  useEffect(() => {
    const initialWidths = {};
    const baseWidth = 100 / palette.colors.length;

    palette.colors.forEach((color, i) => {
      initialWidths[`${color}-${i}`] = baseWidth;
    });

    setColorWidths(initialWidths);
  }, [palette.colors]);

  // Handle color hover
  const handleColorHover = (color, index) => {
    setHoveredColor(`${color}-${index}`);

    const baseWidth = 100 / palette.colors.length;
    const expandedWidth = baseWidth * 2.5;
    const remainingWidth = (100 - expandedWidth) / (palette.colors.length - 1);

    const newWidths = {};
    palette.colors.forEach((c, i) => {
      const key = `${c}-${i}`;
      newWidths[key] =
        `${color}-${index}` === key ? expandedWidth : remainingWidth;
    });

    setColorWidths(newWidths);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredColor(null);

    const baseWidth = 100 / palette.colors.length;
    const initialWidths = {};

    palette.colors.forEach((color, i) => {
      initialWidths[`${color}-${i}`] = baseWidth;
    });

    setColorWidths(initialWidths);
  };

  const copyPaletteColors = (colors) => {
    const colorString = colors.join(", ");
    navigator.clipboard.writeText(colorString);
    setCopiedText("palette colors");
    setShowCopiedNotification(true);
    setTimeout(() => setShowCopiedNotification(false), 2000);
  };

  const exportPalette = (palette) => {
    const data = {
      name: palette.name,
      colors: palette.colors,
      css: palette.colors
        .map((color, i) => `--color-${i + 1}: ${color};`)
        .join("\n"),
      scss: palette.colors
        .map((color, i) => `$color-${i + 1}: ${color};`)
        .join("\n"),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${palette.name || "palette"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Add this function to handle the delete button click
  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  return (
    <div className="clay-card p-4 rounded-xl space-y-6">
      {/* Palette Name */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {palette.name || `Palette ${index + 1}`}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => copyPaletteColors(palette.colors)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Copy Colors"
          >
            <ClipboardIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => exportPalette(palette)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Export Palette"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              if (isPaletteSaved(palette)) {
                setShowUnsaveConfirmation(true);
              } else {
                handleSavePalette(palette);
              }
            }}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title={
              isPaletteSaved(palette) ? "Remove from Saved" : "Save Palette"
            }
          >
            {isPaletteSaved(palette) ? (
              <HeartIconSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Color Blocks */}
      <div className="flex h-16 rounded-lg overflow-hidden shadow-inner">
        {palette.colors.map((color, i) => {
          const colorKey = `${color}-${i}`;
          const isHovered = hoveredColor === colorKey;

          return (
            <div
              key={colorKey}
              className="color-block relative flex items-center justify-center group transition-all duration-300"
              style={{
                backgroundColor: color,
                width: `${colorWidths[colorKey]}%`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: isHovered ? 10 : 1,
              }}
              onMouseEnter={() => handleColorHover(color, i)}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                navigator.clipboard.writeText(color);
                setCopiedText(color);
                setShowCopiedNotification(true);
                setTimeout(() => setShowCopiedNotification(false), 2000);
              }}
            >
              <div
                className="color-text opacity-0 group-hover:opacity-100 transition-all duration-300 px-2 py-1 text-center font-medium"
                style={{
                  color: getContrastColor(color),
                  position: "relative",
                  whiteSpace: "nowrap",
                  backgroundColor: `${color}CC`,
                  borderRadius: "4px",
                  padding: "2px 6px",
                  minWidth: "fit-content",
                  fontSize: "11px",
                }}
              >
                {color}
              </div>
            </div>
          );
        })}
      </div>

      {/* Copied Notification */}
      {showCopiedNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Copied {copiedText}!
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={() => handleRemovePalette(palette)}
        title="Remove Palette"
        message={`Are you sure you want to remove "${
          palette.name || `Palette ${index + 1}`
        }" from your saved palettes?`}
        confirmText="Remove"
        cancelText="Cancel"
      />

      <ConfirmationModal
        isOpen={showUnsaveConfirmation}
        onClose={() => setShowUnsaveConfirmation(false)}
        onConfirm={() => {
          handleRemovePalette(palette);
          setCopiedText("Palette removed");
          setShowCopiedNotification(true);
          setTimeout(() => setShowCopiedNotification(false), 2000);
        }}
        title="Remove Palette"
        message="Are you sure you want to remove this palette from your saved collection?"
        confirmText="Remove"
        cancelText="Cancel"
      />
    </div>
  );
}
