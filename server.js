// --- IMPORTS OG OPPSETT ---
const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

// Server statiske filer (HTML, CSS, JS)
app.use(express.static(__dirname));

// --- LOGIN & SESSION VARIABLER ---
const sessions = {}; // aktive innlogginger
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

// --- LOGIN ENDPOINT ---
app.post('/api/login', (req, res) => {
    const { user, pass } = req.body;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        const token = Math.random().toString(36).slice(2);
        sessions[token] = true;

        res.cookie('session', token, { httpOnly: true });
        return res.json({ success: true });
    }

    res.json({ success: false });
});

// --- SESSION CHECK (brukes av adminpanel.html) ---
app.get('/api/checksession', (req, res) => {
    const token = req.cookies.session;
    res.json({ loggedIn: !!sessions[token] });
});

// --- NEWPOST ENDPOINT (BESKYTTET) ---
app.post('/api/newpost', (req, res) => {
    const token = req.cookies.session;

    if (!sessions[token]) {
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

// --- SOCKET.IO SPILLLOGIKK ---
let players = {};

io.on('connection', (socket) => {
    console.log(`Bruker koblet til: ${socket.id}`);

    players[socket.id] = { 
        id: socket.id,
        x: 400, 
        y: 250,
        name: "Anonym",
        color: "#0076ff"
    };

    socket.emit('currentPlayers', players);

    socket.on('movement', (data) => {
        if (!players[socket.id]) return;

        const name = String(data.name || "Anonym").trim();

        players[socket.id].x = Math.max(20, Math.min(780, Number(data.x) || 400));
        players[socket.id].y = Math.max(20, Math.min(480, Number(data.y) || 250));

        players[socket.id].name = name.length > 21 ? name.substring(0, 21) : name;
        players[socket.id].color = /^#[0-9A-Fa-f]{6}$/.test(data.color) ? data.color : "#0076ff";

        io.emit('playerMoved', players[socket.id]);
    });

    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', { id: socket.id, msg });
    });

    socket.on('disconnect', () => {
        console.log(`Bruker koblet fra: ${socket.id}`);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Serveren kjører på port ${PORT}`));
