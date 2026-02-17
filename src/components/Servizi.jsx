import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Import aggiunto per Supabase
import { Camera, Shield, Phone, Settings, Zap, ChevronRight, ChevronLeft, X, Send, Loader2, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import './Servizi.css';

const serviziData = [
  { id: 1, icon: <Camera />, title: 'Videosorveglianza', desc: 'Installazione telecamere IP ad alta risoluzione. Monitoraggio h24 direttamente su smartphone e tablet.' },
  { id: 2, icon: <Shield />, title: 'Sistemi Allarme', desc: 'Centraline anti-intrusione di ultima generazione, sensori perimetrali e protezione totale via App.' },
  { id: 3, icon: <Phone />, title: 'Citofonia & Video', desc: 'Montaggio e riparazione di citofoni e videocitofoni smart connessi.' },
  { id: 4, icon: <Settings />, title: 'Automazioni cancelli', desc: 'Installazione motori per cancelli a battente e scorrevoli. Automazione serrande.' },
  { id: 5, icon: <Zap />, title: 'Impianti Elettrici', desc: 'Realizzazione e manutenzione di impianti elettrici civili e industriali a norma di legge.' },
  { id: 6, icon: <Zap />, title: 'Fotovoltaico', desc: 'Installazione e manutenzione pannelli fotovoltaici per il risparmio energetico della tua casa.' },
  { id: 7, icon: <Settings />, title: 'Domotica Smart', desc: 'Rendi intelligente la tua casa con soluzioni Sonoff e Shelly: controllo luci, tapparelle e clima via App.' }
]; // <-- Ora c'è solo una chiusura corretta

export const Servizi = () => {
  const [selected, setSelected] = useState(serviziData[0]);
  const [currentImgNum, setCurrentImgNum] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    message: ''
  });

  useEffect(() => {
    emailjs.init("LpQANhD_Awvn_gFdD");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!privacyAccepted) return;
    setLoading(true);

    try {
      // 1. SALVATAGGIO SU SUPABASE (Nuova Tabella Preventivi)
      const { error: supabaseError } = await supabase
        .from('preventivi')
        .insert([{ 
            servizio: selected.title,
            nome_cliente: formData.user_name,
            email_cliente: formData.user_email, 
            telefono_cliente: formData.user_phone,
            messaggio: formData.message 
        }]);

      if (supabaseError) throw supabaseError;

      // 2. INVIO EMAILJS (Esistente)
      const templateParams = {
        servizio: selected.title,
        user_name: formData.user_name,
        user_email: formData.user_email,
        user_phone: formData.user_phone,
        message: formData.message,
        reply_to: formData.user_email
      };

      await emailjs.send('service_kio59pe', 'template_0tslim7', templateParams, 'LpQANhD_Awvn_gFdD');

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsModalOpen(false);
        setPrivacyAccepted(false);
        setFormData({ user_name: '', user_email: '', user_phone: '', message: '' });
      }, 3000);

    } catch (error) {
      alert("Errore Processo: " + (error.text || "Errore nel database o nella connessione"));
    } finally {
      setLoading(false);
    }
  };

  const getImgPath = (num) => {
    const ext = num === 1 ? 'png' : 'jpg';
    return `/${num}.${ext}`; 
  };

  return (
    <div className="cyber-container fade">
      <h2 className="cyber-main-title">SOLUZIONI CYBER-TECNOLOGICHE</h2>
      
      <div className="cyber-grid-layout main-services-layout">
        <div className="cyber-icons-grid">
          {serviziData.map((s) => (
            <div key={s.id} className={`cyber-icon-box ${selected.id === s.id ? 'active' : ''}`} onClick={() => setSelected(s)}>
              <div className="cube-wrapper"><div className="cube-icon">{s.icon}</div></div>
              <span>{s.title}</span>
            </div>
          ))}
        </div>

        <div className="cyber-info-panel">
          <div className="panel-header">UNITÀ DI CONTROLLO: {selected.title.toUpperCase()}</div>
          <div className="panel-content">
            <h3>DESCRIZIONE TECNICA</h3>
            <div className="status-line"></div>
            <p>{selected.desc}</p>
            <button className="panel-btn" onClick={() => setIsModalOpen(true)}>
              RICHIEDI PREVENTIVO <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="cyber-photo-carousel">
          <div className="carousel-frame">
            <img src={getImgPath(currentImgNum)} alt="Lavoro" className="carousel-img" />
            <div className="carousel-controls">
              <button onClick={() => setCurrentImgNum(p => p <= 1 ? 11 : p - 1)} className="ctrl-btn"><ChevronLeft/></button>
              <button onClick={() => setCurrentImgNum(p => p >= 11 ? 1 : p + 1)} className="ctrl-btn"><ChevronRight/></button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="preventivo-overlay">
          <div className="preventivo-modal glass-card">
            {!submitted ? (
              <>
                <button className="close-modal" onClick={() => setIsModalOpen(false)}><X /></button>
                <h3 style={{color: '#00e5ff'}}>CONTATTA S&S ELECTRONICS</h3>
                <p style={{fontSize: '0.8rem', opacity: 0.7, marginBottom: '20px'}}>Servizio: {selected.title}</p>
                
                <form onSubmit={handleSubmit} className="preventivo-form">
                  <div className="input-group"><input type="text" placeholder="Tuo Nome" required value={formData.user_name} onChange={(e) => setFormData({...formData, user_name: e.target.value})} /></div>
                  <div className="input-group"><input type="email" placeholder="La tua Email" required value={formData.user_email} onChange={(e) => setFormData({...formData, user_email: e.target.value})} /></div>
                  <div className="input-group"><input type="tel" placeholder="Telefono" required value={formData.user_phone} onChange={(e) => setFormData({...formData, user_phone: e.target.value})} /></div>
                  <div className="input-group"><textarea placeholder="Dettagli richiesta..." rows="3" required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea></div>

                  <div className="privacy-consent-wrapper">
                    <label className="cyber-checkbox-label">
                      <input type="checkbox" required checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} />
                      <span className="cyber-custom-checkbox"></span>
                      <span className="privacy-text">Accetto il trattamento dei dati personali (GDPR)</span>
                    </label>
                  </div>

                  <button type="submit" className="send-form-btn" disabled={loading || !privacyAccepted}>
                    {loading ? <><Loader2 className="animate-spin" size={18} /> INVIO...</> : <><Send size={18} /> INVIA RICHIESTA</>}
                  </button>
                </form>
              </>
            ) : (
              <div className="success-message" style={{textAlign: 'center', padding: '20px'}}>
                <CheckCircle size={48} color="#00e5ff" style={{margin: '0 auto 15px'}} />
                <h3 style={{color: '#00e5ff'}}>RICHIESTA INVIATA!</h3>
                <p>Grazie {formData.user_name}, Silvio ti risponderà a breve.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
