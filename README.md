# AXIOM Portfolio — Mohammad Wisam Wiraghina

Futuristic personal portfolio with scroll-driven PNG sequence animation, Three.js ambient particles, and interactive project cards.

---

## Running the Project

No build step required. Serve the root folder with any static HTTP server:

```bash
# Python (recommended)
python -m http.server 8080

# Node (npx)
npx serve .
```

Open `http://localhost:8080` in browser.

---

## Adding AXIOM Frame Sequence

The animation is driven by 210 JPG/PNG frames in `assets/frames/`.

**Current naming convention:**
```
assets/frames/ezgif-frame-001.jpg
assets/frames/ezgif-frame-002.jpg
...
assets/frames/ezgif-frame-210.jpg
```

If your frames use a different naming pattern, update this line in `assets/js/axiom.js`:
```js
img.src = `assets/frames/ezgif-frame-${padded}.jpg`;
```

Frames load at page open. Loading bar shows progress. Animation is scroll-scrubbed — scroll down to advance frames.

---

## Placeholders to Fill

| Item | File | How |
|------|------|-----|
| Email address | `index.html` → contact section | Replace `[YOUR_EMAIL]` in `href="mailto:[YOUR_EMAIL]"` |
| LinkedIn URL | `index.html` → contact section | Replace `[YOUR_LINKEDIN_URL]` in the LinkedIn card `href` |
| Bio text | `assets/js/about.js` → `_terminalLines` array | Edit the last 3 lines of the array |
| Live demo URLs | `assets/js/projects.js` → `demo` fields | Set `demo: 'https://your-url'` per project |
| DAO Vote-Vibe description | `assets/js/projects.js` | Update the `description` and `tags` fields |
| Sticky mascot image | root `maskot_chatbot.png` | Replace file; keep same filename or update `axiom.js` src |

---

## File Structure

```
webPorto-main/
├── index.html
├── maskot_chatbot.png       ← sticky mascot (peeking from bottom)
├── assets/
│   ├── css/
│   │   ├── main.css         ← design tokens, reset, navbar
│   │   ├── cursor.css       ← neon custom cursor
│   │   ├── hero.css         ← hero section layers
│   │   ├── about.css        ← terminal panel + stat cards
│   │   ├── projects.css     ← card grid + modal
│   │   └── contact.css      ← contact cards + footer
│   ├── js/
│   │   ├── main.js          ← bootstrap all modules
│   │   ├── cursor.js        ← lerp cursor logic
│   │   ├── axiom.js         ← frame preload + scroll scrub + mascot
│   │   ├── particles.js     ← Three.js ambient particles
│   │   ├── about.js         ← terminal typing + GSAP counters
│   │   └── projects.js      ← card generation + filter + modal
│   └── frames/              ← 210 animation frames (ezgif-frame-001.jpg … 210)
└── docs/
    └── AXIOM_Portfolio_Blueprint.md
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Core | HTML5, CSS3 (custom properties), Vanilla JS ES6+ |
| Animation | GSAP 3 + ScrollTrigger |
| 3D Particles | Three.js r128 |
| Frame animation | Canvas API + requestAnimationFrame |
| Fonts | Google Fonts — Orbitron, Share Tech Mono |
