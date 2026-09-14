/* Lightweight homepage behavior; the entire atlas also navigates without JS. */
(function () {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click',event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
      history.replaceState(null,'',link.getAttribute('href'));
    });
  });
})();
