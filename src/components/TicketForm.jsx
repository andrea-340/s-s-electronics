import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import emailjs from '@emailjs/browser';
import { Send, User, Mail, Calendar, MessageSquare, ShieldCheck, Phone, AlertTriangle, CheckCircle } from 'lucide-react';
import './TicketForm.css';

export const TicketForm = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]); 
  const [isSlotOccupied, setIsSlotOccupied] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false); // Aggiunto per sicurezza
  
  const [formData, setFormData] = useState({
    nome_cognome: '',
    email: '',
    telefono: '',
    datetime: '',
    description: ''
  });

  useEffect(() => {
    fetchBookedSlots();
    const channel = supabase
      .channel('realtime-tickets')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'tickets' }, 
        () => fetchBookedSlots()
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const fetchBookedSlots = async () => {
    const { data } = await supabase.from('tickets').select('data_intervento');
    if (data) setBookedSlots(data.map(t => t.data_intervento));
  };

  const handleDateChange = (val) => {
    setFormData({...formData, datetime: val});
    const exists = bookedSlots.some(slot => slot === val);
    setIsSlotOccupied(exists);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!privacyAccepted) return; // Blocco sicurezza
    setLoading(true);

    const { data: checkData } = await supabase
      .from('tickets')
      .select('id')
      .eq('data_intervento', formData.datetime);

    if (checkData && checkData.length > 0) {
      alert("SPIACENTI: Un altro cliente ha appena prenotato questo orario. Scegline un altro.");
      setIsSlotOccupied(true);
      setLoading(false);
      fetchBookedSlots();
      return;
    }

    const { error: supabaseError } = await supabase
      .from('tickets')
      .insert([{ 
          nome_cognome: formData.nome_cognome,
          cliente_email: formData.email, 
          telefono: formData.telefono,
          data_intervento: formData.datetime, 
          descrizione_problema: formData.description 
      }]);

    if (supabaseError) {
      setLoading(false);
      return alert("Errore Database: " + supabaseError.message);
    }

    try {
      const templateParams = {
        nome_cognome: formData.nome_cognome,
        cliente_email: formData.email,
        telefono: formData.telefono,
        data_ora_intervento: formData.datetime,
        messaggio: formData.description,
        reply_to: formData.email 
      };

      await emailjs.send('service_kio59pe', 'template_0nrpuw5', templateParams, 'LpQANhD_Awvn_gFdD');
      setSubmitted(true);
    } catch (error) {
      alert("Errore Invio Email: " + error.text);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="cyber-form-container success-state">
      <div className="cyber-border-glow"></div>
      <div className="success-content">
        <CheckCircle size={60} className="success-icon" />
        <h3 className="cyber-title">RICHIESTA RICEVUTA</h3>
        <p className="cyber-subtitle">Grazie {formData.nome_cognome.split(' ')[0]}, Silvio ti ricontatterà al numero {formData.telefono}.</p>
        <button onClick={() => setSubmitted(false)} className="cyber-btn-secondary">NUOVO TICKET</button>
      </div>
    </div>
  );

  return (
    <div className="cyber-form-container">
      <div className="cyber-border-glow"></div>
      <div className="cyber-header">
        <div className="cyber-logo">🛠️</div>
        <h2 className="cyber-title">CENTRO ASSISTENZA TECNICA</h2>
        <h3 className="cyber-brand">S&S ELECTRONICS</h3>
        <p className="cyber-tagline">Modulo Rapido Apertura Guasti</p>
      </div>

      <form onSubmit={handleSubmit} className="cyber-form">
        <div className="input-group">
          <User className="input-icon" size={18} />
          <input required type="text" placeholder="Nome e Cognome" value={formData.nome_cognome} onChange={(e) => setFormData({...formData, nome_cognome: e.target.value})} />
        </div>
        <div className="input-group">
          <Mail className="input-icon" size={18} />
          <input required type="email" placeholder="Indirizzo Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
        </div>
        <div className="input-group">
          <Phone className="input-icon" size={18} />
          <input required type="tel" placeholder="Numero di Telefono" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
        </div>
        <div className={`input-group ${isSlotOccupied ? 'slot-error' : ''}`}>
          <Calendar className="input-icon" size={18} />
          <input required type="datetime-local" className="custom-datetime" value={formData.datetime} onChange={(e) => handleDateChange(e.target.value)} />
        </div>

        {isSlotOccupied && <div className="status-badge occupied"><AlertTriangle size={14} /> Silvio è già impegnato in questo orario.</div>}

        <div className="input-group">
          <MessageSquare className="input-icon" size={18} />
          <textarea required rows="3" placeholder="Dettaglio Guasto" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
        </div>

        <div className="privacy-consent-wrapper">
          <label className="cyber-checkbox-label">
            <input type="checkbox" required checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} />
            <span className="cyber-custom-checkbox"></span>
            <span className="privacy-text">Acconsento al trattamento dei dati personali (GDPR)</span>
          </label>
        </div>

        <button type="submit" disabled={loading || isSlotOccupied || !privacyAccepted} className={`cyber-btn-submit ${(isSlotOccupied || !privacyAccepted) ? 'btn-disabled' : ''}`}>
          {loading ? 'ELABORAZIONE...' : isSlotOccupied ? 'ORARIO OCCUPATO' : 'INVIA RICHIESTA ➜'}
        </button>

        <div className="cyber-footer">
          <ShieldCheck size={12} />
          <span>Sincronizzazione Realtime Attiva</span>
        </div>
      </form>
    </div>
  );
};