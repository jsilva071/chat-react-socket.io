const express = require('express');
const http = require('http');
const socket = require('socket.io');
const cors = require('cors');

const app = express();

app.use(cors());
const server = http.createServer(app);
const io = socket(server);

io.on('connection', socket => {
  console.log(`[IO] Connection => Server has a new connection\nSocket ID: ${socket.id}`);
  socket.on('chat.message', data => {
    console.log('[SOCKET] Chat.message => ', data);
    io.emit('chat.message', data);
  });
  socket.on('disconnect', () => {
    console.log('[SOCKET] Disconnect => A connection was disconnected');
  });
});

server.listen(3333, () => {
  console.log(`[HTTP] Listen => Server is running at http://localhost:3333`);
});