import React, { useEffect, useState } from 'react';
import { socket } from '../socket';

export default function Chat({ room = 'staff-room-1' }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if (token) {
      socket.auth = { token };
      socket.connect();
      socket.emit('join_room', room);
      socket.on('chat_message', msg => {
        setMessages(prev => [...prev, msg]);
      });
      // fetch previous messages
      fetch(`${import.meta.env.VITE_API_URL||'http://localhost:3000'}/api/chat/room/` + room, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(r=>r.json()).then(j=>setMessages(j.data || []));
    }
    return ()=> {
      socket.off('chat_message');
      try { socket.disconnect(); } catch(e){}
    };
  },[room]);

  const send = () => {
    const user = JSON.parse(localStorage.getItem('user')||'{}');
    const payload = { room, from: user.nombre || 'anon', fromId: user.id, text };
    socket.emit('chat_message', payload);
    setMessages(prev => [...prev, payload]);
    setText('');
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Chat interno - {room}</h3>
      <div className="h-40 overflow-auto mb-2 p-2 bg-gray-50">
        {messages.map((m,i)=>(<div key={i}><strong>{m.from || m.nombre || 'U'}:</strong> {m.text || m.message}</div>))}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 p-2 border" />
        <button onClick={send} className="px-3 py-1 bg-amber-600 text-white rounded">Enviar</button>
      </div>
    </div>
  );
}
