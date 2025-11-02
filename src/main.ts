// Year in footer
document.getElementById('year')!.textContent = String(new Date().getFullYear());

// Observe sections to update active nav
const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-nav]'));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const id = entry.target.id;
    const link = navLinks.find(a => a.getAttribute('href') === `#${id}`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('is-active'));
      link.classList.add('is-active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

sections.forEach(sec => sectionObserver.observe(sec));

// Reveal-on-scroll + staggered children
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target as HTMLElement;
    el.classList.add('is-visible');

    // Stagger children if requested
    const sel = el.dataset.stagger;
    if (sel) {
      const kids = Array.from(el.querySelectorAll<HTMLElement>(sel));
      kids.forEach((k, i) => {
        k.classList.add('stagger-child');
        k.style.animationDelay = `${i * 90}ms`;
      });
    }
    revealObserver.unobserve(el); // animate once
  });
}, { threshold: 0.12 });

document.querySelectorAll<HTMLElement>('.reveal').forEach(el => revealObserver.observe(el));

// Scroll progress bar
const progress = document.getElementById('progress')!;
const onScroll = () => {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const pct = Math.max(0, Math.min(1, h.scrollTop / max));
  progress.style.width = `${pct * 100}%`;
};
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Cursor friend (smooth follow) ---------- */
const friend = document.getElementById('cursor-friend')!;
let fx = window.innerWidth / 2, fy = window.innerHeight / 2;
let tx = fx, ty = fy;
window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
function step(){
  // lerp
  fx += (tx - fx) * 0.12;
  fy += (ty - fy) * 0.12;
  friend.style.left = fx + 'px';
  friend.style.top  = fy + 'px';
  requestAnimationFrame(step);
}
step();

/* ---------- Sparkle bursts on hover ---------- */
function makeSparkles(el: HTMLElement, count = 10){
  const rect = el.getBoundingClientRect();
  const originX = rect.left + rect.width / 2 + window.scrollX;
  const originY = rect.top + rect.height / 2 + window.scrollY;

  for (let i=0;i<count;i++){
    const s = document.createElement('div');
    s.className = 'sparkle ' + (i % 3 === 0 ? 'heart' : i % 3 === 1 ? 'star' : 'dot');

    // random direction
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random()*36;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 10;

    s.style.setProperty('--dx', `${dx}px`);
    s.style.setProperty('--dy', `${dy}px`);
    s.style.left = originX + 'px';
    s.style.top  = originY + 'px';

    document.body.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }
}

// Add to work + projects
document.querySelectorAll<HTMLElement>('.sparkle-target').forEach(el=>{
  el.addEventListener('mouseenter', ()=> makeSparkles(el, 12));
});

/* ---------- Optional confetti on click for projects ---------- */
document.querySelectorAll<HTMLElement>('.confetti-target').forEach(el=>{
  el.addEventListener('click', (e)=>{
    // Slightly fewer so it doesn't block the link
    makeSparkles(el, 8);
  });
});

// Parallax tilt on circular avatar
const avatarWrap = document.getElementById('avatarWrap') as HTMLElement | null;
if (avatarWrap) {
  const strength = 10;
  avatarWrap.addEventListener('mousemove', (e) => {
    const rect = avatarWrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    avatarWrap.style.transform = `rotateX(${(-dy * strength)}deg) rotateY(${(dx * strength)}deg)`;
  });
  avatarWrap.addEventListener('mouseleave', () => {
    avatarWrap.style.transform = '';
  });
}

// Parallax drift on hero text (subtle)
const heroText = document.getElementById('heroText') as HTMLElement | null;
if (heroText) {
  const drift = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    const amt = Math.min(12, y * 0.05);
    heroText.style.transform = `translateY(${amt}px)`;
  };
  document.addEventListener('scroll', drift, { passive: true });
  drift();
}

// Back to top button
const toTop = document.getElementById('toTop')!;
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
const toggleTop = () => {
  const y = window.scrollY || document.documentElement.scrollTop;
  if (y > 600) toTop.classList.add('is-visible');
  else toTop.classList.remove('is-visible');
};
document.addEventListener('scroll', toggleTop, { passive: true });
toggleTop();
