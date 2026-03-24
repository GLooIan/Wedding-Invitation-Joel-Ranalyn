// =====================================================
//  RANALYN & JOEL — Cinematic Snap Scroll Presentation
// =====================================================

// ── 1. SNAP SCROLL SETUP ─────────────────────────────
const snapStyles = document.createElement('style');
snapStyles.textContent = `

  /* ── Page & HTML base ── */
  html, body {
    margin: 0; padding: 0;
    height: 100%;
    overflow: hidden;
  }

  /* ── Scroll container ── */
  #snap-container {
    height: 100vh;
    height: 100dvh;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }

  /* ── Every section becomes a full slide ── */
  #snap-container > section,
  #snap-container > footer {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    min-height: 100vh;
    min-height: 100dvh;
    max-height: 100vh;
    max-height: 100dvh;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }

  /* ── Save-date: no max-height clip — must show calendar + banner ── */
  #snap-container > .save-date {
    justify-content: flex-start;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: none;
    -webkit-overflow-scrolling: touch;
  }

  /* ── Photo banner inside save-date always fully visible ── */
  .save-date .photo-banner {
    overflow: visible;
    flex-shrink: 0;
    min-height: 120px;
  }

  /* ── Content-heavy sections scroll internally on small screens ── */
  #snap-container > .dress-code,
  #snap-container > .rsvp-section,
  #snap-container > .gift-unplugged-section,
  #snap-container > .venue,
  #snap-container > .timeline,
  #snap-container > .invitation {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* ── Cinematic fade-in for each slide ── */
  .slide-fade {
    opacity: 0;
    transition: opacity 1.1s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .slide-fade.visible {
    opacity: 1;
  }

  /* ── Inner content stagger ── */
  .slide-fade .stagger > * {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1),
                transform 0.7s cubic-bezier(0.22,1,0.36,1);
  }
  .slide-fade.visible .stagger > *:nth-child(1) { opacity:1; transform:none; transition-delay: 0.15s; }
  .slide-fade.visible .stagger > *:nth-child(2) { opacity:1; transform:none; transition-delay: 0.3s;  }
  .slide-fade.visible .stagger > *:nth-child(3) { opacity:1; transform:none; transition-delay: 0.45s; }
  .slide-fade.visible .stagger > *:nth-child(4) { opacity:1; transform:none; transition-delay: 0.6s;  }
  .slide-fade.visible .stagger > *:nth-child(5) { opacity:1; transform:none; transition-delay: 0.75s; }
  .slide-fade.visible .stagger > *:nth-child(6) { opacity:1; transform:none; transition-delay: 0.9s;  }

  /* ── Slide progress dots ── */
  #slide-dots {
    position: fixed;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 5000;
    pointer-events: none;
  }
  .slide-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,0.4);
    border: 1px solid rgba(255,255,255,0.5);
    transition: background 0.35s ease, transform 0.35s ease,
                border-color 0.35s ease;
    pointer-events: all;
    cursor: pointer;
  }
  .slide-dot.active {
    background: var(--gold, #C4A96A);
    border-color: var(--gold, #C4A96A);
    transform: scale(1.4);
  }
  /* dot colour adapts on light sections */
  #slide-dots.dark-dots .slide-dot {
    background: rgba(139,74,43,0.3);
    border-color: rgba(139,74,43,0.4);
  }
  #slide-dots.dark-dots .slide-dot.active {
    background: var(--terracotta, #8B4A2B);
    border-color: var(--terracotta, #8B4A2B);
  }

  /* ── Slide counter badge ── */
  #slide-counter {
    position: fixed;
    bottom: 22px;
    right: 22px;
    font-family: var(--font-sans, sans-serif);
    font-size: 0.58rem;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.55);
    z-index: 5000;
    transition: color 0.4s ease;
    pointer-events: none;
  }
  #slide-counter.dark { color: rgba(139,74,43,0.5); }

  /* ── Keyboard / swipe hint ── */
  #scroll-hint {
    position: fixed;
    bottom: 22px;
    left: 50%;
    transform: translateX(-50%);
    font-family: var(--font-sans, sans-serif);
    font-size: 0.55rem;
    letter-spacing: 3px;
    color: rgba(255,255,255,0.45);
    z-index: 5000;
    pointer-events: none;
    animation: hintPulse 2.5s ease-in-out infinite;
    transition: opacity 0.5s ease;
  }
  #scroll-hint.hide { opacity: 0; pointer-events: none; }
  @keyframes hintPulse {
    0%,100% { opacity: 0.45; transform: translateX(-50%) translateY(0); }
    50%      { opacity: 0.85; transform: translateX(-50%) translateY(-3px); }
  }

  /* ── Hero entrance ── */
  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-eyebrow { animation: heroFadeUp 1.1s cubic-bezier(0.22,1,0.36,1) 0.6s  both; }
  .name-left    { animation: heroFadeUp 1.1s cubic-bezier(0.22,1,0.36,1) 0.8s  both; }
  .name-and     { animation: heroFadeUp 1.1s cubic-bezier(0.22,1,0.36,1) 0.95s both; }
  .name-right   { animation: heroFadeUp 1.1s cubic-bezier(0.22,1,0.36,1) 1.1s  both; }
  .tagline      { animation: heroFadeUp 1.1s cubic-bezier(0.22,1,0.36,1) 1.25s both; }
  .hero-date    { animation: heroFadeUp 1.1s cubic-bezier(0.22,1,0.36,1) 1.4s  both; }
  .hero-scroll  { animation: heroFadeUp 1.1s cubic-bezier(0.22,1,0.36,1) 1.55s both; }

  /* ── Hero scroll breath ── */
  @keyframes scrollBreath {
    0%,100% { opacity:0.4; transform:scaleY(1); }
    50%      { opacity:1;   transform:scaleY(1.2); }
  }
  .hero-scroll-line { animation: scrollBreath 2.2s ease-in-out infinite !important; }

  /* ── Countdown flip ── */
  .count { display: inline-block; }
  .count.flip { animation: countFlip 0.36s cubic-bezier(0.22,1,0.36,1); }
  @keyframes countFlip {
    0%   { opacity:0; transform:translateY(-8px) scaleY(0.65); }
    65%  { opacity:1; transform:translateY(2px)  scaleY(1.04); }
    100% { opacity:1; transform:translateY(0)    scaleY(1); }
  }

  /* ── Calendar date pulse ── */
  @keyframes datePulse {
    0%,100% { box-shadow: 0 2px 8px rgba(139,74,43,0.28); }
    50%      { box-shadow: 0 4px 20px rgba(139,74,43,0.55); }
  }
  .days .highlight { animation: datePulse 2.6s ease-in-out infinite; }

  /* ── Ornament line draw ── */
  .section-rule span:first-child,
  .section-rule span:last-child {
    flex: 0 !important;
    transition: flex 1.2s cubic-bezier(0.22,1,0.36,1) 0.5s !important;
  }
  .slide-fade.visible .section-rule span:first-child,
  .slide-fade.visible .section-rule span:last-child {
    flex: 1 !important;
  }

  /* ── Hover interactions ── */
  .polaroid-frame {
    transition: transform 0.45s cubic-bezier(0.34,1.4,0.64,1),
                box-shadow 0.4s ease !important;
  }
  .polaroid-frame:hover {
    transform: rotate(0deg) scale(1.04) translateY(-6px) !important;
    box-shadow: 0 20px 50px rgba(139,74,43,0.2) !important;
  }
  .icon {
    transition: transform 0.4s cubic-bezier(0.34,1.4,0.64,1),
                background 0.3s ease, border-color 0.3s ease;
  }
  .timeline-item:hover .icon {
    transform: scale(1.18);
    background: rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.8);
  }
  .color {
    transition: transform 0.3s cubic-bezier(0.34,1.4,0.64,1),
                box-shadow 0.3s ease !important;
  }
  .color:hover {
    transform: scale(1.22) translateY(-3px) !important;
    box-shadow: 0 8px 20px rgba(139,74,43,0.3) !important;
  }
  .combined-venue-card {
    transition: transform 0.4s ease, box-shadow 0.4s ease !important;
  }
  .combined-venue-card:hover {
    transform: translateY(-5px) !important;
    box-shadow: 0 14px 44px rgba(139,74,43,0.15) !important;
  }
  .attire-column img {
    transition: transform 0.45s cubic-bezier(0.34,1.4,0.64,1),
                filter 0.4s ease !important;
  }
  .attire-column:hover img {
    transform: translateY(-8px) scale(1.03);
    filter: drop-shadow(0 12px 22px rgba(139,74,43,0.18));
  }
  .gift-unplugged-block { transition: transform 0.4s ease; }
  .gift-unplugged-block:hover { transform: translateY(-4px); }
  .form-submit-btn { position:relative; overflow:hidden; }
  .form-submit-btn::after {
    content:''; position:absolute; inset:0;
    background:rgba(255,255,255,0.16);
    transform:scaleX(0); transform-origin:left;
    transition:transform 0.4s ease;
  }
  .form-submit-btn:hover::after { transform:scaleX(1); }
  .form-input {
    transition: border-color 0.3s ease, box-shadow 0.3s ease,
                background 0.3s ease !important;
  }
  .dot {
    transition: transform 0.25s ease, background 0.25s ease,
                border-color 0.25s ease !important;
  }
  .dot:hover { transform: scale(1.4); }

  /* ── Footer shimmer ── */
  @keyframes shimmer {
    0%   { background-position:-200% center; }
    100% { background-position: 200% center; }
  }
  .footer-names {
    background: linear-gradient(90deg, #fff 0%, #E8D98A 40%, #fff 60%, #E8D98A 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3.8s linear infinite;
  }

  /* ── Navbar ── */
  .navbar {
    transition: background 0.4s ease, box-shadow 0.4s ease,
                backdrop-filter 0.4s ease !important;
  }
  .music-btn {
    transition: background 0.3s ease, color 0.3s ease,
                border-color 0.3s ease !important;
  }

  /* ── Photo banner ── */
  .photo-banner { overflow: hidden; }
  .banner-img   { will-change: transform; }

`;
document.head.appendChild(snapStyles);


