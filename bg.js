/* ============================================================
   bg.js — процедурные фоны «Ветер между мирами»
   Процедурные сцены рисуются в SVG/CSS; для миров добавлены
   официальные аниме-кадры как фоновые изображения.
   ============================================================ */
(function () {
  'use strict';

  var P = function (n) { return Math.round(n * 100) / 100; };

  function rngFor(seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------------- небо и атмосфера ---------------- */

  function stars(seed, n, color) {
    var r = rngFor(seed), s = '';
    for (var i = 0; i < n; i++) {
      var x = r() * 1600, y = r() * 560, rad = 0.45 + r() * 1.5, o = 0.2 + r() * 0.65;
      s += '<circle class="twinkle" cx="' + P(x) + '" cy="' + P(y) + '" r="' + P(rad) + '" fill="' + color +
        '" opacity="' + P(o) + '" style="animation-delay:' + P(r() * 4) + 's"/>';
    }
    return '<g>' + s + '</g>';
  }

  function clouds(seed, y, color, op, n, scale) {
    var r = rngFor(seed), s = '', i;
    y = y == null ? 0.2 : y; color = color || '#ffffff'; op = op == null ? 0.4 : op;
    n = n || 5; scale = scale || 1;
    for (i = 0; i < n; i++) {
      var x = 70 + r() * 1460, yy = y * 900 + (r() - 0.5) * 130, k = (0.55 + r() * 0.95) * scale;
      s += '<g class="cloud" style="--dur:' + P(55 + r() * 70) + 's;--dx:' + P(40 + r() * 90) + 'px" opacity="' +
        P(op * (0.55 + r() * 0.5)) + '">' +
        '<ellipse cx="' + P(x) + '" cy="' + P(yy) + '" rx="' + P(125 * k) + '" ry="' + P(34 * k) + '" fill="' + color + '"/>' +
        '<ellipse cx="' + P(x - 62 * k) + '" cy="' + P(yy + 9 * k) + '" rx="' + P(78 * k) + '" ry="' + P(26 * k) + '" fill="' + color + '"/>' +
        '<ellipse cx="' + P(x + 58 * k) + '" cy="' + P(yy + 7 * k) + '" rx="' + P(90 * k) + '" ry="' + P(24 * k) + '" fill="' + color + '"/>' +
        '<ellipse cx="' + P(x + 8 * k) + '" cy="' + P(yy - 19 * k) + '" rx="' + P(68 * k) + '" ry="' + P(30 * k) + '" fill="' + color + '"/>' +
        '</g>';
    }
    return '<g>' + s + '</g>';
  }

  function cloudSea(seed, baseY, color, op) {
    var r = rngFor(seed), s = '', i;
    for (i = 0; i < 26; i++) {
      var x = r() * 1680 - 40, y = baseY + (r() - 0.5) * 90, w = 110 + r() * 260, h = 28 + r() * 45;
      s += '<ellipse class="cloud" style="--dur:' + P(70 + r() * 60) + 's;--dx:' + P(20 + r() * 45) + 'px" cx="' + P(x) +
        '" cy="' + P(y) + '" rx="' + P(w) + '" ry="' + P(h) + '" fill="' + color + '" opacity="' + P(op * (0.35 + r() * 0.6)) + '"/>';
    }
    return '<g>' + s + '</g>';
  }

  function birds(seed, n, color, op) {
    var r = rngFor(seed), s = '', i;
    for (i = 0; i < (n || 6); i++) {
      var x = 90 + r() * 1420, y = 90 + r() * 400, k = 0.55 + r() * 1.15;
      s += '<path d="M' + P(x) + ' ' + P(y) + ' q' + P(7 * k) + ' ' + P(-8 * k) + ' ' + P(14 * k) + ' 0 q' +
        P(7 * k) + ' ' + P(-8 * k) + ' ' + P(14 * k) + ' 0" stroke="' + color + '" stroke-width="' +
        P(1.1 + k) + '" fill="none" stroke-linecap="round" opacity="' + P((op || 0.4) * (0.5 + r() * 0.5)) + '"/>';
    }
    return '<g>' + s + '</g>';
  }

  function sea(horizon, color, op, waveColor) {
    var y = horizon * 900, s = '', r = rngFor(91), i;
    s += '<rect x="0" y="' + P(y) + '" width="1600" height="' + P(900 - y) + '" fill="' + color + '" opacity="' + op + '"/>';
    for (i = 0; i < 26; i++) {
      var yy = y + 16 + i * ((900 - y) / 26), w = 70 + r() * 280, x = r() * 1600;
      s += '<path d="M' + P(x) + ' ' + P(yy) + ' q' + P(w / 2) + ' ' + P(-4 - r() * 7) + ' ' + P(w) + ' 0" stroke="' +
        (waveColor || 'rgba(255,255,255,.14)') + '" stroke-width="' + P(0.7 + r() * 1.2) + '" fill="none"/>';
    }
    return '<g>' + s + '</g>';
  }

  function hills(seed, baseY, amp, color, op, freq) {
    var r = rngFor(seed), p1 = r() * 6.28, p2 = r() * 6.28, p3 = r() * 6.28;
    freq = freq || 1;
    var d = 'M0 900 L0 ' + P(baseY), x, y;
    for (x = 0; x <= 1600; x += 32) {
      y = baseY - (Math.sin(x / 300 * freq + p1) * 0.5 + Math.sin(x / 113 * freq + p2) * 0.27 + Math.sin(x / 49 * freq + p3) * 0.11) * amp;
      d += ' L' + x + ' ' + P(y);
    }
    d += ' L1600 900 Z';
    return '<path d="' + d + '" fill="' + color + '" opacity="' + op + '"/>';
  }

  function mountains(seed, baseY, amp, color, op) {
    var r = rngFor(seed), d = 'M0 900 L0 ' + P(baseY), x = 0, y;
    while (x < 1600) {
      var w = 120 + r() * 190;
      y = baseY - amp * (0.45 + r() * 0.85);
      d += ' L' + P(x + w * 0.5) + ' ' + P(y) + ' L' + P(x + w) + ' ' + P(baseY);
      x += w;
    }
    d += ' L1600 900 Z';
    return '<path d="' + d + '" fill="' + color + '" opacity="' + op + '"/>';
  }

  function forest(seed, baseY, color, op, n, scale, glow) {
    var r = rngFor(seed), s = '', i;
    scale = scale || 1;
    for (i = 0; i < (n || 14); i++) {
      var x = r() * 1600, h = (130 + r() * 280) * scale, w = (46 + r() * 78) * scale, y = baseY + r() * 26;
      s += '<g opacity="' + P(0.62 + r() * 0.38) + '">' +
        '<rect x="' + P(x - 4 * scale) + '" y="' + P(y - h * 0.55) + '" width="' + P(8 * scale) + '" height="' + P(h * 0.57) + '" fill="' + color + '"/>' +
        '<ellipse cx="' + P(x) + '" cy="' + P(y - h * 0.64) + '" rx="' + P(w * 0.72) + '" ry="' + P(h * 0.29) + '" fill="' + color + '"/>' +
        '<ellipse cx="' + P(x - w * 0.34) + '" cy="' + P(y - h * 0.48) + '" rx="' + P(w * 0.46) + '" ry="' + P(h * 0.2) + '" fill="' + color + '"/>' +
        '<ellipse cx="' + P(x + w * 0.34) + '" cy="' + P(y - h * 0.5) + '" rx="' + P(w * 0.42) + '" ry="' + P(h * 0.18) + '" fill="' + color + '"/>' +
        '</g>';
    }
    if (glow) {
      s += '<circle cx="1090" cy="250" r="190" fill="' + glow + '" opacity=".12"/>';
      s += '<circle cx="1090" cy="250" r="100" fill="' + glow + '" opacity=".09"/>';
    }
    return '<g opacity="' + op + '">' + s + '</g>';
  }

  function fungi(seed, baseY, stem, cap, glow, n) {
    var r = rngFor(seed), s = '', i;
    for (i = 0; i < (n || 12); i++) {
      var x = r() * 1600, h = 120 + r() * 330, w = 30 + r() * 74;
      s += '<g opacity="' + P(0.6 + r() * 0.4) + '">' +
        '<path d="M' + P(x - 4) + ' ' + P(baseY) + ' q' + P(-8 + r() * 16) + ' ' + P(-h * 0.5) + ' ' + P(-2 + r() * 4) + ' ' + P(-h) +
        '" stroke="' + stem + '" stroke-width="' + P(7 + r() * 7) + '" fill="none" stroke-linecap="round"/>' +
        '<path d="M' + P(x - w) + ' ' + P(baseY - h) + ' q' + P(w) + ' ' + P(-h * 0.28) + ' ' + P(w * 2) + ' 0 q' + P(-w * 0.55) +
        ' ' + P(h * 0.14) + ' ' + P(-w * 2) + ' 0 Z" fill="' + cap + '" opacity=".9"/>' +
        '<ellipse cx="' + P(x) + '" cy="' + P(baseY - h - 6) + '" rx="' + P(w * 0.5) + '" ry="' + P(h * 0.07 + 4) + '" fill="' + glow + '" opacity=".18"/>' +
        '</g>';
    }
    return '<g>' + s + '</g>';
  }

  function grass(seed, baseY, color, n) {
    var r = rngFor(seed), s = '', i;
    for (i = 0; i < (n || 110); i++) {
      var x = r() * 1600, h = 16 + r() * 52, lean = (r() - 0.5) * 22;
      s += '<path class="sway" style="--dur:' + P(5 + r() * 6) + 's;animation-delay:-' + P(r() * 5) + 's" d="M' + P(x) + ' ' +
        P(baseY + 20) + ' q' + P(lean * 0.4) + ' ' + P(-h * 0.55) + ' ' + P(lean) + ' ' + P(-h) + '" stroke="' + color +
        '" stroke-width="' + P(1.2 + r() * 1.6) + '" fill="none" opacity="' + P(0.3 + r() * 0.55) + '"/>';
    }
    return '<g>' + s + '</g>';
  }

  /* ---------------- строения и транспорт ---------------- */

  function city(seed, baseY, color, op, opts) {
    opts = opts || {};
    var r = rngFor(seed), s = '', x = -40, warm = opts.warm || '#f2b46b', lit = opts.lit !== false;
    while (x < 1660) {
      var w = 42 + r() * 96, h = 70 + r() * (opts.tall || 190), y = baseY - h;
      s += '<rect x="' + P(x) + '" y="' + P(y) + '" width="' + P(w) + '" height="' + P(h + 60) + '" fill="' + color + '"/>';
      if (opts.euro) {
        s += '<path d="M' + P(x - 6) + ' ' + P(y) + ' L' + P(x + w / 2) + ' ' + P(y - 30 - r() * 40) + ' L' + P(x + w + 6) +
          ' ' + P(y) + ' Z" fill="' + color + '"/>';
      }
      if (lit) {
        var cols = Math.max(1, Math.floor(w / 28)), rows = Math.max(1, Math.floor(h / 42)), ci, ri;
        for (ri = 0; ri < rows; ri++) for (ci = 0; ci < cols; ci++) {
          if (r() > 0.62) {
            s += '<rect x="' + P(x + 9 + ci * 27) + '" y="' + P(y + 16 + ri * 40) + '" width="8" height="11" fill="' + warm +
              '" opacity="' + P(0.28 + r() * 0.6) + '"/>';
          }
        }
      }
      x += w + 6 + r() * 22;
    }
    return '<g opacity="' + op + '">' + s + '</g>';
  }

  function clockTower(x, baseY, s, color, warm) {
    var w = 86 * s, h = 340 * s, y = baseY - h;
    return '<g>' +
      '<rect x="' + P(x - w / 2) + '" y="' + P(y) + '" width="' + P(w) + '" height="' + P(h + 40) + '" fill="' + color + '"/>' +
      '<rect x="' + P(x - w * 0.62) + '" y="' + P(y + 150 * s) + '" width="' + P(w * 1.24) + '" height="' + P(h * 0.85) + '" fill="' + color + '"/>' +
      '<path d="M' + P(x - w * 0.7) + ' ' + P(y) + ' L' + P(x) + ' ' + P(y - 95 * s) + ' L' + P(x + w * 0.7) + ' ' + P(y) + ' Z" fill="' + color + '"/>' +
      '<circle cx="' + P(x) + '" cy="' + P(y + 74 * s) + '" r="' + P(29 * s) + '" fill="#f7e3b2" opacity=".82"/>' +
      '<circle cx="' + P(x) + '" cy="' + P(y + 74 * s) + '" r="' + P(29 * s) + '" fill="none" stroke="' + warm + '" stroke-width="' + P(5 * s) + '"/>' +
      '<path d="M' + P(x) + ' ' + P(y + 74 * s) + ' V' + P(y + 56 * s) + ' M' + P(x) + ' ' + P(y + 74 * s) + ' L' + P(x + 15 * s) + ' ' + P(y + 82 * s) +
      '" stroke="' + color + '" stroke-width="' + P(3 * s) + '" fill="none"/>' +
      '<rect x="' + P(x - 15 * s) + '" y="' + P(y + 200 * s) + '" width="' + P(30 * s) + '" height="' + P(54 * s) + '" rx="' + P(15 * s) + '" fill="' + warm + '" opacity=".55"/>' +
      '</g>';
  }

  function village(seed, baseY, color, warm, op) {
    var r = rngFor(seed), s = '', i;
    for (i = 0; i < 7; i++) {
      var x = 60 + i * 215 + r() * 50, w = 90 + r() * 60, h = 55 + r() * 45, y = baseY - h;
      s += '<g opacity="' + P(0.65 + r() * 0.35) + '">' +
        '<rect x="' + P(x) + '" y="' + P(y) + '" width="' + P(w) + '" height="' + P(h) + '" fill="' + color + '"/>' +
        '<path d="M' + P(x - 12) + ' ' + P(y) + ' L' + P(x + w / 2) + ' ' + P(y - 46 - r() * 20) + ' L' + P(x + w + 12) + ' ' + P(y) + ' Z" fill="' + color + '"/>' +
        '<rect x="' + P(x + w * 0.62) + '" y="' + P(y + h * 0.32) + '" width="' + P(w * 0.17) + '" height="' + P(h * 0.2) + '" fill="' + warm + '" opacity=".75"/>' +
        '</g>';
    }
    return '<g opacity="' + op + '">' + s + '</g>';
  }

  function bathhouse(x, baseY, s, dark, warm) {
    var y0 = baseY - 470 * s;
    return '<g>' +
      '<rect x="' + P(x - 300 * s) + '" y="' + P(y0 + 190 * s) + '" width="' + P(600 * s) + '" height="' + P(340 * s) + '" fill="' + dark + '"/>' +
      '<path d="M' + P(x - 340 * s) + ' ' + P(y0 + 200 * s) + ' q' + P(340 * s) + ' ' + P(-70 * s) + ' ' + P(680 * s) + ' 0' +
      ' l' + P(-40 * s) + ' ' + P(36 * s) + ' q' + P(-300 * s) + ' ' + P(-58 * s) + ' ' + P(-600 * s) + ' 0 Z" fill="' + dark + '"/>' +
      '<rect x="' + P(x - 230 * s) + '" y="' + P(y0 + 130 * s) + '" width="' + P(460 * s) + '" height="' + P(190 * s) + '" fill="' + dark + '"/>' +
      '<path d="M' + P(x - 270 * s) + ' ' + P(y0 + 140 * s) + ' q' + P(270 * s) + ' ' + P(-64 * s) + ' ' + P(540 * s) + ' 0' +
      ' l' + P(-34 * s) + ' ' + P(30 * s) + ' q' + P(-236 * s) + ' ' + P(-48 * s) + ' ' + P(-472 * s) + ' 0 Z" fill="' + dark + '"/>' +
      '<rect x="' + P(x - 150 * s) + '" y="' + P(y0 + 40 * s) + '" width="' + P(300 * s) + '" height="' + P(150 * s) + '" fill="' + dark + '"/>' +
      '<path d="M' + P(x - 196 * s) + ' ' + P(y0 + 52 * s) + ' q' + P(196 * s) + ' ' + P(-60 * s) + ' ' + P(392 * s) + ' 0' +
      ' l' + P(-30 * s) + ' ' + P(26 * s) + ' q' + P(-166 * s) + ' ' + P(-42 * s) + ' ' + P(-332 * s) + ' 0 Z" fill="' + dark + '"/>' +
      '<rect x="' + P(x - 78 * s) + '" y="' + P(y0 - 70 * s) + '" width="' + P(156 * s) + '" height="' + P(150 * s) + '" fill="' + dark + '"/>' +
      '<path d="M' + P(x - 128 * s) + ' ' + P(y0 - 56 * s) + ' q' + P(128 * s) + ' ' + P(-64 * s) + ' ' + P(256 * s) + ' 0' +
      ' l' + P(-26 * s) + ' ' + P(24 * s) + ' q' + P(-102 * s) + ' ' + P(-40 * s) + ' ' + P(-204 * s) + ' 0 Z" fill="' + dark + '"/>' +
      '<rect x="' + P(x - 5 * s) + '" y="' + P(y0 - 96 * s) + '" width="' + P(10 * s) + '" height="' + P(46 * s) + '" fill="' + dark + '"/>' +
      '<circle cx="' + P(x) + '" cy="' + P(y0 - 102 * s) + '" r="' + P(8 * s) + '" fill="' + warm + '" opacity=".85"/>' +
      lanterns(x, y0, s, warm) +
      windows(x, y0, s, warm) +
      '</g>';
  }

  function windows(x, y0, s, warm) {
    var out = '', row, col;
    for (row = 0; row < 4; row++) for (col = 0; col < 7; col++) {
      if ((row * 7 + col) % 5 === 0) continue;
      out += '<rect x="' + P(x - 210 * s + col * 64 * s) + '" y="' + P(y0 + 240 * s + row * 46 * s) + '" width="' +
        P(26 * s) + '" height="' + P(17 * s) + '" fill="' + warm + '" opacity="' + P(0.28 + ((row + col) % 4) * 0.12) + '"/>';
    }
    return out;
  }

  function lanterns(x, y0, s, warm) {
    var out = '', i;
    for (i = 0; i < 9; i++) {
      var lx = x - 260 * s + i * 65 * s, ly = y0 + 250 * s + (i % 3) * 42 * s;
      out += '<circle cx="' + P(lx) + '" cy="' + P(ly) + '" r="' + P(9 * s) + '" fill="' + warm + '" opacity=".75"/>' +
        '<circle cx="' + P(lx) + '" cy="' + P(ly) + '" r="' + P(22 * s) + '" fill="' + warm + '" opacity=".08"/>';
    }
    return out;
  }

  function movingCastle(x, y, s, dark, warm) {
    return '<g class="float" style="--dur:11s;--dy:-10px">' +
      '<path d="M' + P(x - 230 * s) + ' ' + P(y + 250 * s) + ' L' + P(x - 190 * s) + ' ' + P(y + 60 * s) +
      ' L' + P(x - 120 * s) + ' ' + P(y + 30 * s) + ' L' + P(x - 150 * s) + ' ' + P(y - 60 * s) +
      ' L' + P(x - 60 * s) + ' ' + P(y - 110 * s) + ' L' + P(x + 20 * s) + ' ' + P(y - 40 * s) +
      ' L' + P(x + 70 * s) + ' ' + P(y - 150 * s) + ' L' + P(x + 130 * s) + ' ' + P(y - 60 * s) +
      ' L' + P(x + 220 * s) + ' ' + P(y - 20 * s) + ' L' + P(x + 260 * s) + ' ' + P(y + 130 * s) +
      ' L' + P(x + 180 * s) + ' ' + P(y + 260 * s) + ' Z" fill="' + dark + '"/>' +
      '<rect x="' + P(x + 40 * s) + '" y="' + P(y - 250 * s) + '" width="' + P(30 * s) + '" height="' + P(120 * s) + '" fill="' + dark + '"/>' +
      '<path d="M' + P(x + 20 * s) + ' ' + P(y - 250 * s) + ' q' + P(35 * s) + ' ' + P(-40 * s) + ' ' + P(70 * s) + ' 0 Z" fill="' + dark + '"/>' +
      '<ellipse class="float" style="--dur:6s;--dy:-20px" cx="' + P(x + 110 * s) + '" cy="' + P(y - 280 * s) + '" rx="' + P(55 * s) +
      '" ry="' + P(26 * s) + '" fill="#e8e3d5" opacity=".16"/>' +
      leg(x - 130 * s, y + 250 * s, s, dark) + leg(x - 20 * s, y + 258 * s, s, dark) +
      leg(x + 95 * s, y + 252 * s, s, dark) + leg(x + 190 * s, y + 246 * s, s, dark) +
      '<rect x="' + P(x - 60 * s) + '" y="' + P(y + 90 * s) + '" width="' + P(36 * s) + '" height="' + P(72 * s) + '" fill="' + warm + '" opacity=".5"/>' +
      '<rect x="' + P(x + 60 * s) + '" y="' + P(y + 20 * s) + '" width="' + P(26 * s) + '" height="' + P(40 * s) + '" fill="' + warm + '" opacity=".55"/>' +
      '<circle cx="' + P(x + 130 * s) + '" cy="' + P(y + 140 * s) + '" r="' + P(15 * s) + '" fill="' + warm + '" opacity=".45"/>' +
      '</g>';
  }

  function leg(x, y, s, color) {
    return '<path d="M' + P(x) + ' ' + P(y) + ' q' + P(10 * s) + ' ' + P(50 * s) + ' ' + P(-12 * s) + ' ' + P(78 * s) +
      ' l' + P(34 * s) + ' ' + P(8 * s) + ' q' + P(18 * s) + ' ' + P(-46 * s) + ' ' + P(6 * s) + ' ' + P(-86 * s) + ' Z" fill="' + color + '"/>';
  }

  function airfield(baseY, color, dark, warm) {
    var s = '';
    s += '<rect x="0" y="' + P(baseY) + '" width="1600" height="' + P(900 - baseY) + '" fill="' + color + '"/>';
    s += '<path d="M0 ' + P(baseY) + ' L1600 ' + P(baseY - 20) + '" stroke="' + dark + '" stroke-width="3" opacity=".3"/>';
    s += '<path d="M760 ' + P(baseY) + ' L980 ' + P(baseY - 8) + ' L1040 ' + P(baseY + 8) + ' L700 ' + P(baseY + 14) + ' Z" fill="' + dark + '" opacity=".14"/>';
    s += '<path d="M120 ' + P(baseY - 10) + ' l120 -105 l150 0 l0 105 Z" fill="' + dark + '" opacity=".45"/>';
    s += '<path d="M110 ' + P(baseY - 24) + ' q140 -80 300 0" stroke="' + dark + '" stroke-width="7" fill="none" opacity=".35"/>';
    s += '<rect x="300" y="' + P(baseY - 120) + '" width="7" height="110" fill="' + dark + '" opacity=".4"/>';
    s += '<path d="M307 ' + P(baseY - 118) + ' q52 16 0 60 Z" fill="' + warm + '" opacity=".55"/>';
    return s;
  }

  function plane(x, y, s, color, accent, flip) {
    return '<g class="float" style="--dur:7.5s;--dy:-8px">' +
      '<g transform="translate(' + P(x) + ' ' + P(y) + ') scale(' + (flip ? -s : s) + ' ' + s + ')">' +
      '<ellipse cx="0" cy="0" rx="92" ry="19" fill="' + color + '"/>' +
      '<path d="M-24 -4 L40 -66 L62 -62 L6 0 Z" fill="' + color + '"/>' +
      '<path d="M-24 4 L40 64 L60 60 L6 2 Z" fill="' + color + '"/>' +
      '<path d="M-88 -2 L-120 -40 L-104 -42 L-70 0 Z" fill="' + color + '"/>' +
      '<circle cx="28" cy="0" r="11" fill="' + accent + '" opacity=".8"/>' +
      '<path d="M86 0 l24 -26 l7 1 l-18 26" fill="' + color + '"/>' +
      '<circle cx="88" cy="0" r="4" fill="#2a2c2a" opacity=".5"/>' +
      '</g></g>';
  }

  function boat(x, y, s, color, light) {
    return '<g class="float" style="--dur:6s;--dy:-4px">' +
      '<path d="M' + P(x - 44 * s) + ' ' + P(y) + ' q' + P(44 * s) + ' ' + P(26 * s) + ' ' + P(88 * s) + ' 0 l' + P(-14 * s) +
      ' ' + P(20 * s) + ' l' + P(-60 * s) + ' 0 Z" fill="' + color + '"/>' +
      '<rect x="' + P(x - 4 * s) + '" y="' + P(y - 70 * s) + '" width="' + P(3 * s) + '" height="' + P(70 * s) + '" fill="' + color + '"/>' +
      '<path d="M' + P(x + 1 * s) + ' ' + P(y - 68 * s) + ' l' + P(32 * s) + ' ' + P(20 * s) + ' l' + P(-32 * s) + ' ' + P(20 * s) + ' Z" fill="' + color + '" opacity=".75"/>' +
      '<circle cx="' + P(x + 34 * s) + '" cy="' + P(y - 8 * s) + '" r="' + P(4 * s) + '" fill="' + light + '"/>' +
      '</g>';
  }

  function train(x, y, s, color, warm) {
    var out = '<g opacity=".72">';
    var i;
    for (i = 0; i < 4; i++) {
      var cx = x + i * 56 * s;
      out += '<rect x="' + P(cx) + '" y="' + P(y) + '" width="' + P(50 * s) + '" height="' + P(30 * s) + '" rx="' + P(4 * s) + '" fill="' + color + '"/>';
      out += '<rect x="' + P(cx + 7 * s) + '" y="' + P(y + 6 * s) + '" width="' + P(9 * s) + '" height="' + P(8 * s) + '" fill="' + warm + '" opacity=".7"/>';
      out += '<rect x="' + P(cx + 21 * s) + '" y="' + P(y + 6 * s) + '" width="' + P(9 * s) + '" height="' + P(8 * s) + '" fill="' + warm + '" opacity=".55"/>';
    }
    out += '<path d="M' + P(x + 220 * s) + ' ' + P(y + 14 * s) + ' l' + P(38 * s) + ' 0" stroke="' + color + '" stroke-width="' + P(3 * s) + '"/>';
    out += '</g>';
    return out;
  }

  function lighthouse(x, baseY, s, body, stripe, warm) {
    var h = 360 * s, top = baseY - h;
    return '<g>' +
      '<path d="M' + P(x - 44 * s) + ' ' + P(baseY) + ' L' + P(x - 25 * s) + ' ' + P(top) + ' L' + P(x + 25 * s) + ' ' + P(top) +
      ' L' + P(x + 44 * s) + ' ' + P(baseY) + ' Z" fill="' + body + '"/>' +
      '<path d="M' + P(x - 31 * s) + ' ' + P(top + 95 * s) + ' L' + P(x + 31 * s) + ' ' + P(top + 95 * s) +
      ' L' + P(x + 27 * s) + ' ' + P(top + 135 * s) + ' L' + P(x - 27 * s) + ' ' + P(top + 135 * s) + ' Z" fill="' + stripe + '"/>' +
      '<path d="M' + P(x - 20 * s) + ' ' + P(top + 230 * s) + ' L' + P(x + 20 * s) + ' ' + P(top + 230 * s) +
      ' L' + P(x + 24 * s) + ' ' + P(top + 268 * s) + ' L' + P(x - 24 * s) + ' ' + P(top + 268 * s) + ' Z" fill="' + stripe + '"/>' +
      '<rect x="' + P(x - 29 * s) + '" y="' + P(top - 20 * s) + '" width="' + P(58 * s) + '" height="' + P(34 * s) + '" fill="#24302f"/>' +
      '<rect x="' + P(x - 21 * s) + '" y="' + P(top - 15 * s) + '" width="' + P(42 * s) + '" height="' + P(22 * s) + '" fill="' + warm + '" opacity=".9"/>' +
      '<path d="M' + P(x - 38 * s) + ' ' + P(top - 20 * s) + ' L' + P(x) + ' ' + P(top - 60 * s) + ' L' + P(x + 38 * s) + ' ' + P(top - 20 * s) + ' Z" fill="#24302f"/>' +
      '<circle cx="' + P(x) + '" cy="' + P(top + 4 * s) + '" r="' + P(56 * s) + '" fill="' + warm + '" opacity=".07"/>' +
      '<path d="M' + P(x - 14 * s) + ' ' + P(baseY) + ' q14 -40 28 0 Z" fill="#1d2827" opacity=".8"/>' +
      '</g>';
  }

  function solarTower(x, baseY, s, metal, glow) {
    var h = 250 * s, top = baseY - h;
    return '<g opacity=".95">' +
      '<path d="M' + P(x - 34 * s) + ' ' + P(baseY) + ' L' + P(x - 12 * s) + ' ' + P(top) + ' L' + P(x + 12 * s) + ' ' + P(top) +
      ' L' + P(x + 34 * s) + ' ' + P(baseY) + ' Z" fill="' + metal + '"/>' +
      '<path d="M' + P(x - 26 * s) + ' ' + P(baseY - 20 * s) + ' L' + P(x + 26 * s) + ' ' + P(baseY - 20 * s) +
      ' M' + P(x - 20 * s) + ' ' + P(baseY - 84 * s) + ' L' + P(x + 20 * s) + ' ' + P(baseY - 84 * s) +
      ' M' + P(x - 14 * s) + ' ' + P(baseY - 148 * s) + ' L' + P(x + 14 * s) + ' ' + P(baseY - 148 * s) +
      '" stroke="rgba(0,0,0,.25)" stroke-width="' + P(3 * s) + '"/>' +
      '<ellipse cx="' + P(x) + '" cy="' + P(top - 16 * s) + '" rx="' + P(64 * s) + '" ry="' + P(24 * s) + '" fill="' + metal + '"/>' +
      '<ellipse cx="' + P(x) + '" cy="' + P(top - 19 * s) + '" rx="' + P(52 * s) + '" ry="' + P(17 * s) + '" fill="' + glow + '" opacity=".45"/>' +
      '<path d="M' + P(x - 64 * s) + ' ' + P(top - 16 * s) + ' q' + P(64 * s) + ' ' + P(-36 * s) + ' ' + P(128 * s) + ' 0" stroke="' + metal + '" stroke-width="' + P(5 * s) + '" fill="none"/>' +
      '<path d="M' + P(x) + ' ' + P(top + 6 * s) + ' V' + P(top + 34 * s) + '" stroke="' + metal + '" stroke-width="' + P(7 * s) + '"/>' +
      '<circle cx="' + P(x) + '" cy="' + P(top - 24 * s) + '" r="' + P(26 * s) + '" fill="' + glow + '" opacity=".08"/>' +
      '</g>';
  }

  function bigFungus(x, baseY, s, stem, cap, glow) {
    var h = 280 * s, w = 96 * s;
    return '<g opacity=".84">' +
      '<path d="M' + P(x - 6 * s) + ' ' + P(baseY) + ' q' + P(-22 * s) + ' ' + P(-h * 0.5) + ' ' + P(-8 * s) + ' ' + P(-h) +
      '" stroke="' + stem + '" stroke-width="' + P(18 * s) + '" fill="none" stroke-linecap="round"/>' +
      '<path d="M' + P(x - w) + ' ' + P(baseY - h) + ' Q' + P(x) + ' ' + P(baseY - h - 100 * s) + ' ' + P(x + w) + ' ' + P(baseY - h) +
      ' Q' + P(x + w * 0.72) + ' ' + P(baseY - h + 22 * s) + ' ' + P(x + w * 0.42) + ' ' + P(baseY - h + 26 * s) +
      ' Q' + P(x) + ' ' + P(baseY - h + 34 * s) + ' ' + P(x - w * 0.42) + ' ' + P(baseY - h + 26 * s) +
      ' Q' + P(x - w * 0.72) + ' ' + P(baseY - h + 22 * s) + ' ' + P(x - w) + ' ' + P(baseY - h) + ' Z" fill="' + cap + '"/>' +
      '<path d="M' + P(x) + ' ' + P(baseY - h + 28 * s) + ' L' + P(x - w * 0.82) + ' ' + P(baseY - h + 2 * s) +
      ' M' + P(x) + ' ' + P(baseY - h + 28 * s) + ' L' + P(x - w * 0.45) + ' ' + P(baseY - h - 30 * s) +
      ' M' + P(x) + ' ' + P(baseY - h + 28 * s) + ' L' + P(x + w * 0.45) + ' ' + P(baseY - h - 30 * s) +
      ' M' + P(x) + ' ' + P(baseY - h + 28 * s) + ' L' + P(x + w * 0.82) + ' ' + P(baseY - h + 2 * s) +
      '" stroke="rgba(0,0,0,.18)" stroke-width="' + P(2 * s) + '"/>' +
      '<ellipse cx="' + P(x) + '" cy="' + P(baseY - h + 32 * s) + '" rx="' + P(w * 0.9) + '" ry="' + P(10 * s) + '" fill="' + glow + '" opacity=".18"/>' +
      '<circle cx="' + P(x - w * 0.4) + '" cy="' + P(baseY - h - 18 * s) + '" r="' + P(5 * s) + '" fill="' + glow + '" opacity=".35"/>' +
      '<circle cx="' + P(x + w * 0.25) + '" cy="' + P(baseY - h - 34 * s) + '" r="' + P(3.5 * s) + '" fill="' + glow + '" opacity=".3"/>' +
      '</g>';
  }

  function smallHouse(x, baseY, s, body, roof, warm) {
    return '<g opacity=".9">' +
      '<rect x="' + P(x - 42 * s) + '" y="' + P(baseY - 62 * s) + '" width="' + P(84 * s) + '" height="' + P(62 * s) + '" fill="' + body + '"/>' +
      '<path d="M' + P(x - 54 * s) + ' ' + P(baseY - 60 * s) + ' L' + P(x) + ' ' + P(baseY - 104 * s) + ' L' + P(x + 54 * s) + ' ' + P(baseY - 60 * s) + ' Z" fill="' + roof + '"/>' +
      '<rect x="' + P(x + 12 * s) + '" y="' + P(baseY - 42 * s) + '" width="' + P(20 * s) + '" height="' + P(18 * s) + '" fill="' + warm + '" opacity=".8"/>' +
      '<rect x="' + P(x - 34 * s) + '" y="' + P(baseY - 46 * s) + '" width="' + P(18 * s) + '" height="' + P(28 * s) + '" fill="' + roof + '" opacity=".7"/>' +
      '<path d="M' + P(x + 22 * s) + ' ' + P(baseY - 104 * s) + ' q' + P(10 * s) + ' ' + P(-18 * s) + ' ' + P(2 * s) + ' ' + P(-34 * s) + '" stroke="rgba(230,230,215,.12)" stroke-width="' + P(7 * s) + '" fill="none"/>' +
      '</g>';
  }

  function stoneTower(x, baseY, s, color, warm) {
    var h = 520 * s, top = baseY - h;
    return '<g>' +
      '<path d="M' + P(x - 95 * s) + ' ' + P(baseY) + ' L' + P(x - 58 * s) + ' ' + P(top + 60 * s) + ' L' + P(x - 48 * s) + ' ' + P(top) +
      ' L' + P(x + 48 * s) + ' ' + P(top) + ' L' + P(x + 58 * s) + ' ' + P(top + 60 * s) + ' L' + P(x + 95 * s) + ' ' + P(baseY) + ' Z" fill="' + color + '"/>' +
      '<path d="M' + P(x - 70 * s) + ' ' + P(top) + ' L' + P(x) + ' ' + P(top - 100 * s) + ' L' + P(x + 70 * s) + ' ' + P(top) + ' Z" fill="' + color + '"/>' +
      '<rect x="' + P(x - 14 * s) + '" y="' + P(top + 150 * s) + '" width="' + P(28 * s) + '" height="' + P(54 * s) + '" rx="' + P(14 * s) + '" fill="' + warm + '" opacity=".7"/>' +
      '<path d="M' + P(x - 6 * s) + ' ' + P(baseY) + ' q6 -60 12 0 Z" fill="#141d24"/>' +
      '<circle cx="' + P(x) + '" cy="' + P(top + 80 * s) + '" r="' + P(4 * s) + '" fill="' + warm + '" opacity=".8"/>' +
      '</g>';
  }

  function glassSpire(x, y, s, color, glow) {
    return '<g class="float" style="--dur:' + P(7 + (x % 5)) + 's;--dy:' + P(-4 - (x % 7)) + 'px">' +
      '<path d="M' + P(x) + ' ' + P(y) + ' L' + P(x + 22 * s) + ' ' + P(y + 120 * s) + ' L' + P(x - 22 * s) + ' ' + P(y + 120 * s) + ' Z" fill="' + color + '" opacity=".45"/>' +
      '<path d="M' + P(x) + ' ' + P(y) + ' L' + P(x + 22 * s) + ' ' + P(y + 120 * s) + ' L' + P(x + 4 * s) + ' ' + P(y + 120 * s) + ' Z" fill="' + glow + '" opacity=".5"/>' +
      '<path d="M' + P(x - 10 * s) + ' ' + P(y + 120 * s) + ' L' + P(x) + ' ' + P(y + 26 * s) + ' L' + P(x + 10 * s) + ' ' + P(y + 120 * s) + ' Z" fill="none" stroke="' + glow + '" stroke-width="1" opacity=".4"/>' +
      '</g>';
  }

  function glassSphere(x, y, r, glow, world) {
    return '<g class="float" style="--dur:' + P(8 + (r % 6)) + 's;--dy:-9px">' +
      '<circle cx="' + P(x) + '" cy="' + P(y) + '" r="' + P(r) + '" fill="' + glow + '" opacity=".09"/>' +
      '<circle cx="' + P(x) + '" cy="' + P(y) + '" r="' + P(r) + '" fill="none" stroke="' + glow + '" stroke-width="1.2" opacity=".55"/>' +
      '<circle cx="' + P(x - r * 0.25) + '" cy="' + P(y - r * 0.3) + '" r="' + P(r * 0.1) + '" fill="#ffffff" opacity=".7"/>' +
      (world ? '<path d="M' + P(x - r * 0.62) + ' ' + P(y + r * 0.28) + ' q' + P(r * 0.3) + ' ' + P(-r * 0.45) + ' ' + P(r * 0.62) + ' 0 q' + P(r * 0.18) + ' ' + P(r * 0.2) + ' ' + P(r * 0.58) + ' 0" stroke="' + glow + '" stroke-width="1" fill="none" opacity=".35"/>' : '') +
      '</g>';
  }

  function robot(x, y, s, color) {
    return '<g opacity=".8" transform="translate(' + P(x) + ' ' + P(y) + ') scale(' + s + ')">' +
      '<circle cx="0" cy="-96" r="17" fill="' + color + '"/>' +
      '<rect x="-10" y="-82" width="20" height="14" fill="' + color + '"/>' +
      '<rect x="-17" y="-70" width="34" height="40" rx="8" fill="' + color + '"/>' +
      '<path d="M-17 -60 q-22 20 -18 54" stroke="' + color + '" stroke-width="7" fill="none"/>' +
      '<path d="M17 -60 q22 20 18 54" stroke="' + color + '" stroke-width="7" fill="none"/>' +
      '<ellipse cx="0" cy="-26" rx="19" ry="14" fill="' + color + '"/>' +
      '<path d="M-10 -14 l-4 14 M10 -14 l4 14" stroke="' + color + '" stroke-width="6"/>' +
      '<circle cx="-6" cy="-98" r="2" fill="#ffe9ac" opacity=".8"/><circle cx="6" cy="-98" r="2" fill="#ffe9ac" opacity=".8"/>' +
      '</g>';
  }

  function totoroTree(x, baseY, s, trunk, leaf, leaf2) {
    return '<g opacity=".9">' +
      '<path d="M' + P(x - 26 * s) + ' ' + P(baseY) + ' L' + P(x - 18 * s) + ' ' + P(baseY - 190 * s) + ' L' + P(x + 18 * s) + ' ' + P(baseY - 190 * s) +
      ' L' + P(x + 26 * s) + ' ' + P(baseY) + ' Z" fill="' + trunk + '"/>' +
      '<path d="M' + P(x - 22 * s) + ' ' + P(baseY) + ' q-70 ' + P(-8 * s) + ' -110 ' + P(10 * s) + '" stroke="' + trunk + '" stroke-width="' + P(9 * s) + '" fill="none"/>' +
      '<path d="M' + P(x + 22 * s) + ' ' + P(baseY) + ' q70 ' + P(-8 * s) + ' 108 ' + P(12 * s) + '" stroke="' + trunk + '" stroke-width="' + P(9 * s) + '" fill="none"/>' +
      '<ellipse cx="' + P(x) + '" cy="' + P(baseY - 260 * s) + '" rx="' + P(190 * s) + '" ry="' + P(130 * s) + '" fill="' + leaf + '"/>' +
      '<ellipse cx="' + P(x - 120 * s) + '" cy="' + P(baseY - 210 * s) + '" rx="' + P(105 * s) + '" ry="' + P(78 * s) + '" fill="' + leaf2 + '"/>' +
      '<ellipse cx="' + P(x + 120 * s) + '" cy="' + P(baseY - 218 * s) + '" rx="' + P(110 * s) + '" ry="' + P(80 * s) + '" fill="' + leaf2 + '"/>' +
      '<ellipse cx="' + P(x + 20 * s) + '" cy="' + P(baseY - 330 * s) + '" rx="' + P(110 * s) + '" ry="' + P(70 * s) + '" fill="' + leaf + '"/>' +
      '<circle cx="' + P(x - 70 * s) + '" cy="' + P(baseY - 240 * s) + '" r="' + P(3 * s) + '" fill="#f6e6a0" opacity=".55"/>' +
      '<circle cx="' + P(x + 55 * s) + '" cy="' + P(baseY - 280 * s) + '" r="' + P(2.5 * s) + '" fill="#f6e6a0" opacity=".5"/>' +
      '</g>';
  }

  function islands(seed, items, rock, grassColor) {
    var out = '', i;
    for (i = 0; i < items.length; i++) {
      var it = items[i];
      out += island(it.x, it.y, it.s, rock, grassColor, seed + i, it.tree);
    }
    return '<g>' + out + '</g>';
  }

  function island(x, y, s, rock, grassColor, seed, tree) {
    var r = rngFor(seed), d = 'M' + P(x - 150 * s) + ' ' + P(y) + ' q' + P(150 * s) + ' ' + P(-45 * s) + ' ' + P(300 * s) + ' 0' +
      ' l' + P(-36 * s) + ' ' + P(90 * s) + ' l' + P(-48 * s) + ' ' + P(24 * s) + ' l' + P(-52 * s) + ' ' + P(56 * s) +
      ' l' + P(-46 * s) + ' ' + P(-22 * s) + ' l' + P(-50 * s) + ' ' + P(40 * s) + ' l' + P(-40 * s) + ' ' + P(-58 * s) + ' Z';
    var out = '<g class="float" style="--dur:' + P(8 + r() * 5) + 's;--dy:' + P(-7 - r() * 8) + 'px">' +
      '<path d="' + d + '" fill="' + rock + '"/>' +
      '<path d="M' + P(x - 150 * s) + ' ' + P(y) + ' q' + P(150 * s) + ' ' + P(-45 * s) + ' ' + P(300 * s) + ' 0' +
      ' l' + P(-14 * s) + ' ' + P(14 * s) + ' q' + P(-136 * s) + ' ' + P(-38 * s) + ' ' + P(-272 * s) + ' 0 Z" fill="' + grassColor + '"/>';
    if (tree) {
      out += '<rect x="' + P(x - 5 * s) + '" y="' + P(y - 64 * s) + '" width="' + P(10 * s) + '" height="' + P(66 * s) + '" fill="' + rock + '"/>' +
        '<ellipse cx="' + P(x) + '" cy="' + P(y - 82 * s) + '" rx="' + P(54 * s) + '" ry="' + P(42 * s) + '" fill="' + grassColor + '"/>' +
        '<ellipse cx="' + P(x - 30 * s) + '" cy="' + P(y - 70 * s) + '" rx="' + P(32 * s) + '" ry="' + P(24 * s) + '" fill="' + grassColor + '"/>';
    }
    for (var i = 0; i < 4; i++) {
      var vx = x - 110 * s + i * 70 * s;
      out += '<path d="M' + P(vx) + ' ' + P(y + 18 * s) + ' q' + P(-10 + r() * 20) + ' ' + P(40 * s) + ' ' + P(-4 + r() * 10) + ' ' + P(90 * s) +
        '" stroke="' + grassColor + '" stroke-width="' + P(1.4 * s) + '" fill="none" opacity=".4"/>';
    }
    out += '</g>';
    return out;
  }

  function doors(seed) {
    var r = rngFor(seed), s = '', i;
    for (i = 0; i < 3; i++) {
      var x = 250 + i * 470 + r() * 90, y = 180 + r() * 240, w = 74, h = 132;
      s += '<g class="float" style="--dur:' + P(9 + i * 3) + 's;--dy:-10px" opacity=".7">' +
        '<rect x="' + P(x) + '" y="' + P(y) + '" width="' + w + '" height="' + h + '" rx="3" fill="#ffe6a8" opacity=".13"/>' +
        '<rect x="' + P(x) + '" y="' + P(y) + '" width="' + w + '" height="' + h + '" rx="3" fill="none" stroke="#ffe6a8" stroke-width="1.3" opacity=".55"/>' +
        '<path d="M' + P(x + 12) + ' ' + P(y + h - 18) + ' q' + (w / 2 - 12) + ' -34 ' + (w - 24) + ' 0" stroke="#ffe6a8" stroke-width="1" fill="none" opacity=".35"/>' +
        '<circle cx="' + P(x + w - 14) + '" cy="' + P(y + h / 2) + '" r="2" fill="#ffe6a8" opacity=".8"/>' +
        '</g>';
    }
    return '<g>' + s + '</g>';
  }

  function beams(seed, color) {
    var r = rngFor(seed), s = '', i;
    for (i = 0; i < 5; i++) {
      var x = r() * 1200 + 100, w = 60 + r() * 100;
      s += '<path d="M' + P(x) + ' -40 L' + P(x + w) + ' -40 L' + P(x + w - 460) + ' 940 L' + P(x - 460) + ' 940 Z" fill="' +
        color + '" opacity="' + P(0.03 + r() * 0.045) + '"/>';
    }
    return '<g>' + s + '</g>';
  }

  function mist(seed, y, color, n) {
    var r = rngFor(seed), s = '', i;
    for (i = 0; i < (n || 7); i++) {
      var x = r() * 1700 - 50, yy = y + (r() - 0.5) * 120, w = 200 + r() * 360;
      s += '<ellipse class="cloud" style="--dur:' + P(40 + r() * 40) + 's;--dx:' + P(30 + r() * 40) + 'px" cx="' + P(x) + '" cy="' +
        P(yy) + '" rx="' + P(w) + '" ry="' + P(18 + r() * 26) + '" fill="' + color + '" opacity="' + P(0.05 + r() * 0.08) + '"/>';
    }
    return '<g>' + s + '</g>';
  }

  function waves(seed, baseY, color, light) {
    var r = rngFor(seed), s = '', i;
    for (i = 0; i < 5; i++) {
      var x = i * 340 + r() * 60, h = 130 + r() * 150, w = 250 + r() * 150;
      s += '<path d="M' + P(x) + ' ' + P(baseY) + ' q' + P(w * 0.4) + ' ' + P(-h) + ' ' + P(w) + ' ' + P(-h * 0.7) +
        ' q' + P(-w * 0.22) + ' ' + P(h * 0.16) + ' ' + P(-w * 0.34) + ' ' + P(h * 0.42) +
        ' q' + P(-w * 0.3) + ' ' + P(h * 0.26) + ' ' + P(-w * 0.66) + ' ' + P(h * 0.28) + ' Z" fill="' + color + '" opacity=".9"/>';
      s += '<path d="M' + P(x + w * 0.18) + ' ' + P(baseY - h * 0.52) + ' q' + P(w * 0.2) + ' ' + P(-h * 0.2) + ' ' + P(w * 0.48) + ' ' + P(-h * 0.16) +
        '" stroke="' + light + '" stroke-width="2" fill="none" opacity=".35"/>';
    }
    return '<g>' + s + '</g>';
  }

  /* ---------------- комната в финале ---------------- */

  function studyRoom() {
    var titles = ['Конан', 'Люпен', 'Навсикая', 'Лапута', 'Тоторо', 'Кики', 'Порко',
      'Мононоке', 'Тихиро', 'Хаул', 'Поньо', 'Дзиро', 'Махито'];
    var colors = ['#8a4a3a', '#4a6a7a', '#7a6a3a', '#5a4a6a', '#3a6a5a', '#8a6a4a',
      '#6a3a3a', '#4a5a3a', '#7a5a5a', '#3a5a6a', '#8a5a3a', '#5a5a4a', '#6a4a5a'];
    var books = '';
    for (var i = 0; i < titles.length; i++) {
      var x = 575 + i * 34, y = 48 + (i % 3) * 3, h = 96 - (i % 4) * 5;
      books += '<g>' +
        '<rect x="' + x + '" y="' + y + '" width="28" height="' + h + '" rx="2" fill="' + colors[i] + '"/>' +
        '<rect x="' + (x + 3) + '" y="' + (y + 6) + '" width="3" height="' + (h - 12) + '" fill="rgba(255,255,255,.12)"/>' +
        '<text x="' + (x + 17) + '" y="' + (y + h - 10) + '" transform="rotate(-90 ' + (x + 17) + ' ' + (y + h - 10) + ')" ' +
        'fill="#f0dfb0" font-family="Georgia,serif" font-size="10" letter-spacing=".5">' + titles[i] + '</text>' +
        '<path d="M' + (x + 3) + ' ' + (y + h - 7) + ' h22" stroke="rgba(240,220,170,.35)" stroke-width="1"/>' +
        '</g>';
    }

    var rain = '';
    for (var r = 0; r < 30; r++) {
      var rx = 600 + ((r * 47) % 330), ry = 195 + ((r * 31) % 280);
      rain += '<path d="M' + rx + ' ' + ry + ' l-7 20" stroke="rgba(200,225,230,.22)" stroke-width="1.2"/>';
    }

    return '' +
      '<defs><linearGradient id="studyWall" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#3b2a20"/><stop offset=".55" stop-color="#4a3426"/><stop offset="1" stop-color="#2a1c16"/>' +
      '</linearGradient>' +
      '<linearGradient id="studyWindow" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#273f4c"/><stop offset=".5" stop-color="#456a70"/><stop offset="1" stop-color="#b98a62"/>' +
      '</linearGradient></defs>' +
      '<rect x="0" y="0" width="1600" height="900" fill="url(#studyWall)"/>' +
      '<path d="M0 690 L1600 690 L1600 900 L0 900 Z" fill="#2b1d16"/>' +
      '<path d="M0 690 L1600 690" stroke="#6a4a32" stroke-width="4" opacity=".7"/>' +
      '<g opacity=".35" stroke="#8a6244" stroke-width="1">' +
      '<path d="M0 740 L1600 740 M0 800 L1600 800 M0 860 L1600 860"/>' +
      '<path d="M180 690 L220 900 M520 690 L560 900 M980 690 L1020 900 M1320 690 L1360 900"/>' +
      '</g>' +
      /* окно */
      '<g>' +
      '<path d="M590 470 L590 210 Q590 120 680 108 Q770 94 860 108 Q950 120 950 210 L950 470 Z" fill="#1a1310" opacity=".8"/>' +
      '<path d="M606 458 L606 214 Q606 136 684 124 Q770 110 856 124 Q934 136 934 214 L934 458 Z" fill="url(#studyWindow)"/>' +
      '<path d="M606 458 L606 214 Q606 136 684 124 Q770 110 856 124 Q934 136 934 214 L934 458 Z" fill="none" stroke="#8a6244" stroke-width="7"/>' +
      '<path d="M770 118 L770 458 M606 300 L934 300" stroke="#8a6244" stroke-width="5" opacity=".9"/>' +
      '<path d="M606 214 Q606 136 684 124 Q770 110 856 124 Q934 136 934 214" fill="none" stroke="#c49a64" stroke-width="2" opacity=".5"/>' +
      rain +
      '<path d="M606 458 L934 458" stroke="#6a4a32" stroke-width="10"/>' +
      '<g opacity=".55"><path d="M560 190 Q540 300 560 470 L590 470 L590 190 Z" fill="#6a4a5a"/>' +
      '<path d="M950 190 Q970 300 950 470 L920 470 L920 190 Z" fill="#6a4a5a"/></g>' +
      '</g>' +
      /* верхняя полка с книгами */
      '<g>' +
      '<rect x="548" y="144" width="504" height="12" rx="3" fill="#5a3c2a"/>' +
      '<path d="M556 156 h488" stroke="#8a6244" stroke-width="2" opacity=".5"/>' +
      books +
      '</g>' +
      /* боковые полки */
      '<g opacity=".9">' +
      '<rect x="54" y="210" width="330" height="10" fill="#5a3c2a"/><rect x="54" y="330" width="330" height="10" fill="#5a3c2a"/>' +
      '<rect x="54" y="450" width="330" height="10" fill="#5a3c2a"/>' +
      '<rect x="1216" y="210" width="330" height="10" fill="#5a3c2a"/><rect x="1216" y="330" width="330" height="10" fill="#5a3c2a"/>' +
      '<rect x="1216" y="450" width="330" height="10" fill="#5a3c2a"/>' +
      '<g fill="#6a4a3a" opacity=".75">' +
      '<rect x="80" y="130" width="22" height="80"/><rect x="106" y="122" width="18" height="88"/><rect x="128" y="136" width="26" height="74"/>' +
      '<rect x="160" y="118" width="20" height="92"/><rect x="184" y="132" width="24" height="78"/><rect x="212" y="126" width="18" height="84"/>' +
      '<rect x="236" y="140" width="28" height="70"/><rect x="270" y="120" width="20" height="90"/><rect x="296" y="134" width="24" height="76"/>' +
      '<rect x="1260" y="126" width="24" height="84"/><rect x="1288" y="118" width="18" height="92"/><rect x="1310" y="132" width="26" height="78"/>' +
      '<rect x="1342" y="122" width="20" height="88"/><rect x="1366" y="138" width="24" height="72"/><rect x="1394" y="126" width="18" height="84"/>' +
      '</g>' +
      '<g fill="#5a4a3a" opacity=".55">' +
      '<rect x="76" y="250" width="18" height="80"/><rect x="98" y="242" width="24" height="88"/><rect x="126" y="256" width="20" height="74"/>' +
      '<rect x="150" y="246" width="26" height="84"/><rect x="180" y="260" width="18" height="70"/>' +
      '<rect x="1258" y="248" width="22" height="82"/><rect x="1284" y="240" width="18" height="90"/><rect x="1306" y="254" width="26" height="76"/>' +
      '<rect x="1336" y="244" width="20" height="86"/><rect x="1360" y="258" width="24" height="72"/>' +
      '</g>' +
      '</g>' +
      /* кресло, столик, чай */
      '<g>' +
      '<ellipse cx="800" cy="806" rx="300" ry="54" fill="#1e1410" opacity=".65"/>' +
      '<path d="M700 780 Q700 690 800 690 Q900 690 900 780 L900 840 L700 840 Z" fill="#4a3024" opacity=".9"/>' +
      '<path d="M714 780 Q714 704 800 704 Q886 704 886 780" fill="none" stroke="#7a5438" stroke-width="4" opacity=".6"/>' +
      '<rect x="676" y="760" width="248" height="16" rx="6" fill="#6a4630"/>' +
      '<rect x="700" y="776" width="18" height="70" fill="#3a261c"/><rect x="882" y="776" width="18" height="70" fill="#3a261c"/>' +
      '<ellipse cx="1040" cy="748" rx="86" ry="18" fill="#1e1410" opacity=".5"/>' +
      '<rect x="990" y="700" width="100" height="10" rx="4" fill="#6a4630"/>' +
      '<rect x="1000" y="710" width="8" height="54" fill="#4a3024"/><rect x="1072" y="710" width="8" height="54" fill="#4a3024"/>' +
      '<ellipse cx="1040" cy="696" rx="30" ry="8" fill="#c8a878"/>' +
      '<path d="M1010 694 q0 -20 30 -20 q30 0 30 20" fill="#d8b888"/>' +
      '<path d="M1040 674 q-10 -16 4 -24" stroke="#e8d8b8" stroke-width="2" fill="none" opacity=".45"/>' +
      '<ellipse cx="1100" cy="700" rx="18" ry="6" fill="#e8dfc8"/>' +
      '</g>' +
      /* кот */
      '<g transform="translate(300 760)" opacity=".9">' +
      '<ellipse cx="0" cy="18" rx="52" ry="22" fill="#2a2222"/>' +
      '<circle cx="-34" cy="-4" r="22" fill="#2e2626"/>' +
      '<path d="M-50 -18 L-54 -40 L-34 -26 Z" fill="#2e2626"/><path d="M-20 -18 L-16 -40 L-36 -26 Z" fill="#2e2626"/>' +
      '<path d="M-44 -2 q6 -6 12 0 M-30 -2 q6 -6 12 0" stroke="#d8c878" stroke-width="2" fill="none"/>' +
      '<path d="M-38 8 q4 4 8 0" stroke="#c8b8a0" stroke-width="1.5" fill="none"/>' +
      '<path d="M40 10 q34 -10 52 -30" stroke="#2a2222" stroke-width="8" fill="none" stroke-linecap="round"/>' +
      '</g>' +
      /* растения и рамка */
      '<g opacity=".8">' +
      '<path d="M150 700 q-10 -70 18 -120 M150 700 q-50 -50 -70 -80 M150 700 q40 -60 70 -70" stroke="#3a5a3a" stroke-width="5" fill="none"/>' +
      '<ellipse cx="168" cy="580" rx="18" ry="30" fill="#4a6a4a" transform="rotate(-24 168 580)"/>' +
      '<ellipse cx="80" cy="620" rx="16" ry="26" fill="#3f5f42" transform="rotate(36 80 620)"/>' +
      '<ellipse cx="220" cy="630" rx="14" ry="24" fill="#4a6a4a" transform="rotate(-52 220 630)"/>' +
      '<path d="M120 700 h60 l-8 50 h-44 Z" fill="#6a4a32"/>' +
      '</g>' +
      '<rect x="24" y="24" width="1552" height="852" fill="none" stroke="rgba(240,210,160,.08)" stroke-width="2"/>';
  }

  /* ---------------- конфигурации миров ---------------- */

  var BGS = {
    interworld: {
      sky: 'linear-gradient(180deg,#050e18 0%,#0a2230 32%,#134450 62%,#2a6a6c 82%,#3d7f76 100%)',
      sun: { x: '52%', y: '11%', size: '14vmin', color: '#f4e3b8', glow: 'rgba(244,227,184,.28)' },
      haze: 'radial-gradient(ellipse at 52% 13%,rgba(255,238,190,.16),transparent 42%)',
      layers: [
        stars(3, 90, '#dfe9df'),
        clouds(11, 0.18, '#a7c7c4', 0.22, 6, 1.2),
        cloudSea(12, 700, '#4f8d89', 0.6),
        doors(13),
        islands(14, [
          { x: 280, y: 520, s: 0.75, tree: true },
          { x: 1250, y: 410, s: 0.5, tree: true },
          { x: 980, y: 660, s: 0.62, tree: false }
        ], '#2a5a5a', '#3f8074'),
        lighthouse(1450, 780, 1.05, '#e6ddc4', '#b65a49', '#ffe7a8'),
        mist(15, 640, '#cfe8df', 6)
      ],
      particles: { kind: 'motes', colors: ['#ffe9b0', '#dff6ee', '#fff6d8'], count: 22 }
    },

    study: {
      sky: 'linear-gradient(180deg,#2b1c17 0%,#3b2a20 45%,#1c1210 100%)',
      sun: { x: '48%', y: '34%', size: '26vmin', color: '#ffd9a0', glow: 'rgba(255,205,145,.16)' },
      haze: 'radial-gradient(ellipse at 50% 42%,rgba(255,210,155,.14),transparent 62%)',
      layers: [studyRoom()],
      particles: { kind: 'motes', colors: ['#ffe0a8', '#e8c080', '#fff0d0'], count: 20 }
    },

    conan: {
      photo: 'assets/bg/anime/conan.webp',
      photoPrimary: false,
      photoOpacity: 0.38,
      photoBlur: '2.2px',
      sky: 'linear-gradient(180deg,#7fb9c6 0%,#a9d4d3 38%,#efd7a8 70%,#f4c485 100%)',
      sun: { x: '90%', y: '13%', size: '12vmin', color: '#fff4cf', glow: 'rgba(255,235,180,.35)' },
      haze: 'radial-gradient(ellipse at 88% 16%,rgba(255,240,200,.25),transparent 45%)',
      layers: [
        clouds(21, 0.16, '#f7f2df', 0.55, 5, 1.1),
        birds(22, 8, '#3f5b5c', 0.4),
        sea(0.62, '#4e8f92', 0.8, 'rgba(255,255,255,.2)'),
        mountains(23, 700, 180, '#6c8f83', 0.35),
        '<path d="M690 555 q-36 175 -66 345 L930 900 q-34 -190 -52 -345 Z" fill="#3f4940" opacity=".9"/>',
        island(778, 552, 1.02, '#4a4b3f', '#7e925f', 25, true),
        solarTower(778, 562, 1.0, '#4d4f43', '#ffd98a'),
        '<g class="float" style="--dur:8s;--dy:-5px">' + boat(1180, 690, 1.1, '#3b3b34', '#ffdf9d') + '</g>',
        '<path d="M120 690 q40 -100 120 -120 l140 0 q60 30 80 120 Z" fill="#56584a" opacity=".55"/>',
        grass(26, 760, '#8a9a66', 80)
      ],
      particles: { kind: 'motes', colors: ['#fff0c0', '#cfe6da', '#f4d49a'], count: 16 }
    },

    cagliostro: {
      photo: 'assets/bg/anime/cagliostro.webp',
      photoPrimary: true,
      sky: 'linear-gradient(180deg,#2a2344 0%,#5b3a5a 34%,#b9635e 64%,#efa06d 86%,#f4c489 100%)',
      sun: { x: '50%', y: '12%', size: '15vmin', color: '#ffca88', glow: 'rgba(255,170,100,.3)' },
      haze: 'radial-gradient(ellipse at 50% 14%,rgba(255,190,120,.25),transparent 48%)',
      layers: [
        stars(31, 40, '#f2ddc2'),
        clouds(32, 0.26, '#e7b9a0', 0.3, 4, 1.3),
        city(33, 760, '#372e3f', 0.8, { euro: true, warm: '#ffc374', tall: 230 }),
        clockTower(1200, 790, 1.25, '#2c2736', '#f0b46a'),
        city(34, 900, '#211e2d', 1, { euro: true, warm: '#ffc374', tall: 120 }),
        birds(35, 7, '#2a2233', 0.5)
      ],
      particles: { kind: 'petals', colors: ['#e8b6a2', '#f5d5b8'], count: 14 }
    },

    nausicaa: {
      photo: 'assets/bg/anime/nausicaa.webp',
      photoPrimary: true,
      sky: 'linear-gradient(180deg,#e0b96f 0%,#d6a76b 30%,#a3a06b 58%,#6f8c68 100%)',
      sun: { x: '50%', y: '9%', size: '10vmin', color: '#fff0bf', glow: 'rgba(255,225,160,.26)' },
      haze: 'radial-gradient(ellipse at 50% 34%,rgba(255,225,150,.2),transparent 55%)',
      layers: [
        clouds(41, 0.2, '#f1d9a1', 0.32, 4, 1.4),
        mountains(42, 640, 150, '#8f8c62', 0.4),
        beams(43, '#fff0c0'),
        bigFungus(790, 900, 1.45, '#5b6f52', '#c2aa6d', '#ffe9a0'),
        bigFungus(1260, 900, 1.05, '#4c6049', '#a8925d', '#ffe9a0'),
        fungi(44, 820, '#5f7458', '#c9b171', '#ffe9a0', 15),
        '<path d="M0 780 q400 -80 800 10 q400 90 800 -10 L1600 900 L0 900 Z" fill="#52664f" opacity=".75"/>',
        fungi(45, 905, '#3e5244', '#9a8c59', '#ffe9a0', 8),
        grass(46, 810, '#b4b47a', 90),
        '<ellipse class="float" style="--dur:11s;--dy:-8px" cx="340" cy="260" rx="170" ry="70" fill="#f6e3b0" opacity=".14"/>'
      ],
      particles: { kind: 'spores', colors: ['#f4e3a6', '#e6d28a', '#fff3c8'], count: 30 }
    },

    laputa: {
      photo: 'assets/bg/anime/laputa.webp',
      photoPrimary: true,
      sky: 'linear-gradient(180deg,#5aa7d8 0%,#86c4e6 34%,#c4e4ee 68%,#eaf6f2 100%)',
      sun: { x: '89%', y: '13%', size: '14vmin', color: '#fffbe8', glow: 'rgba(255,250,220,.35)' },
      haze: 'radial-gradient(ellipse at 86% 16%,rgba(255,255,235,.3),transparent 46%)',
      layers: [
        clouds(51, 0.15, '#ffffff', 0.65, 7, 1.5),
        cloudSea(52, 700, '#e9f3f2', 0.5),
        birds(53, 9, '#557d86', 0.35),
        islands(54, [
          { x: 720, y: 400, s: 1.35, tree: true },
          { x: 300, y: 560, s: 0.45, tree: true },
          { x: 1300, y: 620, s: 0.55, tree: false }
        ], '#7a9aa0', '#79a56f'),
        robot(760, 420, 0.8, '#557b80'),
        '<path d="M560 520 q-30 70 -10 120 M860 500 q20 80 -6 130" stroke="#6f9a72" stroke-width="2" fill="none" opacity=".35"/>',
        clouds(55, 0.72, '#ffffff', 0.5, 5, 1.2)
      ],
      particles: { kind: 'petals', colors: ['#ffffff', '#f8e6c6', '#d9f0e8'], count: 18 }
    },

    totoro: {
      photo: 'assets/bg/anime/totoro.webp',
      photoPrimary: true,
      sky: 'linear-gradient(180deg,#4d6a78 0%,#75908a 26%,#b4b487 56%,#e7c48f 82%,#f0ce9b 100%)',
      sun: { x: '14%', y: '14%', size: '9vmin', color: '#ffe4a6', glow: 'rgba(255,220,150,.2)' },
      haze: 'radial-gradient(ellipse at 50% 62%,rgba(255,225,160,.16),transparent 60%)',
      layers: [
        stars(61, 34, '#f6e9bd'),
        hills(62, 660, 70, '#587066', 0.7),
        hills(63, 740, 90, '#40584e', 0.85),
        totoroTree(760, 880, 1.3, '#2e3c34', '#3c5c42', '#31503a'),
        smallHouse(556, 690, 0.95, '#34463c', '#26362f', '#ffcf7a'),
        village(64, 880, '#2f4038', '#ffcf7a', 0.8),
        '<rect x="205" y="700" width="7" height="100" fill="#2c3b33"/>' +
        '<path d="M212 706 q44 10 30 44 l-20 -8 z" fill="#c9c0a0" opacity=".8"/>',
        hills(65, 860, 55, '#2b3d33', 0.95),
        grass(66, 870, '#7f8f58', 120)
      ],
      particles: { kind: 'fireflies', colors: ['#fff1a8', '#ffe27a'], count: 26 }
    },

    kiki: {
      photo: 'assets/bg/anime/kiki.webp',
      photoPrimary: true,
      sky: 'linear-gradient(180deg,#f2b96f 0%,#f7d49b 38%,#fbe9c8 62%,#c9d8c4 84%,#a9c3b8 100%)',
      sun: { x: '89%', y: '15%', size: '13vmin', color: '#fff3cc', glow: 'rgba(255,230,170,.32)' },
      haze: 'radial-gradient(ellipse at 86% 18%,rgba(255,240,200,.25),transparent 48%)',
      layers: [
        clouds(71, 0.12, '#fff7e4', 0.55, 5, 1.2),
        birds(72, 8, '#5f6f6a', 0.4),
        sea(0.64, '#6c9c98', 0.6, 'rgba(255,255,255,.18)'),
        hills(73, 640, 55, '#778b76', 0.5),
        city(76, 690, '#5d6258', 0.55, { euro: true, warm: '#ffd28a', tall: 130 }),
        clockTower(790, 700, 1.05, '#4f5a55', '#ffd28a'),
        city(74, 850, '#5d6258', 0.75, { euro: true, warm: '#ffd28a', tall: 150 }),
        '<g transform="translate(520 650) scale(.7)">' +
        '<path d="M0 0 l0 -120 l8 0 l0 120 Z" fill="#4f564c"/>' +
        '<path d="M8 -116 l72 -12 l0 16 l-72 12 Z" fill="#4f564c"/><circle cx="80" cy="-112" r="14" fill="#4f564c" opacity=".8"/>' +
        '<g transform="translate(80 -112)" fill="#4f564c" opacity=".85"><path d="M-5 0 L-9 -56 L6 -58 Z"/><path d="M-5 0 L-9 -56 L6 -58 Z" transform="rotate(90)"/><path d="M-5 0 L-9 -56 L6 -58 Z" transform="rotate(180)"/><path d="M-5 0 L-9 -56 L6 -58 Z" transform="rotate(270)"/><circle r="6" fill="#3f463e"/></g></g>',
        hills(75, 900, 60, '#3d4b40', 0.9),
        '<path d="M0 860 q260 -50 520 0 t520 0 t560 0 L1600 900 L0 900 Z" fill="#344238" opacity=".85"/>'
      ],
      particles: { kind: 'petals', colors: ['#f7d6b4', '#fff0d8', '#e8c2a0'], count: 16 }
    },

    porco: {
      photo: 'assets/bg/anime/porco.webp',
      photoPrimary: true,
      sky: 'linear-gradient(180deg,#556a8a 0%,#9d7390 24%,#e39477 52%,#f4bf82 74%,#f8d9a5 100%)',
      sun: { x: '62%', y: '12%', size: '15vmin', color: '#ffd08c', glow: 'rgba(255,190,120,.3)' },
      haze: 'radial-gradient(ellipse at 62% 15%,rgba(255,205,140,.3),transparent 50%)',
      layers: [
        clouds(81, 0.16, '#d9a79b', 0.35, 5, 1.4),
        sea(0.66, '#6e6f85', 0.75, 'rgba(255,220,190,.18)'),
        '<path d="M0 690 q220 -50 430 -10 q-100 -50 -220 -46 q-120 4 -210 56 Z" fill="#4c4858" opacity=".7"/>',
        islands(82, [
          { x: 1120, y: 470, s: 0.5, tree: false },
          { x: 1420, y: 610, s: 0.4, tree: false }
        ], '#44414f', '#6e6a5c'),
        plane(640, 300, 1.15, '#3a3a40', '#e9c074', true),
        '<ellipse cx="810" cy="560" rx="120" ry="24" fill="#4a4658" opacity=".65"/>' +
        '<path d="M760 554 q50 -34 104 -2 q-54 18 -104 2 Z" fill="#5f5a68" opacity=".7"/>',
        clouds(83, 0.74, '#e8b9a4', 0.3, 4, 1.1)
      ],
      particles: { kind: 'motes', colors: ['#ffe2b0', '#f6c9a0'], count: 14 }
    },

    mononoke: {
      photo: 'assets/bg/anime/mononoke.webp',
      photoPrimary: true,
      sky: 'linear-gradient(180deg,#1c2f38 0%,#274841 28%,#4e6b4c 56%,#7d8552 82%,#9a8c52 100%)',
      sun: { x: '50%', y: '11%', size: '9vmin', color: '#eef1cf', glow: 'rgba(236,240,200,.2)' },
      haze: 'radial-gradient(ellipse at 50% 20%,rgba(230,235,200,.12),transparent 46%),radial-gradient(ellipse at 22% 62%,rgba(240,160,80,.14),transparent 50%)',
      layers: [
        stars(91, 30, '#e9e4bd'),
        mountains(92, 600, 170, '#2c4744', 0.6),
        '<g opacity=".5"><rect x="230" y="420" width="26" height="160" fill="#2a3c37"/><ellipse cx="243" cy="400" rx="70" ry="36" fill="#41544b" opacity=".5"/>' +
        '<rect x="360" y="430" width="18" height="150" fill="#2b3c37"/><ellipse cx="369" cy="412" rx="50" ry="26" fill="#41544b" opacity=".45"/></g>',
        forest(93, 820, '#334a3e', 0.9, 16, 1.25),
        totoroTree(1180, 900, 1.45, '#24352d', '#2d4936', '#264131'),
        '<path d="M760 900 q-30 -240 90 -360 q60 -60 100 -180 l26 16 q-40 140 -104 204 q-84 110 -62 320 Z" fill="#22352d"/>',
        '<path d="M0 870 q200 -50 420 0 t440 0 t420 0 t320 0 L1600 900 L0 900 Z" fill="#1d2e27" opacity=".9"/>',
        '<g class="float" style="--dur:9s;--dy:-6px" opacity=".55"><path d="M420 500 q-20 -70 22 -120 l10 8 q-30 44 -10 108 Z" fill="#191f1b"/>' +
        '<path d="M500 520 q-10 -60 30 -100 l10 8 q-30 36 -18 88 Z" fill="#191f1b"/></g>',
        grass(94, 870, '#5f6f45', 90)
      ],
      particles: { kind: 'embers', colors: ['#f0a05a', '#e8784a', '#ffd08a'], count: 24 }
    },

    spirited: {
      photo: 'assets/bg/anime/spirited.webp',
      photoPrimary: true,
      sky: 'linear-gradient(180deg,#0a1222 0%,#141c32 30%,#2b2238 60%,#4a2d33 82%,#6b3a34 100%)',
      sun: { x: '50%', y: '8%', size: '10vmin', color: '#f7e6ba', glow: 'rgba(247,230,186,.2)' },
      haze: 'radial-gradient(ellipse at 50% 11%,rgba(255,225,180,.14),transparent 44%),radial-gradient(ellipse at 66% 52%,rgba(255,160,90,.16),transparent 50%)',
      layers: [
        stars(101, 46, '#d9d3c0'),
        mist(102, 620, '#c9b9b0', 8),
        bathhouse(780, 900, 1.12, '#1d1b27', '#ffb867'),
        sea(0.82, '#161c2b', 0.7, 'rgba(255,190,120,.12)'),
        train(300, 720, 0.8, '#12151f', '#ffbe78'),
        mist(103, 760, '#d8c6b8', 6),
        '<circle class="float" style="--dur:7s;--dy:-10px" cx="340" cy="500" r="12" fill="#ffb867" opacity=".35"/>' +
        '<circle class="float" style="--dur:9s;--dy:-14px" cx="400" cy="430" r="7" fill="#ffb867" opacity=".3"/>' +
        '<circle class="float" style="--dur:8s;--dy:-8px" cx="260" cy="380" r="5" fill="#ffb867" opacity=".25"/>'
      ],
      particles: { kind: 'motes', colors: ['#ffc27a', '#ffdca8', '#e8a86a'], count: 24 }
    },

    howl: {
      photo: 'assets/bg/anime/howl.webp',
      photoPrimary: true,
      sky: 'linear-gradient(180deg,#7fb7c4 0%,#a9d2d2 34%,#d9e0c8 58%,#f4e6c8 82%,#f8edcf 100%)',
      sun: { x: '50%', y: '9%', size: '13vmin', color: '#fff8d8', glow: 'rgba(255,245,200,.3)' },
      haze: 'radial-gradient(ellipse at 50% 12%,rgba(255,250,215,.25),transparent 50%)',
      layers: [
        clouds(111, 0.14, '#fffdf0', 0.58, 6, 1.35),
        hills(112, 690, 70, '#8fa77c', 0.6),
        hills(113, 780, 80, '#6f8c68', 0.75),
        movingCastle(760, 440, 0.92, '#6d6a5c', '#ffce7a'),
        flowers(),
        grass(114, 870, '#8a9a62', 110),
        clouds(116, 0.72, '#f7f3e2', 0.28, 4, 1.1)
      ],
      particles: { kind: 'petals', colors: ['#ffffff', '#f8dea8', '#e8c8d0'], count: 20 }
    },

    ponyo: {
      photo: 'assets/bg/anime/ponyo.webp',
      photoPrimary: true,
      sky: 'linear-gradient(180deg,#5fb4d4 0%,#8fd8e6 36%,#c8ece8 62%,#f7ecc4 84%,#f8dca6 100%)',
      sun: { x: '89%', y: '13%', size: '14vmin', color: '#fffbe4', glow: 'rgba(255,250,215,.35)' },
      haze: 'radial-gradient(ellipse at 86% 16%,rgba(255,255,230,.28),transparent 48%)',
      layers: [
        clouds(121, 0.12, '#ffffff', 0.62, 6, 1.4),
        sea(0.6, '#3f9aa8', 0.7, 'rgba(255,255,255,.28)'),
        island(790, 604, 0.82, '#3f5f58', '#5f8f6a', 14, true),
        smallHouse(790, 598, 0.55, '#e8ddc0', '#b85a4a', '#ffd28a'),
        waves(122, 830, '#4da6b0', '#d8f6f0'),
        boat(430, 655, 0.85, '#3a4c50', '#ffdf8e'),
        birds(123, 7, '#4f7a80', 0.35),
        '<path d="M940 610 q60 -50 130 -30 q-52 40 -130 30 Z" fill="#f2e4bf" opacity=".7"/>'
      ],
      particles: { kind: 'bubbles', colors: ['#e8fbff', '#b8ecf0', '#ffffff'], count: 24 }
    },

    windrises: {
      photo: 'assets/bg/anime/windrises.webp',
      photoPrimary: true,
      sky: 'linear-gradient(180deg,#b9a58a 0%,#d7bc98 32%,#ecd6b1 58%,#f7e9c8 82%,#f6efd8 100%)',
      sun: { x: '58%', y: '11%', size: '12vmin', color: '#fff6d8', glow: 'rgba(255,240,200,.3)' },
      haze: 'radial-gradient(ellipse at 58% 14%,rgba(255,245,210,.25),transparent 55%)',
      layers: [
        clouds(131, 0.12, '#fff9e8', 0.5, 5, 1.2),
        mountains(132, 630, 90, '#b3a184', 0.4),
        airfield(700, '#c4b184', '#7b6a50', '#e8b46a'),
        plane(790, 268, 0.9, '#6f6049', '#e9c47c', true),
        flowers(),
        grass(133, 760, '#8b8455', 80),
        '<g opacity=".65"><path d="M260 690 q40 -70 80 0" stroke="#7c6f52" stroke-width="2" fill="none"/>' +
        '<path d="M300 690 l0 -60 M300 650 l-18 -16 M300 650 l18 -16" stroke="#7c6f52" stroke-width="1.4" fill="none"/></g>'
      ],
      particles: { kind: 'petals', colors: ['#f6e6c0', '#fff3d8'], count: 14 }
    },

    heron: {
      photo: 'assets/bg/anime/heron.webp',
      photoPrimary: false,
      photoOpacity: 0.38,
      photoBlur: '2.2px',
      sky: 'linear-gradient(180deg,#101a34 0%,#1d2a48 28%,#3d3a58 54%,#6b5066 78%,#8d6470 100%)',
      sun: { x: '50%', y: '9%', size: '11vmin', color: '#f4e4c4', glow: 'rgba(244,228,196,.22)' },
      haze: 'radial-gradient(ellipse at 50% 12%,rgba(230,220,200,.18),transparent 48%)',
      layers: [
        stars(141, 70, '#e8e2cf'),
        clouds(142, 0.24, '#8b7b8f', 0.25, 4, 1.3),
        '<path d="M0 760 q260 -90 520 -30 q-80 -100 -240 -120 q-180 -20 -280 40 Z" fill="#1a2434" opacity=".9"/>',
        '<path d="M0 900 L0 720 q300 30 620 140 q240 40 380 40 L1600 900 Z" fill="#141d2b" opacity=".95"/>',
        stoneTower(742, 810, 1.12, '#141d2b', '#ffd08a'),
        stoneTower(1260, 870, 0.55, '#101826', '#e8b46a'),
        '<g class="float" style="--dur:8s;--dy:-12px"><path d="M700 330 l16 -10 l6 18 l-20 4 Z" fill="#2a3348" opacity=".8"/>' +
        '<path d="M520 470 l24 -16 l8 26 l-30 8 Z" fill="#2a3348" opacity=".7"/></g>',
        birds(143, 6, '#a99a9a', 0.4)
      ],
      particles: { kind: 'motes', colors: ['#e8e0c8', '#c8b8b0', '#ffe0a0'], count: 20 }
    },

    glass: {
      sky: 'linear-gradient(180deg,#0d1a24 0%,#1b3038 28%,#3f5a5c 56%,#9fb8b2 82%,#dfe8df 100%)',
      sun: { x: '50%', y: '30%', size: '10vmin', color: '#f4fbf3', glow: 'rgba(230,245,238,.25)' },
      haze: 'radial-gradient(ellipse at 50% 55%,rgba(220,245,240,.18),transparent 60%)',
      layers: [
        stars(151, 50, '#e8f4ee'),
        clouds(152, 0.2, '#d8e8e0', 0.25, 4, 1.3),
        '<path d="M0 760 q280 -100 560 -20 t540 -10 t500 20 L1600 900 L0 900 Z" fill="#15262b" opacity=".7"/>',
        glassSpire(250, 380, 1.15, '#d9efe8', '#ffffff'),
        glassSpire(560, 510, 0.7, '#c8e4dd', '#ffffff'),
        glassSpire(1320, 350, 1.2, '#d9efe8', '#ffffff'),
        glassSpire(1170, 540, 0.65, '#c8e4dd', '#ffffff'),
        glassSphere(800, 330, 72, '#e8fff8', true),
        glassSphere(1150, 235, 34, '#e8fff8', false),
        glassSphere(260, 300, 28, '#e8fff8', false),
        glassSphere(880, 170, 22, '#e8fff8', true),
        '<path d="M0 820 q400 -60 800 0 t800 0 L1600 900 L0 900 Z" fill="#b8cbc4" opacity=".45"/>',
        '<path d="M0 860 q400 -40 800 0 t800 0 L1600 900 L0 900 Z" fill="#dde8e0" opacity=".35"/>',
        mist(153, 820, '#eaf5ee', 6)
      ],
      particles: { kind: 'motes', colors: ['#ffffff', '#d8fff4', '#e8f0e0'], count: 28 }
    },

    /* --- финальные фоны --- */
    dawn: {
      sky: 'linear-gradient(180deg,#284a63 0%,#6b8fa0 26%,#d8a98f 55%,#f6d3a2 78%,#ffe7bd 100%)',
      sun: { x: '30%', y: '58%', size: '20vmin', color: '#fff0c8', glow: 'rgba(255,220,160,.35)' },
      haze: 'radial-gradient(ellipse at 30% 58%,rgba(255,230,180,.28),transparent 52%)',
      layers: [
        stars(161, 18, '#f4efe0'),
        clouds(162, 0.14, '#e8c4b0', 0.3, 4, 1.2),
        cloudSea(163, 660, '#e8cfbf', 0.6),
        lighthouse(1280, 760, 0.95, '#efe2c8', '#b65a49', '#ffe7a8'),
        islands(164, [
          { x: 300, y: 470, s: 0.55, tree: true },
          { x: 960, y: 540, s: 0.35, tree: false }
        ], '#7b7a72', '#7f9a78'),
        '<g class="float" style="--dur:10s;--dy:-9px"><g transform="translate(760 280) scale(.55)">' +
        '<ellipse cx="0" cy="0" rx="120" ry="26" fill="#6b6258"/><path d="M-90 0 q60 40 150 0 l-20 24 l-100 0 Z" fill="#4f4a44"/>' +
        '<path d="M-50 -20 q50 -40 110 0" stroke="#6b6258" stroke-width="8" fill="none"/></g></g>',
        mist(165, 680, '#f5e4cf', 5)
      ],
      particles: { kind: 'motes', colors: ['#ffe8b0', '#fff4d8', '#e8c8a0'], count: 26 }
    },

    free: {
      sky: 'linear-gradient(180deg,#3d85b8 0%,#79b8d8 34%,#b7dbe6 62%,#e8f2e8 84%,#f7f0d8 100%)',
      sun: { x: '72%', y: '20%', size: '16vmin', color: '#fffbe8', glow: 'rgba(255,250,220,.35)' },
      haze: 'radial-gradient(ellipse at 70% 22%,rgba(255,255,235,.3),transparent 50%)',
      layers: [
        clouds(171, 0.12, '#ffffff', 0.6, 7, 1.5),
        cloudSea(172, 700, '#eef6f2', 0.5),
        islands(173, [{ x: 300, y: 430, s: 0.5, tree: true }, { x: 1280, y: 520, s: 0.4, tree: true }], '#8a9a98', '#7fa87c'),
        plane(900, 330, 1.2, '#5a5148', '#e8c47c', true),
        birds(174, 10, '#5d7c80', 0.4),
        clouds(175, 0.76, '#ffffff', 0.35, 5, 1.2)
      ],
      particles: { kind: 'motes', colors: ['#ffffff', '#e8f8f0', '#fff0c8'], count: 20 }
    },

    home: {
      sky: 'linear-gradient(180deg,#7696a8 0%,#a8bca8 30%,#d8c89a 58%,#f0d6a0 82%,#f4dfae 100%)',
      sun: { x: '24%', y: '44%', size: '13vmin', color: '#fff0c8', glow: 'rgba(255,225,170,.3)' },
      haze: 'radial-gradient(ellipse at 30% 60%,rgba(255,230,180,.22),transparent 55%)',
      layers: [
        stars(181, 16, '#f4ead0'),
        hills(182, 700, 70, '#7f9478', 0.6),
        village(183, 890, '#4b5a4b', '#ffd07a', 0.85),
        totoroTree(1240, 900, 1.05, '#36463c', '#46654a', '#3b5841'),
        hills(184, 860, 60, '#3c5042', 0.9),
        grass(185, 880, '#8a9a66', 110),
        '<path d="M260 820 q50 -26 100 0" stroke="#b8b09a" stroke-width="2" fill="none" opacity=".6"/>'
      ],
      particles: { kind: 'fireflies', colors: ['#fff0a8', '#ffe08a'], count: 18 }
    },

    secret: {
      sky: 'linear-gradient(180deg,#050b18 0%,#0e1c30 30%,#1e3348 54%,#4a5a6a 78%,#8a8c82 100%)',
      sun: { x: '50%', y: '26%', size: '17vmin', color: '#f8f4dc', glow: 'rgba(240,240,210,.28)' },
      haze: 'radial-gradient(ellipse at 50% 30%,rgba(240,245,220,.22),transparent 50%)',
      layers: [
        stars(191, 110, '#f2f0dc'),
        clouds(192, 0.2, '#8a9aa0', 0.18, 5, 1.4),
        cloudSea(193, 690, '#b8bca8', 0.45),
        lighthouse(800, 780, 1.15, '#eee4ce', '#b06050', '#ffe8b0'),
        '<circle class="float" style="--dur:9s;--dy:-14px" cx="360" cy="360" r="4" fill="#ffe8a8" opacity=".8"/>' +
        '<circle class="float" style="--dur:7s;--dy:-10px" cx="1180" cy="300" r="3" fill="#ffe8a8" opacity=".7"/>' +
        '<circle class="float" style="--dur:11s;--dy:-18px" cx="980" cy="430" r="5" fill="#ffe8a8" opacity=".6"/>',
        mist(194, 650, '#e8e8d8', 5)
      ],
      particles: { kind: 'motes', colors: ['#fff0b0', '#e8f0d8', '#ffffff'], count: 30 }
    }
  };

  /* дополнительные мелкие элементы */
  function flowers() {
    var r = rngFor(555), s = '', i;
    for (i = 0; i < 46; i++) {
      var x = r() * 1600, y = 790 + r() * 100, h = 12 + r() * 18;
      s += '<path d="M' + P(x) + ' ' + P(y) + ' l0 ' + P(-h) + '" stroke="#6f7f4e" stroke-width="1.4" opacity=".7"/>';
      s += '<circle cx="' + P(x) + '" cy="' + P(y - h) + '" r="' + P(2.4 + r() * 2.6) + '" fill="' +
        (i % 3 === 0 ? '#f7f2dc' : (i % 3 === 1 ? '#e8c88a' : '#e8a8a0')) + '" opacity="' + P(0.5 + r() * 0.4) + '"/>';
    }
    return '<g>' + s + '</g>';
  }

  function islandLayer(seed, items, rock, grassColor) {
    var out = '';
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      out += island(it.x, it.y, it.s, rock, grassColor, seed + i, it.tree);
    }
    return '<g>' + out + '</g>';
  }

  function buildScene(key) {
    var cfg = BGS[key] || BGS.interworld;
    var out = '';
    var scene = '';
    for (var i = 0; i < cfg.layers.length; i++) {
      var l = cfg.layers[i];
      if (typeof l === 'string') scene += l;
    }
    if (cfg.layers.some(function (l) { return l && typeof l === 'object' && l.islands; })) {
      cfg.layers.forEach(function (l) {
        if (l && l.islands) scene += islandLayer(l.seed, l.islands, l.rock, l.grass);
      });
    }
    out += '<svg class="scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + scene + '</svg>';
    return out;
  }

  function applyBackground(el, key) {
    var cfg = BGS[key] || BGS.interworld;
    var html = '<div class="sky" style="background:' + cfg.sky + '"></div>';
    if (cfg.photo) {
      var vars = '';
      if (cfg.photoOpacity != null) vars += '--photo-op:' + cfg.photoOpacity + ';';
      if (cfg.photoBlur) vars += '--photo-blur:' + cfg.photoBlur + ';';
      html += '<div class="bg-photo' + (cfg.photoPrimary ? ' primary' : '') + '"' +
        (vars ? ' style="' + vars + 'background-image:url(\'' + cfg.photo + '\')"' : ' style="background-image:url(\'' + cfg.photo + '\')"') + '></div>';
    }
    if (!cfg.photoPrimary && cfg.sun) {
      html += '<div class="sun" style="left:' + cfg.sun.x + ';top:' + cfg.sun.y + ';width:' + cfg.sun.size + ';height:' + cfg.sun.size +
        ';background:radial-gradient(circle at 42% 38%,#fffdf4 0%,' + cfg.sun.color + ' 48%,' + cfg.sun.color + ' 62%,transparent 74%);--glow:' + cfg.sun.glow + '"></div>';
    }
    if (!cfg.photoPrimary) html += buildScene(key);
    if (!cfg.photoPrimary && cfg.haze) html += '<div class="haze" style="background:' + cfg.haze + '"></div>';
    html += '<div class="vignette"></div>';
    el.innerHTML = html;
    el.dataset.bg = key;
  }

  /* частицы */
  function spawnParticles(container, key) {
    var cfg = BGS[key] || BGS.interworld;
    var pc = cfg.particles || { kind: 'motes', colors: ['#ffffff'], count: 14 };
    container.innerHTML = '';
    var r = rngFor(key.length * 977 + (pc.count || 10));
    var count = Math.min(pc.count || 14, 36);
    for (var i = 0; i < count; i++) {
      var d = document.createElement('i');
      var kind = pc.kind;
      var size = kind === 'spores' ? 2 + r() * 5 : (kind === 'fireflies' ? 2 + r() * 2.5 : 1.5 + r() * 4);
      var color = pc.colors[Math.floor(r() * pc.colors.length)];
      var dur = kind === 'fireflies' ? 9 + r() * 10 : (kind === 'embers' ? 7 + r() * 9 : 10 + r() * 16);
      d.className = 'particle ' + (kind === 'leaves' || kind === 'petals' ? 'leaf' : 'dot');
      d.style.left = (r() * 100) + '%';
      d.style.top = (kind === 'spores' || kind === 'bubbles' || kind === 'embers' || kind === 'motes' || kind === 'fireflies') ? (65 + r() * 40) + '%' : (-10 + r() * 30) + '%';
      d.style.width = size + 'px';
      d.style.height = (kind === 'leaf' || kind === 'petals' ? size * 1.6 : size) + 'px';
      d.style.background = color;
      d.style.boxShadow = (kind === 'fireflies' || kind === 'embers' || kind === 'spores' || kind === 'bubbles') ? '0 0 ' + (4 + size * 2) + 'px ' + color : 'none';
      d.style.setProperty('--dx', (r() * 120 - 60) + 'px');
      d.style.setProperty('--dy', (kind === 'spores' || kind === 'bubbles' || kind === 'embers' || kind === 'motes' || kind === 'fireflies') ? (60 + r() * 100) + 'px' : (60 + r() * 100) + 'px');
      d.style.setProperty('--rot', (r() * 260 - 130) + 'deg');
      d.style.setProperty('--op', 0.25 + r() * 0.55);
      d.style.animationDuration = dur + 's';
      d.style.animationDelay = (-r() * dur) + 's';
      d.style.animationName = (kind === 'motes' || kind === 'fireflies' || kind === 'spores' || kind === 'bubbles' || kind === 'embers') ? 'rise' : 'fall';
      if (kind === 'rain') {
        d.style.width = '1px'; d.style.height = (12 + r() * 14) + 'px'; d.style.opacity = '.4';
      }
      container.appendChild(d);
    }
  }

  window.WorldArt = {
    BG: BGS,
    keys: Object.keys(BGS),
    applyBackground: applyBackground,
    spawnParticles: spawnParticles
  };
})();
