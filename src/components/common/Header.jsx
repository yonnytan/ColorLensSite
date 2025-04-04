import { SwatchIcon } from "@heroicons/react/24/outline";

export function Header() {
  return (
    <header className="bg-1A1B1E">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="relative flex items-center justify-center">
          {/* Logo - Left */}
          <div className="absolute left-0 flex bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg">
            <SwatchIcon className="w-10 h-10 text-white" />
          </div>

          {/* Title - Center */}
          <div className="flex items-baseline right-0">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              ColorLens
            </h1>
          </div>

          <div className="">{/* Future Sign-In Button - Right */}</div>
        </div>
      </div>
    </header>
  );
}
