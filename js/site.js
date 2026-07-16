/* ===== Mobile nav toggle ===== */
(function(){
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
})();

/* ===== Scroll reveal (.reveal fades in, .stagger cascades its children) ===== */
(function(){
  const targets = document.querySelectorAll('.reveal, .stagger');
  if (!targets.length) return;
  if ('IntersectionObserver' in window){
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(el => observer.observe(el));
  } else {
    targets.forEach(el => el.classList.add('visible'));
  }
})();

/* ===== Back to top ===== */
(function(){
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 600);
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ===== Subtle parallax on hero / page-banner numeral ===== */
(function(){
  const numeral = document.querySelector('.hero-numeral');
  if (!numeral) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const shift = Math.min(window.scrollY * 0.08, 60);
      numeral.style.transform = `translateY(calc(-50% + ${shift}px))`;
      ticking = false;
    });
  });
})();
