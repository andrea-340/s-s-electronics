import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabaseClient";
import "./Admin.css";

export default function AdminPanel() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    fetchChats();
    const sub = supabase
      .channel("admin-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats" },
        () => fetchChats(),
      )
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }
    fetchMessages(selectedChat.id);
    const msgSub = supabase
      .channel(`chat-${selectedChat.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${selectedChat.id}`,
        },
        (payload) => {
          setMessages((prev) => {
            const exists = prev.find((m) => m.id === payload.new.id);
            return exists ? prev : [...prev, payload.new];
          });
        },
      )
      .subscribe();
    return () => supabase.removeChannel(msgSub);
  }, [selectedChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChats = async () => {
    const { data } = await supabase
      .from("chats")
      .select("*")
      .order("created_at", { ascending: false });
    setChats(data || []);
  };

  const fetchMessages = async (id) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", id)
      .order("created_at", { ascending: true });
    setMessages(data || []);
  };

  const sendReply = async () => {
    const textToSend = reply.trim();
    if (!textToSend || !selectedChat) return;
    const { error } = await supabase
      .from("messages")
      .insert([
        { chat_id: selectedChat.id, text: textToSend, sender: "admin" },
      ]);
    if (!error) setReply("");
  };

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file || !selectedChat) return;
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${selectedChat.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("preventivi")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("preventivi").getPublicUrl(filePath);

      await supabase.from("messages").insert([
        {
          chat_id: selectedChat.id,
          text: `Allegato: ${file.name}`,
          sender: "admin",
          file_url: publicUrl,
        },
      ]);
    } catch (error) {
      alert("Errore caricamento file");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const deleteChat = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Vuoi eliminare questa chat per sempre?")) {
      const { error } = await supabase.from("chats").delete().eq("id", id);
      if (!error) {
        setChats((prev) => prev.filter((c) => c.id !== id));
        if (selectedChat?.id === id) setSelectedChat(null);
      }
    }
  };

  return (
    <div className="admin-glass-container">
      <aside className="admin-list-sidebar">
        <div className="sidebar-admin-info">
          <h3>S&S Control Panel</h3>
        </div>
        <div className="admin-chat-scroll">
          {chats.map((c) => (
            <div
              key={c.id}
              className={`admin-chat-item ${selectedChat?.id === c.id ? "active" : ""}`}
              onClick={() => setSelectedChat(c)}
            >
              <div className="user-avatar-circle">
                {c.user_name ? c.user_name[0].toUpperCase() : "?"}
              </div>
              <div className="chat-preview-text">
                <span className="user-name">
                  {c.user_name || "Utente Anonimo"}
                </span>
                <span className="last-msg-preview">
                  ID: {String(c.id).slice(0, 5)}
                </span>
              </div>
              <button
                className="delete-chat-btn"
                onClick={(e) => deleteChat(c.id, e)}
              >
                ELIMINA
              </button>
            </div>
          ))}
        </div>
      </aside>

      <main className="admin-chat-main">
        {selectedChat ? (
          <>
            <header className="admin-chat-header">
              <div className="user-avatar-circle">
                {selectedChat.user_name
                  ? selectedChat.user_name[0].toUpperCase()
                  : "?"}
              </div>
              <h4>{selectedChat.user_name}</h4>
            </header>

            <div className="admin-messages-container">
              {messages.map((m, i) => (
                <div
                  key={m.id || i}
                  className={`admin-msg-row ${m.sender === "admin" ? "admin" : "user"}`}
                >
                  <div className="admin-msg-bubble">
                    {m.file_url ? (
                      <a
                        href={m.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="file-link"
                      >
                        📄 {m.text}
                      </a>
                    ) : (
                      <p>{m.text}</p>
                    )}
                    <span className="admin-msg-time">
                      {m.created_at
                        ? new Date(m.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="admin-input-footer">
              <label
                className="file-upload-label"
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  padding: "0 10px",
                }}
              >
                {uploading ? "..." : "📎"}
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  style={{ display: "none" }}
                />
              </label>
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Rispondi..."
                onKeyDown={(e) => e.key === "Enter" && sendReply()}
              />
              <button onClick={sendReply}>INVIA</button>
            </div>
          </>
        ) : (
          <div className="admin-empty-screen">
            <h2>Seleziona una chat</h2>
          </div>
        )}
      </main>
    </div>
  );
}
