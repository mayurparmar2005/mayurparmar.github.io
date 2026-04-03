const cursor = document.getElementById("inverted-cursor");


 // ─── CURSOR ──────────────────────────────────────────────────
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animateCursor() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // ─── PARTICLES ───────────────────────────────────────────────
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  function getThemeColors() {
    const s = getComputedStyle(document.documentElement);
    return {
      c1: s.getPropertyValue('--c1').trim() || '#00f5ff',
      c2: s.getPropertyValue('--c2').trim() || '#bf00ff',
      c3: s.getPropertyValue('--c3').trim() || '#ff006e',
    };
  }

  const PARTICLE_COUNT = 90;
  const particles = [];

  function mkParticle() {
    const c = getThemeColors();
    const colors = [c.c1, c.c2, c.c3];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.6 + 0.2,
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(mkParticle());

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const c = getThemeColors();
    const colors = [c.c1, c.c2, c.c3];

    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = (1 - dist / 100) * 0.15;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  // ─── TYPED TEXT ───────────────────────────────────────────────
  const phrases = [
    'build full-stack apps.',
    'architect backend systems.',
    'craft data science solutions.',
    'deploy web platforms.',
    'write clean, scalable code.',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;
  const typedEl = document.getElementById('typed-text');

  function typeEffect() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(typeEffect, 1800);
        return;
      }
      setTimeout(typeEffect, 60);
    } else {
      typedEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(typeEffect, 300);
        return;
      }
      setTimeout(typeEffect, 30);
    }
  }
  setTimeout(typeEffect, 1200);

  // ─── 3D TILT ──────────────────────────────────────────────────
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const cx = r.width / 2, cy = r.height / 2;
      const rx = ((y - cy) / cy) * -8;
      const ry = ((x - cx) / cx) *  8;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });

  // ─── SCROLL FADE-IN ───────────────────────────────────────────
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // ─── NAV HIGHLIGHT ON SCROLL ──────────────────────────────────
  const sections  = document.querySelectorAll('section');
  const navLinks  = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('[data-drawer-link]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (pageYOffset >= s.offsetTop - 200) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href').includes(current));
    });
    drawerLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href').includes(current));
    });
  });

  // ─── THEME SWITCHER ───────────────────────────────────────────
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.documentElement.setAttribute('data-theme', btn.dataset.theme);
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ─── MOBILE DRAWER ────────────────────────────────────────────
  const ham     = document.getElementById('hamburger');
  const drawer  = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');

  function openDrawer()  { ham.classList.add('open');  drawer.classList.add('open');  overlay.classList.add('open'); }
  function closeDrawer() { ham.classList.remove('open'); drawer.classList.remove('open'); overlay.classList.remove('open'); }

  ham.addEventListener('click', () => ham.classList.contains('open') ? closeDrawer() : openDrawer());
  overlay.addEventListener('click', closeDrawer);
  document.querySelectorAll('[data-drawer-link]').forEach(l => l.addEventListener('click', closeDrawer));

  // ─── SPOTLIGHT BG on mouse ────────────────────────────────────
  document.addEventListener('mousemove', e => {
    document.body.style.backgroundImage = `radial-gradient(600px at ${e.clientX}px ${e.clientY}px, rgba(29,78,216,0.1), transparent 80%)`;
  });