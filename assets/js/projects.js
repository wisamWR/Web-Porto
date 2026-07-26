/* projects.js — Project data, dynamic card generation, filter tabs, holographic effect, modal */

const projects = [
  {
    id: "coin-detection",
    name: "Coin Detection (YOLOv11)",
    category: "computer-vision",
    status: "solo",
    description:
      "Deteksi real-time 4 jenis koin US dari webcam dengan akurasi 93.9% mAP. Custom trained YOLOv11s pada 750 gambar.",
    tags: ["Python", "YOLOv11", "OpenCV", "Jupyter"],
    github: "https://github.com/wisamWR/ComVi_CoinDetection",
    demo: null,
    featured: false,
  },
  {
    id: "smart-parking",
    name: "Smart Parking Detection",
    category: "computer-vision",
    status: "development",
    description:
      "Perbandingan YOLO11n vs YOLOv8n pada dataset PKLot. Training di Kaggle GPU T4×2 dengan demo Streamlit.",
    tags: ["Python", "YOLO11n", "YOLOv8n", "Streamlit"],
    github: "https://github.com/wisamWR/Smart_Partking-app",
    demo: "https://smartparking-detection-preversion.streamlit.app",
    featured: true,
  },
  {
    id: "smart-agriculture",
    name: "Smart Agriculture IoT",
    category: "computer-vision",
    status: "completed",
    description:
      "Deteksi penyakit cabai dengan YOLO11n + TensorRT FP16 di Jetson Nano. Sensor kelembaban tanah dan dashboard Flask real-time.",
    tags: ["Python", "TensorRT", "Jetson Nano", "Flask"],
    github: null,
    demo: null,
    featured: false,
  },
  {
    id: "klasifikasi-gempa",
    name: "Klasifikasi Gempa K-Means",
    category: "ai-data-science",
    status: "live",
    description:
      "Clustering risiko gempa Indonesia (k=4, Silhouette ~0.47). Peta interaktif Folium, filter data, dan AI Prediction. Streamlit app terdeploy.",
    tags: ["Python", "Scikit-learn", "Streamlit", "Folium"],
    github: "https://github.com/wisamWR/ClassificasiGempa-KMeans",
    demo: "https://classificasigempa-kmeans-a5gw8g6epvrdossbycxfbs.streamlit.app",
    featured: true,
  },
  {
    id: "fraud-detection",
    name: "Fraud Detection",
    category: "ai-data-science",
    status: "solo",
    description:
      "Deteksi transaksi penipuan keuangan dengan Logistic Regression dan imbalance handling. Streamlit prediction app.",
    tags: ["Python", "Scikit-learn", "Streamlit", "Jupyter"],
    github: "https://github.com/wisamWR/Fraud_Detection",
    demo: null,
    featured: false,
  },
  {
    id: "terrafy",
    name: "Terrafy — Sertifikat Digital",
    category: "web-dev",
    status: "live",
    description:
      "Sistem pengamanan sertifikat tanah dengan Steganografi LSB + Kriptografi. Full-stack Next.js 16, Prisma, PostgreSQL, Supabase. Multi-role system, deployed di Vercel.",
    tags: ["TypeScript", "Next.js 16", "Steganografi", "Prisma", "PostgreSQL"],
    github: "https://github.com/wisamWR/Terrafy-Stegano-safety_certificate",
    demo: "https://terrafy-stegano-safety-certificate.vercel.app",
    featured: true,
  },
  {
    id: "dailyin",
    name: "DailyIn — AI Smart Journal",
    category: "web-dev",
    status: "live",
    description:
      "CMS artikel dengan AI Writer, caption generator, dan smart summary powered by Google Gemini API. PHP Native + AJAX.",
    tags: ["PHP", "Gemini AI", "MySQL", "Bootstrap 5"],
    github: "https://github.com/wisamWR/DailyIn-web",
    demo: null,
    featured: false,
  },
  {
    id: "advanced-project",
    name: "Advanced Project (CI4)",
    category: "web-dev",
    status: "solo",
    description:
      "Web app CodeIgniter 4 dengan JWT authentication, JSON file storage, dan tutorial viewer publik menggunakan Prism.js dan AJAX polling.",
    tags: ["PHP", "CodeIgniter 4", "JWT", "Prism.js"],
    github: null,
    demo: null,
    featured: false,
  },
  {
    id: "petani-maju",
    name: "PetaniMaju",
    category: "mobile",
    status: "live",
    description:
      "Asisten digital petani Indonesia — cuaca 7 hari, info hama, kalender tanam, forum komunitas. Flutter + Supabase + OpenWeatherMap.",
    tags: ["Flutter", "Dart", "Supabase", "OpenWeatherMap"],
    github: "https://github.com/wisamWR/PetaniMaju-Mobile",
    demo: "https://petani-maju-web-download.vercel.app",
    featured: true,
  },
  {
    id: "dao-vote-vibe",
    name: "DAO Vote-Vibe",
    category: "web3-iot",
    status: "completed",
    description:
      "Platform voting terdesentralisasi berbasis blockchain. Smart contract Solidity, frontend Web3.js.",
    tags: ["Solidity", "Web3.js", "Blockchain"],
    github: "https://github.com/wisamWR/DAO_Vote-vibe",
    demo: null,
    featured: false,
  },
];

