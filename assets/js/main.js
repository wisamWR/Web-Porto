/* main.js — Bootstrap: GSAP plugins, all modules, IntersectionObserver navbar, smooth scroll, global reveal */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  /* ── Hamburger ───────────────────────────────────────────── */
  const hamburger   = document.getElementById('hamburger');
  const mobilePanel = document.getElementById('mobile-panel');

  hamburger.addEventListener('click', () => mobilePanel.classList.toggle('open'));
  mobilePanel.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobilePanel.classList.remove('open'))
  );

  /* ── Smooth scroll on nav link click ────────────────────── */
  document.querySelectorAll('.navbar-menu a, .navbar-mobile-panel a').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      mobilePanel.classList.remove('open');
    });
  });

  /* ── Navbar active via IntersectionObserver ──────────────── */
  const navLinks = document.querySelectorAll('.navbar-menu a');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a =>
          a.classList.toggle('active', a.getAttribute('href') === '#' + id)
        );
      }
    });
  }, {
    rootMargin: '-35% 0px -35% 0px',
    threshold: 0
  });

  document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));

  /* ── Global scroll reveal (.reveal class) ────────────────── */
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 32,
      duration: 0.65,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });

  /* ── Init all modules ────────────────────────────────────── */
  initAxiom();
  initParticles();
  initChatbot();
  if (typeof initAbout    === 'function') initAbout();
  if (typeof initProjects === 'function') initProjects();

  /* ── Footer year (if present) ────────────────────────────── */
  const yr = document.getElementById('footer-year');
  if (yr) yr.textContent = new Date().getFullYear();
});
