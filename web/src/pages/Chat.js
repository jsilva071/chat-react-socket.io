import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import FlakeId from 'flakeid';

import '../styles/chat.css';

const socket = io('http://localhost:3333');
socket.on('connect', () => console.log('[IO] Connect => A new connection has been established'));


let name = prompt("Insira um nome");

export default function Chat() {
  
  const flake = new FlakeId();
  const myId = flake.gen();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    function handleNewMessage(newMessage) {
      setMessages([...messages, newMessage]);
    }
    socket.on('chat.message', handleNewMessage);
    return () => socket.off('chat.message', handleNewMessage);
  }, [messages]);

  function handleFormSubmit(event) {
    event.preventDefault();
    if (message.trim()) {
      socket.emit('chat.message', {
        socket_id: socket.id,
        id: myId,
        message,
        author: name ? name : 'Anónimo'
      });
      setMessage('');
    }
  }

  function handleInputChange(event) {
    setMessage(event.target.value);
  }

  return (
    <main className="container">
      <p align="center">Your name: {name ? name : '{refresh the page}'}</p>
      <ul className="list">
        {messages.map((message, index) => (
          <li key={index} className={`list__item list__item--${message.socket_id === socket.id ? 'mine' : 'other'}`}>
          {message.socket_id !== socket.id ? message.author + ': ' : ''}
            <span className={`message message--${message.socket_id === socket.id ? 'mine' : 'other'}`}>
            {message.message}
            </span>
          </li>
        ))}
      </ul>

      <form className="form" onSubmit={handleFormSubmit}>
        <input
          className="form__field"
          placeholder="Escreva uma mensagem"
          type="text"
          onChange={handleInputChange}
          value={message}
        />
      </form>
    </main>
  );
}