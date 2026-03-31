import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ArrowRight, BadgeCheck, Clock3, MapPinned, Phone, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import Header from "./components/header";
import { TicketForm } from "./components/TicketForm";
import { Servizi } from "./components/Servizi";
import AdminPanel from "./AdminPanel";
import "./App.css";
import silvioAvatar from "./assets/silvio-elettricista.png";
import AIAssistant from "./components/AIAssistant"; 

const businessAddress = "Via Domenico Francesco Parisi, 1, 87056 Santo Stefano di Rogliano CS";
const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(businessAddress)}&output=embed`;
const mapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessAddress)}`;
const whatsappUrl = "https://wa.me/393471957502?text=Ciao%20Silvio%2C%20vorrei%20maggiori%20informazioni%20su%20un%20intervento.";

const featuredWorks = [
  { id: 1, image: "/1.png" },
  { id: 2, image: "/2.jpg" },
  { id: 3, image: "/3.jpg" },
  { id: 4, image: "/4.jpg" },
  { id: 5, image: "/5.jpg" },
  { id: 6, image: "/6.jpg" },
];

const serviceHighlights = [
  { value: "35+", label: "anni di esperienza sul territorio" },
  { value: "Diretto", label: "contatto con il tecnico" },
  { value: "Rapido", label: "supporto per preventivi e assistenza" },
];

