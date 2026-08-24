/* ─── LOADER ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    startHeroAnim();
  }, 1800);
});

/* ─── CURSOR ─── */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
  if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
  requestAnimationFrame(animCursor);
})();

/* ─── NAV ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ─── HERO CANVAS ─── */
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let W, H, pts = [], mouse = { x: -999, y: -999 };

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initPts(); });
document.addEventListener('mousemove', e => {
  const r = canvas.getBoundingClientRect();
  mouse.x = e.clientX - r.left;
  mouse.y = e.clientY - r.top;
});

function initPts() {
  const n = Math.floor(W * H / 8000);
  pts = Array.from({ length: n }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    r: Math.random() * 1.8 + 0.4
  }));
}
initPts();

function drawCanvas() {
  ctx.clearRect(0, 0, W, H);
  const MAX = 130;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    const dx = p.x - mouse.x, dy = p.y - mouse.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 90) { p.x += (dx / d) * 2; p.y += (dy / d) * 2; }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(125,211,252,0.6)';
    ctx.fill();
    for (let j = i + 1; j < pts.length; j++) {
      const q = pts[j];
      const dx2 = p.x - q.x, dy2 = p.y - q.y;
      const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      if (d2 < MAX) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(37,99,235,${(1 - d2 / MAX) * 0.25})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawCanvas);
}
drawCanvas();

/* ─── SERVICE CARD SPOTLIGHT ─── */
document.querySelectorAll('.svc-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
    const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

/* ─── HERO ANIMATION ─── */
function startHeroAnim() {
  const badge = document.getElementById('heroBadge');
  const lines = document.querySelectorAll('#heroTitle .line span');
  const sub = document.getElementById('heroSub');
  const actions = document.getElementById('heroActions');

  badge.style.transition = 'opacity 0.7s, transform 0.7s';
  badge.style.opacity = '1'; badge.style.transform = 'translateY(0)';

  lines.forEach((l, i) => {
    setTimeout(() => {
      l.style.transition = 'transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.8s';
      l.style.transform = 'translateY(0)';
      l.style.opacity = '1';
    }, 300 + i * 150);
  });

  setTimeout(() => {
    sub.style.transition = 'opacity 0.7s, transform 0.7s';
    sub.style.opacity = '1'; sub.style.transform = 'translateY(0)';
  }, 900);

  setTimeout(() => {
    actions.style.transition = 'opacity 0.7s, transform 0.7s';
    actions.style.opacity = '1'; actions.style.transform = 'translateY(0)';
  }, 1100);
}

/* ─── SCROLL REVEAL ─── */
const revealAll = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealAll.forEach(el => revObs.observe(el));

/* ─── SKILL BARS ─── */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(f => { f.style.width = f.dataset.width + '%'; });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-bars').forEach(el => skillObs.observe(el));

/* ─── COST COMPARE BARS ─── */
const ccObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.cc-fill').forEach(f => { f.style.width = f.dataset.width + '%'; });
      ccObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.cost-compare').forEach(el => ccObs.observe(el));

/* ─── COUNTER ANIMATION ─── */
function animateCounter(el, target, duration = 1600) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ─── SAVINGS COUNTER ─── */
const savingsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = document.getElementById('savingsNum');
      let start = null;
      (function count(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1600, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * 40) + '%';
        if (p < 1) requestAnimationFrame(count);
      })(performance.now());
      savingsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
const savEl = document.getElementById('savingsNum');
if (savEl) savingsObs.observe(savEl.closest('.why-visual-card'));

/* ─── STAT COUNTERS ─── */
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.n-val').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
      statObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
const statsRow = document.getElementById('statsRow');
if (statsRow) statObs.observe(statsRow);

/* ─── PROJECT FILTER ─── */
function filterP(cat, btn) {
  document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.proj-card').forEach(card => {
    const show = cat === 'all' || card.dataset.cat === cat;
    card.style.transition = 'opacity 0.4s, transform 0.4s';
    if (show) {
      card.style.display = 'block';
      setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 10);
    } else {
      card.style.opacity = '0'; card.style.transform = 'scale(0.94)';
      setTimeout(() => { card.style.display = 'none'; }, 400);
    }
  });
}

/* ─── PARALLAX ORBS ─── */
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  document.querySelectorAll('.hero-orb').forEach((orb, i) => {
    const speed = [0.08, 0.12, 0.05][i] || 0.08;
    orb.style.transform = `translateY(${sy * speed}px)`;
  });
});

/* ─── MAGNETIC BUTTONS ─── */
document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta, .form-submit').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.25;
    const y = (e.clientY - r.top - r.height / 2) * 0.25;
    btn.style.transform = `translate(${x}px, ${y}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ─── TESTIMONIAL SLIDER ─── */
(function initTestimonialSlider() {
  const items = document.querySelectorAll('.testimonial-item');
  if (!items.length) return;
  let currentIndex = 0;
  items[currentIndex].classList.add('active');
  setInterval(() => {
    items[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % items.length;
    items[currentIndex].classList.add('active');
  }, 5000);
})();