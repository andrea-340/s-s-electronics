import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Slider from "./components/Slider";
import Header from "./components/header";
import Chat from "./components/Chat";
import AdminPanel from "./AdminPanel";
import "./App.css";
import silvioAvatar from "./assets/silvio-elettricista.png";

const ClientLayout = ({ activeSection, setActiveSection }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        `script[src="${script.src}"]`,
      );
      if (existingScript) document.body.removeChild(existingScript);
    };
  }, []);

  return (
    <div className="site-wrapper">
      <Slider />
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="main-content">
        <div className="container">
          {activeSection === "home" && (
            <div className="home-grid-layout fade">
              <div className="left-column">
                <div className="glass-card presentation-card">
                  <div className="avatar-container">
                    <div className="silvio-avatar-frame">
  <img
    src={silvioAvatar} // Usa la variabile importata
    alt="Silvio S&S"
  />
</div>
                    <div className="welcome-bubble-glass">
                      <p>
                        Benvenuto! Sono Silvio. Da 35 anni al vostro servizio.
                      </p>
                      <span className="bubble-tip-glass"></span>
                    </div>
                  </div>
                  <h1 className="hero-title">
                    S&S <span>ELECTRONICS</span>
                  </h1>
                  <p className="hero-subtitle">DI SILVIO ALTOMARE</p>
                  <div className="divider-premium"></div>

                  <div className="contact-info-box">
                    <p>
                      <strong>📍 Indirizzo:</strong> Via Domenico Francesco
                      Parisi, 1, 87056 Santo Stefano di Rogliano CS
                    </p>
                    <p>
                      <strong>📞 Telefono:</strong> 347 195 7502
                    </p>
                    <p>
                      <strong>🕒 Orari:</strong> Chiuso · Apre mer alle ore
                      07:30
                    </p>
                    <p>
                      <strong>📍 Provincia:</strong> Provincia di Cosenza
                    </p>
                  </div>
                </div>

                <div className="glass-card map-card-small">
                  <div className="map-container-wrapper">
                    <iframe
                      title="S&S Electronics Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3087.234345634567!2d16.3245!3d39.1956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133f1f3b3b3b3b3b%3A0x3b3b3b3b3b3b3b3b!2sVia%20Domenico%20Francesco%20Parisi%2C%201%2C%2087056%20Santo%20Stefano%20di%20Rogliano%20CS!5e0!3m2!1sit!2sit!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </div>

              <div className="right-column">
                <div className="glass-card reviews-live-card">
                  <h3 className="map-title">⭐ RECENSIONI CLIENTI</h3>
                  <div
                    className="elfsight-app-346e1d07-98e0-4b75-bd44-fef638852115"
                    data-elfsight-app-lazy
                  ></div>
                  <div className="assistenza-box-premium">
                    <h4>🛠️ ASSISTENZA DIRETTA</h4>
                    <p>
                      Cellulare: <strong>347 195 7502</strong>
                    </p>
                  </div>
                  <div className="review-footer">
                    <a
                      href="https://g.page/r/Ce3TrhEBFSfTEAE/review"
                      target="_blank"
                      rel="noreferrer"
                      className="google-reviews-btn-premium"
                    >
                      ✍️ SCRIVI UNA RECENSIONE
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "servizi" && (
            <div className="glass-card wide fade">
              <h2 className="section-title">ECCELLENZA TECNOLOGICA</h2>
              <div className="services-grid-premium">
                {/* Videosorveglianza */}
                <div className="service-card-premium">
                  <img
                    src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=500&q=80"
                    alt="Videosorveglianza"
                  />
                  <div className="service-overlay">
                    📹 <h3>Videosorveglianza & Assistenza Telecamere</h3>
                  </div>
                </div>

                {/* Sicurezza */}
                <div className="service-card-premium">
                  <img
                    src="https://www.metacommerce.it/2429-thickbox_default/kit-allarme-completo-inim-515-tastiera-joy-gr-xdt200hm-ivy-e-batterie.jpg"
                    alt="Allarmi"
                  />
                  <div className="service-overlay">
                    🚨 <h3>Installazione Allarmi</h3>
                  </div>
                </div>

                {/* Citofoni */}
                <div className="service-card-premium">
                  <img
                    src="https://professionisti.bticino.it/sites/default/files/styles/portale_pro_immagine_singola_/public/2025-03/IMG_VDE_Guida-alla-scelta.jpg?itok=FYHKLAtZ"
                    alt="Citofoni"
                  />
                  <div className="service-overlay">
                    📞 <h3>Montaggio Citofoni & Videocitofoni</h3>
                  </div>
                </div>

                {/* Impianti Elettrici */}
                <div className="service-card-premium">
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=500&q=80"
                    alt="Impianti Elettrici"
                  />
                  <div className="service-overlay">
                    ⚡ <h3>Impianti Elettrici Professionali</h3>
                  </div>
                </div>

                {/* Domotica */}
                <div className="service-card-premium">
                  <img
                    src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=500&q=80"
                    alt="Domotica"
                  />
                  <div className="service-overlay">
                    🏠 <h3>Domotica & Configurazione Sonoff</h3>
                  </div>
                </div>

                {/* Fotovoltaico */}
                <div className="service-card-premium">
                  <img
                    src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=500&q=80"
                    alt="Fotovoltaico"
                  />
                  <div className="service-overlay">
                    ☀️ <h3>Impianti Fotovoltaici</h3>
                  </div>
                </div>

                {/* Antennistica */}
                <div className="service-card-premium">
                  <img
                    src="https://www.tesser.it/wp-content/uploads/2022/09/FILTRI-5G-ANTI-INTERFERENZE.jpg"
                    alt="Antenne"
                  />
                  <div className="service-overlay">
                    📡 <h3>Antennistica</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "chat" && <Chat />}
        </div>
      </main>

      {/* FOOTER MODIFICATO COME DA SCREENSHOT */}
      <footer className="bottom-banner-glass">
        <div className="banner-content-premium">
          <span>
            © 2026 Tutti i diritti riservati <strong>S&S ELECTRONICS</strong> di
            Silvio Altomare | 📞 Assistenza: 347 195 7502 | <strong>FAQ</strong>
          </span>
        </div>
      </footer>
    </div>
  );
};

function App() {
  const [activeSection, setActiveSection] = useState("home");
  return (
    <Routes>
      <Route path="/admin" element={<AdminPanel />} />
      <Route
        path="/"
        element={
          <ClientLayout
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
