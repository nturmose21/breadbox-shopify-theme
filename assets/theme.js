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
    const stock = form.closest('[data-product-root]')?.querySelector('.hero-product__stock');
    if (!variant || !button) return;
    variant.addEventListener('change', () => {
      const option = variant.options[variant.selectedIndex];
      const available = option.dataset.available === 'true';
      button.disabled = !available;
      const label = button.querySelector('span');
      if (label) label.textContent = available ? 'Add to cart' : 'Sold out';
      if (price && option.dataset.price) price.textContent = option.dataset.price;
      if (stock) {
        stock.textContent = available ? 'Ready to ship' : 'Currently unavailable';
        stock.classList.toggle('is-unavailable', !available);
      }
    });
  });
}

let revealObserver;
function initReveals(root = document) {
  if (prefersReducedMotion.matches) {
    document.documentElement.classList.remove('motion-ready');
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px 12% 0px', threshold: 0.01 });
  }
  root.querySelectorAll('[data-reveal]:not([data-reveal-bound])').forEach((element) => {
    element.dataset.revealBound = 'true';
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.94) {
      element.classList.add('is-visible');
    } else {
      revealObserver.observe(element);
    }
  });
  document.documentElement.classList.add('motion-ready');
}

let parallaxElements = [];
const activeParallaxElements = new Set();
let parallaxFrame;
let parallaxObserver;
let cinematicElements = [];
let cinematicFrame;

function parallaxEnabled() {
  return !prefersReducedMotion.matches && window.matchMedia('(min-width: 721px)').matches;
}

function updateParallax() {
  parallaxFrame = null;
  if (!parallaxEnabled() || document.visibilityState === 'hidden') return;
  const viewportHeight = window.innerHeight;
  activeParallaxElements.forEach((element) => {
    if (!element.isConnected) {
      activeParallaxElements.delete(element);
      return;
    }
    const rect = element.getBoundingClientRect();
    const strength = Number(element.dataset.parallax || 0);
    const progress = ((rect.top + rect.height / 2) - viewportHeight / 2) / viewportHeight;
    const shift = Math.max(-1, Math.min(1, progress)) * strength * -1.6;
    element.style.setProperty('--parallax-y', `${shift.toFixed(2)}px`);
  });
}

function requestParallax() {
  if (!parallaxEnabled() || parallaxFrame) return;
  parallaxFrame = requestAnimationFrame(updateParallax);
}

function initParallax(root = document) {
  if (!parallaxObserver) {
    parallaxObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeParallaxElements.add(entry.target);
        else activeParallaxElements.delete(entry.target);
      });
      requestParallax();
    }, { rootMargin: '120px 0px' });
  }
  root.querySelectorAll('[data-parallax]:not([data-parallax-bound])').forEach((element) => {
    element.dataset.parallaxBound = 'true';
    parallaxElements.push(element);
    parallaxObserver.observe(element);
  });
  if (!parallaxEnabled()) {
    parallaxElements.forEach((element) => element.style.setProperty('--parallax-y', '0px'));
    return;
  }
  requestParallax();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updateCinematics() {
  cinematicFrame = null;
  if (prefersReducedMotion.matches || document.visibilityState === 'hidden') return;
  const viewportHeight = window.innerHeight || 1;
  cinematicElements = cinematicElements.filter((element) => element.isConnected);
  cinematicElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const progress = clamp((viewportHeight * 0.12 - rect.top) / Math.max(rect.height * 0.72, 1), 0, 1);
    element.style.setProperty('--scroll-progress', progress.toFixed(4));
    element.dataset.scrollFrame = String(Math.round(progress * 7));
  });
}

function requestCinematics() {
  if (prefersReducedMotion.matches || cinematicFrame) return;
  cinematicFrame = requestAnimationFrame(updateCinematics);
}

function initCinematics(root = document) {
  root.querySelectorAll('[data-scroll-cinematic]:not([data-cinematic-bound])').forEach((element) => {
    element.dataset.cinematicBound = 'true';
    cinematicElements.push(element);
  });
  if (prefersReducedMotion.matches) {
    cinematicElements.forEach((element) => element.style.setProperty('--scroll-progress', '0'));
    return;
  }
  requestCinematics();
}

function initTheme(root = document) {
  initProductUI(root);
  initReveals(root);
  initParallax(root);
  initCinematics(root);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initTheme());
else initTheme();
document.addEventListener('shopify:section:load', (event) => initTheme(event.target));
window.addEventListener('scroll', () => {
  requestParallax();
  requestCinematics();
}, { passive: true });
window.addEventListener('resize', () => {
  parallaxElements = parallaxElements.filter((element) => element.isConnected);
  if (!parallaxEnabled()) parallaxElements.forEach((element) => element.style.setProperty('--parallax-y', '0px'));
  requestParallax();
  requestCinematics();
}, { passive: true });
document.addEventListener('visibilitychange', () => {
  requestParallax();
  requestCinematics();
});

function handleMotionPreferenceChange() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = undefined;
  document.querySelectorAll('[data-reveal]').forEach((element) => {
    delete element.dataset.revealBound;
    element.classList.toggle('is-visible', prefersReducedMotion.matches);
  });
  document.querySelectorAll('[data-scroll-cinematic]').forEach((element) => {
    delete element.dataset.cinematicBound;
    element.style.setProperty('--scroll-progress', '0');
  });
  cinematicElements = [];
  initTheme();
}

if (prefersReducedMotion.addEventListener) {
  prefersReducedMotion.addEventListener('change', handleMotionPreferenceChange);
} else {
  prefersReducedMotion.addListener(handleMotionPreferenceChange);
}
