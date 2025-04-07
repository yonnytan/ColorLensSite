import React from "react";

export function DashboardTemplate({
  colorMap,
  config = {},
  layoutOptions = {},
}) {
  // Set default values for config
  const {
    showHeader = true,
    showSidebar = true,
    showFeatures = true,
    showFooter = true,
  } = config;

  // Set default values for layoutOptions
  const {
    spacing = "normal",
    typography = "default",
    density = "medium",
    containerWidth = "standard",
    cornerRadius = "medium",
    shadowDepth = "medium",
    animationSpeed = "medium",
    contentAlignment = "left",
    cardStyle = "default",
    buttonStyle = "default",
    imageRatio = "16:9",
    gridColumns = "3",
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

  // Combine classes
  const spacingClass = getSpacingClass();
  const typographyClass = getTypographyClass();
  const densityClass = getDensityClass();
  const containerWidthClass = getContainerWidthClass();
  const contentAlignmentClass = getContentAlignmentClass();
  const cornerRadiusClass = getCornerRadiusClass();
  const shadowDepthClass = getShadowDepthClass();
  const animationSpeedClass = getAnimationSpeed();
  const gridColumnsClass = getGridColumnsClass();

  // Colors for styling
  const {
    primary = "#1e40af",
    secondary = "#4f46e5",
    accent = "#f59e0b",
    background = "#ffffff",
    text = "#111827",
    muted = "#6b7280",
    border = "#e5e7eb",
    success = "#10b981",
    error = "#ef4444",
    warning = "#f59e0b",
  } = colorMap;

  // Dashboard content styles
  const containerStyle = {
    backgroundColor: background,
    color: text,
  };

  const sidebarStyle = {
    backgroundColor: primary,
    color: "#ffffff",
  };

  const headerStyle = {
    backgroundColor: background,
    borderBottom: `1px solid ${border}`,
    color: text,
  };

  // Apply card style based on the cardStyle option
  const getCardStyle = () => ({
    backgroundColor: background,
    color: text,
    ...(cardStyle === "bordered" && { border: `1px solid ${border}` }),
    ...(cardStyle === "glass" && {
      backgroundColor: `${background}80`,
      backdropFilter: "blur(8px)",
      borderTop: `1px solid rgba(255, 255, 255, 0.4)`,
      borderLeft: `1px solid rgba(255, 255, 255, 0.3)`,
      borderRight: `1px solid rgba(255, 255, 255, 0.2)`,
      borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
      boxShadow: `0 4px 30px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.3)`,
    }),
  });

  // Apply button style based on the buttonStyle option
  const getButtonStyle = () => ({
    ...(buttonStyle === "filled" && {
      backgroundColor: primary,
      color: "#ffffff",
    }),
    ...(buttonStyle === "outlined" && {
      backgroundColor: "transparent",
      border: `1px solid ${primary}`,
      color: primary,
    }),
    ...(buttonStyle === "text-only" && {
      backgroundColor: "transparent",
      color: primary,
    }),
    ...(buttonStyle === "default" && {
      backgroundColor: primary,
      color: "#ffffff",
    }),
  });

  const cardStyleProps = getCardStyle();
  const buttonStyleProps = getButtonStyle();

  const buttonHoverStyle = {
    backgroundColor: primary,
    color: "#ffffff",
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
  };

  const secondaryButtonStyle = {
    backgroundColor: secondary,
    color: "#ffffff",
  };

  const secondaryButtonHoverStyle = {
    backgroundColor: secondary,
    color: "#ffffff",
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
  };

  const mutedTextStyle = {
    color: muted,
  };

  const accentTextStyle = {
    color: accent,
  };

  return (
    <div
      className={`dashboard-template h-full w-full flex flex-col ${typographyClass}`}
      style={{ backgroundColor: background, color: text }}
    >
      <div className={`flex flex-col h-full w-full ${containerWidthClass}`}>
        {/* Header */}
        {showHeader && (
          <header
            style={headerStyle}
            className={`${densityClass} px-4 flex items-center justify-between ${contentAlignmentClass}`}
          >
            <div className="flex items-center">
              <div className="mr-4">
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-3 py-1 rounded-md border text-sm"
                  style={{ borderColor: border, color: text }}
                />
              </div>
              <div className="flex space-x-1">
                <button
                  className="px-2 py-1 rounded text-xs border hover:bg-gray-100 transition-colors"
                  style={{
                    borderColor: border,
                    color: text,
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => console.log("Today filter clicked")}
                >
                  Today
                </button>
                <button
                  className="px-2 py-1 rounded text-xs border hover:bg-gray-100 transition-colors"
                  style={{
                    borderColor: border,
                    color: text,
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => console.log("Week filter clicked")}
                >
                  Week
                </button>
                <button
                  className="px-2 py-1 rounded text-xs border hover:bg-gray-100 transition-colors"
                  style={{
                    borderColor: border,
                    color: text,
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => console.log("Month filter clicked")}
                >
                  Month
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-5 w-5 rounded bg-gray-200"></div>
                <div
                  className="absolute -top-1 -right-1 h-3 w-3 rounded-full"
                  style={{ backgroundColor: accent }}
                ></div>
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            </div>
          </header>
        )}

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          {showSidebar && (
            <div
              style={sidebarStyle}
              className={`w-64 flex-shrink-0 flex flex-col ${spacingClass} ${shadowDepthClass} ${cornerRadiusClass} ${typographyClass}`}
            >
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-white/20 mr-3"></div>
                <h1 className="text-xl font-bold">Dashboard</h1>
              </div>

              <nav className="space-y-1">
                {[
                  { name: "Dashboard", active: true },
                  { name: "Analytics", active: false },
                  { name: "Projects", active: false },
                  { name: "Reports", active: false },
                  { name: "Settings", active: false },
                ].map((item) => (
                  <a
                    key={item.name}
                    href="#"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.active
                        ? "bg-white/20 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      console.log(`${item.name} menu item clicked`);
                    }}
                  >
                    {item.name === "Dashboard" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    )}
                    {item.name === "Analytics" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    )}
                    {item.name === "Projects" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    )}
                    {item.name === "Reports" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    )}
                    {item.name === "Settings" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                    {item.name}
                  </a>
                ))}
              </nav>

              <div className="mt-auto">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-full bg-white/20 mr-3"></div>
                  <div>
                    <div className="font-medium">John Doe</div>
                    <div className="text-xs opacity-70">Product Manager</div>
                  </div>
                </div>

                <button
                  style={secondaryButtonHoverStyle}
                  className="w-full py-2 rounded-md text-center font-medium hover:opacity-90 transition-opacity"
                  onClick={() => console.log("Logout clicked")}
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Main */}
          <main
            className={`flex-1 overflow-auto relative ${spacingClass} ${contentAlignmentClass}`}
          >
            {/* Welcome section */}
            <div className={`mb-6 ${contentAlignmentClass}`}>
              <h2 className="text-xl font-bold mb-1">Good morning, John</h2>
              <p style={mutedTextStyle} className="text-sm">
                Here's what's happening with your projects today
              </p>
            </div>

            {/* Stats */}
            <div className={`grid ${gridColumnsClass} gap-4 mb-6`}>
              {[
                { title: "Projects", value: "12", change: "+2" },
                { title: "Tasks", value: "32", change: "-4" },
                { title: "Pending", value: "8", change: "+0" },
                { title: "Completed", value: "24", change: "+6" },
              ].map((stat, index) => (
                <div
                  key={index}
                  style={cardStyleProps}
                  className={`${cornerRadiusClass} ${shadowDepthClass} p-4 transition ${animationSpeedClass} hover:translate-y-[-2px]`}
                >
                  <div
                    style={mutedTextStyle}
                    className="text-sm font-medium mb-2"
                  >
                    {stat.title}
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div
                      className="text-xs font-medium"
                      style={{
                        color: stat.change.startsWith("+") ? success : error,
                      }}
                    >
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity & Tasks */}
            {showFeatures && (
              <div className={`grid ${gridColumnsClass} gap-4`}>
                <div className="col-span-1 md:col-span-2">
                  <div
                    style={cardStyleProps}
                    className={`${cornerRadiusClass} ${shadowDepthClass} overflow-hidden transition ${animationSpeedClass} hover:translate-y-[-2px]`}
                  >
                    <div
                      className={`border-b ${densityClass} px-4 font-medium`}
                      style={{ borderColor: border }}
                    >
                      Recent Activity
                    </div>
                    <div className="divide-y" style={{ borderColor: border }}>
                      {[
                        {
                          action: "New task assigned",
                          description: "UI design for mobile app",
                          time: "10 min ago",
                        },
                        {
                          action: "Comment added",
                          description: "Mark commented on dashboard redesign",
                          time: "1 hour ago",
                        },
                        {
                          action: "Task completed",
                          description: "Homepage wireframe designs",
                          time: "3 hours ago",
                        },
                        {
                          action: "New team member",
                          description: "Sara Johnson joined the design team",
                          time: "1 day ago",
                        },
                      ].map((activity, index) => (
                        <div
                          key={index}
                          className={`${densityClass} px-4 flex`}
                        >
                          <div className="mr-3">
                            <div
                              className="h-8 w-8 rounded-full flex items-center justify-center text-white"
                              style={{ backgroundColor: secondary }}
                            >
                              {activity.action[0]}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">{activity.action}</div>
                            <div className="text-sm" style={mutedTextStyle}>
                              {activity.description}
                            </div>
                            <div className="text-xs" style={mutedTextStyle}>
                              {activity.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-1">
                  <div
                    style={cardStyleProps}
                    className={`${cornerRadiusClass} ${shadowDepthClass} overflow-hidden transition ${animationSpeedClass} hover:translate-y-[-2px]`}
                  >
                    <div
                      className={`border-b ${densityClass} px-4 font-medium`}
                      style={{ borderColor: border }}
                    >
                      Upcoming Tasks
                    </div>
                    <div className="divide-y" style={{ borderColor: border }}>
                      {[
                        {
                          task: "Team meeting",
                          time: "11:00 AM",
                          priority: "high",
                        },
                        {
                          task: "Project review",
                          time: "2:00 PM",
                          priority: "medium",
                        },
                        {
                          task: "Design handoff",
                          time: "4:30 PM",
                          priority: "medium",
                        },
                        {
                          task: "Client presentation",
                          time: "Tomorrow, 10:00 AM",
                          priority: "high",
                        },
                      ].map((task, index) => (
                        <div key={index} className={`${densityClass} px-4`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{task.task}</div>
                              <div className="text-sm" style={mutedTextStyle}>
                                {task.time}
                              </div>
                            </div>
                            <div
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor:
                                  task.priority === "high"
                                    ? error
                                    : task.priority === "medium"
                                    ? warning
                                    : success,
                                color: "#ffffff",
                              }}
                            >
                              {task.priority}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      className={`${densityClass} px-4 flex justify-center border-t`}
                      style={{ borderColor: border }}
                    >
                      <button
                        style={buttonStyleProps}
                        className="text-sm font-medium hover:underline"
                        onClick={() => console.log("View all tasks clicked")}
                      >
                        View all tasks
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Projects */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Current Projects</h3>
                <button
                  style={buttonHoverStyle}
                  className="text-sm px-3 py-1 rounded-md hover:opacity-90 transition-opacity"
                  onClick={() => console.log("New Project clicked")}
                >
                  New Project
                </button>
              </div>

              <div
                className="overflow-hidden border rounded-lg"
                style={cardStyleProps}
              >
                <table
                  className="min-w-full divide-y"
                  style={{ borderColor: border }}
                >
                  <thead>
                    <tr style={{ backgroundColor: border + "30" }}>
                      <th
                        className={`text-left ${densityClass} px-4 font-medium`}
                      >
                        Project Name
                      </th>
                      <th
                        className={`text-left ${densityClass} px-4 font-medium`}
                      >
                        Status
                      </th>
                      <th
                        className={`text-left ${densityClass} px-4 font-medium`}
                      >
                        Progress
                      </th>
                      <th
                        className={`text-left ${densityClass} px-4 font-medium`}
                      >
                        Due Date
                      </th>
                      <th
                        className={`text-right ${densityClass} px-4 font-medium`}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: border }}>
                    {[
                      {
                        name: "Website Redesign",
                        status: "In Progress",
                        progress: 75,
                        date: "Sep 15, 2023",
                      },
                      {
                        name: "Mobile App Development",
                        status: "Planning",
                        progress: 25,
                        date: "Oct 5, 2023",
                      },
                      {
                        name: "Marketing Campaign",
                        status: "Completed",
                        progress: 100,
                        date: "Aug 28, 2023",
                      },
                      {
                        name: "Brand Identity",
                        status: "In Progress",
                        progress: 60,
                        date: "Sep 20, 2023",
                      },
                    ].map((project, index) => (
                      <tr key={index}>
                        <td className={`${densityClass} px-4`}>
                          <div className="font-medium">{project.name}</div>
                        </td>
                        <td className={`${densityClass} px-4`}>
                          <span
                            className="inline-block text-xs px-2 py-1 rounded-full"
                            style={{
                              backgroundColor:
                                project.status === "Completed"
                                  ? success + "20"
                                  : project.status === "In Progress"
                                  ? warning + "20"
                                  : secondary + "20",
                              color:
                                project.status === "Completed"
                                  ? success
                                  : project.status === "In Progress"
                                  ? warning
                                  : secondary,
                            }}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td className={`${densityClass} px-4`}>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${project.progress}%`,
                                  backgroundColor: primary,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs">{project.progress}%</span>
                          </div>
                        </td>
                        <td className={`${densityClass} px-4`}>
                          <span className="text-sm">{project.date}</span>
                        </td>
                        <td className={`${densityClass} px-4 text-right`}>
                          <button
                            className="text-sm px-2 py-1 rounded border mr-1 hover:bg-gray-100 transition-colors"
                            style={{
                              borderColor: border,
                              color: text,
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              console.log(`Edit ${project.name} clicked`)
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="text-sm px-2 py-1 rounded hover:opacity-90 transition-opacity"
                            style={{
                              backgroundColor: secondary,
                              color: "#ffffff",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              console.log(`View ${project.name} clicked`)
                            }
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>

        {/* Footer */}
        {showFooter && (
          <footer
            style={{ borderTop: `1px solid ${border}`, color: muted }}
            className={`${densityClass} px-4 text-sm flex-shrink-0`}
          >
            <div className="flex justify-between items-center">
              <div>&copy; 2025 Dashboard Inc. All rights reserved.</div>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Privacy Policy clicked");
                  }}
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Terms of Service clicked");
                  }}
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Contact clicked");
                  }}
                >
                  Contact
                </a>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
