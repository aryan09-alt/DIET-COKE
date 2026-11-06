/* =====================================================
   ✏️  EDIT ONLY THESE 2 LINES TO CHANGE THE NAMES
   ===================================================== */
const CREATOR_1 = "Aryann";
const CREATOR_2 = "Safiya";
/* ===================================================== */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp  = (a, b, t) => a + (b - a) * t;
const rand  = (a, b) => a + Math.random() * (b - a);
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hex2rgb = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); };

$('#c1').textContent = CREATOR_1;
$('#c2').textContent = CREATOR_2;

/* =====================================================
   1. REALISTIC CAN (SVG, real 360° rotation)
   ===================================================== */
let CAN_UID = 0;
const BODY = "M54 42 C54 56 31 60 30 88 L30 326 C30 350 44 360 52 372 L148 372 C156 360 170 350 170 326 L170 88 C169 60 146 56 146 42 Z";

class Can {
  constructor(mount, { accent = '#e4002b', drops = 30, dropDelay = 2.2 } = {}) {
    const id = 'c' + (CAN_UID++);
    this.angle = 0;
    mount.innerHTML = this.build(id, accent, drops, dropDelay);
    this.faces = [0, 90, 180, 270].map(off => ({ off, el: mount.querySelector('#' + id + 'f' + off) }));
    this.set(0);
  }

