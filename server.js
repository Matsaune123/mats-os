const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serverer filene fra 'public'-mappen automatisk
app.use(express.static('public'));

let players = {};

io.on('connection', (socket) => {
    console.log(`Bruker koblet til: ${socket.id}`);
    
    // Startposisjon for nye spillere
    players[socket.id] = { x: 400, y: 250 };

    // Send eksisterende spillere til den nye, og si fra til andre at noen kom inn
    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', { id: socket.id, ...players[socket.id] });

    // Håndter bevegelse
    socket.on('movement', (data) => {
        if (players[socket.id]) {
            players[socket.id] = data;
            io.emit('playerMoved', { id: socket.id, ...data });
        }
    });

    // Håndter chat
    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', { id: socket.id, msg });
    });

    // Spiller logger ut
    socket.on('disconnect', () => {
        console.log(`Bruker koblet fra: ${socket.id}`);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

// Port-fiks spesifikt for Render
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Serveren kjører på port ${PORT}`));
