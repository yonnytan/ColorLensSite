import { useEffect } from "react";

export function Favicon() {
  useEffect(() => {
    const link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/png";
    link.rel = "shortcut icon";
    link.href = "/colorlenslogo.png"; // Assuming it's in the public root

    document.getElementsByTagName("head")[0].appendChild(link);
  }, []);

  return null;
}