  droplets(id, n, delay) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const big = Math.random() < 0.12 ? 1.7 : 1;
      const r = rand(1.1, 3.4) * big;
      const x = rand(36, 164), y = rand(92, 338);
      const d = (delay + Math.random() * 1.8).toFixed(2);
      s += `<g class="dr" style="animation-delay:${d}s">
        <circle cx="${x}" cy="${y + .9}" r="${r}" fill="rgba(0,0,0,.22)"/>
        <circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id}drop)" stroke="rgba(255,255,255,.6)" stroke-width=".4"/>
        <circle cx="${x - r * .35}" cy="${y - r * .4}" r="${r * .3}" fill="#fff" opacity=".95"/>
      </g>`;
    }
    return s;
  }

  build(id, accent, drops, delay) {
    const F = 'font-family="Arial Black, Segoe UI, Arial, sans-serif" font-weight="900" text-anchor="middle"';
    return `
<svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${id}body" x1="0" x2="1">
      <stop offset="0" stop-color="#6c707b"/><stop offset=".2" stop-color="#c8cbd3"/>
      <stop offset=".42" stop-color="#fafbfc"/><stop offset=".65" stop-color="#d4d7de"/>
      <stop offset=".88" stop-color="#8d919c"/><stop offset="1" stop-color="#5c606b"/>
    </linearGradient>
    <linearGradient id="${id}top" x1="0" x2="1">
      <stop offset="0" stop-color="#7b7f8a"/><stop offset=".45" stop-color="#f1f2f6"/><stop offset="1" stop-color="#6c707b"/>
    </linearGradient>
    <linearGradient id="${id}lid" x1="0" x2="1">
      <stop offset="0" stop-color="#9a9ea9"/><stop offset=".5" stop-color="#dfe1e7"/><stop offset="1" stop-color="#8d919c"/>
    </linearGradient>
    <linearGradient id="${id}bot" x1="0" x2="1">
      <stop offset="0" stop-color="#4b4f59"/><stop offset=".5" stop-color="#8e929d"/><stop offset="1" stop-color="#434751"/>
    </linearGradient>
    <linearGradient id="${id}sh" x1="0" x2="1">
      <stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset=".1" stop-color="#000" stop-opacity=".2"/>
      <stop offset=".24" stop-color="#000" stop-opacity="0"/><stop offset=".38" stop-color="#fff" stop-opacity=".4"/>
      <stop offset=".47" stop-color="#fff" stop-opacity=".04"/><stop offset=".72" stop-color="#000" stop-opacity="0"/>
      <stop offset=".9" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity=".65"/>
    </linearGradient>
    <linearGradient id="${id}shv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset=".08" stop-color="#000" stop-opacity=".05"/>
      <stop offset=".2" stop-color="#fff" stop-opacity=".16"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".9" stop-color="#000" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".55"/>
    </linearGradient>
    <linearGradient id="${id}sheen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".3"/>
    </linearGradient>
    <radialGradient id="${id}drop" cx=".35" cy=".3" r=".8">
      <stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".7" stop-color="#fff" stop-opacity=".22"/>
      <stop offset="1" stop-color="#fff" stop-opacity=".5"/>
    </radialGradient>
    <filter id="${id}blur"><feGaussianBlur stdDeviation="1.6"/></filter>
    <clipPath id="${id}clip"><path d="${BODY}"/></clipPath>
  </defs>

  <g clip-path="url(#${id}clip)">
    <rect x="26" y="36" width="148" height="342" fill="url(#${id}body)"/>

    <!-- red wave band (fixed around the can) -->
    <path d="M30 178 C60 150 86 200 116 178 S152 158 170 170 L170 262 C150 284 126 240 98 262 S52 282 30 268 Z" fill="${accent}"/>
    <path d="M30 178 C60 150 86 200 116 178 S152 158 170 170 L170 262 C150 284 126 240 98 262 S52 282 30 268 Z" fill="url(#${id}sheen)"/>
    <path d="M30 170 C60 142 86 192 116 170 S152 150 170 162" fill="none" stroke="#fff" stroke-width="2" opacity=".85"/>

    <!-- rotating faces -->
    <g id="${id}f0">
      <text ${F} x="0" y="122" font-size="34" fill="${accent}" stroke="#fff" stroke-width=".8" paint-order="stroke" letter-spacing="3">DIET</text>
      <text ${F} x="0" y="231.5" font-size="38" fill="#000" opacity=".28">COKE</text>
      <text ${F} x="0" y="230" font-size="38" fill="#fff">COKE</text>
      <text ${F} x="0" y="252" font-size="7" fill="#fff" letter-spacing="3" opacity=".92">ZERO SUGAR</text>
      <text ${F} x="0" y="334" font-size="8" fill="#4a4f5b" letter-spacing="3">FAN MADE</text>
    </g>
    <g id="${id}f180">
      <text ${F} x="0" y="116" font-size="30" fill="#2b2e36">ZERO</text>
      <text ${F} x="0" y="148" font-size="30" fill="${accent}" stroke="#fff" stroke-width=".7" paint-order="stroke">SUGAR</text>
      <text ${F} x="0" y="226" font-size="24" fill="#fff" letter-spacing="1">ICE COLD</text>
      <text ${F} x="0" y="334" font-size="8" fill="#4a4f5b" letter-spacing="3">STAY FIZZY</text>
    </g>
    <g id="${id}f90">
      <text ${F} x="0" y="116" font-size="11" fill="#2b2e36" letter-spacing="3">JUST FOR</text>
      <text ${F} x="0" y="132" font-size="11" fill="${accent}" letter-spacing="3">THE TASTE</text>
      <text ${F} x="0" y="226" font-size="16" fill="#fff" letter-spacing="2">0 SUGAR</text>
    </g>
    <g id="${id}f270">
      <text ${F} x="0" y="120" font-size="24" fill="#2b2e36" letter-spacing="2">FIZZ</text>
      <text ${F} x="0" y="226" font-size="16" fill="#fff" letter-spacing="2">NO LIMITS</text>
    </g>

    <!-- cylinder shading + highlights -->
    <rect x="30" y="36" width="140" height="342" fill="url(#${id}sh)"/>
    <rect x="26" y="36" width="148" height="342" fill="url(#${id}shv)"/>
    <rect x="62" y="96" width="6" height="226" rx="3" fill="#fff" opacity=".6" filter="url(#${id}blur)"/>
    <rect x="144" y="100" width="3" height="218" rx="1.5" fill="#fff" opacity=".28" filter="url(#${id}blur)"/>

    <!-- condensation -->
    ${this.droplets(id, drops, delay)}
  </g>

  <!-- top rim, lid, tab -->
  <ellipse cx="100" cy="40" rx="49" ry="9.5" fill="url(#${id}top)"/>
  <ellipse cx="100" cy="39.2" rx="42" ry="7.2" fill="#8a8e99"/>
  <ellipse cx="100" cy="38.6" rx="38" ry="5.8" fill="url(#${id}lid)"/>
  <ellipse cx="100" cy="40" rx="49" ry="9.5" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width=".8"/>
  <path d="M84 35 h32 q7 0 7 4.5 q0 4.5 -7 4.5 h-32 q-7 0 -7 -4.5 q0 -4.5 7 -4.5z" fill="url(#${id}top)" stroke="#6c707b" stroke-width=".6"/>
  <ellipse cx="91" cy="39.5" rx="6.5" ry="2.6" fill="#5b5f6a"/>
  <circle cx="113" cy="39" r="2" fill="#7b7f8a"/>

  <!-- bottom -->
  <path d="M52 372 Q100 384 148 372 L146 377 Q100 391 54 377 Z" fill="url(#${id}bot)"/>
</svg>`;
  }

  set(a) {
    this.angle = a;
    const R = 70;
    for (const f of this.faces) {
      const th = (a + f.off) * Math.PI / 180;
      const c = Math.cos(th), s = Math.sin(th);
      if (c <= 0.03) { f.el.setAttribute('opacity', 0); continue; }
      f.el.setAttribute('opacity', Math.min(1, c * 3).toFixed(2));
      f.el.setAttribute('transform', `translate(${(100 + R * s).toFixed(2)} 0) scale(${c.toFixed(3)} 1)`);
    }
  }
}

