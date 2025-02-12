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
} from "@heroicons/react/24/outline";

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

function App() {
  const [image, setImage] = useState(null);
  const [dots, setDots] = useState([]);
  const [colorCount, setColorCount] = useState(5);
  const [hoveredDot, setHoveredDot] = useState(null);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [draggedDot, setDraggedDot] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#000000");
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
  const [activeTab, setActiveTab] = useState("picker"); // 'picker' or 'generator'

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

    console.log("Image dimensions:", {
      width: imgRect.width,
      height: imgRect.height,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    });

    // Wait for valid dimensions
    if (imgRect.width === 0 || imgRect.height === 0) {
      console.log("Invalid image dimensions, retrying in 100ms");
      setTimeout(() => generateRandomDots(), 100);
      return;
    }

    // Calculate the scale factor between displayed and natural image size
    const scaleX = canvas.width / imgRect.width;
    const scaleY = canvas.height / imgRect.height;

    // Create a grid to track occupied areas
    const gridSize = 50; // Size of each grid cell in pixels
    const gridWidth = Math.ceil(imgRect.width / gridSize);
    const gridHeight = Math.ceil(imgRect.height / gridSize);
    const minDistance = 40; // Minimum distance between dots in pixels

    // Ensure grid dimensions are valid
    if (gridWidth <= 0 || gridHeight <= 0) {
      console.log("Invalid grid dimensions");
      return;
    }

    const grid = Array(gridHeight)
      .fill()
      .map(() => Array(gridWidth).fill(false));

    const newDots = [];
    let attempts = 0;
    const maxAttempts = 200;

    while (newDots.length < colorCount && attempts < maxAttempts) {
      // Generate random position within the image boundaries
      const displayX = Math.random() * imgRect.width;
      const displayY = Math.random() * imgRect.height;

      // Convert to grid coordinates
      const gridX = Math.floor(displayX / gridSize);
      const gridY = Math.floor(displayY / gridSize);

      // Check if grid coordinates are valid
      if (gridX < 0 || gridX >= gridWidth || gridY < 0 || gridY >= gridHeight) {
        attempts++;
        continue;
      }

      // Check if this grid cell and adjacent cells are occupied
      let isSpaceAvailable = true;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const checkX = gridX + dx;
          const checkY = gridY + dy;
          if (
            checkX >= 0 &&
            checkX < gridWidth &&
            checkY >= 0 &&
            checkY < gridHeight &&
            grid[checkY][checkX]
          ) {
            isSpaceAvailable = false;
            break;
          }
        }
        if (!isSpaceAvailable) break;
      }

      if (isSpaceAvailable) {
        // Check minimum distance from all existing dots
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
            // Check for color similarity with existing dots
            const isDuplicate = newDots.some((existingDot) => {
              // Then check for color similarity
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
              // Mark the grid cell as occupied
              grid[gridY][gridX] = true;
              newDots.push({
                x: displayX,
                y: displayY,
                ...color,
              });
            }
          }
        }
      }
      attempts++;
    }

    // If we don't have enough dots and we have at least one dot, try to fill remaining spots
    if (newDots.length < colorCount && newDots.length > 0) {
      const remainingCount = colorCount - newDots.length;
      for (let i = 0; i < remainingCount; i++) {
        const baseIndex = i % newDots.length;
        const baseDot = newDots[baseIndex];

        // Try to find a valid position that maintains minimum distance
        let validPosition = false;
        let tryCount = 0;
        let x, y;

        while (!validPosition && tryCount < 20) {
          // Add a dot with an offset from an existing one
          const offsetX = (Math.random() - 0.5) * gridSize * 3;
          const offsetY = (Math.random() - 0.5) * gridSize * 3;

          x = Math.max(0, Math.min(imgRect.width, baseDot.x + offsetX));
          y = Math.max(0, Math.min(imgRect.height, baseDot.y + offsetY));

          // Check distance from all existing dots
          const isTooClose = newDots.some((existingDot) => {
            const dx = existingDot.x - x;
            const dy = existingDot.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < minDistance;
          });

          if (!isTooClose) {
            validPosition = true;
          }
          tryCount++;
        }

        if (validPosition) {
          newDots.push({
            x,
            y,
            ...baseDot, // Use the same color as the base dot
          });
        }
      }
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

  const onDrop = useCallback(
    (acceptedFiles) => {
      console.log("File drop detected", acceptedFiles);
      const file = acceptedFiles[0];
      if (file) {
        console.log("Processing file:", file.name);
        setIsLoading(true);
        setDots([]);

        const reader = new FileReader();
        reader.onload = () => {
          console.log("File read complete");
          // Update the image state first
          setImage(reader.result);

          // Let React render cycle complete before proceeding
          setTimeout(() => {
            if (imageRef.current) {
              // Wait for the image to be fully loaded
              const checkImage = () => {
                if (imageRef.current.complete) {
                  console.log("Image fully loaded, proceeding with processing");
                  handleImageLoad();
                } else {
                  console.log("Image not loaded yet, waiting...");
                  setTimeout(checkImage, 100);
                }
              };
              checkImage();
            }
          }, 100);
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          setIsLoading(false);
        };

        reader.readAsDataURL(file);
      }
    },
    [handleImageLoad]
  );

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

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-6 md:space-y-8">
      <h1 className="clay-card text-3xl md:text-4xl font-bold text-center p-4 md:p-6 rounded-xl mb-6 md:mb-8">
        ColorLens 🔍
      </h1>

      {/* Mobile Tab Buttons */}
      <div className="lg:hidden clay-card rounded-xl p-2 grid grid-cols-2 gap-2">
        <button
          onClick={() => setActiveTab("picker")}
          className={`clay-button px-4 py-2 rounded-lg flex items-center justify-center space-x-2 ${
            activeTab === "picker" ? "bg-gray-800" : ""
          }`}
        >
          <SwatchIcon className="h-5 w-5" />
          <span>Color Picker</span>
        </button>
        <button
          onClick={() => setActiveTab("generator")}
          className={`clay-button px-4 py-2 rounded-lg flex items-center justify-center space-x-2 ${
            activeTab === "generator" ? "bg-gray-800" : ""
          }`}
        >
          <PhotoIcon className="h-5 w-5" />
          <span>Palette Generator</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left Section - Color Picker */}
        <div
          className={`lg:col-span-4 clay-card p-4 md:p-6 rounded-xl space-y-4 md:space-y-6 ${
            activeTab === "picker" ? "block" : "hidden lg:block"
          }`}
        >
          <div className="flex items-center space-x-2 mb-4">
            <SwatchIcon className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Color Picker</h2>
          </div>

          <div className="space-y-4">
            <div className="clay-card p-4 rounded-lg">
              <label className="block text-sm font-medium mb-2">
                Select Color
              </label>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full h-12 cursor-pointer clay-input rounded-md"
              />
            </div>

            <div className="clay-card p-4 rounded-lg">
              <label className="block text-sm font-medium mb-2">
                Color Values
              </label>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>HEX:</span>
                  <button
                    onClick={() => handleCopy(selectedColor)}
                    className="clay-input px-3 py-1 rounded-md hover:text-indigo-400 transition-colors font-mono"
                    title="Click to copy HEX"
                  >
                    {selectedColor}
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span>RGB:</span>
                  <button
                    onClick={() => {
                      const rgbValue = `rgb(${parseInt(
                        selectedColor.slice(1, 3),
                        16
                      )}, ${parseInt(
                        selectedColor.slice(3, 5),
                        16
                      )}, ${parseInt(selectedColor.slice(5, 7), 16)})`;
                      handleCopy(rgbValue);
                    }}
                    className="clay-input px-3 py-1 rounded-md hover:text-indigo-400 transition-colors font-mono"
                    title="Click to copy RGB"
                  >
                    {selectedColor &&
                      `rgb(${parseInt(
                        selectedColor.slice(1, 3),
                        16
                      )}, ${parseInt(
                        selectedColor.slice(3, 5),
                        16
                      )}, ${parseInt(selectedColor.slice(5, 7), 16)})`}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Apply Colors */}
            <div className="clay-card p-4 rounded-lg">
              <label className="block text-sm font-medium mb-2">
                Quick Apply
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { color: "#FF0000", name: "Red" },
                  { color: "#FFA500", name: "Orange" },
                  { color: "#FFD700", name: "Yellow" },
                  { color: "#008000", name: "Green" },
                  { color: "#0000FF", name: "Blue" },
                  { color: "#FFFFFF", name: "White" },
                  { color: "#000000", name: "Black" },
                  { color: "#808080", name: "Gray" },
                  { color: "#800080", name: "Purple" },
                  { color: "#C0C0C0", name: "Silver" },
                ].map((colorObj, index) => (
                  <button
                    key={index}
                    className="clay-card aspect-square rounded-md hover:scale-105 transition-transform relative group"
                    style={{ backgroundColor: colorObj.color }}
                    onClick={() => setSelectedColor(colorObj.color)}
                    title={colorObj.name}
                  >
                    <span className="sr-only">{colorObj.name}</span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black bg-opacity-50 px-2 py-1 rounded text-xs text-white">
                        {colorObj.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                if (!savedColors.includes(selectedColor)) {
                  setSavedColors([...savedColors, selectedColor]);
                }
              }}
              className="clay-button w-full py-2 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-all"
            >
              Save Color
            </button>

            <div className="clay-card p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">
                  Saved Colors
                </label>
                {savedColors.length > 0 && (
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to clear all saved colors?"
                        )
                      ) {
                        setSavedColors([]);
                        setSelectedGradientColors([]);
                      }
                    }}
                    className="clay-button px-2 py-1 rounded text-xs hover:bg-red-500 hover:bg-opacity-20 transition-colors"
                    title="Clear all saved colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="grid grid-cols-6 gap-2">
                {savedColors.length === 0 ? (
                  <div className="col-span-6 text-center text-sm text-gray-500 py-4">
                    Saved colors will appear here
                  </div>
                ) : (
                  savedColors.map((color, index) => (
                    <div
                      key={index}
                      className={`clay-card aspect-square rounded-md cursor-pointer transition-all relative ${
                        selectedGradientColors.includes(color)
                          ? "ring-2 ring-indigo-500 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        if (selectedGradientColors.includes(color)) {
                          setSelectedGradientColors(
                            selectedGradientColors.filter((c) => c !== color)
                          );
                        } else {
                          setSelectedGradientColors([
                            ...selectedGradientColors,
                            color,
                          ]);
                        }
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        if (window.confirm(`Delete color ${color}?`)) {
                          setSavedColors(
                            savedColors.filter((_, i) => i !== index)
                          );
                          setSelectedGradientColors(
                            selectedGradientColors.filter((c) => c !== color)
                          );
                        }
                      }}
                      onDoubleClick={() => {
                        setSelectedColor(color);
                        // Show a brief notification
                        setCopiedText("Color loaded to picker");
                        setShowCopiedNotification(true);
                        if (notificationTimeout.current) {
                          clearTimeout(notificationTimeout.current);
                        }
                        notificationTimeout.current = setTimeout(() => {
                          setShowCopiedNotification(false);
                        }, 2000);
                      }}
                      title="Click to add/remove from gradient, double-click to load in picker, right-click to delete"
                    >
                      {selectedGradientColors.includes(color) && (
                        <div
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white clay-card"
                          style={{
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          }}
                        >
                          {selectedGradientColors.indexOf(color) + 1}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Gradient Section */}
            {savedColors.length >= 2 && (
              <div className="clay-card p-4 rounded-lg space-y-4">
                <label className="block text-sm font-medium mb-2">
                  Create Gradient
                </label>
                <div className="space-y-4">
                  {selectedGradientColors.length >= 2 ? (
                    <>
                      <div className="clay-card p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-sm font-medium">
                            Fade Length:
                          </label>
                          <select
                            value={fadeLength}
                            onChange={(e) =>
                              setFadeLength(Number(e.target.value))
                            }
                            className="clay-input px-3 py-2 rounded-lg text-sm"
                          >
                            <option value={25}>25%</option>
                            <option value={50}>50%</option>
                            <option value={75}>75%</option>
                            <option value={100}>100%</option>
                          </select>
                        </div>
                        <div
                          ref={gradientRef}
                          className="relative h-24 rounded-lg group"
                          style={{
                            background: `linear-gradient(to right, ${selectedGradientColors
                              .map((color, i) => {
                                if (selectedGradientColors.length === 2) {
                                  const midPoint = gradientStops[0] || 50;
                                  const halfFade = fadeLength / 2;
                                  if (i === 0) {
                                    const fadeStart = Math.max(
                                      0,
                                      midPoint - halfFade
                                    );
                                    return `${color} 0%, ${color} ${fadeStart}%`;
                                  } else {
                                    const fadeEnd = Math.min(
                                      100,
                                      midPoint + halfFade
                                    );
                                    return `${color} ${midPoint}%, ${color} ${fadeEnd}%, ${color} 100%`;
                                  }
                                }

                                // For more than two colors
                                if (i === 0) return `${color} 0%`;
                                const stopPosition =
                                  gradientStops[i - 1] ||
                                  (i * 100) /
                                    (selectedGradientColors.length - 1);
                                return `${color} ${stopPosition}%`;
                              })
                              .join(", ")})`,
                          }}
                        >
                          {/* Gradient Stop Dividers */}
                          {selectedGradientColors.length >= 2 &&
                            selectedGradientColors
                              .slice(0, -1)
                              .map((_, index) => {
                                const position =
                                  gradientStops[index] ||
                                  ((index + 0.5) * 100) /
                                    (selectedGradientColors.length - 1);

                                return (
                                  <div
                                    key={index}
                                    className="absolute top-0 bottom-0 w-1 bg-white bg-opacity-0 group-hover:bg-opacity-50 cursor-ew-resize transition-opacity"
                                    style={{
                                      left: `${position}%`,
                                      transform: "translateX(-50%)",
                                      touchAction: "none",
                                    }}
                                    onMouseDown={(e) =>
                                      handleGradientStopDragStart(e, index)
                                    }
                                    onTouchStart={(e) =>
                                      handleGradientStopDragStart(e, index)
                                    }
                                    onTouchMove={(e) => e.preventDefault()}
                                  >
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                );
                              })}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs font-mono">
                          {selectedGradientColors.map((color, index) => (
                            <span
                              key={index}
                              className="clay-button px-2 py-1 rounded flex items-center gap-1"
                              onClick={() => {
                                setSelectedGradientColors(
                                  selectedGradientColors.filter(
                                    (_, i) => i !== index
                                  )
                                );
                              }}
                            >
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const gradientCSS = `background: linear-gradient(to right, ${selectedGradientColors.join(
                            ", "
                          )});`;
                          handleCopy(gradientCSS);
                        }}
                        className="clay-button w-full py-2 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-all"
                      >
                        Copy CSS
                      </button>
                    </>
                  ) : (
                    <div className="text-center text-sm opacity-75">
                      Select at least 2 colors from above to create a gradient
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Palette Generator */}
        <div
          className={`lg:col-span-8 clay-card p-4 md:p-6 rounded-xl ${
            activeTab === "generator" ? "block" : "hidden lg:block"
          }`}
        >
          <div className="flex items-center space-x-2 mb-4">
            <PhotoIcon className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Palette Generator</h2>
          </div>

          {/* Existing palette generator content */}
          <div className="space-y-6">
            {!image && (
              <div
                {...getRootProps()}
                className="clay-card p-8 rounded-xl text-center cursor-pointer"
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-4">
                  <ArrowUpTrayIcon className="h-12 w-12" />
                  <p className="text-lg">
                    Drop an image here or click to select
                  </p>
                </div>
              </div>
            )}

            {image && (
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl z-50">
                    <div className="clay-card p-4 rounded-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                  </div>
                )}
                <div
                  ref={containerRef}
                  className="relative clay-card p-2 md:p-4 rounded-xl flex justify-center w-full"
                  style={{ maxWidth: "100%" }}
                  onMouseMove={handleMouseMove}
                  onTouchMove={handleMouseMove}
                >
                  <div className="relative inline-block">
                    <img
                      ref={imageRef}
                      src={image}
                      alt="Uploaded"
                      className="rounded-lg"
                      onLoad={() => {
                        console.log("Image onLoad event fired");
                        handleImageLoad();
                      }}
                      style={{
                        opacity: isDragging ? 0.7 : 1,
                        maxHeight: "500px",
                        width: "auto",
                        height: "auto",
                        touchAction: "none",
                      }}
                    />
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                    {dots &&
                      dots.map(
                        (dot, index) =>
                          dot && (
                            <div
                              key={index}
                              className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full cursor-move clay-card flex items-center justify-center touch-none"
                              style={{
                                left: `${dot.x}px`,
                                top: `${dot.y}px`,
                                backgroundColor: dot.rgb || "#000000",
                                transform: `scale(${
                                  hoveredDot === index || draggedDot === index
                                    ? 1.5
                                    : 1
                                })`,
                                zIndex:
                                  hoveredDot === index || draggedDot === index
                                    ? 10
                                    : 1,
                                cursor:
                                  isDragging && draggedDot === index
                                    ? "grabbing"
                                    : "grab",
                                touchAction: "none",
                                boxShadow:
                                  hoveredDot === index || draggedDot === index
                                    ? "0 0 12px rgba(0,0,0,0.5), 0 0 2px rgba(255,255,255,0.2)"
                                    : "0 0 8px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.1)",
                                border: "1px solid rgba(255,255,255,0.1)",
                              }}
                              onMouseDown={(e) => handleMouseDown(e, index)}
                              onTouchStart={(e) => handleTouchStart(e, index)}
                              onMouseEnter={() => setHoveredDot(index)}
                              onMouseLeave={() => setHoveredDot(null)}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <span
                                className="text-sm font-bold select-none"
                                style={{
                                  color: getContrastColor(dot.hex || "#000000"),
                                  textShadow: "0px 0px 2px rgba(0,0,0,0.5)",
                                  pointerEvents: "none",
                                }}
                              >
                                {index + 1}
                              </span>
                            </div>
                          )
                      )}
                  </div>
                </div>

                <div className="flex justify-center mt-4 mb-4">
                  <div className="clay-card p-4 rounded-xl w-64">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Number of Colors:
                      </label>
                      <select
                        value={colorCount}
                        onChange={(e) => {
                          setColorCount(Number(e.target.value));
                          generateRandomDots();
                        }}
                        className="clay-input px-3 py-2 rounded-lg text-sm"
                      >
                        {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} Colors
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="clay-card p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium">
                      Generated Palette
                    </label>
                    <div className="flex gap-2">
                      <div
                        {...getRootProps()}
                        className="clay-button p-2 lg:px-4 lg:py-2 rounded-lg flex items-center justify-center lg:justify-start"
                      >
                        <input {...getInputProps()} />
                        <ArrowUpTrayIcon className="h-5 w-5" />
                        <span className="hidden lg:inline lg:ml-2">
                          Import New Image
                        </span>
                      </div>
                      <button
                        onClick={generateRandomDots}
                        className="clay-button p-2 lg:px-4 lg:py-2 rounded-lg flex items-center justify-center lg:justify-start"
                      >
                        <ArrowPathIcon className="h-5 w-5" />
                        <span className="hidden lg:inline lg:ml-2">
                          Rerandomize Palette
                        </span>
                      </button>
                      <div className="relative" ref={downloadMenuRef}>
                        <button
                          onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                          className="clay-button p-2 lg:px-4 lg:py-2 rounded-lg flex items-center justify-center lg:justify-start"
                        >
                          <DocumentArrowDownIcon className="h-5 w-5" />
                          <span className="hidden lg:inline lg:ml-2">
                            Download as
                          </span>
                          <ChevronDownIcon className="h-4 w-4 hidden lg:block lg:ml-2" />
                        </button>
                        {showDownloadMenu && (
                          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg clay-card ring-1 ring-black ring-opacity-5 z-50">
                            <div className="py-1" role="menu">
                              <button
                                onClick={() => {
                                  setShowDownloadMenu(false);
                                  downloadPNG();
                                }}
                                className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-800"
                                role="menuitem"
                              >
                                PNG
                              </button>
                              <button
                                onClick={() => {
                                  setShowDownloadMenu(false);
                                  downloadJPG();
                                }}
                                className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-800"
                                role="menuitem"
                              >
                                JPEG
                              </button>
                              <button
                                onClick={() => {
                                  setShowDownloadMenu(false);
                                  downloadJSON();
                                }}
                                className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-800"
                                role="menuitem"
                              >
                                JSON
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {dots &&
                      dots.map(
                        (dot, index) =>
                          dot && (
                            <div
                              key={index}
                              className={`clay-card p-4 rounded-lg space-y-3 transition-transform duration-200 ${
                                hoveredDot === index
                                  ? "scale-105 ring-2 ring-indigo-500"
                                  : ""
                              }`}
                              onMouseEnter={() => setHoveredDot(index)}
                              onMouseLeave={() => setHoveredDot(null)}
                            >
                              <div className="relative">
                                <div
                                  className="w-full aspect-square rounded-lg shadow-lg"
                                  style={{
                                    backgroundColor: dot.hex || "#000000",
                                  }}
                                />
                                <div
                                  className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center clay-card border border-gray-700"
                                  style={{
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                  }}
                                >
                                  <span className="text-sm font-bold text-gray-200">
                                    {index + 1}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2 pt-1">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!isDragging) {
                                      handleCopy(dot.hex);
                                    }
                                  }}
                                  className="w-full text-sm font-mono hover:text-indigo-400 transition-colors text-center break-all"
                                  title="Click to copy HEX"
                                >
                                  {dot.hex || "#000000"}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!isDragging) {
                                      handleCopy(dot.rgb);
                                    }
                                  }}
                                  className="w-full text-xs font-mono hover:text-indigo-400 transition-colors text-center opacity-75 break-all"
                                  title="Click to copy RGB"
                                >
                                  {dot.rgb || "rgb(0,0,0)"}
                                </button>
                              </div>
                            </div>
                          )
                      )}
                  </div>

                  {/* Hidden element for downloads */}
                  <div
                    id="downloadable-palette"
                    style={{
                      position: "fixed",
                      left: "-9999px",
                      background: "#1a1b1e",
                      padding: "40px",
                      width: "800px",
                      color: "#ffffff",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        marginBottom: "24px",
                      }}
                    >
                      ColorLens Palette
                    </h2>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                      }}
                    >
                      {dots &&
                        dots.map(
                          (dot, index) =>
                            dot && (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "32px",
                                  height: "80px",
                                }}
                              >
                                <div
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    backgroundColor: dot.hex || "#000000",
                                    borderRadius: "8px",
                                  }}
                                />
                                <div>
                                  <div
                                    style={{
                                      fontSize: "24px",
                                      fontFamily: "monospace",
                                    }}
                                  >
                                    {dot.hex || "#000000"}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "18px",
                                      fontFamily: "monospace",
                                      opacity: "0.75",
                                    }}
                                  >
                                    {dot.rgb || "rgb(0,0,0)"}
                                  </div>
                                </div>
                              </div>
                            )
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="clay-card mt-8 p-4 rounded-xl text-center">
        <p
          className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-wave font-medium text-lg md:text-2xl"
          style={{ backgroundSize: "200% 100%" }}
        >
          ColorLens mobile app coming soon!
        </p>
      </div>

      {/* Notification */}
      <div
        className={`fixed bottom-4 right-4 clay-card px-4 py-3 rounded-lg flex items-center space-x-2 transition-opacity duration-200 ${
          showCopiedNotification
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <CheckCircleIcon className="h-5 w-5 text-green-500" />
        <span>Copied {copiedText}</span>
      </div>
    </div>
  );
}

export default App;
