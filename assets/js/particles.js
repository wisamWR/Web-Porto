/* particles.js — Ambient scatter particles only. No formation. Drift + mouse repulsion. */

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const COUNT = window.innerWidth < 768 ? 1200 : 2500;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const positions  = new Float32Array(COUNT * 3);
  const colors     = new Float32Array(COUNT * 3);
  const velocities = new Float32Array(COUNT * 2); // x, y only

  const cyan   = new THREE.Color('#00F5FF');
  const purple = new THREE.Color('#7B2FFF');

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 14;
    positions[i3 + 1] = (Math.random() - 0.5) * 9;
    positions[i3 + 2] = (Math.random() - 0.5) * 1.5;

    velocities[i * 2]     = (Math.random() - 0.5) * 0.0025;
    velocities[i * 2 + 1] = (Math.random() - 0.5) * 0.0025;

    const c = Math.random() < 0.6 ? cyan : purple;
    colors[i3]     = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.014, vertexColors: true,
    transparent: true, opacity: 0, sizeAttenuation: true
  });

  scene.add(new THREE.Points(geometry, material));
  const posAttr = geometry.attributes.position;

  gsap.to(material, { opacity: 0.65, duration: 2, ease: 'power2.out' });

  const mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', (e) => {
    const h = 2 * camera.position.z * Math.tan(camera.fov * Math.PI / 360);
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * h * camera.aspect;
    mouse.y = (0.5 - e.clientY / window.innerHeight) * h;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let last = 0;
  function animate(ts) {
    requestAnimationFrame(animate);
    const dt = Math.min((ts - last) / 1000, 0.05);
    last = ts;
    if (dt <= 0) { renderer.render(scene, camera); return; }

    const h  = 2 * camera.position.z * Math.tan(camera.fov * Math.PI / 360);
    const rr = (100 / window.innerWidth) * h * camera.aspect; // repulsion radius in world units
    const r2 = rr * rr;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const iv = i * 2;

      // Drift
      posAttr.array[i3]     += velocities[iv]     * dt * 60;
      posAttr.array[i3 + 1] += velocities[iv + 1] * dt * 60;

      // Wrap
      if (posAttr.array[i3]     >  7.5) posAttr.array[i3]     = -7.5;
      if (posAttr.array[i3]     < -7.5) posAttr.array[i3]     =  7.5;
      if (posAttr.array[i3 + 1] >  5.0) posAttr.array[i3 + 1] = -5.0;
      if (posAttr.array[i3 + 1] < -5.0) posAttr.array[i3 + 1] =  5.0;

      // Mouse repulsion
      const dx = posAttr.array[i3]     - mouse.x;
      const dy = posAttr.array[i3 + 1] - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > 0.0001 && d2 < r2) {
        const d    = Math.sqrt(d2);
        const push = ((rr - d) / rr) * 0.06 * dt * 60;
        posAttr.array[i3]     += (dx / d) * push;
        posAttr.array[i3 + 1] += (dy / d) * push;
      }
    }

    posAttr.needsUpdate = true;
    renderer.render(scene, camera);
  }

  animate(0);
}
