
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const ss = require('socket.io-stream');
const path = require('path');


const fs = require('fs');
let files = '';

const load_file = (files, i) =>{

//   const reader = fs.createReadStream(files.fileUri);
//   const strem = fs.createWriteStream('Old ' + files.fileName);
//   reader.pipe(strem);


  let base64Data =  files.replace(/^data:image\/png;base64,/, "");
  files = '';

  // base64Data = `data:${files.type};base64,${base64Data}`;


	fs.writeFile(`files-name${i}.jpg`, base64Data, 'base64', function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  });

  // var bitmap = fs.readFileSync(files.name);
  // console.log(bitmap);
//   const reader = fs.createReadStream(file.path);
//   const strem = fs.createWriteStream(url);
//   reader.pipe(strem);
//   fs.writeFile('test.png', files.data,  "binary",function(err) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log("The file was saved!");
//     }
//   });
}


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
  socket.on('test', function (data, ackFn) {
    console.log(rooms, data.text);
    rooms.forEach(event => {
      io.sockets.in(event).emit('test', data.text);
    });
    ackFn('result')
  });

  let i = 0;

  socket.on('file', async(stream) => {
    if(stream.start){
      // files[stream.id] = stream.data;
      console.log('start', stream);
    }else if(stream.upload){
      // files[stream.id].data += stream.data;
      files = files + stream.data;
      i++;
      console.log('chunk', i);
    }else if(stream.end){
      load_file(files, 'finish');

      console.log('end');
      console.log(i);
      i = 0;
    }
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