(function () {
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    document.documentElement.classList.add('transitions-enabled');
  }

  function markReady() {
    document.documentElement.classList.remove('is-leaving');
    requestAnimationFrame(function () {
      document.documentElement.classList.add('is-ready');
    });
  }

  if (!reduceMotion) {
    markReady();
    window.addEventListener('pageshow', markReady);
  }

  window.smoothSwap = function (callback) {
    if (document.startViewTransition) {
      document.startViewTransition(callback);
      return;
    }
    callback();
  };

  window.DSUI = window.DSUI || {};
  window.DSUI.swap = window.smoothSwap;
  window.DSUI.swapSection = function (section, callback) {
    if (!section) {
      window.smoothSwap(callback);
      return;
    }
    section.classList.add('ui-is-swapping');
    window.setTimeout(function () {
      window.smoothSwap(callback);
      requestAnimationFrame(function () {
        section.classList.remove('ui-is-swapping');
        section.classList.add('ui-just-swapped');
        window.setTimeout(function () {
          section.classList.remove('ui-just-swapped');
        }, 260);
      });
    }, reduceMotion ? 0 : 90);
  };

  window.DSUI.setVisible = function (element, visible, display) {
    if (!element) return;
    if (visible) {
      element.style.display = display || element.dataset.display || 'block';
      requestAnimationFrame(function () {
        element.classList.add('is-visible');
      });
    } else {
      element.classList.remove('is-visible');
      if (reduceMotion) {
        element.style.display = 'none';
        return;
      }
      window.setTimeout(function () {
        if (!element.classList.contains('is-visible')) element.style.display = 'none';
      }, 180);
    }
  };

  if (!reduceMotion) {
    document.addEventListener('click', function (event) {
      var link = event.target.closest && event.target.closest('a[href]');
      if (!link || event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.target && link.target !== '_self') return;

      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#' || href.indexOf('javascript:') === 0) return;

      var url;
      try {
        url = new URL(href, window.location.href);
      } catch (err) {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      event.preventDefault();
      document.documentElement.classList.add('is-leaving');
      window.setTimeout(function () {
        window.location.href = url.href;
      }, 170);
    });
  }

  // ── Back-to-top button (all pages) ───────────────────────
  (function() {
    var btn = document.getElementById('back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'back-to-top';
      btn.title = 'Back to top';
      btn.setAttribute('aria-label', 'Back to top');
      btn.textContent = '↑';
      btn.onclick = function() { window.scrollTo({ top: 0, behavior: 'smooth' }); };
      document.body.appendChild(btn);
    }
    window.addEventListener('scroll', function() {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  })();

  // ── Mobile bottom nav active state (all pages) ────────────
  (function() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    var map  = {
      'index.html': 0, '': 0,
      'categories.html': 1, 'scenario.html': 1,
      'leaderboard.html': 2,
      'forum.html': 3,
      'profile.html': 4
    };
    var activeIdx = map[path];
    if (activeIdx === undefined) return;
    var btns = document.querySelectorAll('.mobile-nav-btn');
    if (btns[activeIdx]) btns[activeIdx].classList.add('active');
  })();

  // ── PWA Service Worker ────────────────────────────────────
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').catch(function(){});
    });
  }

  // ── Forum unread badge ───────────────────────────────────
  (function() {
    // If we're not on forum.html, check if there are new posts since last visit
    var path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === 'forum.html') return; // forum itself doesn't need badge
    try {
      var lastVisit = parseInt(localStorage.getItem('ds_forum_last_visit') || '0', 10);
      var lastCount = parseInt(localStorage.getItem('ds_forum_last_count') || '0', 10);
      var currentCount = parseInt(localStorage.getItem('ds_forum_post_count') || '0', 10);
      if (lastVisit > 0 && currentCount > lastCount) {
        // Attach badge to forum nav link
        function attachBadge() {
          var links = document.querySelectorAll('a[href="forum.html"], a[href*="forum.html"]');
          links.forEach(function(link) {
            if (link.querySelector('.forum-badge')) return;
            var badge = document.createElement('span');
            badge.className = 'forum-badge';
            badge.textContent = 'New';
            badge.style.cssText = 'display:inline-block;background:var(--accent,#8b1a1a);color:#fff;font-size:8px;font-weight:700;letter-spacing:0.08em;padding:1px 5px;border-radius:2px;margin-left:5px;vertical-align:middle;font-family:sans-serif;';
            link.appendChild(badge);
          });
        }
        if (document.body) attachBadge();
        else document.addEventListener('DOMContentLoaded', attachBadge);
      }
    } catch(e) {}
  })();

  // ── Mobile hamburger nav ──────────────────────────────────
  (function() {
    function initHamburger() {
      var nav = document.querySelector('.nav-strip');
      if (!nav) return;
      var btn = document.createElement('button');
      btn.className = 'nav-hamburger';
      btn.setAttribute('aria-label', 'Toggle navigation');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = '<span></span><span></span><span></span>';
      btn.addEventListener('click', function() {
        nav.classList.toggle('mobile-open');
        btn.setAttribute('aria-expanded', nav.classList.contains('mobile-open') ? 'true' : 'false');
      });
      nav.appendChild(btn);
      // Close nav when a link is clicked
      nav.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') nav.classList.remove('mobile-open');
      });
    }
    if (document.body) { initHamburger(); }
    else { document.addEventListener('DOMContentLoaded', initHamburger); }
  })();

  // ── Dark mode toggle ──────────────────────────────────────
  (function() {
    var btn = document.createElement('button');
    btn.className = 'dark-toggle';
    btn.type = 'button';
    btn.title = 'Toggle dark mode';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    var isDark = false;
    try {
      isDark = localStorage.getItem('ds-dark') === '1';
    } catch (err) {}
    if (isDark) document.documentElement.classList.add('dark-mode');
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.addEventListener('click', function() {
      isDark = !isDark;
      document.documentElement.classList.toggle('dark-mode', isDark);
      try {
        localStorage.setItem('ds-dark', isDark ? '1' : '0');
      } catch (err) {}
      btn.textContent = isDark ? '☀️' : '🌙';
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    });
    // Safe append: works whether defer fires before or after DOMContentLoaded
    if (document.body) {
      document.body.appendChild(btn);
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        document.body.appendChild(btn);
      });
    }
  })();

})();
