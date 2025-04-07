import { useState, useEffect, useRef } from "react";
import { usePalette } from "../../context/PaletteContext";
import {
  ChevronDownIcon,
  EyeSlashIcon,
  EyeIcon,
  LockClosedIcon,
  LockOpenIcon,
  Cog6ToothIcon,
  SwatchIcon,
  PaintBrushIcon,
  DocumentTextIcon,
  ArrowsPointingOutIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  ArrowTopRightOnSquareIcon,
  Squares2X2Icon,
  ArrowPathIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import { DashboardTemplate } from "./templates/DashboardTemplate";
import { LandingTemplate } from "./templates/LandingTemplate";
import { BlogTemplate } from "./templates/BlogTemplate";
import { PortfolioTemplate } from "./templates/PortfolioTemplate";
import { EcommerceTemplate } from "./templates/EcommerceTemplate";
import { PaletteCard } from "../discover/PaletteCard";
import colorLensLogo from "../../assets/colorlensLogo.png";

// Define animation styles for the notification
const notificationAnimation = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-10px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }
  .animate-fade-in-out {
    animation: fadeInOut 2s ease-in-out;
  }
`;

// Sidebar section component for consistent styling
const SidebarSection = ({
  title,
  children,
  icon,
  rightElement,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef(null);

  return (
    <div className="border-b border-gray-700/20 last:border-b-0">
      <div
        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-700/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-400">{icon}</span>}
          {title && (
            <h3 className="text-sm font-medium uppercase tracking-wider text-gray-400">
              {title}
            </h3>
          )}
        </div>
        <div className="flex items-center">
          {rightElement && <div className="mr-2">{rightElement}</div>}
          <ChevronDownIcon
            className={`h-4 w-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
      <div
        ref={contentRef}
        className={`space-y-2 px-3 overflow-hidden transition-all duration-300 ${
          isOpen ? "py-3 max-h-[2000px]" : "max-h-0 py-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

// Sidebar item component
const SidebarItem = ({ label, icon, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-700/50 ${
        active ? "bg-gray-700/50 text-gray-100" : "text-gray-400"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export function UIPlayground() {
  const { generatorPalettes, discoverPalettes } = usePalette();
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("dashboard");
  const [allPalettes, setAllPalettes] = useState([]);
  const [colorMap, setColorMap] = useState({
    primary: "#1e40af", // Primary brand color
    secondary: "#4f46e5", // Secondary brand color
    accent: "#f59e0b", // Accent color
    background: "#ffffff", // Background color
    text: "#111827", // Main text color
    muted: "#6b7280", // Muted text color
    border: "#e5e7eb", // Border color
    success: "#10b981", // Success state
    error: "#ef4444", // Error state
    warning: "#f59e0b", // Warning state
  });
  const [isEditingColors, setIsEditingColors] = useState(false);
  const [templateConfig, setTemplateConfig] = useState({
    showHeader: true,
    showHero: true,
    showFeatures: true,
    showFooter: true,
    showSidebar: true,
  });
  const [layoutOptions, setLayoutOptions] = useState({
    spacing: "normal", // normal, compact, spacious
    typography: "default", // default, modern, classic
    density: "medium", // low, medium, high
    containerWidth: "standard", // narrow, standard, wide, full
    cornerRadius: "medium", // none, small, medium, large, rounded
    shadowDepth: "medium", // flat, subtle, medium, pronounced
    animationSpeed: "medium", // none, slow, medium, fast
    contentAlignment: "left", // left, center, right
    cardStyle: "default", // default, flat, bordered, elevated, glass
    buttonStyle: "default", // default, filled, outlined, text-only
    imageRatio: "16:9", // square, 4:3, 16:9, auto
    gridColumns: "3", // 2, 3, 4, auto-fit
  });
  const templateRef = useRef(null);
  const [exportType, setExportType] = useState("code");
  const [exportFormat, setExportFormat] = useState("css");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportedContent, setExportedContent] = useState("");
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSidebarSection, setActiveSidebarSection] = useState(
    "template-and-colors"
  );
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Combine all palettes from generator and discover
  useEffect(() => {
    const combined = [...generatorPalettes, ...discoverPalettes];
    // Remove duplicates (palettes with the same name and colors)
    const uniquePalettes = combined.filter(
      (palette, index, self) =>
        index ===
        self.findIndex(
          (p) =>
            p.name === palette.name &&
            JSON.stringify(p.colors) === JSON.stringify(palette.colors)
        )
    );
    setAllPalettes(uniquePalettes);
  }, [generatorPalettes, discoverPalettes]);

  // Handle direct color edit
  const handleColorChange = (colorKey, newValue) => {
    setColorMap((prev) => ({
      ...prev,
      [colorKey]: newValue,
    }));
    // Reset selected palette since we're manually editing
    setSelectedPalette(null);
  };

  // Helper function to get the current mode colors
  const getCurrentModeColors = () => {
    const isDarkMode =
      colorMap.background.toLowerCase() === "#0f172a" ||
      colorMap.text.toLowerCase() === "#f8fafc";

    return isDarkMode
      ? {
          background: "#0f172a",
          text: "#f8fafc",
          muted: "#94a3b8",
          border: "#1e293b",
          success: "#34d399",
          error: "#f87171",
          warning: "#fbbf24",
        }
      : {
          background: "#ffffff",
          text: "#111827",
          muted: "#6b7280",
          border: "#e5e7eb",
          success: "#10b981",
          error: "#ef4444",
          warning: "#f59e0b",
        };
  };

  // Helper function to apply theme colors while preserving mode
  const applyThemeColors = (themeColors) => {
    const currentModeColors = getCurrentModeColors();
    setColorMap({
      ...themeColors,
      ...currentModeColors,
    });
    setSelectedPalette(null);
  };

  // Helper function to toggle between light/dark mode
  const toggleColorMode = (isDark) => {
    // Preserve primary, secondary, accent colors
    const preservedColors = {
      primary: colorMap.primary,
      secondary: colorMap.secondary,
      accent: colorMap.accent,
    };

    const modeColors = isDark
      ? {
          background: "#02080D",
          text: "#f8fafc",
          muted: "#94a3b8",
          border: "#1e293b",
          success: "#34d399",
          error: "#f87171",
          warning: "#fbbf24",
        }
      : {
          background: "#ffffff",
          text: "#111827",
          muted: "#6b7280",
          border: "#e5e7eb",
          success: "#10b981",
          error: "#ef4444",
          warning: "#f59e0b",
        };

    setColorMap({
      ...preservedColors,
      ...modeColors,
    });
  };

  // Apply palette to the color map
  const applyPalette = (palette) => {
    if (!palette || !palette.colors || palette.colors.length < 3) return;

    const colors = palette.colors;
    const newColorMap = { ...colorMap };

    // Map palette colors to UI elements based on palette size
    if (colors.length >= 3) {
      newColorMap.primary = colors[0];
      newColorMap.secondary = colors[1];
      newColorMap.accent = colors[2];
    }

    if (colors.length >= 5) {
      newColorMap.background = colors[3];
      newColorMap.text = colors[4];
    }

    if (colors.length >= 6) {
      newColorMap.border = colors[5];
    }

    if (colors.length >= 8) {
      newColorMap.success = colors[6];
      newColorMap.error = colors[7];
    }

    if (colors.length >= 9) {
      newColorMap.warning = colors[8];
    }

    // Determine text color based on background brightness
    const bgColor = newColorMap.background;
    if (bgColor) {
      const r = parseInt(bgColor.slice(1, 3), 16);
      const g = parseInt(bgColor.slice(3, 5), 16);
      const b = parseInt(bgColor.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;

      // If background is dark, use light text; if light, use dark text
      if (brightness < 128) {
        newColorMap.text = "#ffffff";
        newColorMap.muted = "#d1d5db";
      } else {
        newColorMap.text = "#111827";
        newColorMap.muted = "#6b7280";
      }
    }

    setColorMap(newColorMap);
    setSelectedPalette(palette);
  };

  // Update template configuration
  const toggleTemplateSection = (section) => {
    setTemplateConfig((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle layout option change
  const handleLayoutChange = (option, value) => {
    setLayoutOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  // Add this function after the handleLayoutChange function
  const getTemplateSections = () => {
    switch (selectedTemplate) {
      case "dashboard":
        return {
          showHeader: true,
          showSidebar: true,
          showFeatures: true,
          showFooter: true,
        };
      case "landing":
        return {
          showHeader: true,
          showHero: true,
          showFeatures: true,
          showFooter: true,
        };
      case "ecommerce":
        return {
          showHeader: true,
          showHero: true,
          showAnnouncement: true,
          showCategories: true,
          showFeaturedProducts: true,
          showPromotion: true,
          showTrending: true,
          showFooter: true,
        };
      case "portfolio":
        return {
          showHeader: true,
          showHero: true,
          showStats: true,
          showProjects: true,
          showSkills: true,
          showTestimonials: true,
          showCTA: true,
          showFooter: true,
        };
      case "blog":
        return {
          showHeader: true,
          showHero: true,
          showFeatures: true,
          showFooter: true,
        };
      default:
        return {
          showHeader: true,
          showSidebar: true,
          showFeatures: true,
          showFooter: true,
        };
    }
  };

  // Add this function after the getTemplateSections function
  const getTemplateLayoutOptions = () => {
    const baseOptions = {
      spacing: true,
      typography: true,
      density: true,
      containerWidth: true,
      cornerRadius: true,
      shadowDepth: true,
      animationSpeed: true,
      contentAlignment: true,
      buttonStyle: true,
    };

    switch (selectedTemplate) {
      case "dashboard":
        return {
          ...baseOptions,
          cardStyle: true,
          gridColumns: true,
          imageRatio: false,
        };
      case "landing":
        return {
          ...baseOptions,
          cardStyle: true,
          gridColumns: true,
          imageRatio: true,
        };
      case "ecommerce":
        return {
          ...baseOptions,
          cardStyle: true,
          gridColumns: true,
          imageRatio: true,
        };
      case "portfolio":
        return {
          ...baseOptions,
          cardStyle: true,
          gridColumns: true,
          imageRatio: true,
        };
      case "blog":
        return {
          ...baseOptions,
          cardStyle: true,
          gridColumns: true,
          imageRatio: true,
        };
      default:
        return baseOptions;
    }
  };

  // Update the useEffect to set template sections when template changes
  useEffect(() => {
    setTemplateConfig(getTemplateSections());
  }, [selectedTemplate]);

  // Render the selected template with applied colors and layout options
  const renderTemplate = () => {
    const props = {
      colorMap,
      config: templateConfig,
      layoutOptions,
    };

    switch (selectedTemplate) {
      case "dashboard":
        return <DashboardTemplate {...props} />;
      case "landing":
        return <LandingTemplate {...props} />;
      case "blog":
        return <BlogTemplate {...props} />;
      case "portfolio":
        return <PortfolioTemplate {...props} />;
      case "ecommerce":
        return <EcommerceTemplate {...props} />;
      default:
        return <DashboardTemplate {...props} />;
    }
  };

  // Generate CSS variables export
  const generateCSSVariables = () => {
    let css = `:root {\n`;
    Object.entries(colorMap).forEach(([key, value]) => {
      css += `  --color-${key}: ${value};\n`;
    });
    css += `}\n`;
    return css;
  };

  // Generate Tailwind config export
  const generateTailwindConfig = () => {
    let config = `module.exports = {\n`;
    config += `  theme: {\n`;
    config += `    extend: {\n`;
    config += `      colors: {\n`;
    Object.entries(colorMap).forEach(([key, value]) => {
      config += `        '${key}': '${value}',\n`;
    });
    config += `      },\n`;
    config += `    },\n`;
    config += `  },\n`;
    config += `};\n`;
    return config;
  };

  // Generate React styled-components export
  const generateStyledComponents = () => {
    let styled = `import { createGlobalStyle } from 'styled-components';\n\n`;
    styled += `export const GlobalStyle = createGlobalStyle\`\n`;
    styled += `  :root {\n`;
    Object.entries(colorMap).forEach(([key, value]) => {
      styled += `    --color-${key}: ${value};\n`;
    });
    styled += `  }\n\`;`;
    return styled;
  };

  // Handle export type or format change
  const handleExportTypeChange = (e) => {
    setExportType(e.target.value);
    generateExportContent(e.target.value, exportFormat);
  };

  const handleExportFormatChange = (e) => {
    setExportFormat(e.target.value);
    generateExportContent(exportType, e.target.value);
  };

  // Generate export content based on type and format
  const generateExportContent = (type, format) => {
    let content = "";

    if (type === "code") {
      switch (format) {
        case "css":
          content = generateCSSVariables();
          break;
        case "tailwind":
          content = generateTailwindConfig();
          break;
        case "styled":
          content = generateStyledComponents();
          break;
        default:
          content = generateCSSVariables();
      }
    } else if (type === "json") {
      content = JSON.stringify(colorMap, null, 2);
    }

    setExportedContent(content);
  };

  // Handle export button click
  const handleExport = () => {
    generateExportContent(exportType, exportFormat);
    setShowExportModal(true);
  };

  // Copy exported content to clipboard
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(exportedContent)
      .then(() => {
        setShowCopyNotification(true);
        setTimeout(() => {
          setShowCopyNotification(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // Add a helper function to calculate color brightness and determine proper contrast color
  const getContrastColor = (hexColor) => {
    // Remove the hash if it exists
    const hex = hexColor.replace("#", "");

    // Parse the RGB values
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate brightness (using the formula for relative luminance)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Return white for dark colors and black for light colors
    return brightness < 128 ? "#ffffff" : "#000000";
  };

  // If mobile device, show mobile message
  if (isMobile) {
    return (
      <div className="min-h-[600px] relative overflow-hidden flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl">
        {/* Parallax floating elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-16 h-16 rounded-lg bg-blue-600/20 animate-float-slow transform -rotate-12"></div>
          <div className="absolute top-32 right-12 w-12 h-12 rounded-lg bg-purple-600/20 animate-float-medium transform rotate-12"></div>
          <div className="absolute bottom-20 left-20 w-10 h-10 rounded-full bg-green-600/20 animate-float-fast"></div>
          <div className="absolute bottom-36 right-20 w-14 h-14 rounded-full bg-orange-600/20 animate-float-slow"></div>
          <div className="absolute top-1/2 left-1/3 w-8 h-8 rounded-lg bg-pink-600/20 animate-float-medium transform rotate-45"></div>
        </div>

        <div className="w-28 h-28 mb-6 rounded-xl flex items-center justify-center z-10 relative overflow-hidden group">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 sm:p-2 rounded-lg shadow-lg flex items-center justify-center">
            <SwatchIcon className="w-16 h-16 sm:w-full sm:h-full lg:w-full lg:h-full text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-3 z-10">UI Design Playground</h2>
        <div className="max-w-md space-y-4 z-10 backdrop-blur-sm bg-gray-900/50 rounded-xl p-4">
          <p className="text-gray-300">
            Our UI Playground is optimized for larger screens where you can:
          </p>
          <ul className="space-y-3 text-left mx-auto">
            <li className="flex items-start">
              <div className="bg-blue-600 p-1 rounded mr-2 mt-0.5 shadow-glow-blue">
                <SwatchIcon className="h-4 w-4 text-white" />
              </div>
              <span>Preview your color palettes in real UI components</span>
            </li>
            <li className="flex items-start">
              <div className="bg-green-600 p-1 rounded mr-2 mt-0.5 shadow-glow-green">
                <Cog6ToothIcon className="h-4 w-4 text-white" />
              </div>
              <span>
                Customize everything from button styles to layouts with
                extensive design parameters
              </span>
            </li>
            <li className="flex items-start">
              <div className="bg-purple-600 p-1 rounded mr-2 mt-0.5 shadow-glow-purple">
                <DocumentIcon className="h-4 w-4 text-white" />
              </div>
              <span>
                View and edit several different templates including dashboard,
                e-commerce, and portfolio sites
              </span>
            </li>
            <li className="flex items-start">
              <div className="bg-orange-600 p-1 rounded mr-2 mt-0.5 shadow-glow-orange">
                <ArrowTopRightOnSquareIcon className="h-4 w-4 text-white" />
              </div>
              <span>
                Export your designs as code in multiple formats (CSS, Tailwind,
                Styled Components)
              </span>
            </li>
          </ul>
          <div className="pt-4 border-t border-gray-700/50 mt-4">
            <p className="text-sm text-gray-400">
              Visit ColorLens on a larger device to experience the full power of
              the UI Playground.
            </p>
            <a
              href="https://colorlensapp.site"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              colorlensapp.site
            </a>
          </div>
        </div>

        {/* Floating bottom circle decorations */}
        <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-8 left-1/4 w-16 h-16 rounded-full bg-blue-600/10"></div>
          <div className="absolute -bottom-10 left-2/3 w-20 h-20 rounded-full bg-purple-600/10"></div>
          <div className="absolute -bottom-6 left-1/2 w-12 h-12 rounded-full bg-green-600/10"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{notificationAnimation}</style>
      <div className="flex flex-col md:flex-row h-[calc(100vh-12rem)] min-h-[600px] gap-0 relative w-full mx-auto">
        {/* Sidebar */}
        <div
          className={`h-full transition-all duration-300 ease-in-out border-r border-gray-700/50 ${
            isSidebarCollapsed ? "w-16" : "w-72"
          }`}
        >
          <div className="flex h-full flex-col bg-gray-800/20">
            {/* Sidebar header */}
            <div className="flex h-14 items-center justify-between border-b border-gray-700/50 px-4">
              {!isSidebarCollapsed && (
                <h2 className="text-sm font-medium">Template Customizer</h2>
              )}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="ml-auto rounded-md p-1.5 text-gray-400 hover:bg-gray-700/50 hover:text-gray-100"
                aria-label={
                  isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                }
              >
                {isSidebarCollapsed ? (
                  <ArrowsPointingOutIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Sidebar navigation */}
            <div className="h-full overflow-y-auto custom-scrollbar">
              {isSidebarCollapsed ? (
                // Collapsed sidebar with just icons
                <div className="flex flex-col items-center gap-2 py-4">
                  <button
                    onClick={() => {
                      setIsSidebarCollapsed(false);
                    }}
                    className="p-2 rounded-md hover:bg-gray-700/50 text-gray-400"
                  >
                    <DocumentTextIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => {
                      setIsSidebarCollapsed(false);
                    }}
                    className="p-2 rounded-md hover:bg-gray-700/50 text-gray-400"
                  >
                    <SwatchIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => {
                      setIsSidebarCollapsed(false);
                    }}
                    className="p-2 rounded-md hover:bg-gray-700/50 text-gray-400"
                  >
                    <Cog6ToothIcon className="h-6 w-6" />
                  </button>
                </div>
              ) : (
                // Expanded sidebar with collapsible sections
                <div className="pb-4">
                  {/* Template Section */}
                  <SidebarSection
                    title="Template"
                    icon={<DocumentTextIcon className="h-4 w-4" />}
                    defaultOpen={true}
                    rightElement={
                      <div className="relative">
                        <select
                          value={selectedTemplate}
                          onChange={(e) => setSelectedTemplate(e.target.value)}
                          className="clay-card px-2 py-1 pr-6 rounded-md bg-transparent appearance-none cursor-pointer text-gray-200 border-gray-700 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="dashboard">Dashboard</option>
                          <option value="landing">Landing Page</option>
                          <option value="blog">Blog</option>
                          <option value="portfolio">Portfolio</option>
                          <option value="ecommerce">E-commerce</option>
                        </select>
                        <ChevronDownIcon className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    }
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-300">
                          Template Sections
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {Object.entries(templateConfig)
                          .filter(([key]) => {
                            // Only show sections that are relevant to the current template
                            const templateSections = getTemplateSections();
                            return key in templateSections;
                          })
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between"
                            >
                              <label
                                htmlFor={`template-section-${key}`}
                                className="text-sm text-gray-400 capitalize cursor-pointer"
                              >
                                {key.replace("show", "")}
                              </label>
                              <div
                                className="relative"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleTemplateSection(key);
                                }}
                              >
                                <input
                                  id={`template-section-${key}`}
                                  type="checkbox"
                                  checked={value}
                                  onChange={() => toggleTemplateSection(key)}
                                  className="sr-only"
                                />
                                <div
                                  className={`block h-5 w-9 rounded-full transition-colors cursor-pointer ${
                                    value ? "bg-blue-600" : "bg-gray-600"
                                  }`}
                                ></div>
                                <div
                                  className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform cursor-pointer ${
                                    value ? "translate-x-4" : "translate-x-0"
                                  }`}
                                ></div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </SidebarSection>

                  {/* Color Mapping Section */}
                  <SidebarSection
                    title="Color Mapping"
                    icon={<SwatchIcon className="h-4 w-4" />}
                    defaultOpen={true}
                  >
                    {/* Color Presets */}
                    <div className="mb-3">
                      <div className="text-xs font-medium mb-2 text-gray-400">
                        Mode Selection
                      </div>
                      <div className="flex justify-between gap-2 mb-4">
                        <button
                          onClick={() => toggleColorMode(false)}
                          className="flex-1 py-1.5 px-2 text-xs rounded border border-gray-700 hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-white"></div>
                            <span>Light Mode</span>
                          </div>
                        </button>
                        <button
                          onClick={() => toggleColorMode(true)}
                          className="flex-1 py-1.5 px-2 text-xs rounded border border-gray-700 hover:bg-gray-700/50 transition-colors bg-gray-800"
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-gray-900 border border-gray-700"></div>
                            <span>Dark Mode</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Individual Color Controls */}
                    <div className="mt-4 pt-3 border-t border-gray-700/50">
                      <div className="text-sm font-medium mb-2 text-gray-400 flex items-center justify-between">
                        Color Mappings
                        <div>
                          <button
                            className="p-2 rounded-md text-gray-400 hover:text-gray-200 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditingColors(!isEditingColors);
                            }}
                          >
                            <PencilIcon className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-1.5 text-sm">
                        {Object.entries(colorMap).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            {isEditingColors ? (
                              <>
                                <label
                                  htmlFor={`color-${key}`}
                                  className="capitalize flex items-center gap-2 text-gray-300"
                                >
                                  <div
                                    className="w-4 h-4 rounded-md cursor-pointer shadow-sm relative group"
                                    style={{ backgroundColor: value }}
                                  ></div>
                                  {key}:
                                </label>
                                <div className="relative ml-auto">
                                  <input
                                    id={`color-${key}`}
                                    type="color"
                                    value={value}
                                    onChange={(e) =>
                                      handleColorChange(key, e.target.value)
                                    }
                                    className="w-14 h-6 cursor-pointer rounded-md overflow-hidden"
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  className="w-4 h-4 rounded-md shadow-sm cursor-pointer relative group"
                                  style={{ backgroundColor: value }}
                                  id={`color-preview-${key}`}
                                ></div>
                                <span className="capitalize text-gray-300">
                                  {key}:
                                </span>
                                <span
                                  className="font-mono text-xs cursor-pointer text-gray-400 hover:text-blue-400 transition-colors ml-auto"
                                  onClick={() => {
                                    navigator.clipboard.writeText(value);
                                  }}
                                >
                                  {value}
                                </span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </SidebarSection>

                  {/* Palettes Section */}
                  <SidebarSection
                    title="Palettes"
                    icon={<SwatchIcon className="h-4 w-4" />}
                    defaultOpen={false}
                  >
                    <div className="space-y-2">
                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                        <div className="grid grid-cols-3 gap-1">
                          {allPalettes.length > 0 ? (
                            allPalettes.map((palette) => (
                              <PaletteCard
                                key={palette.id || palette.name}
                                palette={palette}
                                selectedPalette={selectedPalette}
                                onClick={() => applyPalette(palette)}
                                className="compact"
                              />
                            ))
                          ) : (
                            <div className="col-span-3 text-center py-4 px-2">
                              <div className="bg-gray-800/40 rounded-lg p-3">
                                <SwatchIcon className="h-5 w-5 text-gray-500 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">
                                  No saved palettes found
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Save palettes using the Palette Generator or
                                  Discover tab
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </SidebarSection>

                  {/* Layout Section */}
                  <SidebarSection
                    title="Layout"
                    icon={<Squares2X2Icon className="h-4 w-4" />}
                    defaultOpen={false}
                  >
                    <div className="space-y-3">
                      {/* Container Width Option */}
                      {getTemplateLayoutOptions().containerWidth && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium mb-1 text-gray-400">
                            Container Width
                          </label>
                          <div className="grid grid-cols-2 gap-1">
                            {["narrow", "standard", "wide", "full"].map(
                              (option) => (
                                <button
                                  key={option}
                                  onClick={() =>
                                    handleLayoutChange("containerWidth", option)
                                  }
                                  className={`py-1 px-2 rounded text-xs border ${
                                    layoutOptions.containerWidth === option
                                      ? "bg-blue-900/50 border-blue-700 text-blue-200"
                                      : "border-gray-700 hover:bg-gray-700/50 text-gray-400"
                                  }`}
                                >
                                  <span className="capitalize">{option}</span>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Spacing Option */}
                      {getTemplateLayoutOptions().spacing && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium mb-1 text-gray-400">
                            Spacing
                          </label>
                          <div className="grid grid-cols-3 gap-1">
                            {["compact", "normal", "spacious"].map((option) => (
                              <button
                                key={option}
                                onClick={() =>
                                  handleLayoutChange("spacing", option)
                                }
                                className={`py-1 px-2 rounded text-xs border ${
                                  layoutOptions.spacing === option
                                    ? "bg-blue-900/50 border-blue-700 text-blue-200"
                                    : "border-gray-700 hover:bg-gray-700/50 text-gray-400"
                                }`}
                              >
                                <span className="capitalize">{option}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Density Option */}
                      {getTemplateLayoutOptions().density && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium mb-1 text-gray-400">
                            Element Density
                          </label>
                          <div className="grid grid-cols-3 gap-1">
                            {["low", "medium", "high"].map((option) => (
                              <button
                                key={option}
                                onClick={() =>
                                  handleLayoutChange("density", option)
                                }
                                className={`py-1 px-2 rounded text-xs border ${
                                  layoutOptions.density === option
                                    ? "bg-blue-900/50 border-blue-700 text-blue-200"
                                    : "border-gray-700 hover:bg-gray-700/50 text-gray-400"
                                }`}
                              >
                                <span className="capitalize">{option}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Grid Columns Option */}
                      {getTemplateLayoutOptions().gridColumns && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium mb-1 text-gray-400">
                            Grid Columns
                          </label>
                          <div className="grid grid-cols-2 gap-1">
                            {["2", "3", "4", "auto-fit"].map((option) => (
                              <button
                                key={option}
                                onClick={() =>
                                  handleLayoutChange("gridColumns", option)
                                }
                                className={`py-1 px-2 rounded text-xs border ${
                                  layoutOptions.gridColumns === option
                                    ? "bg-blue-900/50 border-blue-700 text-blue-200"
                                    : "border-gray-700 hover:bg-gray-700/50 text-gray-400"
                                }`}
                              >
                                <span className="capitalize">{option}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Content Alignment Option */}
                      {getTemplateLayoutOptions().contentAlignment && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium mb-1 text-gray-400">
                            Content Alignment
                          </label>
                          <div className="grid grid-cols-3 gap-1">
                            {["left", "center", "right"].map((option) => (
                              <button
                                key={option}
                                onClick={() =>
                                  handleLayoutChange("contentAlignment", option)
                                }
                                className={`py-1 px-2 rounded text-xs border ${
                                  layoutOptions.contentAlignment === option
                                    ? "bg-blue-900/50 border-blue-700 text-blue-200"
                                    : "border-gray-700 hover:bg-gray-700/50 text-gray-400"
                                }`}
                              >
                                <span className="capitalize">{option}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </SidebarSection>

                  {/* Style Section */}
                  <SidebarSection
                    title="Style"
                    icon={<PaintBrushIcon className="h-4 w-4" />}
                    defaultOpen={false}
                  >
                    <div className="space-y-3">
                      {/* Corner Radius Option */}
                      {getTemplateLayoutOptions().cornerRadius && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium mb-1 text-gray-400">
                            Corner Radius
                          </label>
                          <div className="grid grid-cols-3 gap-1">
                            {[
                              "none",
                              "small",
                              "medium",
                              "large",
                              "rounded",
                            ].map((option) => (
                              <button
                                key={option}
                                onClick={() =>
                                  handleLayoutChange("cornerRadius", option)
                                }
                                className={`py-1 px-2 rounded text-xs border ${
                                  layoutOptions.cornerRadius === option
                                    ? "bg-blue-900/50 border-blue-700 text-blue-200"
                                    : "border-gray-700 hover:bg-gray-700/50 text-gray-400"
                                }`}
                              >
                                <span className="capitalize">{option}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Shadow Depth Option */}
                      {getTemplateLayoutOptions().shadowDepth && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium mb-1 text-gray-400">
                            Shadow Depth
                          </label>
                          <div className="grid grid-cols-2 gap-1">
                            {["flat", "subtle", "medium", "pronounced"].map(
                              (option) => (
                                <button
                                  key={option}
                                  onClick={() =>
                                    handleLayoutChange("shadowDepth", option)
                                  }
                                  className={`py-1 px-2 rounded text-xs border ${
                                    layoutOptions.shadowDepth === option
                                      ? "bg-blue-900/50 border-blue-700 text-blue-200"
                                      : "border-gray-700 hover:bg-gray-700/50 text-gray-400"
                                  }`}
                                >
                                  <span className="capitalize">{option}</span>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </SidebarSection>

                  {/* Components Section */}
                  <SidebarSection
                    title="Components"
                    icon={<Squares2X2Icon className="h-4 w-4" />}
                    defaultOpen={false}
                  >
                    <div className="space-y-3">
                      {/* Card Style Option */}
                      {getTemplateLayoutOptions().cardStyle && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium mb-1 text-gray-400">
                            Card Style
                          </label>
                          <div className="grid grid-cols-3 gap-1">
                            {[
                              "default",
                              "flat",
                              "bordered",
                              "elevated",
                              "glass",
                            ].map((option) => (
                              <button
                                key={option}
                                onClick={() =>
                                  handleLayoutChange("cardStyle", option)
                                }
                                className={`py-1 px-2 rounded text-xs border ${
                                  layoutOptions.cardStyle === option
                                    ? "bg-blue-900/50 border-blue-700 text-blue-200"
                                    : "border-gray-700 hover:bg-gray-700/50 text-gray-400"
                                }`}
                              >
                                <span className="capitalize">{option}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Button Style Option */}
                      {getTemplateLayoutOptions().buttonStyle && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium mb-1 text-gray-400">
                            Button Style
                          </label>
                          <div className="grid grid-cols-2 gap-1">
                            {["default", "filled", "outlined", "text-only"].map(
                              (option) => (
                                <button
                                  key={option}
                                  onClick={() =>
                                    handleLayoutChange("buttonStyle", option)
                                  }
                                  className={`py-1 px-2 rounded text-xs border ${
                                    layoutOptions.buttonStyle === option
                                      ? "bg-blue-900/50 border-blue-700 text-blue-200"
                                      : "border-gray-700 hover:bg-gray-700/50 text-gray-400"
                                  }`}
                                >
                                  <span className="capitalize">{option}</span>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Image Ratio Option */}
                      {getTemplateLayoutOptions().imageRatio && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium mb-1 text-gray-400">
                            Image Ratio
                          </label>
                          <div className="grid grid-cols-2 gap-1">
                            {["square", "4:3", "16:9", "auto"].map((option) => (
                              <button
                                key={option}
                                onClick={() =>
                                  handleLayoutChange("imageRatio", option)
                                }
                                className={`py-1 px-2 rounded text-xs border ${
                                  layoutOptions.imageRatio === option
                                    ? "bg-blue-900/50 border-blue-700 text-blue-200"
                                    : "border-gray-700 hover:bg-gray-700/50 text-gray-400"
                                }`}
                              >
                                <span className="capitalize">{option}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </SidebarSection>

                  {/* Animation Section */}
                  <SidebarSection
                    title="Animation"
                    icon={<ArrowPathIcon className="h-4 w-4" />}
                    defaultOpen={false}
                  >
                    <div className="space-y-3">
                      {/* Animation Speed Option */}
                      {getTemplateLayoutOptions().animationSpeed && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium mb-1 text-gray-400">
                            Animation Speed
                          </label>
                          <div className="grid grid-cols-2 gap-1">
                            {["none", "slow", "medium", "fast"].map(
                              (option) => (
                                <button
                                  key={option}
                                  onClick={() =>
                                    handleLayoutChange("animationSpeed", option)
                                  }
                                  className={`py-1 px-2 rounded text-xs border ${
                                    layoutOptions.animationSpeed === option
                                      ? "bg-blue-900/50 border-blue-700 text-blue-200"
                                      : "border-gray-700 hover:bg-gray-700/50 text-gray-400"
                                  }`}
                                >
                                  <span className="capitalize">{option}</span>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </SidebarSection>

                  {/* Typography Section */}
                  <SidebarSection
                    title="Typography"
                    icon={<DocumentTextIcon className="h-4 w-4" />}
                    defaultOpen={false}
                  >
                    <div className="space-y-3">
                      {/* Typography Option */}
                      {getTemplateLayoutOptions().typography && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium mb-1 text-gray-400">
                            Typography
                          </label>
                          <div className="grid grid-cols-3 gap-1">
                            {["default", "modern", "classic"].map((option) => (
                              <button
                                key={option}
                                onClick={() =>
                                  handleLayoutChange("typography", option)
                                }
                                className={`py-1 px-2 rounded text-xs border ${
                                  layoutOptions.typography === option
                                    ? "bg-blue-900/50 border-blue-700 text-blue-200"
                                    : "border-gray-700 hover:bg-gray-700/50 text-gray-400"
                                }`}
                              >
                                <span className="capitalize">{option}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </SidebarSection>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content - Template preview */}
        <div className="flex-1 h-full overflow-hidden">
          <div className="clay-card p-3 rounded-lg h-full flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">Template Preview</h2>
              </div>
              <button
                onClick={handleExport}
                className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Export Colors
              </button>
            </div>
            <div
              ref={templateRef}
              className="border rounded-lg overflow-auto bg-white flex-1 isolate w-full"
            >
              {renderTemplate()}
            </div>
          </div>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto text-gray-200 shadow-xl relative">
              {showCopyNotification && (
                <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-out flex items-center z-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Copied to clipboard!
                </div>
              )}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Export Colors</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  &times;
                </button>
              </div>

              <div className="flex gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Format Type
                  </label>
                  <select
                    value={exportType}
                    onChange={handleExportTypeChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="code">Code</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                {exportType === "code" && (
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      Code Format
                    </label>
                    <select
                      value={exportFormat}
                      onChange={handleExportFormatChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="css">CSS Variables</option>
                      <option value="tailwind">Tailwind Config</option>
                      <option value="styled">Styled Components</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Export Preview
                </label>
                <pre className="bg-gray-800 border border-gray-700 p-4 rounded-md overflow-auto max-h-[300px] text-sm text-blue-300 font-mono">
                  {exportedContent}
                </pre>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
