import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function SaveModal({ show, paletteName, onClose }) {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4 z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Palette Saved</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-3 mb-6">
          <CheckCircleIcon className="w-6 h-6 text-green-500" />
          <p className="text-gray-300">
            "{paletteName}" has been saved to your collection.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
} 