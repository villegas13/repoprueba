
const http = require('http');

const server = http.createServer();

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

server.listen(3001, () => {
  console.log('listening on *:3001');
});