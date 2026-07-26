const express = require('express'); // Fikset: liten 'c'
const app = express();
const cookieParser = require('cookie-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs').promises;
const crypto = require('crypto');
const path = require('path');

app.use(cookieParser());
app.use(express.json());

// Serve static files fra public mappen BARE
app.use(express.static(path.join(__dirname, 'public')));

// --- LOGIN & SESSION ---
const sessions = {}; 
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

app.post('/api/login', (req, res) => {
    const { user, pass } = req.body;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        const token = crypto.randomBytes(32).toString('hex');
        sessions[token] = true;

        res.cookie('session', token, { httpOnly: true, sameSite: 'strict' });
        return res.json({ success: true });
    }

    res.status(401).json({ success: false });
});

app.get('/api/checksession', (req, res) => {
    const token = req.cookies.session;
    res.json({ loggedIn: !!sessions[token] });
});

// Lagt til: Nå kan du faktisk logge ut igjen
app.post('/api/logout', (req, res) => {
    const token = req.cookies.session;
    if (token) {
        delete sessions[token];
    }
    res.clearCookie('session');
    res.json({ success: true });
});

// --- NEWPOST ENDPOINT ---
let isWriting = false;

app.post('/api/newpost', async (req, res) => {
    const token = req.cookies.session;

    if (!sessions[token]) {
        return res.status(403).json({ error: "Access denied" });
    }

    if (isWriting) {
        return res.status(503).json({ error: "Database locked. Try again in a second." });
    }

    isWriting = true;
    try {
        const postsPath = path.join(__dirname, 'posts.json');
        const data = await fs.readFile(postsPath, 'utf8');
        let posts = JSON.parse(data);

        const newPost = {
            id: posts.length + 1,
            title: req.body.title,
            date: req.body.date,
            timestamp: req.body.timestamp,
            content: req.body.content
        };

        posts.push(newPost);
        await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));
        
        res.json({ success: true, post: newPost });
    } catch (err) {
        res.status(500).json({ error: 'Server failure while writing to file' });
    } finally {
        isWriting = false;
    }
});

// --- API: Hent alle posts (ONLY VIA API) ---
app.get('/api/posts', async (req, res) => {
    try {
        const postsPath = path.join(__dirname, 'posts.json');
        const data = await fs.readFile(postsPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: 'Could not read posts' });
    }
});

// --- HELPER: XSS SANITIZER ---
const escapeHTML = (str) => {
    return String(str).replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
};

// --- SOCKET.IO ---
let players = {};

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    players[socket.id] = { 
        id: socket.id,
        x: 400, y: 250,
        name: "Anonymous",
        color: "#0076ff"
    };

    socket.emit('currentPlayers', players);

    socket.on('movement', (data) => {
        if (!players[socket.id]) return;

        const name = String(data.name || "Anonymous").trim();

        players[socket.id].x = Math.max(20, Math.min(780, Number(data.x) || 400));
        players[socket.id].y = Math.max(20, Math.min(480, Number(data.y) || 250));
        
        players[socket.id].name = escapeHTML(name.substring(0, 21));
        players[socket.id].color = /^#[0-9A-Fa-f]{6}$/.test(data.color) ? data.color : "#0076ff";

        io.emit('playerMoved', players[socket.id]);
    });

    socket.on('chatMessage', (msg) => {
        const cleanMsg = escapeHTML(String(msg).substring(0, 200)); 
        if (cleanMsg) {
            io.emit('chatMessage', { id: socket.id, msg: cleanMsg });
        }
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});
const title = document.querySelector('h1');
let timer;

const startHold = () => {
    timer = setTimeout(() => {
        window.location.href = 'hemmelig.html';
    }, 1500); // 1.5 sekunder
};

const cancelHold = () => clearTimeout(timer);

// Både mus og touch for mobil
title.addEventListener('mousedown', startHold);
title.addEventListener('touchstart', startHold);

title.addEventListener('mouseup', cancelHold);
title.addEventListener('mouseleave', cancelHold);
title.addEventListener('touchend', cancelHold);

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
