# AXIOM Portfolio — Agent Blueprint
> Dokumen ini adalah panduan lengkap untuk AI coding agent dalam membangun website portofolio personal dengan tema futuristik. Baca seluruh dokumen sebelum menulis satu baris kode pun.

---

## 1. Identitas & Tujuan Proyek

Website ini adalah **portofolio personal** milik **Mohammad Wisam Wiraghina**, mahasiswa Universitas Dian Nuswantoro yang memiliki minat di bidang Computer Vision, AI/ML, Web Development, Mobile Development, dan Web3. Tujuan utama website adalah memberikan kesan profesional, modern, dan futuristik kepada siapapun yang mengunjunginya — baik recruiter, dosen, maupun kolaborator teknis.

Karakter maskot bernama **AXIOM** adalah jiwa dari website ini. AXIOM bukan sekadar dekorasi — ia adalah entitas interaktif yang hadir di seluruh halaman, bereaksi terhadap scroll dan mouse, dan di masa depan akan dikembangkan menjadi chatbot AI.

---

## 2. Design System

Seluruh elemen visual wajib mengikuti design system berikut **tanpa pengecualian**:

### 2.1 Color Palette

```
--color-bg         : #050510   /* hitam keunguan, warna kanvas utama */
--color-primary    : #00F5FF   /* cyan neon, warna aksen utama */
--color-secondary  : #7B2FFF   /* electric purple */
--color-accent     : #FF2D78   /* magenta, untuk highlight & CTA */
--color-text       : #E2E8F0   /* putih soft, teks utama */
--color-text-muted : #94A3B8   /* abu-abu, teks sekunder */
--color-border     : rgba(0, 245, 255, 0.15) /* cyan transparan untuk border */
```

### 2.2 Typography

- **Primary font**: Font monospace / sci-fi. Gunakan `'Share Tech Mono'` atau `'Orbitron'` dari Google Fonts.
- **Body font**: `'Share Tech Mono'` untuk konsistensi terminal feel.
- **Heading**: `'Orbitron'` weight 700–900 untuk judul section besar.
- Seluruh teks menggunakan warna `--color-text` di atas background gelap.

### 2.3 Spacing & Layout

- Layout berbasis **single-page** (SPA feel) dengan smooth scroll antar section.
- Full-width, full-height per section (`100vw`, `min-height: 100vh`).
- Container max-width: `1200px`, centered.
- Section padding: `80px` atas-bawah pada desktop, `48px` pada mobile.

### 2.4 Visual Language

- **Glassmorphism** untuk card dan panel: `background: rgba(255,255,255,0.03)`, `backdrop-filter: blur(12px)`, border cyan transparan.
- **Neon glow** untuk elemen interaktif: `box-shadow: 0 0 20px rgba(0, 245, 255, 0.4)`.
- **Gradient text** untuk heading utama: linear gradient dari `--color-primary` ke `--color-secondary`.
- Tidak ada warna putih murni atau latar terang di mana pun.

---

## 3. Tech Stack

```
Core            : HTML5, CSS3 (custom properties), Vanilla JavaScript (ES6+)
Animasi Partikel: Three.js (particle system)
Scroll & Transisi: GSAP 3 + ScrollTrigger plugin
Animasi frame   : Canvas API (untuk PNG sequence AXIOM)
Font            : Google Fonts (Orbitron, Share Tech Mono)
Icons           : Tidak ada ikon library — gunakan SVG inline atau Unicode
```

**Aturan penting:**
- Tidak menggunakan framework CSS (Bootstrap, Tailwind, dll).
- Tidak menggunakan React, Vue, atau framework JS apapun.
- Semua animasi dikontrol oleh GSAP dan Three.js.
- File HTML, CSS, JS dipisah (bukan inline style/script kecuali untuk nilai kecil).

---

## 4. Struktur File Proyek

