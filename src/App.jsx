import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import html2canvas from "html2canvas";
import {
  ArrowUpTrayIcon,
  DocumentArrowDownIcon,
  PhotoIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  SwatchIcon,
  ChevronDownIcon,
  SparklesIcon,
  HeartIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
  ClipboardIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import coolors_palettes from "./data/coolors_palettes.json";
import { PaletteProvider } from "./context/PaletteContext";
import { DiscoverFilters } from "./components/discover/DiscoverFilters";
import { PaletteGrid } from "./components/discover/PaletteGrid";
import { SavedPalettes } from "./components/discover/SavedPalettes";
import { SaveModal } from "./components/common/SaveModal";
import { TabSelector } from "./components/common/TabSelector";
import { ColorPicker } from "./components/picker/ColorPicker";
import { ImageGenerator } from "./components/picker/ImageGenerator";
import { UIPlayground } from "./components/playground/UIPlayground";
import { Header } from "./components/common/Header";

// Utility function to determine text color based on background
const getContrastColor = (hexcolor) => {
  // Remove the # if present
  const hex = hexcolor.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white depending on background luminance
  return luminance > 0.5 ? "#000000" : "#ffffff";
};

// Add these helper functions for color analysis
const hexToHSL = (hex) => {
  hex = hex.replace("#", "");
  let r = parseInt(hex.substr(0, 2), 16) / 255;
  let g = parseInt(hex.substr(2, 2), 16) / 255;
  let b = parseInt(hex.substr(4, 2), 16) / 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
  };
};

// Add this function before the App component
function ensureUniquePaletteNames(palettes) {
  const nameCount = {};

  // First pass: count occurrences of each name
  palettes.forEach((palette) => {
    const name = palette.name || "Unnamed Palette";
    nameCount[name] = (nameCount[name] || 0) + 1;
  });

  // Second pass: rename duplicates
  return palettes.map((palette) => {
    const originalName = palette.name || "Unnamed Palette";

    // If this is a duplicate name (count > 1), we need to make it unique
    if (nameCount[originalName] > 1) {
      // Decrease the count for this name
      nameCount[originalName]--;

      // Add a suffix to make the name unique
      const suffix =
        nameCount[originalName] > 0 ? ` (${nameCount[originalName]})` : "";
      return {
        ...palette,
        name: `${originalName}${suffix}`,
      };
    }

    return palette;
  });
}

