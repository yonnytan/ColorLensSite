import { useState, useRef, useEffect, useCallback } from "react";
import {
  PhotoIcon,
  ArrowPathIcon,
  ClipboardIcon,
  HeartIcon,
  XMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { usePalette } from "../../context/PaletteContext";
import { getContrastColor } from "../../utils/colorUtils";
import { ConfirmationModal } from "../common/ConfirmationModal";

export function ImageGenerator({
  getRootProps,
  getInputProps,
  image,
  setImage,
  onDrop,
}) {
  const { handleSavePalette, savedPalettes, handleUpdatePalettes } =
    usePalette();
  const [dots, setDots] = useState([]);
  const [colorCount, setColorCount] = useState(5);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedDot, setDraggedDot] = useState(null);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(
    "Copied CSS variables!"
  );
  const imageRef = useRef(null);
  const imageContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const [hoveredDot, setHoveredDot] = useState(null);
  const [showMobilePalettes, setShowMobilePalettes] = useState(false);
  const [showColorCountDropdown, setShowColorCountDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [loupePosition, setLoupePosition] = useState({ x: 0, y: 0 });
  const [showLoupe, setShowLoupe] = useState(false);
  const loupeSize = 120; // Size of the loupe
  const zoomFactor = 2; // How much to zoom in
  const [dotsTransitioning, setDotsTransitioning] = useState(false);
  const [mobilePalettesOpen, setMobilePalettesOpen] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const magnifierSize = 120; // Size of the magnifier in pixels
  const magnifierZoom = 4; // Zoom level for the magnifier
  const leftSectionRef = useRef(null);
  const savedPalettesContainerRef = useRef(null);
  const [leftSectionHeight, setLeftSectionHeight] = useState(0);
  const [lastValidPosition, setLastValidPosition] = useState({
    x: 0,
    y: 0,
    percentX: 0,
    percentY: 0,
    color: "#000000",
  });
  // Add this state for debugging
  const [showPositionDebug, setShowPositionDebug] = useState(false);

  // Add this CSS class to ensure minimum width for expanded palettes
  const expandedPaletteMinWidth = "min-w-[120px]";

  // Add state for confirmation modal
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [paletteToDelete, setPaletteToDelete] = useState(null);

  useEffect(() => {
    console.log("Image state:", image);
    console.log("Image dimensions:", imageDimensions);
  }, [image, imageDimensions]);

  useEffect(() => {
    if (image && imageRef.current) {
      // If the image is already loaded, call handleImageLoad
      if (imageRef.current.complete) {
        handleImageLoad();
      }
      // Otherwise the onLoad handler will call it
    }
  }, [image]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowColorCountDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (mobilePalettesOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobilePalettesOpen]);

  useEffect(() => {
    const updateHeight = () => {
      if (leftSectionRef.current) {
        const height = leftSectionRef.current.clientHeight;
        setLeftSectionHeight(height);
      }
    };

    // Initial measurement
    updateHeight();

    // Set up resize observer to update on any size changes
    const resizeObserver = new ResizeObserver(updateHeight);
    if (leftSectionRef.current) {
      resizeObserver.observe(leftSectionRef.current);
    }

    // Clean up
    return () => {
      if (leftSectionRef.current) {
        resizeObserver.unobserve(leftSectionRef.current);
      }
    };
  }, [image]);

  // Function to get color at a specific point in the image
  const getColorAtPoint = useCallback((x, y) => {
    if (!canvasRef.current || !imageRef.current) return "#000000";

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Convert from display coordinates to canvas coordinates
    const imgRect = imageRef.current.getBoundingClientRect();
    const scaleX = canvas.width / imgRect.width;
    const scaleY = canvas.height / imgRect.height;

    // Calculate the exact pixel position
    const actualX = Math.min(
      Math.max(0, Math.round(x * scaleX)),
      canvas.width - 1
    );
    const actualY = Math.min(
      Math.max(0, Math.round(y * scaleY)),
      canvas.height - 1
    );

    // Get the pixel data
    const pixel = ctx.getImageData(actualX, actualY, 1, 1).data;

    // Convert to hex color
    return `#${((pixel[0] << 16) | (pixel[1] << 8) | pixel[2])
      .toString(16)
      .padStart(6, "0")}`;
  }, []);

  const generateRandomDots = () => {
    if (!imageRef.current) return;

    setDotsTransitioning(true);

    // Force a reflow to ensure we have the most current dimensions
    // This helps on mobile where dimensions might not be immediately accurate
    const forceReflow = imageRef.current.offsetHeight;

    // Get the actual image dimensions from the image element
    const imgRect = imageRef.current.getBoundingClientRect();
    const imgWidth = imgRect.width;
    const imgHeight = imgRect.height;

    console.log("Randomizing dots with image dimensions:", imgWidth, imgHeight);

    // Safety check - if dimensions are suspiciously small, delay and retry
    if (imgWidth < 50 || imgHeight < 50) {
      console.warn("Image dimensions seem too small, delaying randomization");
      setTimeout(generateRandomDots, 500);
      return;
    }

    // Create dots with positions as percentages of the image dimensions
    // Increase the buffer zone for mobile devices
    const edgeBuffer = window.innerWidth <= 768 ? 10 : 5; // 10% buffer on mobile, 5% on desktop

    const newDots = Array(colorCount)
      .fill()
      .map(() => {
        const x = edgeBuffer + Math.random() * (100 - 2 * edgeBuffer); // Random percentage between buffer% and (100-buffer)%
        const y = edgeBuffer + Math.random() * (100 - 2 * edgeBuffer); // Random percentage between buffer% and (100-buffer)%
        return { x, y, color: "#000000" }; // Placeholder color
      });

    // Update colors based on positions
    const updatedDots = newDots.map((dot) => {
      const pixelX = (dot.x / 100) * imgWidth;
      const pixelY = (dot.y / 100) * imgHeight;

      return {
        ...dot,
        color: getColorAtPoint(pixelX, pixelY),
      };
    });

    setDots(updatedDots);

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setDotsTransitioning(false);
    }, 500);
  };

  const updateDotsColors = (dots) => {
    if (!imageRef.current) return;

    // Create canvas and draw image
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = imageRef.current.naturalWidth;
    canvas.height = imageRef.current.naturalHeight;
    ctx.drawImage(imageRef.current, 0, 0);

    // Update colors for all dots
    const updatedDots = dots.map((dot) => {
      // Convert percentage to actual pixels for color sampling
      const imgRect = imageRef.current.getBoundingClientRect();
      const pixelX = (dot.x / 100) * imgRect.width;
      const pixelY = (dot.y / 100) * imgRect.height;

      return {
        ...dot,
        color: getColorAtPoint(pixelX, pixelY),
      };
    });

    setDots(updatedDots);
  };

  const handleImageLoad = () => {
    if (!imageRef.current) return;

    // Set up canvas with correct dimensions
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = imageRef.current.naturalWidth;
    canvas.height = imageRef.current.naturalHeight;
    ctx.drawImage(imageRef.current, 0, 0);

    // Calculate appropriate dimensions to fit within the container
    const containerWidth = 400; // Match the container width
    const containerHeight = 400; // Match the container height

    const imgNaturalWidth = imageRef.current.naturalWidth;
    const imgNaturalHeight = imageRef.current.naturalHeight;

    // Calculate aspect ratio
    const aspectRatio = imgNaturalWidth / imgNaturalHeight;

    // Determine dimensions that maintain aspect ratio and fit within container
    let displayWidth, displayHeight;

    if (aspectRatio > 1) {
      // Wider than tall
      displayWidth = Math.min(containerWidth, imgNaturalWidth);
      displayHeight = displayWidth / aspectRatio;
    } else {
      // Taller than wide
      displayHeight = Math.min(containerHeight, imgNaturalHeight);
      displayWidth = displayHeight * aspectRatio;
    }

    // Store the calculated dimensions
    setImageDimensions({
      width: displayWidth,
      height: displayHeight,
    });

    // Add a small delay to ensure the image is fully rendered before generating dots
    setTimeout(() => {
      generateRandomDots();
    }, 100);
  };

  // Handle dot drag start - works for both mouse and touch
  const handleDotDragStart = (index, e) => {
    // Prevent dragging on mobile devices
    if (window.innerWidth <= 768) {
      return; // Early return for mobile devices
    }

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    setDraggedDot(index);
    setShowMagnifier(true);

    // Get position from either mouse or touch event
    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

    setMagnifierPosition({ x: clientX, y: clientY });

    // Hide the dot being dragged by setting a temporary style
    setDots((prevDots) => {
      const newDots = [...prevDots];
      if (newDots[index]) {
        newDots[index] = {
          ...newDots[index],
          isBeingDragged: true,
        };
      }
      return newDots;
    });

    console.log("Dragging dot index:", index);
  };

  // Completely reimplemented drag handling effect
  useEffect(() => {
    if (!isDragging || draggedDot === null) return;

    // Separate handlers for desktop and mobile
    const handleDesktopMove = (e) => {
      if (
        !isDragging ||
        draggedDot === null ||
        !imageRef.current ||
        !window.innerWidth > 768
      )
        return;

      // Get coordinates from mouse event
      const clientX = e.clientX;
      const clientY = e.clientY;

      // Update magnifier position
      setMagnifierPosition({ x: clientX, y: clientY });

      // Get image boundaries
      const imgRect = imageRef.current.getBoundingClientRect();

      // Calculate position relative to the image with bounds checking
      const imgX = Math.max(0, Math.min(imgRect.width, clientX - imgRect.left));
      const imgY = Math.max(0, Math.min(imgRect.height, clientY - imgRect.top));

      // Convert to percentage for dot positioning
      const percentX = Math.max(0, Math.min(100, (imgX / imgRect.width) * 100));
      const percentY = Math.max(
        0,
        Math.min(100, (imgY / imgRect.height) * 100)
      );

      // Get the color at this position
      const color = getColorAtPoint(imgX, imgY);

      // Store the last valid position
      setLastValidPosition({ x: imgX, y: imgY, percentX, percentY, color });

      // Update the dot position in real-time
      setDots((prevDots) => {
        if (!prevDots || draggedDot >= prevDots.length) return prevDots;
        const newDots = [...prevDots];
        newDots[draggedDot] = {
          ...newDots[draggedDot],
          x: percentX,
          y: percentY,
          color: color || newDots[draggedDot].color,
          isBeingDragged: true,
        };
        return newDots;
      });
    };

    // Completely separate handler for mobile
    const handleMobileMove = (e) => {
      if (
        !isDragging ||
        draggedDot === null ||
        !imageRef.current ||
        !canvasRef.current ||
        window.innerWidth > 768
      )
        return;

      e.preventDefault(); // Prevent scrolling on mobile

      // Get touch coordinates
      const touch = e.touches[0];
      const clientX = touch.clientX;
      const clientY = touch.clientY;

      // Get image boundaries
      const imgRect = imageRef.current.getBoundingClientRect();

      // Calculate position relative to the image with bounds checking
      // Strict boundary enforcement - clamp values to image boundaries
      let imgX = Math.max(0, Math.min(imgRect.width, clientX - imgRect.left));
      let imgY = Math.max(0, Math.min(imgRect.height, clientY - imgRect.top));

      // Apply a touch offset correction to account for the "fat finger" problem
      const touchOffsetY = -15; // Offset upward by 15px to account for finger position
      imgY = Math.max(0, Math.min(imgRect.height, imgY + touchOffsetY));

      // Update magnifier position - keep it within the image bounds
      setMagnifierPosition({
        x: Math.max(imgRect.left, Math.min(imgRect.right, clientX)),
        y: Math.max(imgRect.top, Math.min(imgRect.bottom, clientY)),
      });

      // Convert to percentage for dot positioning
      // Ensure percentages are strictly within 0-100 range
      const percentX = Math.max(0, Math.min(100, (imgX / imgRect.width) * 100));
      const percentY = Math.max(
        0,
        Math.min(100, (imgY / imgRect.height) * 100)
      );

      // Get the canvas context for direct pixel sampling
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Calculate the scale between displayed image and original image
      const scaleX = canvas.width / imgRect.width;
      const scaleY = canvas.height / imgRect.height;

      // Calculate the position in the original image coordinates
      const originalX = Math.floor(imgX * scaleX);
      const originalY = Math.floor(imgY * scaleY);

      // Sample the color directly from the canvas
      let color;
      try {
        const pixel = ctx.getImageData(originalX, originalY, 1, 1).data;
        color = `#${pixel[0].toString(16).padStart(2, "0")}${pixel[1]
          .toString(16)
          .padStart(2, "0")}${pixel[2].toString(16).padStart(2, "0")}`;
      } catch (error) {
        console.error("Error sampling color:", error);
        color = getColorAtPoint(imgX, imgY); // Fallback
      }

      // Store the last valid position with the correct color
      setLastValidPosition({ x: imgX, y: imgY, percentX, percentY, color });

      // Update the dot position in real-time
      setDots((prevDots) => {
        if (!prevDots || draggedDot >= prevDots.length) return prevDots;
        const newDots = [...prevDots];
        newDots[draggedDot] = {
          ...newDots[draggedDot],
          x: percentX,
          y: percentY,
          color: color || newDots[draggedDot].color,
          isBeingDragged: true,
        };
        return newDots;
      });
    };

    // Shared handler for both desktop and mobile
    const handleEnd = () => {
      if (draggedDot !== null) {
        // Log the final position where the dot will be placed
        console.log("Final dot placement:", {
          dotIndex: draggedDot,
          percentX: lastValidPosition.percentX,
          percentY: lastValidPosition.percentY,
          color: lastValidPosition.color,
          isMobile: window.innerWidth <= 768,
        });

        setDots((prevDots) => {
          const newDots = [...prevDots];
          newDots[draggedDot] = {
            ...newDots[draggedDot],
            x: lastValidPosition.percentX,
            y: lastValidPosition.percentY,
            color: lastValidPosition.color,
            isBeingDragged: false,
          };
          return newDots;
        });
      }

      setShowMagnifier(false);
      setIsDragging(false);
      setDraggedDot(null);
    };

    // Add event listeners based on device type
    if (window.innerWidth <= 768) {
      // Mobile event listeners
      document.addEventListener("touchmove", handleMobileMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleEnd);
      document.addEventListener("touchcancel", handleEnd);
    } else {
      // Desktop event listeners
      document.addEventListener("mousemove", handleDesktopMove);
      document.addEventListener("mouseup", handleEnd);
    }

    return () => {
      // Clean up all event listeners
      document.removeEventListener("mousemove", handleDesktopMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMobileMove);
      document.removeEventListener("touchend", handleEnd);
      document.removeEventListener("touchcancel", handleEnd);
    };
  }, [isDragging, draggedDot, getColorAtPoint, lastValidPosition]);

  const copyPaletteCSS = () => {
    const css = dots
      .map((dot, i) => `--color-${i + 1}: ${dot.color};`)
      .join("\n");
    navigator.clipboard.writeText(css);
    setNotificationMessage("CSS copied");
    setShowCopiedNotification(true);
    setTimeout(() => setShowCopiedNotification(false), 2000);
  };

  const savePalette = () => {
    const colors = dots.map((dot) => dot.color);

    // Check if palette already exists before prompting for a name
    const tempPalette = { colors };
    if (isPaletteSaved(tempPalette)) {
      // Find the existing palette name
      const existingPalette = savedPalettes.find(
        (p) => JSON.stringify(p.colors) === JSON.stringify(colors)
      );

      setNotificationMessage(
        `This palette already exists (${existingPalette.name})`
      );
      // Set a special class for error notifications
      document
        .querySelector(".notification-message")
        ?.classList.add("error-notification");
      setShowCopiedNotification(true);
      setTimeout(() => {
        setShowCopiedNotification(false);
        document
          .querySelector(".notification-message")
          ?.classList.remove("error-notification");
      }, 2000);
      return;
    }

    // If palette doesn't exist, prompt for name
    const paletteName = prompt(
      "Enter a name for this palette:",
      `Palette ${savedPalettes.length + 1}`
    );
    if (paletteName !== null) {
      handleSavePalette({
        name: paletteName.trim() || `Palette ${savedPalettes.length + 1}`,
        colors,
      });

      // Show confirmation notification
      setNotificationMessage("Palette saved successfully!");
      setShowCopiedNotification(true);
      setTimeout(() => setShowCopiedNotification(false), 2000);
    }
  };

  const handleDotClick = (color) => {
    // Handle dot click
  };

  const isPaletteSaved = (newPalette) => {
    return savedPalettes.some(
      (p) => JSON.stringify(p.colors) === JSON.stringify(newPalette.colors)
    );
  };

  // Add this function to toggle the debug mode
  const togglePositionDebug = useCallback(() => {
    setShowPositionDebug((prev) => !prev);
  }, []);

  const handleDotMouseUp = (e) => {
    if (draggedDot === null) return;

    // Final boundary check when releasing a dot
    if (window.innerWidth <= 768 && imageRef.current) {
      const imgRect = imageRef.current.getBoundingClientRect();

      setDots((prevDots) => {
        if (!prevDots || draggedDot >= prevDots.length) return prevDots;

        const newDots = [...prevDots];
        const dot = newDots[draggedDot];

        // Ensure the dot is within bounds (0-100%)
        newDots[draggedDot] = {
          ...dot,
          x: Math.max(0, Math.min(100, dot.x)),
          y: Math.max(0, Math.min(100, dot.y)),
          isBeingDragged: false,
        };

        return newDots;
      });
    }

    setIsDragging(false);
    setDraggedDot(null);
    setShowMagnifier(false);
  };

  // Add this function to check if a dot is at the boundary
  const isDotAtBoundary = (dot) => {
    if (!dot) return false;

    const boundaryThreshold = 2; // Consider within 2% of edge as "at boundary"
    return (
      dot.x <= boundaryThreshold ||
      dot.x >= 100 - boundaryThreshold ||
      dot.y <= boundaryThreshold ||
      dot.y >= 100 - boundaryThreshold
    );
  };

  // Update the saved palette display in the sidebar with hover expansion
  const renderSavedPaletteInSidebar = (palette, index) => {
    return (
      <div
        key={index}
        className="flex flex-col gap-2 saved-palette-card p-2 rounded-lg"
      >
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm palette-name">
            {palette.name || `Palette ${index + 1}`}
          </h4>
          <div className="flex gap-1">
            <button
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white p-1 rounded transition-colors"
              onClick={() => handleLoadPalette(palette)}
              title="Apply Palette"
            >
              <ArrowPathIcon className="w-3 h-3" />
            </button>
            <button
              className="text-xs bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"
              onClick={() => handleCopyPalette(palette)}
              title="Copy Palette"
            >
              <ClipboardIcon className="w-3 h-3" />
            </button>
            <button
              className="text-xs bg-red-600 hover:bg-red-700 text-white p-1 rounded transition-colors"
              onClick={() => handleDeletePalette(palette, index)}
              title="Delete Palette"
            >
              <TrashIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="flex h-12 rounded-lg overflow-hidden shadow-md group">
          {palette.colors.map((color, i) => (
            <div
              key={`${color}-${i}`}
              className="color-block relative flex items-center justify-center transition-all duration-300 hover:flex-[1.5] flex-1"
              style={{
                backgroundColor: color,
              }}
            >
              {/* Color value tooltip with improved padding */}
              <div
                className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 bg-black bg-opacity-70 text-white text-xs px-2 py-1 text-center overflow-hidden"
                style={{
                  minWidth: `${Math.max(80, color.length * 9)}px`, // Smaller min-width for sidebar
                  transform:
                    i === 0
                      ? "translateX(0)"
                      : i === palette.colors.length - 1
                      ? "translateX(-25%)"
                      : "translateX(-12.5%)",
                }}
              >
                {color}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Update the mobile palette rendering with hover expansion
  const renderMobilePalette = (palette, index) => {
    return (
      <div
        key={index}
        className="relative flex flex-col rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800 mb-4"
      >
        <div className="flex h-16 w-full">
          {palette.colors.map((color, colorIndex) => (
            <div
              key={colorIndex}
              className="h-full relative hover:flex-[1.5] flex-1 transition-all duration-300"
              style={{
                backgroundColor: color,
              }}
            >
              {/* Always show color info on mobile with improved padding */}
              <div
                className={`absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white text-xs px-2 py-1 text-center overflow-hidden ${expandedPaletteMinWidth}`}
                style={{
                  minWidth: `${Math.max(120, color.length * 9)}px`, // Increased width multiplier
                  transform:
                    colorIndex === 0
                      ? "translateX(0)"
                      : colorIndex === palette.colors.length - 1
                      ? "translateX(-25%)"
                      : "translateX(-12.5%)",
                }}
              >
                {color}
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 flex justify-between items-center">
          <div className="text-sm font-medium truncate dark:text-white">
            {palette.name || `Palette ${index + 1}`}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleLoadPalette(palette)}
              className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
              title="Load palette"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleCopyPalette(palette)}
              className="text-gray-600 hover:text-green-500 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
              title="Copy palette"
            >
              <ClipboardIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDeletePalette(palette, index)}
              className="text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
              title="Delete palette"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Update the handleDeletePalette function
  const handleDeletePalette = (palette, index) => {
    setPaletteToDelete({ palette, index });
    setShowDeleteConfirmation(true);
  };

  // Add a new function to confirm deletion
  const confirmDeletePalette = () => {
    if (paletteToDelete) {
      // Delete the palette from the context
      const updatedPalettes = [...savedPalettes];
      updatedPalettes.splice(paletteToDelete.index, 1);
      handleUpdatePalettes(updatedPalettes);

      // Show a temporary notification
      setNotificationMessage("Palette deleted successfully!");
      setShowCopiedNotification(true);
      setTimeout(() => setShowCopiedNotification(false), 2000);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Left section - add the ref here */}
      <div ref={leftSectionRef} className="flex-1 clay-card p-6 rounded-xl">
        {/* Main content container */}
        <div className="clay-card p-6 rounded-xl relative flex-1">
          {/* Controls Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Palette Generator</h2>
              <div className="flex gap-2">
                {/* Mobile Saved Palettes Button */}
                <button
                  className="clay-button px-3 py-1.5 rounded-lg flex items-center justify-center lg:hidden"
                  onClick={() => setMobilePalettesOpen(true)}
                >
                  {savedPalettes.length > 0 ? (
                    <HeartIconSolid className="w-5 h-5 mr-1 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 mr-1" />
                  )}
                  <span className="text-sm">Palettes</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {!image ? (
              // Single large upload area that spans the entire width when no image is present
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-400 rounded-lg p-12 text-center cursor-pointer h-full flex flex-col items-center justify-center lg:col-span-2 lg:py-24"
              >
                <input {...getInputProps()} />
                <PhotoIcon className="w-20 h-20 mb-6 text-gray-400 lg:w-28 lg:h-28" />
                <p className="text-xl mb-2 lg:text-2xl">
                  {window.innerWidth <= 768
                    ? "Tap to select an image"
                    : "Drag & drop an image here, or click to select one"}
                </p>
                <p className="text-sm text-gray-500 lg:text-base">
                  Upload an image to generate a color palette
                </p>
              </div>
            ) : (
              // When image is present, show the two-column layout
              <>
                {/* Left Side - Image Section */}
                <div className="w-full">
                  <div className="relative" ref={imageContainerRef}>
                    <div className="relative w-full h-[400px] lg:h-[500px] overflow-hidden rounded-lg flex items-center justify-center bg-gray-900">
                      {/* Inner container that will match image dimensions exactly */}
                      <div
                        className="relative"
                        style={{
                          width: `${imageDimensions.width}px`,
                          height: `${imageDimensions.height}px`,
                          maxWidth: "100%",
                          maxHeight: "100%",
                        }}
                      >
                        <div
                          className="relative w-full h-full overflow-hidden"
                          style={{
                            touchAction: "none",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            ref={imageRef}
                            src={image}
                            alt="Uploaded"
                            className="max-w-full max-h-full object-contain"
                            onLoad={handleImageLoad}
                            style={{
                              touchAction: "none",
                              maxWidth: "100%",
                              maxHeight: "100%",
                              width: "auto",
                              height: "auto",
                            }}
                          />

                          {/* Dots on the image */}
                          {dots.map((dot, index) => (
                            <div
                              key={index}
                              className={`absolute w-6 h-6 rounded-full ${
                                window.innerWidth <= 768 ? "" : "cursor-pointer"
                              } transition-all duration-300 ease-in-out ${
                                dotsTransitioning ? "scale-0" : "scale-100"
                              } ${
                                hoveredDot === index ? "ring-2 ring-white" : ""
                              } ${
                                isDotAtBoundary(dot) && window.innerWidth <= 768
                                  ? "ring-2 ring-yellow-400 animate-pulse"
                                  : ""
                              }`}
                              style={{
                                backgroundColor: dot.color,
                                left: `${dot.x}%`,
                                top: `${dot.y}%`,
                                transform: "translate(-50%, -50%)",
                                boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.5)",
                                zIndex: draggedDot === index ? 30 : 20,
                              }}
                              onMouseDown={(e) => handleDotDragStart(index, e)}
                              onTouchStart={(e) =>
                                window.innerWidth > 768 &&
                                handleDotDragStart(index, e)
                              }
                              onMouseEnter={() => setHoveredDot(index)}
                              onMouseLeave={() => setHoveredDot(null)}
                            >
                              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Canvas for color extraction (hidden) */}
                        <canvas
                          ref={canvasRef}
                          className="hidden"
                          width="300"
                          height="300"
                        />
                      </div>
                    </div>

                    {/* Upload New Image button and Color Count dropdown moved under the image */}
                    <div className="mt-4 flex flex-col md:flex-row gap-2 w-full">
                      <button
                        {...getRootProps()}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        <PhotoIcon className="w-5 h-5" />
                        <span className="hidden md:inline">
                          Upload New Image
                        </span>
                        <span className="md:hidden">New Image</span>
                        <input {...getInputProps()} />
                      </button>

                      {/* Custom dropdown for color count */}
                      <div className="relative" ref={dropdownRef}>
                        <button
                          onClick={() =>
                            setShowColorCountDropdown((prev) => !prev)
                          }
                          className="clay-card px-3 py-2 lg:py-3 lg:px-4 lg:text-lg rounded-lg flex items-center justify-between min-w-[100px] lg:min-w-[120px]"
                        >
                          <span>{colorCount} Colors</span>
                          <ChevronDownIcon className="w-4 h-4 lg:w-5 lg:h-5 ml-2" />
                        </button>

                        {showColorCountDropdown && (
                          <>
                            {/* Add a backdrop overlay */}
                            <div
                              className="fixed inset-0 bg-black bg-opacity-50 z-40"
                              onClick={() => setShowColorCountDropdown(false)}
                            ></div>

                            {/* Center the dropdown absolutely */}
                            <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden md:absolute md:left-auto md:top-full md:transform-none md:mt-1 md:right-0 md:w-full">
                              <div className="py-1">
                                {[3, 4, 5, 6, 7, 8].map((num) => (
                                  <button
                                    key={num}
                                    className={`w-full text-left px-3 py-2 hover:bg-gray-700 ${
                                      colorCount === num ? "bg-gray-700" : ""
                                    }`}
                                    onClick={() => {
                                      setColorCount(num);
                                      setShowColorCountDropdown(false);

                                      // Immediately update the dots based on the new color count
                                      if (imageRef.current) {
                                        // If we're increasing the count, add new dots
                                        if (num > dots.length) {
                                          const newDots = [...dots];
                                          for (
                                            let i = dots.length;
                                            i < num;
                                            i++
                                          ) {
                                            // Add new random dots
                                            const x = Math.random() * 100;
                                            const y = Math.random() * 100;
                                            const color = getColorAtPoint(
                                              (x / 100) *
                                                imageRef.current.clientWidth,
                                              (y / 100) *
                                                imageRef.current.clientHeight
                                            );
                                            newDots.push({ x, y, color });
                                          }
                                          setDots(newDots);
                                        }
                                        // If we're decreasing the count, remove dots
                                        else if (num < dots.length) {
                                          setDots(dots.slice(0, num));
                                        }
                                        // If count is the same, do nothing
                                      }
                                    }}
                                  >
                                    {num} Colors
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Controls and Generated Palette */}
                <div className="w-full flex flex-col gap-6">
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 mt-4">
                      <button
                        onClick={generateRandomDots}
                        className="clay-button flex items-center justify-center px-4 py-2 lg:py-3 lg:text-lg rounded-lg w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                      >
                        <ArrowPathIcon className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
                        Randomize
                      </button>

                      <button
                        onClick={copyPaletteCSS}
                        className="clay-button flex items-center justify-center px-4 py-2 lg:py-3 lg:text-lg rounded-lg w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                        disabled={!dots.length}
                      >
                        <CodeBracketIcon className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
                        Copy CSS
                      </button>

                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 lg:py-3 lg:text-lg rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                        onClick={savePalette}
                      >
                        <HeartIcon className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
                        Save Palette
                      </button>
                    </div>
                  </div>

                  {/* Generated Palette */}
                  <div className="flex flex-col gap-4 flex-2">
                    <h3 className="text-sm lg:text-base font-medium text-gray-400">
                      Generated Palette
                    </h3>
                    <div
                      className="flex-1 rounded-xl overflow-hidden shadow-xl"
                      style={{ height: "200px", maxHeight: "300px" }}
                    >
                      <div className="flex h-60 lg:h-72 w-full relative">
                        {dots.map((dot, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-center relative transition-all duration-200 group active:scale-95 active:brightness-90"
                            style={{
                              backgroundColor: dot.color,
                              position: "relative",
                              zIndex: draggedDot === index ? 10 : 1,
                              transform:
                                draggedDot === index
                                  ? "scale(1.08)"
                                  : "scale(1)",
                              boxShadow:
                                draggedDot === index
                                  ? "0 8px 16px rgba(0,0,0,0.3)"
                                  : "none",
                              width: `${100 / dots.length}%`, // Divide width evenly based on number of colors
                              transition: "all 0.2s ease-in-out",
                            }}
                            onClick={() => {
                              navigator.clipboard.writeText(dot.color);
                              setNotificationMessage(`Copied ${dot.color}`);
                              setShowCopiedNotification(true);
                              setTimeout(
                                () => setShowCopiedNotification(false),
                                2000
                              );
                            }}
                          >
                            {/* Number (visible by default) */}
                            <span
                              className="text-lg lg:text-xl font-bold group-hover:opacity-0 transition-opacity"
                              style={{
                                color: getContrastColor(dot.color),
                              }}
                            >
                              {index + 1}
                            </span>

                            {/* Color value (visible on hover) */}
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              style={{ backgroundColor: `${dot.color}CC` }}
                            >
                              <span
                                className="text-xs lg:text-sm font-mono"
                                style={{ color: getContrastColor(dot.color) }}
                              >
                                {dot.color.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile-specific instruction */}
          {window.innerWidth <= 768 && (
            <div className="mt-2 text-center text-sm text-gray-400">
              Tap "Randomize" to create different color palettes
            </div>
          )}

          {/* Mobile Saved Palettes Slide-out Panel */}
          <div
            className={`fixed inset-y-0 right-0 z-50 w-72 bg-[var(--clay-background)] shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
              mobilePalettesOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header with close button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold">Saved Palettes</h3>
                <button
                  className="p-1 rounded-full hover:bg-gray-700"
                  onClick={() => setMobilePalettesOpen(false)}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Palettes container */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="flex flex-col gap-4">
                  {savedPalettes.map((palette, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 saved-palette-card p-2 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm palette-name">
                          {palette.name}
                        </h4>
                        <div className="flex gap-1">
                          {/* Reapply button */}
                          <button
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white p-1 rounded transition-colors"
                            onClick={() => {
                              // Apply this palette's colors to the current dots
                              if (dots.length > 0) {
                                setDotsTransitioning(true);

                                // Create new dots with the same positions but colors from the palette
                                const newDots = [...dots];
                                const minLength = Math.min(
                                  newDots.length,
                                  palette.colors.length
                                );

                                // Update colors for existing dots
                                for (let i = 0; i < minLength; i++) {
                                  newDots[i] = {
                                    ...newDots[i],
                                    color: palette.colors[i],
                                  };
                                }

                                // If palette has more colors than current dots, add more dots
                                if (palette.colors.length > newDots.length) {
                                  for (
                                    let i = newDots.length;
                                    i < palette.colors.length;
                                    i++
                                  ) {
                                    const x = Math.random() * 100;
                                    const y = Math.random() * 100;
                                    newDots.push({
                                      x,
                                      y,
                                      color: palette.colors[i],
                                    });
                                  }
                                  // Update color count
                                  setColorCount(palette.colors.length);
                                }

                                setDots(newDots);

                                // Show notification
                                setNotificationMessage(
                                  "Palette applied to image!"
                                );
                                setShowCopiedNotification(true);
                                setTimeout(
                                  () => setShowCopiedNotification(false),
                                  2000
                                );

                                // Close mobile panel
                                setMobilePalettesOpen(false);

                                // Reset transition state after animation completes
                                setTimeout(() => {
                                  setDotsTransitioning(false);
                                }, 500);
                              }
                            }}
                            title="Apply Palette to Image"
                          >
                            <ArrowPathIcon className="w-3 h-3" />
                          </button>

                          {/* Rename button */}
                          <button
                            className="text-xs bg-gray-600 hover:bg-gray-700 text-white p-1 rounded transition-colors"
                            onClick={() => {
                              const newName = prompt(
                                "Enter a new name for this palette:",
                                palette.name
                              );
                              if (newName !== null && newName.trim() !== "") {
                                const updatedPalettes = [...savedPalettes];
                                updatedPalettes[index] = {
                                  ...palette,
                                  name: newName.trim(),
                                };
                                handleUpdatePalettes(updatedPalettes);
                                setNotificationMessage(
                                  "Palette renamed successfully!"
                                );
                                setShowCopiedNotification(true);
                                setTimeout(
                                  () => setShowCopiedNotification(false),
                                  2000
                                );
                              }
                            }}
                            title="Rename Palette"
                          >
                            <PencilIcon className="w-3 h-3" />
                          </button>

                          {/* Delete button */}
                          <button
                            className="text-xs bg-red-600 hover:bg-red-700 text-white p-1 rounded transition-colors"
                            onClick={() => handleDeletePalette(palette, index)}
                            title="Delete Palette"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex h-12 rounded-lg overflow-hidden shadow-md">
                        {palette.colors.map((color, i) => (
                          <div
                            key={`${color}-${i}`}
                            className={`color-block relative flex items-center justify-center group transition-all duration-300 active:scale-90 active:brightness-90 hover:flex-[1.5] hover:z-10`}
                            style={{
                              backgroundColor: color,
                              transition: "all 0.2s ease-in-out",
                              width: `${100 / palette.colors.length}%`, // Divide width evenly based on number of colors
                            }}
                            onClick={() => {
                              const cssVars = palette.colors
                                .map(
                                  (color, i) => `--color-${i + 1}: ${color};`
                                )
                                .join("\n");
                              navigator.clipboard.writeText(cssVars);
                              setNotificationMessage("Copied CSS variables!");
                              setShowCopiedNotification(true);
                              setTimeout(
                                () => setShowCopiedNotification(false),
                                2000
                              );
                            }}
                          >
                            {/* Number (visible by default) */}
                            <span
                              className="text-sm font-bold group-hover:opacity-0 transition-opacity duration-100"
                              style={{
                                color: getContrastColor(color),
                              }}
                            >
                              {i + 1}
                            </span>

                            {/* Color value (visible on hover) */}
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100 flex items-center justify-center"
                              style={{ backgroundColor: color }}
                            >
                              <span
                                className="text-xs font-mono"
                                style={{ color: getContrastColor(color) }}
                              >
                                {color.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {savedPalettes.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No saved palettes yet. Click "Save Palette" to add one!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Palettes Container (Desktop Only) */}
      <div
        ref={savedPalettesContainerRef}
        className="hidden lg:block clay-card p-6 rounded-xl w-80"
      >
        <h3 className="text-xl font-semibold mb-6">Saved Palettes</h3>
        <div
          className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar"
          style={{
            maxHeight:
              leftSectionHeight > 0
                ? `${Math.min(leftSectionHeight - 80, 7 * 88 + 20)}px` // Show 6 palettes max (each ~88px with gap)
                : "calc(100vh - 240px)", // Fallback
          }}
        >
          {savedPalettes.map((palette, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 saved-palette-card p-2 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm palette-name">
                  {palette.name}
                </h4>
                <div className="flex gap-1">
                  {/* Reapply button */}
                  <button
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white p-1 rounded transition-colors"
                    onClick={() => {
                      // Apply this palette's colors to the current dots
                      if (dots.length > 0) {
                        setDotsTransitioning(true);

                        // Create new dots with the same positions but colors from the palette
                        const newDots = [...dots];
                        const minLength = Math.min(
                          newDots.length,
                          palette.colors.length
                        );

                        // Update colors for existing dots
                        for (let i = 0; i < minLength; i++) {
                          newDots[i] = {
                            ...newDots[i],
                            color: palette.colors[i],
                          };
                        }

                        // If palette has more colors than current dots, add more dots
                        if (palette.colors.length > newDots.length) {
                          for (
                            let i = newDots.length;
                            i < palette.colors.length;
                            i++
                          ) {
                            const x = Math.random() * 100;
                            const y = Math.random() * 100;
                            newDots.push({ x, y, color: palette.colors[i] });
                          }
                          // Update color count
                          setColorCount(palette.colors.length);
                        }

                        setDots(newDots);

                        // Show notification
                        setNotificationMessage("Palette applied to image!");
                        setShowCopiedNotification(true);
                        setTimeout(
                          () => setShowCopiedNotification(false),
                          2000
                        );

                        // Reset transition state after animation completes
                        setTimeout(() => {
                          setDotsTransitioning(false);
                        }, 500);
                      }
                    }}
                    title="Apply Palette to Image"
                  >
                    <ArrowPathIcon className="w-3 h-3" />
                  </button>

                  {/* Rename button */}
                  <button
                    className="text-xs bg-gray-600 hover:bg-gray-700 text-white p-1 rounded transition-colors"
                    onClick={() => {
                      const newName = prompt(
                        "Enter a new name for this palette:",
                        palette.name
                      );
                      if (newName !== null && newName.trim() !== "") {
                        const updatedPalettes = [...savedPalettes];
                        updatedPalettes[index] = {
                          ...palette,
                          name: newName.trim(),
                        };
                        handleUpdatePalettes(updatedPalettes);
                        setNotificationMessage("Palette renamed successfully!");
                        setShowCopiedNotification(true);
                        setTimeout(
                          () => setShowCopiedNotification(false),
                          2000
                        );
                      }
                    }}
                    title="Rename Palette"
                  >
                    <PencilIcon className="w-3 h-3" />
                  </button>

                  {/* Delete button */}
                  <button
                    className="text-xs bg-red-600 hover:bg-red-700 text-white p-1 rounded transition-colors"
                    onClick={() => handleDeletePalette(palette, index)}
                    title="Delete Palette"
                  >
                    <TrashIcon className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex h-12 rounded-lg overflow-hidden shadow-md">
                {palette.colors.map((color, i) => (
                  <div
                    key={`${color}-${i}`}
                    className={`color-block relative flex items-center justify-center group transition-all duration-300 active:scale-90 active:brightness-90 hover:flex-[1.5] hover:z-10`}
                    style={{
                      backgroundColor: color,
                      transition: "all 0.2s ease-in-out",
                      width: `${100 / palette.colors.length}%`, // Divide width evenly based on number of colors
                    }}
                    onClick={() => {
                      const cssVars = palette.colors
                        .map((color, i) => `--color-${i + 1}: ${color};`)
                        .join("\n");
                      navigator.clipboard.writeText(cssVars);
                      setNotificationMessage("Copied CSS variables!");
                      setShowCopiedNotification(true);
                      setTimeout(() => setShowCopiedNotification(false), 2000);
                    }}
                  >
                    {/* Number (visible by default) */}
                    <span
                      className="text-sm font-bold group-hover:opacity-0 transition-opacity duration-100"
                      style={{
                        color: getContrastColor(color),
                      }}
                    >
                      {i + 1}
                    </span>

                    {/* Color value (visible on hover) */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100 flex items-center justify-center"
                      style={{ backgroundColor: color }}
                    >
                      <span
                        className="text-xs font-mono"
                        style={{ color: getContrastColor(color) }}
                      >
                        {color.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {savedPalettes.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No saved palettes yet. Click "Save Palette" to add one!
            </p>
          )}
        </div>
      </div>

      {/* Magnifier */}
      {showMagnifier && (
        <div
          className="absolute rounded-full border-2 border-white shadow-lg overflow-hidden z-50 pointer-events-none"
          style={{
            width: `${magnifierSize}px`,
            height: `${magnifierSize}px`,
            // Position directly above the cursor/finger
            left:
              window.innerWidth > 768
                ? magnifierPosition.x - magnifierSize / 2 // Centered horizontally on desktop
                : magnifierPosition.x - magnifierSize / 2, // Centered horizontally on mobile
            top:
              window.innerWidth > 768
                ? magnifierPosition.y - magnifierSize - 20 // Above the cursor on desktop
                : magnifierPosition.y - magnifierSize - 60, // Much higher above finger on mobile
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          }}
        >
          {imageRef.current && canvasRef.current && (
            <canvas
              ref={(el) => {
                if (el && imageRef.current && canvasRef.current) {
                  // Get the exact position relative to the image
                  const imgRect = imageRef.current.getBoundingClientRect();

                  // Different handling for mobile vs desktop
                  const isMobile = window.innerWidth <= 768;

                  // Get position relative to the image
                  let x = magnifierPosition.x - imgRect.left;
                  let y = magnifierPosition.y - imgRect.top;

                  // For mobile, apply touch offset correction
                  if (isMobile) {
                    // Apply the same touch offset as in handleMobileMove
                    const touchOffsetY = -15;
                    y = Math.max(0, Math.min(imgRect.height, y + touchOffsetY));
                  }

                  // Set up the magnifier canvas
                  el.width = magnifierSize;
                  el.height = magnifierSize;
                  const ctx = el.getContext("2d");

                  // Clear the canvas
                  ctx.fillStyle = "#f0f0f0";
                  ctx.fillRect(0, 0, magnifierSize, magnifierSize);

                  // Use a higher zoom level for mobile
                  const effectiveZoom = isMobile
                    ? magnifierZoom * 1.25
                    : magnifierZoom;

                  // Simple magnification with proper edge handling
                  const sourceSize = magnifierSize / effectiveZoom;

                  // Calculate source rectangle coordinates
                  let sourceX = x - sourceSize / 2;
                  let sourceY = y - sourceSize / 2;

                  // Create a flag to track if we're at an edge
                  let atEdge = false;

                  // Adjust source rectangle if it goes beyond image boundaries
                  if (sourceX < 0) {
                    sourceX = 0;
                    atEdge = true;
                  }
                  if (sourceY < 0) {
                    sourceY = 0;
                    atEdge = true;
                  }
                  if (sourceX + sourceSize > imgRect.width) {
                    sourceX = imgRect.width - sourceSize;
                    atEdge = true;
                  }
                  if (sourceY + sourceSize > imgRect.height) {
                    sourceY = imgRect.height - sourceSize;
                    atEdge = true;
                  }

                  try {
                    // Get the source canvas (the one with the full-resolution image)
                    const sourceCanvas = canvasRef.current;
                    const sourceCtx = sourceCanvas.getContext("2d");

                    // Calculate the scale between displayed image and original image
                    const scaleX = sourceCanvas.width / imgRect.width;
                    const scaleY = sourceCanvas.height / imgRect.height;

                    // Calculate the position in the original image coordinates
                    const originalX = Math.floor(sourceX * scaleX);
                    const originalY = Math.floor(sourceY * scaleY);
                    const originalWidth = Math.ceil(sourceSize * scaleX);
                    const originalHeight = Math.ceil(sourceSize * scaleY);

                    // Draw the magnified portion of the image
                    ctx.drawImage(
                      sourceCanvas,
                      originalX,
                      originalY,
                      originalWidth,
                      originalHeight,
                      0,
                      0,
                      magnifierSize,
                      magnifierSize
                    );

                    // Draw crosshair in the center - full width and height lines
                    const centerX = magnifierSize / 2;
                    const centerY = magnifierSize / 2;

                    // Draw shadow for visibility on light backgrounds
                    ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
                    ctx.lineWidth = 2;

                    // Horizontal line - full width
                    ctx.beginPath();
                    ctx.moveTo(0, centerY);
                    ctx.lineTo(magnifierSize, centerY);
                    ctx.stroke();

                    // Vertical line - full height
                    ctx.beginPath();
                    ctx.moveTo(centerX, 0);
                    ctx.lineTo(centerX, magnifierSize);
                    ctx.stroke();

                    // Draw white crosshair on top for visibility on dark backgrounds
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
                    ctx.lineWidth = 1;

                    // Horizontal line - full width
                    ctx.beginPath();
                    ctx.moveTo(0, centerY);
                    ctx.lineTo(magnifierSize, centerY);
                    ctx.stroke();

                    // Vertical line - full height
                    ctx.beginPath();
                    ctx.moveTo(centerX, 0);
                    ctx.lineTo(centerX, magnifierSize);
                    ctx.stroke();

                    // Draw a small circle at the center
                    ctx.fillStyle = "white";
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // If we're at an edge, draw a special indicator
                    if (atEdge) {
                      // Draw a yellow indicator at the exact point being sampled
                      const actualX = x - sourceX;
                      const actualY = y - sourceY;
                      const scaledX = (actualX / sourceSize) * magnifierSize;
                      const scaledY = (actualY / sourceSize) * magnifierSize;

                      // Draw a circle at the actual point
                      ctx.fillStyle = "yellow";
                      ctx.beginPath();
                      ctx.arc(scaledX, scaledY, 3, 0, Math.PI * 2);
                      ctx.fill();
                      ctx.strokeStyle = "black";
                      ctx.lineWidth = 1;
                      ctx.stroke();
                    }

                    // Sample the color for internal use but don't display it
                    if (draggedDot !== null) {
                      try {
                        const pixel = sourceCtx.getImageData(
                          Math.floor(x * scaleX),
                          Math.floor(y * scaleY),
                          1,
                          1
                        ).data;
                        // We still get the color but don't display it in the magnifier
                        // This color data is still used elsewhere in the app
                      } catch (error) {
                        console.error("Error sampling color:", error);
                      }
                    }
                  } catch (error) {
                    console.error("Error rendering magnifier:", error);
                    // Draw error message
                    ctx.fillStyle = "red";
                    ctx.font = "12px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText(
                      "Error rendering",
                      magnifierSize / 2,
                      magnifierSize / 2
                    );
                  }
                }
              }}
            />
          )}
        </div>
      )}

      {/* Copy/Action Notification */}
      {showCopiedNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {notificationMessage}
        </div>
      )}

      {/* Position Debug Button - Add this near the bottom of your component */}
      <button
        className="fixed bottom-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-lg text-xs z-50 opacity-70"
        onClick={togglePositionDebug}
      >
        {showPositionDebug ? "Hide Debug" : "Show Debug"}
      </button>

      {/* Position Debug Display */}
      {showPositionDebug && (
        <div className="fixed top-4 left-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs z-50 max-w-xs">
          <h3 className="font-bold mb-2">Position Debug</h3>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <div>Magnifier X:</div>
            <div>{Math.round(magnifierPosition.x)}</div>

            <div>Magnifier Y:</div>
            <div>{Math.round(magnifierPosition.y)}</div>

            <div>Last Valid X:</div>
            <div>{Math.round(lastValidPosition.x)}</div>

            <div>Last Valid Y:</div>
            <div>{Math.round(lastValidPosition.y)}</div>

            <div>Last Valid %X:</div>
            <div>{Math.round(lastValidPosition.percentX)}%</div>

            <div>Last Valid %Y:</div>
            <div>{Math.round(lastValidPosition.percentY)}%</div>

            <div>Dragged Dot:</div>
            <div>{draggedDot !== null ? draggedDot + 1 : "None"}</div>

            <div>Is Mobile:</div>
            <div>{window.innerWidth <= 768 ? "Yes" : "No"}</div>

            {draggedDot !== null && dots[draggedDot] && (
              <>
                <div>Dot X:</div>
                <div>{Math.round(dots[draggedDot].x)}%</div>

                <div>Dot Y:</div>
                <div>{Math.round(dots[draggedDot].y)}%</div>

                <div>Dot Color:</div>
                <div
                  style={{
                    backgroundColor: dots[draggedDot].color || "#000000",
                    color: getContrastColor(
                      dots[draggedDot].color || "#000000"
                    ),
                    padding: "2px 4px",
                    borderRadius: "2px",
                  }}
                >
                  {dots[draggedDot].color || "N/A"}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Visual position indicators for debugging */}
      {showPositionDebug && isDragging && window.innerWidth <= 768 && (
        <>
          {/* Original touch position indicator (red circle) */}
          <div
            className="absolute w-4 h-4 rounded-full border-2 border-red-500 pointer-events-none z-40"
            style={{
              left: `${lastValidPosition.percentX}%`,
              top: `${lastValidPosition.percentY}%`,
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Magnifier center position indicator (blue circle) */}
          <div
            className="absolute w-4 h-4 rounded-full border-2 border-blue-500 pointer-events-none z-40"
            style={{
              left: `${
                ((magnifierPosition.x -
                  imageRef.current?.getBoundingClientRect().left || 0) /
                  (imageRef.current?.getBoundingClientRect().width || 1)) *
                100
              }%`,
              top: `${
                ((magnifierPosition.y -
                  imageRef.current?.getBoundingClientRect().top || 0) /
                  (imageRef.current?.getBoundingClientRect().height || 1)) *
                100
              }%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </>
      )}

      {/* Add the ConfirmationModal at the end */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDeletePalette}
        title="Delete Palette"
        message={`Are you sure you want to delete "${
          paletteToDelete?.palette?.name ||
          `Palette ${paletteToDelete?.index + 1}`
        }" from your saved palettes?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
