/* Ellada Mesveliani Interiors — interactions */

// --- Nav: solid background after scrolling past the lander ---
const nav = document.getElementById('nav');
const onScroll = () => {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.6);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// --- Mobile menu toggle ---
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.textContent = open ? 'Close' : 'Menu';
  });
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.textContent = 'Menu';
    })
  );
}

// --- Reveal on scroll ---
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// --- Slot-machine word reel on the contact band ---
const wordSlot = document.getElementById('wordSlot');
if (wordSlot && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const track = wordSlot.querySelector('.word-track');
  const words = Array.from(track.children);
  const setWidth = (el) => { wordSlot.style.width = el.getBoundingClientRect().width + 'px'; };

  let i = 0;
  words[0].classList.add('is-current');
  const ready = (document.fonts && document.fonts.ready) || Promise.resolve();
  ready.then(() => setWidth(words[0]));

  const advance = () => {
    const cur = words[i];
    i = (i + 1) % words.length;
    const next = words[i];
    cur.classList.replace('is-current', 'is-out');
    next.classList.remove('is-out');
    next.classList.add('is-current');
    setWidth(next);
    setTimeout(() => cur.classList.remove('is-out'), 520);
  };

  let timer = setInterval(advance, 2200);
  window.addEventListener('resize', () => setWidth(words[i]));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { clearInterval(timer); }
    else { timer = setInterval(advance, 2200); }
  });
}

// --- Lightbox for gallery pages ---
const lb = document.getElementById('lightbox');
if (lb) {
  const lbImg = document.getElementById('lbImg');
  const figs = Array.from(document.querySelectorAll('.gallery img'));
  let idx = 0;

  const show = (i) => {
    idx = (i + figs.length) % figs.length;
    lbImg.src = figs[idx].src;
    lbImg.alt = figs[idx].alt || '';
  };
  const open = (i) => { show(i); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); };
  const close = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); };

  figs.forEach((img, i) => img.addEventListener('click', () => open(i)));
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', (e) => { e.stopPropagation(); show(idx - 1); });
  document.getElementById('lbNext').addEventListener('click', (e) => { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
}
