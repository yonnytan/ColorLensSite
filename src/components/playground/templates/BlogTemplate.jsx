import React from "react";

export function BlogTemplate({ colorMap, config = {}, layoutOptions = {} }) {
  // Set default values for layoutOptions
  const {
    spacing = "normal",
    typography = "default",
    containerWidth = "standard",
    cornerRadius = "medium",
    shadowDepth = "medium",
    animationSpeed = "medium",
    contentAlignment = "left",
    cardStyle = "default",
    buttonStyle = "default",
    imageRatio = "16:9",
    gridColumns = "3",
    density = "medium",
  } = layoutOptions;

  // Extract config
  const {
    showHeader = true,
    showHero = true,
    showFeatures = true,
    showFooter = true,
  } = config;

  // Get container width class
  const getContainerWidthClass = () => {
    switch (containerWidth) {
      case "narrow":
        return "max-w-4xl mx-auto";
      case "wide":
        return "max-w-7xl mx-auto";
      case "full":
        return "w-full";
      case "standard":
      default:
        return "max-w-6xl mx-auto";
    }
  };

  // Get content alignment class
  const getContentAlignmentClass = () => {
    switch (contentAlignment) {
      case "center":
        return "text-center items-center";
      case "right":
        return "text-right items-end";
      case "left":
      default:
        return "text-left items-start";
    }
  };

  // Get corner radius class
  const getCornerRadiusClass = () => {
    switch (cornerRadius) {
      case "none":
        return "rounded-none";
      case "small":
        return "rounded";
      case "large":
        return "rounded-xl";
      case "rounded":
        return "rounded-full";
      case "medium":
      default:
        return "rounded-lg";
    }
  };

  // Get shadow depth class
  const getShadowDepthClass = () => {
    switch (shadowDepth) {
      case "flat":
        return "shadow-none";
      case "subtle":
        return "shadow-sm";
      case "pronounced":
        return "shadow-lg";
      case "medium":
      default:
        return "shadow";
    }
  };

  // Get animation speed style
  const getAnimationSpeed = () => {
    switch (animationSpeed) {
      case "none":
        return "transition-none";
      case "slow":
        return "duration-500";
      case "fast":
        return "duration-150";
      case "medium":
      default:
        return "duration-300";
    }
  };

  // Get grid columns class
  const getGridColumnsClass = () => {
    switch (gridColumns) {
      case "2":
        return "grid-cols-1 md:grid-cols-2";
      case "4":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      case "auto-fit":
        return "grid-cols-1 md:grid-auto-fit";
      case "3":
      default:
        return "grid-cols-1 md:grid-cols-3";
    }
  };

  // Get spacing class based on spacing option
  const getSpacingClass = () => {
    switch (spacing) {
      case "compact":
        return "py-2 px-3 gap-2";
      case "spacious":
        return "py-8 px-12 gap-6";
      case "normal":
      default:
        return "py-4 px-6 gap-4";
    }
  };

  // Get typography class
  const getTypographyClass = () => {
    switch (typography) {
      case "modern":
        return "font-sans tracking-tight";
      case "classic":
        return "font-serif";
      case "default":
      default:
        return "font-sans";
    }
  };

  // Get image ratio class
  const getImageRatioClass = () => {
    switch (imageRatio) {
      case "square":
        return "aspect-square";
      case "4:3":
        return "aspect-[4/3]";
      case "16:9":
        return "aspect-[16/9]";
      case "auto":
      default:
        return "";
    }
  };

  // Combine classes
  const spacingClass = getSpacingClass();
  const typographyClass = getTypographyClass();
  const containerWidthClass = getContainerWidthClass();
  const contentAlignmentClass = getContentAlignmentClass();
  const cornerRadiusClass = getCornerRadiusClass();
  const shadowDepthClass = getShadowDepthClass();
  const animationSpeedClass = getAnimationSpeed();
  const gridColumnsClass = getGridColumnsClass();
  const imageRatioClass = getImageRatioClass();

  // Colors from the palette
  const {
    primary = "#1e40af",
    secondary = "#4f46e5",
    accent = "#f59e0b",
    background = "#ffffff",
    text = "#111827",
    muted = "#6b7280",
    border = "#e5e7eb",
  } = colorMap;

  // Button style based on buttonStyle option
  const getButtonStyle = (baseColor) => {
    switch (buttonStyle) {
      case "filled":
        return {
          backgroundColor: baseColor,
          color: "#ffffff",
          borderRadius: cornerRadius === "none" ? "0" : "0.375rem",
        };
      case "outlined":
        return {
          backgroundColor: "transparent",
          border: `1px solid ${baseColor}`,
          color: baseColor,
          borderRadius: cornerRadius === "none" ? "0" : "0.375rem",
        };
      case "text-only":
        return {
          backgroundColor: "transparent",
          color: baseColor,
          borderRadius: cornerRadius === "none" ? "0" : "0.375rem",
        };
      case "default":
      default:
        return {
          backgroundColor: baseColor,
          color: "#ffffff",
          borderRadius: cornerRadius === "none" ? "0" : "0.375rem",
        };
    }
  };

  // Card style based on cardStyle option
  const getCardStyle = () => {
    switch (cardStyle) {
      case "flat":
        return {
          backgroundColor: background,
          borderRadius: cornerRadius === "none" ? "0" : "0.5rem",
          boxShadow: "none",
        };
      case "bordered":
        return {
          backgroundColor: background,
          border: `1px solid ${border}`,
          borderRadius: cornerRadius === "none" ? "0" : "0.5rem",
          boxShadow: "none",
        };
      case "elevated":
        return {
          backgroundColor: background,
          borderRadius: cornerRadius === "none" ? "0" : "0.5rem",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        };
      case "glass":
        return {
          backgroundColor: `${background}80`,
          backdropFilter: "blur(8px)",
          borderTop: `1px solid rgba(255, 255, 255, 0.4)`,
          borderLeft: `1px solid rgba(255, 255, 255, 0.3)`,
          borderRight: `1px solid rgba(255, 255, 255, 0.2)`,
          borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
          boxShadow: `0 4px 30px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.3)`,
          borderRadius: cornerRadius === "none" ? "0" : "0.5rem",
        };
      case "default":
      default:
        return {
          backgroundColor: background,
          border: `1px solid ${border}`,
          borderRadius: cornerRadius === "none" ? "0" : "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
        };
    }
  };

  // Dynamic styles
  const styles = {
    container: {
      backgroundColor: background,
      color: text,
    },
    header: {
      backgroundColor: background,
      borderBottom: `1px solid ${border}`,
    },
    primaryButton: getButtonStyle(primary),
    secondaryButton: getButtonStyle(secondary),
    card: getCardStyle(),
    footer: {
      backgroundColor: primary,
      color: "#ffffff",
    },
    mutedText: {
      color: muted,
    },
  };

  // Blog mock data
  const featuredPost = {
    title: "Getting Started with Color Theory",
    excerpt:
      "Learn the fundamentals of color theory and how to apply it to your designs for maximum impact.",
    date: "August 28, 2023",
    author: "Violet Hue",
    category: "Design Tips",
    readTime: "8 min read",
  };

  const recentPosts = [
    {
      title: "10 Color Palettes for Your Next Project",
      excerpt:
        "Explore these carefully curated color palettes that work perfectly for different types of projects.",
      date: "August 24, 2023",
      author: "Luna Azure",
      category: "Resources",
      readTime: "5 min read",
    },
    {
      title: "Psychology of Colors in Marketing",
      excerpt:
        "Discover how different colors affect consumer behavior and how to use them effectively in your marketing campaigns.",
      date: "August 20, 2023",
      author: "Miles Chroma",
      category: "Marketing",
      readTime: "6 min read",
    },
    {
      title: "Creating Accessible Color Combinations",
      excerpt:
        "Ensure your designs are inclusive by learning how to create color combinations that meet accessibility standards.",
      date: "August 16, 2023",
      author: "Indigo	Ray",
      category: "Accessibility",
      readTime: "7 min read",
    },
  ];

  return (
    <div
      style={styles.container}
      className={`min-h-[600px] flex flex-col ${typographyClass}`}
    >
      {showHeader && (
        <header
          style={styles.header}
          className={`${spacingClass} flex justify-between items-center`}
        >
          <div className="flex items-center">
            <div
              className={`w-8 h-8 ${cornerRadiusClass} mr-2 flex items-center justify-center`}
              style={{ backgroundColor: primary }}
            >
              <span className="text-white font-bold">C</span>
            </div>
            <span className="font-bold text-lg">Color Blog</span>
          </div>

          <nav className="hidden md:flex space-x-6">
            {["Home", "Blog", "Resources", "About", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:opacity-80 transition-opacity"
                onClick={(e) => e.preventDefault()}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex space-x-3">
            <button
              style={styles.secondaryButton}
              className={`px-3 py-1 text-sm transition ${animationSpeedClass} hover:opacity-80`}
              onClick={() => console.log("Subscribe clicked")}
            >
              Subscribe
            </button>
          </div>
        </header>
      )}

      <main className={`flex-1 ${containerWidthClass}`}>
        {showHero && (
          <section className={`${spacingClass}`}>
            <div
              style={styles.card}
              className={`${cornerRadiusClass} ${shadowDepthClass} overflow-hidden mb-8 transition ${animationSpeedClass} hover:-translate-y-1`}
            >
              <div className="flex flex-col md:flex-row">
                <div className={`md:w-1/2 ${imageRatioClass} bg-gray-200`}>
                  <div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(135deg, ${primary}22 0%, ${secondary}44 100%)`,
                    }}
                  ></div>
                </div>
                <div className={`md:w-1/2 p-6 md:p-8 ${contentAlignmentClass}`}>
                  <div className="mb-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 ${cornerRadiusClass}`}
                      style={{ backgroundColor: primary, color: "#ffffff" }}
                    >
                      {featuredPost.category}
                    </span>
                    <span className="text-xs ml-2" style={{ color: muted }}>
                      {featuredPost.date} • {featuredPost.readTime}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-3">
                    {featuredPost.title}
                  </h1>
                  <p className="mb-4" style={{ color: muted }}>
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center mb-4">
                    <div
                      className="w-10 h-10 rounded-full mr-3"
                      style={{ backgroundColor: secondary }}
                    ></div>
                    <span>By {featuredPost.author}</span>
                  </div>
                  <button
                    style={styles.primaryButton}
                    className={`px-4 py-2 transition ${animationSpeedClass} hover:opacity-90`}
                    onClick={() => console.log("Read more clicked")}
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {showFeatures && (
          <section className={`${spacingClass}`}>
            <div className={`mb-8 ${contentAlignmentClass}`}>
              <h2 className="text-2xl font-bold mb-2">Recent Articles</h2>
              <p style={{ color: muted }}>
                Explore our latest articles on color theory and design
              </p>
            </div>

            <div className={`grid ${gridColumnsClass} gap-6`}>
              {recentPosts.map((post, i) => (
                <div
                  key={i}
                  style={styles.card}
                  className={`${cornerRadiusClass} ${shadowDepthClass} overflow-hidden transition ${animationSpeedClass} hover:-translate-y-1`}
                >
                  <div
                    className={`${imageRatioClass} bg-gray-200`}
                    style={{
                      background: `linear-gradient(135deg, ${
                        i === 0 ? primary : i === 1 ? secondary : accent
                      }22 0%, ${
                        i === 0 ? primary : i === 1 ? secondary : accent
                      }44 100%)`,
                    }}
                  ></div>
                  <div className={`p-5 ${contentAlignmentClass}`}>
                    <div className="mb-2">
                      <span
                        className={`text-xs font-medium px-2 py-1 ${cornerRadiusClass}`}
                        style={{
                          backgroundColor:
                            i === 0 ? primary : i === 1 ? secondary : accent,
                          color: "#ffffff",
                        }}
                      >
                        {post.category}
                      </span>
                      <span className="text-xs ml-2" style={{ color: muted }}>
                        {post.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="mb-3" style={{ color: muted }}>
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{post.readTime}</span>
                      <button
                        style={{ color: primary }}
                        className="text-sm font-medium hover:underline"
                        onClick={() =>
                          console.log(`Read ${post.title} clicked`)
                        }
                      >
                        Read Article →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-8 ${contentAlignmentClass}`}>
              <button
                style={styles.secondaryButton}
                className={`px-4 py-2 transition ${animationSpeedClass} hover:opacity-90`}
                onClick={() => console.log("View all articles clicked")}
              >
                View All Articles
              </button>
            </div>
          </section>
        )}
      </main>

      {showFooter && (
        <footer style={styles.footer} className={`${spacingClass} mt-auto`}>
          <div
            className={`${containerWidthClass} flex flex-col md:flex-row justify-between`}
          >
            <div className="mb-6 md:mb-0">
              <div className="flex items-center mb-4">
                <div
                  className={`w-8 h-8 ${cornerRadiusClass} mr-2 flex items-center justify-center bg-white`}
                >
                  <span style={{ color: primary }} className="font-bold">
                    C
                  </span>
                </div>
                <span className="font-bold text-lg">Color Blog</span>
              </div>
              <p className="max-w-md opacity-80">
                A blog dedicated to color theory, design principles, and
                creative inspiration.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold mb-3">Quick Links</h3>
                <ul className="space-y-2 opacity-80">
                  {["Home", "Blog", "Resources", "About", "Contact"].map(
                    (item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="hover:opacity-100"
                          onClick={(e) => e.preventDefault()}
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-3">Categories</h3>
                <ul className="space-y-2 opacity-80">
                  {[
                    "Design Tips",
                    "Color Theory",
                    "Tutorials",
                    "Resources",
                    "Inspiration",
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="hover:opacity-100"
                        onClick={(e) => e.preventDefault()}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-2 md:col-span-1">
                <h3 className="font-bold mb-3">Subscribe</h3>
                <p className="mb-3 opacity-80">
                  Get the latest articles and resources in your inbox.
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className={`px-3 py-2 ${cornerRadiusClass} flex-1 text-gray-900 border-0`}
                  />
                  <button
                    style={{ backgroundColor: accent }}
                    className={`${cornerRadiusClass} px-3 ml-2 text-white`}
                    onClick={() => console.log("Subscribe clicked")}
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`border-t border-white/20 ${
              contentAlignmentClass === "left"
                ? "text-left"
                : contentAlignmentClass === "center"
                ? "text-center"
                : "text-right"
            } pt-4 mt-8 opacity-60 text-sm`}
          >
            <p>© 2025 Color Blog. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
}
