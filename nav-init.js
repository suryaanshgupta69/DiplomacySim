// nav-init.js — Instant nav state, runs synchronously before Firebase loads.
// Reads Firebase auth cache (localStorage) + admin config cache (sessionStorage)
// so nav and admin link appear immediately with zero network round-trips.
(function () {
  var FB_KEY    = 'firebase:authUser:AIzaSyC_-1B2F9A8tXoPDlmJT4Gf2XPVNcRr94s:[DEFAULT]';
  var CFG_KEY   = 'ds_cfg_v1';

  var user   = null;
  var cfg    = null;
  try { user = JSON.parse(localStorage.getItem(FB_KEY));    } catch (e) {}
  try { cfg  = JSON.parse(sessionStorage.getItem(CFG_KEY)); } catch (e) {}

  function byId(id) { return document.getElementById(id); }
  function show(el, display) { if (el) el.style.display = display || 'inline-block'; }
  function hide(el) { if (el) el.style.display = 'none'; }

  var signinLink  = byId('topbar-signin-link');
  var topbarDot   = byId('topbar-dot-1');
  var userPill    = byId('user-pill');
  var displayName = byId('user-display-name');
  var navAuth     = byId('nav-auth-link') || byId('nav-signin-link');
  var navRegister = byId('nav-register-link');
  var footerAuth  = byId('footer-auth-link');
  var navAdmin    = byId('nav-admin-link') ||
                    byId('admin-nav-link') ||
                    byId('admin-link');
  var topbarAdmin = byId('topbar-admin-link');

  if (user && user.email) {
    // Logged in — apply immediately
    hide(signinLink);
    hide(topbarDot);
    hide(navRegister);
    show(userPill, 'flex');
    if (displayName) displayName.textContent = user.displayName || user.email.split('@')[0];
    if (navAuth) {
      navAuth.textContent = 'Sign Out';
      navAuth.classList.add('signout');
      navAuth.removeAttribute('href');
    }
    if (footerAuth) {
      footerAuth.textContent = 'Sign Out';
      footerAuth.removeAttribute('href');
    }

    // Show admin link immediately if config is cached in sessionStorage
    var isAdmin = cfg && Array.isArray(cfg.adminEmails) &&
                  cfg.adminEmails.indexOf(user.email) !== -1;
    if (isAdmin) {
      show(navAdmin);
      show(topbarAdmin);
    } else {
      hide(navAdmin);
      hide(topbarAdmin);
    }

  } else {
    // Not logged in
    show(signinLink, 'inline');
    show(topbarDot, 'inline');
    hide(userPill);
    if (navAuth) {
      navAuth.textContent = 'Sign In';
      navAuth.href = 'login.html';
      navAuth.classList.remove('signout');
      show(navAuth);
    }
    if (navRegister) show(navRegister);
    if (footerAuth) {
      footerAuth.textContent = 'Sign In';
      footerAuth.href = 'login.html';
      show(footerAuth, 'inline');
    }
    hide(navAdmin);
    hide(topbarAdmin);
  }
})();