/* =====================================================
   2. PARTICLES (fizz, snow, rings, confetti, splash)
   ===================================================== */
class FX {
  constructor(canvas) {
    this.c = canvas; this.ctx = canvas.getContext('2d'); this.p = [];
    this.resize();
    addEventListener('resize', () => this.resize());
  }
  resize() {
    const d = Math.min(devicePixelRatio || 1, 2);
    const r = this.c.getBoundingClientRect();
    this.w = r.width; this.h = r.height;
    this.c.width = Math.max(1, r.width * d); this.c.height = Math.max(1, r.height * d);
    this.ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  add(o) {
    if (this.p.length > 900) return;
    const p = Object.assign({ k: 'dot', x: 0, y: 0, vx: 0, vy: 0, g: 0, r: 3, life: 100, col: '#fff', a: 1, rot: 0, vr: 0, wob: 0, ph: 0, grow: 0, drag: 0, lw: 2 }, o);
    p.max = p.life;
    this.p.push(p);
  }
  burst(x, y, n, o = {}) {
    const cols = ['#ffffff', '#ffffff', '#f3f1ee', '#d9d1ca', '#3b2013', '#e4002b'];
    for (let i = 0; i < n; i++) {
      const ang = (o.radial ? rand(0, Math.PI * 2) : -Math.PI / 2 + rand(-.55, .55));
      const sp = o.radial ? rand(3, 11) : rand(5, 15);
      this.add({
        k: Math.random() < .2 ? 'bubble' : 'dot',
        x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        g: o.radial ? .02 : .3, drag: o.radial ? .96 : 0,
        r: rand(1.5, 5.5), life: rand(55, 105),
        col: o.col || cols[(Math.random() * cols.length) | 0]
      });
    }
  }
  step(dt) {
    const out = [];
    for (const p of this.p) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.g * dt;
      if (p.drag) { const f = Math.pow(p.drag, dt); p.vx *= f; p.vy *= f; }
      if (p.wob) p.x += Math.sin((p.life + p.ph) * .08) * p.wob * dt;
      p.rot += p.vr * dt; p.r += p.grow * dt; p.life -= dt;
      if (p.life > 0 && p.y < this.h + 40 && p.y > -80 && p.x > -80 && p.x < this.w + 80) out.push(p);
    }
    this.p = out;
  }
  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    for (const p of this.p) {
      ctx.globalAlpha = clamp(p.life / p.max, 0, 1) * p.a;
      if (p.k === 'dot') {
        ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      } else if (p.k === 'bubble') {
        ctx.strokeStyle = p.col; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(p.x - p.r * .35, p.y - p.r * .35, Math.max(.6, p.r * .22), 0, 6.2832); ctx.fill();
      } else if (p.k === 'ring') {
        ctx.strokeStyle = p.col; ctx.lineWidth = p.lw; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.stroke();
      } else if (p.k === 'flake') {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.moveTo(0, -p.r); ctx.lineTo(p.r * .6, 0); ctx.lineTo(0, p.r); ctx.lineTo(-p.r * .6, 0); ctx.closePath(); ctx.fill();
        ctx.restore();
      } else if (p.k === 'conf') {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.col;
        ctx.fillRect(-p.r, -p.r * .5, p.r * 2, p.r); ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
  }
}

const fx = new FX($('#fx'));
const storyFx = new FX($('#storyFx'));

/* =====================================================
   3. LOADER  →  intro
   ===================================================== */
const ldFill = $('#ldFill'), ldPct = $('#ldPct');
const loadStart = performance.now();
(function loadTick(now) {
  const t = clamp((now - loadStart) / 1800, 0, 1);
  const pct = Math.round((1 - Math.pow(1 - t, 2.2)) * 100);
  ldFill.style.clipPath = `inset(${100 - pct}% 0 0 0)`;
  ldPct.textContent = pct + '%';
  if (t < 1) requestAnimationFrame(loadTick);
  else setTimeout(() => { $('#loader').classList.add('hide'); document.body.classList.add('ready'); }, 250);
})(loadStart);
addEventListener('load', () => { fx.resize(); storyFx.resize(); measureMarquee(); });

/* =====================================================
   4. HERO
   ===================================================== */
$$('.giant .line').forEach((line, li) => {
  line.innerHTML = [...line.dataset.text].map((ch, i) => `<span class="ch" style="--i:${i + li * 4}">${ch}</span>`).join('');
});

const hero = $('#top'), giant = $('#giant');
const heroCan = $('#heroCan'), heroTilt = $('#heroTilt'), heroMount = $('#heroMount');
const heroCanObj = new Can(heroMount, { accent: '#e4002b', drops: 48, dropDelay: 2.4 });

let hA = 0, hV = .35, intro = 720, dragging = false, dragX = 0, moved = 0;

function heroTop() {
  const r = heroCan.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height * .1 };
}
function popHero() {
  const t = heroTop();
  fx.burst(t.x, t.y, 80);
  heroMount.classList.remove('pop'); void heroMount.offsetWidth; heroMount.classList.add('pop');
  if (navigator.vibrate) navigator.vibrate(25);
}
heroCan.addEventListener('animationend', e => {
  if (e.animationName !== 'drop') return;
  const t = heroTop();
  fx.burst(t.x, t.y + 160, 60, { radial: true, col: '#ffffff' });
  hero.classList.add('shake'); setTimeout(() => hero.classList.remove('shake'), 520);
});
heroCan.addEventListener('pointerdown', e => {
  dragging = true; dragX = e.clientX; moved = 0;
  heroCan.setPointerCapture(e.pointerId); heroCan.classList.add('grabbing');
});
heroCan.addEventListener('pointermove', e => {
  if (!dragging) return;
  const dx = e.clientX - dragX; dragX = e.clientX; moved += Math.abs(dx);
  hA += dx * .9; hV = clamp(dx * .9, -25, 25);
});
heroCan.addEventListener('pointerup', () => {
  if (!dragging) return;
  dragging = false; heroCan.classList.remove('grabbing');
  if (moved < 6) popHero();
});
heroCan.addEventListener('pointercancel', () => { dragging = false; heroCan.classList.remove('grabbing'); });

