// ═══════════════════════════════════════════════════════════════
// DiplomacySim · Auth Cache  (shared across all pages)
// ═══════════════════════════════════════════════════════════════
// Eliminates the ~1-second nav lag by applying cached auth state
// INSTANTLY on page load before Firebase auth resolves.
//
// Usage in each page:
//   1. Include this file before your Firebase script block
//   2. In onAuthStateChanged: call DS_Auth.save(user, isAdmin)
//      and DS_Auth.applyNav(...)
// ═══════════════════════════════════════════════════════════════

window.DS_Auth = (function () {
  var KEY = 'ds_auth_v2';

  function get() {
    try { return JSON.parse(sessionStorage.getItem(KEY)) || null; }
    catch (e) { return null; }
  }

  function save(user, isAdmin) {
    try {
      if (user) {
        sessionStorage.setItem(KEY, JSON.stringify({
          email:       user.email,
          displayName: user.displayName || user.email,
          isAdmin:     !!isAdmin
        }));
      } else {
        sessionStorage.removeItem(KEY);
      }
    } catch (e) {}
  }

  // Applies the cached auth state to the standard nav elements
  // present on every page.
  function applyNav(state) {
    var navLink   = document.getElementById('nav-auth-link');
    var adminLink = document.getElementById('nav-admin-link');
    var pill      = document.getElementById('user-pill');
    var nameEl    = document.getElementById('user-display-name');
    var signinEl  = document.getElementById('topbar-signin-link');
    var topAdmin  = document.getElementById('topbar-admin-link');

    if (state && state.email) {
      if (navLink) {
        navLink.textContent = 'Sign Out';
        navLink.href = '#';
        navLink.classList.add('signout');
        navLink.onclick = function (e) {
          e.preventDefault();
          if (typeof doSignOut === 'function') doSignOut();
        };
      }
      if (pill)    { pill.style.display    = 'flex'; }
      if (nameEl)  { nameEl.textContent    = state.displayName || state.email; }
      if (signinEl){ signinEl.style.display = 'none'; }
      if (adminLink){ adminLink.style.display = state.isAdmin ? 'inline-block' : 'none'; }
      if (topAdmin) { topAdmin.style.display  = state.isAdmin ? 'inline-block' : 'none'; }
    } else {
      if (navLink) {
        navLink.textContent = 'Sign In';
        navLink.href = 'login.html';
        navLink.classList.remove('signout');
        navLink.onclick = null;
      }
      if (pill)    { pill.style.display     = 'none'; }
      if (signinEl){ signinEl.style.display = 'inline'; }
      if (adminLink){ adminLink.style.display = 'none'; }
      if (topAdmin) { topAdmin.style.display  = 'none'; }
    }
  }

  // Check isAdmin from sessionStorage cache only.
  // Pass isAdmin explicitly from each page's own ADMIN_EMAILS check.
  function isAdminCached(userEmail) {
    var cached = get();
    return !!(cached && cached.email === userEmail && cached.isAdmin);
  }

  // Apply immediately as soon as this script runs (DOM is ready since it's
  // loaded at the bottom of <body>)
  applyNav(get());

  return { get: get, save: save, applyNav: applyNav, isAdminCached: isAdminCached };
})();
