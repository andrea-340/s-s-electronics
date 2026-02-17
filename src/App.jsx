import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header";
import { TicketForm } from "./components/TikcketForm";
import { Servizi } from "./components/Servizi";
import AdminPanel from "./AdminPanel";
import "./App.css";
import silvioAvatar from "./assets/silvio-elettricista.png";
import AIAssistant from "./components/AIAssistant"; 

const ClientLayout = ({ activeSection, setActiveSection }) => {
  const [showTicket, setShowTicket] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src="${script.src}"]`);
      if (existingScript) document.body.removeChild(existingScript);
    };
  }, []);

  return (
    <div className="site-wrapper">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className="main-content">
        <div className="container">
          
          {/* --- SEZIONE HOME --- */}
          {activeSection === "home" && (
            <div className="home-grid-layout fade">
              <div className="left-column">
                <div className="glass-card presentation-card">
                  <div className="avatar-container">
                    <div className="silvio-avatar-frame">
                      <img src={silvioAvatar} alt="Silvio S&S" />
                    </div>
                    <div className="welcome-bubble-glass">
                      <p><strong>Benvenuto! Sono Silvio.</strong><br />
  Da oltre 35 anni metto la mia esperienza al vostro servizio. 
  Soluzioni concrete, tecnologia hi-tech e lavori fatti a regola d’arte.</p>
                      <span className="bubble-tip-glass"></span>
                    </div>
                  </div>
                  <h1 className="hero-title">S&S <span>ELECTRONICS</span></h1>
                  <p className="hero-subtitle">DI SILVIO ALTOMARE</p>
                  <div className="divider-premium"></div>
                  <div className="contact-info-box">
                    <p><strong>📍 Indirizzo:</strong> Via Parisi, 1, 87056 Santo Stefano di Rogliano CS</p>
                    <p><strong>📞 Telefono:</strong> 347 195 7502</p>
                    <p><strong>🕒 Orari:</strong> Chiuso · Apre mer alle ore 07:30</p>
                  </div>
                </div>

                <div className="glass-card map-card-small">
                  <div className="map-container-wrapper">
                    <iframe
                      title="S&S Electronics Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3087.668583568758!2d16.3244247!3d39.2231267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133f1b621e7655ef%3A0x6732730111ae93ed!2sS%26S%20Electronics!5e0!3m2!1sit!2sit!4v1700000000000"
                      width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                    ></iframe>
                  </div>
                </div>

                <div className="glass-card assistenza-card-left" style={{ marginTop: '20px', padding: '15px' }}>
                  <button 
                    onClick={() => setShowTicket(true)}
                    className="service-action-btn"
                    style={{ width: '100%', padding: '18px', borderRadius: '10px', cursor: 'pointer' }}
                  > 
                    🛠️ APRI TICKET ASSISTENZA
                  </button>
                </div>
              </div>

              <div className="right-column">
                <div className="glass-card reviews-live-card">
                  <h3 className="map-title">⭐ RECENSIONI CLIENTI</h3>
                  <div className="elfsight-app-346e1d07-98e0-4b75-bd44-fef638852115" data-elfsight-app-lazy></div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "servizi" && <Servizi />}
        </div>
      </main>

      {/* MODALE TICKET */}
      {showTicket && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '90%', maxWidth: '500px' }}>
            <button onClick={() => setShowTicket(false)} style={{ position: 'absolute', top: '-40px', right: 0, color: 'white', background: 'none', border: 'none' }}>[ CHIUDI X ]</button>
            <TicketForm />
          </div>
        </div>
      )}

      {/* L'ASSISTENTE AI VA QUI - Dentro il layout cliente */}
      <AIAssistant visible={true} />

      <footer className="bottom-banner-glass">
        <div className="banner-content-premium">
          <span>© 2026 <strong>S&S ELECTRONICS</strong> | 📞 347 195 7502</span>
        </div>
      </footer>
    </div>
  );
};

// UNICA FUNZIONE APP
function App() {
  const [activeSection, setActiveSection] = useState("home");
  
  return (
    <Routes>
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/" element={<ClientLayout activeSection={activeSection} setActiveSection={setActiveSection} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;