/* axiom.js — AXIOM: preload → scroll-scrubbed frames → scroll-driven mascot */

const TOTAL_FRAMES    = 210;
const HERO_TEXT_FRAME = 180;

const _frames      = [];
const _axiomCanvas = document.getElementById('axiom-canvas');
const _axiomCtx    = _axiomCanvas ? _axiomCanvas.getContext('2d') : null;

let _currentFrame  = 0;
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
    img.src = 'maskot_chatbot.png';
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

/* ── Preload 210 frames (scroll locked during load) ─────── */
async function preloadFrames() {
  _lockScroll();   // prevent scrolling until hero is fully set up
  const ui = _createLoader();
  let loaded = 0;

  await Promise.all(Array.from({ length: TOTAL_FRAMES }, (_, i) => {
    const img    = new Image();
    const padded = String(i + 1).padStart(3, '0');
    img.src      = `assets/frames/ezgif-frame-${padded}.jpg`;
    _frames.push(img);
    return new Promise(res => {
      img.onload = img.onerror = () => {
        loaded++;
        const pct = Math.round(loaded / TOTAL_FRAMES * 100);
        ui.fill.style.width = pct + '%';
        ui.lbl.textContent  = `[ LOADING AXIOM — ${pct}% ]`;
        res();
      };
    });
  }));

  gsap.to(ui.el, { opacity: 0, duration: 0.4, onComplete: () => ui.el.remove() });
  _drawFrame(_frames[0]);
  gsap.set(_axiomCanvas, { opacity: 1 });
  _setupScrollScrub();
  _unlockScroll(); // unlock after ScrollTrigger is fully configured
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
      const f = Math.round(self.progress * (TOTAL_FRAMES - 1));
      if (f !== _currentFrame && _frames[f]) { _currentFrame = f; _drawFrame(_frames[f]); }
      if (f >= HERO_TEXT_FRAME && !_textRevealed) _revealHeroText();
      if (f <  HERO_TEXT_FRAME &&  _textRevealed) _hideHeroText();
    }
  });

  _pinEndScroll = pinST.end > 0 ? pinST.end : 4000;
  _getMascotImg(); // pre-create element
}

/* ── Entry point ──────────────────────────────────────────── */
function initAxiom() {
  preloadFrames();
}