// ── 2. PRELOADER ──────────────────────────────────────
const preloaderStyle = document.createElement('style');
preloaderStyle.textContent = `
  #rj-preloader {
    position: fixed; inset: 0;
    background: var(--cream, #FDFAF5);
    z-index: 99999;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 16px;
    transition: opacity 0.9s ease, visibility 0.9s ease;
  }
  #rj-preloader.hide { opacity:0; visibility:hidden; pointer-events:none; }
  #rj-preloader .pre-names {
    font-family:'Tangerine',cursive; font-size:4.5rem;
    color:var(--terracotta,#8B4A2B);
    opacity:0; animation: preIn 1s cubic-bezier(0.22,1,0.36,1) 0.2s forwards;
  }
  #rj-preloader .pre-line {
    width:0; height:1px;
    background:linear-gradient(90deg, transparent, var(--gold,#C4A96A), transparent);
    animation: preLineGrow 1.2s cubic-bezier(0.22,1,0.36,1) 0.5s forwards;
  }
  #rj-preloader .pre-sub {
    font-family:'Noto Sans',sans-serif; font-size:0.6rem;
    letter-spacing:5px; color:var(--gold,#C4A96A);
    text-transform:uppercase; opacity:0;
    animation: preIn 0.8s ease 0.9s forwards;
  }
  @keyframes preIn {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes preLineGrow { to { width:140px; } }
`;
document.head.appendChild(preloaderStyle);

