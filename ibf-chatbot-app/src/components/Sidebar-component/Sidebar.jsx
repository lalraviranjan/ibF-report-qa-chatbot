import React from 'react';
import './Sidebar.css';
import { Button, Nav } from 'react-bootstrap';

const Sidebar = ({ chats, handleSelectChat, handleNewChat }) => {
  return (
    <div className="bg-dark text-white p-3 h-100 sidebar-inner">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Chats</h5>
        <Button variant="outline-light" size="sm" onClick={handleNewChat}>
          <i className="bi bi-pencil"></i> {/* <-- Use Bootstrap icon class */}
        </Button>
      </div>
      <Nav className="flex-column">
        {chats.map((chat, idx) => (
          <Button
            key={idx}
            variant="outline-light"
            className="mb-2 text-start"
            onClick={() => handleSelectChat(chat)}
          >
            {chat}
          </Button>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
