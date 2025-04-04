import { SwatchIcon } from "@heroicons/react/24/outline";

export function Header() {
  return (
    <header className="bg-1A1B1E top-0 z-10 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        <div className="relative flex items-center justify-center h-12 sm:h-14">
          {/* Logo - Left */}
          <div className="absolute left-0 flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 sm:p-2 rounded-lg shadow-lg flex items-center justify-center">
              <SwatchIcon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            {/* Name shown on small to medium screens */}
            <span className="ml-3 text-xl font-bold text-white hidden sm:block md:hidden">
              ColorLens
            </span>
          </div>

          {/* Title - Center, hidden on very small screens */}
          <div className="hidden md:block">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              ColorLens
            </h1>
          </div>

          {/* Mobile title - only on smallest screens */}
          <div className="sm:hidden">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              ColorLens
            </h1>
          </div>

          {/* Future Sign-In Button - Right */}
          <div className="absolute right-0">
            {/* Placeholder for sign-in button */}
          </div>
        </div>
      </div>
    </header>
  );
}
