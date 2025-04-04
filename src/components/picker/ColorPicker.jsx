import { useState, useRef, useEffect } from "react";
import {
  ClipboardIcon,
  PlusIcon,
  TrashIcon,
  CodeBracketIcon,
  ChevronDownIcon,
  SwatchIcon as ColorPickerIcon,
  PencilIcon,
  TagIcon,
  BookmarkIcon,
  XMarkIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import {
  getContrastColor,
  hexToRGB,
  hexToHSL,
  rgbToHex,
  hslToHex,
} from "../../utils/colorUtils";
import { ConfirmationModal } from "../common/ConfirmationModal";

const ColorLabel = ({ color, children }) => (
  <span
    className="text-sm font-medium"
    style={{ color: getContrastColor(color) }}
  >
    {children}
  </span>
);

export function ColorPicker({
  colorPickerValue,
  setColorPickerValue,
  savedColors,
  setSavedColors,
}) {
  const [savedColorItems, setSavedColorItems] = useState(
    savedColors.map((color) =>
      typeof color === "string"
        ? { id: crypto.randomUUID(), color, label: "" }
        : color
    )
  );

  const [draggedItem, setDraggedItem] = useState(null);
  const [editingColorId, setEditingColorId] = useState(null);
  const [colorLabelInput, setColorLabelInput] = useState("");
  const labelInputRef = useRef(null);

  const [gradientColors, setGradientColors] = useState([
    { color: savedColorItems[0]?.color || "#ffffff", position: 0 },
    { color: savedColorItems[1]?.color || "#000000", position: 100 },
  ]);
  const [gradientDirection, setGradientDirection] = useState("to right");
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [colorModel, setColorModel] = useState("HEX");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState("colors"); // "colors" or "gradients"
  const [savedGradients, setSavedGradients] = useState([]);
  const [gradientSectionExpanded, setGradientSectionExpanded] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editingGradientId, setEditingGradientId] = useState(null);
  const [gradientLabelInput, setGradientLabelInput] = useState("");
  const gradientLabelInputRef = useRef(null);
  const formatDropdownRef = useRef(null);

  // Add this state to track the input value separately
  const [colorInputValue, setColorInputValue] = useState("");

  // Add these state variables with the other useState declarations
  const [gradientToDelete, setGradientToDelete] = useState(null);
  const [showDeleteGradientConfirmation, setShowDeleteGradientConfirmation] =
    useState(false);
  const [colorToDelete, setColorToDelete] = useState(null);
  const [showDeleteColorConfirmation, setShowDeleteColorConfirmation] =
    useState(false);

  // Update this useEffect to set the input value when the color model changes
  useEffect(() => {
    if (colorModel === "HEX") {
      setColorInputValue(colorPickerValue.toUpperCase());
    } else if (colorModel === "RGB") {
      setColorInputValue(getRGBString(colorPickerValue));
    } else {
      setColorInputValue(getHSLString(colorPickerValue));
    }
  }, [colorModel, colorPickerValue]);

  // Update the useEffect to initialize mobileSidebarOpen state correctly
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 1024; // lg breakpoint in Tailwind
      setIsMobile(isMobileDevice);
      // We're no longer setting mobileSidebarOpen here, since we want it to start closed
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Add this useEffect to handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        formatDropdownRef.current &&
        !formatDropdownRef.current.contains(event.target)
      ) {
        setIsModelDropdownOpen(false);
      }
    }

    // Add event listener when dropdown is open
    if (isModelDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModelDropdownOpen]);

  // Load saved colors from localStorage on initial render
  useEffect(() => {
    const storedColors = localStorage.getItem("savedColors");
    if (storedColors) {
      const parsedColors = JSON.parse(storedColors);
      setSavedColorItems(parsedColors);
      setSavedColors(parsedColors); // Update parent state as well
    }
  }, []);

  // Save colors to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("savedColors", JSON.stringify(savedColorItems));
  }, [savedColorItems]);

  // Load saved gradients from localStorage on initial render
  useEffect(() => {
    const storedGradients = localStorage.getItem("savedGradients");
    if (storedGradients) {
      setSavedGradients(JSON.parse(storedGradients));
    }
  }, []);

  // Save gradients to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("savedGradients", JSON.stringify(savedGradients));
  }, [savedGradients]);

  const commonColors = [
    { name: "Red", value: "#FF0000" },
    { name: "Green", value: "#00FF00" },
    { name: "Blue", value: "#0000FF" },
    { name: "Yellow", value: "#FFFF00" },
    { name: "Magenta", value: "#FF00FF" },
    { name: "Cyan", value: "#00FFFF" },
    { name: "White", value: "#FFFFFF" },
    { name: "Black", value: "#000000" },
    { name: "Orange", value: "#FFA500" },
    { name: "Purple", value: "#800080" },
    { name: "Pink", value: "#FFC0CB" },
    { name: "Brown", value: "#8B4513" },
    { name: "Gray", value: "#808080" },
    { name: "Teal", value: "#008080" },
    { name: "Navy", value: "#000080" },
    { name: "Lime", value: "#32CD32" },
  ];

  const updateSavedColors = (newSavedColorItems) => {
    setSavedColorItems(newSavedColorItems);
    setSavedColors(newSavedColorItems.map((item) => item.color));
  };

  const handleSaveColor = (color) => {
    if (!savedColorItems.some((item) => item.color === color)) {
      updateSavedColors([
        ...savedColorItems,
        { id: crypto.randomUUID(), color, label: "" },
      ]);
    }
  };

  const handleRemoveColor = (colorId) => {
    updateSavedColors(savedColorItems.filter((item) => item.id !== colorId));
  };

  const handleAddGradientColor = () => {
    if (gradientColors.length >= 5) return;

    // Calculate position for new color stop
    const newPosition =
      gradientColors.length === 2
        ? 50
        : gradientColors.length === 3
        ? 66.67
        : 75;

    setGradientColors([
      ...gradientColors.slice(0, -1),
      { color: colorPickerValue, position: newPosition },
      gradientColors[gradientColors.length - 1],
    ]);
  };

  const handleRemoveGradientColor = (index) => {
    if (gradientColors.length <= 2) return;
    setGradientColors(gradientColors.filter((_, i) => i !== index));
  };

  const handleGradientColorChange = (index, newColor) => {
    setGradientColors(
      gradientColors.map((stop, i) =>
        i === index ? { ...stop, color: newColor } : stop
      )
    );
  };

  const handlePositionChange = (index, newPosition) => {
    // Create a copy of the gradient colors
    const updatedColors = [...gradientColors];

    // Find the positions of adjacent stops
    const positions = gradientColors.map((stop) => stop.position);

    // Determine minimum allowed position (at least 1% away from previous stop)
    const minPosition = index > 0 ? positions[index - 1] + 1 : 0;

    // Determine maximum allowed position (at least 1% away from next stop)
    const maxPosition =
      index < positions.length - 1 ? positions[index + 1] - 1 : 100;

    // Clamp the new position within allowed range
    const clampedPosition = Math.max(
      minPosition,
      Math.min(maxPosition, newPosition)
    );

    // Update the position
    updatedColors[index] = {
      ...updatedColors[index],
      position: clampedPosition,
    };

    setGradientColors(updatedColors);
  };

  const gradientDirections = [
    { name: "Horizontal →", value: "to right" },
    { name: "Horizontal ←", value: "to left" },
    { name: "Vertical ↓", value: "to bottom" },
    { name: "Vertical ↑", value: "to top" },
    { name: "Diagonal ↘", value: "to bottom right" },
    { name: "Diagonal ↙", value: "to bottom left" },
    { name: "Diagonal ↗", value: "to top right" },
    { name: "Diagonal ↖", value: "to top left" },
  ];

  const gradientStyle = {
    background: `linear-gradient(${gradientDirection}, ${gradientColors
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ")})`,
  };

  const handleCopy = (text, format) => {
    navigator.clipboard.writeText(text);
    setCopiedText(format);
    setShowCopiedNotification(true);
    setTimeout(() => setShowCopiedNotification(false), 2000);
  };

  const getRGBString = (hex) => {
    const { r, g, b } = hexToRGB(hex);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getHSLString = (hex) => {
    const { h, s, l } = hexToHSL(hex);
    return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
  };

  const getCSSVariables = (hex) => {
    const { r, g, b } = hexToRGB(hex);
    const { h, s, l } = hexToHSL(hex);
    return `--color: ${hex};
--color-rgb: ${r}, ${g}, ${b};
--color-hsl: ${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%;`;
  };

  const getCurrentColorValue = () => {
    switch (colorModel) {
      case "RGB":
        return getRGBString(colorPickerValue);
      case "HSL":
        return getHSLString(colorPickerValue);
      default:
        return colorPickerValue.toUpperCase();
    }
  };

  const handleSaveGradient = () => {
    const newGradient = {
      id: crypto.randomUUID(),
      colors: [...gradientColors],
      direction: gradientDirection,
      label: "", // Add empty label by default
    };
    setSavedGradients([...savedGradients, newGradient]);
  };

  const handleRemoveGradient = (gradientId) => {
    setSavedGradients(
      savedGradients.filter((gradient) => gradient.id !== gradientId)
    );
  };

  const handleDragStart = (e, colorItem) => {
    setDraggedItem(colorItem);
    e.dataTransfer.effectAllowed = "move";
    // This makes the drag image transparent in most browsers
    const dragImage = new Image();
    dragImage.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  const handleDragOver = (e, targetColorItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetColorItem.id) return;

    // Reorder the colors
    const newColors = [...savedColorItems];
    const draggedIndex = newColors.findIndex(
      (item) => item.id === draggedItem.id
    );
    const targetIndex = newColors.findIndex(
      (item) => item.id === targetColorItem.id
    );

    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Remove the dragged item
      const [removed] = newColors.splice(draggedIndex, 1);
      // Insert it at the target position
      newColors.splice(targetIndex, 0, removed);
      updateSavedColors(newColors);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleEditLabel = (colorItem) => {
    setEditingColorId(colorItem.id);
    setColorLabelInput(colorItem.label);
    // Focus the input after it renders
    setTimeout(() => {
      if (labelInputRef.current) {
        labelInputRef.current.focus();
      }
    }, 10);
  };

  const handleSaveLabel = () => {
    if (editingColorId) {
      updateSavedColors(
        savedColorItems.map((item) =>
          item.id === editingColorId
            ? { ...item, label: colorLabelInput.trim() }
            : item
        )
      );
      setEditingColorId(null);
      setColorLabelInput("");
    }
  };

  const handleSaveGradientLabel = () => {
    if (editingGradientId) {
      setSavedGradients(
        savedGradients.map((gradient) =>
          gradient.id === editingGradientId
            ? { ...gradient, label: gradientLabelInput.trim() }
            : gradient
        )
      );
      setEditingGradientId(null);
      setGradientLabelInput("");
    }
  };

  // Update the handleButtonClick function to use a more reliable approach
  const handleButtonClick = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    performAction(action);
  };

  // Create a separate handler for touch events
  const handleTouchEnd = (e, action) => {
    e.preventDefault();
    e.stopPropagation();

    performAction(action);
  };

  // Create a shared function that performs the actual action
  const performAction = (action) => {
    switch (action) {
      case "copy":
        handleCopy(getCurrentColorValue(), colorModel);
        break;
      case "css":
        handleCopy(getCSSVariables(colorPickerValue), "CSS");
        break;
      case "save":
        const newColorItem = {
          id: crypto.randomUUID(),
          color: colorPickerValue,
          label: "",
        };
        setSavedColorItems([...savedColorItems, newColorItem]);
        setCopiedText("Color saved");
        setShowCopiedNotification(true);
        setTimeout(() => setShowCopiedNotification(false), 2000);
        break;
    }
  };

  const handleColorHover = (color, index) => {
    setHoveredColor(`${color}-${index}`);

    // Adjust the expansion ratio based on the number of colors
    const baseWidth = 100 / gradientColors.length;

    // Use a smaller expansion ratio when there are more colors
    const expansionRatio = gradientColors.length > 5 ? 1.5 : 2.5;
    const expandedWidth = baseWidth * expansionRatio;

    // Ensure the remaining width is distributed properly
    const remainingWidth = (100 - expandedWidth) / (gradientColors.length - 1);

    const newWidths = {};
    gradientColors.forEach((c, i) => {
      const key = `${c.color}-${i}`;
      newWidths[key] =
        `${c.color}-${i}` === key ? expandedWidth : remainingWidth;
    });

    setColorWidths(newWidths);
  };

  return (
    <div className="space-y-4">
      {/* Main container */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left column - Color picker tools */}
        <div className="flex-1 space-y-4">
          {/* Color Picker Section */}
          <div className="clay-card p-4 sm:p-6 rounded-xl">
            <div className="space-y-4">
              {/* Header with mobile saved items button */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Color Picker</h3>
                {isMobile && (
                  <button
                    onClick={() => setMobileSidebarOpen(true)}
                    className="clay-button flex items-center justify-center p-2 rounded-lg"
                    title="Saved Items"
                  >
                    <BookmarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Color picker layout - split into columns on larger screens */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Left side: Color Picker */}
                <div className="w-full md:w-1/3">
                  {/* Color Input Section */}
                  <div className="mb-6">
                    <div className="flex flex-col gap-4">
                      {/* Color Preview Box - Now also a color picker button */}
                      <div
                        className="w-full aspect-[18/9] rounded-xl shadow-inner flex items-center justify-center relative cursor-pointer group"
                        style={{ backgroundColor: colorPickerValue }}
                        onClick={() =>
                          document.getElementById("native-color-picker").click()
                        }
                      >
                        <ColorLabel color={colorPickerValue}>
                          {colorPickerValue.toUpperCase()}
                        </ColorLabel>

                        {/* Hidden native color input */}
                        <input
                          id="native-color-picker"
                          type="color"
                          value={colorPickerValue}
                          onChange={(e) => setColorPickerValue(e.target.value)}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        />

                        {/* Color picker icon indicator on hover */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="p-1.5 rounded-full">
                            <ColorPickerIcon
                              className="w-5 h-5"
                              style={{
                                color: getContrastColor(colorPickerValue),
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Color Input and Format Controls */}
                      <div className="flex-1 flex flex-col justify-between">
                        {/* Color Input and Format Selector - Modified for mobile */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex w-full">
                            {/* Color input field - takes 2/3 width on mobile */}
                            <div className="w-2/3 sm:w-full">
                              <label
                                htmlFor="current-color"
                                className="block text-sm font-medium text-gray-400 mb-1"
                              >
                                Color Value
                              </label>
                              <div>
                                <input
                                  id="current-color"
                                  type="text"
                                  value={colorInputValue}
                                  onChange={(e) => {
                                    setColorInputValue(e.target.value);
                                    // Try to parse the input value based on the current color model
                                    const newValue = e.target.value.trim();
                                    if (colorModel === "HEX") {
                                      // Basic validation for hex color
                                      if (
                                        /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(
                                          newValue
                                        )
                                      ) {
                                        const formattedColor =
                                          newValue.startsWith("#")
                                            ? newValue
                                            : `#${newValue}`;
                                        setColorPickerValue(formattedColor);
                                      }
                                    } else if (colorModel === "RGB") {
                                      // Try to parse RGB format
                                      const rgbMatch = newValue.match(
                                        /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i
                                      );
                                      if (rgbMatch) {
                                        const r = parseInt(rgbMatch[1]);
                                        const g = parseInt(rgbMatch[2]);
                                        const b = parseInt(rgbMatch[3]);
                                        if (
                                          r >= 0 &&
                                          r <= 255 &&
                                          g >= 0 &&
                                          g <= 255 &&
                                          b >= 0 &&
                                          b <= 255
                                        ) {
                                          const hexColor = rgbToHex(r, g, b);
                                          setColorPickerValue(hexColor);
                                        }
                                      }
                                    } else if (colorModel === "HSL") {
                                      // Try to parse HSL format
                                      const hslMatch = newValue.match(
                                        /hsl\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/i
                                      );
                                      if (hslMatch) {
                                        const h = parseInt(hslMatch[1]);
                                        const s = parseInt(hslMatch[2]);
                                        const l = parseInt(hslMatch[3]);
                                        if (
                                          h >= 0 &&
                                          h <= 360 &&
                                          s >= 0 &&
                                          s <= 100 &&
                                          l >= 0 &&
                                          l <= 100
                                        ) {
                                          const hexColor = hslToHex(h, s, l);
                                          setColorPickerValue(hexColor);
                                        }
                                      }
                                    }
                                  }}
                                  className="clay-input w-full px-3 py-2 rounded-lg"
                                />

                                {/* Mini tab selector for color format */}
                                <div className="mt-2 relative">
                                  <div className="clay-card inline-flex w-full rounded-lg p-0.5 relative">
                                    {/* Animated indicator - fixed to correctly position over each tab */}
                                    <div
                                      className="absolute bg-gray-700 rounded-md transition-all duration-200 ease-in-out z-0"
                                      style={{
                                        width: "33.33%",
                                        height: "calc(100% - 4px)",
                                        left: "2px",
                                        top: "2px",
                                        transform: `translateX(${
                                          ["HEX", "RGB", "HSL"].indexOf(
                                            colorModel
                                          ) * 100
                                        }%)`,
                                      }}
                                    />

                                    {/* Format tabs */}
                                    {["HEX", "RGB", "HSL"].map(
                                      (model, index) => (
                                        <button
                                          key={model}
                                          className={`flex-1 text-center py-1.5 px-2 text-xs font-medium transition-colors rounded-md relative z-10 ${
                                            colorModel === model
                                              ? "text-white"
                                              : "text-gray-300 hover:text-white"
                                          }`}
                                          onClick={() => {
                                            setColorModel(model);
                                            if (model === "HEX") {
                                              setColorInputValue(
                                                colorPickerValue.toUpperCase()
                                              );
                                            } else if (model === "RGB") {
                                              setColorInputValue(
                                                getRGBString(colorPickerValue)
                                              );
                                            } else {
                                              setColorInputValue(
                                                getHSLString(colorPickerValue)
                                              );
                                            }
                                          }}
                                        >
                                          {model}
                                        </button>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: Color options and actions */}
                <div className="w-full md:w-2/3">
                  {/* Color format selector and actions */}
                  <div className="flex flex-col space-y-4">
                    {/* Copy buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex gap-2 mt-4">
                        {[
                          {
                            action: "copy",
                            label: "Copy",
                            icon: <ClipboardIcon className="w-4 h-4 mr-2" />,
                            color:
                              "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 border-indigo-700",
                          },
                          {
                            action: "css",
                            label: "CSS",
                            icon: <CodeBracketIcon className="w-4 h-4 mr-2" />,
                            color:
                              "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 border-blue-700",
                          },
                          {
                            action: "save",
                            label: "Save",
                            icon: <HeartIcon className="w-4 h-4 mr-2" />,
                            color:
                              "bg-green-600 hover:bg-green-700 active:bg-green-800 border-green-700",
                          },
                        ].map(({ action, label, icon, color }) => (
                          <button
                            key={action}
                            onPointerUp={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              performAction(action);
                            }}
                            className={`clay-button flex items-center justify-center px-3 py-3 rounded-lg flex-1 text-white ${color}`}
                            style={{ touchAction: "none" }}
                          >
                            {icon}
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Common Colors */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1 sm:mb-2">
                        Common Colors
                      </h4>
                      {/* Compute grid class once for readability */}
                      <div
                        className={`grid ${
                          isMobile
                            ? "grid-cols-8 grid-rows-2"
                            : "grid-cols-5 sm:grid-cols-8"
                        } gap-0.5 sm:gap-3`}
                      >
                        {commonColors.map(({ name, value }) => (
                          <button
                            key={value}
                            onPointerUp={() => setColorPickerValue(value)}
                            className="aspect-square rounded-lg flex items-center justify-center shadow-inner relative group"
                            style={{ backgroundColor: value }}
                            title={name}
                          >
                            {/* Color name on hover */}
                            <span
                              className={`opacity-0 group-hover:opacity-100 absolute bottom-0.5 sm:bottom-1 ${
                                isMobile
                                  ? "text-[6px]"
                                  : "text-[8px] sm:text-xs"
                              } font-medium transition-opacity`}
                              style={{ color: getContrastColor(value) }}
                            >
                              {name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gradient Maker - Collapsible on mobile */}
          <div className="clay-card p-4 sm:p-6 rounded-xl">
            {/* Gradient maker content container */}
            <div className="space-y-4">
              {/* Gradient maker header with toggle only on mobile */}
              <div
                className={`flex justify-between items-center ${
                  isMobile ? "cursor-pointer" : ""
                }`}
                onClick={() =>
                  isMobile &&
                  setGradientSectionExpanded(!gradientSectionExpanded)
                }
              >
                <h3 className="text-lg font-medium">Gradient Maker</h3>
                {isMobile && (
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform ${
                      gradientSectionExpanded ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>

              {/* Gradient maker content - always show on desktop, toggle on mobile */}
              {(!isMobile || gradientSectionExpanded) && (
                <div className="space-y-4">
                  {/* Action buttons row */}
                  <div className="flex justify-between items-center">
                    {/* Add Color button on the left */}
                    <div>
                      {gradientColors.length < 5 && (
                        <button
                          onPointerUp={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddGradientColor();
                          }}
                          className="clay-button flex items-center px-3 py-1.5 rounded-lg text-sm"
                          title="Add Color Stop"
                        >
                          <PlusIcon className="w-4 h-4 mr-1" />
                          Add Color
                        </button>
                      )}
                    </div>

                    {/* Save button on the right */}
                    <button
                      onPointerUp={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSaveGradient();
                        setCopiedText("Gradient saved");
                        setShowCopiedNotification(true);
                        setTimeout(
                          () => setShowCopiedNotification(false),
                          2000
                        );
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                      style={{ touchAction: "none" }}
                    >
                      Save
                    </button>
                  </div>

                  {/* Gradient color stops */}
                  <div className="space-y-2 mt-4">
                    <h4 className="text-sm font-medium">Color Stops</h4>
                    <div className="space-y-3">
                      {gradientColors.map((stop, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          {/* Color display and picker */}
                          <div
                            className="w-20 h-10 rounded-md cursor-pointer flex items-center justify-center relative"
                            style={{ backgroundColor: stop.color }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setColorPickerValue(stop.color);
                              // Find and click the native color picker input in this div
                              e.currentTarget
                                .querySelector('input[type="color"]')
                                .click();
                            }}
                          >
                            <span
                              className="text-xs font-mono text-center"
                              style={{ color: getContrastColor(stop.color) }}
                            >
                              {stop.color.toUpperCase().substring(1)}
                            </span>
                            <input
                              type="color"
                              value={stop.color}
                              onChange={(e) =>
                                handleGradientColorChange(index, e.target.value)
                              }
                              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                              // Prevent click propagation to avoid double-clicks
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>

                          {/* Position slider */}
                          <div className="flex-1">
                            <input
                              type="range"
                              min={index === 0 ? 0 : 0}
                              max={100}
                              value={stop.position}
                              onChange={(e) =>
                                handlePositionChange(
                                  index,
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full"
                            />
                          </div>

                          {/* Position value */}
                          <div className="w-8 text-center">
                            <span className="text-xs">{stop.position}%</span>
                          </div>

                          {/* Remove button - only show for middle colors */}
                          {gradientColors.length > 2 &&
                            index !== 0 &&
                            index !== gradientColors.length - 1 && (
                              <button
                                onPointerUp={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRemoveGradientColor(index);
                                }}
                                className="clay-button p-1 rounded-full"
                                title="Remove Color Stop"
                              >
                                <TrashIcon className="w-3 h-3" />
                              </button>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gradient direction selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Direction
                    </label>
                    {/* Direction dropdown */}
                    <div className="relative">
                      <select
                        value={gradientDirection}
                        onChange={(e) => setGradientDirection(e.target.value)}
                        className="clay-input w-full px-3 py-2 rounded-lg appearance-none"
                      >
                        {gradientDirections.map((direction) => (
                          <option key={direction.value} value={direction.value}>
                            {direction.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Gradient preview */}
                    <div
                      className="h-40 rounded-xl shadow-inner transition-all duration-300 mt-4"
                      style={gradientStyle}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Saved Colors/Gradients Sidebar - Right sidebar on mobile */}
        <div
          className={`lg:w-56 clay-card rounded-xl p-4 ${
            isMobile
              ? "fixed top-0 right-0 bottom-0 z-50 w-64 transition-transform duration-300 transform " +
                (mobileSidebarOpen ? "translate-x-0" : "translate-x-full")
              : ""
          }`}
          style={{
            height: isMobile ? "100vh" : "auto",
            overflowY: isMobile ? "auto" : "visible",
          }}
        >
          {/* Close button for mobile sidebar */}
          {isMobile && mobileSidebarOpen && (
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-gray-700 hover:bg-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}

          {/* Sidebar content container */}
          <div
            className={`flex flex-col ${isMobile ? "h-full pt-10" : "h-full"}`}
          >
            {/* Header with Toggle */}
            <div className="sticky top-0 bg-[var(--clay-background)] py-2 z-20 space-y-1">
              {/* Sidebar header with count */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400">
                  Saved Items
                </h3>
                {/* Item count badge */}
                <span className="text-xs bg-gray-800 px-2 py-1 rounded-md">
                  {sidebarView === "colors"
                    ? `${savedColorItems.length}/32`
                    : `${savedGradients.length}/10`}
                </span>
              </div>

              {/* Toggle Buttons */}
              <div className="flex rounded-lg overflow-hidden clay-card">
                {/* Colors tab button */}
                <button
                  onClick={() => setSidebarView("colors")}
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                    sidebarView === "colors"
                      ? "bg-gray-700 text-white"
                      : "hover:bg-gray-600"
                  }`}
                >
                  {savedColorItems.length > 0 ? (
                    <BookmarkIconSolid className="w-3 h-3 text-blue-400" />
                  ) : (
                    <BookmarkIcon className="w-3 h-3" />
                  )}
                  <span>Colors</span>
                </button>
                {/* Gradients tab button */}
                <button
                  onClick={() => setSidebarView("gradients")}
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                    sidebarView === "gradients"
                      ? "bg-gray-700 text-white"
                      : "hover:bg-gray-600"
                  }`}
                >
                  {savedGradients.length > 0 ? (
                    <BookmarkIconSolid className="w-3 h-3 text-purple-400" />
                  ) : (
                    <BookmarkIcon className="w-3 h-3" />
                  )}
                  <span>Gradients</span>
                </button>
              </div>
            </div>

            {/* Colors Grid View */}
            {sidebarView === "colors" && (
              <>
                {savedColorItems.length > 0 ? (
                  <div
                    className="grid grid-cols-3 gap-x-2 overflow-y-auto pr-1 custom-scrollbar pt-1 mt-2"
                    style={{
                      maxHeight: "calc(100vh - 220px)",
                    }}
                  >
                    {/* Individual color items */}
                    {savedColorItems.map((colorItem) => (
                      <div
                        key={colorItem.id}
                        className="relative group aspect-square mb-1"
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, colorItem)}
                        onDragOver={(e) => handleDragOver(e, colorItem)}
                        onDragEnd={handleDragEnd}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setColorPickerValue(colorItem.color);
                        }}
                        style={{
                          opacity: draggedItem?.id === colorItem.id ? 0.5 : 1,
                          cursor: "pointer",
                        }}
                      >
                        {/* Color swatch button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setColorPickerValue(colorItem.color);
                          }}
                          className="w-full h-full rounded-lg shadow-inner transition-shadow duration-200"
                          style={{ backgroundColor: colorItem.color }}
                          title={colorItem.color}
                        />

                        {/* Action buttons */}
                        <div className="absolute items-center justify-center top-1 right-1 flex space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20">
                          {/* Edit label button */}
                          <button
                            onPointerUp={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEditLabel(colorItem);
                            }}
                            className="bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80 transition-colors"
                            title="Edit Label"
                          >
                            <TagIcon className="w-2.5 h-2.5" />
                          </button>
                          {/* Delete button */}
                          <button
                            onPointerUp={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setColorToDelete(colorItem);
                              setShowDeleteColorConfirmation(true);
                            }}
                            className="bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            title="Remove Color"
                          >
                            <TrashIcon className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* Label that changes to hex on hover */}
                        <div
                          className="absolute inset-0 flex items-center justify-center text-[10px] font-medium rounded-lg"
                          style={{
                            color: getContrastColor(colorItem.color),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                          }}
                        >
                          {/* Label text - shown when not hovering */}
                          <span
                            className="group-hover:hidden text-center w-full px-1 absolute"
                            style={{
                              top: "45%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              lineHeight: 1,
                            }}
                          >
                            {colorItem.label || ""}
                          </span>
                          {/* Hex value - shown when hovering */}
                          <span
                            className="hidden group-hover:block text-center w-full px-1 absolute"
                            style={{
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              lineHeight: 1,
                            }}
                          >
                            {colorItem.color.toUpperCase()}
                          </span>
                        </div>

                        {/* Label editing overlay */}
                        {editingColorId === colorItem.id && (
                          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-1 z-30 rounded-lg">
                            {/* Label input container */}
                            <div className="w-full">
                              <input
                                ref={labelInputRef}
                                type="text"
                                value={colorLabelInput}
                                onChange={(e) =>
                                  setColorLabelInput(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveLabel();
                                  if (e.key === "Escape") {
                                    setEditingColorId(null);
                                    setColorLabelInput("");
                                  }
                                }}
                                onBlur={handleSaveLabel}
                                className="w-full px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Add label..."
                                maxLength={20}
                                autoFocus
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center px-4">
                    <p className="text-xs text-gray-500">
                      Save colors for quick access
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Gradients View */}
            {sidebarView === "gradients" && (
              <>
                {savedGradients.length > 0 ? (
                  <div
                    className="grid grid-cols-1 gap-4 overflow-y-auto pr-1 custom-scrollbar pt-1 mt-1 mb-6"
                    style={{
                      maxHeight: "calc(100vh - 220px)",
                    }}
                  >
                    {/* Individual gradient items */}
                    {savedGradients.map((gradient) => (
                      <div key={gradient.id} className="relative group">
                        {/* Gradient button */}
                        <button
                          onPointerUp={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setGradientColors(gradient.colors);
                            setGradientDirection(gradient.direction);
                          }}
                          className="w-full h-20 rounded-lg py-2 shadow-inner transition-shadow duration-200 hover:shadow-lg flex items-center justify-center"
                          style={{
                            background: `linear-gradient(${
                              gradient.direction
                            }, ${gradient.colors
                              .map((stop) => `${stop.color} ${stop.position}%`)
                              .join(", ")})`,
                          }}
                          title="Apply gradient"
                        >
                          {/* Hover overlay with color values */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-70 rounded-lg flex items-center justify-center">
                            {/* Color values container */}
                            <div className="text-white text-xs px-2 py-1 flex flex-wrap justify-center gap-2">
                              {/* Individual color values */}
                              {gradient.colors.map((stop, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-1"
                                >
                                  {/* Color dot */}
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: stop.color }}
                                  ></span>
                                  {/* Color hex value */}
                                  <span>{stop.color.toUpperCase()}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Label in the middle - hide on hover */}
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded bg-black bg-opacity-50 text-white z-10 group-hover:opacity-0 transition-opacity palette-name"
                            style={{ maxWidth: "90%" }}
                          >
                            {gradient.label || "Unnamed"}
                          </span>
                        </button>

                        {/* Edit and delete buttons */}
                        <div className="absolute -top-1 -right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Edit label button */}
                          <button
                            onPointerUp={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setEditingGradientId(gradient.id);
                              setGradientLabelInput(gradient.label || "");
                            }}
                            className="bg-blue-500 text-white rounded-full p-0.5 hover:bg-blue-600 z-20"
                            title="Edit Label"
                          >
                            <PencilIcon className="w-2.5 h-2.5" />
                          </button>

                          {/* Delete button */}
                          <button
                            onPointerUp={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setGradientToDelete(gradient);
                              setShowDeleteGradientConfirmation(true);
                            }}
                            className="bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 z-20"
                            title="Remove Gradient"
                          >
                            <TrashIcon className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* Label editing overlay */}
                        {editingGradientId === gradient.id && (
                          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-1 z-30 rounded-lg">
                            {/* Label input container */}
                            <div className="w-full">
                              <input
                                ref={gradientLabelInputRef}
                                type="text"
                                value={gradientLabelInput}
                                onChange={(e) =>
                                  setGradientLabelInput(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    handleSaveGradientLabel();
                                  if (e.key === "Escape") {
                                    setEditingGradientId(null);
                                    setGradientLabelInput("");
                                  }
                                }}
                                onBlur={handleSaveGradientLabel}
                                className="w-full px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Add label..."
                                maxLength={20}
                                autoFocus
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center px-4">
                    <p className="text-xs text-gray-500">
                      Save gradients for quick access
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Copy Notification */}
      {showCopiedNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Copied {copiedText} format!
        </div>
      )}

      {/* Delete Gradient Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteGradientConfirmation}
        onClose={() => setShowDeleteGradientConfirmation(false)}
        onConfirm={() => {
          if (gradientToDelete) {
            handleRemoveGradient(gradientToDelete.id);
            setCopiedText("Gradient deleted");
            setShowCopiedNotification(true);
            setTimeout(() => setShowCopiedNotification(false), 2000);
          }
        }}
        title="Delete Gradient"
        message="Are you sure you want to delete this gradient? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Delete Color Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteColorConfirmation}
        onClose={() => setShowDeleteColorConfirmation(false)}
        onConfirm={() => {
          if (colorToDelete) {
            // Filter out the color to delete
            const updatedColors = savedColorItems.filter(
              (item) => item.id !== colorToDelete.id
            );
            setSavedColorItems(updatedColors);

            // Update the parent component's state
            setSavedColors(updatedColors);

            // Show notification
            setCopiedText("Color deleted");
            setShowCopiedNotification(true);
            setTimeout(() => setShowCopiedNotification(false), 2000);
          }
        }}
        title="Delete Color"
        message="Are you sure you want to delete this color? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
