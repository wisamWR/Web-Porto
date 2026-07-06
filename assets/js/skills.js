/* skills.js — Skill matrix: kategori keahlian + chip teknologi, render dinamis */

const _skillCategories = [
  {
    id: 'computer-vision',
    label: 'COMPUTER VISION',
    icon: '&#9673;', // ◉
    desc: 'Object detection & edge deployment',
    skills: ['Python', 'OpenCV', 'YOLOv8 / YOLO11', 'TensorRT', 'Jetson Nano', 'Roboflow']
  },
  {
    id: 'ai-data-science',
    label: 'AI & DATA SCIENCE',
    icon: '&#10070;', // ❖
    desc: 'ML modeling, clustering & analytics',
    skills: ['Scikit-learn', 'Pandas', 'K-Means', 'Logistic Regression', 'Streamlit', 'Gemini API']
  },
  {
    id: 'web-dev',
    label: 'WEB DEVELOPMENT',
    icon: '&#9670;', // ◆
    desc: 'Full-stack web applications',
    skills: ['TypeScript', 'Next.js', 'PHP', 'CodeIgniter 4', 'Prisma', 'PostgreSQL', 'MySQL']
  },
  {
    id: 'mobile',
    label: 'MOBILE',
    icon: '&#9646;', // ▮
    desc: 'Cross-platform mobile apps',
    skills: ['Flutter', 'Dart', 'Supabase', 'REST API']
  },
  {
    id: 'web3-iot',
    label: 'WEB3 & IOT',
    icon: '&#10022;', // ✦
    desc: 'Decentralized apps & embedded systems',
    skills: ['Solidity', 'Web3.js', 'IoT Sensors', 'Flask Dashboard']
  },
  {
    id: 'tools',
    label: 'TOOLS & PLATFORM',
    icon: '&#9881;', // ⚙
    desc: 'Development workflow',
    skills: ['Git / GitHub', 'Jupyter', 'Kaggle', 'Vercel', 'Cloudflare Workers']
  }
];

function initSkills() {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  _skillCategories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'skill-card glass-panel';
    card.innerHTML = `
      <div class="skill-card-head">
        <span class="skill-icon">${cat.icon}</span>
        <div>
          <h3 class="skill-title">${cat.label}</h3>
          <p class="skill-desc">${cat.desc}</p>
        </div>
      </div>
      <div class="skill-chips">
        ${cat.skills.map(s => `<span class="skill-chip">${s}</span>`).join('')}
      </div>
    `;
    grid.appendChild(card);
  });

  /* Reveal animation per kartu (elemen dibuat setelah main.js scan .reveal) */
  gsap.utils.toArray('#skills-grid .skill-card').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 32,
      duration: 0.6,
      delay: (i % 3) * 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });

  if (window.addCursorHover) addCursorHover(grid.querySelectorAll('.skill-card'));
}
