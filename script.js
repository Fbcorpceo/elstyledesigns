/* El Style Designs — shared scripts */

// ——— Scroll reveal ———
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15, rootMargin: "0px 0px -80px 0px" });

function bindReveals() {
  document.querySelectorAll(".reveal, .reveal-img").forEach((el) => io.observe(el));
}

// ——— Page-transition curtain ———
function buildCurtain() {
  if (document.querySelector(".curtain")) return document.querySelector(".curtain");
  const c = document.createElement("div");
  c.className = "curtain";
  for (let i = 0; i < 5; i++) {
    const p = document.createElement("div");
    p.className = "panel";
    c.appendChild(p);
  }
  document.body.appendChild(c);
  return c;
}

function revealOnLoad() {
  const c = buildCurtain();
  // start with curtain covering, then reveal out
  c.classList.add("cover");
  // If we navigated here, the curtain may already be in 'cover' state from previous page
  // Force a frame, then reveal
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      c.classList.remove("cover");
      c.classList.add("reveal-out");
      setTimeout(() => {
        c.classList.remove("reveal-out");
        // reset panels to bottom for next cover
        c.querySelectorAll(".panel").forEach((p) => {
          p.style.transition = "none";
          p.style.transform = "translateY(100%)";
          // force reflow
          p.offsetHeight;
          p.style.transition = "";
        });
      }, 1100);
    });
  });
}

function bindLinks() {
  document.querySelectorAll("a[data-transition]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http")) return;
      e.preventDefault();
      const c = buildCurtain();
      c.classList.remove("reveal-out");
      c.classList.add("cover");
      setTimeout(() => { window.location.href = href; }, 750);
    });
  });
}

// ——— Intro animation (home only) ———
function homeIntro() {
  const intro = document.getElementById("intro");
  if (!intro) return;
  // sequence: hold dark, brand mark types in, divider, then lift
  setTimeout(() => intro.classList.add("step-1"), 400);
  setTimeout(() => intro.classList.add("step-2"), 1400);
  setTimeout(() => intro.classList.add("step-3"), 2400);
  setTimeout(() => {
    intro.classList.add("lift");
    document.body.classList.add("intro-done");
  }, 3300);
  setTimeout(() => intro.remove(), 4500);
}

// ——— Marquee duplicate ———
function bindMarquees() {
  document.querySelectorAll("[data-marquee]").forEach((m) => {
    const inner = m.firstElementChild;
    if (!inner) return;
    const clone = inner.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    m.appendChild(clone);
  });
}

// ——— Cursor (subtle) ———
function bindCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  const c = document.createElement("div");
  c.className = "cursor";
  document.body.appendChild(c);
  let x = 0, y = 0, tx = 0, ty = 0;
  window.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
  function loop() {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    c.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(loop);
  }
  loop();
  document.querySelectorAll("a, button, .imgcard").forEach((el) => {
    el.addEventListener("mouseenter", () => c.classList.add("hover"));
    el.addEventListener("mouseleave", () => c.classList.remove("hover"));
  });
}

function bindNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const update = () => {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  bindReveals();
  bindLinks();
  bindMarquees();
  bindCursor();
  bindNavScroll();
  homeIntro();
  // reveal-out the curtain on subsequent navigations (not first home load handled by intro)
  if (!document.getElementById("intro")) {
    revealOnLoad();
  }
});
