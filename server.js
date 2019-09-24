
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');



app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(express.static('socket'));



app.get('/', function (req, res) {
  res.sendFile(__dirname + '/frontEnd/index.html');
});


const server = app.listen(3000, () => {
  console.log('Server on 3000 port');
})

const io = require('socket.io').listen(server);

io.sockets.on('connection', socket => {
  let rooms = ['owner'];
  if(socket.handshake.query.room !== 'owner'){
    rooms.push(socket.handshake.query.room);
  }
  socket.join(socket.handshake.query.room);
  rooms.forEach(event => {
    io.sockets.in(event).emit('test', event);
  });
  socket.on('test', function (data) {
    console.log(rooms, data.text);
    rooms.forEach(event => {
      io.sockets.in(event).emit('test', data.text);
    });
  });
})

// const demo = io.of('/de').on('connection', socket => {
//     demo.emit('test', {
//         data: 'Hello'
//     });
//     socket.on('test1', function (data) {
//         console.log(data);
//         demo.emit('test1', data);
//         demo.emit('test', data);
//     });

//     socket.on('disconect', () => {
//         socket.disconnect();
//     })
// });

// const state = io.of('/st').on('connection', socket => {
//     state.emit('test', {
//         data: 'Hello'
//     });
//     socket.on('test1', function (data) {
//         console.log(data);
//         state.emit('test1', data);
//         state.emit('test', data);
//     });
//     socket.on('disconect', () => {
//         socket.disconnect();
//     })
// });