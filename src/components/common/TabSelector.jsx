import {
  PhotoIcon,
  SwatchIcon,
  SparklesIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { useRef, useEffect, useState } from "react";

export function TabSelector({ activeTab, setActiveTab }) {
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const pickerRef = useRef(null);
  const generatorRef = useRef(null);
  const discoverRef = useRef(null);
  const playgroundRef = useRef(null);
  const containerRef = useRef(null);

  // Update indicator position when activeTab changes
  useEffect(() => {
    const updateIndicator = () => {
      let activeRef;

      if (activeTab === "picker") activeRef = pickerRef.current;
      else if (activeTab === "generator") activeRef = generatorRef.current;
      else if (activeTab === "discover") activeRef = discoverRef.current;
      else if (activeTab === "playground") activeRef = playgroundRef.current;

      if (activeRef && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const activeRect = activeRef.getBoundingClientRect();

        setIndicatorStyle({
          width: `${activeRect.width}px`,
          transform: `translateX(${activeRect.left - containerRect.left}px)`,
          height: `${activeRect.height}px`,
        });
      }
    };

    // Small delay to ensure DOM is updated
    const timer = setTimeout(updateIndicator, 50);

    // Also update on window resize
    window.addEventListener("resize", updateIndicator);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeTab]);

  return (
    <div className="flex justify-center mb-4 sm:mb-8">
      <div
        ref={containerRef}
        className="clay-card inline-flex rounded-lg p-0.5 sm:p-1 text-sm sm:text-base relative"
      >
        {/* Animated indicator */}
        <div
          className="absolute bg-gray-700 rounded-md transition-all duration-200 ease-in-out z-0"
          style={indicatorStyle}
        />

        <button
          ref={discoverRef}
          onClick={() => setActiveTab("discover")}
          className={`flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-md transition-colors relative z-10 ${
            activeTab === "discover"
              ? "text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Discover</span>
          <span className="inline sm:hidden">Discover</span>
        </button>

        <button
          ref={playgroundRef}
          onClick={() => setActiveTab("playground")}
          className={`flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-md transition-colors relative z-10 ${
            activeTab === "playground"
              ? "text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          <DocumentIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">UI Playground</span>
          <span className="inline sm:hidden">UI</span>
        </button>

        <button
          ref={generatorRef}
          onClick={() => setActiveTab("generator")}
          className={`flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-md transition-colors relative z-10 ${
            activeTab === "generator"
              ? "text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          <PhotoIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Palette Generator</span>
          <span className="inline sm:hidden">Images</span>
        </button>

        <button
          ref={pickerRef}
          onClick={() => setActiveTab("picker")}
          className={`flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-md transition-colors relative z-10 ${
            activeTab === "picker"
              ? "text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          <SwatchIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Color Picker</span>
          <span className="inline sm:hidden">Colors</span>
        </button>
      </div>
    </div>
  );
}
