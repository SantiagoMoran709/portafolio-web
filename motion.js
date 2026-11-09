(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const mountain = document.querySelector('.mountain-drift');
  const hero = document.querySelector('.hero');
  let frame = 0;

  const update = () => {
    frame = 0;
    const shift = preference.matches ? 0 : Math.min(54, Math.max(0, -hero.getBoundingClientRect().top) * .12);
    mountain.style.setProperty('--drift', `${shift}px`);
  };
  addEventListener('scroll', () => {
    if (!preference.matches && !frame) frame = requestAnimationFrame(update);
  }, { passive: true });
  preference.addEventListener('change', update);
  update();

  if ('IntersectionObserver' in window && !preference.matches) {
    const appear = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        appear.unobserve(entry.target);
        if (!preference.matches) entry.target.animate(
          [{ opacity: .45, transform: 'translateY(15px)' }, { opacity: 1, transform: 'none' }],
          { duration: 550, easing: 'cubic-bezier(.2,.75,.3,1)' }
        );
      }
    }, { threshold: .12 });
    document.querySelectorAll('[data-reveal]').forEach(element => appear.observe(element));
  }
})();