const preloader = document.createElement('div');
preloader.id = 'rj-preloader';
preloader.innerHTML = `
  <div class="pre-names">R &amp; J</div>
  <div class="pre-line"></div>
  <div class="pre-sub">May 8 · 2026</div>
`;
document.body.prepend(preloader);

window.addEventListener('load', () => {
  setTimeout(() => preloader.classList.add('hide'), 1200);
});


// ── 3. WRAP SECTIONS IN SNAP CONTAINER ───────────────
(function buildSnapContainer() {
  const container = document.createElement('div');
  container.id = 'snap-container';

  // Move all direct children of body (except fixed UI) into container
  const fixed = ['#rj-preloader', '#slide-dots', '#slide-counter', '#scroll-hint', '.navbar'];
  const children = Array.from(document.body.children).filter(el => {
    return !fixed.some(sel => el.matches?.(sel));
  });

  children.forEach(el => container.appendChild(el));
  document.body.appendChild(container);
})();


// ── 4. SLIDE FADE OBSERVER ────────────────────────────
(function initSlides() {
  const container = document.getElementById('snap-container');
  const slides    = container.querySelectorAll('section, footer');

  // Add slide-fade class to all except hero (hero self-animates)
  slides.forEach((slide, i) => {
    if (i === 0) return; // hero handles its own animation
    slide.classList.add('slide-fade');
  });

  // Add stagger class to key inner wrappers
  const staggerMap = {
    '.invitation':             '.invitation-grid',
    '.countdown-section':      '.container',
    '.save-date':              '.container',
    '.venue':                  '.container',
    '.timeline':               '.container',
    '.dress-code':             '.container',
    '.gift-unplugged-section': '.container',
    '.rsvp-section':           '.container',
    '.footer':                 '.container',
  };

  Object.entries(staggerMap).forEach(([sec, inner]) => {
    const el = document.querySelector(`${sec} ${inner}`);
    if (el) el.classList.add('stagger');
  });

  // IntersectionObserver — fires when slide is ≥ 45% visible
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio >= 0.45) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    root:       container,
    threshold:  0.45,
  });

  slides.forEach(slide => io.observe(slide));
})();


