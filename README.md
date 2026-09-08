# MATS-OS

> A personal website with a retro terminal aesthetic

Welcome to MATS-OS — my personal portfolio and blog disguised as a 90s-style operating system. Built entirely with **Rust** and **Actix-web**.

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
│   │   ├── spill.html            # Main games hub (multiplayer circle game)
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
├── posts.json                     # Blog posts data
├── render.yaml                    # Render deployment config
├── .gitignore                     # Git ignore rules
│
├── target/                        # Rust build artifacts (gitignored)
│
└── README.md                      # This file
```

## 🖥️ Pages

- **Hjem** (Home) - Main landing page with navigation to all sections
- **Prosjekter** (Projects) - My active and completed projects
- **Blogg** (Blog) - System logs and thoughts
- **Om Meg** (About) - Information about me
- **Spill** (Games) - Interactive games:
  - Circle Game (Real-time multiplayer with WebSocket)
  - 4 på Rad (Connect Four)
  - Stairs Game
  - Input Inversion Game
  - CAPTCHA Game
- **Places** - Location/maps features
- **Admin Panel** - Admin dashboard with login

## ⚙️ Technical Stack

### Backend (Rust/Actix)
- **Language**: Rust (100% Rust backend)
- **Framework**: Actix-web 4
- **Runtime**: Tokio (async)
- **WebSocket**: Actix-web-actors
- **Additional**: 
  - Serde/JSON (serialization)
  - UUID generation
  - Regex support
  - Hex encoding

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Retro terminal styling
- **Vanilla JavaScript** - Dynamic interactions
- **WebSockets** - Real-time multiplayer features (native WebSocket, no Socket.io dependency)

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

- Rust 1.70+ (latest recommended)
- Git

### Local Development

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

4. Visit `http://localhost:3000` (or configured port in render.yaml)

### Environment Variables

Create a `.env` file or export these:
```bash
export ADMIN_USER=your_username
export ADMIN_PASS=your_password
export PORT=3000
```

## 📋 Features

✅ **100% Rust backend** - Fast, secure, and efficient
✅ Retro terminal aesthetic with green monochrome UI
✅ Dynamic blog loading from JSON
✅ Semantic HTML structure
✅ Responsive design (desktop & mobile)
✅ Interactive games with WebSocket support
✅ Admin panel with login functionality
✅ Real-time multiplayer features
✅ Fast loading and performance
✅ No external CDN dependencies

## 🎮 Games

- **Circle Game (Multiplayer)** - Real-time multiplayer with WebSocket
  - Move your colored circle around
  - See other players in real-time
  - Chat with other players
  - Mobile controls available
  
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

---

**Built with ❤️ and a retro terminal aesthetic**
