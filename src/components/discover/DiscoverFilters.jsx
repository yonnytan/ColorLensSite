import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { usePalette } from "../../context/PaletteContext";
import { useState, useEffect } from "react";

export function DiscoverFilters({ 
  searchTerm, 
  setSearchTerm,
  selectedColor,
  setSelectedColor,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  handleSavedPalettesToggle
}) {
  const { savedPalettes } = usePalette();
  const hasSavedPalettes = savedPalettes.length > 0;
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  return (
    <div className="mb-6 space-y-4">
      {/* Search and Filters Toggle for Mobile */}
      <div className="flex gap-2 w-full">
        {/* Search Input - Always visible */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search palettes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="clay-card w-full px-4 py-2 rounded-lg bg-transparent"
          />
        </div>
        
        {/* Filters Toggle Button - Only on Mobile */}
        {isMobile && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="clay-card flex items-center gap-1 px-4 py-2 rounded-lg bg-transparent"
          >
            <span>Filters</span>
            <ChevronDownIcon 
              className={`w-5 h-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} 
            />
          </button>
        )}
        
        {/* Saved Palettes Button - Always visible */}
        <button
          onClick={handleSavedPalettesToggle}
          className="clay-card flex items-center gap-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors whitespace-nowrap"
        >
          {hasSavedPalettes ? (
            <HeartIconSolid className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5" />
          )}
          <span className="hidden sm:inline">Saved Palettes</span>
        </button>
      </div>
      
      {/* Filters - Always visible on desktop, toggleable on mobile */}
      {(!isMobile || showFilters) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 transition-all duration-300 ease-in-out">
          {/* Color Filter */}
          <div className="relative">
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="clay-card w-full px-4 py-2 pr-8 rounded-lg bg-transparent appearance-none cursor-pointer"
            >
              <option value="all">All Colors</option>
              <option value="#FF0000">Red</option>
              <option value="#00FF00">Green</option>
              <option value="#0000FF">Blue</option>
              <option value="#FFFF00">Yellow</option>
              <option value="#FF00FF">Purple</option>
              <option value="#00FFFF">Cyan</option>
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5" />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="clay-card w-full px-4 py-2 pr-8 rounded-lg bg-transparent appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="colorful">Colorful</option>
              <option value="monochrome">Monochrome</option>
              <option value="warm">Warm</option>
              <option value="cool">Cool</option>
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5" />
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="clay-card w-full px-4 py-2 pr-8 rounded-lg bg-transparent appearance-none cursor-pointer"
            >
              <option value="default">Sort By</option>
              <option value="name">Name</option>
              <option value="brightness">Brightness</option>
              <option value="saturation">Saturation</option>
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5" />
          </div>
        </div>
      )}
    </div>
  );
} 