// ── 5. PROGRESS DOTS ─────────────────────────────────
(function initDots() {
  const container = document.getElementById('snap-container');
  const slides    = Array.from(container.querySelectorAll('section, footer'));

  // Build dot nav
  const dotNav = document.createElement('div');
  dotNav.id = 'slide-dots';

  // Counter badge
  const counter = document.createElement('div');
  counter.id = 'slide-counter';
  counter.textContent = `1 / ${slides.length}`;

  // Hint
  const hint = document.createElement('div');
  hint.id = 'scroll-hint';
  hint.textContent = 'SCROLL ↓';

  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      slides[i].scrollIntoView({ behavior: 'smooth' });
    });
    dotNav.appendChild(dot);
  });

  document.body.appendChild(dotNav);
  document.body.appendChild(counter);
  document.body.appendChild(hint);

  // Light sections (cream bg) → switch dot color
  const lightSections = [
    '.invitation', '.save-date', '.venue', '.dress-code',
    '.gift-unplugged-section', '.rsvp-section', '.footer'
  ];

  let currentSlide = 0;

  function updateDots(index) {
    currentSlide = index;
    const dots = dotNav.querySelectorAll('.slide-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    counter.textContent = `${index + 1} / ${slides.length}`;

    // Check if current slide is a light section
    const slide = slides[index];
    const isLight = lightSections.some(sel => slide.matches?.(sel));
    dotNav.classList.toggle('dark-dots', isLight);
    counter.classList.toggle('dark', isLight);

    // Hide hint after first scroll
    if (index > 0) hint.classList.add('hide');
  }

  // Track which slide is most visible
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio >= 0.5) {
        const idx = slides.indexOf(entry.target);
        if (idx !== -1) updateDots(idx);
      }
    });
  }, {
    root:      container,
    threshold: 0.5,
  });

  slides.forEach(slide => io.observe(slide));
})();


