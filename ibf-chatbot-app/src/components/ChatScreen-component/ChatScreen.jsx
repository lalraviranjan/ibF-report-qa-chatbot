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

  // Function to format the response text
  const formatResponse = (text) => {
    const lines = text.split('\n'); // Split the text by \n
    return lines.map((line, index) => {
      // Check for bold text using ** and replace it with <strong>
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return (
        <p
          key={index}
          dangerouslySetInnerHTML={{ __html: formattedLine }} // Render HTML safely
        />
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      // Add user message to chat history
      const userMessage = { text: input, sender: 'user' };
      setChatHistory((prev) => [...prev, userMessage]);

      // Prepare API request payload
      const payload = {
        session_id: "ravi12345", // Replace with a dynamic session ID if needed
        user_input: input,
      };

      // Make POST request to the API
      fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          // Add bot response to chat history
          const responseMessage = {
            text: data.response || 'No response from server', // Handle empty response
            sender: 'bot',
          };
          setChatHistory((prev) => [...prev, responseMessage]);
        })
        .catch((error) => {
          // Handle API errors
          const errorMessage = {
            text: 'Error fetching response. Please try again later.',
            sender: 'bot',
          };
          setChatHistory((prev) => [...prev, errorMessage]);
        });

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
              <div>
                {msg.sender === 'bot' ? formatResponse(msg.text) : <p>{msg.text}</p>}
              </div>
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