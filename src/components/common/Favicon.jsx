import { useEffect } from 'react';
// Update the import path to where the image actually exists
// For example, if it's in the public folder:
// No import needed for files in public folder

export function Favicon() {
  useEffect(() => {
    // Create a link element for the favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'shortcut icon';
    // Use the path to the image in the public folder
    link.href = '/colorlenslogo.png'; // Assuming it's in the public root
    
    // Add it to the document head
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);
  
  return null;
} 