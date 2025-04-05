import React from "react";

export function EcommerceTemplate({
  colorMap,
  config = {},
  layoutOptions = {},
}) {
  const {
    primary,
    secondary,
    accent,
    background,
    text,
    muted,
    border,
    success,
    error,
  } = colorMap;

  // Set default values for config
  const {
    showHeader = true,
    showHero = true,
    showFeatures = true,
    showFooter = true,
  } = config;

  // Set default values for layoutOptions
  const {
    spacing = "normal",
    typography = "default",
    density = "medium",
    cornerRadius = "medium",
    buttonStyle = "default",
    cardStyle = "default",
    animationSpeed = "medium",
  } = layoutOptions;

  // Define spacing classes based on the spacing option
  const getSpacingClass = () => {
    switch (spacing) {
      case "compact":
        return "p-2 gap-2";
      case "spacious":
        return "p-6 gap-6";
      case "normal":
      default:
        return "p-4 gap-4";
    }
  };

  // Define animation speed classes
  const getAnimationSpeed = () => {
    switch (animationSpeed) {
      case "slow":
        return "duration-500";
      case "fast":
        return "duration-150";
      case "none":
        return "duration-0";
      case "medium":
      default:
        return "duration-300";
    }
  };

  // Define corner radius classes
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

  // Define typography classes based on the typography option
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

  // Define component density classes
  const getDensityClass = () => {
    switch (density) {
      case "low":
        return "py-4";
      case "high":
        return "py-1";
      case "medium":
      default:
        return "py-2";
    }
  };

  // Combine classes
  const spacingClass = getSpacingClass();
  const typographyClass = getTypographyClass();
  const densityClass = getDensityClass();
  const animationSpeedClass = getAnimationSpeed();
  const cornerRadiusClass = getCornerRadiusClass();

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
    primaryButton: {
      backgroundColor: primary,
      color: "#ffffff",
      borderRadius: "0.375rem",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
    },
    secondaryButton: {
      backgroundColor: secondary,
      color: "#ffffff",
      borderRadius: "0.375rem",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
    },
    outlineButton: {
      backgroundColor: "transparent",
      border: `1px solid ${border}`,
      color: text,
      borderRadius: "0.375rem",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
    },
    card: {
      backgroundColor: background,
      border: `1px solid ${border}`,
      borderRadius: "0.375rem",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    productCard: {
      backgroundColor: background,
      border: `1px solid ${border}`,
      borderRadius: "0.375rem",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer",
    },
    pill: {
      backgroundColor: `${accent}22`,
      color: accent,
      borderRadius: "9999px",
      cursor: "pointer",
    },
    saleTag: {
      backgroundColor: error,
      color: "#ffffff",
      borderRadius: "0.25rem",
      cursor: "pointer",
    },
    newTag: {
      backgroundColor: success,
      color: "#ffffff",
      borderRadius: "0.25rem",
      cursor: "pointer",
    },
    categoryTag: {
      backgroundColor: `${primary}22`,
      color: primary,
      borderRadius: "0.25rem",
      cursor: "pointer",
    },
    searchInput: {
      backgroundColor: background,
      border: `1px solid ${border}`,
      borderRadius: cornerRadius === "none" ? "0" : "0.375rem",
      color: text,
    },
    iconButton: {
      color: text,
      cursor: "pointer",
    },
    footer: {
      backgroundColor: background,
      borderTop: `1px solid ${border}`,
    },
    mutedText: {
      color: muted,
    },
    starRating: {
      color: accent,
    },
    linkText: {
      color: primary,
      cursor: "pointer",
    },
  };

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

  // Define button styles
  const primaryButtonStyle = getButtonStyle(primary);
  const secondaryButtonStyle = getButtonStyle(secondary);
  const accentButtonStyle = getButtonStyle(accent);

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

  const cardStyleProps = getCardStyle();

  return (
    <div
      style={styles.container}
      className={`min-h-[600px] flex flex-col ${typographyClass}`}
    >
      {/* Announcement Bar */}
      <div
        className="bg-black text-white py-2 px-4 text-center text-sm cursor-pointer hover:bg-gray-900 transition-colors"
        onClick={() => console.log("Announcement bar clicked")}
      >
        <span>
          Free shipping on all orders over $50 | Use code WELCOME20 for 20% off
        </span>
      </div>

      {/* Header */}
      {showHeader && (
        <header
          style={styles.header}
          className={`${densityClass} px-4 md:px-8`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo */}
            <div
              className="text-2xl font-bold cursor-pointer"
              style={{ color: primary }}
              onClick={() => console.log("Logo clicked")}
            >
              Color<span style={{ color: secondary }}>Store</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md relative">
              <input
                type="text"
                placeholder="Search for products..."
                style={styles.searchInput}
                className="w-full py-2 px-4 pl-10"
                onChange={(e) =>
                  console.log("Search input changed:", e.target.value)
                }
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke={muted}
                strokeWidth={1.5}
                onClick={() => console.log("Search icon clicked")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              {["Shop", "Categories", "Sale", "About", "Contact"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="hover:opacity-80 font-medium transition-opacity"
                    style={item === "Sale" ? { color: error } : {}}
                    onClick={(e) => {
                      e.preventDefault();
                      console.log(`${item} nav item clicked`);
                    }}
                  >
                    {item}
                  </a>
                )
              )}
            </nav>

            {/* Cart and Account Icons */}
            <div className="flex items-center space-x-4">
              <button
                style={styles.iconButton}
                className="relative hover:opacity-80 transition-opacity"
                onClick={() => console.log("Account icon clicked")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
              <button
                style={styles.iconButton}
                className="relative hover:opacity-80 transition-opacity"
                onClick={() => console.log("Cart icon clicked")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
                  style={{ backgroundColor: primary }}
                >
                  3
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden mt-4 flex justify-between items-center">
            <button
              className="p-1 flex items-center"
              style={styles.iconButton}
              onClick={() => console.log("Mobile menu button clicked")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              Menu
            </button>
            <div className="flex space-x-2">
              {["Shop", "Sale"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm hover:opacity-80"
                  style={item === "Sale" ? { color: error } : {}}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(`Mobile ${item} link clicked`);
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </header>
      )}

      {/* Hero Banner */}
      {showHero && (
        <section
          className="py-12 px-4 md:px-8 md:py-16 flex flex-col items-center text-center text-white"
          style={{
            background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
          }}
        >
          <div className="max-w-3xl mx-auto">
            <span
              style={styles.pill}
              className="px-3 py-1 text-sm inline-block mb-4"
              onClick={() => console.log("New Season pill clicked")}
            >
              New Season Collection
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Summer Essentials
            </h1>
            <p className="text-lg mb-8 opacity-90">
              Discover our latest collection of summer products. Fresh designs,
              vibrant colors, and premium quality.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                style={primaryButtonStyle}
                className="px-6 py-3 font-medium hover:opacity-90 transition-opacity"
                onClick={() => console.log("Shop Now button clicked")}
              >
                Shop Now
              </button>
              <button
                style={secondaryButtonStyle}
                className="px-6 py-3 font-medium hover:opacity-90 transition-opacity"
                onClick={() => console.log("Learn More button clicked")}
              >
                Learn More
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {showFeatures && (
        <section className={`py-12 ${spacingClass}`}>
          <h2 className="text-2xl font-bold mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                name: "Clothing",
                image: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://via.placeholder.com/300')`,
              },
              {
                name: "Accessories",
                image: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://via.placeholder.com/300')`,
              },
              {
                name: "Footwear",
                image: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://via.placeholder.com/300')`,
              },
              {
                name: "Home Goods",
                image: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://via.placeholder.com/300')`,
              },
            ].map((category, index) => (
              <div
                key={index}
                className="relative h-48 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                style={{
                  backgroundImage: category.image,
                  backgroundSize: "cover",
                }}
                onClick={() => console.log(`${category.name} category clicked`)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {category.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {showFeatures && (
        <section
          className={`py-12 ${spacingClass} bg-opacity-50`}
          style={{ backgroundColor: `${secondary}08` }}
        >
          <h2 className="text-2xl font-bold mb-8 text-center">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "Modern T-Shirt",
                price: "$29.99",
                oldPrice: "$39.99",
                rating: 4.5,
                image: `linear-gradient(rgba(0,0,0,0.02), rgba(0,0,0,0.02)), url('https://via.placeholder.com/300')`,
                tag: "sale",
              },
              {
                name: "Casual Jacket",
                price: "$89.99",
                rating: 4.8,
                image: `linear-gradient(rgba(0,0,0,0.02), rgba(0,0,0,0.02)), url('https://via.placeholder.com/300')`,
                tag: "new",
              },
              {
                name: "Designer Watch",
                price: "$199.99",
                rating: 5.0,
                image: `linear-gradient(rgba(0,0,0,0.02), rgba(0,0,0,0.02)), url('https://via.placeholder.com/300')`,
                tag: "best",
              },
              {
                name: "Leather Bag",
                price: "$149.99",
                rating: 4.3,
                image: `linear-gradient(rgba(0,0,0,0.02), rgba(0,0,0,0.02)), url('https://via.placeholder.com/300')`,
              },
            ].map((product, index) => (
              <div
                key={index}
                style={cardStyleProps}
                className={`rounded-lg p-4 transition ${animationSpeedClass} hover:-translate-y-1`}
                onClick={() => console.log(`${product.name} product clicked`)}
              >
                <div
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: product.image }}
                >
                  {product.tag && (
                    <div
                      className="absolute top-2 right-2 px-2 py-1 text-xs font-medium"
                      style={
                        product.tag === "sale"
                          ? styles.saleTag
                          : product.tag === "new"
                          ? styles.newTag
                          : styles.categoryTag
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`${product.tag.toUpperCase()} tag clicked`);
                      }}
                    >
                      {product.tag.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{product.name}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-bold">{product.price}</span>
                      {product.oldPrice && (
                        <span
                          className="ml-2 line-through text-sm"
                          style={styles.mutedText}
                        >
                          {product.oldPrice}
                        </span>
                      )}
                    </div>
                    <div
                      style={styles.starRating}
                      className="flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      style={primaryButtonStyle}
                      className="px-3 py-1 text-sm hover:bg-gray-50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(
                          `${product.name} Quick View button clicked`
                        );
                      }}
                    >
                      Quick View
                    </button>
                    <button
                      style={primaryButtonStyle}
                      className={`px-3 py-1 text-sm ${cornerRadiusClass}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Add ${product.name} to cart clicked`);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Promotion Banner */}
      {showFeatures && (
        <section
          className="py-12 px-4 md:px-8 text-white"
          style={{
            background: `linear-gradient(135deg, ${secondary} 0%, ${primary} 100%)`,
          }}
        >
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h2 className="text-xl md:text-3xl font-bold mb-2">
                Sign Up & Get 20% Off
              </h2>
              <p className="text-white text-opacity-90">
                Subscribe to our newsletter and receive a 20% discount code.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-md"
              />
              <button
                style={accentButtonStyle}
                className="px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
                onClick={() => console.log("Subscribe button clicked")}
              >
                Subscribe
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Trending Products */}
      {showFeatures && (
        <section className={`py-12 ${spacingClass}`}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Trending Products</h2>
            <p style={styles.mutedText} className="mb-4">
              Our most popular items based on sales
            </p>
            <button
              style={secondaryButtonStyle}
              className="px-6 py-2 font-medium hover:opacity-90 transition-opacity"
              onClick={() => console.log("View All Products button clicked")}
            >
              View All Products
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Summer Dress",
                price: "$59.99",
                ratings: 23,
                image: `url('https://via.placeholder.com/300')`,
              },
              {
                name: "Sports Shoes",
                price: "$79.99",
                ratings: 15,
                image: `url('https://via.placeholder.com/300')`,
              },
              {
                name: "Sunglasses",
                price: "$29.99",
                ratings: 42,
                image: `url('https://via.placeholder.com/300')`,
              },
              {
                name: "Smartwatch",
                price: "$129.99",
                ratings: 38,
                image: `url('https://via.placeholder.com/300')`,
              },
            ].map((product, index) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => console.log(`Trending ${product.name} clicked`)}
              >
                <div
                  className="h-48 bg-cover bg-center rounded-lg mb-3 hover:opacity-90 transition-opacity"
                  style={{ backgroundImage: product.image }}
                ></div>
                <h3 className="font-medium">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="font-bold">{product.price}</span>
                  <span style={styles.mutedText} className="text-sm">
                    {product.ratings} ratings
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      {showFooter && (
        <footer
          style={styles.footer}
          className={`py-12 ${spacingClass} mt-auto`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div
                className="text-xl font-bold mb-4 cursor-pointer"
                style={{ color: primary }}
                onClick={() => console.log("Footer logo clicked")}
              >
                Color<span style={{ color: secondary }}>Store</span>
              </div>
              <p className="mb-4" style={styles.mutedText}>
                Your one-stop destination for modern, high-quality products at
                affordable prices.
              </p>
              <div className="flex space-x-3">
                {["Twitter", "Facebook", "Instagram", "Pinterest"].map(
                  (social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: primary, color: "white" }}
                      onClick={(e) => {
                        e.preventDefault();
                        console.log(`${social} icon clicked`);
                      }}
                    >
                      {social[0]}
                    </a>
                  )
                )}
              </div>
            </div>
            {[
              {
                title: "Shop",
                links: ["New Arrivals", "Best Sellers", "Sale", "Collections"],
              },
              {
                title: "Customer Service",
                links: ["Contact Us", "Shipping", "Returns", "FAQ"],
              },
              {
                title: "About",
                links: ["Our Story", "Blog", "Careers", "Press"],
              },
            ].map((column, index) => (
              <div key={index}>
                <h3 className="font-bold mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="hover:text-primary transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log(`${link} footer link clicked`);
                        }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            className="pt-6 border-t text-center text-sm cursor-pointer hover:underline"
            style={{ borderColor: border, color: muted }}
            onClick={() => console.log("Copyright text clicked")}
          >
            © 2024 ColorStore. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
}