/* =====================================================
   5. MARQUEE (speed + skew react to scroll)
   ===================================================== */
const words = ['ZERO SUGAR', 'JUST FOR THE TASTE', 'ICE COLD', 'POP · HISS · SIP', 'STAY FIZZY'];
const marquees = $$('.marquee').map((el, i) => {
  const track = $('.track', el);
  track.innerHTML = words.map(w => `<span>${w}</span><i>✦</i>`).join('').repeat(4);
  return { el, track, dir: i % 2 ? 1 : -1, x: 0, w: 1, rot: parseFloat(el.dataset.rot) };
});
function measureMarquee() { marquees.forEach(m => { m.w = m.track.scrollWidth / 4 || 1; }); }
measureMarquee();
addEventListener('resize', measureMarquee);

/* =====================================================
   6. STORY (5 cinematic chapters)
   ===================================================== */
const story = $('#story'), sticky = $('#sticky');
const storyCan = $('#storyCan');
const storyCanObj = new Can($('#storyMount'), { accent: '#e4002b', drops: 40, dropDelay: .2 });
const chapters = $$('.chapter');
const N = chapters.length;
const wm = $('#wm'), wave = $('#wave'), bar = $('#bar'), cnt = $('#cnt');

// split headline into animated words
chapters.forEach(ch => {
  const h = $('.split', ch); let d = 0;
  h.innerHTML = h.dataset.t.split('|').map(line =>
    `<span class="line">${line.split(' ').map(w => `<span class="w"><span style="--d:${d++}">${w}</span></span>`).join(' ')}</span>`
  ).join('');
});