```
axiom-portfolio/
├── index.html
├── assets/
│   ├── css/
│   │   ├── main.css          # global styles, design tokens, reset
│   │   ├── cursor.css        # custom cursor styles
│   │   ├── hero.css          # hero section
│   │   ├── about.css         # about / core system section
│   │   ├── projects.css      # projects section & holographic cards
│   │   └── contact.css       # contact section
│   ├── js/
│   │   ├── main.js           # init semua module, smooth scroll
│   │   ├── cursor.js         # custom cursor logic
│   │   ├── axiom.js          # AXIOM PNG sequence playback + scroll behavior
│   │   ├── particles.js      # Three.js particle system (assembly + idle)
│   │   ├── about.js          # terminal typing animation + counter
│   │   └── projects.js       # filter tabs + holographic card interactions
│   ├── frames/               # 210 PNG frames AXIOM (frame_001.png - frame_210.png)
│   └── fonts/                # (opsional, jika font di-host sendiri)
└── README.md
```

---

## 5. Custom Cursor

Cursor default browser **diganti sepenuhnya**. Implementasi:

- Lingkaran luar: `width: 32px`, `height: 32px`, border `1.5px solid #00F5FF`, `border-radius: 50%`, transisi lambat mengikuti mouse (lerp/lag effect).
- Titik dalam: `width: 6px`, `height: 6px`, background `#00F5FF`, mengikuti mouse persis (tanpa lag).
- Saat hover di atas elemen interaktif (link, button, card): lingkaran membesar (`scale(2)`), opacity turun, warna berubah ke `#7B2FFF`.
- Saat di luar window atau di atas iframe: cursor tersembunyi dengan graceful.
- CSS: `cursor: none` pada `body` dan semua elemen.

---

## 6. Section 1 — Hero

### 6.1 Struktur Layer (dari bawah ke atas)

```
Z-index 0  : Layer Background — solid #050510, full screen, statis
Z-index 1  : Layer Particle Field — Three.js canvas, full screen
Z-index 2  : Layer AXIOM — canvas element untuk PNG sequence playback
Z-index 3  : Layer UI — teks hero (nama, tagline, CTA)
```

### 6.2 Layer 1 — Background

- Warna solid `#050510`.
- Tidak ada texture, gradient, atau gambar.
- Full width, full height. Diam sepenuhnya.

### 6.3 Layer 2 — Particle Field (Three.js)

Sistem partikel memiliki **dua fase** yang berjalan secara sekuensial:

**FASE A — Assembly (0.0s → 2.5s)**

1. Saat halaman pertama dimuat, ribuan partikel (target: 3000–5000 titik) muncul di posisi acak di seluruh layar dengan opacity rendah.
2. Tiap partikel bergerak menuju koordinat target yang secara kolektif membentuk **siluet/outline AXIOM** di tengah layar.
3. Gerakan menggunakan easing `power3.out` via GSAP — partikel yang jauh bergerak lebih cepat, yang dekat melambat saat tiba.
4. Warna partikel: campuran `#00F5FF` (cyan) dan `#7B2FFF` (purple), distribusi acak.
5. Ukuran partikel: bervariasi antara `1px` hingga `3px`.

**FASE B — Idle (setelah 2.5s)**

1. Setelah assembly selesai, sebagian partikel (±30%) meninggalkan formasi dan kembali melayang bebas di seluruh layar sebagai **ambient particles**.
2. Sisa partikel (±70%) tetap berkerumun di area sekitar AXIOM dengan gerakan lambat organik.
3. **Mouse interaction**: Saat mouse bergerak, partikel dalam radius `120px` dari cursor akan terdorong menjauh (repulsion force), kemudian kembali ke posisi semula secara perlahan.

### 6.4 Layer 3 — AXIOM (PNG Sequence)

- **Format**: 210 file PNG transparan, diberi nama `frame_001.png` hingga `frame_210.png`, disimpan di `assets/frames/`.
- **Playback engine**: Canvas API (`<canvas>` element).
- **Target frame rate**: 30 FPS.
- **Posisi**: Center horizontal, bottom-aligned di viewport hero section.

**Timeline kemunculan AXIOM:**

