/* cursor.js — Custom neon cursor: inner dot tracks mouse directly, outer ring uses lerp lag */

/* Touch device: tidak ada mousemove, dot akan nyangkut di tengah layar.
   Skip seluruh logika, sisakan addCursorHover sebagai no-op untuk modul lain. */
const _hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (!_hasFinePointer) {
  window.addCursorHover = function () {};
} else {

  const cursorOuter = document.getElementById('cursor-outer');
  const cursorInner = document.getElementById('cursor-inner');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outerX = mouseX;
  let outerY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorInner.style.left = mouseX + 'px';
    cursorInner.style.top  = mouseY + 'px';
  });

  (function animateOuter() {
    outerX += (mouseX - outerX) * 0.12;
    outerY += (mouseY - outerY) * 0.12;
    cursorOuter.style.left = outerX + 'px';
    cursorOuter.style.top  = outerY + 'px';
    requestAnimationFrame(animateOuter);
  })();

  function addCursorHover(elements) {
    elements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOuter.classList.add('hovering');
        cursorInner.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorOuter.classList.remove('hovering');
        cursorInner.classList.remove('hovering');
      });
    });
  }

  addCursorHover(document.querySelectorAll('a, button, .project-card, .filter-tab, .contact-card'));

  document.addEventListener('mouseleave', () => {
    cursorOuter.style.opacity = '0';
    cursorInner.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursorOuter.style.opacity = '1';
    cursorInner.style.opacity = '1';
  });

  window.addCursorHover = addCursorHover;
}