// dots
const dotsBox = $('#dots');
const dots = chapters.map((_, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Chapter ' + (i + 1));
  b.onclick = () => scrollTo({ top: story.offsetTop + (i + .5) / N * (story.offsetHeight - innerHeight), behavior: 'smooth' });
  dotsBox.appendChild(b);
  return b;
});

const bgs   = chapters.map(c => hex2rgb(c.dataset.bg));
const glows = chapters.map(c => hex2rgb(c.dataset.glow));

let curIdx = -1, mode = 'fizz', sx = 0, sy = 0, ss = 1, sA = 0, sT = 0, ringT = 0;

function canCenterInSticky() {
  const a = storyCan.getBoundingClientRect(), b = sticky.getBoundingClientRect();
  return { x: a.left + a.width / 2 - b.left, y: a.top + a.height / 2 - b.top };
}
function setChapter(i) {
  curIdx = i;
  chapters.forEach((c, k) => { c.classList.toggle('on', k === i); c.classList.toggle('past', k < i); });
  dots.forEach((d, k) => d.classList.toggle('act', k === i));
  cnt.textContent = String(i + 1).padStart(2, '0');
  wm.textContent = String(i + 1).padStart(2, '0');
  wm.classList.remove('pop'); void wm.offsetWidth; wm.classList.add('pop');
  mode = chapters[i].dataset.mode;
  const c = canCenterInSticky();
  wave.style.left = c.x + 'px'; wave.style.top = c.y + 'px';
  wave.classList.remove('go'); void wave.offsetWidth; wave.classList.add('go');
  storyFx.burst(c.x, c.y, 70, { radial: true, col: i === 4 ? '#ffffff' : (i === 1 ? '#bfe6ff' : '#ffffff') });
}

function ambient(dt, c) {
  const W = storyFx.w, H = storyFx.h;
  if (mode === 'fizz') {
    if (Math.random() < .9 * dt) storyFx.add({ k: 'bubble', x: rand(0, W), y: H + 10, vy: -rand(1.5, 4.2), r: rand(2, 8), life: rand(140, 240), col: Math.random() < .3 ? 'rgba(228,0,43,.8)' : 'rgba(255,255,255,.8)', wob: .5, ph: rand(0, 99) });
  } else if (mode === 'snow') {
    if (Math.random() < 1.1 * dt) storyFx.add({ k: 'flake', x: rand(0, W), y: -10, vx: rand(-.4, .4), vy: rand(1, 3), r: rand(2, 6), life: rand(200, 320), col: 'rgba(200,235,255,.9)', vr: rand(-.05, .05), wob: .4, ph: rand(0, 99) });
  } else if (mode === 'rings') {
    ringT += dt;
    if (ringT > 38) { ringT = 0; storyFx.add({ k: 'ring', x: c.x, y: c.y, r: 40, grow: 5.5, life: 90, col: 'rgba(255,60,90,.9)', lw: 2.5 }); }
    if (Math.random() < .5 * dt) storyFx.add({ x: c.x + rand(-160, 160), y: c.y + rand(-160, 160), r: rand(1, 3), vy: -rand(.3, 1), life: rand(60, 120), col: '#ff8da0' });
  } else if (mode === 'bubbles') {
    if (Math.random() < .35 * dt) storyFx.add({ k: 'bubble', x: rand(0, W), y: H + 30, vy: -rand(.8, 2), r: rand(8, 24), life: rand(260, 420), col: 'rgba(220,225,235,.55)', wob: .7, ph: rand(0, 99) });
  } else if (mode === 'confetti') {
    if (Math.random() < 1.4 * dt) storyFx.add({ k: 'conf', x: rand(0, W), y: -12, vx: rand(-.8, .8), vy: rand(1.5, 4), r: rand(3, 7), life: rand(200, 320), col: ['#ffffff', '#101114', '#ffd6dc', '#c9ced9'][(Math.random() * 4) | 0], vr: rand(-.2, .2), wob: .8, ph: rand(0, 99), rot: rand(0, 6) });
  }
}

