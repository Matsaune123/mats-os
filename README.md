# MATS-OS

> A personal website with a retro terminal aesthetic

Welcome to MATS-OS — my personal portfolio and blog disguised as a 90s-style operating system. Built with Rust, Node.js, HTML, CSS, and JavaScript.

## 🌐 Live Demo

Visit the site at: **[mats-os.onrender.com](https://mats-os.onrender.com/)**

## 📂 Project Structure

```
mats-os/
├── src/
│   └── main.rs
├── public/
│   ├── index.html
│   ├── adminpanel.html
│   ├── blogg.html
│   ├── login.html
│   ├── om-meg.html
│   ├── prosjekter.html
│   ├── css/
│   │   └── style.css
│   └── spill/
│       ├── spill_stairs.html
│       ├── spill_4_på_rad.html
│       └── ...
├── Cargo.toml
├── Cargo.lock
├── package.json
├── posts.json
├── render.yaml
└── server.js

```

## 🖥️ Pages

- **Hjem** (Home) - Main landing page with navigation to all sections
- **Prosjekter** (Projects) - My active and completed projects
- **Blogg** (Blog) - System logs and thoughts
- **Om Meg** (About) - Information about me
- **Spill** (Games) - Interactive games built with vanilla JavaScript

## ⚙️ Technical Stack

- **Backend**: Rust with Actix-web framework
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Server**: Node.js (Express) or Rust-based server
- **Database**: JSON-based post storage
- **Deployment**: Render

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

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Matsaune123/mats-os.git
cd mats-os
```

2. Install dependencies:
```bash
npm install
```

3. Build Rust backend:
```bash
cargo build --release
```

### Using a Local Server

Node.js:
```bash
npm start
```

Python 3:
```bash
python -m http.server 8000
```

Then visit `http://localhost:8000` or `http://localhost:3000` depending on your server.

## 📋 Features

✅ Dynamic blog loading from JSON
✅ Semantic HTML
✅ Responsive design
✅ Backend server with Rust/Actix
✅ Interactive games
✅ Admin panel with login
✅ Fast loading
✅ Retro aesthetic

## 🎮 Games

- **4 på Rad** - Connect Four game
- **Stairs Game** - Various interactive games
- **Additional Games** - More games coming soon!

## 🔮 Future Improvements

- [ ] Enhanced admin panel features
- [ ] Blog search functionality
- [ ] Custom 404 page
- [ ] Favicon
- [ ] Blog categories/tags
- [ ] Contact form
- [ ] Database integration
- [ ] User authentication improvements

## 👨‍💻 About Me

I'm Mats Vigestad Aune, a tech enthusiast from Volda, Norway. I enjoy:
- Building and configuring systems
- Gaming with the clan
- Geocaching (especially those tricky mystery caches)
- Web development and full-stack projects
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
