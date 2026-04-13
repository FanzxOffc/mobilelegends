const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(__dirname));

let players = {};

io.on('connection', (socket) => {
    console.log('User Join:', socket.id);
    players[socket.id] = {
        x: Math.random() * 500,
        y: Math.random() * 500,
        hp: 100,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };

    io.emit('updatePlayers', players);

    socket.on('move', (data) => {
        if(players[socket.id]) {
            players[socket.id].x += data.x;
            players[socket.id].y += data.y;
            io.emit('updatePlayers', players);
        }
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('MOBA Engine Running on Port ' + PORT));
