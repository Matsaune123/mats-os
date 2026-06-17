# MATS-OS

> A personal website with a retro terminal aesthetic

Welcome to MATS-OS — my personal portfolio and blog disguised as a 90s-style operating system. Built with vanilla HTML, CSS, and JavaScript.

## 🌐 Live Demo

Visit the site at: **[matsaune123.github.io/mats-os](https://matsaune123.github.io/mats-os/)**

## 📂 Project Structure

```
mats-os/
├── index.html          # Main landing page
├── blogg.html          # Blog/system log page
├── om-meg.html         # About me page
├── prosjekter.html     # Projects page
├── posts.json          # Blog posts data
├── css/
│   └── style.css       # Central stylesheet
└── README.md           # This file
```

## 🖥️ Pages

- **Starthjem** (Home) - Main landing page with navigation to all sections
- **Prosjekter** (Projects) - My active and completed projects
- **Blogg** (Blog) - System logs and thoughts
- **Om Meg** (About) - Information about me

## ⚙️ Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Styling and responsive design
- **Vanilla JavaScript** - Dynamic content loading
- **JSON** - Blog post storage

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

- **Retro Terminal Aesthetic** - Green monochrome terminal-style UI
- **Window-Based Layout** - Classic OS-inspired window containers
- **Responsive Design** - Works on desktop and mobile devices
- **Custom Typography** - Monospace font for authentic terminal feel
- **Dark Mode** - Easy on the eyes with dark background and green text

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Matsaune123/mats-os.git
cd mats-os
```

2. Open `index.html` in your browser (or use a local server)

### Using a Local Server (Recommended)

Python 3:
```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`

## 📋 Features

✅ Dynamic blog loading from JSON
✅ Semantic HTML
✅ External CSS stylesheet (no inline styles)
✅ Mobile responsive
✅ Fast loading
✅ No external dependencies

## 🔮 Future Improvements

- [ ] Global navigation bar
- [ ] Footer with social links
- [ ] Blog search functionality
- [ ] Custom 404 page
- [ ] Favicon
- [ ] Blog categories/tags
- [ ] Contact form
- [ ] Sitemap.xml

## 👨‍💻 About Me

I'm Mats Vigestad Aune, a tech enthusiast from Volda, Norway. I enjoy:
- Building and configuring systems
- Gaming with the clan
- Geocaching (especially those tricky mystery caches)
- Working with tech that actually works

Learn more on the [Om Meg](om-meg.html) page.

## 📄 License

This project is open source and available under the MIT License.

## 📧 Contact

- **GitHub:** [@Matsaune123](https://github.com/Matsaune123)
- **Email:** Mats.v.aune@hotmail.com

---

**Built with ❤️ and a retro terminal aesthetic**