// ── 6. KEYBOARD NAVIGATION ────────────────────────────
(function initKeyboard() {
  const container = document.getElementById('snap-container');
  const slides    = Array.from(container.querySelectorAll('section, footer'));
  let current     = 0;

  function goTo(i) {
    current = Math.max(0, Math.min(i, slides.length - 1));
    slides[current].scrollIntoView({ behavior: 'smooth' });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowUp'   || e.key === 'PageUp'  ) { e.preventDefault(); goTo(current - 1); }
  });

  // Update current index on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio >= 0.5) {
        const idx = slides.indexOf(entry.target);
        if (idx !== -1) current = idx;
      }
    });
  }, { root: container, threshold: 0.5 });

  slides.forEach(s => io.observe(s));
})();


// ── 7. COUNTDOWN TIMER ────────────────────────────────
(function initCountdown() {
  const weddingDate = new Date('May 8, 2026 12:00:00').getTime();
  const els = {
    days:    document.getElementById('days'),
    hours:   document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
  };
  if (!els.days) return;

  function flip(el, val) {
    if (el.textContent === val) return;
    el.classList.remove('flip');
    void el.offsetWidth;
    el.classList.add('flip');
    el.textContent = val;
  }

  function tick() {
    const diff = weddingDate - Date.now();
    if (diff <= 0) {
      flip(els.days,'000'); flip(els.hours,'00');
      flip(els.minutes,'00'); flip(els.seconds,'00');
      return;
    }
    flip(els.days,    String(Math.floor(diff / 86400000)).padStart(3,'0'));
    flip(els.hours,   String(Math.floor((diff % 86400000) / 3600000)).padStart(2,'0'));
    flip(els.minutes, String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0'));
    flip(els.seconds, String(Math.floor((diff % 60000) / 1000)).padStart(2,'0'));
  }

  tick();
  setInterval(tick, 1000);
})();


// ── 8. AUTOPLAY MUSIC ────────────────────────────────
const musicToggle = document.getElementById('musicToggle');
let isPlaying     = false;
const audio       = new Audio('tahanan.mp3');
audio.loop        = true;

function playMusic() {
  audio.play()
    .then(() => {
      isPlaying = true;
      if (musicToggle) {
        musicToggle.innerHTML = '<span class="music-icon">♫</span>';
        musicToggle.style.opacity = '1';
      }
    })
    .catch(() => {
      if (musicToggle) {
        musicToggle.innerHTML = '<span class="music-icon">♪</span>';
        musicToggle.style.opacity = '0.7';
      }
    });
}

window.addEventListener('load', () => setTimeout(playMusic, 1400));
document.addEventListener('click', function initAudio() {
  if (!isPlaying) playMusic();
  document.removeEventListener('click', initAudio);
}, { once: true });

if (musicToggle) {
  musicToggle.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      musicToggle.innerHTML = '<span class="music-icon">♪</span>';
      musicToggle.style.opacity = '0.7';
      isPlaying = false;
    } else {
      audio.play();
      musicToggle.innerHTML = '<span class="music-icon">♫</span>';
      musicToggle.style.opacity = '1';
      isPlaying = true;
    }
  });
}


// ── 9. NAVBAR ────────────────────────────────────────
// ── HAMBURGER MENU ────────────────────────────────
(function initMenu() {
  const toggle  = document.getElementById('menuToggle');
  const overlay = document.getElementById('navOverlay');
  const close   = document.getElementById('navClose');
  const links   = document.querySelectorAll('.nav-link');
  const container = document.getElementById('snap-container');

  if (!toggle || !overlay) return;

  function openMenu() {
    overlay.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    overlay.classList.contains('open') ? closeMenu() : openMenu();
  });

  close?.addEventListener('click', closeMenu);

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeMenu();
  });

  // Navigate to section on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      const sel = link.dataset.section;
      const target = container
        ? container.querySelector(sel)
        : document.querySelector(sel);
      if (target) {
        closeMenu();
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeMenu();
  });
})();