```
0.0s  → Canvas ada tapi opacity 0. Preload semua 210 frame berjalan di background.
0.0s  → Partikel assembly mulai (Fase A).
2.5s  → Partikel selesai berkumpul. AXIOM mulai fade in (opacity 0 → 1, durasi 0.5s).
3.0s  → AXIOM fully visible (opacity 1). PNG sequence mulai diputar dari frame 1.
Xend  → Frame 210 tercapai — AXIOM berhenti di frame terakhir (pose idle/berdiri).
        Partikel masuk Fase B (idle mode).
```

- **Preloading**: Semua 210 frame harus di-preload sebelum animasi dimulai. Tampilkan loading indicator sederhana jika preload belum selesai.
- **Smooth playback**: Gunakan `requestAnimationFrame` dengan delta time untuk frame rate yang konsisten di semua device.

### 6.5 Layer 4 — UI Teks Hero

Teks muncul setelah AXIOM fully visible (setelah 3.0s), dengan GSAP stagger animation:

```
[Nama: MOHAMMAD WISAM WIRAGHINA]   → gradient text, Orbitron font, besar
[Tagline / role]                → "Computer Vision Engineer · AI Developer · Builder"
[CTA Button: "View Projects"]   → neon border, hover glow effect
```

Teks diposisikan agar tidak bertabrakan dengan AXIOM. Rekomendasikan teks di sisi kiri atau atas, AXIOM di tengah-kanan.

### 6.6 AXIOM Scroll Behavior

Ini adalah fitur kritis yang menghubungkan hero section dengan section lainnya:

- **Di Hero**: AXIOM tampil full body di tengah layar, hasil dari assembly partikel.
- **Saat user scroll ke bawah**: AXIOM tidak langsung menghilang. Ia secara bertahap bergerak ke posisi `bottom-center` halaman dan "tenggelam" — hanya bagian kepala dan bahu (±25% dari tinggi karakter) yang terlihat di atas batas bawah viewport.
- **Posisi sticky**: Setelah transisi, AXIOM menjadi elemen `position: fixed` di `bottom: -75%` dari tinggi karakter, `left: 50%`, `transform: translateX(-50%)`. Ia selalu terlihat mengintip dari bawah di setiap section.
- **Idle state di sticky position**: Partikel kecil melayang pelan di sekitar area kepala AXIOM. Eye visor (jika ada di karakter) bersinar pelan dengan `animation: pulse` pada glow effect.
- Transisi dari hero ke sticky position dikontrol oleh **GSAP ScrollTrigger**, smooth dan tidak patah-patah.

---

## 7. Section 2 — About ("Core System")

### 7.1 Identitas Section

```html
<section id="about" data-section="core-system">
```

- **Nama section yang ditampilkan**: `CORE_SYSTEM`
- **Visual style**: Terminal / command-line interface aesthetic.
- Header section muncul seperti baris terminal: `> INITIALIZING CORE_SYSTEM...`

### 7.2 Layout

Dua kolom pada desktop:
- **Kolom kiri (60%)**: Narasi lore AXIOM + bio singkat pemilik dalam format terminal typing animation.
- **Kolom kanan (40%)**: Panel statistik dengan animasi counter.

Satu kolom pada mobile (stacked).

### 7.3 Terminal Typing Animation

- Teks muncul karakter per karakter, seperti output dari command line.
- Kursor berkedip (`|`) di akhir baris yang sedang diketik.
- Setiap baris memiliki jeda sebelum baris berikutnya mulai.
- Animasi dimulai saat section masuk viewport (ScrollTrigger).

Konten terminal (placeholder — owner mengisi nanti):

```
> UNIT DESIGNATION : AXIOM
> OPERATOR        : MOHAMMAD WISAM WIRAGHINA
> ORIGIN          : UNIVERSITAS DIAN NUSWANTORO
> SPECIALIZATION  : COMPUTER VISION / AI / WEB DEV
> STATUS          : OPERATIONAL
>
> BIOGRAPHY LOADED:
> [Bio singkat 2-3 kalimat tentang pemilik — diisi manual]
```

### 7.4 Statistik Counter

Empat kotak statistik yang muncul dengan animasi counter (angka naik dari 0) saat scroll masuk viewport:

```
[ 3+ ]          [ 10 ]          [ 15+ ]         [ 5 ]
Tahun           Projects        Technologies    Categories
Belajar         Selesai         Dikuasai        Keahlian
```

