const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;
const usernames = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Set username for the user
  socket.on('setUsername', (username) => {
    socket.username = username;
    usernames[socket.id] = username;
  });

  socket.on('chat message', (data) => {
    console.log('message: ' + data.message);
    io.emit('chat message', { username: usernames[socket.id], message: data.message });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    delete usernames[socket.id];
  });
});

http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
