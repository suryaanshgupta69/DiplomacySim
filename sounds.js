(function () {
  var storageKey = 'diplomacySimSoundMuted';
  var muted = readMuted();
  var ctx = null;

  function readMuted() {
    try {
      return window.localStorage &&
        window.localStorage.getItem(storageKey) === 'true';
    } catch (err) {
      return false;
    }
  }

  function saveMuted(value) {
    try {
      if (window.localStorage) {
        window.localStorage.setItem(storageKey, value ? 'true' : 'false');
      }
    } catch (err) {
      // Sound preferences are optional; ignore private-mode storage failures.
    }
  }

  function ensureContext() {
    if (muted) return null;
    if (!ctx) {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      ctx = new AudioContext();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, duration, type, gain, delay) {
    var audio = ensureContext();
    if (!audio) return;

    var start = audio.currentTime + (delay || 0);
    var osc = audio.createOscillator();
    var vol = audio.createGain();

    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, start);
    vol.gain.setValueAtTime(0.0001, start);
    vol.gain.exponentialRampToValueAtTime(gain || 0.025, start + 0.012);
    vol.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(vol);
    vol.connect(audio.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  function play(name) {
    if (muted) return;
    if (name === 'nav') {
      tone(220, 0.08, 'triangle', 0.018, 0);
      tone(330, 0.1, 'triangle', 0.015, 0.045);
      return;
    }
    if (name === 'select') {
      tone(520, 0.05, 'sine', 0.018, 0);
      tone(390, 0.08, 'sine', 0.014, 0.035);
      return;
    }
    if (name === 'submit') {
      tone(196, 0.08, 'triangle', 0.02, 0);
      tone(294, 0.09, 'triangle', 0.02, 0.055);
      tone(392, 0.12, 'triangle', 0.018, 0.11);
      return;
    }
    if (name === 'toggle') {
      tone(460, 0.045, 'square', 0.01, 0);
      return;
    }
    if (name === 'tick') {
      tone(880, 0.04, 'square', 0.008, 0);
      return;
    }
    if (name === 'celebrate') {
      tone(523, 0.1, 'sine', 0.025, 0);
      tone(659, 0.1, 'sine', 0.022, 0.08);
      tone(784, 0.15, 'sine', 0.02, 0.16);
      tone(1047, 0.2, 'sine', 0.018, 0.26);
      return;
    }
    if (name === 'fail') {
      tone(220, 0.15, 'triangle', 0.022, 0);
      tone(180, 0.2, 'triangle', 0.018, 0.12);
      return;
    }
    tone(300, 0.05, 'sine', 0.012, 0);
  }

  function addToggle() {
    if (document.querySelector('.sound-toggle')) return;
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'sound-toggle' + (muted ? ' is-muted' : '');
    button.setAttribute('aria-label', muted ? 'Turn sound effects on' : 'Turn sound effects off');
    button.title = muted ? 'Sound off' : 'Sound on';
    button.textContent = muted ? '🔇' : '🔊';
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      muted = !muted;
      saveMuted(muted);
      button.classList.toggle('is-muted', muted);
      button.textContent = muted ? '🔇' : '🔊';
      button.title = muted ? 'Sound off — click to enable' : 'Sound on — click to mute';
      button.setAttribute('aria-label', muted ? 'Turn sound effects on' : 'Turn sound effects off');
      if (!muted) play('toggle');
    });
    document.body.appendChild(button);
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || target.closest('.sound-toggle')) return;

    if (target.closest('.submit-directive, .submit-btn')) {
      play('submit');
      return;
    }
    if (target.closest('.option-card, .filter-btn, .tab-btn')) {
      play('select');
      return;
    }
    if (target.closest('.cat-card, .category-item, .cta-btn, .cta-btn-outline, .nav-strip a, .topbar a, .footer a, .google-btn')) {
      play('nav');
      return;
    }
    if (target.closest('button, a')) {
      play('toggle');
    }
  }, true);

  window.DiplomacySounds = { play: play };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addToggle);
  } else {
    addToggle();
  }
})();
