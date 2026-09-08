# MATS-OS

> A personal website with a retro terminal aesthetic

Welcome to MATS-OS — my personal portfolio and blog disguised as a 90s-style operating system. Built with Rust, Node.js, HTML, CSS, and JavaScript.

## 🌐 Live Demo

Visit the site at: **[mats-os.onrender.com](https://mats-os.onrender.com/)**

## 📂 Complete Project Structure

```
mats-os/
├── src/
│   └── main.rs                    # Rust backend server (Actix-web)
│
├── public/                        # Frontend files
│   ├── index.html                # Home page
│   ├── blogg.html                # Blog page
│   ├── om-meg.html               # About me page
│   ├── prosjekter.html           # Projects page
│   ├── login.html                # Login page
│   ├── adminpanel.html           # Admin dashboard
│   ├── places.html               # Places/maps integration
│   │
│   ├── spill/                    # Games directory
│   │   ├── spill.html            # Main games hub
│   │   ├── spill_4_på_rad.html   # Connect Four game
│   │   ├── spill_stairs.html     # Stairs game
│   │   ├── spill_input.html      # Input inversion game
│   │   └── spill_captcha.html    # CAPTCHA game
│   │
│   ├── css/
│   │   └── style.css             # Main stylesheet (retro terminal theme)
│   │
│   └── assets/                   # Images, icons, etc.
│
├── Cargo.toml                     # Rust dependencies
├── Cargo.lock                     # Rust lock file
├── package.json                   # Node.js dependencies
├── package-lock.json              # Node.js lock file
│
├── server.js                      # Node.js/Express server (alternative backend)
├── posts.json                     # Blog posts data
├── render.yaml                    # Render deployment config
├── .gitignore                     # Git ignore rules
│
├── target/                        # Rust build artifacts (gitignored)
├── node_modules/                  # Node dependencies (gitignored)
│
└── README.md                      # This file
```

## 🖥️ Pages

- **Hjem** (Home) - Main landing page with navigation to all sections
- **Prosjekter** (Projects) - My active and completed projects
- **Blogg** (Blog) - System logs and thoughts
- **Om Meg** (About) - Information about me
- **Spill** (Games) - Interactive games:
  - 4 på Rad (Connect Four)
  - Stairs Game
  - Input Inversion Game
  - CAPTCHA Game
- **Places** - Location/maps features
- **Admin Panel** - Admin dashboard with login

## ⚙️ Technical Stack

### Backend
- **Language**: Rust
- **Framework**: Actix-web 4
- **Additional**: 
  - Tokio (async runtime)
  - Serde/JSON (serialization)
  - UUID generation
  - WebSocket support (actix-web-actors)
  - Regex support

### Alternative Backend
- **Node.js** with Express
- **Socket.io** for real-time communication
- Cookie parsing

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Retro terminal styling
- **Vanilla JavaScript** - Dynamic interactions
- **WebSockets** - Real-time multiplayer features

### Data Storage
- **JSON** - Blog posts (`posts.json`)

### Deployment
- **Render** (render.yaml configuration)

## 📝 How to Add Blog Posts

Blog posts are stored in `posts.json`. To add a new post:

1. Open `posts.json`
2. Add a new object to the posts array:

```json
{
  "id": 4,
  "title": "Your Post Title",
  "date": "2026-06-17",
  "timestamp": "[2026-06-17 HH:MM:SS]",
  "content": "Your full post content here...\n\nMultiple paragraphs separated by \\n"
}
```

3. Save the file — posts automatically load on the blog page!

## 🎨 Design Features

- **Retro Terminal Aesthetic** - Green monospace terminal-style UI
- **Window-Based Layout** - Classic OS-inspired window containers
- **Responsive Design** - Works on desktop and mobile devices
- **Custom Typography** - Monospace font for authentic terminal feel
- **Dark Mode** - Easy on the eyes with dark background and green text
- **Interactive Games** - Built-in games for entertainment
- **Real-time Multiplayer** - WebSocket support for live player interactions

## 🚀 Getting Started

### Prerequisites

- Rust 1.70+ (for backend)
- Node.js 14+ (optional, for Node.js server)
- Git

### Local Development with Rust Backend

1. Clone the repository:
```bash
git clone https://github.com/Matsaune123/mats-os.git
cd mats-os
```

2. Install Rust dependencies and build:
```bash
cargo build --release
```

3. Run the Rust server:
```bash
cargo run --release
```

4. Visit `http://localhost:8080` (or the configured port)

### Local Development with Node.js Backend

1. Clone and navigate to repo:
```bash
git clone https://github.com/Matsaune123/mats-os.git
cd mats-os
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Visit `http://localhost:3000` (or as configured in server.js)

### Static File Server (Development Only)

Python 3:
```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`

## 📋 Features

✅ Retro terminal aesthetic with green monochrome UI
✅ Dynamic blog loading from JSON
✅ Semantic HTML structure
✅ Responsive design (desktop & mobile)
✅ Backend server with Rust/Actix or Node.js/Express
✅ Interactive games with WebSocket support
✅ Admin panel with login functionality
✅ Real-time multiplayer features
✅ Fast loading and performance
✅ No external CDN dependencies (minimal)

## 🎮 Games

- **4 på Rad** (Connect Four) - Classic strategy game
- **Stairs Game** - Interactive game mechanics
- **Input Inversion** - Text input chaos game
- **CAPTCHA Game** - Impossible verification puzzle

All games feature:
- Retro terminal styling
- Mobile support
- Local storage integration
- Real-time multiplayer (where applicable)

## 🔮 Future Improvements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Enhanced admin panel features
- [ ] Blog search and filtering functionality
- [ ] Blog categories and tags
- [ ] Custom 404 page
- [ ] Favicon and PWA support
- [ ] User authentication system
- [ ] Comment system for blog posts
- [ ] Contact form
- [ ] Sitemap.xml
- [ ] Analytics integration

## 👨‍💻 About Me

I'm Mats Vigestad Aune, a tech enthusiast from Volda, Norway. I enjoy:
- Building and configuring systems
- Gaming with the clan
- Geocaching (especially those tricky mystery caches)
- Web development and full-stack projects
- Learning Rust and new technologies
- Working with tech that actually works

Learn more on the [Om Meg](public/om-meg.html) page.

## 📄 License

This project is open source and available under the MIT License.

## 📧 Contact

- **GitHub:** [@Matsaune123](https://github.com/Matsaune123)
- **Email:** Mats.v.aune@hotmail.com
- **Website:** [mats-os.onrender.com](https://mats-os.onrender.com/)

## 🛠️ Development Notes

- Fix `.gitignore` merge conflict (HEAD/master merge markers)
- Consider consolidating server implementations (Rust or Node.js)
- API keys for Google Maps (places.html) need configuration

---

**Built with ❤️ and a retro terminal aesthetic**
