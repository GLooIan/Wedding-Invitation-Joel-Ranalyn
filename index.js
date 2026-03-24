// ================= PARTICLES =================
const canvas = document.getElementById("matchaParticles");
const ctx = canvas.getContext("2d", { alpha: true });

function setCanvasSize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
setCanvasSize();

let particlesArray = [];
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
const particleCount = isTouchDevice ? 28 : 55;

class Particle {
  constructor(randomY = true) {
    this.reset(randomY);
  }

  reset(randomY = true) {
    this.x       = Math.random() * canvas.width;
    this.y       = randomY ? Math.random() * canvas.height : canvas.height + 10;
    this.size    = Math.random() * 2.8 + 0.8;
    this.speedX  = (Math.random() - 0.5) * 0.28;
    this.speedY  = (Math.random() - 0.5) * 0.28;
    this.opacity = Math.random() * 0.38 + 0.08;
    this.color   = this.getRandomColor();
    // Gentle twinkle
    this.twinkleSpeed  = Math.random() * 0.008 + 0.003;
    this.twinkleOffset = Math.random() * Math.PI * 2;
  }

  getRandomColor() {
    const colors = [
      '139, 154, 109', // sage
      '107, 123,  76', // dark sage
      '201, 184, 163', // taupe
      '212, 196, 176', // champagne
      '184, 160, 106', // gold
      '255, 255, 255'  // white
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update(t) {
    this.x += this.speedX;
    this.y += this.speedY;

    // Wrap around edges
    if (this.x < -10) this.x = canvas.width  + 10;
    if (this.x > canvas.width  + 10) this.x = -10;
    if (this.y < -10) this.y = canvas.height + 10;
    if (this.y > canvas.height + 10) this.y = -10;

    // Gentle opacity twinkle
    this.currentOpacity = this.opacity * (0.7 + 0.3 * Math.sin(t * this.twinkleSpeed + this.twinkleOffset));
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.currentOpacity ?? this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  particlesArray = [];
  for (let i = 0; i < particleCount; i++) {
    particlesArray.push(new Particle(true));
  }
}

let frameCount = 0;
const skipFrames = isTouchDevice ? 1 : 0; // skip every other frame on touch for battery
let lastTime = 0;

function animateParticles(timestamp) {
  requestAnimationFrame(animateParticles);

  frameCount++;
  if (frameCount % (skipFrames + 1) !== 0) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particlesArray.forEach(p => {
    p.update(timestamp);
    p.draw();
  });
}

initParticles();
requestAnimationFrame(animateParticles);

// ================= RESIZE =================
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    setCanvasSize();
    initParticles();
  }, 150);
});

// ================= FADE IN BACKGROUND =================
window.addEventListener('load', () => {
  const scene = document.querySelector('.flower-scene');
  if (scene) scene.classList.remove('not-loaded');
});

// ================= PREFETCH HOME =================
const prefetchLink = document.createElement('link');
prefetchLink.rel  = 'prefetch';
prefetchLink.href = 'home.html';
document.head.appendChild(prefetchLink);

// ================= ENVELOPE PRESS FEEDBACK (mobile) =================
const envelopeLink = document.querySelector('.envelope-link');
if (envelopeLink) {
  envelopeLink.addEventListener('touchstart', () => {
    envelopeLink.classList.add('pressed');
  }, { passive: true });

  ['touchend', 'touchcancel'].forEach(evt => {
    envelopeLink.addEventListener(evt, () => {
      envelopeLink.classList.remove('pressed');
    }, { passive: true });
  });
}