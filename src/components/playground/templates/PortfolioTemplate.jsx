import React from "react";

export function PortfolioTemplate({
  colorMap,
  config = {},
  layoutOptions = {},
}) {
  const { primary, secondary, accent, background, text, muted, border } =
    colorMap;

  // Set default values for config
  const {
    showHeader = true,
    showHero = true,
    showStats = true,
    showProjects = true,
    showSkills = true,
    showTestimonials = true,
    showCTA = true,
    showFooter = true,
  } = config;

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

  // Dynamic styles with hover effects
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
    accentButton: getButtonStyle(accent),
    heroSection: {
      background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
      color: "#ffffff",
    },
    card: {
      backgroundColor: background,
      border: `1px solid ${border}`,
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    },
    projectCard: {
      backgroundColor: background,
      border: `1px solid ${border}`,
      borderRadius: "0.5rem",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer",
    },
    sectionHeading: {
      color: text,
      borderBottom: `2px solid ${primary}`,
      display: "inline-block",
    },
    tag: {
      backgroundColor: `${secondary}22`,
      color: secondary,
      borderRadius: "9999px",
    },
    footer: {
      backgroundColor: `${primary}08`,
      borderTop: `1px solid ${border}`,
    },
    socialIcon: {
      backgroundColor: primary,
      color: "#ffffff",
      borderRadius: "0.375rem",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
    },
    highlight: {
      color: accent,
    },
    mutedText: {
      color: muted,
    },
  };

  const getCardStyle = () => {
    switch (cardStyle) {
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
      default:
        return styles.card;
    }
  };

  return (
    <div
      style={styles.container}
      className="min-h-[600px] flex flex-col overflow-auto"
    >
      {/* Header */}
      {showHeader && (
        <header
          style={styles.header}
          className="py-4 px-6 flex justify-between items-center"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              <span style={{ color: primary }} className="font-bold text-xl">
                J
              </span>
            </div>
            <span className="font-bold text-xl">John Doe</span>
          </div>

          <nav className="hidden md:flex space-x-6">
            {["Home", "Projects", "About", "Skills", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:opacity-80 transition-opacity"
              >
                {item}
              </a>
            ))}
          </nav>

          <button
            style={styles.primaryButton}
            className="px-4 py-2 hidden md:block"
          >
            Download Resume
          </button>
        </header>
      )}

      {/* Hero Section */}
      {showHero && (
        <section
          style={styles.heroSection}
          className="py-16 px-6 md:px-12 flex flex-col md:flex-row items-center"
        >
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              UI/UX Designer & Developer
            </h1>
            <p className="text-xl mb-6 opacity-90">
              I create beautiful, functional, and user-centered digital
              experiences that bring your ideas to life.
            </p>
            <div className="flex space-x-4">
              <button style={styles.primaryButton} className="px-6 py-3">
                View My Work
              </button>
              <button style={styles.secondaryButton} className="px-6 py-3">
                Contact Me
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/20 overflow-hidden border-4 border-white/30"></div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {showStats && (
        <section
          className="py-12 px-6 md:px-12 bg-opacity-5"
          style={{ backgroundColor: `${primary}10` }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { value: "50+", label: "Projects Completed" },
              { value: "5+", label: "Years Experience" },
              { value: "30+", label: "Happy Clients" },
              { value: "12", label: "Design Awards" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{ color: primary }}
                >
                  {stat.value}
                </div>
                <div style={styles.mutedText}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {showProjects && (
        <section className="py-16 px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Featured Projects
            </h2>
            <p style={styles.mutedText} className="max-w-2xl mx-auto">
              Explore some of my recent works that showcase my design approach
              and technical skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "E-commerce Redesign",
                category: "UI/UX Design",
                tags: ["Web Design", "Shopify", "Branding"],
              },
              {
                title: "Finance Mobile App",
                category: "App Development",
                tags: ["iOS", "Android", "FinTech"],
              },
              {
                title: "Healthcare Dashboard",
                category: "Web Application",
                tags: ["React", "UI Design", "Data Viz"],
              },
              {
                title: "Travel Booking Platform",
                category: "Full Stack Design",
                tags: ["Web App", "UX Research", "UI Design"],
              },
            ].map((project, i) => (
              <div
                key={i}
                style={getCardStyle()}
                className="overflow-hidden rounded-lg shadow transition-transform hover:-translate-y-1"
              >
                <div
                  className="h-48 bg-cover bg-center"
                  style={{
                    backgroundColor:
                      i % 2 === 0 ? `${primary}22` : `${secondary}22`,
                    backgroundImage: `linear-gradient(45deg, ${primary}22, ${secondary}33)`,
                  }}
                />
                <div className="p-6">
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{ backgroundColor: `${primary}15`, color: primary }}
                  >
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold mt-3 mb-2">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${secondary}15`,
                          color: secondary,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    style={{ color: primary }}
                    className="font-medium text-sm hover:underline flex items-center"
                  >
                    View Project
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {showSkills && (
        <section
          className="py-16 px-6 md:px-12"
          style={{ backgroundColor: `${secondary}08` }}
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">My Skills</h2>
            <p style={styles.mutedText} className="max-w-2xl mx-auto">
              I specialize in creating user-centered digital experiences through
              a combination of design and development skills.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              "UI Design",
              "UX Research",
              "Prototyping",
              "User Testing",
              "HTML/CSS",
              "JavaScript",
              "React",
              "Figma",
              "Adobe XD",
              "Sketch",
              "Typography",
              "Color Theory",
            ].map((skill, i) => (
              <div
                key={i}
                style={getCardStyle()}
                className="p-4 text-center transition-transform hover:-translate-y-1 rounded-lg"
              >
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {showTestimonials && (
        <section className="py-16 px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Client Testimonials
            </h2>
            <p style={styles.mutedText} className="max-w-2xl mx-auto">
              Here's what some of my clients have to say about working with me.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote:
                  "John transformed our ideas into a beautiful, functional website that perfectly captures our brand identity. Highly recommended!",
                name: "Sarah Johnson",
                company: "Bloom Marketing",
              },
              {
                quote:
                  "Working with John was a pleasure. Their attention to detail and user-centered approach resulted in an app our customers love.",
                name: "Michael Chen",
                company: "FinTech Solutions",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                style={getCardStyle()}
                className="p-6 rounded-lg shadow"
              >
                <p className="mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-full mr-3"
                    style={{ backgroundColor: i === 0 ? primary : secondary }}
                  ></div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div style={styles.mutedText} className="text-sm">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {showCTA && (
        <section
          style={styles.heroSection}
          className="py-16 px-6 md:px-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Let's Work Together
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Have a project in mind? I'm currently available for freelance work.
          </p>
          <button
            style={styles.accentButton}
            className="px-6 py-3 rounded-lg font-medium"
          >
            Get In Touch
          </button>
        </section>
      )}

      {/* Footer */}
      {showFooter && (
        <footer style={styles.footer} className="py-12 px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2">
                  <span style={{ color: primary }} className="font-bold">
                    J
                  </span>
                </div>
                <span className="font-bold">John Doe</span>
              </div>
              <p className="text-sm opacity-80">UI/UX Designer & Developer</p>
            </div>

            <div className="flex gap-4">
              {["Twitter", "Dribbble", "LinkedIn", "Instagram"].map(
                (platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    {platform[0]}
                  </a>
                )
              )}
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm opacity-60">
            © 2025 John Doe. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
}
