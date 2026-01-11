

const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Chat server is running\n');
});


const PORT = process.env.PORT || 3001;

const HOST = '::';  // ← Key change: use '::' instead of '0.0.0.0'

const io = require('socket.io')(server, {
  cors: {
    origin: "*",   
  }
});

io.on('connection', (socket) => {  
  console.log('a user connected');

  socket.on('login', (username) => {
    socket.username = username;
    io.emit('user_joined', { username, timestamp: new Date().toLocaleTimeString() });
  });

  socket.on('chat message', (msg) => {
    const message = {
      username: socket.username || 'Anónimo',
      text: msg,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    io.emit('chat message', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    if (socket.username) {
      io.emit('user_left', { username: socket.username });
    }
  });
});


server.listen(PORT, HOST, () => {
  console.log(`listening on ${HOST}:${PORT}`);
});

