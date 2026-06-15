const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function initProductUI(root = document) {
  root.querySelectorAll('[data-gallery-thumb]:not([data-ui-bound])').forEach((button) => {
    button.dataset.uiBound = 'true';
    button.addEventListener('click', () => {
      const gallery = button.closest('[data-product-gallery]');
      const target = gallery?.querySelector(`[data-media-id="${button.dataset.galleryThumb}"]`);
      if (!target) return;
      gallery.querySelectorAll('[data-gallery-thumb]').forEach((item) => item.setAttribute('aria-current', 'false'));
      gallery.querySelectorAll('[data-media-id]').forEach((item) => item.hidden = true);
      button.setAttribute('aria-current', 'true');
      target.hidden = false;
    });
  });

  root.querySelectorAll('[data-product-form]:not([data-ui-bound])').forEach((form) => {
    form.dataset.uiBound = 'true';
    const variant = form.querySelector('[name="id"]');
    const button = form.querySelector('[name="add"]');
    const price = form.closest('[data-product-root]')?.querySelector('[data-product-price]');
    if (!variant || !button) return;
    variant.addEventListener('change', () => {
      const option = variant.options[variant.selectedIndex];
      const available = option.dataset.available === 'true';
      button.disabled = !available;
      const label = button.querySelector('span');
      if (label) label.textContent = available ? 'Add to cart' : 'Sold out';
      if (price && option.dataset.price) price.textContent = option.dataset.price;
    });
  });
}

let revealObserver;
function initReveals(root = document) {
  if (prefersReducedMotion.matches) return;
  document.documentElement.classList.add('motion-ready');
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  }
  root.querySelectorAll('[data-reveal]:not([data-reveal-bound])').forEach((element) => {
    element.dataset.revealBound = 'true';
    revealObserver.observe(element);
  });
}

let parallaxElements = [];
let parallaxFrame;
function updateParallax() {
  parallaxFrame = null;
  const viewportHeight = window.innerHeight;
  parallaxElements.forEach((element) => {
    if (!element.isConnected) return;
    const rect = element.getBoundingClientRect();
    if (rect.bottom < -100 || rect.top > viewportHeight + 100) return;
    const strength = Number(element.dataset.parallax || 0);
    const progress = ((rect.top + rect.height / 2) - viewportHeight / 2) / viewportHeight;
    const shift = Math.max(-1, Math.min(1, progress)) * strength * -3;
    element.style.setProperty('--parallax-y', `${shift.toFixed(2)}px`);
  });
}

function requestParallax() {
  if (prefersReducedMotion.matches || parallaxFrame) return;
  parallaxFrame = requestAnimationFrame(updateParallax);
}

function initParallax(root = document) {
  if (prefersReducedMotion.matches) return;
  root.querySelectorAll('[data-parallax]:not([data-parallax-bound])').forEach((element) => {
    element.dataset.parallaxBound = 'true';
    parallaxElements.push(element);
  });
  requestParallax();
}

function initTheme(root = document) {
  initProductUI(root);
  initReveals(root);
  initParallax(root);
}

document.addEventListener('DOMContentLoaded', () => initTheme());
document.addEventListener('shopify:section:load', (event) => initTheme(event.target));
window.addEventListener('scroll', requestParallax, { passive: true });
window.addEventListener('resize', requestParallax, { passive: true });
prefersReducedMotion.addEventListener('change', () => window.location.reload());
