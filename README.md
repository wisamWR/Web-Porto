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

The animation is driven by 210 WebP frames (1080p, ~13 MB total) in `assets/frames/`.

**Current naming convention:**
```
assets/frames/ezgif-frame-001.webp
assets/frames/ezgif-frame-002.webp
...
assets/frames/ezgif-frame-210.webp
```

If your frames use a different naming pattern, update this line in `assets/js/axiom.js`:
```js
img.src = `assets/frames/ezgif-frame-${padded}.webp`;
```

**Progressive loading:** hanya ~30 keyframe (1 dari 7) dimuat sebelum halaman interaktif; sisa frame diisi di background. Di mobile (<768px) hanya 1 dari 3 frame dimuat untuk menghemat data. Animasi scroll-scrubbed — scroll ke bawah untuk memajukan frame. Pengguna dengan `prefers-reduced-motion` langsung melihat frame akhir tanpa scrub.

---

## Content to Maintain

| Item | File |
|------|------|
| Bio text | `assets/js/about.js` → `_terminalLines` array |
| Skill categories & chips | `assets/js/skills.js` → `_skillCategories` array |
| Project data & live demo URLs | `assets/js/projects.js` → `projects` array (`demo` fields masih `null`) |
| Chatbot endpoint | `assets/js/chatbot.js` → `AXIOM_API_URL` (Cloudflare Worker) |
| Sticky mascot image | `assets/img/maskot.webp` (display) + root `maskot_chatbot.png` (og:image only) |

---

## File Structure

```
webPorto-main/
├── index.html
├── robots.txt
├── maskot_chatbot.png       ← social preview image (og:image) only
├── assets/
│   ├── css/
│   │   ├── main.css         ← design tokens, reset, navbar, progress bar, back-to-top
│   │   ├── cursor.css       ← neon custom cursor (pointer-fine only)
│   │   ├── hero.css         ← hero section layers
│   │   ├── about.css        ← terminal panel + stat cards
│   │   ├── skills.css       ← skill matrix cards + chips
│   │   ├── projects.css     ← card grid + modal
│   │   ├── contact.css      ← contact cards + footer
│   │   └── chatbot.css      ← chat panel
│   ├── js/
│   │   ├── main.js          ← bootstrap all modules, progress bar, back-to-top
│   │   ├── cursor.js        ← lerp cursor logic (skip on touch devices)
│   │   ├── axiom.js         ← progressive frame loading + scroll scrub + mascot
│   │   ├── particles.js     ← Three.js ambient particles
│   │   ├── about.js         ← terminal typing + GSAP counters
│   │   ├── skills.js        ← skill categories data + card render
│   │   ├── projects.js      ← card generation + filter + modal
│   │   └── chatbot.js       ← AI chat (Cloudflare Worker proxy, sessionStorage memory)
│   ├── img/
│   │   └── maskot.webp      ← sticky mascot (resized, 50 KB)
│   └── frames/              ← 210 animation frames WebP 1080p (ezgif-frame-001.webp … 210)
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
