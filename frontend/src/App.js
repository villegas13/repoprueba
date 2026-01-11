import './App.css';
import { io } from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';

const socket = io('http://localhost:3001');

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [usuario, setUsuario] = useState('');
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll automático al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  // Login y conexión
  useEffect(() => {
    // Pedimos nombre solo una vez
    const nombre = prompt('¿Cuál es tu nombre?')?.trim() || 'Anónimo';
    setUsuario(nombre);

    const onConnect = () => {
      setIsConnected(true);
      socket.emit('login', nombre);
    };

    socket.on('connect', onConnect);

    // Si ya está conectado cuando se monta el componente
    if (socket.connected) {
      onConnect();
    }

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('chat message', (msg) => {
      setMensajes((prev) => [...prev, msg]);
    });

    socket.on('user_joined', (data) => {
      setMensajes((prev) => [
        ...prev,
        { username: 'Sistema', text: `${data.username} se conectó`, time: data.timestamp },
      ]);
    });

    socket.on('user_left', (data) => {
      setMensajes((prev) => [
        ...prev,
        { username: 'Sistema', text: `${data.username} se desconectó`, time: new Date().toLocaleTimeString() },
      ]);
    });

    socket.on('load_messages', (historial) => {
      setMensajes(historial);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect');
      socket.off('chat message');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('load_messages');
    };
  }, []);

  const enviarMensaje = (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !isConnected) return;

    // Enviamos solo el texto (el servidor añadirá username y hora)
    socket.emit('chat message', nuevoMensaje.trim());

    setNuevoMensaje('');
    inputRef.current?.focus();
  };

  return (
    <div className="App">
      <div className="header">
        <h2>
          Chat en Vivo{' '}
          <span style={{ color: isConnected ? '#22c55e' : '#ef4444', fontSize: '1.1em' }}>
            {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
          </span>
        </h2>
        <p>
          Bienvenido, <strong>{usuario}</strong>
        </p>
      </div>

      <div className="mensajes">
        {mensajes.map((msg, i) => (
          <div
            key={i}
            className={`mensaje ${msg.username === usuario ? 'propio' : ''} ${
              msg.username === 'Sistema' ? 'sistema' : ''
            }`}
          >
            {msg.username !== 'Sistema' && <span className="usuario">{msg.username}</span>}
            <span className="hora">
              {msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <p>{msg.text || msg.mensaje}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={enviarMensaje} className="input-area">
        <input
          ref={inputRef}
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
          disabled={!isConnected}
          autoFocus
        />
        <button type="submit" disabled={!isConnected}>
          Enviar
        </button>
      </form>
    </div>
  );
}

export default App;