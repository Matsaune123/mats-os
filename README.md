# MATS-OS

> A personal website with a retro terminal aesthetic

Welcome to MATS-OS — my personal portfolio and blog disguised as a 90s-style operating system. Built with **Rust** and **Actix-web**.

## 🌐 Live Demo

Visit the site at: **[mats-os.onrender.com](https://mats-os.onrender.com/)**

## 📂 Complete Project Structure

This tree lists the project’s application files and root-level configuration files currently tracked in the repository. `node_modules/` is also tracked; it contains installed third-party npm dependencies and is intentionally represented as a dependency directory rather than expanded into every vendor file.

```
mats-os/
├── .gitignore                         # Git ignore rules
├── Cargo.lock                         # Locked Rust dependency versions
├── Cargo.toml                         # Rust package manifest and dependencies
├── Dockerfile                         # Container build configuration
├── LICENSE                            # Project license
├── README.md                          # Project documentation
├── mats-os-main.code-workspace        # VS Code workspace configuration
├── node_modules/                      # Installed npm dependencies (third-party packages)
├── package-lock.json                  # Locked npm dependency versions
├── posts.json                         # Blog posts data
├── render.yaml                        # Render deployment configuration
├── rustup-init.exe                    # Rust toolchain installer for Windows
├── src/
│   └── main.rs                        # Rust web server and application entry point
└── public/                            # Static website files served to visitors
    ├── 4_på_rad_spill.html            # Connect Four game
    ├── adminpanel.html                # Admin dashboard
    ├── bestilling.html                # Booking/order page
    ├── blogg.html                     # Blog page
    ├── index.html                     # Home page
    ├── login.html                     # Login page
    ├── maps.html                      # Maps page
    ├── om-meg.html                    # About page
    ├── places.html                    # Places page
    ├── priser.html                    # Pricing page
    ├── prosjekt2.html                 # Project page 2
    ├── prosjekt3.html                 # Project page 3
    ├── prosjekt4.html                 # Project page 4
    ├── prosjekter.html                # Projects page
    ├── skole.html                     # School page
    ├── solstua-frisor.html             # Solstua hair salon page
    ├── spill.html                     # Games page
    ├── spill_captcha.html             # CAPTCHA game
    ├── spill_css.html                 # CSS game
    ├── spill_cursor.html              # Cursor game
    ├── spill_input.html               # Input inversion game
    ├── spillhub.html                  # Games hub
    ├── stigespill.html                # Stairs game
    ├── content/
    │   └── Bilde_solstua.jpg          # Solstua image asset
    ├── css/
    │   └── style.css                  # Main stylesheet
    └── js/
        ├── priser.js                  # Pricing page JavaScript
        └── script.js                  # Main frontend JavaScript
```

> `target/` is a Rust build output directory and is not present in the tracked project tree. The repository currently tracks `node_modules/`; the tree above identifies it, but does not reproduce the full third-party dependency subtree.

## 🖥️ Pages

- **Hjem** (Home) - Main landing page with navigation to all sections
- **Prosjekter** (Projects) - My active and completed projects
- **Blogg** (Blog) - System logs and thoughts
- **Om Meg** (About) - Information about me
- **Spill** (Games) - Interactive games, including Connect Four, CAPTCHA, CSS, cursor, input inversion, and stairs games
- **Places and Maps** - Location and maps pages
- **Bestilling and Priser** - Booking and pricing pages
- **Admin Panel** - Admin dashboard with login

## ⚙️ Technical Stack

### Backend (Rust/Actix)
- **Language**: Rust
- **Framework**: Actix-web
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
- **WebSockets** - Real-time multiplayer features

### Data Storage
- **JSON** - Blog posts (`posts.json`)

### Deployment
- **Render** (`render.yaml` configuration)
- **Docker** (`Dockerfile`)

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
- **Custom Typography** - Monospace font for an authentic terminal feel
- **Dark Mode** - Dark background with green text
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

2. Build the Rust project:

```bash
cargo build --release
```

3. Run the server:

```bash
cargo run --release
```

4. Visit `http://localhost:3000` (or the configured port).

### Environment Variables

Set these environment variables as required by the server:

```bash
export ADMIN_USER=your_username
export ADMIN_PASS=your_password
export PORT=3000
```

## 📋 Features

- Rust backend
- Retro terminal aesthetic with green monochrome UI
- Dynamic blog loading from JSON
- Semantic HTML structure
- Responsive design (desktop and mobile)
- Interactive games
- Admin panel with login functionality
- Fast loading and performance

## 🎮 Games

- **4 på Rad** (Connect Four) - Classic strategy game
- **CAPTCHA Game** - Verification puzzle
- **CSS Game** - Browser-based game
- **Cursor Game** - Cursor interaction game
- **Input Inversion** - Text input game
- **Stairs Game** - Interactive game mechanics

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
