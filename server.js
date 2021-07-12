//Creating Server
const express = require('express');
const app = express();
const server = require('http').Server(app);
//Importing uuid(version v4)
const { v4: uuidv4 } = require('uuid');
const io = require('socket.io')(server);

// Peer
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);

app.get('/', (req, rsp) => {
  rsp.redirect(`/${uuidv4()}`);
});

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

// Socket io for RTC
io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);

    socket.on('message', (message) => {
      io.to(roomId).emit('createMessage', message);
    });
  });
});

server.listen(process.env.PORT || 3030, () => {
  console.log('server started');
});
