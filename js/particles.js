/* particles.js - lightweight, devicePixelRatio aware */
(() => {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let DPR = Math.max(1, window.devicePixelRatio || 1);
  let W = innerWidth, H = innerHeight;
  const particles = [];

  function resize() {
    DPR = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(innerWidth * DPR);
    canvas.height = Math.round(innerHeight * DPR);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function spawn(x = innerWidth / 2, y = innerHeight / 2, color) {
    const count = 8 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y,
        vx: (Math.random() * 2 - 1) * (40 + Math.random() * 80),
        vy: (Math.random() * -1) * (40 + Math.random() * 80),
        life: 600 + Math.random() * 600,
        born: performance.now(),
        size: 4 + Math.random() * 10,
        color: color || `hsl(${230 + Math.random() * 120}, 80%, 60%)`
      });
    }
  }

  window.addEventListener('particle', (ev) => {
    const d = ev.detail || {};
    spawn(d.x || innerWidth / 2, d.y || innerHeight / 2, d.color);
  });

  function frame() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const now = performance.now();
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const age = now - p.born;
      if (age > p.life) { particles.splice(i, 1); continue; }
      p.vy += 240 * (1 / 60) * 0.016;
      p.x += p.vx * (1 / 1000);
      p.y += p.vy * (1 / 1000);
      const alpha = 1 - (age / p.life);
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (alpha * 0.9 + 0.1), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
