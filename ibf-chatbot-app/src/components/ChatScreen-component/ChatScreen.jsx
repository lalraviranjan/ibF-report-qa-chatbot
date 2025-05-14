import React, { useState, useRef, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import './ChatScreen.css'; // Import the provided CSS
import { v4 as uuidv4 } from 'uuid';

const ChatScreen = ({ selectedChat }) => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // To store user and bot messages
  const [isTyping, setIsTyping] = useState(false); // To show typing animation
  const [dots, setDots] = useState(1); // To control the number of dots in the animation
  const [sessionId, setSessionId] = useState(''); // State for dynamic session ID
  const bottomRef = useRef(null);

  useEffect(() => {
    // Generate a unique session ID when the component mounts
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
  }, []);

  useEffect(() => {
    // Automatically scroll to the bottom when chatHistory updates
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    let interval;
    if (isTyping) {
      // Start the dots animation when typing is true
      interval = setInterval(() => {
        setDots((prevDots) => (prevDots % 4) + 1); // Cycle through 1 to 4 dots
      }, 500); // Adjust the speed of the animation
    } else {
      setDots(1); // Reset dots when typing stops
    }
    return () => clearInterval(interval); // Cleanup the interval on unmount or when typing stops
  }, [isTyping]);

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

  const lazyPrintResponse = (responseText) => {
    const words = responseText.trim().split(/\s+/).filter(Boolean); // Remove extra spaces and empty entries
    let currentWordIndex = 0;

    setChatHistory((prev) => [
      ...prev,
      { text: '', sender: 'bot' }, // Add an empty bot message
    ]);

    const interval = setInterval(() => {
      if (currentWordIndex < words.length) {
        setChatHistory((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.sender === 'bot') {
            const nextWord = words[currentWordIndex] || '';
            const updatedMessage = {
              ...lastMessage,
              text: `${lastMessage.text} ${nextWord}`.trim(),
            };
            return [...prev.slice(0, -1), updatedMessage];
          }
          return prev;
        });
        currentWordIndex++;
      } else {
        clearInterval(interval); // Stop the interval when all words are printed

        setChatHistory((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.sender === 'bot') {
            const formattedMessage = {
              ...lastMessage,
              text: responseText, // Replace with the full response text
            };
            return [...prev.slice(0, -1), formattedMessage];
          }
          return prev;
        });
      }
    }, 50); // Adjust the delay for word-by-word printing
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setChatHistory((prev) => [...prev, userMessage]);

      setIsTyping(true);

      const payload = {
        session_id: sessionId,
        user_input: input,
      };

      fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsTyping(false);
          lazyPrintResponse(data.response || 'No response from server');
        })
        .catch((error) => {
          setIsTyping(false);
          const errorMessage = {
            text: 'Error fetching response. Please try again later.',
            sender: 'bot',
          };
          setChatHistory((prev) => [...prev, errorMessage]);
        });

      setInput('');
    }
  };

  return (
    <div className="chat-screen-container">
      {chatHistory.length === 0 && (
        <div className="chat-header">
          Need Clarity on Indian Banking & Finance? Just Ask!
        </div>
      )}

      <div className="chat-messages">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <span className={`badge ${msg.sender === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
              {msg.sender === 'user' ? 'You' : 'IBFR'}
            </span>
            <div>
              {msg.sender === 'bot' ? formatResponse(msg.text) : <p>{msg.text}</p>}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message bot-message">
            <span className="badge bg-secondary">IBFR</span>
            <div>Thinking{'.'.repeat(dots)}</div> {/* Animated dots */}
          </div>
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