- Angka menggunakan font Orbitron ukuran besar dengan warna `--color-primary`.
- Label di bawah menggunakan Share Tech Mono ukuran kecil, warna muted.
- Setiap kotak punya border cyan dengan glow effect.
- Counter animasi menggunakan GSAP `to()` pada objek dengan property numerik.

---

## 8. Section 3 — Projects

### 8.1 Identitas Section

```html
<section id="projects" data-section="projects">
```

- **Nama section yang ditampilkan**: `PROJECT_DATABASE`
- Header: `> LOADING PROJECT DATABASE...`

### 8.2 Filter System

Tab filter horizontal di bagian atas, menggunakan tombol berbentuk pill:

```
[ ALL ]  [ COMPUTER VISION ]  [ AI & DATA SCIENCE ]  [ WEB DEV ]  [ MOBILE ]  [ WEB3 & IOT ]
```

- Tab aktif: background `--color-primary`, teks gelap.
- Tab non-aktif: border cyan transparan, teks cyan.
- Saat tab diklik, card yang tidak sesuai kategori fade out dan collapse. Gunakan GSAP untuk transisi filter.

### 8.3 Holographic Card Grid

Layout: CSS Grid, `3 kolom` pada desktop, `2 kolom` pada tablet, `1 kolom` pada mobile.

**Anatomi tiap card:**

```
┌─────────────────────────────────────┐
│  [STATUS BADGE]          [CATEGORY] │
│                                     │
│  [NAMA PROJECT]                     │
│  [Deskripsi singkat 1-2 kalimat]    │
│                                     │
│  [TAG] [TAG] [TAG]                  │
│                                     │
│  [→ View Detail]                    │
└─────────────────────────────────────┘
```

**Holographic effect (CSS + JS):**

- Background card: `rgba(0, 245, 255, 0.03)` dengan `backdrop-filter: blur(12px)`.
- Border: `1px solid rgba(0, 245, 255, 0.2)`.
- **Saat hover**: Card sedikit terangkat (`translateY(-8px)`), border glow intensitas naik, muncul efek shimmer/rainbow gradient yang bergerak mengikuti posisi mouse di atas card (gunakan JavaScript `mousemove` untuk kalkulasi sudut gradien — ini yang menciptakan efek holografik).
- Shimmer gradient: `linear-gradient(sudut_dari_mouse, transparent, rgba(0,245,255,0.1), rgba(123,47,255,0.1), transparent)`.

**Featured card (Terrafy):**

- Spanning 2 kolom (`grid-column: span 2`) pada desktop.
- Badge tambahan: `⭐ FEATURED`.
- Glow lebih terang dari card biasa.

### 8.4 Daftar Project (Data)

Data ini digunakan untuk generate card secara programatik via JavaScript. Simpan sebagai array objek di `projects.js`:

