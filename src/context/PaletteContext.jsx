import { createContext, useState, useContext, useEffect } from 'react';
import { hexToHSL } from '../utils/colorUtils';
import { filterByCategory, filterByColor, sortPalettes } from '../utils/filterUtils';

const PaletteContext = createContext();

export function PaletteProvider({ children }) {
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedPaletteName, setSavedPaletteName] = useState("");

  // Load saved palettes from localStorage on initial render
  useEffect(() => {
    const storedPalettes = localStorage.getItem("savedPalettes");
    if (storedPalettes) {
      setSavedPalettes(JSON.parse(storedPalettes));
    }
  }, []);

  // Save palettes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  const handleSavePalette = (palette) => {
    // Check if palette already exists
    if (!isPaletteSaved(palette)) {
      setSavedPalettes([...savedPalettes, palette]);
    }
    setSavedPaletteName(palette.name || "Palette");
    setShowSaveModal(true);
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
  };

  const handleUpdatePalettes = (updatedPalettes) => {
    setSavedPalettes(updatedPalettes);
  };

  const isPaletteSaved = (palette) => {
    return savedPalettes.some(
      (savedPalette) =>
        JSON.stringify(savedPalette.colors) === JSON.stringify(palette.colors)
    );
  };

  const handleRemovePalette = (palette) => {
    setSavedPalettes(savedPalettes.filter(p => 
      // Compare by name and colors to identify the palette
      !(p.name === palette.name && 
        JSON.stringify(p.colors) === JSON.stringify(palette.colors))
    ));
  };

  const filteredPalettes = (palettes, searchTerm, selectedColor, selectedCategory, sortBy) => {
    let filtered = [...palettes];

    // Apply color filter
    filtered = filterByColor(filtered, selectedColor);

    // Apply category filter
    filtered = filterByCategory(filtered, selectedCategory);

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (palette) =>
          (palette.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          palette.colors.some((color) =>
            color.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply sort
    filtered = sortPalettes(filtered, sortBy);

    return filtered;
  };

  const value = {
    savedPalettes,
    setSavedPalettes,
    showSaveModal,
    setShowSaveModal,
    savedPaletteName,
    setSavedPaletteName,
    handleSavePalette,
    isPaletteSaved,
    handleUpdatePalettes,
    filteredPalettes,
    handleRemovePalette,
    handleCloseSaveModal,
  };

  return (
    <PaletteContext.Provider value={value}>
      {children}
    </PaletteContext.Provider>
  );
}

export const usePalette = () => useContext(PaletteContext); 