import { desplazamiento, factorPantalla, visible } from './parallax-calc.js';

/** Capas con data-parallax="velocidad" (y data-parallax-max="fracción del alto del contenedor"). */
export function iniciarParallax() {
  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)');
  const capas = [...document.querySelectorAll('[data-parallax]')].map((el) => ({
    el,
    speed: Number(el.dataset.parallax),
    max: el.dataset.parallaxMax ? Number(el.dataset.parallaxMax) : null,
    padre: el.parentElement,
  }));
  if (!capas.length) return;

  let ticking = false;

  function limpiar() {
    document.documentElement.classList.remove('parallax-on');
    for (const c of capas) c.el.style.transform = '';
  }

  function pintar() {
    ticking = false;
    const vh = window.innerHeight;
    const k = factorPantalla(window.innerWidth);
    for (const c of capas) {
      const rect = c.padre.getBoundingClientRect();
      if (!visible(rect, vh)) continue;
      const max = c.max == null ? Infinity : c.max * rect.height;
      const y = desplazamiento(rect, vh, c.speed * k, max);
      c.el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    }
  }

  function pedir() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(pintar);
  }

  function activar() {
    if (reducir.matches) {
      limpiar();
      window.removeEventListener('scroll', pedir);
      window.removeEventListener('resize', pedir);
      return;
    }
    document.documentElement.classList.add('parallax-on');
    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir);
    pintar();
  }

  reducir.addEventListener('change', activar);
  activar();
}