```javascript
const projects = [

  // ── COMPUTER VISION ──────────────────────────────────────────
  {
    id: "coin-detection",
    name: "Coin Detection (YOLOv11)",
    category: "computer-vision",
    status: "solo",
    description: "Deteksi real-time 4 jenis koin US dari webcam dengan akurasi 93.9% mAP. Custom trained YOLOv11s pada 750 gambar.",
    tags: ["Python", "YOLOv11", "OpenCV", "Jupyter"],
    github: "https://github.com/wisamWR/ComVi_CoinDetection",
    demo: null,
    featured: false
  },
  {
    id: "smart-parking",
    name: "Smart Parking Detection",
    category: "computer-vision",
    status: "in-progress",
    description: "Perbandingan YOLO11n vs YOLOv8n pada dataset PKLot. Training di Kaggle GPU T4×2 dengan demo Streamlit.",
    tags: ["Python", "YOLO11n", "YOLOv8n", "Streamlit"],
    github: null,
    demo: null,
    featured: false
  },
  {
    id: "smart-agriculture",
    name: "Smart Agriculture IoT",
    category: "computer-vision",
    status: "completed",
    description: "Deteksi penyakit cabai dengan YOLO11n + TensorRT FP16 di Jetson Nano. Dilengkapi sensor kelembaban tanah dan dashboard Flask real-time.",
    tags: ["Python", "TensorRT", "Jetson Nano", "Flask"],
    github: null,
    demo: null,
    featured: false
  },

  // ── AI & DATA SCIENCE ─────────────────────────────────────────
  {
    id: "klasifikasi-gempa",
    name: "Klasifikasi Gempa K-Means",
    category: "ai-data-science",
    status: "live",
    description: "Clustering risiko gempa Indonesia (k=4, Silhouette ~0.47). Peta interaktif Folium, filter data, dan AI Prediction. Streamlit app terdeploy.",
    tags: ["Python", "Scikit-learn", "Streamlit", "Folium"],
    github: "https://github.com/wisamWR/ClassificasiGempa-KMeans",
    demo: null, // isi URL demo jika ada
    featured: false
  },
  {
    id: "fraud-detection",
    name: "Fraud Detection",
    category: "ai-data-science",
    status: "solo",
    description: "Deteksi transaksi penipuan keuangan dengan Logistic Regression dan imbalance handling. Dilengkapi Streamlit prediction app.",
    tags: ["Python", "Scikit-learn", "Streamlit", "Jupyter"],
    github: "https://github.com/wisamWR/Fraud_Detection",
    demo: null,
    featured: false
  },

  // ── WEB DEVELOPMENT ──────────────────────────────────────────
  {
    id: "terrafy",
    name: "Terrafy — Sertifikat Digital",
    category: "web-dev",
    status: "live",
    description: "Sistem pengamanan sertifikat tanah menggunakan Steganografi LSB + Kriptografi. Full-stack Next.js 16, Prisma, PostgreSQL, Supabase. Multi-role system, deployed di Vercel.",
    tags: ["TypeScript", "Next.js 16", "Steganografi", "Prisma", "PostgreSQL"],
    github: "https://github.com/wisamWR/Terrafy-Stegano-safety_certificate",
    demo: null, // isi URL demo Vercel
    featured: true // ← FEATURED CARD
  },
  {
    id: "dailyin",
    name: "DailyIn — AI Smart Journal",
    category: "web-dev",
    status: "live",
    description: "CMS artikel dengan AI Writer, caption generator, dan smart summary powered by Google Gemini API. Dibangun dengan PHP Native dan AJAX.",
    tags: ["PHP", "Gemini AI", "MySQL", "Bootstrap 5"],
    github: "https://github.com/wisamWR/DailyIn-web",
    demo: null,
    featured: false
  },
  {
    id: "advanced-project",
    name: "Advanced Project (CI4)",
    category: "web-dev",
    status: "solo",
    description: "Web app CodeIgniter 4 dengan JWT authentication, JSON file storage, dan tutorial viewer publik menggunakan Prism.js dan AJAX polling.",
    tags: ["PHP", "CodeIgniter 4", "JWT", "Prism.js"],
    github: null,
    demo: null,
    featured: false
  },

  // ── MOBILE DEVELOPMENT ────────────────────────────────────────
  {
    id: "petani-maju",
    name: "PetaniMaju",
    category: "mobile",
    status: "live",
    description: "Asisten digital untuk petani Indonesia — cuaca 7 hari, info hama, kalender tanam, dan forum komunitas. Flutter + Supabase + OpenWeatherMap.",
    tags: ["Flutter", "Dart", "Supabase", "OpenWeatherMap"],
    github: "https://github.com/wisamWR/PetaniMaju-Mobile",
    demo: null,
    featured: false
  },

  // ── WEB3 & IOT ────────────────────────────────────────────────
  {
    id: "dao-vote-vibe",
    name: "DAO Vote-Vibe",
    category: "web3-iot",
    status: "completed",
    description: "Platform voting terdesentralisasi berbasis blockchain. [Deskripsi lengkap diisi manual oleh owner]",
    tags: ["Solidity", "Web3.js", "Blockchain"], // sesuaikan dengan tech stack asli
    github: "https://github.com/wisamWR/DAO_Vote-vibe",
    demo: null,
    featured: false
  }

];
```

