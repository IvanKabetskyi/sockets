
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

const demo = io.of('/de').on('connection', socket => {
    demo.emit('test', {
        data: 'Hello'
    });
    socket.on('test1', function (data) {
        console.log(data);
        demo.emit('test1', data);
        demo.emit('test', data);
    });

    socket.on('disconect', () => {
        socket.disconnect();
    })
});

const state = io.of('/st').on('connection', socket => {
    state.emit('test', {
        data: 'Hello'
    });
    socket.on('test1', function (data) {
        console.log(data);
        state.emit('test1', data);
        state.emit('test', data);
    });
    socket.on('disconect', () => {
        socket.disconnect();
    })
});