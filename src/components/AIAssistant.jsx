import { useState } from "react";
import { MessageCircle, X, Send, Phone, Mail, Wrench, FileText } from "lucide-react";
import "./AIAssistant.css";

const AI_RESPONSES = {
  elettrico: "Realizziamo impianti elettrici certificati, quadri di controllo e manutenzione civile/industriale a norma.",
  allarme: "Proteggiamo la tua casa con sistemi Ajax e videosorveglianza IP h24 gestibile da smartphone.",
  cancello: "Specialisti in automazione CAME e FAAC. Ripariamo motori esistenti o installiamo nuovi kit completi.",
  citofono: "Installiamo videocitofoni smart connessi al Wi-Fi per rispondere da remoto tramite cellulare.",
  domotica: "Rendi la casa intelligente con Sonoff e Shelly: controllo luci, tapparelle e clima via App.",
  
  // LOGICA DISTINTA PER PREVENTIVI E ASSISTENZA
  preventivo: "Per nuovi lavori, scegli il servizio che ti interessa nella sezione 'SERVIZI' e clicca sul tasto 'RICHIEDI PREVENTIVO'. Riceverai una quotazione dettagliata via email.",
  assistenza: "Hai un guasto urgente? Vai nella sezione 'APRI TICKET' per prenotare subito un appuntamento tecnico. Silvio interverrà nell'orario scelto.",
  
  contatti: "Puoi parlare con Silvio al 📞 347 195 7502 o scrivere a 📧 altomaresilvio1974@gmail.com",
};

export default function AIAssistant({ visible }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Ciao! Sono l'assistente di S&S Electronics. Ti serve un preventivo per un nuovo lavoro o hai un guasto urgente?" }
  ]);
  const [input, setInput] = useState("");

  if (!visible) return null;

  const handleSend = () => {
    const text = input.trim().toLowerCase();
    if (!text) return;

    setMessages(prev => [...prev, { sender: "user", text: input }]);
    setInput("");

    let reply = "";

    // Logica di instradamento precisa
    if (text.includes("preventivo") || text.includes("costa") || text.includes("prezzo") || text.includes("nuovo lavoro")) {
      reply = AI_RESPONSES.preventivo;
    } else if (text.includes("guasto") || text.includes("rotto") || text.includes("assistenza") || text.includes("urgente") || text.includes("ticket") || text.includes("riparare")) {
      reply = AI_RESPONSES.assistenza;
    } else if (text.includes("contatto") || text.includes("chiama") || text.includes("telefono")) {
      reply = AI_RESPONSES.contatti;
    } else {
      // Cerca corrispondenze con i servizi
      const key = Object.keys(AI_RESPONSES).find(k => text.includes(k));
      reply = key 
        ? AI_RESPONSES[key] 
        : "Posso aiutarti con preventivi per nuovi impianti o assistenza guasti tramite Ticket. Cosa ti serve nello specifico?";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "ai", text: reply }]);
    }, 600);
  };

  return (
    <>
      <button className="ai-float-btn" onClick={() => setOpen(true)}>
        <MessageCircle size={28} />
      </button>

      {open && (
        <div className="ai-window">
          <div className="ai-header">
            <div className="ai-header-info">
              <span className="online-status"></span>
              <span>Supporto S&S Electronics</span>
            </div>
            <button onClick={() => setOpen(false)}><X size={20} /></button>
          </div>

          <div className="ai-messages">
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ${m.sender}`}>
                {m.text}
              </div>
            ))}
          </div>

          {/* SUGGERIMENTI RAPIDI (Novità) */}
          {!input && (
            <div className="ai-suggestions">
              <button onClick={() => setInput("Mi serve un preventivo")}>📝 Preventivo</button>
              <button onClick={() => setInput("Ho un guasto urgente")}>🚨 Guasto/Ticket</button>
            </div>
          )}

          <div className="ai-input-area">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Scrivi qui..."
              onKeyDown={e => e.key === "Enter" && handleSend()}
            />
            <button className="send-btn" onClick={handleSend}>
              <Send size={18} />
            </button>
          </div>
          
          <div className="ai-quick-contacts">
             <a href="tel:3471957502"><Phone size={12}/> Chiama</a>
             <a href="mailto:altomaresilvio1974@gmail.com"><Mail size={12}/> Email</a>
          </div>
        </div>
      )}
    </>
  );
}