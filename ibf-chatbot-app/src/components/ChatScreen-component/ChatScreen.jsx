import React, { useState, useRef, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import './ChatScreen.css'; // Import the provided CSS

const ChatScreen = ({ selectedChat }) => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // To store user and bot messages
  const bottomRef = useRef(null);

  useEffect(() => {
    // Automatically scroll to the bottom when chatHistory updates
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      // Add user message to chat history
      const userMessage = { text: input, sender: 'user' };
      setChatHistory((prev) => [...prev, userMessage]);

      // Simulate a bot response with a dummy message
      const responseMessage = {
        text: `This is a dummy response to: "${input}"`, // Dummy response
        sender: 'bot',
      };
      setTimeout(() => {
        setChatHistory((prev) => [...prev, responseMessage]);
      }, 1000); // Simulate a delay for the bot response

      setInput(''); // Clear the input field
    }
  };

  return (
    <div className="chat-screen-container">
      {/* Chat Messages Container */}
      <div className="chat-messages">
        {chatHistory.length > 0 ? (
          chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <span className={`badge ${msg.sender === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
                {msg.sender === 'user' ? 'You' : 'Bot'}
              </span>
              <div>{msg.text}</div>
            </div>
          ))
        ) : (
          <div>Select a chat to start</div>
        )}
        <div ref={bottomRef} /> {/* Scroll to this element */}
      </div>

      {/* Input Form */}
      <Form onSubmit={handleSubmit} className="chat-input">
        <div className="input-group">
          <Form.Control
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button variant="primary" type="submit">
            Send
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ChatScreen;