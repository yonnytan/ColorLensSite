import { SwatchIcon } from "@heroicons/react/24/outline";

export function Header() {
  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg">
              <SwatchIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-baseline">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                ColorLens
              </h1>
            </div>
          </div>

          {/* Right side content - can add more items later */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/yonnytan/ColorLensSite"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