const _catLabels = {
  'computer-vision': 'COMPUTER VISION',
  'ai-data-science': 'AI & DATA SCIENCE',
  'web-dev': 'WEB DEV',
  'mobile': 'MOBILE',
  'web3-iot': 'WEB3 & IOT'
};

/* ── Build one card element ───────────────────────────────── */
function _buildCard(p) {
  const card = document.createElement('div');
  card.className = 'project-card' + (p.featured ? ' featured' : '');
  card.dataset.category = p.category;

  const links = [];
  if (p.github) links.push(`<a href="${p.github}" target="_blank" rel="noopener" class="card-link">&#8599; GitHub</a>`);
  if (p.demo)   links.push(`<a href="${p.demo}"   target="_blank" rel="noopener" class="card-link">&#8599; Live Demo</a>`);
  if (!links.length) links.push(`<span class="card-link muted">No public link yet</span>`);

  card.innerHTML = `
    <div class="card-top">
      <span class="card-status status-${p.status}">${p.status.replace('-', ' ')}</span>
      <div class="card-meta">
        ${p.featured ? '<span class="card-featured-badge">&#9733; FEATURED</span>' : ''}
        <span class="card-category">${_catLabels[p.category] || p.category}</span>
      </div>
    </div>
    <h3 class="card-name">${p.name}</h3>
    <p class="card-description">${p.description}</p>
    <div class="card-tags">${p.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}</div>
    <div class="card-actions">${links.join('')}</div>
  `;

  /* Holographic shimmer on mousemove */
  card.addEventListener('mousemove', (e) => {
    const r  = card.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    const mx = ((e.clientX - r.left) / r.width)  * 100;
    const my = ((e.clientY - r.top)  / r.height) * 100;
    card.style.background = `
      radial-gradient(circle at ${mx}% ${my}%, rgba(0,245,255,0.07) 0%, transparent 55%),
      linear-gradient(${angle}deg, transparent 20%, rgba(0,245,255,0.06) 50%, rgba(123,47,255,0.06) 70%, transparent 80%),
      rgba(0,245,255,0.03)
    `;
  });
  card.addEventListener('mouseleave', () => { card.style.background = ''; });

  /* Click → open modal */
  card.addEventListener('click', () => _openModal(p));

  return card;
}

/* ── Render / filter cards ────────────────────────────────── */
function _renderCards(filter) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const list = filter === 'all' ? projects : projects.filter(p => p.category === filter);
  list.forEach((p, i) => {
    const card = _buildCard(p);
    grid.appendChild(card);
    gsap.fromTo(card,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.4, delay: i * 0.06, ease: 'power2.out' }
    );
  });

  if (window.addCursorHover) addCursorHover(grid.querySelectorAll('.project-card'));
}

/* ── Modal ────────────────────────────────────────────────── */
let _lastFocused = null;

function _openModal(p) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  if (!overlay || !content) return;
  _lastFocused = document.activeElement;

  const links = [];
  if (p.github) links.push(`<a href="${p.github}" target="_blank" rel="noopener" class="modal-btn">&#8599; GitHub</a>`);
  if (p.demo)   links.push(`<a href="${p.demo}"   target="_blank" rel="noopener" class="modal-btn">&#8599; Live Demo</a>`);

  content.innerHTML = `
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
      <span class="card-status status-${p.status}">${p.status.replace('-', ' ')}</span>
      <span class="card-category">${_catLabels[p.category] || p.category}</span>
      ${p.featured ? '<span class="card-featured-badge">&#9733; FEATURED</span>' : ''}
    </div>
    <h2 class="modal-title">${p.name}</h2>
    <p class="modal-description">${p.description}</p>
    <div class="card-tags" style="margin-bottom:24px;">${p.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}</div>
    ${links.length ? `<div class="modal-links">${links.join('')}</div>` : ''}
  `;

  overlay.classList.add('open');
  gsap.fromTo('#project-modal',
    { scale: 0.88, opacity: 0, y: 20 },
    { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
  );

  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.focus();
}

function _closeModal() {
  const overlay = document.getElementById('modal-overlay');
  gsap.to('#project-modal', {
    scale: 0.88, opacity: 0, y: 20, duration: 0.25, ease: 'power2.in',
    onComplete: () => {
      overlay.classList.remove('open');
      if (_lastFocused?.focus) _lastFocused.focus();
    }
  });
}

/* ── Init ─────────────────────────────────────────────────── */
function initProjects() {
  _renderCards('all');

  /* Filter tabs */
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _renderCards(btn.dataset.filter);
    });
  });

  /* Modal close */
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.addEventListener('click', _closeModal);
  if (overlay)  overlay.addEventListener('click', (e) => { if (e.target === overlay) _closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') _closeModal(); });
}
