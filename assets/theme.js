document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-gallery-thumb]').forEach((button) => {
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

  document.querySelectorAll('[data-product-form]').forEach((form) => {
    const variant = form.querySelector('[name="id"]');
    const button = form.querySelector('[name="add"]');
    const price = form.closest('[data-product-root]')?.querySelector('[data-product-price]');
    if (!variant || !button) return;
    variant.addEventListener('change', () => {
      const option = variant.options[variant.selectedIndex];
      const available = option.dataset.available === 'true';
      button.disabled = !available;
      button.querySelector('span').textContent = available ? 'Add to cart' : 'Sold out';
      if (price && option.dataset.price) price.textContent = option.dataset.price;
    });
  });
});
