(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var links = document.getElementById('site-nav-links');
  if (!toggle || !links) return;

  function setOpen(open) {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', function () {
    setOpen(!links.classList.contains('is-open'));
  });

  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  window.matchMedia('(min-width: 640px)').addEventListener('change', function () {
    setOpen(false);
  });
})();
