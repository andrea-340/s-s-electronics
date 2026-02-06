import React, { useState } from "react";

export default function Header({ activeSection, setActiveSection }) {
  const [isOpen, setIsOpen] = useState(false); // Stato per il menu mobile

  const menuItems = [
    { id: "home", label: "Home" },
    { id: "servizi", label: "Servizi" },
    { id: "chat", label: "Supporto Live" },
  ];

  const handleNavClick = (id) => {
    setActiveSection(id);
    setIsOpen(false); // Chiude il menu dopo aver cliccato una voce
  };

  return (
    <nav className="navbar">
      <div className="logo" style={{ fontSize: "1.5rem", fontWeight: "800" }}>
        S&S{" "}
        <span style={{ color: "var(--primary)", fontWeight: "300" }}>
          ELECTRONICS
        </span>
      </div>

      {/* Pulsante Hamburger - visibile solo su Mobile via CSS */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Aggiungiamo la classe "open" se isOpen è true */}
      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={activeSection === item.id ? "active-btn" : ""}
            onClick={() => handleNavClick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
