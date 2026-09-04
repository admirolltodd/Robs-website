(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hamburger menu ---------- */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  var main = document.querySelector('main');

  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (main) main.inert = open;
    if (open) {
      menu.querySelector('a').focus();
    } else {
      burger.focus();
    }
  }
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') setMenu(false);
  });

  /* ---------- Scroll progress ---------- */
  var bar = document.querySelector('.progress');
  function progress() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? h.scrollTop / max : 0) + ')';
  }
  window.addEventListener('scroll', progress, { passive: true });
  progress();

  /* ---------- Word-by-word headings ---------- */
  function splitWords(el) {
    var i = 0;
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var parts = node.nodeValue.split(/(\s+)/);
      var frag = document.createDocumentFragment();
      parts.forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var s = document.createElement('span');
        s.className = 'w';
        s.style.setProperty('--i', i++);
        s.textContent = part;
        frag.appendChild(s);
      });
      node.parentNode.replaceChild(frag, node);
    });
  }
  if (!reduce) {
    document.querySelectorAll('[data-words]').forEach(splitWords);
  }

  /* ---------- Reveal on scroll ---------- */
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        revealIO.unobserve(en.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
  document.querySelectorAll('.reveal, .stagger, [data-words]').forEach(function (el) {
    revealIO.observe(el);
  });

  /* ---------- Section background themes ---------- */
  var themeIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) document.body.dataset.theme = en.target.dataset.theme;
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  document.querySelectorAll('[data-theme]').forEach(function (el) { themeIO.observe(el); });

  /* ---------- Image load: swap placeholder ---------- */
  document.querySelectorAll('.ph img').forEach(function (img) {
    function done() { img.parentNode.classList.add('loaded'); }
    if (img.complete) done(); else img.addEventListener('load', done);
  });
})();
