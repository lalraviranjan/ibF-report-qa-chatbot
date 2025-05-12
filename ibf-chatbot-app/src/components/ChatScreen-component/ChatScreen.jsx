import React, { useState, useRef, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import './ChatScreen.css'; // Import the updated CSS
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap icons

const ChatScreen = ({ selectedChat, messages, onSendMessage }) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="chat-screen-container">
      <div className="chat-messages">
        {selectedChat ? (
          messages.map((msg, idx) => (
            <div key={idx} className="mb-2">
              <span className="badge bg-primary">{msg.sender}</span>
              <div>{msg.text}</div>
            </div>
          ))
        ) : (
          <div>Select a chat to start</div>
        )}
        <div ref={bottomRef} />
      </div>

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