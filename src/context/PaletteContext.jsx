import { createContext, useState, useContext, useEffect } from 'react';
import { hexToHSL } from '../utils/colorUtils';
import { filterByCategory, filterByColor, sortPalettes } from '../utils/filterUtils';

const PaletteContext = createContext();

export function PaletteProvider({ children }) {
  // Separate state for generator palettes and discover palettes
  const [generatorPalettes, setGeneratorPalettes] = useState([]);
  const [discoverPalettes, setDiscoverPalettes] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedPaletteName, setSavedPaletteName] = useState("");

  // Load saved palettes from localStorage on initial render
  useEffect(() => {
    const storedGeneratorPalettes = localStorage.getItem("generatorPalettes");
    if (storedGeneratorPalettes) {
      setGeneratorPalettes(JSON.parse(storedGeneratorPalettes));
    }
    
    const storedDiscoverPalettes = localStorage.getItem("discoverPalettes");
    if (storedDiscoverPalettes) {
      setDiscoverPalettes(JSON.parse(storedDiscoverPalettes));
    }
  }, []);

  // Save palettes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("generatorPalettes", JSON.stringify(generatorPalettes));
  }, [generatorPalettes]);
  
  useEffect(() => {
    localStorage.setItem("discoverPalettes", JSON.stringify(discoverPalettes));
  }, [discoverPalettes]);

  // For backward compatibility - keep the old savedPalettes getter
  const savedPalettes = generatorPalettes;

  const handleSaveGeneratorPalette = (palette) => {
    // Check if palette already exists
    if (!isGeneratorPaletteSaved(palette)) {
      setGeneratorPalettes([...generatorPalettes, palette]);
    }
    setSavedPaletteName(palette.name || "Palette");
    setShowSaveModal(true);
  };
  
  const handleSaveDiscoverPalette = (palette) => {
    // Check if palette already exists
    if (!isDiscoverPaletteSaved(palette)) {
      setDiscoverPalettes([...discoverPalettes, palette]);
    }
    setSavedPaletteName(palette.name || "Palette");
    setShowSaveModal(true);
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
  };

  const handleUpdateGeneratorPalettes = (updatedPalettes) => {
    setGeneratorPalettes(updatedPalettes);
  };
  
  const handleUpdateDiscoverPalettes = (updatedPalettes) => {
    setDiscoverPalettes(updatedPalettes);
  };

  const isGeneratorPaletteSaved = (palette) => {
    return generatorPalettes.some(
      (savedPalette) =>
        JSON.stringify(savedPalette.colors) === JSON.stringify(palette.colors)
    );
  };
  
  const isDiscoverPaletteSaved = (palette) => {
    return discoverPalettes.some(
      (savedPalette) =>
        JSON.stringify(savedPalette.colors) === JSON.stringify(palette.colors)
    );
  };

  const handleRemoveGeneratorPalette = (palette) => {
    setGeneratorPalettes(generatorPalettes.filter(p => 
      // Compare by name and colors to identify the palette
      !(p.name === palette.name && 
        JSON.stringify(p.colors) === JSON.stringify(palette.colors))
    ));
  };
  
  const handleRemoveDiscoverPalette = (palette) => {
    setDiscoverPalettes(discoverPalettes.filter(p => 
      // Compare by name and colors to identify the palette
      !(p.name === palette.name && 
        JSON.stringify(p.colors) === JSON.stringify(palette.colors))
    ));
  };

  // Add this function to filter palettes by color count
  const filterByColorCount = (palettes, colorCount) => {
    if (colorCount === 'all') {
      return palettes;
    }
    
    const count = parseInt(colorCount, 10);
    return palettes.filter(palette => palette.colors.length === count);
  };

  // Update the filteredPalettes function to include color count filtering
  const filteredPalettes = (palettes, searchTerm, selectedColor, selectedCategory, sortBy, colorCount) => {
    let filtered = [...palettes];
    
    // Apply color filter
    filtered = filterByColor(filtered, selectedColor);
    
    // Apply category filter
    filtered = filterByCategory(filtered, selectedCategory);
    
    // Apply color count filter
    filtered = filterByColorCount(filtered, colorCount);
    
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
    // For backward compatibility
    savedPalettes,
    setSavedPalettes: setGeneratorPalettes,
    
    // New separate palette lists
    generatorPalettes,
    setGeneratorPalettes,
    discoverPalettes,
    setDiscoverPalettes,
    
    // Modal state
    showSaveModal,
    setShowSaveModal,
    savedPaletteName,
    setSavedPaletteName,
    
    // Handler functions
    handleSavePalette: handleSaveGeneratorPalette, // For backward compatibility
    handleSaveGeneratorPalette,
    handleSaveDiscoverPalette,
    isPaletteSaved: isGeneratorPaletteSaved, // For backward compatibility
    isGeneratorPaletteSaved,
    isDiscoverPaletteSaved,
    handleUpdatePalettes: handleUpdateGeneratorPalettes, // For backward compatibility
    handleUpdateGeneratorPalettes,
    handleUpdateDiscoverPalettes,
    handleRemovePalette: handleRemoveGeneratorPalette, // For backward compatibility
    handleRemoveGeneratorPalette,
    handleRemoveDiscoverPalette,
    filteredPalettes,
    handleCloseSaveModal,
  };

  return (
    <PaletteContext.Provider value={value}>
      {children}
    </PaletteContext.Provider>
  );
}

export const usePalette = () => useContext(PaletteContext); 