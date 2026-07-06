/* axiom.js — AXIOM: preload → scroll-scrubbed frames → scroll-driven mascot */

const TOTAL_FRAMES    = 210;
const HERO_TEXT_FRAME = 180;

/* Progressive loading: sparse keyframes first (page interactive cepat),
   sisanya diisi di background. Mobile hanya memuat 1 dari 3 frame. */
const REDUCED_MOTION  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_MOBILE       = window.innerWidth < 768;
const PRIORITY_STEP   = 7;                    // ~30 keyframes ≈ 4 MB sebelum unlock
const BG_STEP         = IS_MOBILE ? 3 : 1;    // mobile skip 2/3 frame (hemat ~18 MB)

const _frames      = new Array(TOTAL_FRAMES).fill(null);
const _loadedFlags = new Array(TOTAL_FRAMES).fill(false);
const _axiomCanvas = document.getElementById('axiom-canvas');
const _axiomCtx    = _axiomCanvas ? _axiomCanvas.getContext('2d') : null;

let _currentFrame  = 0;   // frame yang sedang tergambar (selalu frame yang sudah loaded)
let _targetFrame   = 0;   // frame ideal menurut posisi scroll
let _textRevealed  = false;
let _mascotActive  = false;
let _pinEndScroll  = 4000;

/* ── Mascot size constants ────────────────────────────────── */
const MASCOT_H_BIG   = Math.round(window.innerHeight * 0.82);
const MASCOT_H_SMALL = 360;   // minimum height — never goes below this
const MASCOT_BOT_END = -100;  // minimum bottom — shows 150px (head+shoulders)
const SHRINK_RANGE   = 1200;  // px of scroll to reach minimum
const FADE_RANGE     = 200;

/* ── Canvas: match viewport ───────────────────────────────── */
function _resizeCanvas() {
  if (!_axiomCanvas) return;
  _axiomCanvas.width  = window.innerWidth;
  _axiomCanvas.height = window.innerHeight;
  if (_frames[_currentFrame]) _drawFrame(_frames[_currentFrame]);
}
window.addEventListener('resize', _resizeCanvas);
_resizeCanvas();

/* ── Mascot img — created once, JS owns all styles ───────── */
function _getMascotImg() {
  let img = document.getElementById('axiom-sticky');
  if (!img) {
    img = document.createElement('img');
    img.id  = 'axiom-sticky';
    img.src = 'assets/img/maskot.webp';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.style.cssText = [
      'position:fixed',
      'bottom:0px',
      'left:50%',
      'transform:translateX(-50%)',
      'height:' + MASCOT_H_BIG + 'px',
      'width:auto',
      'z-index:9999',
      'opacity:0',
      'pointer-events:none',
      'filter:drop-shadow(0 0 30px rgba(0,245,255,0.5))',
      'transition:none'
    ].join(';');
    document.body.appendChild(img);
  }
  return img;
}

/* ── Scroll: fully scroll-driven mascot size + position ──── */
window.addEventListener('scroll', () => {
  const sy  = window.scrollY;
  const img = _getMascotImg();

  if (sy > _pinEndScroll) {
    _mascotActive       = true;
    const past          = sy - _pinEndScroll;
    const progress      = Math.min(past / SHRINK_RANGE, 1);
    const h   = MASCOT_H_BIG + (MASCOT_H_SMALL - MASCOT_H_BIG) * progress;
    const bot = MASCOT_BOT_END * progress;
    const opa = Math.min(past / FADE_RANGE, 1);

    img.style.height  = Math.round(h)   + 'px';
    img.style.bottom  = Math.round(bot) + 'px';
    img.style.opacity = opa;

  } else if (_mascotActive) {
    _mascotActive     = false;
    img.style.opacity = '0';
    img.style.height  = MASCOT_H_BIG + 'px';
    img.style.bottom  = '0px';
  }
}, { passive: true });

/* ── Loading bar ──────────────────────────────────────────── */
function _createLoader() {
  const style = document.createElement('style');
  style.textContent = `
    #_ax_loader{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;text-align:center;pointer-events:none;}
    #_ax_loader p{font-family:'Share Tech Mono',monospace;font-size:.72rem;color:#00F5FF;letter-spacing:.25em;margin-bottom:10px;opacity:.75;}
    #_ax_track{width:220px;height:2px;background:rgba(0,245,255,.12);border-radius:2px;}
    #_ax_fill{width:0%;height:100%;background:#00F5FF;border-radius:2px;box-shadow:0 0 8px #00F5FF;transition:width .08s linear;}
  `;
  document.head.appendChild(style);
  const el = document.createElement('div');
  el.id = '_ax_loader';
  el.innerHTML = `<p id="_ax_lbl">[ LOADING AXIOM — 0% ]</p><div id="_ax_track"><div id="_ax_fill"></div></div>`;
  document.body.appendChild(el);
  return { lbl: document.getElementById('_ax_lbl'), fill: document.getElementById('_ax_fill'), el };
}

/* ── Draw frame: scale to fill canvas height ─────────────── */
function _drawFrame(img) {
  if (!_axiomCtx || !img?.complete || !img.naturalWidth) return;
  const cw = _axiomCanvas.width, ch = _axiomCanvas.height;
  const scale = ch / img.naturalHeight;
  const dw = img.naturalWidth * scale;
  _axiomCtx.clearRect(0, 0, cw, ch);
  _axiomCtx.drawImage(img, (cw - dw) / 2, 0, dw, ch);
}