/* =====================================================
   7. FLAVOR CARDS
   ===================================================== */
const flavors = $$('.fcard').map(card => {
  const can = new Can($('.can-mount', card), { accent: card.dataset.accent, drops: 16, dropDelay: .3 });
  const st = { card, can, a: rand(0, 360), hover: false, tx: .5 };
  card.addEventListener('pointerenter', () => st.hover = true);
  card.addEventListener('pointerleave', () => { st.hover = false; card.style.transform = ''; });
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    st.tx = x;
    card.style.setProperty('--mx', (x * 100) + '%');
    card.style.setProperty('--my', (y * 100) + '%');
    card.style.transform = `perspective(800px) rotateY(${(x - .5) * 14}deg) rotateX(${-(y - .5) * 14}deg) translateY(-8px)`;
  });
  return st;
});

/* =====================================================
   8. CURSOR, POP BUTTON, REVEALS, COUNTERS
   ===================================================== */
const cursorEl = $('#cursor'), curLabel = $('#curLabel');
const M = { x: innerWidth / 2, y: innerHeight / 2, cx: innerWidth / 2, cy: innerHeight / 2, nx: 0, ny: 0, sx: 0, sy: 0 };
addEventListener('pointermove', e => {
  M.x = e.clientX; M.y = e.clientY;
  M.nx = e.clientX / innerWidth - .5; M.ny = e.clientY / innerHeight - .5;
});
$$('[data-cursor]').forEach(el => {
  el.addEventListener('pointerenter', () => { curLabel.textContent = el.dataset.cursor; cursorEl.classList.add('big'); });
  el.addEventListener('pointerleave', () => cursorEl.classList.remove('big'));
});
$$('a, .dots button').forEach(el => {
  el.addEventListener('pointerenter', () => { curLabel.textContent = ''; cursorEl.classList.add('big'); });
  el.addEventListener('pointerleave', () => cursorEl.classList.remove('big'));
});

$('#popBtn').addEventListener('click', e => {
  const r = e.currentTarget.getBoundingClientRect();
  fx.burst(r.left + r.width / 2, r.top, 110);
  if (navigator.vibrate) navigator.vibrate(30);
});

const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('show');
  const b = $('b[data-to]', e.target);
  if (b && !b.dataset.done) {
    b.dataset.done = 1;
    const to = +b.dataset.to, suf = b.dataset.suf || '', t0 = performance.now();
    (function tick(t) {
      const k = clamp((t - t0) / 1500, 0, 1);
      b.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + suf;
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }
}), { threshold: .25 });
$$('.rv').forEach(el => io.observe(el));

/* =====================================================
   9. MAIN LOOP
   ===================================================== */
let last = performance.now(), lastY = scrollY, vel = 0, heroFizzT = 0;
const topProg = $('#topProg');