(function initNavbar() {
  const navbar      = document.querySelector('.navbar');
  if (!navbar) return;
  const musicBtn    = navbar.querySelector('.music-btn');
  const toggleSpans = navbar.querySelectorAll('.menu-toggle span');
  const container   = document.getElementById('snap-container');

  // Light sections need dark navbar
  const lightSections = [
    '.invitation','.save-date','.venue','.dress-code',
    '.gift-unplugged-section','.rsvp-section','.footer'
  ];

  const slides = Array.from(container?.querySelectorAll('section, footer') || []);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio < 0.5) return;
      const isLight = lightSections.some(sel => entry.target.matches?.(sel));
      navbar.style.background     = isLight ? 'rgba(253,250,245,0.95)' : 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)';
      navbar.style.backdropFilter = isLight ? 'blur(14px)' : 'none';
      navbar.style.boxShadow      = isLight ? '0 2px 20px rgba(139,74,43,0.1)' : 'none';
      if (musicBtn) {
        musicBtn.style.borderColor = isLight ? 'var(--sienna)' : 'white';
        musicBtn.style.color       = isLight ? 'var(--sienna)' : 'white';
      }
      toggleSpans.forEach(s => s.style.background = isLight ? 'var(--sienna)' : 'white');
    });
  }, { root: container, threshold: 0.5 });

  slides.forEach(s => io.observe(s));
})();


// ── 10. VENUE CAROUSEL ───────────────────────────────
(function initCarousel() {
  const track   = document.querySelector('.carousel-track');
  const slides  = document.querySelectorAll('.carousel-slide');
  const dots    = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  if (!track || !slides.length) return;

  let current = 0, startX = 0, isDragging = false, timer = null;

  function goTo(i) {
    current = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle('active', j === current));
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4200);
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); startAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); startAuto(); }));

  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX; isDragging = true;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    if (!isDragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    isDragging = false; startAuto();
  });

  startAuto();
})();


// ── 11. CALENDAR TOOLTIP ─────────────────────────────
(function initCalTip() {
  const hl = document.querySelector('.days .highlight');
  if (!hl) return;

  const tip = document.createElement('span');
  tip.textContent = '💍 Our Day!';
  tip.style.cssText = `
    position:absolute; bottom:calc(100% + 8px); left:50%;
    transform:translateX(-50%) translateY(4px);
    background:var(--terracotta,#8B4A2B); color:#fff;
    font-family:'Noto Sans',sans-serif; font-size:0.52rem;
    letter-spacing:1px; padding:4px 10px; border-radius:20px;
    white-space:nowrap; opacity:0; pointer-events:none;
    transition:opacity 0.25s ease, transform 0.25s cubic-bezier(0.34,1.4,0.64,1);
    box-shadow:0 4px 12px rgba(139,74,43,0.28);
  `;
  hl.style.position = 'relative';
  hl.appendChild(tip);

  hl.addEventListener('mouseenter', () => {
    tip.style.opacity = '1';
    tip.style.transform = 'translateX(-50%) translateY(0)';
  });
  hl.addEventListener('mouseleave', () => {
    tip.style.opacity = '0';
    tip.style.transform = 'translateX(-50%) translateY(4px)';
  });
})();


(function initRSVP() {
  const form    = document.getElementById('rsvpForm');
  const success = document.getElementById('rsvpSuccess');
  if (!form || !success) return;

  // Make sure success is hidden on load
  success.style.display = 'none';
  success.classList.remove('visible');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const btn     = form.querySelector('.form-submit-btn');
    const btnText = btn?.querySelector('.btn-text');
    if (btnText) btnText.textContent = 'Sending… ◆';
    if (btn)     btn.style.opacity   = '0.7';

    const params  = new URLSearchParams(new FormData(form)).toString();
    const formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdI7hvHbBKVWWyKTblWoPLGdLbFQXY5JhETgJBZdhANn0ibTw/formResponse';

    fetch(formURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    }).then(showSuccess).catch(showSuccess);

    function showSuccess() {
      // Hide all form fields one by one
      form.querySelectorAll('.form-group, .form-submit-row').forEach(el => {
        el.style.display = 'none';
      });
      // Show thank you message
      success.style.display = 'block';
      success.classList.add('visible');
      success.style.animation = 'heroFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both';
    }
  });
})();