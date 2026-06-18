const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

const SECRET_KEY = process.env.SECRET_KEY;
const sessions = {};
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;


app.post("/api/login", (req, res) => {
    if (req.body.user === ADMIN_USER && req.body.pass === ADMIN_PASS) {
        const token = Math.random().toString(36).slice(2);
        sessions[token] = true;

        res.cookie("session", token, { httpOnly: true });
        return res.json({ success: true });
    }
    res.json({ success: false });
});

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

    // Send eksisterende spillere til den nye klienten (Det var denne du sletta)
    socket.emit('currentPlayers', players);

    // Håndter bevegelse, navn og fargeoppdateringer (Uten Inception-logikk)

    socket.on('movement', (data) => {
        if (!players[socket.id]) return;

        const name = String(data.name || "Anonym").trim();

        players[socket.id].x = Math.max(20, Math.min(780, Number(data.x) || 400));
        players[socket.id].y = Math.max(20, Math.min(480, Number(data.y) || 250));

        players[socket.id].name = name.length > 21 ? name.substring(0, 21) : name;
        players[socket.id].color = /^#[0-9A-Fa-f]{6}$/.test(data.color) ? data.color : "#0076ff";

        io.emit('playerMoved', players[socket.id]);
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
app.post('/api/newpost', (req, res) => {
    const key = req.headers['x-api-key'];

    if (key !== SECRET_KEY) {
        return res.status(403).json({ error: "Access denied" });
    }

    fs.readFile(__dirname + '/posts.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Kunne ikke lese posts.json' });

        let posts = JSON.parse(data);

        const newPost = {
            id: posts.length + 1,
            title: req.body.title,
            date: req.body.date,
            timestamp: req.body.timestamp,
            content: req.body.content
        };

        posts.push(newPost);

        fs.writeFile(__dirname + '/posts.json', JSON.stringify(posts, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Kunne ikke lagre ny post' });
            res.json({ success: true, post: newPost });
        });
    });
});

http.listen(PORT, () => console.log(`Serveren kjører på port ${PORT}`));