/* ── Scroll lock helpers ──────────────────────────────────── */
function _lockScroll() {
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow             = 'hidden';
}
function _unlockScroll() {
  document.documentElement.style.overflow = '';
  document.body.style.overflow             = '';
}

/* ── Frame loading helpers ────────────────────────────────── */
function _loadFrame(i) {
  if (_frames[i]) return Promise.resolve(_frames[i]);
  const img    = new Image();
  const padded = String(i + 1).padStart(3, '0');
  img.src      = `assets/frames/ezgif-frame-${padded}.webp`;
  _frames[i]   = img;
  return new Promise(res => {
    img.onload  = () => { _loadedFlags[i] = true; res(img); };
    img.onerror = () => res(img);
  });
}

/* Cari frame terdekat yang sudah loaded (untuk mengisi gap sparse) */
function _nearestLoadedFrame(f) {
  if (_loadedFlags[f]) return f;
  for (let d = 1; d < TOTAL_FRAMES; d++) {
    if (f - d >= 0            && _loadedFlags[f - d]) return f - d;
    if (f + d < TOTAL_FRAMES  && _loadedFlags[f + d]) return f + d;
  }
  return -1;
}

/* Gambar frame terbaik yang tersedia untuk posisi scroll saat ini */
function _drawBestFrame() {
  const nf = _nearestLoadedFrame(_targetFrame);
  if (nf !== -1 && nf !== _currentFrame) {
    _currentFrame = nf;
    _drawFrame(_frames[nf]);
  }
}

/* ── Preload: keyframes dulu, sisanya background ─────────── */
async function preloadFrames() {
  /* Reduced motion: tanpa scrub, tampilkan frame akhir + teks langsung */
  if (REDUCED_MOTION) {
    await _loadFrame(TOTAL_FRAMES - 1);
    _currentFrame = _targetFrame = TOTAL_FRAMES - 1;
    _drawFrame(_frames[_currentFrame]);
    gsap.set(_axiomCanvas, { opacity: 1 });
    _pinEndScroll = window.innerHeight;
    _revealHeroText();
    _getMascotImg();
    return;
  }

  _lockScroll();   // prevent scrolling until hero is fully set up
  const ui = _createLoader();

  const priority = [];
  for (let i = 0; i < TOTAL_FRAMES; i += PRIORITY_STEP) priority.push(i);
  if (priority[priority.length - 1] !== TOTAL_FRAMES - 1) priority.push(TOTAL_FRAMES - 1);

  let loaded = 0;
  await Promise.all(priority.map(i => _loadFrame(i).then(() => {
    loaded++;
    const pct = Math.round(loaded / priority.length * 100);
    ui.fill.style.width = pct + '%';
    ui.lbl.textContent  = `[ LOADING AXIOM — ${pct}% ]`;
  })));

  gsap.to(ui.el, { opacity: 0, duration: 0.4, onComplete: () => ui.el.remove() });
  /* Fallback: GSAP pakai rAF yang di-suspend saat tab hidden — pastikan loader tetap hilang */
  setTimeout(() => ui.el.remove(), 1500);
  _drawFrame(_frames[0]);
  gsap.set(_axiomCanvas, { opacity: 1 });
  _setupScrollScrub();
  _unlockScroll(); // unlock after ScrollTrigger is fully configured

  _loadRemainingFrames();
}

/* Background fill dengan concurrency terbatas agar tidak membanjiri network */
async function _loadRemainingFrames() {
  const remaining = [];
  for (let i = 0; i < TOTAL_FRAMES; i += BG_STEP) {
    if (!_loadedFlags[i]) remaining.push(i);
  }

  const CONCURRENCY = 6;
  let idx = 0;
  async function worker() {
    while (idx < remaining.length) {
      const i = remaining[idx++];
      await _loadFrame(i);
      _drawBestFrame(); // upgrade tampilan bila frame baru lebih dekat ke target
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, remaining.length) }, worker));
}

/* ── Hero text ────────────────────────────────────────────── */
function _revealHeroText() {
  _textRevealed = true;
  gsap.timeline()
    .fromTo('.hero-pre',     { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
    .fromTo('.hero-name',    { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.12)
    .fromTo('.hero-tagline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.28)
    .fromTo('.hero-cta',     { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.42);
}
function _hideHeroText() {
  _textRevealed = false;
  gsap.to(['.hero-pre', '.hero-name', '.hero-tagline', '.hero-cta'],
    { opacity: 0, y: 20, duration: 0.25, ease: 'power2.in' });
}

/* ── ScrollTrigger pin + frame scrub ─────────────────────── */
function _setupScrollScrub() {
  if (typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const pinST = ScrollTrigger.create({
    trigger:       '#hero',
    start:         'top top',
    end:           '+=4000',
    pin:           true,
    scrub:         1,
    anticipatePin: 1,
    onUpdate: (self) => {
      _targetFrame = Math.round(self.progress * (TOTAL_FRAMES - 1));
      _drawBestFrame();
      if (_targetFrame >= HERO_TEXT_FRAME && !_textRevealed) _revealHeroText();
      if (_targetFrame <  HERO_TEXT_FRAME &&  _textRevealed) _hideHeroText();
    }
  });

  _pinEndScroll = pinST.end > 0 ? pinST.end : 4000;
  _getMascotImg(); // pre-create element
}

/* ── Entry point ──────────────────────────────────────────── */
function initAxiom() {
  preloadFrames();
}
