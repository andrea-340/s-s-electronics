import React, { useState } from "react";
import { Menu, Phone, Wrench, X } from "lucide-react";

export default function Header({ activeSection, setActiveSection, onOpenTicket }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Home" },
    { id: "servizi", label: "Servizi" },
  ];

  const handleNavClick = (id) => {
    setActiveSection(id);
    setIsOpen(false); // Chiude il menu dopo aver cliccato una voce
  };

  return (
    <nav className="navbar">
      <button className="brand-block" onClick={() => handleNavClick("home")} type="button">
        <span className="brand-kicker">Silvio Altomare</span>
        <span className="logo">
          S&amp;S <span>ELECTRONICS</span>
        </span>
      </button>

      <div className="nav-desktop-meta">
        <a className="top-contact-link" href="tel:3471957502">
          <Phone size={16} />
          347 195 7502
        </a>
        <button className="nav-ticket-btn" onClick={onOpenTicket} type="button">
          <Wrench size={16} />
          Assistenza
        </button>
      </div>

      <button className="hamburger" onClick={() => setIsOpen(!isOpen)} type="button" aria-label="Apri menu">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

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
        <button className="mobile-ticket-btn" onClick={onOpenTicket} type="button">
          <Wrench size={16} />
          Apri ticket
        </button>
        <a className="mobile-phone-link" href="tel:3471957502">
          <Phone size={16} />
          Chiama ora
        </a>
      </div>
    </nav>
  );
}