> **Catatan untuk owner**: Isi field `demo`, `description` untuk DAO_Vote-vibe, dan sesuaikan `tags` sesuai tech stack asli. Semua `null` perlu diisi sebelum launch.

### 8.5 Modal Detail Project

Saat card diklik, muncul **modal overlay** (bukan halaman baru):

- Background: `rgba(5, 5, 16, 0.95)` dengan blur.
- Konten: nama lengkap, deskripsi panjang, tech stack lengkap, tombol GitHub & Live Demo.
- Tombol close (X) di pojok kanan atas.
- Animasi masuk: scale dari `0.9` ke `1.0` + fade in via GSAP.
- Tutup dengan klik backdrop atau tombol close.

---

## 9. Section 4 — Contact

### 9.1 Identitas Section

```html
<section id="contact" data-section="contact">
```

- **Nama section yang ditampilkan**: `ESTABLISH_CONNECTION`
- Header: `> OPENING COMMUNICATION CHANNEL...`

### 9.2 Konten

Layout sederhana, centered:

- Kalimat pembuka pendek (diisi manual oleh owner).
- Daftar kontak dalam format card kecil dengan icon SVG inline:
  - Email
  - GitHub (`https://github.com/wisamWR`)
  - LinkedIn (diisi manual)
  - Instagram / platform lain (opsional, diisi manual)
- Setiap kontak card: hover → neon glow, cursor pointer.
- **Tidak ada form kontak** — semua kontak bersifat link langsung.

---

## 10. Navigation

- **Navbar** fixed di atas, transparan dengan backdrop blur.
- Logo/nama kiri: `AXIOM` dalam font Orbitron dengan warna gradient.
- Menu kanan: `HOME · ABOUT · PROJECTS · CONTACT` — teks monospace kecil.
- Active state: underline neon cyan saat section yang bersangkutan aktif di viewport.
- **Mobile**: Hamburger menu → slide-in panel dari kanan.
- Smooth scroll ke section saat menu diklik.

---

## 11. Global Animations & Polish

### 11.1 Scroll Reveal

Setiap elemen yang masuk viewport mendapat animasi reveal:
- Default: `opacity: 0, y: 30px` → `opacity: 1, y: 0`, durasi `0.6s`, easing `power2.out`.
- Semua reveal dikontrol via GSAP ScrollTrigger dengan `trigger` per elemen.

### 11.2 Smooth Scroll

Gunakan GSAP `ScrollSmoother` (jika license tersedia) atau implementasi scroll smooth manual via CSS `scroll-behavior: smooth` + JS interception untuk kontrol lebih.

### 11.3 Performance

- Semua 210 frame PNG di-preload sebelum animasi dimulai.
- Three.js particle system menggunakan `BufferGeometry` untuk efisiensi (bukan `Geometry` yang deprecated).
- GSAP animations menggunakan `will-change: transform` pada elemen yang dianimasi.
- Lazy load card images jika ada.
- Target: **60 FPS** pada desktop, **30 FPS** minimum pada mobile.

### 11.4 Responsiveness

- Breakpoints:
  - Desktop: `> 1024px`
  - Tablet: `768px – 1024px`
  - Mobile: `< 768px`
- Particle count dikurangi 50% pada mobile untuk performa.
- AXIOM sticky behavior tetap aktif di semua ukuran layar, ukuran karakter disesuaikan.

---

## 12. AXIOM — Panduan Teknis Lengkap

### 12.1 Preloading Engine

```javascript
// Pseudocode — implementasikan di axiom.js
const TOTAL_FRAMES = 210;
const frames = [];

async function preloadFrames() {
  const promises = [];
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const padded = String(i).padStart(3, '0');
    img.src = `assets/frames/frame_${padded}.png`;
    promises.push(new Promise(resolve => img.onload = resolve));
    frames.push(img);
  }
  await Promise.all(promises);
  // Mulai animasi setelah semua frame loaded
  startParticleAssembly();
}
```

### 12.2 Canvas Playback