const ClientLayout = ({ activeSection, setActiveSection }) => {
  const [showTicket, setShowTicket] = useState(false);
  const [currentWorkIndex, setCurrentWorkIndex] = useState(0);

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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentWorkIndex((prev) => (prev + 1) % featuredWorks.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="site-wrapper">
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenTicket={() => setShowTicket(true)}
      />

      <main className="main-content">
        <div className="container">
          {activeSection === "home" && (
            <section className="home-shell fade">
              <div className="hero-panel glass-card">
                <div className="hero-copy">
                  <span className="eyebrow">
                    <Sparkles size={16} />
                    Impianti, sicurezza e assistenza specializzata
                  </span>
                  <h1 className="hero-title">S&amp;S <span>ELECTRONICS</span></h1>
                  <p className="hero-subtitle">Tecnologia affidabile, installazioni curate e supporto diretto con Silvio Altomare.</p>
                  <p className="hero-description">
                    Da oltre 35 anni realizziamo impianti elettrici, allarmi, videosorveglianza, automazioni e soluzioni smart
                    con un approccio preciso, pulito e professionale in ogni fase del lavoro.
                  </p>
                  <div className="hero-actions">
                    <button className="primary-cta" onClick={() => setActiveSection("servizi")}>
                      Scopri i servizi
                      <ArrowRight size={18} />
                    </button>
                    <button className="secondary-cta" onClick={() => setShowTicket(true)}>
                      <Wrench size={18} />
                      Apri assistenza
                    </button>
                  </div>
                  <div className="hero-metrics">
                    <div className="metric-card">
                      <strong>35+</strong>
                      <span>Anni di esperienza</span>
                    </div>
                    <div className="metric-card">
                      <strong>Diretto</strong>
                      <span>Contatto con il tecnico</span>
                    </div>
                  </div>
                </div>

                <div className="hero-profile">
                  <div className="profile-card">
                    <div className="profile-frame">
                      <img src={silvioAvatar} alt="Silvio Altomare" />
                    </div>
                    <div className="profile-copy">
                      <p className="profile-kicker">Il tuo referente</p>
                      <h2>Silvio Altomare</h2>
                      <p>
                        Interventi eseguiti con attenzione ai dettagli, materiali affidabili e una consulenza concreta per casa,
                        attività e impianti professionali.
                      </p>
                    </div>
                  </div>
                  <div className="trust-list">
                    <div className="trust-item">
                      <BadgeCheck size={18} />
                      <span>Lavori eseguiti a regola d'arte</span>
                    </div>
                    <div className="trust-item">
                      <ShieldCheck size={18} />
                      <span>Soluzioni moderne e impianti sicuri</span>
                    </div>
                    <div className="trust-item">
                      <Clock3 size={18} />
                      <span>Assistenza e preventivi rapidi</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="home-grid-layout">
                <div className="info-column">
                  <div className="glass-card info-card">
                    <h3>Contatti e disponibilità</h3>
                    <div className="info-list">
                      <div className="info-row">
                        <MapPinned size={18} />
                        <span>Via Domenico Francesco Parisi, 1, 87056 Santo Stefano di Rogliano (CS)</span>
                      </div>
                      <div className="info-row">
                        <Phone size={18} />
                        <a href="tel:3471957502">347 195 7502</a>
                      </div>
                      <div className="info-row">
                        <Clock3 size={18} />
                        <span>Consulenza, sopralluoghi e assistenza su appuntamento</span>
                      </div>
                    </div>
                    <div className="info-highlight">
                      Operiamo con uno stile più ordinato e professionale: sopralluogo, proposta tecnica, esecuzione e supporto.
                    </div>
                  </div>

                  <div className="glass-card map-card-small">
                    <div className="card-head">
                      <h3>Dove siamo</h3>
                      <span>Area operativa</span>
                    </div>
                    <a
                      className="map-container-wrapper"
                      href={mapsDirectionsUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Apri la posizione di S&S Electronics su Google Maps"
                    >
                      <iframe
                        title="S&S Electronics Location"
                        src={mapsEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                      ></iframe>
                    </a>
                  </div>
                </div>

                <div className="glass-card reviews-live-card">
                  <div className="card-head">
                    <h3>Recensioni clienti</h3>
                    <span>Feedback reale</span>
                  </div>
                  <div className="reviews-widget-shell">
                    <div className="elfsight-app-346e1d07-98e0-4b75-bd44-fef638852115" data-elfsight-app-lazy></div>
                  </div>
                </div>
              </div>

              <div className="trust-strip glass-card">
                {serviceHighlights.map((item) => (
                  <div key={item.label} className="trust-stat">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <section className="showcase-section glass-card">
                <div className="section-intro">
                  <div>
                    <span className="section-kicker">Lavori realizzati</span>
                    <h2>Foto reali per mostrare come lavoriamo</h2>
                  </div>
                  <p>
                    Una selezione di immagini già presenti nel sito, organizzate in modo più professionale per raccontare meglio
                    la qualità degli interventi e la varietà dei servizi eseguiti.
                  </p>
                </div>
                <div className="works-carousel">
                  <article className="work-card featured-work-card">
                    <div className="work-image-shell featured-work-image-shell">
                      <img
                        src={featuredWorks[currentWorkIndex].image}
                        alt={`Lavoro realizzato ${currentWorkIndex + 1}`}
                        className="work-image"
                      />
                    </div>
                  </article>
                  <div className="works-carousel-nav">
                    {featuredWorks.map((work, index) => (
                      <button
                        key={work.id}
                        type="button"
                        className={`work-dot ${index === currentWorkIndex ? "active" : ""}`}
                        onClick={() => setCurrentWorkIndex(index)}
                        aria-label={`Mostra lavoro ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </section>

              <section className="business-section">
                <div className="glass-card cta-card">
                  <span className="section-kicker">Contatto rapido</span>
                  <h2>Vuoi un preventivo o hai bisogno di assistenza?</h2>
                  <p>
                    Puoi iniziare subito dal sito oppure scrivere direttamente su WhatsApp con un messaggio già impostato.
                  </p>
                  <div className="cta-actions">
                    <button className="primary-cta" onClick={() => setActiveSection("servizi")}>
                      Vai ai servizi
                      <ArrowRight size={18} />
                    </button>
                    <a className="whatsapp-cta" href={whatsappUrl} target="_blank" rel="noreferrer">
                      WhatsApp diretto
                    </a>
                  </div>
                  <div className="cta-note">Risposta rapida per sopralluoghi, preventivi e urgenze tecniche.</div>
                </div>
              </section>
            </section>
          )}

          {activeSection === "servizi" && <Servizi />}
        </div>
      </main>

      {showTicket && (
        <div className="modal-overlay">
          <div className="modal-shell">
            <TicketForm onClose={() => setShowTicket(false)} />
          </div>
        </div>
      )}

      <AIAssistant visible={true} />

      <footer className="bottom-banner-glass">
        <div className="banner-content-premium">
          <span>© 2026 <strong>S&amp;S ELECTRONICS</strong></span>
          <a href="tel:3471957502">347 195 7502</a>
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
      <Route path="/" element={<ClientLayout activeSection={activeSection} setActiveSection={setActiveSection} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
