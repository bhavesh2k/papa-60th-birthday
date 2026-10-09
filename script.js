const openButton = document.querySelector('#open-surprise');
const celebrateButton = document.querySelector('#celebrate');
const cake = document.querySelector('#cake');
const bgMusic = document.querySelector('#bg-music');
const musicToggle = document.querySelector('#music-toggle');

function updateMusicUI(playing) {
  if (!musicToggle) return;
  if (playing) {
    musicToggle.classList.add('playing');
    musicToggle.setAttribute('aria-label', 'Pause background music');
    musicToggle.setAttribute('title', 'Pause background music');
  } else {
    musicToggle.classList.remove('playing');
    musicToggle.setAttribute('aria-label', 'Play background music');
    musicToggle.setAttribute('title', 'Play background music');
  }
}

function startMusic() {
  if (!bgMusic) return;
  bgMusic.volume = 0.85;
  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      updateMusicUI(true);
    }).catch(() => {
      // Browser blocked autoplay until user gesture
      updateMusicUI(false);
    });
  }
}

function pauseMusic() {
  if (bgMusic && !bgMusic.paused) {
    bgMusic.pause();
    updateMusicUI(false);
  }
}

function toggleMusic() {
  if (bgMusic) {
    if (bgMusic.paused) {
      startMusic();
    } else {
      pauseMusic();
    }
  }
}

if (musicToggle) {
  musicToggle.addEventListener('click', toggleMusic);
}

// 1. Immediate autoplay attempts on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startMusic);
} else {
  startMusic();
}
window.addEventListener('load', startMusic);

// 2. Fallback: on user's first touch, scroll, or keypress anywhere on the page
function autoPlayOnGesture() {
  if (bgMusic && bgMusic.paused) {
    startMusic();
  }
  ['pointerdown', 'touchstart', 'click', 'keydown', 'wheel', 'scroll'].forEach((evt) => {
    window.removeEventListener(evt, autoPlayOnGesture);
  });
}

['pointerdown', 'touchstart', 'click', 'keydown', 'wheel', 'scroll'].forEach((evt) => {
  window.addEventListener(evt, autoPlayOnGesture, { passive: true, once: true });
});

openButton.addEventListener('click', () => {
  startMusic();
  document.querySelector('#journey').scrollIntoView({ behavior: 'smooth' });
});

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: 0.16 });
document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

function celebrate() {
  startMusic();
  const colors = ['#d6ad57', '#f7da91', '#cf6f70', '#f2e4d0', '#7caa9a'];
  for (let i = 0; i < 130; i++) {
    const piece = document.createElement('i');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--drift', `${(Math.random() - .5) * 250}px`);
    piece.style.animationDelay = `${Math.random() * .55}s`;
    document.querySelector('#confetti').appendChild(piece);
    setTimeout(() => piece.remove(), 4300);
  }
  cake.animate([{ transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(-16px) rotate(-3deg)' }, { transform: 'translateY(0) rotate(0)' }], { duration: 600, easing: 'ease-out' });
}
celebrateButton.addEventListener('click', celebrate);
cake.addEventListener('click', celebrate);
cake.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') celebrate(); });

let candlesBlown = false;
const finaleObserver = new IntersectionObserver((entries) => {
  if (!entries[0].isIntersecting || candlesBlown) return;
  candlesBlown = true;
  setTimeout(() => {
    cake.classList.add('blown-out');
    celebrate();
  }, 5000);
}, { threshold: .55 });
finaleObserver.observe(document.querySelector('#finale'));
