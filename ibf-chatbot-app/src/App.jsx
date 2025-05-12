import React, { useState } from 'react';
import Sidebar from './components/Sidebar-component/Sidebar';
import ChatScreen from './components/ChatScreen-component/ChatScreen';
import './App.css'; // optional custom tweaks
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [chats, setChats] = useState(["Chat 1", "Chat 2"]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleNewChat = () => {
    const newChat = `Chat ${chats.length + 1}`;
    setChats([newChat, ...chats]);
    setSelectedChat(newChat);
    setMessages([]);
  };

  const handleSendMessage = (msg) => {
    if (msg.trim()) {
      setMessages([...messages, { text: msg, sender: 'user' }]);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex">
      {/* Sidebar */}
      <div className="sidebar-container text-white">
        <Sidebar
          chats={chats}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          handleNewChat={handleNewChat}
        />
      </div>

      {/* Chat Screen */}
      <div className="chat-screen-container flex-grow-1">
        <ChatScreen
          selectedChat={selectedChat}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default App;