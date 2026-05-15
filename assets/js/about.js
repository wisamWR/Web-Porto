/* about.js — Terminal typing animation + GSAP counter for About / Core System section */

const _terminalLines = [
  '> UNIT DESIGNATION : AXIOM',
  '> OPERATOR        : MOHAMMAD WISAM WIRAGHINA',
  '> ORIGIN          : UNIVERSITAS DIAN NUSWANTORO',
  '> SPECIALIZATION  : COMPUTER VISION / AI / WEB DEV / MOBILE',
  '> STATUS          : OPERATIONAL',
  '>',
  '> BIOGRAPHY LOADED:',
  '> Mahasiswa passionate di bidang Computer Vision dan AI/ML.',
  '> Membangun solusi nyata — dari deteksi objek hingga web full-stack.',
  '> Currently: building the future, one model at a time.',
];

let _typingStarted = false;

function _startTyping() {
  const output = document.getElementById('terminal-output');
  if (!output || _typingStarted) return;
  _typingStarted = true;

  let lineIdx  = 0;
  let charIdx  = 0;
  let spanEl   = null;
  const cursor = document.createElement('span');
  cursor.className = 'terminal-cursor';

  function tick() {
    if (lineIdx >= _terminalLines.length) {
      if (spanEl) spanEl.appendChild(cursor);
      return;
    }

    if (charIdx === 0) {
      spanEl = document.createElement('span');
      spanEl.className = 'terminal-line';
      output.appendChild(spanEl);
    }

    const line = _terminalLines[lineIdx];

    if (charIdx < line.length) {
      // Remove cursor, append char, re-append cursor
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
      spanEl.appendChild(document.createTextNode(line[charIdx]));
      spanEl.appendChild(cursor);
      charIdx++;
      setTimeout(tick, 30);
    } else {
      // Line finished — add line break, pause before next line
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
      output.appendChild(document.createElement('br'));
      lineIdx++;
      charIdx = 0;
      setTimeout(tick, 200);
    }
  }

  tick();
}

function _startCounters() {
  document.querySelectorAll('.stat-card').forEach(card => {
    const numEl = card.querySelector('.stat-num');
    if (!numEl) return;
    const target = parseInt(numEl.dataset.target, 10);
    const obj    = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate() { numEl.textContent = Math.round(obj.val); },
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        once: true
      }
    });
  });
}

function initAbout() {
  if (typeof ScrollTrigger === 'undefined') return;
  ScrollTrigger.create({
    trigger: '#about',
    start: 'top 70%',
    once: true,
    onEnter: () => {
      _startTyping();
      _startCounters();
    }
  });
}