```javascript
// Pseudocode
const canvas = document.getElementById('axiom-canvas');
const ctx = canvas.getContext('2d');
let currentFrame = 0;
let lastTime = 0;
const FPS = 30;
const FRAME_INTERVAL = 1000 / FPS;

function playSequence(timestamp) {
  if (timestamp - lastTime >= FRAME_INTERVAL) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frames[currentFrame], 0, 0, canvas.width, canvas.height);
    currentFrame = Math.min(currentFrame + 1, TOTAL_FRAMES - 1);
    lastTime = timestamp;
  }
  if (currentFrame < TOTAL_FRAMES - 1) {
    requestAnimationFrame(playSequence);
  }
  // Jika sudah frame terakhir, AXIOM diam di pose idle
}
```

### 12.3 Scroll Transition (Hero → Sticky)

```javascript
// Pseudocode — GSAP ScrollTrigger
ScrollTrigger.create({
  trigger: "#hero",
  start: "bottom 80%",
  onEnter: () => transitionAxiomToSticky(),
  onLeaveBack: () => transitionAxiomToHero()
});

function transitionAxiomToSticky() {
  gsap.to("#axiom-canvas", {
    position: "fixed",
    bottom: "-75%_of_character_height",
    left: "50%",
    xPercent: -50,
    duration: 0.8,
    ease: "power2.inOut"
  });
}
```

---

## 13. Placeholder & Hal yang Diisi Manual oleh Owner

Sebelum launch, owner (Wisam) wajib mengisi bagian berikut:

| Item | Lokasi | Status |
|------|--------|--------|
| Bio singkat (2-3 kalimat) | `about.js` — konten terminal | ⬜ Belum |
| URL live demo Terrafy | `projects.js` — field `demo` | ⬜ Belum |
| URL live demo Klasifikasi Gempa | `projects.js` — field `demo` | ⬜ Belum |
| URL live demo DailyIn | `projects.js` — field `demo` | ⬜ Belum |
| Deskripsi lengkap DAO_Vote-vibe | `projects.js` — field `description` | ⬜ Belum |
| Tech stack DAO_Vote-vibe | `projects.js` — field `tags` | ⬜ Belum |
| GitHub URL DAO_Vote-vibe | `projects.js` — field `github` | ⬜ Belum |
| Alamat Email | `index.html` — contact section | ⬜ Belum |
| URL LinkedIn | `index.html` — contact section | ⬜ Belum |
| 210 frame PNG AXIOM | `assets/frames/` | ⬜ Belum diupload |
| Teks tagline hero | `index.html` — hero UI layer | ⬜ Belum |

---

## 14. Urutan Pengerjaan yang Disarankan untuk Agent

Ikuti urutan ini agar tidak ada dependency yang rusak:

1. **Setup struktur file** — buat semua folder dan file kosong sesuai struktur di bagian 4.
2. **`main.css`** — design tokens (CSS custom properties), reset, global styles, typography.
3. **`index.html`** — kerangka HTML lengkap semua section, import semua CSS & JS.
4. **`cursor.js` + `cursor.css`** — custom cursor, implementasi pertama yang bisa langsung terlihat.
5. **`particles.js`** — Three.js particle system: Fase A (assembly) dan Fase B (idle). Gunakan koordinat placeholder untuk formasi AXIOM.
6. **`axiom.js`** — preload engine + canvas playback + scroll behavior (sticky transition).
7. **`hero.css`** — styling hero section, layer stacking, teks UI, CTA button.
8. **`about.js` + `about.css`** — terminal typing animation, counter animation, layout.
9. **`projects.js` + `projects.css`** — data project, card generation, filter tabs, holographic effect, modal.
10. **`contact.css`** + konten contact di HTML — styling dan kontak links.
11. **`main.js`** — inisialisasi semua modul, smooth scroll, navbar active state, global ScrollTrigger setup.
12. **Testing & polish** — test di berbagai ukuran layar, optimasi performa partikel, cek 60 FPS.

---

*Dokumen ini dibuat sebagai blueprint teknis lengkap. Agent diharapkan mengikuti setiap spesifikasi dengan presisi. Jika ada ambiguitas, prioritaskan visual yang paling futuristik dan imersif.*
