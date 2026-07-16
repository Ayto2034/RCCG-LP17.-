/* ===== Reusable image carousel (used for Elders Thanksgiving Service slideshow) ===== */
(function(){
  document.querySelectorAll('.carousel').forEach(initCarousel);

  function initCarousel(root){
    const track = root.querySelector('.carousel-track');
    const slides = Array.from(root.querySelectorAll('.carousel-slide'));
    const dotsWrap = root.querySelector('.carousel-dots');
    const prevBtn = root.querySelector('.carousel-arrow.prev');
    const nextBtn = root.querySelector('.carousel-arrow.next');
    if (!track || !slides.length) return;

    let index = 0;
    let autoplayTimer = null;
    const AUTOPLAY_MS = 4500;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.querySelectorAll('.carousel-dot'));

    function render(){
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }
    function goTo(i){
      index = (i + slides.length) % slides.length;
      render();
      resetAutoplay();
    }
    function next(){ goTo(index + 1); }
    function prev(){ goTo(index - 1); }

    function startAutoplay(){
      if (reduceMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay(){
      if (autoplayTimer) clearInterval(autoplayTimer);
    }
    function resetAutoplay(){
      stopAutoplay();
      startAutoplay();
    }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', startAutoplay);

    let touchStartX = null;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
      touchStartX = null;
    }, { passive: true });

    render();
    startAutoplay();
  }
})();
