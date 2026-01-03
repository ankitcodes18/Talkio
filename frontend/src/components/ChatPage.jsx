import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const ChatPage = () => {
  const { user } = useAuth();
  const [file, setFile] = useState();
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const socket = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.current = io("https://talkio-1.onrender.com");

    socket.current.on("connect", () => {
      socket.current.emit("setUserOnline", user);
    });

    socket.current.on("allonlineusers", (allusers) => setAllUsers(allusers));

    const handleReceiveMessage = (msg) => setMessages((prev) => [...prev, msg]);
    socket.current.on("receivemessage", handleReceiveMessage);

    return () => socket.current.disconnect();
  }, [user]);

  useEffect(() => {
    if (selectedUser) {
      async function fetchMessages() {
        try {
          const { data } = await axios.get(
            `https://talkio-1.onrender.com/getallmessages/${user.username}/${selectedUser}`
          );
          setMessages(
            data.map((msg) => ({
              text: msg.text,
              media: msg.media,
              sender: msg.from === user.username ? "me" : "other",
            }))
          );
        } catch (err) {
          console.error(err);
        }
      }
      fetchMessages();
    }
  }, [selectedUser, user.username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === "" && file.empty()) return;
    socket.current.emit("sendmessage", {
      from: user.username,
      to: selectedUser,
      message: input,
    });
    const fileUrl = URL.createObjectURL(file);
    setMessages([...messages, { text: input, media: fileUrl, sender: "me" }]);
    setInput("");
  };

  const handleLogout = async () => {
    await axios.get("https://talkio-1.onrender.com/logout", {
      withCredentials: true,
    });
    navigate("/login");
  };

  const onlineUserList = Object.entries(allUsers)
    .filter(([username, socketId]) => username !== user.username)
    .sort(([aName, aSocket], [bName, bSocket]) => {
      if (aSocket && !bSocket) return -1;
      if (!aSocket && bSocket) return 1;
      return 0;
    });

  return (
    <div className="relative min-h-screen flex bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 bg-white/30 hover:bg-white/40 text-white font-semibold px-4 py-2 rounded-lg shadow-md backdrop-blur-md transition-all duration-200"
      >
        Logout
      </button>
      {/* Sidebar toggle button (mobile only) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 z-50 md:hidden bg-white/30 hover:bg-white/40 text-white font-semibold px-4 py-2 rounded-lg shadow-md backdrop-blur-md transition-all duration-200"
      >
        Users
      </button>

      {/* Sidebar */}
      <div
        className={`
    fixed top-0 left-0 w-64 h-screen  backdrop-blur-md p-4 flex flex-col z-40
    transform transition-transform duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0
  `}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Users
        </h2>
        {onlineUserList.length === 0 ? (
          <p className="text-center mt-10 text-white/70">No users available.</p>
        ) : (
          <ul className="flex-1 space-y-4 overflow-y-auto">
            {onlineUserList.map(([username, socketId]) => (
              <li
                key={username}
                onClick={() => {
                  setSelectedUser(username);
                  setSidebarOpen(false);
                }}
                className={`px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/10 ${
                  selectedUser === username ? "bg-white/20 shadow-lg" : ""
                }`}
              >
                <div className="text-white font-medium">{username}</div>
                <div className="flex items-center mt-1">
                  <span
                    className={`w-3 h-3 rounded-full mr-2 ${
                      socketId ? "bg-green-500 animate-pulse" : "bg-gray-400"
                    }`}
                  ></span>
                  <span className="text-white text-sm">
                    {socketId ? "Online" : "Offline"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Section */}
      <div className="flex-1 md:ml-64 flex flex-col ml-24 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
        {!selectedUser ? (
          <h1 className="text-white text-2xl font-semibold text-center mt-10">
            Welcome {user.username}
          </h1>
        ) : (
          <div className="flex-1 flex flex-col bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 relative">
            {/* Header (fixed inside chat section) */}
            {selectedUser && (
              <div className="sticky top-0 z-10  px-4 py-3 ">
                <h1 className="text-xl md:text-2xl font-bold text-white ">
                  Welcome {user.username}
                </h1>
                <h1 className="text-xl md:text-2xl font-bold text-white text-center">
                  Chatting with {selectedUser}
                </h1>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 pt-20 space-y-3">
              {messages.map((msg, idx) => {
                const isMe = msg.sender === "me";

                return (
                  <div
                    key={idx}
                    className={`max-w-xs rounded-xl px-3 py-2 break-words whitespace-pre-wrap ${
                      isMe
                        ? "bg-green-500 text-white ml-auto"
                        : "bg-white text-black"
                    }`}
                  >
                    {/* Media (image) */}
                    {msg.media && (
                      <img
                        src={msg.media}
                        alt="attachment"
                        className="mb-2 rounded-lg max-h-60 w-full object-cover"
                      />
                    )}

                    {/* Text */}
                    {msg.text && (
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    )}
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Input box */}
            <form
              onSubmit={handleSend}
              encType="multipart/form-data"
              className="sticky bottom-0"
            >
              <div className="flex items-center gap-2 p-4 shadow-md bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
                {/* File input (hidden) */}
                <label
                  htmlFor="file"
                  className="cursor-pointer bg-white/20 hover:bg-white/30 p-3 rounded-full text-white flex items-center justify-center"
                  title="Attach file"
                >
                  📎
                </label>

                <input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />

                {/* Text input */}
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/80"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />

                {/* Send button */}
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-md flex items-center justify-center"
                  title="Send message"
                >
                  🚀
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
