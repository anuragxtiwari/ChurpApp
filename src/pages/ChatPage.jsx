// ✅ FILE: ChatPage.jsx
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

function getChatId(uid1, uid2) {
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [receiverUsername, setReceiverUsername] = useState("");
  const [chatId, setChatId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiverData, setReceiverData] = useState({ uid: "", name: "" });
  const [yourName, setYourName] = useState("");
  const [recentChats, setRecentChats] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setYourName(snap.data().name || "");
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (!currentUser) return;
    const ref = collection(db, "users", currentUser.uid, "userChats");
    const q = query(ref, orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((doc) => doc.data());
      setRecentChats(list);
    });
    return () => unsub();
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startChat = async () => {
    if (!receiverUsername.trim()) return;
    const usernameRef = doc(db, "usernames", receiverUsername.trim());
    const usernameSnap = await getDoc(usernameRef);
    if (!usernameSnap.exists()) return alert("User not found");

    const receiverUid = usernameSnap.data().uid;
    const userSnap = await getDoc(doc(db, "users", receiverUid));
    const receiverName = userSnap.exists() ? userSnap.data().name : receiverUsername;
    const chatId = getChatId(currentUser.uid, receiverUid);

    setReceiverData({ uid: receiverUid, name: receiverName });
    setChatId(chatId);

    const msgRef = collection(db, "chats", chatId, "messages");
    const q = query(msgRef, orderBy("createdAt"));
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((doc) => doc.data());
      setMessages(msgs);
    });
    return () => unsub();
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMsg = {
      text: message,
      sender: currentUser.uid,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, "chats", chatId, "messages"), newMsg);

    await Promise.all([
      setDoc(
        doc(db, "users", currentUser.uid, "userChats", chatId),
        {
          chatId,
          receiverUid: receiverData.uid,
          receiverName: receiverData.name,
          updatedAt: serverTimestamp(),
          unread: false,
        },
        { merge: true }
      ),
      setDoc(
        doc(db, "users", receiverData.uid, "userChats", chatId),
        {
          chatId,
          receiverUid: currentUser.uid,
          receiverName: yourName,
          updatedAt: serverTimestamp(),
          unread: true,
        },
        { merge: true }
      ),
    ]);
    setMessage("");
  };

  const openChatFromList = async (chat) => {
    setReceiverData({ uid: chat.receiverUid, name: chat.receiverName });
    setChatId(chat.chatId);
    await setDoc(
      doc(db, "users", currentUser.uid, "userChats", chat.chatId),
      { unread: false },
      { merge: true }
    );
    const q = query(collection(db, "chats", chat.chatId, "messages"), orderBy("createdAt"));
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((doc) => doc.data());
      setMessages(msgs);
    });
    return () => unsub();
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading) return <p>Loading...</p>;
  if (!currentUser) return null;

  return (
    <div className="chat-layout">
      <aside className="recent-chats">
        <h3>Recent Chats</h3>
        {recentChats.map((chat) => (
          <div key={chat.chatId} className="chat-item" onClick={() => openChatFromList(chat)}>
            <p className="chat-name">{chat.receiverName}</p>
            {chat.unread ? <span className="unread-badge">New</span> : <span className="unread-placeholder" />}
          </div>
        ))}
      </aside>

      <main className="chat-wrapper">
        <header className="chat-header">
          <h2>ChurpApp 🕊️</h2>
          <div className="chat-user-info">
            <p>Hello, <strong>{yourName}</strong></p>
            <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? "☀️ Light" : "🌙 Dark"}</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="start-chat">
          <input
            type="text"
            placeholder="Enter username to start chat"
            value={receiverUsername}
            onChange={(e) => setReceiverUsername(e.target.value)}
          />
          <button onClick={startChat}>{chatId ? "Chat Active" : "Start Chat"}</button>
        </div>

        {chatId && (
          <div className="chat-window">
            <div className="chat-title">
              <p>Chatting with <strong>{receiverData.name}</strong></p>
              <button onClick={() => setChatId(null)}>Close Chat</button>
            </div>
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-bubble ${msg.sender === currentUser.uid ? "sent" : "received"}`}>
                  <p>{msg.text}</p>
                  <small style={{ fontSize: "0.6rem", color: "#999" }}>
                    {msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </small>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>
            <form onSubmit={sendMessage} className="chat-input-bar">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
