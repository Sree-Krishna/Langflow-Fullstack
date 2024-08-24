import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPowerOff, FaPaperPlane } from 'react-icons/fa'; 
import PopupMessage from './PopupMessage/PopupMessage';  // Adjust if necessary
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [popupMessage, setPopupMessage] = useState(null);
  const ws = useRef(null);
  const refreshTimeout = useRef(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });
      const { access, refresh } = response.data;
      setToken(access);
      setRefreshToken(refresh);
      setMessages(prev => [...prev, 'Login successful! Token obtained.']);
      setPopupMessage('Login successful! Token obtained.');
      connectWebSocket(access);
      scheduleTokenRefresh(refresh);
    } catch (error) {
      console.error('Login failed:', error);
      setMessages(prev => [...prev, 'Login failed.']);
      setPopupMessage('Login failed.');
    }
  };

  const connectWebSocket = (jwtToken) => {
    ws.current = new WebSocket(`ws://localhost:8000/ws/chat/?token=${jwtToken}`);
    
    ws.current.onopen = () => {
      console.log('WebSocket connection established.');
      setConnected(true);
      setMessages(prev => [...prev, 'Connected to the chat server.']);
      setPopupMessage('Connected to the chat server.');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, `Sage: ${data.message}`]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed.');
      setConnected(false);
      setMessages(prev => [...prev, 'Disconnected from the chat server.']);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setMessages(prev => [...prev, 'WebSocket error occurred.']);
    };
  };

  const scheduleTokenRefresh = (refreshToken) => {
    const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
    const now = Math.ceil(Date.now() / 1000);
    const exp = tokenParts.exp;
    const delay = (exp - now - 60) * 1000; // Refresh 1 minute before token expiration

    refreshTimeout.current = setTimeout(() => {
      refreshAccessToken(refreshToken);
    }, delay);
  };

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/refresh/', {
        refresh: refreshToken,
      });
      const newAccessToken = response.data.access;
      setToken(newAccessToken);
      setMessages(prev => [...prev, 'Token refreshed successfully.']);
      scheduleTokenRefresh(refreshToken);
    } catch (error) {
      console.error('Token refresh failed:', error);
      setMessages(prev => [...prev, 'Token refresh failed. Please log in again.']);
      handleLogout();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (input.trim() && connected) {
      ws.current.send(JSON.stringify({ message: input }));
      setMessages(prev => [...prev, `You: ${input}`]);
      setInput('');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setRefreshToken(null);
    if (ws.current) {
      ws.current.close();
    }
    setConnected(false);
    setMessages(prev => [...prev, 'Logged out successfully.']);
    setPopupMessage('Logged out successfully.');
    clearTimeout(refreshTimeout.current);
  };

  return (
    <div className="App">
      {token && (
        <div className="user-info">
          <span className="username">{username}</span>
          <FaPowerOff className="logout-icon" onClick={handleLogout} />
        </div>
      )}
      <div className="container">
        {!token ? (
          <form onSubmit={handleLogin} className="login-form">
            <h2>Login</h2>
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
        ) : (
          <div className="chat-container">
            <div className="header">
              <h1 className="app-title">Wisdom Bot</h1> {/* App title */}
            </div>
            <div className="chatbox">
              {messages.map((msg, index) => (
                <div key={index} className="chat-message">
                  {msg}
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="chat-form">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask what you seek ..."
              />
              <button type="submit" disabled={!connected} className="send-button">
                <FaPaperPlane />
              </button>
            </form>
          </div>
        )}
      </div>
      {popupMessage && (
        <PopupMessage
          message={popupMessage}
          onClose={() => setPopupMessage(null)}
        />
      )}
    </div>
  );
}

export default App;
