// ds-config.js — Loads admin config from Firestore, caches safe subset in sessionStorage.
// nav-init.js reads the sessionStorage cache synchronously on every page load
// so the admin link appears instantly with no Firestore round-trip.
//
// Security: API keys (pexelsKey, etc.) are NOT cached in sessionStorage.
// They are held in memory only, per session, and only when explicitly requested.
//
// Usage:
//   DS_CONFIG.load(db)        — call once after Firebase is ready
//   DS_CONFIG.isAdmin(email)  — true if email is an admin
//   DS_CONFIG.get('pexelsKey')— returns a config value (memory only, not sessionStorage)

window.DS_CONFIG = (function () {
  var CACHE_KEY    = 'ds_cfg_v1';
  // Keys safe to cache in sessionStorage (non-secret identifiers)
  var CACHEABLE    = ['adminEmails', 'cloudinaryCloud', 'cloudinaryPreset'];
  // Full config in memory (including sensitive keys — not persisted)
  var _data        = {};
  var _loaded      = false;
  var _loadPromise = null;

  // Bootstrap non-sensitive data from sessionStorage immediately (synchronous, zero latency)
  try {
    var raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) {
      var cached = JSON.parse(raw);
      // Only restore cacheable keys
      CACHEABLE.forEach(function(k){ if (cached[k] !== undefined) _data[k] = cached[k]; });
      _loaded = true;
    }
  } catch (e) {}

  function load(db) {
    if (_loaded) return Promise.resolve();
    if (_loadPromise) return _loadPromise;

    _loadPromise = db.collection('config').doc('admin').get()
      .then(function (doc) {
        if (doc.exists) {
          _data = doc.data();
          // Only cache non-sensitive fields in sessionStorage
          var safe = {};
          CACHEABLE.forEach(function(k){ if (_data[k] !== undefined) safe[k] = _data[k]; });
          try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(safe)); } catch (e) {}
        }
        _loaded = true;
      })
      .catch(function (err) {
        console.warn('DS_CONFIG: could not load —', err.message);
        _loaded = true;
      });

    return _loadPromise;
  }

  function isAdmin(email) {
    var emails = _data.adminEmails || [];
    return emails.indexOf(email) !== -1;
  }

  function get(key) {
    return _data[key] || '';
  }

  return { load: load, isAdmin: isAdmin, get: get };
})();
