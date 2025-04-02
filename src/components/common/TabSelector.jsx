import { PhotoIcon, SwatchIcon, SparklesIcon } from "@heroicons/react/24/outline";

export function TabSelector({ activeTab, setActiveTab }) {
  return (
    <div className="flex justify-center mb-4 sm:mb-8">
      <div className="clay-card inline-flex rounded-lg p-0.5 sm:p-1 text-sm sm:text-base">
        <button
          onClick={() => setActiveTab("picker")}
          className={`flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-md transition-colors ${
            activeTab === "picker"
              ? "bg-gray-700 text-white"
              : "hover:bg-gray-600"
          }`}
        >
          <SwatchIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Color Picker</span>
          <span className="inline sm:hidden">Colors</span>
        </button>
        <button
          onClick={() => setActiveTab("generator")}
          className={`flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-md transition-colors ${
            activeTab === "generator"
              ? "bg-gray-700 text-white"
              : "hover:bg-gray-600"
          }`}
        >
          <PhotoIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Palette Generator</span>
          <span className="inline sm:hidden">Images</span>
        </button>
        <button
          onClick={() => setActiveTab("discover")}
          className={`flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-md transition-colors ${
            activeTab === "discover"
              ? "bg-gray-700 text-white"
              : "hover:bg-gray-600"
          }`}
        >
          <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Discover</span>
          <span className="inline sm:hidden">Discover</span>
        </button>
      </div>
    </div>
  );
} 