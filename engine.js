/* ============================================================
   engine.js — движок визуальной новеллы
   ============================================================ */
(function () {
  'use strict';

  var STORY = window.STORY || {};
  var ENDINGS = window.ENDINGS || {};
  var ATLAS = window.ATLAS || { worlds: [], echoes: [] };
  var Art = window.WorldArt;
  var Portraits = window.Portraits;

  var MAX_CLUES = 14;
  var MAX_SPARKS = 13;

  function $(id) { return document.getElementById(id); }

  var app = $('app');
  var bgA = $('bgA'), bgB = $('bgB');
  var particlesEl = $('particles');
  var hud = $('hud'), stage = $('stage');
  var hudChapter = $('hud-chapter'), hudSparks = $('hud-sparks');
  var speakerEl = $('speaker'), speakerSource = $('speaker-source'), textEl = $('text');
  var advanceEl = $('advance'), dialogueEl = $('dialogue');
  var choicesEl = $('choices');
  var chapterCard = $('chapter-card'), ccNum = $('cc-num'), ccTitle = $('cc-title'), ccSource = $('cc-source');
  var sparkFlash = $('spark-flash'), sparkLabel = $('spark-label');
  var toastEl = $('toast');
  var titleScreen = $('title-screen'), titleBg = $('title-bg'), titleProgress = $('title-progress');
  var visionFrame = $('vision-frame');
  var endingScreen = $('ending-screen'), endingBg = $('ending-bg');
  var endingTitle = $('ending-title'), endingText = $('ending-text'), endingQuote = $('ending-quote'), endingStats = $('ending-stats');
  var logList = $('log-list');
  var atlasGrid = $('atlas-grid'), atlasEcho = $('atlas-echo'), atlasNote = $('atlas-note');
  var btnStart = $('btn-start'), btnContinue = $('btn-continue');
  var btnAuto = $('btn-auto'), btnSound = $('btn-sound'), btnVoice = $('btn-voice');
  var pauseNote = document.querySelector('.pause-note');

  /* ---------------- хранилище ---------------- */
  var KEY_SAVE = 'vmw.save.v2';
  var KEY_SET = 'vmw.settings.v1';
  var KEY_END = 'vmw.endings.v1';
  var KEY_ATLAS = 'vmw.atlas.v1';

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function removeKey(key) {
    try { localStorage.removeItem(key); } catch (e) {}
  }

  var settings = readJSON(KEY_SET, { sound: true, auto: false, voice: false });
  if (!settings || typeof settings !== 'object') settings = { sound: true, auto: false, voice: false };
  if (typeof settings.sound !== 'boolean') settings.sound = true;
  if (typeof settings.auto !== 'boolean') settings.auto = false;
  if (typeof settings.voice !== 'boolean') settings.voice = false;

  var atlasVisited = readJSON(KEY_ATLAS, []);
  if (!Array.isArray(atlasVisited)) atlasVisited = [];
  var unlockedEndings = readJSON(KEY_END, []);
  if (!Array.isArray(unlockedEndings)) unlockedEndings = [];

  /* ---------------- состояние ---------------- */
  var S = {
    started: false,
    ended: false,
    scene: null,
    index: 0,
    stats: { wind: 0, root: 0 },
    clues: 0,
    flags: {},
    visited: [],
    log: [],
    cast: [],
    auto: settings.auto,
    sound: settings.sound,
    voice: settings.voice,
    typing: false,
    fullText: '',
    lastText: '',
    lastWho: 'narr',
    afterReply: null,
    choiceOpen: false,
    sparkPending: false,
    cardBlocking: false,
    modalOpen: false,
    endingId: null,
    lastBg: null
  };

  var typeTimer = null, autoTimer = null, sparkTimer = null, toastTimer = null, cardTimer = null, cardBegin = null;
  var activeBgEl = bgA, currentBg = null;

  /* ---------------- звук ---------------- */
  var Sound = (function () {
    var ctx = null, master = null, windGain = null, drones = [];
    var enabled = true, currentWorld = 'interworld', chimeTimer = null;
    var scale = [440, 493.88, 554.37, 659.25, 739.99, 880, 987.77];

    var ROOTS = {
      interworld: 110, conan: 98, cagliostro: 123.47, nausicaa: 103.83,
      laputa: 130.81, totoro: 87.31, kiki: 116.54, porco: 92.5,
      mononoke: 82.41, spirited: 73.42, howl: 110, ponyo: 146.83,
      windrises: 98, heron: 87.31, glass: 65.41, dawn: 130.81,
      free: 146.83, home: 116.54, secret: 98, study: 110
    };

    /* Оригинальные темы, вдохновлённые настроением миров.
       Это не записи из фильмов: каждая тема синтезируется здесь и сейчас. */
    var MUSIC = {
      interworld: { tick: 2.6, wave: 'sine', notes: [[0, 2], [7, 2], [12, 3], [7, 2], [-5, 3], [0, 2]], vol: .05 },
      conan: { tick: 1.9, wave: 'triangle', notes: [[0, 1], [4, 1], [7, 1], [12, 2], [7, 1], [4, 1], [0, 2]], vol: .055 },
      cagliostro: { tick: 1.7, wave: 'triangle', notes: [[0, 1], [3, 1], [7, 1], [10, 2], [7, 1], [3, 1], [0, 2]], vol: .055 },
      nausicaa: { tick: 2.8, wave: 'sine', notes: [[0, 3], [5, 2], [7, 2], [12, 3], [10, 2], [7, 3]], vol: .05 },
      laputa: { tick: 2.2, wave: 'triangle', notes: [[0, 2], [4, 2], [7, 3], [11, 2], [14, 3], [7, 2]], vol: .055 },
      totoro: { tick: 2.4, wave: 'sine', notes: [[0, 2], [2, 2], [7, 2], [9, 2], [12, 3], [7, 2]], vol: .05 },
      kiki: { tick: 1.8, wave: 'triangle', notes: [[0, 1], [4, 1], [7, 1], [9, 2], [7, 1], [4, 1], [0, 2]], vol: .055 },
      porco: { tick: 2.5, wave: 'sine', notes: [[0, 3], [3, 2], [7, 2], [10, 3], [7, 2], [3, 3]], vol: .05 },
      mononoke: { tick: 2.9, wave: 'sawtooth', notes: [[0, 2], [-2, 2], [3, 3], [5, 2], [7, 3], [3, 2]], vol: .045 },
      spirited: { tick: 2.7, wave: 'sine', notes: [[0, 2], [2, 2], [5, 3], [7, 2], [10, 3], [7, 2]], vol: .05 },
      howl: { tick: 2.0, wave: 'triangle', notes: [[0, 2], [7, 2], [9, 2], [12, 3], [9, 2], [7, 3]], vol: .055 },
      ponyo: { tick: 1.6, wave: 'triangle', notes: [[0, 1], [4, 1], [7, 1], [12, 1], [9, 1], [7, 1], [4, 2]], vol: .055 },
      windrises: { tick: 2.4, wave: 'sine', notes: [[0, 3], [4, 2], [7, 2], [11, 3], [7, 2], [4, 3]], vol: .05 },
      heron: { tick: 3.0, wave: 'sine', notes: [[0, 3], [-5, 2], [2, 3], [7, 2], [3, 3], [-2, 2]], vol: .045 },
      glass: { tick: 3.4, wave: 'sine', notes: [[0, 4], [1, 2], [7, 3], [6, 3], [-5, 4]], vol: .04 },
      study: { tick: 2.8, wave: 'sine', notes: [[0, 2], [4, 2], [7, 3], [12, 2], [9, 2], [4, 3]], vol: .05 },
      dawn: { tick: 2.4, wave: 'triangle', notes: [[0, 2], [4, 2], [7, 3], [12, 2], [7, 3]], vol: .05 },
      free: { tick: 1.8, wave: 'triangle', notes: [[0, 1], [7, 1], [12, 2], [9, 1], [7, 1], [12, 2]], vol: .05 },
      home: { tick: 2.6, wave: 'sine', notes: [[0, 2], [4, 2], [7, 2], [5, 2], [4, 3]], vol: .05 },
      secret: { tick: 2.5, wave: 'triangle', notes: [[0, 2], [7, 2], [11, 3], [14, 2], [7, 3]], vol: .05 }
    };

    var themeTimer = null, themeGain = null, themeStep = 0, themeWorld = 'interworld';

    function stopTheme() {
      if (themeTimer) clearInterval(themeTimer);
      themeTimer = null;
    }

    function noteTone(freq, when, dur, type, vol) {
      if (!ctx || !themeGain) return;
      var o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, when);
      f.type = 'lowpass';
      f.frequency.setValueAtTime(type === 'sawtooth' ? 1400 : 2400, when);
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), when + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      o.connect(f); f.connect(g); g.connect(themeGain);
      o.start(when); o.stop(when + dur + 0.12);
    }

    function startTheme(key) {
      themeWorld = key;
      if (!ctx) return;
      stopTheme();
      var m = MUSIC[key] || MUSIC.interworld;
      themeStep = 0;
      var root = ROOTS[key] || 110;
      themeTimer = setInterval(function () {
        if (!ctx || !enabled) return;
        var t = ctx.currentTime + 0.05;
        var n = m.notes[themeStep % m.notes.length];
        var freq = root * 2 * Math.pow(2, n[0] / 12);
        noteTone(freq, t, Math.max(0.5, n[1] * m.tick * 0.62), m.wave, m.vol);
        if (themeStep % 4 === 0) {
          [0, 7, 12].forEach(function (off, i) {
            noteTone(root * 2 * Math.pow(2, off / 12), t + i * 0.09, 3.8, 'sine', 0.026);
          });
        }
        themeStep++;
      }, m.tick * 1000);
    }

    function init() {
      if (ctx) return;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try { ctx = new AC(); } catch (e) { return; }
      master = ctx.createGain();
      master.gain.value = enabled ? 0.5 : 0;
      master.connect(ctx.destination);

      themeGain = ctx.createGain();
      themeGain.gain.value = 0.4;
      themeGain.connect(master);
      var delay = ctx.createDelay(1.2);
      delay.delayTime.value = 0.34;
      var feedback = ctx.createGain();
      feedback.gain.value = 0.18;
      var wet = ctx.createGain();
      wet.gain.value = 0.16;
      themeGain.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wet);
      wet.connect(master);

      var len = Math.floor(ctx.sampleRate * 2), buf = ctx.createBuffer(1, len, ctx.sampleRate), data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      var src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380; lp.Q.value = 0.55;
      windGain = ctx.createGain(); windGain.gain.value = 0.03;
      src.connect(lp); lp.connect(windGain); windGain.connect(master); src.start();
      var lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
      var lg = ctx.createGain(); lg.gain.value = 150;
      lfo.connect(lg); lg.connect(lp.frequency); lfo.start();

      [110, 164.81].forEach(function (f, idx) {
        var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
        var g = ctx.createGain(); g.gain.value = idx ? 0.010 : 0.015;
        o.connect(g); g.connect(master); o.start();
        drones.push({ o: o, g: g, base: f === 110 ? 1 : 1.5 });
      });

      chimeTimer = setInterval(function () { if (enabled) chime(); }, 12000);
    }

    function start() {
      init();
      if (!ctx) return;
      if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
      master.gain.setTargetAtTime(enabled ? 0.5 : 0, ctx.currentTime, 0.4);
      if (!themeTimer) startTheme(currentWorld);
    }

    function setEnabled(v) {
      enabled = !!v;
      if (ctx && master) master.gain.setTargetAtTime(enabled ? 0.5 : 0, ctx.currentTime, 0.25);
    }

    function bell(freq, when, vol, dur) {
      if (!ctx) return;
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(vol, when + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      o.connect(g); g.connect(master);
      o.start(when); o.stop(when + dur + 0.1);
    }

    function chime() {
      if (!ctx) return;
      var t = ctx.currentTime + 0.05;
      var f = scale[Math.floor(Math.random() * scale.length)];
      bell(f, t, 0.026, 3.4);
      if (Math.random() > 0.55) bell(f * 2, t + 0.22, 0.012, 2.4);
    }

    function world(key) {
      currentWorld = key;
      if (!ctx) return;
      var root = ROOTS[key] || 110;
      drones.forEach(function (d, i) {
        var target = root * (i === 1 ? 1.5 : 1);
        d.o.frequency.setTargetAtTime(target, ctx.currentTime, 1.5);
      });
      if (windGain) {
        var g = (key === 'mononoke' || key === 'heron' || key === 'glass') ? 0.022 : (key === 'ponyo' || key === 'free') ? 0.05 : 0.034;
        windGain.gain.setTargetAtTime(g, ctx.currentTime, 1.2);
      }
      startTheme(key);
    }

    function spark() {
      if (!ctx) return;
      var t = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { bell(f, t + i * 0.085, 0.05, 2.1); });
    }

    function clue() {
      if (!ctx) return;
      var t = ctx.currentTime;
      bell(880, t, 0.03, 1.6); bell(1174.66, t + 0.12, 0.02, 1.8);
    }

    function click() {
      if (!ctx) return;
      bell(660, ctx.currentTime, 0.008, 0.35);
    }

    function ending() {
      if (!ctx) return;
      var t = ctx.currentTime;
      [392, 523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        bell(f, t + i * 0.16, 0.045, 3.6);
      });
    }

    return { start: start, setEnabled: setEnabled, world: world, spark: spark, clue: clue, click: click, ending: ending };
  })();

  /* ---------------- голос ---------------- */
  var VOICE_PROFILES = {
    narr: [0.92, 0.9], mio: [1.12, 0.96], pyrh: [1.7, 1.06], curator: [0.65, 0.78],
    conan: [0.95, 1.0], lana: [1.3, 0.94], lupin: [0.88, 1.04], clarisse: [1.34, 0.9],
    nausicaa: [1.06, 0.93], asbel: [0.95, 0.96], pazu: [1.05, 1.0], sheeta: [1.24, 0.92],
    satsuki: [1.26, 0.96], mei: [1.5, 1.06], totoro: [0.62, 0.68], kiki: [1.1, 0.98],
    jiji: [1.45, 1.05], porco: [0.72, 0.84], fio: [1.2, 1.0], san: [0.96, 0.9],
    ashitaka: [0.84, 0.9], chihiro: [1.32, 0.95], haku: [0.94, 0.9], sophie: [1.0, 0.9],
    howl: [0.9, 0.95], calcifer: [1.3, 0.95], sosuke: [1.38, 1.0], ponyo: [1.58, 1.08],
    jiro: [0.88, 0.9], mahito: [1.05, 0.92], heron: [0.78, 0.84],
    eboshi: [0.95, 0.9], yubaba: [0.7, 0.8],
    dreamer: [1.06, 0.94], oldman: [0.74, 0.84], wife: [1.18, 0.9]
  };

  var Voice = {
    enabled: false,
    voice: null,
    supported: ('speechSynthesis' in window) && ('SpeechSynthesisUtterance' in window),
    load: function () {
      if (!this.supported) return;
      try {
        var voices = window.speechSynthesis.getVoices() || [];
        var ru = voices.filter(function (v) { return /^ru/i.test(v.lang) || /russian|русск/i.test(v.name); });
        this.voice = ru[0] || null;
      } catch (e) { this.voice = null; }
    },
    speak: function (text, who) {
      if (!this.enabled || !this.supported || !text) return;
      try {
        window.speechSynthesis.cancel();
        var clean = String(text).replace(/[«»]/g, ' ').replace(/—/g, ', ').replace(/\s+/g, ' ').trim();
        if (!clean) return;
        var u = new SpeechSynthesisUtterance(clean);
        var p = VOICE_PROFILES[who] || VOICE_PROFILES.narr;
        u.lang = 'ru-RU';
        if (this.voice) u.voice = this.voice;
        u.pitch = p[0];
        u.rate = p[1];
        u.volume = 1;
        window.speechSynthesis.speak(u);
      } catch (e) {}
    },
    stop: function () {
      if (!this.supported) return;
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  };
  if (Voice.supported) {
    Voice.load();
    try { window.speechSynthesis.onvoiceschanged = function () { Voice.load(); }; } catch (e) {}
  }
  Voice.enabled = !!settings.voice;

  /* ---------------- утилиты ---------------- */
  function toast(text, ms) {
    toastEl.textContent = text;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, ms || 2300);
  }

  function cancelAuto() {
    clearTimeout(autoTimer);
    autoTimer = null;
  }

  function scheduleAuto() {
    cancelAuto();
    if (!S.auto || !S.started || S.ended || S.choiceOpen || S.sparkPending || S.modalOpen || S.cardBlocking || S.typing) return;
    var delay = Math.min(11000, 1700 + S.fullText.length * 32);
    if (Voice.enabled) delay += Math.min(6000, S.fullText.length * 22);
    autoTimer = setTimeout(function () {
      if (S.auto && !S.modalOpen) advance();
    }, delay);
  }

  function updateHud() {
    var sc = S.scene ? STORY[S.scene] : null;
    hudChapter.textContent = sc ? sc.chapter + ' · ' + sc.title : '';
    hudSparks.textContent = 'Искры ' + S.visited.length + '/' + MAX_SPARKS + ' · Осколки ' + S.clues + '/' + MAX_CLUES;
  }

  function refreshToggles() {
    if (btnAuto) {
      btnAuto.classList.toggle('on', !!S.auto);
      btnAuto.setAttribute('aria-pressed', S.auto ? 'true' : 'false');
    }
    if (btnSound) {
      btnSound.classList.toggle('on', !!S.sound);
      btnSound.setAttribute('aria-pressed', S.sound ? 'true' : 'false');
    }
    if (btnVoice) {
      btnVoice.classList.toggle('on', !!Voice.enabled);
      btnVoice.setAttribute('aria-pressed', Voice.enabled ? 'true' : 'false');
    }
  }

  function saveSettings() {
    settings.sound = S.sound;
    settings.auto = S.auto;
    settings.voice = Voice.enabled;
    writeJSON(KEY_SET, settings);
  }

  function saveGame() {
    if (!S.scene) return;
    var data = {
      v: 2,
      scene: S.scene,
      index: S.index,
      stats: { wind: S.stats.wind, root: S.stats.root },
      clues: S.clues,
      flags: S.flags,
      visited: S.visited.slice(),
      log: S.log.slice(-220),
      ended: !!S.ended,
      endingId: S.endingId || null
    };
    writeJSON(KEY_SAVE, data);
  }

  function loadSave() {
    var d = readJSON(KEY_SAVE, null);
    if (!d || !d.scene || !STORY[d.scene]) return null;
    return d;
  }

  function addLog(who, text, isNarr) {
    S.log.push({ who: who || '', text: text || '', narr: !!isNarr });
    if (S.log.length > 260) S.log.splice(0, S.log.length - 260);
  }

  function markAtlas(world) {
    if (!world) return;
    if (atlasVisited.indexOf(world) < 0) {
      atlasVisited.push(world);
      writeJSON(KEY_ATLAS, atlasVisited);
    }
  }

  function unlockEnding(id) {
    if (!id) return;
    if (unlockedEndings.indexOf(id) < 0) {
      unlockedEndings.push(id);
      writeJSON(KEY_END, unlockedEndings);
    }
  }

  /* ---------------- фон и портреты ---------------- */
  function setBg(key) {
    if (!key || key === currentBg) return;
    var next = activeBgEl === bgA ? bgB : bgA;
    Art.applyBackground(next, key);
    next.classList.add('active');
    activeBgEl.classList.remove('active');
    activeBgEl = next;
    currentBg = key;
    S.lastBg = key;
    Art.spawnParticles(particlesEl, key);
    Sound.world(key);
  }

  function setCast(list, speaker, mood) {
    list = (list || []).filter(function (id) { return Portraits.has(id); }).slice(0, 2);
    var same = list.length === S.cast.length && list.every(function (id, i) { return S.cast[i] === id; });
    if (same) { highlightCast(speaker); return; }
    S.cast = list.slice();
    for (var i = 0; i < 2; i++) {
      var slot = $('slot-' + i);
      var id = list[i];
      slot.className = 'char-slot ' + (i === 0 ? 'left' : 'right') + (list.length === 1 ? ' solo' : '');
      slot.dataset.char = '';
      slot.dataset.mood = '';
      slot.innerHTML = '';
      if (!id) continue;
      slot.dataset.char = id;
      var m = (id === speaker && mood) ? mood : 'neutral';
      slot.dataset.mood = m;
      slot.innerHTML = Portraits.render(id, m);
      (function (el) {
        requestAnimationFrame(function () { el.classList.add('on'); });
      })(slot);
    }
    highlightCast(speaker);
  }

  function highlightCast(speaker) {
    for (var i = 0; i < S.cast.length; i++) {
      var slot = $('slot-' + i);
      if (!slot) continue;
      var dim = speaker && S.cast.indexOf(speaker) >= 0 && S.cast[i] !== speaker;
      slot.classList.toggle('dimmed', !!dim);
    }
  }

  function updatePortraits(speaker, mood) {
    if (!speaker) { highlightCast(null); return; }
    var inCast = S.cast.indexOf(speaker) >= 0;
    if (!inCast) { highlightCast(null); return; }
    S.cast.forEach(function (id, i) {
      if (id !== speaker) return;
      var slot = $('slot-' + i);
      if (!slot) return;
      var want = mood || 'neutral';
      if (slot.dataset.mood !== want) {
        slot.innerHTML = Portraits.render(id, want);
        slot.dataset.mood = want;
      }
    });
    highlightCast(speaker);
  }

  /* ---------------- карточка главы ---------------- */
  function showChapterCard(sc) {
    ccNum.textContent = sc.chapter || '';
    ccTitle.textContent = sc.title || '';
    ccSource.textContent = sc.source || '';
    chapterCard.classList.remove('show');
    void chapterCard.offsetWidth;
    chapterCard.classList.add('show');
    S.cardBlocking = true;
    clearTimeout(cardTimer);
    cardBegin = function () {
      if (!S.cardBlocking) return;
      S.cardBlocking = false;
      chapterCard.classList.remove('show');
      clearTimeout(cardTimer);
      step();
    };
    cardTimer = setTimeout(cardBegin, 3100);
  }

  function hideChapterCard() {
    chapterCard.classList.remove('show');
    if (S.cardBlocking) {
      S.cardBlocking = false;
      clearTimeout(cardTimer);
      step();
    }
  }

  /* ---------------- переходы сцен ---------------- */
  function showVision(src) {
    if (!visionFrame) return;
    var img = visionFrame.querySelector('img');
    if (img && src && img.getAttribute('src') !== src) img.src = src;
    visionFrame.classList.add('show');
  }

  function hideVision() {
    if (visionFrame) visionFrame.classList.remove('show');
  }

  function playScene(id, opts) {
    hideVision();
    opts = opts || {};
    var sc = STORY[id];
    if (!sc) { console.warn('Нет сцены', id); return; }
    cancelAuto();
    S.scene = id;
    S.index = opts.index || 0;
    S.afterReply = null;
    S.choiceOpen = false;
    S.sparkPending = false;
    S.ended = false;
    S.endingId = null;
    choicesEl.classList.add('hidden');
    choicesEl.innerHTML = '';
    dialogueEl.classList.remove('hide-for-choice');
    setBg(sc.bg);
    setCast(sc.cast || []);
    updateHud();
    saveGame();
    if (opts.resume) {
      S.cardBlocking = false;
      chapterCard.classList.remove('show');
      step();
      return;
    }
    showChapterCard(sc);
  }

  function step() {
    if (!S.started || S.ended) return;
    var sc = STORY[S.scene];
    if (!sc) return;
    if (S.index >= sc.nodes.length) {
      if (sc.next) { playScene(sc.next); return; }
      return;
    }
    var node = sc.nodes[S.index];
    if (!node) return;
    if (node.t === 'cast') {
      setCast(node.cast, null, null);
      S.index++;
      step();
      return;
    }
    if (node.t === 'choice') { renderChoice(node); return; }
    if (node.t === 'spark') { doSpark(node); return; }
    if (node.t === 'ending') { showEnding(node.id || 'true'); return; }
    renderLine(node);
  }

  /* ---------------- реплики ---------------- */
  function renderLine(node) {
    var who = node.who || null;
    var isNarr = !who;
    var name = '', source = '', color = '#e6b464';
    if (who) {
      name = Portraits.nameOf(who) || who;
      source = Portraits.sourceOf(who) || '';
      color = Portraits.colorOf(who) || color;
    }
    speakerEl.textContent = isNarr ? '' : name;
    speakerEl.style.color = color;
    speakerSource.textContent = isNarr ? '' : source;

    if (node.cast) setCast(node.cast, who, node.mood);
    var groupVoice = false;
    for (var ci = 0; ci < S.cast.length; ci++) {
      var cc = Portraits.chars[S.cast[ci]];
      if (cc && cc.voices && cc.voices.indexOf(who) >= 0) { groupVoice = true; break; }
    }
    if (who && Portraits.has(who) && S.cast.indexOf(who) < 0 && !groupVoice) {
      var nextCast = S.cast.slice(0, 2);
      if (nextCast.length < 2) nextCast.push(who);
      else nextCast[1] = who;
      setCast(nextCast, who, node.mood);
    }
    if (node.bg) setBg(node.bg);
    if (node.vision) showVision(node.vision);
    updatePortraits(who, node.mood);

    addLog(name, node.text, isNarr);
    S.lastText = node.text;
    S.lastWho = who || 'narr';
    updateHud();
    saveGame();

    advanceEl.classList.add('typing');
    typeText(node.text, isNarr);
    if (Voice.enabled) Voice.speak(node.text, who || 'narr');
  }

  function typeText(text, isNarr) {
    clearInterval(typeTimer);
    S.fullText = text;
    S.typing = true;
    S.isNarr = isNarr;
    textEl.textContent = '';
    var i = 0;
    var speed = isNarr ? 13 : 17;
    typeTimer = setInterval(function () {
      i += Math.max(1, Math.round(28 / speed));
      if (i >= text.length) {
        textEl.textContent = text;
        finishTyping();
        return;
      }
      textEl.textContent = text.slice(0, i);
    }, speed);
  }

  function finishTyping() {
    clearInterval(typeTimer);
    typeTimer = null;
    S.typing = false;
    textEl.textContent = S.fullText;
    advanceEl.classList.remove('typing');
    scheduleAuto();
  }

  /* ---------------- выбор ---------------- */
  function renderChoice(node) {
    S.choiceOpen = true;
    dialogueEl.classList.add('hide-for-choice');
    cancelAuto();
    speakerEl.textContent = '';
    speakerSource.textContent = '';
    textEl.textContent = node.prompt || 'Что ты выберешь?';
    S.fullText = textEl.textContent;
    S.typing = false;
    advanceEl.classList.add('typing');
    addLog('', node.prompt || 'Выбор', true);
    saveGame();

    choicesEl.innerHTML = '';
    var head = document.createElement('div');
    head.className = 'choice-prompt';
    head.textContent = node.prompt || 'Что ты выберешь?';
    choicesEl.appendChild(head);
    var list = (node.options || []).filter(function (o) {
      return !o.requiresClues || S.clues >= o.requiresClues;
    });
    list.forEach(function (opt, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'choice' + (opt.clue ? ' choice-whisper' : '');
      b.style.animationDelay = (i * 70) + 'ms';
      var key = String.fromCharCode(65 + i);
      b.innerHTML = '<span class="choice-key">' + key + '</span>' +
        '<span class="choice-main"><span class="choice-text"></span>' +
        (opt.hint ? '<span class="choice-hint">' + opt.hint + '</span>' : '') + '</span>';
      b.querySelector('.choice-text').textContent = opt.text;
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        choose(opt);
      });
      choicesEl.appendChild(b);
    });
    choicesEl.classList.remove('hidden');
    var first = choicesEl.querySelector('.choice');
    if (first && window.matchMedia('(min-width: 900px)').matches) first.focus();
  }

  function choose(opt) {
    S.choiceOpen = false;
    dialogueEl.classList.remove('hide-for-choice');
    choicesEl.classList.add('hidden');
    choicesEl.innerHTML = '';
    advanceEl.classList.remove('typing');
    Sound.click();

    if (opt.wind) S.stats.wind += opt.wind;
    if (opt.root) S.stats.root += opt.root;
    if (opt.flag) S.flags[opt.flag] = true;
    if (opt.clue) {
      S.clues += opt.clue;
      Sound.clue();
      toast('Осколок памяти · ' + S.clues + '/' + MAX_CLUES, 2600);
    }
    addLog('Выбор', opt.text, true);

    if (opt.ending) {
      showEnding(resolveEnding(opt.ending));
      return;
    }

    saveGame();

    var after = function () {
      S.afterReply = null;
      if (opt.goto) { playScene(opt.goto); return; }
      step();
    };

    if (opt.reply) {
      S.index++;
      S.afterReply = after;
      saveGame();
      renderLine({
        t: 'say',
        who: opt.replyWho || 'mio',
        mood: opt.replyMood || 'soft',
        text: opt.reply
      });
    } else {
      after();
    }
  }

  /* ---------------- искры ---------------- */
  function worldTitle(id) {
    var w = (ATLAS.worlds || []).filter(function (x) { return x.id === id; })[0];
    return w ? w.title : '';
  }

  function doSpark(node) {
    S.sparkPending = true;
    cancelAuto();
    var sc = STORY[S.scene];
    if (S.visited.indexOf(node.world) < 0) S.visited.push(node.world);
    markAtlas(node.world);
    updateHud();
    saveGame();

    sparkLabel.textContent = node.label + (worldTitle(node.world) ? ' · ' + worldTitle(node.world) : '');
    sparkFlash.classList.remove('show');
    void sparkFlash.offsetWidth;
    sparkFlash.classList.add('show');
    Sound.spark();

    clearTimeout(sparkTimer);
    sparkTimer = setTimeout(finishSpark, 2850);
  }

  function finishSpark() {
    if (!S.sparkPending) return;
    clearTimeout(sparkTimer);
    sparkTimer = null;
    S.sparkPending = false;
    sparkFlash.classList.remove('show');
    S.index++;
    saveGame();
    step();
  }

  /* ---------------- концовки ---------------- */
  function resolveEnding(mode) {
    if (mode !== 'auto') return mode;
    var diff = Math.abs(S.stats.wind - S.stats.root);
    if (S.clues >= 4 && diff <= 12) return 'true';
    if (S.stats.wind > S.stats.root) return 'free';
    if (S.stats.root > S.stats.wind) return 'home';
    return S.clues >= 5 ? 'true' : 'home';
  }

  function showEnding(id) {
    hideVision();
    var e = ENDINGS[id] || ENDINGS.home;
    S.ended = true;
    S.started = false;
    S.endingId = e.id;
    cancelAuto();
    Voice.stop();
    clearInterval(typeTimer);
    clearTimeout(sparkTimer);
    sparkFlash.classList.remove('show');
    choicesEl.classList.add('hidden');

    unlockEnding(e.id);
    saveGame();

    Art.applyBackground(endingBg, e.bg);
    endingTitle.textContent = e.title;
    endingText.innerHTML = (e.text || []).map(function (p) { return '<p></p>'; }).join('');
    var ps = endingText.querySelectorAll('p');
    (e.text || []).forEach(function (txt, i) { if (ps[i]) ps[i].textContent = txt; });
    endingQuote.textContent = '«' + e.quote + '»';

    var chips = [
      e.tag,
      'Порыв: ' + S.stats.wind,
      'Корни: ' + S.stats.root,
      'Осколки: ' + S.clues + '/' + MAX_CLUES,
      'Миры: ' + S.visited.length + '/' + MAX_SPARKS
    ];
    endingStats.innerHTML = chips.map(function (t) { return '<span class="ending-stat">' + t + '</span>'; }).join('');

    hud.classList.add('hidden');
    stage.classList.add('hidden');
    titleScreen.classList.remove('active');
    chapterCard.classList.remove('show');
    endingScreen.classList.add('active');
    endingScreen.scrollTop = 0;
    app.classList.remove('title-mode');
    Sound.world(e.bg);
    Sound.ending();
    updateTitleProgress();
  }

  function hideEnding() {
    endingScreen.classList.remove('active');
  }

  /* ---------------- титул ---------------- */
  function updateTitleProgress() {
    var n = unlockedEndings.length;
    if (titleProgress) titleProgress.textContent = 'Концовки: ' + n + '/' + Object.keys(ENDINGS).length + ' · Миры: ' + atlasVisited.length + '/' + MAX_SPARKS;
    if (btnContinue) btnContinue.disabled = !loadSave();
  }

  function startNew() {
    closeAllModals();
    hideEnding();
    titleScreen.classList.remove('active');
    app.classList.remove('title-mode');
    hud.classList.remove('hidden');
    stage.classList.remove('hidden');

    S.started = true;
    S.ended = false;
    S.scene = null;
    S.index = 0;
    S.stats = { wind: 0, root: 0 };
    S.clues = 0;
    S.flags = {};
    S.visited = [];
    S.log = [];
    S.cast = [];
    S.afterReply = null;
    S.choiceOpen = false;
    S.sparkPending = false;
    S.cardBlocking = false;
    S.typing = false;
    S.lastText = '';
    S.lastWho = 'narr';
    S.endingId = null;
    clearInterval(typeTimer);
    clearTimeout(sparkTimer);
    clearTimeout(cardTimer);
    cancelAuto();
    Voice.stop();
    sparkFlash.classList.remove('show');
    choicesEl.classList.add('hidden');
    choicesEl.innerHTML = '';
    dialogueEl.classList.remove('hide-for-choice');
    $('slot-0').innerHTML = ''; $('slot-0').className = 'char-slot left';
    $('slot-1').innerHTML = ''; $('slot-1').className = 'char-slot right';
    Sound.start();
    Sound.setEnabled(S.sound);
    playScene('prologue');
    updateTitleProgress();
  }

  function resumeGame() {
    var d = loadSave();
    if (!d) { startNew(); return; }
    closeAllModals();
    hideEnding();
    titleScreen.classList.remove('active');
    app.classList.remove('title-mode');
    hud.classList.remove('hidden');
    stage.classList.remove('hidden');

    S.started = !d.ended;
    S.ended = !!d.ended;
    S.scene = d.scene;
    S.index = d.index || 0;
    S.stats = d.stats && typeof d.stats.wind === 'number' ? d.stats : { wind: 0, root: 0 };
    S.clues = d.clues || 0;
    S.flags = d.flags || {};
    S.visited = Array.isArray(d.visited) ? d.visited.slice() : [];
    S.log = Array.isArray(d.log) ? d.log.slice() : [];
    S.endingId = d.endingId || null;
    S.afterReply = null;
    S.choiceOpen = false;
    S.sparkPending = false;
    S.typing = false;
    S.cardBlocking = false;
    S.cast = [];
    S.visited.forEach(markAtlas);
    Sound.start();
    Sound.setEnabled(S.sound);

    if (d.ended && ENDINGS[d.endingId]) {
      showEnding(d.endingId);
      return;
    }
    playScene(d.scene, { resume: true, index: d.index || 0 });
  }

  function applyTitleArt() {
    if (!titleBg) return;
    titleBg.innerHTML = '<img class="title-art" src="assets/bg/menu-collage.webp" alt="" draggable="false">';
  }

  function showTitle() {
    hideVision();
    S.started = false;
    S.ended = false;
    cancelAuto();
    Voice.stop();
    clearInterval(typeTimer);
    clearTimeout(sparkTimer);
    clearTimeout(cardTimer);
    choicesEl.classList.add('hidden');
    chapterCard.classList.remove('show');
    sparkFlash.classList.remove('show');
    hideEnding();
    hud.classList.add('hidden');
    stage.classList.add('hidden');
    titleScreen.classList.add('active');
    app.classList.add('title-mode');
    applyTitleArt();
    Art.spawnParticles(particlesEl, 'interworld');
    Sound.world('interworld');
    updateTitleProgress();
    refreshToggles();
  }

  /* ---------------- модалки ---------------- */
  var modalZ = 90;

  function refreshModalState() {
    S.modalOpen = !!document.querySelector('.modal:not(.hidden)');
    if (!S.modalOpen) scheduleAuto();
    else cancelAuto();
  }

  function openModal(id) {
    var el = $(id);
    if (!el) return;
    el.style.zIndex = (++modalZ);
    el.classList.remove('hidden');
    refreshModalState();
  }

  function closeModal(id) {
    var el = $(id);
    if (!el) return;
    el.classList.add('hidden');
    refreshModalState();
  }

  function closeAllModals() {
    document.querySelectorAll('.modal').forEach(function (m) { m.classList.add('hidden'); });
    refreshModalState();
  }

  function renderLog() {
    if (!logList) return;
    if (!S.log.length) {
      logList.innerHTML = '<p class="log-empty">Пока тихо. Ветер ещё не принёс ни одной истории.</p>';
      return;
    }
    logList.innerHTML = '';
    S.log.forEach(function (e) {
      var d = document.createElement('div');
      d.className = 'log-entry';
      if (e.who || e.narr) {
        var w = document.createElement('span');
        w.className = 'log-who';
        w.textContent = e.narr ? (e.who || '···') : e.who;
        d.appendChild(w);
      }
      var t = document.createElement('div');
      t.className = 'log-text' + (e.narr ? ' narr' : '');
      t.textContent = e.text;
      d.appendChild(t);
      logList.appendChild(d);
    });
    logList.scrollTop = logList.scrollHeight;
  }

  function renderAtlas() {
    if (!atlasGrid) return;
    if (atlasNote) atlasNote.textContent = 'Открыто миров: ' + atlasVisited.length + '/' + MAX_SPARKS + '. Каждая история — дверь в чужое небо.';
    atlasGrid.innerHTML = (ATLAS.worlds || []).map(function (w) {
      var open = atlasVisited.indexOf(w.id) >= 0;
      return '<div class="atlas-item ' + (open ? 'visited' : 'locked') + '">' +
        (open ? '<span class="ai-spark"></span>' : '') +
        '<div class="ai-num">' + w.num + '</div>' +
        '<h4>' + (open ? w.title : 'Мир ещё не открыт') + '</h4>' +
        '<p>' + (open ? w.source : 'искра ждёт') + '</p>' +
        (open ? '<p>' + w.spark + '</p><p class="ai-desc">' + w.desc + '</p>' : '') +
        '</div>';
    }).join('');
    atlasEcho.innerHTML = (ATLAS.echoes || []).map(function (e) {
      return '<div class="echo-item"><strong>' + e.title + '</strong><span>' + e.note + '</span></div>';
    }).join('');
  }

  function updatePauseStats() {
    if (!pauseNote) return;
    pauseNote.textContent = 'Порыв ' + S.stats.wind + ' · Корни ' + S.stats.root + ' · Осколки ' + S.clues + '/' + MAX_CLUES + ' · Миры ' + S.visited.length + '/' + MAX_SPARKS;
  }

  /* ---------------- управление ---------------- */
  function advance() {
    if (!S.started || S.ended) return;
    if (S.modalOpen || S.cardBlocking) return;
    if (S.choiceOpen) return;
    if (S.sparkPending) { finishSpark(); return; }
    if (S.typing) { finishTyping(); return; }
    if (S.afterReply) {
      var f = S.afterReply;
      S.afterReply = null;
      f();
      return;
    }
    cancelAuto();
    S.index++;
    saveGame();
    step();
  }

  function bind(el, ev, fn) {
    if (el) el.addEventListener(ev, fn);
  }

  bind(stage, 'click', function (e) {
    if (e.target.closest('#choices')) return;
    advance();
  });
  bind(dialogueEl, 'keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); advance(); }
  });
  bind(chapterCard, 'click', hideChapterCard);
  bind(choicesEl, 'click', function (e) { e.stopPropagation(); });

  bind(btnStart, 'click', startNew);
  bind(btnContinue, 'click', resumeGame);

  bind($('btn-atlas'), 'click', function () { renderAtlas(); openModal('atlas-modal'); });
  bind($('btn-about'), 'click', function () { openModal('about-modal'); });
  bind(btnAuto, 'click', function () {
    S.auto = !S.auto;
    refreshToggles();
    saveSettings();
    if (S.auto) { scheduleAuto(); toast('Авточтение включено'); }
    else { cancelAuto(); toast('Авточтение выключено'); }
  });
  bind(btnSound, 'click', function () {
    S.sound = !S.sound;
    Sound.start();
    Sound.setEnabled(S.sound);
    refreshToggles();
    saveSettings();
    toast(S.sound ? 'Ветер и музыка включены' : 'Звук выключен');
  });
  bind(btnVoice, 'click', function () {
    if (!Voice.supported) { toast('Этот браузер не поддерживает озвучку'); return; }
    Voice.enabled = !Voice.enabled;
    if (Voice.enabled) {
      Voice.load();
      refreshToggles();
      saveSettings();
      toast(Voice.voice ? 'Озвучка включена · ' + Voice.voice.name : 'Озвучка включена · системный голос', 2800);
      if (S.started && !S.ended && S.lastText) Voice.speak(S.lastText, S.lastWho);
    } else {
      Voice.stop();
      refreshToggles();
      saveSettings();
      toast('Озвучка выключена');
    }
  });
  bind($('btn-log'), 'click', function () { renderLog(); openModal('log-modal'); });
  bind($('btn-menu'), 'click', function () { updatePauseStats(); openModal('pause-modal'); });

  bind($('btn-ending-again'), 'click', startNew);
  bind($('btn-ending-atlas'), 'click', function () { renderAtlas(); openModal('atlas-modal'); });
  bind($('btn-ending-title'), 'click', showTitle);
  bind($('btn-ending-exit'), 'click', showTitle);
  bind($('btn-pause-atlas'), 'click', function () { renderAtlas(); openModal('atlas-modal'); });
  bind($('btn-pause-about'), 'click', function () { openModal('about-modal'); });
  bind($('btn-pause-title'), 'click', function () { closeAllModals(); showTitle(); });

  document.querySelectorAll('[data-close]').forEach(function (b) {
    b.addEventListener('click', function () { closeModal(b.getAttribute('data-close')); });
  });
  document.querySelectorAll('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) {
      if (e.target === m) m.classList.add('hidden'), refreshModalState();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var open = Array.prototype.slice.call(document.querySelectorAll('.modal:not(.hidden)'));
      if (open.length) { open[open.length - 1].classList.add('hidden'); refreshModalState(); return; }
      if (S.started && !S.ended) { updatePauseStats(); openModal('pause-modal'); return; }
    }
    if (e.key === ' ' || e.key === 'Enter') {
      if (S.modalOpen) return;
      if (e.target && (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT')) return;
      e.preventDefault();
      advance();
    }
    if (e.key === 'ArrowRight') {
      if (!S.modalOpen) advance();
    }
    if (S.choiceOpen && /^[1-9]$/.test(e.key)) {
      var idx = parseInt(e.key, 10) - 1;
      var btn = choicesEl.querySelectorAll('.choice')[idx];
      if (btn) btn.click();
    }
  });

  document.addEventListener('pointerdown', function () { Sound.start(); }, { passive: true });

  /* ---------------- старт ---------------- */
  applyTitleArt();
  Art.spawnParticles(particlesEl, 'interworld');
  app.classList.add('title-mode');
  Sound.setEnabled(S.sound);
  refreshToggles();
  updateTitleProgress();
  Art.spawnParticles(particlesEl, 'interworld');

  // экспорт для отладки
  window.__VNW = { state: S, story: STORY, endings: ENDINGS, showEnding: showEnding, playScene: playScene, startNew: startNew };

  /* мягкий отладочный переход: ?scene=kiki&at=3 или ?ending=true */
  try {
    var q = new URLSearchParams(window.location.search);
    var dbgScene = q.get('scene');
    var dbgEnding = q.get('ending');
    if (dbgEnding && ENDINGS[dbgEnding]) {
      startNew();
      showEnding(dbgEnding);
    } else if (dbgScene && STORY[dbgScene]) {
      startNew();
      var at = parseInt(q.get('at') || '0', 10) || 0;
      playScene(dbgScene, { resume: true, index: at });
    }
  } catch (e) {}

})();
