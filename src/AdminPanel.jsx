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
    const sub = supabase.channel("admin-global")
      .on("postgres_changes", { event: "*", schema: "public", table: "chats" }, () => fetchChats())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => fetchChats()) // Aggiorna contatore quando arriva un messaggio
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  useEffect(() => {
    if (!selectedChat) { setMessages([]); return; }
    fetchMessages(selectedChat.id);
    const msgSub = supabase.channel(`chat_${selectedChat.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${selectedChat.id}` }, 
      (payload) => setMessages((prev) => [...prev, payload.new]))
      .subscribe();
    
    // Quando apri una chat, segna i messaggi come letti
    markAsRead(selectedChat.id);

    return () => supabase.removeChannel(msgSub);
  }, [selectedChat]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const fetchChats = async () => {
    // Carichiamo le chat e includiamo il conteggio dei messaggi non letti (sender user e is_read false)
    const { data: chatsData } = await supabase.from("chats").select("*").order("created_at", { ascending: false });
    
    const chatsWithCount = await Promise.all((chatsData || []).map(async (chat) => {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: 'exact', head: true })
        .eq("chat_id", chat.id)
        .eq("sender", "user")
        .eq("is_read", false);
      return { ...chat, unreadCount: count || 0 };
    }));

    setChats(chatsWithCount);
  };

  const fetchMessages = async (id) => {
    const { data } = await supabase.from("messages").select("*").eq("chat_id", id).order("created_at", { ascending: true });
    setMessages(data || []);
  };

  const markAsRead = async (id) => {
    await supabase.from("messages").update({ is_read: true }).eq("chat_id", id).eq("sender", "user");
    fetchChats(); // Aggiorna la sidebar per togliere il numerino
  };

  const sendReply = async () => {
    if (!reply.trim() || !selectedChat) return;
    const { error } = await supabase.from("messages").insert([{ chat_id: selectedChat.id, text: reply.trim(), sender: "admin", is_read: false }]);
    if (!error) setReply("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedChat) return;
    setUploading(true);
    try {
      const filePath = `${selectedChat.id}/${Date.now()}_${file.name}`;
      await supabase.storage.from("preventivi").upload(filePath, file);
      const { data: { publicUrl } } = supabase.storage.from("preventivi").getPublicUrl(filePath);
      await supabase.from("messages").insert([{ chat_id: selectedChat.id, text: `📄 Preventivo: ${file.name}`, sender: "admin", file_url: publicUrl, is_read: false }]);
    } catch (err) { console.error(err); } finally { setUploading(false); }
  };

  const deleteChat = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Eliminare definitivamente?")) {
      await supabase.from("chats").delete().eq("id", id);
      if (selectedChat?.id === id) setSelectedChat(null);
      fetchChats();
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>Richieste Chat</h3>
          </div>
          <div className="chat-list">
            {chats.map((chat) => (
              <div key={chat.id} className={`chat-card ${selectedChat?.id === chat.id ? "active" : ""}`} onClick={() => setSelectedChat(chat)}>
                <div className="chat-card-body">
                  <div className="avatar">
                    {chat.user_name?.[0] || "U"}
                    {chat.unreadCount > 0 && <span className="unread-dot">{chat.unreadCount}</span>}
                  </div>
                  <div className="info">
                    <h4>{chat.user_name}</h4>
                    <p>{chat.unreadCount > 0 ? `${chat.unreadCount} nuovi messaggi` : chat.user_email}</p>
                  </div>
                </div>
                <button className="delete-mini" onClick={(e) => deleteChat(chat.id, e)}>×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Main Area */}
        <div className="chat-window">
          {selectedChat ? (
            <>
              <div className="chat-window-header">
                <h4>{selectedChat.user_name}</h4>
              </div>
              <div className="message-list">
                {messages.map((m, index) => (
                  <div key={m.id || index} className={`message-wrapper ${m.sender}`}>
                    <div className="message-bubble">
                      <small className="msg-index">#{index + 1}</small>
                      {m.text}
                      {m.file_url && (
                        <a href={m.file_url} target="_blank" rel="noreferrer" className="pdf-link">
                          PDF Preventivo 📥
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
              <div className="chat-input-area">
                <label className="attach-btn">
                  <input type="file" onChange={handleFileUpload} hidden />
                  {uploading ? "..." : "📎"}
                </label>
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // ✅ Blocca submit implicito
                      sendReply();
                    }
                  }}
                  placeholder="Scrivi un messaggio o invia un preventivo..."
                />
                <button type="button" onClick={sendReply} className="send-btn">➤</button> {/* ✅ Evita submit implicito */}
              </div>
            </>
          ) : (
            <div className="placeholder">Seleziona un cliente per iniziare</div>
          )}
        </div>
      </div>
    </div>
  );
}