import { useEffect } from 'react';
import colorLensLogo from '../../assets/colorlenslogo.png';

export function Favicon() {
  useEffect(() => {
    // Create a link element for the favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'shortcut icon';
    link.href = colorLensLogo;
    
    // Add it to the document head
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);
  
  return null;
} 