const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Configurar el middleware para servir el archivo socket.io.js
app.get('/socket.io/socket.io.js', (req, res) => {
  const socketIoPath = require.resolve('socket.io-client/dist/socket.io.js');
  res.sendFile(socketIoPath);
});