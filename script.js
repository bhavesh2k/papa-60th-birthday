const openButton = document.querySelector('#open-surprise');
const celebrateButton = document.querySelector('#celebrate');
const cake = document.querySelector('#cake');

openButton.addEventListener('click', () => document.querySelector('#journey').scrollIntoView({ behavior: 'smooth' }));

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: 0.16 });
document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

function celebrate() {
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