function frame(now) {
  const dt = Math.min(3, (now - last) / 16.667); last = now;

  // scroll velocity + progress bar
  vel = lerp(vel, scrollY - lastY, .15); lastY = scrollY;
  const docMax = document.documentElement.scrollHeight - innerHeight;
  topProg.style.transform = `scaleX(${docMax > 0 ? scrollY / docMax : 0})`;

  // smooth mouse
  M.sx = lerp(M.sx, M.nx, .08); M.sy = lerp(M.sy, M.ny, .08);
  M.cx = lerp(M.cx, M.x, .2);   M.cy = lerp(M.cy, M.y, .2);
  cursorEl.style.transform = `translate(${M.cx}px,${M.cy}px) translate(-50%,-50%)`;

  /* ---- hero ---- */
  if (!dragging) { hA += hV * dt; hV = lerp(hV, .35, .03 * dt); }
  if (document.body.classList.contains('ready')) intro *= Math.pow(.955, dt);
  heroCanObj.set(hA + (intro < .5 ? 0 : intro));
  const fine = !matchMedia('(hover:none)').matches;
  heroTilt.style.transform = fine
    ? `translate(${M.sx * 40}px,${M.sy * 26}px) rotate(${M.sx * 8}deg)`
    : 'none';
  giant.style.transform = `translate(calc(-50% + ${M.sx * -50}px), calc(-50% + ${scrollY * .3 + M.sy * -26}px)) scale(${1 + scrollY * .0004})`;

  if (scrollY < innerHeight && document.body.classList.contains('ready') && intro < 40) {
    heroFizzT += dt;
    if (heroFizzT > 5) {
      heroFizzT = 0;
      const t = heroTop();
      fx.add({ k: 'bubble', x: t.x + rand(-26, 26), y: t.y, vx: rand(-.4, .4), vy: -rand(1, 2.6), r: rand(2, 5), life: rand(70, 130), col: 'rgba(228,0,43,.7)', wob: .4, ph: rand(0, 99) });
    }
  }

  /* ---- marquee ---- */
  marquees.forEach(m => {
    m.x += m.dir * (1.1 * dt + Math.abs(vel) * .45);
    m.x = m.x % m.w; if (m.x > 0) m.x -= m.w;
    m.track.style.transform = `translateX(${m.x}px)`;
    m.el.style.transform = `rotate(${m.rot}deg) skewX(${clamp(-vel * .25, -12, 12)}deg)`;
  });

  /* ---- story ---- */
  const r = story.getBoundingClientRect();
  if (r.top < innerHeight && r.bottom > 0) {
    const p = clamp(-r.top / (r.height - innerHeight), 0, 1);
    const pf = p * N;
    const idx = clamp(Math.floor(pf), 0, N - 1);
    if (idx !== curIdx) setChapter(idx);

    // colours: hold during chapter, blend near the end
    const nxt = Math.min(idx + 1, N - 1);
    const f = idx < N - 1 ? smooth(.62, 1, pf - idx) : 0;
    const mix = (A, B) => A.map((v, i) => Math.round(lerp(v, B[i], f))).join(',');
    sticky.style.setProperty('--bg', mix(bgs[idx], bgs[nxt]));
    sticky.style.setProperty('--glow', mix(glows[idx], glows[nxt]));

    // can path
    const mobile = innerWidth < 720;
    const cls = chapters[idx].classList;
    let tx = cls.contains('L') ? 24 : cls.contains('R') ? -24 : 0;
    let ty = 0, tsc = 1;
    if (mobile) { tx = 0; ty = cls.contains('C') ? -6 : -17; tsc = .78; }
    if (cls.contains('C')) tsc = mobile ? .85 : 1.3;
    sT += dt * .03;
    sx = lerp(sx, tx, .08 * dt); sy = lerp(sy, ty, .08 * dt); ss = lerp(ss, tsc, .08 * dt);
    sA = lerp(sA, pf * 180, .09 * dt);
    const tilt = Math.sin(sT * 4) * 3 + (idx % 2 ? -7 : 7) * (1 - Math.abs(Math.sin(pf * Math.PI)) * .3);
    storyCan.style.transform = `translate(${sx}vw,${sy + Math.sin(sT * 5) * 1.2}vh) rotate(${tilt}deg) scale(${ss})`;
    storyCanObj.set(sA);
    sticky.style.setProperty('--gx', (50 + sx) + '%');

    bar.style.width = (p * 100) + '%';
    ambient(dt, canCenterInSticky());
    storyFx.step(dt); storyFx.draw();
  }

  /* ---- flavors ---- */
  flavors.forEach(s => {
    if (s.hover) s.a = lerp(s.a, (s.tx - .5) * 420, .12 * dt);
    else s.a += .4 * dt;
    s.can.set(s.a);
  });

  /* ---- global particles ---- */
  fx.step(dt); fx.draw();

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);