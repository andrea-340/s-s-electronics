import React from "react";

export default function Header({ activeSection, setActiveSection }) {
  const menuItems = [
    { id: "home", label: "Home" },
    { id: "servizi", label: "Servizi" },
    { id: "chat", label: "Supporto Live" },
  ];

  return (
    <nav className="navbar">
      <div className="logo" style={{ fontSize: "1.5rem", fontWeight: "800" }}>
        S&S{" "}
        <span style={{ color: "var(--primary)", fontWeight: "300" }}>
          ELECTRONICS
        </span>
      </div>
      <div className="nav-links">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={activeSection === item.id ? "active-btn" : ""}
            onClick={() => setActiveSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
