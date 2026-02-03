import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Chat() {
  const [userName, setUserName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startChat = async () => {
    if (!userName.trim()) return;

    // 1. Crea la sessione di chat
    const { data, error } = await supabase
      .from("chats")
      .insert([{ user_name: userName }])
      .select()
      .single();

    if (!error && data) {
      const newChatId = data.id;
      setChatId(newChatId);
      setIsActive(true);

      // 2. Invia il messaggio di Intro dell'assistenza subito dopo l'apertura
      const welcomeText = `Gentile ${userName}, grazie per aver contattato S&S Electronics. Un nostro tecnico specializzato prenderà in carico la sua richiesta a breve. Come possiamo aiutarla oggi?`;

      await supabase.from("messages").insert([
        {
          chat_id: newChatId,
          text: welcomeText,
          sender: "admin", // Appare come S&S Electronics
        },
      ]);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !chatId) return;
    const msgToSend = newMsg;
    setNewMsg("");
    await supabase
      .from("messages")
      .insert([{ chat_id: chatId, text: msgToSend, sender: "user" }]);
  };

  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });
      setMessages(data || []);
    };
    loadMessages();

    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => setMessages((prev) => [...prev, payload.new]),
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [chatId]);

  return (
    <div className="chat-wrapper-pro fade">
      {!isActive ? (
        <div className="chat-login-fullscreen">
          <div className="login-box">
            <div className="icon-badge">💬</div>
            <h2>S&S ELECTRONICS</h2>
            <p>
              Avvia una sessione di assistenza prioritaria con un nostro tecnico
              specializzato. Inserisci il tuo nome per iniziare:
            </p>
            <input
              type="text"
              placeholder="Inserisci il tuo nome completo..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startChat()}
            />
            <button onClick={startChat}>APRI CHAT</button>
          </div>
        </div>
      ) : (
        <div className="chat-interface-main">
          <div className="chat-sidebar">
            <div className="sidebar-header">SUPPORT CENTER</div>
            <div className="sidebar-user-info">
              <div className="user-avatar">S&S</div>
              <div>
                <strong>S&S</strong>
                <p>Technical Director</p>
              </div>
            </div>
            <div className="sidebar-status">
              <span className="pulse-dot"></span> Online e disponibile
            </div>
          </div>

          <div className="chat-main-area">
            <header className="chat-top-nav">
              <h3>Sessione ID: #SS-{chatId?.toString().slice(0, 5)}</h3>
              <div className="encrypted-tag">🔒 Crittografato</div>
            </header>

            <div className="chat-messages-scroll">
              {messages.map((m, i) => (
                <div key={i} className={`msg-row ${m.sender}`}>
                  <div className="msg-bubble">
                    <span className="sender-label">
                      {m.sender === "user" ? "Tu" : "S&S Electronics"}
                    </span>

                    {m.file_url ? (
                      <div className="file-box">
                        <p>{m.text}</p>
                        <a
                          href={m.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="download-link"
                        >
                          📄 Scarica Allegato
                        </a>
                      </div>
                    ) : (
                      <p>{m.text}</p>
                    )}

                    <span className="msg-time">
                      {new Date(m.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="chat-footer-input">
              <input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Scrivi qui la tua richiesta tecnica..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>INVIA ➤</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