function App() {
  const [image, setImage] = useState(null);
  const [dots, setDots] = useState([]);
  const [colorCount, setColorCount] = useState("all");
  const [hoveredDot, setHoveredDot] = useState(null);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [draggedDot, setDraggedDot] = useState(null);
  const [selectedColor, setSelectedColor] = useState("all");
  const [savedColors, setSavedColors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [selectedGradientColors, setSelectedGradientColors] = useState([]);
  const [gradientStops, setGradientStops] = useState({});
  const [isDraggingStop, setIsDraggingStop] = useState(false);
  const [activeDragStop, setActiveDragStop] = useState(null);
  const [fadeLength, setFadeLength] = useState(100);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const notificationTimeout = useRef(null);
  const containerRef = useRef(null);
  const downloadMenuRef = useRef(null);
  const gradientRef = useRef(null);
  const [activeTab, setActiveTab] = useState("discover"); // Default tab is now 'discover' instead of 'picker'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [showSavedPalettes, setShowSavedPalettes] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedPaletteName, setSavedPaletteName] = useState("");
  const [colorPickerValue, setColorPickerValue] = useState("#000000");
  const [uniquePalettes, setUniquePalettes] = useState([]);

  const getPixelColor = useCallback((x, y, containerRect, imgRect) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas not available for color sampling");
      return null;
    }

    try {
      const ctx = canvas.getContext("2d");
      // Ensure coordinates are within canvas bounds
      const canvasX = Math.max(0, Math.min(Math.floor(x), canvas.width - 1));
      const canvasY = Math.max(0, Math.min(Math.floor(y), canvas.height - 1));

      const pixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
      const rgb = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
      const hex = `#${pixel[0].toString(16).padStart(2, "0")}${pixel[1]
        .toString(16)
        .padStart(2, "0")}${pixel[2].toString(16).padStart(2, "0")}`;
      return { rgb, hex };
    } catch (error) {
      console.error("Error sampling color:", error);
      return null;
    }
  }, []);

  const generateRandomDots = useCallback(() => {
    if (!imageRef.current || !canvasRef.current || !containerRef.current) {
      console.log("Missing required refs for generating dots");
      return;
    }

    const img = imageRef.current;
    const canvas = canvasRef.current;
    const imgRect = img.getBoundingClientRect();

    // Wait for valid dimensions
    if (imgRect.width === 0 || imgRect.height === 0) {
      console.log("Invalid image dimensions, retrying in 100ms");
      setTimeout(() => generateRandomDots(), 100);
      return;
    }

    const scaleX = canvas.width / imgRect.width;
    const scaleY = canvas.height / imgRect.height;

    // Divide the image into sections based on colorCount
    const sections = {
      rows: Math.ceil(Math.sqrt(colorCount)),
      cols: Math.ceil(Math.sqrt(colorCount)),
    };

    // Calculate section dimensions
    const sectionWidth = imgRect.width / sections.cols;
    const sectionHeight = imgRect.height / sections.rows;

    const newDots = [];
    let attempts = 0;
    const maxAttempts = 500; // Increased max attempts

    // Try to place one dot in each section first
    for (
      let row = 0;
      row < sections.rows && newDots.length < colorCount;
      row++
    ) {
      for (
        let col = 0;
        col < sections.cols && newDots.length < colorCount;
        col++
      ) {
        let dotPlaced = false;
        let sectionAttempts = 0;

        while (!dotPlaced && sectionAttempts < 20) {
          // Generate position within this section
          const displayX =
            col * sectionWidth +
            (Math.random() * sectionWidth * 0.8 + sectionWidth * 0.1);
          const displayY =
            row * sectionHeight +
            (Math.random() * sectionHeight * 0.8 + sectionHeight * 0.1);

          // Check minimum distance from all existing dots
          const minDistance = Math.min(sectionWidth, sectionHeight) * 0.3; // Dynamic minimum distance
          const isTooClose = newDots.some((existingDot) => {
            const dx = existingDot.x - displayX;
            const dy = existingDot.y - displayY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < minDistance;
          });

          if (!isTooClose) {
            // Convert display coordinates to canvas coordinates for color sampling
            const canvasX = displayX * scaleX;
            const canvasY = displayY * scaleY;

            const color = getPixelColor(canvasX, canvasY);
            if (color && color.hex !== "#000000") {
              // Check for color similarity
              const isDuplicate = newDots.some((existingDot) => {
                const hexA = existingDot.hex.substring(1);
                const hexB = color.hex.substring(1);
                const rgbA = {
                  r: parseInt(hexA.substring(0, 2), 16),
                  g: parseInt(hexA.substring(2, 4), 16),
                  b: parseInt(hexA.substring(4, 6), 16),
                };
                const rgbB = {
                  r: parseInt(hexB.substring(0, 2), 16),
                  g: parseInt(hexB.substring(2, 4), 16),
                  b: parseInt(hexB.substring(4, 6), 16),
                };
                const diff = Math.sqrt(
                  Math.pow(rgbA.r - rgbB.r, 2) +
                    Math.pow(rgbA.g - rgbB.g, 2) +
                    Math.pow(rgbA.b - rgbB.b, 2)
                );
                return diff < 30;
              });

              if (!isDuplicate) {
                newDots.push({
                  x: displayX,
                  y: displayY,
                  ...color,
                });
                dotPlaced = true;
              }
            }
          }
          sectionAttempts++;
        }
      }
    }

    // If we still need more dots, fill remaining spaces
    while (newDots.length < colorCount && attempts < maxAttempts) {
      const section = {
        col: Math.floor(Math.random() * sections.cols),
        row: Math.floor(Math.random() * sections.rows),
      };

      const displayX =
        section.col * sectionWidth +
        (Math.random() * sectionWidth * 0.8 + sectionWidth * 0.1);
      const displayY =
        section.row * sectionHeight +
        (Math.random() * sectionHeight * 0.8 + sectionHeight * 0.1);

      const minDistance = Math.min(sectionWidth, sectionHeight) * 0.3;
      const isTooClose = newDots.some((existingDot) => {
        const dx = existingDot.x - displayX;
        const dy = existingDot.y - displayY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < minDistance;
      });

      if (!isTooClose) {
        const canvasX = displayX * scaleX;
        const canvasY = displayY * scaleY;

        const color = getPixelColor(canvasX, canvasY);
        if (color && color.hex !== "#000000") {
          const isDuplicate = newDots.some((existingDot) => {
            const hexA = existingDot.hex.substring(1);
            const hexB = color.hex.substring(1);
            const rgbA = {
              r: parseInt(hexA.substring(0, 2), 16),
              g: parseInt(hexA.substring(2, 4), 16),
              b: parseInt(hexA.substring(4, 6), 16),
            };
            const rgbB = {
              r: parseInt(hexB.substring(0, 2), 16),
              g: parseInt(hexB.substring(2, 4), 16),
              b: parseInt(hexB.substring(4, 6), 16),
            };
            const diff = Math.sqrt(
              Math.pow(rgbA.r - rgbB.r, 2) +
                Math.pow(rgbA.g - rgbB.g, 2) +
                Math.pow(rgbA.b - rgbB.b, 2)
            );
            return diff < 30;
          });

          if (!isDuplicate) {
            newDots.push({
              x: displayX,
              y: displayY,
              ...color,
            });
          }
        }
      }
      attempts++;
    }

    setDots(newDots);
    console.log("Generated", newDots.length, "new dots");
  }, [colorCount, getPixelColor]);

  const handleImageLoad = useCallback(() => {
    console.log("handleImageLoad called");

    if (!imageRef.current || !canvasRef.current || !containerRef.current) {
      console.error("Missing required refs");
      setIsLoading(false);
      return;
    }

    const canvas = canvasRef.current;
    const img = imageRef.current;

    // Ensure image is fully loaded
    if (!img.complete || !img.naturalWidth || !img.naturalHeight) {
      console.log("Image not fully loaded yet");
      return;
    }

    // Set canvas size to match natural image size first
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw the image to canvas immediately
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    console.log("Image drawn to canvas");

    // Wait for the next frame to ensure the DOM has updated
    requestAnimationFrame(() => {
      const imgRect = img.getBoundingClientRect();
      console.log("Current image dimensions:", {
        width: imgRect.width,
        height: imgRect.height,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });

      if (imgRect.width === 0 || imgRect.height === 0) {
        console.log("Waiting for image dimensions to be available...");
        setTimeout(() => handleImageLoad(), 100);
        return;
      }

      generateRandomDots();
      setIsLoading(false);
    });
  }, [generateRandomDots]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(URL.createObjectURL(file));
  }, []);

  const handleMouseDown = useCallback((e, index) => {
    e.preventDefault(); // Prevent text selection while dragging
    e.stopPropagation(); // Prevent event bubbling
    setIsDragging(true);
    setDraggedDot(index);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (
        !isDragging ||
        draggedDot === null ||
        !imageRef.current ||
        !containerRef.current ||
        !canvasRef.current
      )
        return;

      e.preventDefault(); // Prevent scrolling on mobile
      const imgRect = imageRef.current.getBoundingClientRect();
      const clientX = e.type.includes("touch")
        ? e.touches[0].clientX
        : e.clientX;
      const clientY = e.type.includes("touch")
        ? e.touches[0].clientY
        : e.clientY;

      // Calculate position relative to the image container
      const x = clientX - imgRect.left;
      const y = clientY - imgRect.top;

      // Calculate the scale factor between natural image size and displayed size
      const scaleX = canvasRef.current.width / imgRect.width;
      const scaleY = canvasRef.current.height / imgRect.height;

      // Ensure the dot stays within the image boundaries
      const boundedX = Math.max(0, Math.min(x, imgRect.width));
      const boundedY = Math.max(0, Math.min(y, imgRect.height));

      // Calculate the position in the original image coordinates
      const originalX = boundedX * scaleX;
      const originalY = boundedY * scaleY;

      const color = getPixelColor(originalX, originalY);
      if (color) {
        setDots((prevDots) => {
          if (!prevDots || draggedDot >= prevDots.length) return prevDots;
          const newDots = [...prevDots];
          newDots[draggedDot] = {
            x: boundedX,
            y: boundedY,
            ...color,
          };
          return newDots;
        });
      }
    },
    [isDragging, draggedDot, getPixelColor]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedDot(null);
  }, []);

  const handleTouchStart = useCallback((e, index) => {
    e.preventDefault(); // Prevent scrolling while dragging
    e.stopPropagation(); // Prevent event bubbling
    setIsDragging(true);
    setDraggedDot(index);
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (
        !isDragging ||
        draggedDot === null ||
        !imageRef.current ||
        !containerRef.current ||
        !canvasRef.current
      )
        return;

      e.preventDefault(); // This will work now with touchAction: "none"
      const touch = e.touches[0];
      const imgRect = imageRef.current.getBoundingClientRect();

      // Calculate position relative to the image container
      const x = touch.clientX - imgRect.left;
      const y = touch.clientY - imgRect.top;

      // Calculate the scale factor between natural image size and displayed size
      const scaleX = canvasRef.current.width / imgRect.width;
      const scaleY = canvasRef.current.height / imgRect.height;

      // Ensure the dot stays within the image boundaries
      const boundedX = Math.max(0, Math.min(x, imgRect.width));
      const boundedY = Math.max(0, Math.min(y, imgRect.height));

      // Calculate the position in the original image coordinates
      const originalX = boundedX * scaleX;
      const originalY = boundedY * scaleY;

      const color = getPixelColor(originalX, originalY);
      if (color) {
        setDots((prevDots) => {
          if (!prevDots || draggedDot >= prevDots.length) return prevDots;
          const newDots = [...prevDots];
          newDots[draggedDot] = {
            x: boundedX,
            y: boundedY,
            ...color,
          };
          return newDots;
        });
      }
    },
    [isDragging, draggedDot, getPixelColor]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedDot(null);
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [handleMouseUp, handleTouchEnd]);

  // Modify the image loading effect to handle the initial load
  useEffect(() => {
    if (image && imageRef.current) {
      const img = imageRef.current;
      if (img.complete) {
        console.log("Image already loaded in effect");
        handleImageLoad();
      } else {
        console.log("Setting up image load handler");
        const handleLoad = () => {
          console.log("Image load event fired");
          handleImageLoad();
        };
        img.addEventListener("load", handleLoad);
        return () => img.removeEventListener("load", handleLoad);
      }
    }
  }, [image, handleImageLoad]);

  // Remove the resize observer effect and replace with a simpler one
  useEffect(() => {
    if (image && containerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        console.log("Container resized");
        if (imageRef.current && imageRef.current.complete) {
          // Add a small delay to allow the browser to finish layout
          setTimeout(() => {
            handleImageLoad();
          }, 100);
        }
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [image, handleImageLoad]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setShowCopiedNotification(true);

    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }

    notificationTimeout.current = setTimeout(() => {
      setShowCopiedNotification(false);
    }, 2000);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    multiple: false,
  });

  const downloadJSON = () => {
    const dataStr = JSON.stringify(dots, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.download = "ColorLens.json";
    link.href = url;
    link.click();
  };

  const downloadJPG = async () => {
    const paletteElement = document.getElementById("downloadable-palette");
    if (paletteElement) {
      try {
        const canvas = await html2canvas(paletteElement, {
          backgroundColor: "#1a1b1e",
          scale: 2,
          logging: false,
          width: 800,
          height: dots.length * 100 + 100,
        });
        const url = canvas.toDataURL("image/jpeg", 1.0);
        const link = document.createElement("a");
        link.download = "ColorLens.jpg";
        link.href = url;
        link.click();
      } catch (error) {
        console.error("Error generating JPG:", error);
      }
    }
  };

  const downloadPNG = async () => {
    const paletteElement = document.getElementById("downloadable-palette");
    if (paletteElement) {
      try {
        const canvas = await html2canvas(paletteElement, {
          backgroundColor: "#1a1b1e",
          scale: 2,
          logging: false,
          width: 800,
          height: dots.length * 100 + 100,
        });
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "ColorLens.png";
        link.href = url;
        link.click();
      } catch (error) {
        console.error("Error generating PNG:", error);
      }
    }
  };

  // Add effect to handle clicking outside download menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        downloadMenuRef.current &&
        !downloadMenuRef.current.contains(event.target)
      ) {
        setShowDownloadMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGradientStopDragStart = (e, stopIndex) => {
    e.preventDefault();
    if (e.type === "touchstart") {
      setIsDraggingStop(true);
      setActiveDragStop(stopIndex);
    } else if (e.type === "mousedown") {
      setIsDraggingStop(true);
      setActiveDragStop(stopIndex);
    }
  };

  const handleGradientStopDrag = useCallback(
    (e) => {
      if (!isDraggingStop || activeDragStop === null || !gradientRef.current)
        return;

      const rect = gradientRef.current.getBoundingClientRect();
      const clientX = e.type.includes("touch")
        ? e.touches[0].clientX
        : e.clientX;
      const x = clientX - rect.left;
      const width = rect.width;
      let percentage = Math.max(0, Math.min(100, (x / width) * 100));

      // Get the minimum and maximum allowed positions based on adjacent stops
      const minStop =
        activeDragStop === 0
          ? 5
          : (gradientStops[activeDragStop - 1] ||
              (activeDragStop * 100) / (selectedGradientColors.length - 1)) + 5;
      const maxStop =
        activeDragStop === selectedGradientColors.length - 2
          ? 95
          : (gradientStops[activeDragStop + 1] ||
              ((activeDragStop + 2) * 100) /
                (selectedGradientColors.length - 1)) - 5;

      // Constrain the percentage within the allowed range
      percentage = Math.max(minStop, Math.min(maxStop, percentage));

      setGradientStops((prev) => ({
        ...prev,
        [activeDragStop]: percentage,
      }));
    },
    [
      isDraggingStop,
      activeDragStop,
      selectedGradientColors.length,
      gradientStops,
    ]
  );

  const handleGradientStopDragEnd = useCallback(() => {
    setIsDraggingStop(false);
    setActiveDragStop(null);
  }, []);

  // Add effect to handle document-level mouse and touch events for dragging
  useEffect(() => {
    if (isDraggingStop) {
      document.addEventListener("mousemove", handleGradientStopDrag);
      document.addEventListener("mouseup", handleGradientStopDragEnd);
      document.addEventListener("touchmove", handleGradientStopDrag);
      document.addEventListener("touchend", handleGradientStopDragEnd);
      document.addEventListener("touchcancel", handleGradientStopDragEnd);
      return () => {
        document.removeEventListener("mousemove", handleGradientStopDrag);
        document.removeEventListener("mouseup", handleGradientStopDragEnd);
        document.removeEventListener("touchmove", handleGradientStopDrag);
        document.removeEventListener("touchend", handleGradientStopDragEnd);
        document.removeEventListener("touchcancel", handleGradientStopDragEnd);
      };
    }
  }, [isDraggingStop, handleGradientStopDrag, handleGradientStopDragEnd]);

  // Add effect to reset gradient stops when colors change
  useEffect(() => {
    setGradientStops({});
  }, [selectedGradientColors]);

  const isColorInRange = (hex, colorName) => {
    const { h, s, l } = hexToHSL(hex);

    // Define color ranges in HSL
    const colorRanges = {
      red: { hMin: 345, hMax: 15, sMin: 20, lMin: 20, lMax: 70 },
      orange: { hMin: 15, hMax: 45, sMin: 20, lMin: 20, lMax: 70 },
      yellow: { hMin: 45, hMax: 70, sMin: 20, lMin: 20, lMax: 70 },
      green: { hMin: 70, hMax: 170, sMin: 20, lMin: 20, lMax: 70 },
      blue: { hMin: 170, hMax: 260, sMin: 20, lMin: 20, lMax: 70 },
      purple: { hMin: 260, hMax: 345, sMin: 20, lMin: 20, lMax: 70 },
      brown: { hMin: 0, hMax: 40, sMin: 10, sMax: 100, lMin: 10, lMax: 55 },
      pink: { hMin: 320, hMax: 345, sMin: 20, lMin: 65, lMax: 90 },
      gray: { sMax: 20, lMin: 20, lMax: 80 },
      black: { lMax: 20 },
      white: { lMin: 80 },
    };

    const range = colorRanges[colorName];
    if (!range) return false;

    // Special case for grays, blacks, and whites
    if (colorName === "gray") {
      return s <= range.sMax && l >= range.lMin && l <= range.lMax;
    }
    if (colorName === "black") {
      return l <= range.lMax;
    }
    if (colorName === "white") {
      return l >= range.lMin;
    }

    // Handle hue wrapping for reds
    if (range.hMin > range.hMax) {
      return (
        (h >= range.hMin || h <= range.hMax) &&
        s >= range.sMin &&
        l >= range.lMin &&
        l <= range.lMax
      );
    }

    return (
      h >= range.hMin &&
      h <= range.hMax &&
      s >= range.sMin &&
      l >= range.lMin &&
      l <= range.lMax
    );
  };

  const getFilteredPalettes = () => {
    let filtered = coolors_palettes.palettes;

    // Add color filtering before other filters
    if (selectedColor !== "all") {
      filtered = filtered.filter((palette) =>
        palette.colors.some((color) => isColorInRange(color, selectedColor))
      );
    }

    // Filter by category (you can define categories based on color analysis)
    if (selectedCategory !== "all") {
      filtered = filtered.filter((palette) => {
        switch (selectedCategory) {
          case "dark":
            // If most colors have low lightness
            return (
              palette.colors.filter((color) => {
                const { l } = hexToHSL(color);
                return l < 50;
              }).length >= Math.ceil(palette.colors.length / 2)
            );

          case "light":
            // If most colors have high lightness
            return (
              palette.colors.filter((color) => {
                const { l } = hexToHSL(color);
                return l > 50;
              }).length >= Math.ceil(palette.colors.length / 2)
            );

          case "colorful":
            // If colors have high saturation and varied hues
            return (
              palette.colors.every((color) => {
                const { s } = hexToHSL(color);
                return s > 30;
              }) && hasVariedHues(palette.colors)
            );

          case "monochrome":
            // If colors have similar hues but different lightness/saturation
            return hasSimilarHues(palette.colors);

          case "warm":
            // If most colors are in warm hue range (reds, oranges, yellows)
            return (
              palette.colors.filter((color) => {
                const { h } = hexToHSL(color);
                return (h >= 0 && h <= 60) || h >= 300;
              }).length >= Math.ceil(palette.colors.length / 2)
            );

          case "cool":
            // If most colors are in cool hue range (blues, greens, purples)
            return (
              palette.colors.filter((color) => {
                const { h } = hexToHSL(color);
                return h > 60 && h < 300;
              }).length >= Math.ceil(palette.colors.length / 2)
            );

          default:
            return true;
        }
      });
    }

    // Sort palettes
    if (sortBy !== "default") {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "name":
            return (a.name || "").localeCompare(b.name || "");

          case "brightness":
            // Sort by average lightness
            const avgBrightnessA =
              a.colors.reduce((sum, color) => sum + hexToHSL(color).l, 0) /
              a.colors.length;
            const avgBrightnessB =
              b.colors.reduce((sum, color) => sum + hexToHSL(color).l, 0) /
              b.colors.length;
            return avgBrightnessB - avgBrightnessA;

          case "saturation":
            // Sort by average saturation
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
    }

    // Search by name or color
    if (searchTerm) {
      filtered = filtered.filter(
        (palette) =>
          (palette.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          palette.colors.some((color) =>
            color.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    return filtered;
  };

  // Helper functions for category filtering
  const hasVariedHues = (colors) => {
    const hues = colors.map((color) => hexToHSL(color).h);
    const uniqueHues = new Set(hues.map((h) => Math.round(h / 30))); // Group similar hues
    return uniqueHues.size >= 3; // At least 3 different hue groups
  };

  const hasSimilarHues = (colors) => {
    const hues = colors.map((color) => hexToHSL(color).h);
    const hueRange = Math.max(...hues) - Math.min(...hues);
    return hueRange <= 45; // All hues within 45 degrees
  };

  const isPaletteSaved = (palette) => {
    return savedPalettes.some(
      (saved) =>
        saved.colors.length === palette.colors.length &&
        saved.colors.every((color, index) => color === palette.colors[index])
    );
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

  const handleSavedPalettesToggle = () => {
    setShowSavedPalettes(!showSavedPalettes);
    setActiveDropdown(null);
  };

  // Add useEffect to handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".dropdown-menu") &&
        !event.target.closest(".dropdown-trigger")
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSavePalette = (palette) => {
    setSavedPalettes([...savedPalettes, palette]);
    setSavedPaletteName(palette.name || "Palette");
    setShowSaveModal(true);
  };

  // When a color is selected from the dropdown
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setActiveDropdown(null);
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
  };

  // Add this to ensure unique palette names when the component mounts
  useEffect(() => {
    // Process the palettes to ensure unique names
    const processedPalettes = ensureUniquePaletteNames(
      coolors_palettes.palettes
    );
    setUniquePalettes(processedPalettes);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--clay-background)]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PaletteProvider>
          <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "picker" && (
            <ColorPicker
              key="colorPicker"
              colorPickerValue={colorPickerValue}
              setColorPickerValue={setColorPickerValue}
              savedColors={savedColors}
              setSavedColors={setSavedColors}
            />
          )}

          {activeTab === "generator" && (
            <ImageGenerator
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              image={image}
              setImage={setImage}
              onDrop={onDrop}
            />
          )}

          {activeTab === "discover" && (
            <>
              <DiscoverFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                colorCount={colorCount}
                setColorCount={setColorCount}
                handleSavedPalettesToggle={handleSavedPalettesToggle}
              />
              <PaletteGrid
                palettes={uniquePalettes}
                searchTerm={searchTerm}
                selectedColor={selectedColor}
                selectedCategory={selectedCategory}
                sortBy={sortBy}
                colorCount={colorCount}
              />
              {showSavedPalettes && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={handleSavedPalettesToggle}
                ></div>
              )}
              <SavedPalettes
                showSavedPalettes={showSavedPalettes}
                handleSavedPalettesToggle={handleSavedPalettesToggle}
              />
            </>
          )}

          {activeTab === "playground" && <UIPlayground />}

          <SaveModal
            show={showSaveModal}
            paletteName={savedPaletteName}
            onClose={handleCloseSaveModal}
          />
        </PaletteProvider>
      </main>
    </div>
  );
}

export default App;
