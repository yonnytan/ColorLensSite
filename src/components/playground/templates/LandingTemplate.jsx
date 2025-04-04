import React from "react";

export function LandingTemplate({ colorMap, config = {}, layoutOptions = {} }) {
  const { primary, secondary, accent, background, text, muted, border } =
    colorMap;

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

  // Combine classes
  const spacingClass = getSpacingClass();
  const typographyClass = getTypographyClass();
  const containerWidthClass = getContainerWidthClass();
  const contentAlignmentClass = getContentAlignmentClass();
  const cornerRadiusClass = getCornerRadiusClass();
  const shadowDepthClass = getShadowDepthClass();
  const animationSpeedClass = getAnimationSpeed();
  const gridColumnsClass = getGridColumnsClass();

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
    accentText: {
      color: accent,
    },
    heroSection: {
      background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
      color: "#ffffff",
    },
    card: getCardStyle(),
    footer: {
      backgroundColor: primary,
      color: "#ffffff",
    },
    mutedText: {
      color: muted,
    },
  };

  return (
    <div
      style={styles.container}
      className={`min-h-[600px] flex flex-col ${typographyClass} ${containerWidthClass}`}
    >
      {/* Header */}
      <header
        style={styles.header}
        className={`${spacingClass} flex justify-between items-center`}
      >
        <div className="flex items-center">
          <div
            className="w-8 h-8 rounded-full mr-2 flex items-center justify-center"
            style={{ backgroundColor: primary }}
          >
            <span className="text-white font-bold">C</span>
          </div>
          <span className="font-bold text-lg">ColorDesign</span>
        </div>

        <nav className="hidden md:flex space-x-6">
          {["Home", "Features", "Pricing", "About", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className="hover:opacity-80 transition-opacity"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex space-x-3">
          <button style={styles.secondaryButton} className="px-3 py-1 text-sm">
            Sign In
          </button>
          <button style={styles.primaryButton} className="px-3 py-1 text-sm">
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={styles.heroSection}
        className="py-16 px-6 md:px-12 flex flex-col items-center text-center"
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Design Beautiful Color Palettes
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          Create, explore, and share stunning color combinations for your next
          design project.
        </p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <button
            style={getButtonStyle("#ffffff")}
            className="px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
          </button>
          <button
            style={{
              ...getButtonStyle("transparent"),
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
            }}
            className="px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            See Examples
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className={`${spacingClass}`}>
        <div className={`mb-12 ${contentAlignmentClass}`}>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Why Choose Our Platform
          </h2>
          <p style={styles.mutedText} className="max-w-2xl mx-auto">
            Powerful tools and features to help you create the perfect color
            palette for your projects.
          </p>
        </div>

        <div className={`grid ${gridColumnsClass} gap-8`}>
          {[
            {
              title: "Color Picker",
              description:
                "Select colors with precision using our advanced color picker tool.",
              icon: "🎨",
            },
            {
              title: "Palette Generator",
              description:
                "Generate harmonious color palettes automatically from images.",
              icon: "🖼️",
            },
            {
              title: "Design Preview",
              description:
                "See your colors in action with real-time UI component previews.",
              icon: "👁️",
            },
          ].map((feature, i) => (
            <div
              key={i}
              style={styles.card}
              className={`p-6 ${contentAlignmentClass} ${shadowDepthClass} transition ${animationSpeedClass} hover:-translate-y-1`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3
                className="text-xl font-bold mb-2"
                style={{
                  color: i === 0 ? primary : i === 1 ? secondary : accent,
                }}
              >
                {feature.title}
              </h3>
              <p style={styles.mutedText}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{ backgroundColor: secondary }}
        className="py-16 px-6 md:px-12 text-white text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to Create Beautiful Color Palettes?
        </h2>
        <p className="mb-8 max-w-2xl mx-auto">
          Join thousands of designers who are creating stunning color
          combinations with our tools.
        </p>
        <button
          style={getButtonStyle(accent)}
          className={`px-6 py-3 rounded-lg font-medium transition ${animationSpeedClass} hover:opacity-90`}
        >
          Start Free Trial
        </button>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p style={styles.mutedText} className="max-w-2xl mx-auto">
            Hear from designers who love our color palette tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              quote:
                "This tool has completely transformed my design workflow. The color palettes I create now are so much more harmonious.",
              author: "Sarah J.",
              role: "UX Designer",
            },
            {
              quote:
                "I use ColorDesign every day in my work. It's intuitive, powerful, and saves me so much time.",
              author: "Michael T.",
              role: "Web Developer",
            },
          ].map((testimonial, i) => (
            <div key={i} style={styles.card} className="p-6">
              <p className="mb-4 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full mr-3 flex items-center justify-center"
                  style={{ backgroundColor: i === 0 ? primary : secondary }}
                >
                  <span className="text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-bold">{testimonial.author}</div>
                  <div style={styles.mutedText} className="text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer} className="py-12 px-6 md:px-12 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full mr-2 bg-white flex items-center justify-center">
                <span style={{ color: primary }} className="font-bold">
                  C
                </span>
              </div>
              <span className="font-bold text-lg">ColorDesign</span>
            </div>
            <p className="text-sm opacity-80">
              Create beautiful color palettes for your design projects.
            </p>
          </div>

          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Examples", "Documentation"],
            },
            {
              title: "Resources",
              links: ["Blog", "Tutorials", "Support", "FAQ"],
            },
            {
              title: "Company",
              links: ["About", "Careers", "Contact", "Privacy"],
            },
          ].map((section, i) => (
            <div key={i}>
              <h3 className="font-bold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm opacity-80 hover:opacity-100"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white border-opacity-20 mt-8 pt-8 text-sm opacity-70 text-center">
          © 2025 ColorDesign. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
