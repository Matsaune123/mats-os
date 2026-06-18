const express = require('express');
const app = express();
app.use(express.json());
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const SECRET_KEY = "MATS";

// Serverer filene fra rota
app.use(express.static(__dirname));

let players = {};

io.on('connection', (socket) => {
    console.log(`Bruker koblet til: ${socket.id}`);
    
    // Initialiser spilleren med trygge standardverdier med en gang
    players[socket.id] = { 
        id: socket.id,
        x: 400, 
        y: 250,
        name: "Anonym",
        color: "#0076ff"
    };

    // Send eksisterende spillere til den nye klienten
    socket.emit('currentPlayers', players);

    // Håndter bevegelse, navn og fargeoppdateringer
    socket.on('movement', (data) => {
        if (players[socket.id]) {
            // Overstyrer dataen, men passer på at socket.id ikke blir overskrevet av kluss fra klienten
            players[socket.id] = { ...data, id: socket.id };
            io.emit('playerMoved', players[socket.id]);
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

// Port-fiks spesifikt for Render eller lokal kjøring
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Serveren kjører på port ${PORT}`));
