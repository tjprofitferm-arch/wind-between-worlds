/* ============================================================
   chars.js — портреты персонажей, нарисованные кодом
   ============================================================ */
(function () {
  'use strict';

  var MOODS = {
    neutral: { open: 1, mouth: 'small', brow: 'neutral' },
    soft: { open: 0.7, mouth: 'soft', brow: 'gentle' },
    smile: { open: 0.8, mouth: 'smile', brow: 'gentle' },
    happy: { closed: 'happy', mouth: 'grin', brow: 'gentle', blush: true },
    laugh: { closed: 'happy', mouth: 'grin', brow: 'gentle', blush: true },
    sad: { open: 0.68, mouth: 'frown', brow: 'sad' },
    worry: { open: 0.88, mouth: 'frown', brow: 'sad' },
    surprised: { open: 1.18, mouth: 'o', brow: 'up', pupil: 0.78 },
    determined: { open: 0.84, mouth: 'line', brow: 'angry' },
    angry: { open: 0.9, mouth: 'frown', brow: 'angry' },
    scared: { open: 1.25, mouth: 'o', brow: 'up', pupil: 0.68 },
    crying: { closed: 'sad', mouth: 'frown', brow: 'sad', tears: true },
    shy: { open: 0.6, mouth: 'soft', brow: 'gentle', blush: true },
    mysterious: { open: 0.8, mouth: 'line', brow: 'neutral' },
    sleepy: { closed: 'sad', mouth: 'soft', brow: 'gentle' },
    tender: { open: 0.52, mouth: 'soft', brow: 'gentle', blush: true }
  };

  /* Официальные кадры/портреты персонажей (неофициальный фанатский проект).
     Права на изображения принадлежат Studio Ghibli. */
  var PHOTOS = {
    conan: 'assets/char/cut/conan_v3.webp',
    lana: 'assets/char/cut/lana_v4.webp',
    lupin: 'assets/char/cut/lupin_v2.webp',
    clarisse: 'assets/char/cut/clarisse_v12.webp',
    nausicaa: 'assets/char/cut/nausicaa.webp',
    asbel: 'assets/char/cut/asbel.webp',
    pazu: 'assets/char/cut/pazu_v2.webp',
    sheeta: 'assets/char/cut/sheeta.webp',
    satsuki: 'assets/char/cut/satsuki.webp',
    mei: 'assets/char/cut/mei.webp',
    totoro: 'assets/char/cut/totoro_v2.webp',
    kiki: 'assets/char/cut/kiki_v20.webp',
    jiji: 'assets/char/cut/jiji_v2.webp',
    porco: 'assets/char/cut/porco.webp',
    fio: 'assets/char/cut/fio.webp',
    san: 'assets/char/cut/san.webp',
    ashitaka: 'assets/char/cut/ashitaka_v2.webp',
    chihiro: 'assets/char/cut/chihiro.webp',
    haku: 'assets/char/cut/haku.webp',
    sophie: 'assets/char/cut/sophie_pad.webp',
    howl: 'assets/char/cut/howl_v5.webp',
    calcifer: 'assets/char/cut/calcifer.webp',
    sosuke: 'assets/char/cut/sosuke.webp',
    ponyo: 'assets/char/cut/ponyo.webp',
    jiro: 'assets/char/cut/jiro.webp',
    nahoko: 'assets/char/cut/nahoko.webp',
    mahito: 'assets/char/cut/mahito_v2.webp',
    heron: 'assets/char/cut/heron_v2.webp',
    eboshi: 'assets/char/cut/eboshi.webp',
    yubaba: 'assets/char/cut/yubaba_v2.webp',
    dola: 'assets/char/cut/dola_v3.webp',
    dreamer: 'assets/char/cut/dreamer_young.webp',
    couple: 'assets/char/cut/couple_v3.webp'
  };
  var PHOTO_FOCUS = {
    conan: '50% 50%', lana: '50% 30%', lupin: '50% 50%', clarisse: '50% 30%',
    nausicaa: '50% 22%', asbel: '50% 22%', pazu: '50% 30%', sheeta: '50% 18%',
    satsuki: '50% 22%', mei: '50% 20%', totoro: '50% 30%', kiki: '50% 50%',
    jiji: '50% 35%', porco: '50% 30%', fio: '50% 22%', san: '50% 18%',
    ashitaka: '50% 25%', chihiro: '50% 20%', haku: '50% 18%', sophie: '50% 30%',
    howl: '50% 30%', calcifer: '50% 50%', sosuke: '50% 22%', ponyo: '50% 32%',
    jiro: '50% 18%', nahoko: '50% 20%', mahito: '50% 25%', heron: '50% 35%',
    eboshi: '50% 18%', yubaba: '50% 35%', dola: '50% 30%',
    dreamer: '50% 30%', couple: '50% 30%'
  };
  /* Масштаб контейнера вырезки: contain не режет силуэт, а zoom возвращает
     портретам прежнюю высоту. Для широких кадров масштаб ограничен, чтобы
     весь персонаж/пузырь оставался в кадре. */
  var PHOTO_ZOOM = {
    clarisse: 0.9, yubaba: 0.98, dola: 1.2, ponyo: 1.14, heron: 1.05,
    mahito: 1.04, porco: 1.1, mei: 1.15, calcifer: 1.15, conan: 1.0,
    totoro: 1.0, howl: 1.04, sophie: 1.0, haku: 1.22, fio: 1.22,
    sheeta: 1.16, ashitaka: 1.0, kiki: 1.0, pazu: 1.0, asbel: 1.02,
    lana: 1.2, lupin: 1.0, jiji: 0.72,
    jiro: 1.02, sosuke: 1.02, nausicaa: 1.02, nahoko: 1.02, eboshi: 1.02,
    dreamer: 1.0, couple: 1.0
  };

  /* Кадры-выражения, вырезанные из аниме. Если для настроения нет
     отдельного кадра, остаётся основной портрет + аниме-акцент. */
  var USE_PHOTO_MOODS = false; /* старые кадры-выражения содержат фон; оставляем настроение фильтрам */
  var PHOTO_MOODS = {
    nausicaa: {
      sad: ['assets/exp/cut/nausicaa_sad.webp', '50% 30%'],
      worry: ['assets/exp/cut/nausicaa_worry.webp', '50% 30%'],
      surprised: ['assets/exp/cut/nausicaa_surprised.webp', '50% 30%'],
      determined: ['assets/exp/cut/nausicaa_worry.webp', '50% 30%']
    },
    chihiro: {
      sad: ['assets/exp/cut/chihiro_sad.webp', '50% 32%'],
      worry: ['assets/exp/cut/chihiro_worry.webp', '50% 30%'],
      scared: ['assets/exp/cut/chihiro_scared.webp', '50% 30%'],
      surprised: ['assets/exp/cut/chihiro_scared.webp', '50% 30%']
    },
    satsuki: {
      happy: ['assets/exp/cut/satsuki_happy.webp', '50% 30%'],
      laugh: ['assets/exp/cut/satsuki_happy.webp', '50% 30%'],
      smile: ['assets/exp/cut/satsuki_happy.webp', '50% 30%'],
      scared: ['assets/exp/cut/satsuki_scared2.webp', '50% 30%'],
      worry: ['assets/exp/cut/satsuki_scared2.webp', '50% 30%'],
      surprised: ['assets/exp/cut/satsuki_scared2.webp', '50% 30%']
    },
    mahito: {
      neutral: ['assets/exp/cut/mahito_neutral.webp', '50% 30%'],
      determined: ['assets/exp/cut/mahito_neutral.webp', '50% 30%'],
      angry: ['assets/exp/cut/mahito_neutral.webp', '50% 30%']
    },
    kiki: {
      happy: ['assets/exp/cut/kiki_joy.webp', '50% 30%'],
      laugh: ['assets/exp/cut/kiki_joy.webp', '50% 30%'],
      smile: ['assets/exp/cut/kiki_happy.webp', '50% 30%']
    },
    pazu: {
      happy: ['assets/exp/cut/pazu_happy.webp', '50% 30%'],
      smile: ['assets/exp/cut/pazu_happy.webp', '50% 30%']
    },
    asbel: {
      happy: ['assets/exp/cut/asbel_happy.webp', '50% 30%'],
      smile: ['assets/exp/cut/asbel_happy.webp', '50% 30%']
    },
    sophie: {
      sad: ['assets/exp/cut/sophie_worry.webp', '50% 30%'],
      worry: ['assets/exp/cut/sophie_worry.webp', '50% 30%'],
      scared: ['assets/exp/cut/sophie_worry.webp', '50% 30%']
    },
    howl: {
      sad: ['assets/exp/cut/howl_sad.webp', '50% 30%'],
      worry: ['assets/exp/cut/howl_sad.webp', '50% 30%'],
      crying: ['assets/exp/cut/howl_sad.webp', '50% 30%']
    },
    san: {
      determined: ['assets/exp/cut/san_determined.webp', '50% 30%'],
      angry: ['assets/exp/cut/san_determined.webp', '50% 30%']
    },
    porco: {
      neutral: ['assets/exp/cut/porco_neutral.webp', '50% 30%'],
      happy: ['assets/exp/cut/porco_neutral.webp', '50% 30%'],
      laugh: ['assets/exp/cut/porco_neutral.webp', '50% 30%'],
      smile: ['assets/exp/cut/porco_neutral.webp', '50% 30%'],
      sad: ['assets/exp/cut/porco_neutral.webp', '50% 30%'],
      worry: ['assets/exp/cut/porco_neutral.webp', '50% 30%'],
      angry: ['assets/exp/cut/porco_neutral.webp', '50% 30%'],
      determined: ['assets/exp/cut/porco_neutral.webp', '50% 30%']
    }
  };

  function moodGroup(m) {
    if (m === 'happy' || m === 'laugh' || m === 'smile') return 'happy';
    if (m === 'sad' || m === 'crying') return 'sad';
    if (m === 'worry') return 'worry';
    if (m === 'scared') return 'scared';
    if (m === 'angry' || m === 'determined') return 'determined';
    if (m === 'surprised') return 'surprised';
    if (m === 'shy' || m === 'tender') return 'shy';
    return 'neutral';
  }

  /* Полноростные вырезки приподнимаем над диалоговым окном, чтобы не терять
     ступни и подол. На узких экранах окно и так ниже персонажа. */
  var PHOTO_LIFT = { pazu: 1, ashitaka: 1, totoro: 1, jiji: 1, kiki: 1 };

  function photoPortrait(id, mood) {
    var group = moodGroup(mood);
    var alt = USE_PHOTO_MOODS && PHOTO_MOODS[id] && PHOTO_MOODS[id][group];
    var src = alt ? alt[0] : PHOTOS[id];
    var focus = alt ? alt[1] : (PHOTO_FOCUS[id] || '50% 20%');
    var zoom = PHOTO_ZOOM[id] || 1;
    var lift = PHOTO_LIFT[id] ? ';--plift:clamp(90px,17.5vh,140px)' : '';
    var cut = ' cut';
    return '<div class="portrait-photo mood-' + mood + ' expr-' + group + cut + '" ' +
      'data-char="' + id + '" data-mood="' + mood + '" style="--focus:' + focus + ';--pzoom:' + zoom + lift + '">' +
      '<img src="' + src + '" alt="" draggable="false">' +
      '<span class="expr-mark" aria-hidden="true"></span>' +
      '</div>';
  }

  function has(c, a) { return c.acc && c.acc.indexOf(a) >= 0; }

  /* ------------------ лицо ------------------ */

  function eyeShape(c, es, open, closed, pupil) {
    var lash = c.lash || '#3a2c27';
    if (closed) {
      var curve = closed === 'happy' ? 'M-20 2 Q0 -15 20 2' : 'M-19 0 Q0 11 19 0';
      return '<g>' +
        '<path d="' + curve + '" stroke="' + lash + '" stroke-width="3.8" fill="none" stroke-linecap="round"/>' +
        '<path d="M20 2 l6 -5" stroke="' + lash + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '</g>';
    }
    var pr = 7 * (pupil == null ? 1 : pupil);
    return '<g transform="scale(' + es + ')">' +
      '<g transform="scale(1 ' + open + ')">' +
      '<path d="M-22 0 Q-18 -20 0 -21 Q19 -20 22 0 Q17 18 0 19 Q-17 18 -22 0 Z" fill="#fffdf7"/>' +
      '<ellipse cx="0" cy="0" rx="13" ry="15.4" fill="' + c.eye + '"/>' +
      '<circle cx="0" cy="1" r="' + pr + '" fill="#1d2325"/>' +
      '<circle cx="-5" cy="-6" r="4.4" fill="#ffffff" opacity=".95"/>' +
      '<circle cx="6" cy="7" r="1.9" fill="#ffffff" opacity=".72"/>' +
      '<path d="M-12 9 Q0 16 12 9" stroke="' + c.eye + '" stroke-width="1.8" fill="none" opacity=".45"/>' +
      '</g>' +
      '<path d="M-24 -1 Q-19 -24 1 -22 Q20 -21 24 1" stroke="' + lash + '" stroke-width="4.8" fill="none" stroke-linecap="round"/>' +
      '<path d="M24 1 l7 -6" stroke="' + lash + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
      '</g>';
  }

  function eyePair(c, m) {
    var age = c.age === 'child' ? 1.08 : c.age === 'teen' ? 1.02 : c.age === 'old' ? 0.86 : 0.98;
    var es = age * (c.eyeScale || 1);
    var open = m.open == null ? 1 : m.open;
    var closed = m.closed || null;
    var left = '<g transform="translate(150 208)">' + eyeShape(c, es, open, closed, m.pupil) + '</g>';
    var right = '<g transform="translate(210 208) scale(-1 1)">' + eyeShape(c, es, open, closed, m.pupil) + '</g>';
    return left + right;
  }

  function brows(c, m) {
    var col = c.browColor || c.lash || c.hair;
    var d;
    switch (m.brow) {
      case 'angry': d = 'M-19 -3 Q0 3 18 11'; break;
      case 'sad': d = 'M-19 9 Q0 0 18 -8'; break;
      case 'up': d = 'M-19 -7 Q0 -13 18 -8'; break;
      case 'gentle': d = 'M-19 5 Q0 -2 18 0'; break;
      default: d = 'M-19 2 Q0 -5 18 -1';
    }
    var w = c.browWidth || (c.age === 'old' ? 5.2 : 4.2);
    return '<g transform="translate(148 ' + (c.browY || 174) + ')">' +
      '<path d="' + d + '" stroke="' + col + '" stroke-width="' + w + '" fill="none" stroke-linecap="round"/>' +
      '</g>' +
      '<g transform="translate(212 ' + (c.browY || 174) + ') scale(-1 1)">' +
      '<path d="' + d + '" stroke="' + col + '" stroke-width="' + w + '" fill="none" stroke-linecap="round"/>' +
      '</g>';
  }

  function mouth(c, m) {
    var lip = c.lip || '#a9635b';
    var y = 253;
    switch (m.mouth) {
      case 'smile':
        return '<path d="M165 248 Q180 264 195 248" stroke="' + lip + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
      case 'grin':
        return '<path d="M162 247 Q180 268 198 247 Q180 257 162 247 Z" fill="#7c4343" stroke="' + lip + '" stroke-width="2"/>' +
          '<path d="M170 250 Q180 254 190 250" stroke="#fff4e8" stroke-width="3" fill="none" opacity=".85"/>';
      case 'frown':
        return '<path d="M168 258 Q180 247 192 258" stroke="' + lip + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
      case 'o':
        return '<ellipse cx="180" cy="254" rx="7.5" ry="10.5" fill="#743e3e"/>' +
          '<ellipse cx="180" cy="257" rx="4" ry="5" fill="#4f2a2c"/>';
      case 'line':
        return '<path d="M170 253 Q180 251 190 253" stroke="' + lip + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
      case 'soft':
        return '<path d="M171 250 Q180 257 189 250" stroke="' + lip + '" stroke-width="2.3" fill="none" stroke-linecap="round"/>';
      default:
        return '<path d="M171 251 Q180 257 189 251" stroke="' + lip + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    }
  }

  function face(c, m) {
    var skin = c.skin, shade = c.shade || 'rgba(120,70,50,.12)';
    var out = '';
    out += '<path d="M108 196 C108 268 140 294 180 294 C220 294 252 268 252 196 C252 120 224 94 180 94 C136 94 108 120 108 196 Z" fill="' + skin + '"/>';
    out += '<path d="M180 294 C150 294 124 270 116 236 C122 276 146 302 180 302 C214 302 238 276 244 236 C236 270 210 294 180 294 Z" fill="' + shade + '"/>';
    /* глаза, брови, нос, рот */
    out += eyePair(c, m);
    out += brows(c, m);
    out += '<path d="M179 228 q6 5 0 9" stroke="rgba(120,70,50,.35)" stroke-width="2" fill="none" stroke-linecap="round"/>';
    if (m.blush) {
      out += '<ellipse cx="128" cy="240" rx="16" ry="8" fill="#e88f7e" opacity=".18"/>';
      out += '<ellipse cx="232" cy="240" rx="16" ry="8" fill="#e88f7e" opacity=".18"/>';
    }
    out += mouth(c, m);
    if (m.tears) {
      out += '<path d="M136 224 q-2 12 2 18 q4 -6 2 -18 Z" fill="#a8d8e8" opacity=".75"/>';
      out += '<path d="M224 224 q2 12 -2 18 q-4 -6 -2 -18 Z" fill="#a8d8e8" opacity=".75"/>';
    }
    if (c.age === 'old') {
      out += '<path d="M130 246 q10 5 20 2 M210 246 q10 3 20 -2" stroke="rgba(120,70,50,.22)" stroke-width="1.5" fill="none"/>';
    }
    return out;
  }

  /* ------------------ волосы ------------------ */

  function hairBack(c) {
    var h = c.hair, d = c.hairDark || 'rgba(0,0,0,.16)';
    var s = '';
    switch (c.style) {
      case 'bob':
        s = '<path d="M100 230 C82 150 110 80 180 78 C250 80 278 150 260 230 L274 320 C258 338 238 310 234 286 L126 286 C122 310 102 338 86 320 Z" fill="' + h + '"/>' +
          '<path d="M180 80 C226 82 256 126 258 188 C250 140 226 108 180 100 Z" fill="' + d + '"/>';
        break;
      case 'long':
        s = '<path d="M100 220 C82 140 112 76 180 74 C248 76 278 140 260 220 L292 400 C274 430 246 408 238 360 L122 360 C114 408 86 430 68 400 Z" fill="' + h + '"/>' +
          '<path d="M180 76 C238 78 268 132 260 220 L292 400 C274 430 246 408 238 360 L232 300 C244 236 226 120 180 96 Z" fill="' + d + '"/>';
        break;
      case 'wavy':
        s = '<path d="M98 220 C80 140 112 74 180 72 C248 74 280 140 262 220 L296 380 q-14 26 -30 10 q-8 34 -26 20 q-4 24 -22 12 L262 360 q10 -120 -82 -264 Z" fill="' + h + '"/>' +
          '<path d="M180 74 C242 76 272 136 262 220 L294 376 q-14 24 -30 10 q-8 30 -24 18 L258 356 q10 -122 -78 -260 Z" fill="' + d + '"/>';
        break;
      case 'short':
        s = '<path d="M106 210 C98 140 130 90 180 90 C230 90 262 140 254 210 L240 246 L120 246 Z" fill="' + h + '"/>';
        break;
      case 'spiky':
        s = '<path d="M102 220 L84 176 L106 178 L92 130 L124 144 L120 96 L152 120 L160 78 L188 112 L208 82 L220 122 L250 100 L250 144 L278 132 L266 176 L282 190 L258 230 L244 250 L116 250 Z" fill="' + h + '"/>';
        break;
      case 'ponytail':
        s = '<path d="M100 230 C82 150 110 80 180 78 C250 80 278 150 260 230 L270 292 L90 292 Z" fill="' + h + '"/>' +
          '<path d="M252 112 C304 128 326 196 312 268 C306 296 286 302 276 286 C294 240 286 184 240 148 Z" fill="' + h + '"/>' +
          '<path d="M258 122 C296 142 312 194 302 252 C296 274 286 282 280 270 C292 226 282 178 248 152 Z" fill="' + d + '"/>';
        break;
      case 'pigtails':
        s = '<path d="M100 230 C82 150 110 80 180 78 C250 80 278 150 260 230 L266 284 L94 284 Z" fill="' + h + '"/>' +
          '<path d="M98 214 C66 244 58 318 78 356 C94 384 116 352 110 322 C104 288 110 248 128 222 Z" fill="' + h + '"/>' +
          '<path d="M262 214 C294 244 302 318 282 356 C266 384 244 352 250 322 C256 288 250 248 232 222 Z" fill="' + h + '"/>' +
          '<circle cx="82" cy="344" r="10" fill="' + (c.tie || '#b84a4a') + '"/><circle cx="278" cy="344" r="10" fill="' + (c.tie || '#b84a4a') + '"/>';
        break;
      case 'twin':
        s = '<path d="M104 220 C90 146 128 88 180 88 C232 88 270 146 256 220 L258 262 L102 262 Z" fill="' + h + '"/>' +
          '<ellipse cx="102" cy="126" rx="28" ry="34" fill="' + h + '"/><ellipse cx="258" cy="126" rx="28" ry="34" fill="' + h + '"/>' +
          '<path d="M84 144 q-24 50 -10 100 q6 20 18 6 q10 -26 2 -58 q-4 -24 -10 -48 Z" fill="' + h + '"/>' +
          '<path d="M276 144 q24 50 10 100 q-6 20 -18 6 q-10 -26 -2 -58 q4 -24 10 -48 Z" fill="' + h + '"/>';
        break;
      case 'braids':
        s = '<path d="M100 220 C82 140 112 76 180 74 C248 76 278 140 260 220 L282 340 L250 344 L236 280 L124 280 L110 344 L78 340 Z" fill="' + h + '"/>' +
          '<path d="M180 76 C240 78 270 134 260 220 L280 334 L252 338 L240 280 L232 300 Z" fill="' + d + '"/>';
        break;
      case 'slick':
        s = '<path d="M104 216 C100 142 132 94 180 92 C228 94 260 142 256 216 L248 240 L112 240 Z" fill="' + h + '"/>' +
          '<path d="M130 126 Q180 104 232 130" stroke="' + d + '" stroke-width="2" fill="none"/>' +
          '<path d="M124 148 Q180 124 238 152" stroke="' + d + '" stroke-width="2" fill="none"/>';
        break;
      case 'hood':
        s = '<path d="M76 480 C62 330 84 86 180 70 C276 86 298 330 284 480 Z" fill="' + h + '"/>' +
          '<path d="M106 250 C106 150 136 104 180 102 C224 104 254 150 254 250 L248 330 L112 330 Z" fill="' + d + '"/>';
        break;
      case 'bald':
        s = '<path d="M104 216 q-2 -42 24 -70 q-8 44 4 70 Z" fill="' + h + '"/>' +
          '<path d="M256 216 q2 -42 -24 -70 q8 44 -4 70 Z" fill="' + h + '"/>';
        break;
      default:
        s = '<path d="M100 230 C82 150 110 80 180 78 C250 80 278 150 260 230 L274 320 C258 338 238 310 234 286 L126 286 C122 310 102 338 86 320 Z" fill="' + h + '"/>';
    }
    return s;
  }

  function hairFront(c) {
    var h = c.hair, d = c.hairDark || 'rgba(0,0,0,.15)';
    switch (c.style) {
      case 'bob':
        return '<path d="M108 196 C102 116 138 84 180 84 C226 84 260 120 256 196 C242 158 222 138 206 136 C198 164 172 176 148 164 C134 176 118 186 108 196 Z" fill="' + h + '"/>' +
          '<path d="M108 188 C98 236 104 270 118 286 C110 248 112 218 120 198 Z" fill="' + h + '"/>' +
          '<path d="M252 188 C262 236 256 270 242 286 C250 248 248 218 240 198 Z" fill="' + h + '"/>' +
          '<path d="M150 90 C180 92 208 104 222 126" stroke="' + d + '" stroke-width="2" fill="none"/>';
      case 'long':
      case 'wavy':
        return '<path d="M108 190 C106 112 140 82 178 82 C182 112 178 128 168 140 C156 154 146 168 144 192 C132 180 118 180 108 190 Z" fill="' + h + '"/>' +
          '<path d="M252 190 C254 112 220 82 182 82 C178 112 182 128 192 140 C204 154 214 168 216 192 C228 180 242 180 252 190 Z" fill="' + h + '"/>' +
          '<path d="M116 186 C108 232 114 268 128 286 C120 246 120 216 126 196 Z" fill="' + h + '"/>' +
          '<path d="M244 186 C252 232 246 268 232 286 C240 246 240 216 234 196 Z" fill="' + h + '"/>';
      case 'short':
        return '<path d="M108 184 C112 116 138 86 180 86 C220 86 250 116 254 184 C242 164 232 150 220 148 C210 166 190 174 170 168 C158 180 130 182 108 184 Z" fill="' + h + '"/>' +
          '<path d="M220 148 C214 160 196 168 178 166" stroke="' + d + '" stroke-width="2" fill="none"/>';
      case 'spiky':
        return '<path d="M106 186 L120 138 L140 152 L150 112 L172 144 L190 116 L204 150 L230 128 L238 166 L256 184 C238 162 214 148 192 150 C168 154 144 162 128 178 Z" fill="' + h + '"/>';
      case 'ponytail':
        return '<path d="M106 190 C108 116 140 84 184 84 C228 86 258 120 256 190 C240 158 220 140 202 136 C188 160 160 172 136 164 C126 174 114 182 106 190 Z" fill="' + h + '"/>' +
          '<path d="M186 88 C206 94 222 108 230 128" stroke="' + d + '" stroke-width="2.2" fill="none"/>';
      case 'pigtails':
        return '<path d="M108 184 C110 116 140 86 180 86 C220 86 250 116 252 184 C240 156 222 146 206 144 L154 144 C138 146 120 156 108 184 Z" fill="' + h + '"/>' +
          '<path d="M154 144 C166 156 194 156 206 144" stroke="' + d + '" stroke-width="2" fill="none"/>';
      case 'twin':
        return '<path d="M112 196 C110 130 140 98 180 98 C220 98 250 130 248 196 C236 166 220 152 206 150 L154 150 C140 152 124 166 112 196 Z" fill="' + h + '"/>';
      case 'braids':
        return '<path d="M108 190 C106 116 140 84 178 84 C182 110 178 126 168 138 C156 152 146 166 144 190 C132 178 118 178 108 190 Z" fill="' + h + '"/>' +
          '<path d="M252 190 C254 116 220 84 182 84 C178 110 182 126 192 138 C204 152 214 166 216 190 C228 178 242 178 252 190 Z" fill="' + h + '"/>' +
          /* косы */
          '<g fill="' + h + '">' +
          '<ellipse cx="112" cy="300" rx="14" ry="20"/><ellipse cx="108" cy="330" rx="13" ry="18"/><ellipse cx="112" cy="358" rx="12" ry="16"/>' +
          '<ellipse cx="248" cy="300" rx="14" ry="20"/><ellipse cx="252" cy="330" rx="13" ry="18"/><ellipse cx="248" cy="358" rx="12" ry="16"/>' +
          '</g>' +
          '<circle cx="112" cy="378" r="7" fill="' + (c.tie || '#b84a4a') + '"/><circle cx="248" cy="378" r="7" fill="' + (c.tie || '#b84a4a') + '"/>';
      case 'slick':
        return '<path d="M108 192 C104 132 134 92 180 90 C226 92 256 132 252 192 C244 162 230 142 212 136 Q180 126 148 136 C130 142 116 162 108 192 Z" fill="' + h + '"/>' +
          '<path d="M112 178 q-5 36 7 62 l-15 1 q-8 -40 -4 -64 Z" fill="' + h + '"/>' +
          '<path d="M248 178 q5 36 -7 62 l15 1 q8 -40 4 -64 Z" fill="' + h + '"/>' +
          '<path d="M136 142 Q180 124 224 142" stroke="' + d + '" stroke-width="2" fill="none"/>' +
          '<path d="M180 126 Q210 132 228 148" stroke="' + d + '" stroke-width="2" fill="none"/>';
      case 'hood':
        return '<path d="M112 220 C110 150 140 112 180 110 C220 112 250 150 248 220 C238 188 216 170 180 168 C144 170 122 188 112 220 Z" fill="' + h + '" opacity=".55"/>';
      case 'bald':
        return '';
      default:
        return '';
    }
  }

  function accessories(c) {
    var s = '';
    var gold = c.accColor || '#c9a35c';
    if (has(c, 'goggles')) {
      s += '<g>' +
        '<path d="M112 126 Q180 108 248 126" stroke="' + (c.strap || '#6a4a32') + '" stroke-width="11" fill="none" opacity=".92"/>' +
        '<circle cx="146" cy="122" r="24" fill="' + (c.glass || '#9ecfc6') + '" stroke="' + gold + '" stroke-width="6"/>' +
        '<circle cx="214" cy="122" r="24" fill="' + (c.glass || '#9ecfc6') + '" stroke="' + gold + '" stroke-width="6"/>' +
        '<path d="M132 112 q8 -8 18 -4" stroke="#ffffff" stroke-width="3" fill="none" opacity=".55"/>' +
        '<path d="M200 112 q8 -8 18 -4" stroke="#ffffff" stroke-width="3" fill="none" opacity=".55"/>' +
        '<path d="M170 120 h20" stroke="' + gold + '" stroke-width="5"/>' +
        '</g>';
    }
    if (has(c, 'cap')) {
      s += '<g>' +
        '<path d="M110 136 Q116 76 180 72 Q244 76 250 136 Q212 116 180 116 Q148 116 110 136 Z" fill="' + (c.cap || '#7a5a3f') + '"/>' +
        '<path d="M106 134 Q152 158 214 134 Q206 146 178 148 Q142 148 106 134 Z" fill="' + (c.cap || '#7a5a3f') + '" opacity=".85"/>' +
        '<path d="M130 112 Q180 92 230 114" stroke="rgba(0,0,0,.18)" stroke-width="2" fill="none"/>' +
        '</g>';
    }
    if (has(c, 'bow')) {
      s += '<g transform="translate(248 112) rotate(14)">' +
        '<path d="M0 0 L-30 -16 L-30 16 Z" fill="' + (c.bow || '#b84a4a') + '"/>' +
        '<path d="M0 0 L30 -16 L30 16 Z" fill="' + (c.bow || '#b84a4a') + '"/>' +
        '<circle cx="0" cy="0" r="6" fill="' + (c.bow || '#b84a4a') + '"/>' +
        '</g>';
    }
    if (has(c, 'crown')) {
      s += '<path d="M136 118 L148 96 L164 112 L180 90 L196 112 L212 96 L224 118 Z" fill="' + gold + '" opacity=".9"/>' +
        '<circle cx="180" cy="112" r="5" fill="#e8f4ee"/>';
    }
    if (has(c, 'tiara')) {
      s += '<path d="M146 122 Q180 104 214 122" stroke="' + gold + '" stroke-width="4" fill="none"/>' +
        '<circle cx="180" cy="112" r="6" fill="#b8e0e8" stroke="' + gold + '" stroke-width="2"/>';
    }
    if (has(c, 'glasses')) {
      s += '<g fill="none" stroke="#3a3a38" stroke-width="2.2" opacity=".85">' +
        '<circle cx="148" cy="208" r="27"/><circle cx="212" cy="208" r="27"/>' +
        '<path d="M175 205 q5 -5 10 0"/><path d="M121 204 q-12 -4 -18 2"/><path d="M239 204 q12 -4 18 2"/>' +
        '</g>' +
        '<path d="M130 194 q10 -10 22 -8" stroke="#ffffff" stroke-width="2" fill="none" opacity=".4"/>';
    }
    if (has(c, 'beard')) {
      s += '<path d="M116 222 Q120 330 180 352 Q240 330 244 222 Q232 292 180 300 Q128 292 116 222 Z" fill="' + (c.beard || '#e8e2d6') + '"/>' +
        '<path d="M146 250 Q180 236 214 250 Q196 270 180 268 Q160 270 146 250 Z" fill="' + (c.beard || '#e8e2d6') + '"/>' +
        '<path d="M150 288 Q180 300 210 288" stroke="rgba(0,0,0,.1)" stroke-width="2" fill="none"/>';
    }
    if (has(c, 'mustache')) {
      s += '<path d="M156 244 Q180 234 204 244 Q194 252 180 249 Q166 252 156 244 Z" fill="' + (c.beard || '#d8d2c4') + '"/>';
    }
    if (has(c, 'snout')) {
      s += '<ellipse cx="180" cy="236" rx="20" ry="15" fill="' + (c.snout || '#e8a898') + '"/>' +
        '<circle cx="173" cy="236" r="4" fill="#8a5a52" opacity=".8"/><circle cx="187" cy="236" r="4" fill="#8a5a52" opacity=".8"/>';
    }
    if (has(c, 'earring')) {
      s += '<circle cx="258" cy="224" r="4" fill="' + gold + '"/>';
    }
    if (has(c, 'paint')) {
      s += '<path d="M130 244 l16 -6 l-6 16 Z" fill="#b84a3a" opacity=".75"/>' +
        '<path d="M230 244 l-16 -6 l6 16 Z" fill="#b84a3a" opacity=".75"/>';
    }
    if (has(c, 'fur')) {
      s += '<path d="M112 332 Q128 300 152 314 Q166 292 180 310 Q194 292 208 314 Q232 300 248 332 Q220 356 180 348 Q140 356 112 332 Z" fill="' + (c.fur || '#e8e2d4') + '"/>' +
        '<path d="M124 332 q10 -8 18 0 M146 326 q8 -8 16 0 M178 324 q8 -8 16 0 M210 326 q8 -8 16 0" stroke="rgba(0,0,0,.1)" stroke-width="1.5" fill="none"/>';
    }
    if (has(c, 'pendant')) {
      s += '<g><path d="M180 350 l11 10 l-11 18 l-11 -18 Z" fill="#bfe8e0" opacity=".92"/>' +
        '<circle cx="180" cy="360" r="16" fill="#bfe8e0" opacity=".12"/></g>';
    }
    if (has(c, 'bandage')) {
      s += '<path d="M198 236 l24 8 l-6 16 l-24 -8 Z" fill="#e8dcc4" opacity=".9"/>';
    }
    if (has(c, 'feather')) {
      s += '<path d="M240 120 q30 -40 44 -36 q-6 30 -34 50 Z" fill="' + (c.feather || '#b8b8ac') + '" opacity=".9"/>' +
        '<path d="M244 122 q20 -24 38 -34" stroke="rgba(0,0,0,.15)" stroke-width="1.5" fill="none"/>';
    }
    if (has(c, 'shell')) {
      s += '<g transform="translate(238 132)"><path d="M0 0 q-14 -18 0 -26 q14 8 0 26 Z" fill="#f2c8a8"/>' +
        '<path d="M0 0 v-24 M0 -6 l-8 -12 M0 -6 l8 -12" stroke="#c88a6a" stroke-width="1.4" fill="none"/></g>';
    }
    if (has(c, 'bun')) {
      s += '<g><circle cx="258" cy="150" r="34" fill="' + (c.bun || c.hair || '#c8c0b0') + '"/>' +
        '<path d="M232 136 q26 -18 52 0" stroke="rgba(0,0,0,.12)" stroke-width="2" fill="none"/>' +
        '<path d="M234 164 q24 12 48 0" stroke="rgba(0,0,0,.1)" stroke-width="2" fill="none"/>' +
        '<path d="M224 146 q-14 2 -20 10" stroke="' + (c.bun || c.hair || '#c8c0b0') + '" stroke-width="6" fill="none" stroke-linecap="round"/></g>';
    }
    if (has(c, 'apron')) {
      s += '<path d="M132 330 Q180 352 228 330 L246 480 L114 480 Z" fill="' + (c.apron || '#e8e0d0') + '" opacity=".9"/>' +
        '<path d="M150 336 Q180 352 210 336" stroke="rgba(0,0,0,.09)" stroke-width="3" fill="none"/>' +
        '<rect x="160" y="398" width="40" height="30" rx="4" fill="none" stroke="rgba(0,0,0,.1)" stroke-width="2"/>';
    }
    return s;
  }

  function body(c) {
    var o = c.outfit || {};
    var main = o.main || '#5c6a5c';
    var accent = o.accent || '#e8dcc4';
    var dark = o.dark || 'rgba(0,0,0,.28)';
    var s = '';
    s += '<path d="M40 480 C44 394 88 340 142 322 L218 322 C272 340 316 394 320 480 Z" fill="' + main + '"/>';
    s += '<path d="M40 480 C44 394 88 340 142 322 L180 322 L180 480 Z" fill="rgba(0,0,0,.09)"/>';
    switch (o.type) {
      case 'coat':
        s += '<path d="M142 322 Q180 352 218 322 L232 338 Q196 386 180 386 Q164 386 128 338 Z" fill="' + accent + '"/>';
        s += '<path d="M142 334 L116 480 L156 480 L174 366 Z" fill="' + dark + '" opacity=".45"/>';
        s += '<path d="M218 334 L244 480 L204 480 L186 366 Z" fill="' + dark + '" opacity=".45"/>';
        s += '<path d="M180 386 L180 480" stroke="' + dark + '" stroke-width="2" opacity=".35"/>';
        break;
      case 'dress':
        s += '<path d="M146 322 Q180 350 214 322 Q224 338 214 348 Q180 370 146 348 Q136 338 146 322 Z" fill="' + accent + '"/>';
        s += '<path d="M120 356 Q180 380 240 356" stroke="' + dark + '" stroke-width="2" fill="none" opacity=".3"/>';
        break;
      case 'tunic':
        s += '<path d="M144 324 Q180 350 216 324 L220 338 Q180 364 140 338 Z" fill="' + accent + '"/>';
        s += '<path d="M180 362 L180 480" stroke="' + dark + '" stroke-width="2" opacity=".25"/>';
        break;
      case 'suit':
        s += '<path d="M146 322 L180 410 L214 322 L226 332 L204 480 L156 480 L134 332 Z" fill="' + accent + '"/>';
        s += '<path d="M176 342 L184 342 L190 400 L180 420 L170 400 Z" fill="' + (o.tie || '#8a4a3a') + '"/>';
        s += '<path d="M140 326 L116 480 L156 480 L174 370 Z" fill="' + main + '"/>';
        s += '<path d="M220 326 L244 480 L204 480 L186 370 Z" fill="' + main + '"/>';
        s += '<path d="M146 322 L180 410 L214 322" stroke="' + dark + '" stroke-width="3" fill="none" opacity=".4"/>';
        break;
      case 'robe':
        s += '<path d="M140 316 L140 292 Q180 318 220 292 L220 316 Q180 344 140 316 Z" fill="' + accent + '"/>';
        s += '<path d="M180 320 L180 480" stroke="' + dark + '" stroke-width="3" opacity=".4"/>';
        s += '<path d="M146 340 Q180 360 214 340" stroke="' + dark + '" stroke-width="1.5" fill="none" opacity=".35"/>';
        break;
      case 'fur':
        s += '<path d="M112 332 Q128 300 152 314 Q166 292 180 310 Q194 292 208 314 Q232 300 248 332 Q220 356 180 348 Q140 356 112 332 Z" fill="' + (c.fur || '#e8e2d4') + '"/>';
        s += '<path d="M146 322 Q180 348 214 322" stroke="' + dark + '" stroke-width="2" fill="none" opacity=".35"/>';
        break;
      case 'overalls':
        s += '<path d="M142 330 L154 480 L206 480 L218 330" fill="' + accent + '" opacity=".85"/>';
        s += '<path d="M142 330 L154 480 M218 330 L206 480" stroke="' + dark + '" stroke-width="8" opacity=".3"/>';
        s += '<rect x="168" y="350" width="24" height="18" rx="3" fill="' + dark + '" opacity=".4"/>';
        break;
      case 'school':
        s += '<path d="M146 322 L180 360 L214 322 L220 336 L180 378 L140 336 Z" fill="' + accent + '"/>';
        s += '<path d="M180 378 L180 480" stroke="' + dark + '" stroke-width="2" opacity=".35"/>';
        s += '<circle cx="180" cy="400" r="4" fill="' + accent + '"/><circle cx="180" cy="430" r="4" fill="' + accent + '"/>';
        break;
      default:
        s += '<path d="M144 324 Q180 350 216 324 L220 338 Q180 364 140 338 Z" fill="' + accent + '"/>';
    }
    /* блик ткани */
    s += '<path d="M74 480 C84 406 110 358 148 336" stroke="rgba(255,255,255,.08)" stroke-width="12" fill="none"/>';
    return s;
  }

  function neck(c) {
    return '<path d="M150 250 L210 250 L212 310 Q180 328 148 310 Z" fill="' + c.skin + '"/>' +
      '<path d="M150 250 L210 250 L210 268 Q180 284 150 268 Z" fill="rgba(100,55,40,.14)"/>' +
      '<path d="M148 308 Q180 324 212 308 L212 322 Q180 338 148 322 Z" fill="rgba(0,0,0,.10)"/>';
  }

  function ears(c) {
    return '<ellipse cx="104" cy="212" rx="12" ry="21" fill="' + c.skin + '"/>' +
      '<ellipse cx="256" cy="212" rx="12" ry="21" fill="' + c.skin + '"/>' +
      '<path d="M101 206 q-4 8 1 15 M259 206 q4 8 -1 15" stroke="rgba(120,70,50,.25)" stroke-width="1.6" fill="none"/>';
  }

  function humanPortrait(c, mood) {
    var m = MOODS[mood] || MOODS.neutral;
    var inner = '';
    inner += hairBack(c);
    inner += body(c);
    inner += neck(c);
    inner += ears(c);
    inner += face(c, m);
    inner += hairFront(c);
    inner += accessories(c);
    if (has(c, 'scarf')) {
      inner += '<path d="M128 330 Q180 352 232 330 Q246 360 218 374 Q180 388 142 374 Q114 360 128 330 Z" fill="' + (c.scarf || '#e8dcc4') + '"/>' +
        '<path d="M208 366 q26 22 16 62 l26 6 q18 -54 -14 -82 Z" fill="' + (c.scarf || '#e8dcc4') + '" opacity=".92"/>' +
        '<path d="M138 372 q-8 30 2 52" stroke="rgba(0,0,0,.1)" stroke-width="3" fill="none"/>';
    }
    if (c.mask) {
      inner += maskFace(c, m);
    }
    return '<svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg" class="portrait-svg"><g class="p-breathe">' + inner + '</g></svg>';
  }

  function maskFace(c, m) {
    var glow = c.maskGlow || '#b8e8dc';
    var eyeY = 208 + (m.eyeShift || 0);
    var crack = 'M180 120 L174 164 L184 202 L176 246 L184 292';
    return '<g>' +
      '<path d="M122 150 Q180 108 238 150 Q250 220 222 280 Q198 310 180 312 Q162 310 138 280 Q110 220 122 150 Z" fill="#e8e6dc"/>' +
      '<path d="M122 150 Q180 108 238 150 Q250 220 222 280 Q198 310 180 312 Q162 310 138 280 Q110 220 122 150 Z" fill="none" stroke="#b8b4a6" stroke-width="2"/>' +
      '<path d="' + crack + '" stroke="#a8a496" stroke-width="1.6" fill="none"/>' +
      '<path d="M126 190 q18 8 34 0" stroke="#8a8678" stroke-width="3" fill="none"/>' +
      '<path d="M200 190 q18 8 34 0" stroke="#8a8678" stroke-width="3" fill="none"/>' +
      '<ellipse cx="148" cy="' + eyeY + '" rx="10" ry="4" fill="' + glow + '"/>' +
      '<ellipse cx="212" cy="' + eyeY + '" rx="10" ry="4" fill="' + glow + '"/>' +
      '<path d="M166 258 q14 -6 28 0" stroke="#8a8678" stroke-width="2" fill="none"/>' +
      '<circle cx="238" cy="164" r="2.5" fill="' + glow + '" opacity=".8"/>' +
      '</g>';
  }

  /* ------------------ особые существа ------------------ */

  function pyrh(mood) {
    var closed = mood === 'happy' || mood === 'laugh';
    var eyes = closed
      ? '<path d="M148 300 q10 -12 20 0" stroke="#22343a" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '<path d="M192 300 q10 -12 20 0" stroke="#22343a" stroke-width="4" fill="none" stroke-linecap="round"/>'
      : '<ellipse cx="158" cy="300" rx="11" ry="14" fill="#22343a"/><ellipse cx="202" cy="300" rx="11" ry="14" fill="#22343a"/>' +
        '<circle cx="154" cy="295" r="4" fill="#fff"/><circle cx="198" cy="295" r="4" fill="#fff"/>';
    return '<svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg" class="portrait-svg"><g class="p-breathe">' +
      '<circle cx="180" cy="290" r="140" fill="#d8f6ee" opacity=".05"/>' +
      '<circle cx="180" cy="290" r="105" fill="#d8f6ee" opacity=".07"/>' +
      '<path d="M132 238 q-28 -50 -6 -66 q30 -8 40 44 Z" fill="#9ecf9c"/>' +
      '<path d="M228 238 q28 -50 6 -66 q-30 -8 -40 44 Z" fill="#9ecf9c"/>' +
      '<path d="M134 236 q-10 -38 2 -54" stroke="#c8e8b8" stroke-width="2" fill="none" opacity=".5"/>' +
      '<path d="M226 236 q10 -38 -2 -54" stroke="#c8e8b8" stroke-width="2" fill="none" opacity=".5"/>' +
      '<ellipse cx="180" cy="304" rx="88" ry="74" fill="#eafaf5"/>' +
      '<ellipse cx="128" cy="284" rx="48" ry="52" fill="#f6fffb"/>' +
      '<ellipse cx="232" cy="284" rx="48" ry="52" fill="#f6fffb"/>' +
      '<ellipse cx="180" cy="260" rx="58" ry="48" fill="#f6fffb"/>' +
      '<ellipse cx="180" cy="330" rx="55" ry="38" fill="#d8f0e8" opacity=".6"/>' +
      eyes +
      '<path d="M172 322 q8 10 16 0" stroke="#22343a" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<circle cx="130" cy="330" r="7" fill="#9ecf9c" opacity=".6"/><circle cx="232" cy="330" r="7" fill="#9ecf9c" opacity=".6"/>' +
      '<path d="M142 356 q38 18 76 0 l6 18 q-44 22 -88 0 Z" fill="#cfe8df"/>' +
      '<path d="M206 370 q18 20 14 50 l20 4 q6 -38 -18 -64 Z" fill="#cfe8df" opacity=".9"/>' +
      '<path d="M154 356 q-18 20 -14 50 l-20 4 q-6 -38 18 -64 Z" fill="#cfe8df" opacity=".75"/>' +
      '<circle cx="120" cy="230" r="2.5" fill="#ffffff" opacity=".7"/><circle cx="250" cy="248" r="2" fill="#ffffff" opacity=".6"/>' +
      '<circle cx="238" cy="210" r="3" fill="#ffffff" opacity=".5"/>' +
      '</g></svg>';
  }

  function totoro(mood) {
    var happy = mood === 'happy' || mood === 'laugh' || mood === 'smile';
    var mouth = happy
      ? '<path d="M150 300 Q180 330 210 300" stroke="#4a443e" stroke-width="4" fill="none" stroke-linecap="round"/>'
      : '<path d="M164 306 Q180 316 196 306" stroke="#4a443e" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
    return '<svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg" class="portrait-svg"><g class="p-breathe">' +
      '<ellipse cx="180" cy="360" rx="142" ry="150" fill="#8e938a"/>' +
      '<ellipse cx="180" cy="372" rx="118" ry="126" fill="#9da198"/>' +
      '<path d="M118 226 q-20 -94 12 -100 q28 -6 34 88 Z" fill="#8e938a"/>' +
      '<path d="M242 226 q20 -94 -12 -100 q-28 -6 -34 88 Z" fill="#8e938a"/>' +
      '<ellipse cx="180" cy="392" rx="82" ry="76" fill="#d8d3c0"/>' +
      '<path d="M120 380 Q180 348 240 380" stroke="#b8b2a0" stroke-width="3" fill="none" opacity=".7"/>' +
      '<path d="M126 402 Q180 372 234 402" stroke="#b8b2a0" stroke-width="3" fill="none" opacity=".7"/>' +
      '<path d="M134 424 Q180 396 226 424" stroke="#b8b2a0" stroke-width="3" fill="none" opacity=".7"/>' +
      '<ellipse cx="144" cy="270" rx="22" ry="26" fill="#f6f2e4"/><ellipse cx="216" cy="270" rx="22" ry="26" fill="#f6f2e4"/>' +
      '<circle cx="144" cy="272" r="10" fill="#2e2b28"/><circle cx="216" cy="272" r="10" fill="#2e2b28"/>' +
      '<circle cx="140" cy="267" r="3.4" fill="#fff" opacity=".9"/><circle cx="212" cy="267" r="3.4" fill="#fff" opacity=".9"/>' +
      '<path d="M164 292 q16 -10 32 0 q-16 10 -32 0 Z" fill="#4a443e"/>' +
      mouth +
      '<path d="M84 306 l-50 -14 M86 320 l-52 2 M92 334 l-44 16" stroke="#6a6e66" stroke-width="2.2" opacity=".7"/>' +
      '<path d="M276 306 l50 -14 M274 320 l52 2 M268 334 l44 16" stroke="#6a6e66" stroke-width="2.2" opacity=".7"/>' +
      '<path d="M120 180 q60 -30 120 0" stroke="#c8c8b8" stroke-width="4" fill="none" opacity=".2"/>' +
      '<g transform="translate(198 132) rotate(18)"><path d="M0 0 q42 -24 56 6 q-36 18 -56 -6 Z" fill="#6f8f52" opacity=".9"/>' +
      '<path d="M4 0 q26 -10 44 -1" stroke="#9ab878" stroke-width="1.6" fill="none" opacity=".6"/></g>' +
      '</g></svg>';
  }

  function jiji(mood) {
    var eyes = (mood === 'happy')
      ? '<path d="M138 272 q12 -12 24 0" stroke="#e8d884" stroke-width="4" fill="none"/><path d="M198 272 q12 -12 24 0" stroke="#e8d884" stroke-width="4" fill="none"/>'
      : '<ellipse cx="150" cy="274" rx="12" ry="15" fill="#e8d884"/><ellipse cx="210" cy="274" rx="12" ry="15" fill="#e8d884"/>' +
        '<ellipse cx="150" cy="274" rx="5" ry="12" fill="#1d1d1f"/><ellipse cx="210" cy="274" rx="5" ry="12" fill="#1d1d1f"/>';
    return '<svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg" class="portrait-svg"><g class="p-breathe">' +
      '<ellipse cx="180" cy="350" rx="98" ry="120" fill="#24242a"/>' +
      '<circle cx="180" cy="244" r="84" fill="#2a2a31"/>' +
      '<path d="M112 196 L100 120 L160 158 Z" fill="#2a2a31"/><path d="M248 196 L260 120 L200 158 Z" fill="#2a2a31"/>' +
      '<path d="M118 186 L112 146 L146 166 Z" fill="#3a3a42"/><path d="M242 186 L248 146 L214 166 Z" fill="#3a3a42"/>' +
      eyes +
      '<path d="M174 296 q6 6 12 0" stroke="#c8c8c0" stroke-width="2" fill="none"/>' +
      '<path d="M120 304 l-48 -8 M120 316 l-48 4 M240 304 l48 -8 M240 316 l48 4" stroke="#c8c8b8" stroke-width="1.6" opacity=".55"/>' +
      '<path d="M232 380 q44 30 16 84" stroke="#24242a" stroke-width="16" fill="none" stroke-linecap="round"/>' +
      '</g></svg>';
  }

  function calcifer(mood) {
    return '<svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg" class="portrait-svg"><g class="p-breathe">' +
      '<circle cx="180" cy="320" r="150" fill="#ff9a4a" opacity=".06"/>' +
      '<path d="M180 130 q38 54 22 92 q46 -26 44 -84 q54 56 34 132 q-14 54 -70 74 q-62 22 -104 -18 q-40 -40 -18 -106 q12 -34 38 -56 q-6 52 10 74 q20 -30 44 -108 Z" fill="#f08a3a"/>' +
      '<path d="M180 190 q22 40 10 66 q26 -14 24 -48 q30 40 18 86 q-10 40 -52 48 q-44 8 -66 -24 q-22 -34 -2 -74 q10 -20 26 -30 q-2 32 8 44 q12 -20 34 -68 Z" fill="#ffc466"/>' +
      '<path d="M180 252 q12 26 4 42 q16 -8 14 -30 q18 26 10 52 q-6 24 -32 28 q-26 4 -38 -16 q-12 -22 -2 -44 q6 -12 16 -18 q-2 18 4 26 q8 -14 24 -40 Z" fill="#fff0b0"/>' +
      '<circle cx="160" cy="292" r="12" fill="#3a2418"/><circle cx="202" cy="292" r="12" fill="#3a2418"/>' +
      '<circle cx="156" cy="288" r="4" fill="#fff"/><circle cx="198" cy="288" r="4" fill="#fff"/>' +
      '<path d="M168 314 q14 14 26 0" stroke="#5a3420" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M96 412 q84 -26 168 0 l-14 18 q-70 -22 -140 0 Z" fill="#4a3024"/>' +
      '<path d="M120 424 q60 -16 120 0" stroke="#6a4632" stroke-width="4" fill="none"/>' +
      '</g></svg>';
  }

  function curator(mood) {
    var glow = mood === 'sad' ? '#8fb8c8' : (mood === 'angry' ? '#e8a0a0' : '#b8e8dc');
    return '<svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg" class="portrait-svg"><g class="p-breathe">' +
      '<path d="M56 480 C60 360 92 180 180 150 C268 180 300 360 304 480 Z" fill="#2c3238"/>' +
      '<path d="M56 480 C60 360 92 180 180 150 C268 180 300 360 304 480 Z" fill="none" stroke="#4a5458" stroke-width="1.5" opacity=".5"/>' +
      '<path d="M88 480 C92 372 116 216 180 188 C244 216 268 372 272 480 Z" fill="#20262c"/>' +
      '<path d="M84 480 C82 340 110 164 180 128 C250 164 278 340 276 480 L238 480 C242 356 224 214 180 190 C136 214 118 356 122 480 Z" fill="#3a4248"/>' +
      '<path d="M96 330 Q180 300 264 330 L272 480 L88 480 Z" fill="#262c32" opacity=".8"/>' +
      '<path d="M132 156 Q180 120 228 156 Q242 210 224 262 Q204 292 180 296 Q156 292 136 262 Q118 210 132 156 Z" fill="#e8e6dc"/>' +
      '<path d="M132 156 Q180 120 228 156 Q242 210 224 262 Q204 292 180 296 Q156 292 136 262 Q118 210 132 156 Z" fill="none" stroke="#b8b4a6" stroke-width="2"/>' +
      '<path d="M180 132 L173 172 L184 210 L175 252 L184 292" stroke="#a8a496" stroke-width="1.6" fill="none"/>' +
      '<ellipse cx="152" cy="204" rx="10" ry="4.5" fill="' + glow + '"/>' +
      '<ellipse cx="208" cy="204" rx="10" ry="4.5" fill="' + glow + '"/>' +
      '<path d="M164 258 q16 -7 32 0" stroke="#8a8678" stroke-width="2" fill="none"/>' +
      '<path d="M124 202 q-18 6 -24 20 M236 202 q18 6 24 20" stroke="#8a8678" stroke-width="2" fill="none"/>' +
      '<circle cx="70" cy="360" r="2.5" fill="' + glow + '" opacity=".6"/><circle cx="292" cy="320" r="2" fill="' + glow + '" opacity=".5"/>' +
      '<circle cx="98" cy="250" r="1.8" fill="' + glow + '" opacity=".4"/>' +
      '</g></svg>';
  }

  /* ------------------ конфигурации ------------------ */

  var CHARS = {
    mio: {
      name: 'Мио', source: 'почтальон ветра', color: '#a8d8c8',
      skin: '#f0c8a3', shade: 'rgba(120,70,50,.11)', hair: '#5a4640', hairDark: 'rgba(0,0,0,.18)',
      style: 'bob', eye: '#4d8a7d', lash: '#332825', age: 'teen', browWidth: 3.4,
      outfit: { type: 'coat', main: '#5c7a61', accent: '#e9dec4', dark: 'rgba(0,0,0,.3)' },
      acc: ['goggles', 'scarf'], accColor: '#c49a54', glass: '#a8d8d0', scarf: '#efe4c9', strap: '#6a4a32'
    },
    pyrh: { name: 'Пырх', source: 'ветряной дух', color: '#b8ecd8', render: pyrh, spirit: true },
    curator: {
      name: 'Смотритель', source: 'страж тишины', color: '#cfd8d8',
      skin: '#e8e6dc', hair: '#2c3238', style: 'hood', eye: '#b8e8dc', age: 'adult',
      outfit: { type: 'robe', main: '#2c3238', accent: '#3a4248', dark: 'rgba(0,0,0,.4)' },
      acc: [], mask: true, render: curator
    },
    conan: {
      name: 'Конан', source: 'остров, который помнит солнце', color: '#e8b878',
      skin: '#edc39c', hair: '#b9804f', hairDark: 'rgba(0,0,0,.18)', style: 'spiky',
      eye: '#4f7a6b', lash: '#4a3424', age: 'teen',
      outfit: { type: 'tunic', main: '#a84f3f', accent: '#e8dcc0', dark: 'rgba(0,0,0,.3)' }
    },
    lana: {
      name: 'Лана', source: 'остров, который помнит солнце', color: '#e8d8a0',
      skin: '#f3d0b0', hair: '#e8cf8a', hairDark: 'rgba(140,100,40,.18)', style: 'long',
      eye: '#6a8ab0', lash: '#7a6040', age: 'child', browWidth: 3.2,
      outfit: { type: 'dress', main: '#7e9bc0', accent: '#f2ead8', dark: 'rgba(0,0,0,.25)' },
      acc: ['pendant'], tie: '#c8a050'
    },
    lupin: {
      name: 'Люпен', source: 'замок Калиостро', color: '#d8b878',
      skin: '#eec9a6', hair: '#2b2b2f', hairDark: 'rgba(0,0,0,.25)', style: 'short',
      eye: '#6b6b63', lash: '#232326', age: 'adult',
      outfit: { type: 'suit', main: '#4f7a53', accent: '#e8e0c8', dark: 'rgba(0,0,0,.35)', tie: '#d8b850' }
    },
    clarisse: {
      name: 'Кларисса', source: 'замок Калиостро', color: '#f0d8b0',
      skin: '#f6d4b8', hair: '#f0d79b', hairDark: 'rgba(160,120,50,.15)', style: 'long',
      eye: '#7ba3c4', lash: '#9a8050', age: 'child', browWidth: 3, eyeScale: 1.04,
      outfit: { type: 'dress', main: '#e8e0d0', accent: '#b8d0d8', dark: 'rgba(0,0,0,.2)' },
      acc: ['tiara', 'earring'], accColor: '#d8b868'
    },
    nausicaa: {
      name: 'Навсикая', source: 'Долина Ветров', color: '#a8d8c8',
      skin: '#f2c9a2', hair: '#a7634c', hairDark: 'rgba(0,0,0,.15)', style: 'bob',
      eye: '#6a8a6a', lash: '#5a3428', age: 'teen', browWidth: 3.1, eyeScale: 1.04,
      outfit: { type: 'tunic', main: '#5f7fa8', accent: '#e8ddc4', dark: 'rgba(0,0,0,.3)' }
    },
    asbel: {
      name: 'Асбел', source: 'Долина Ветров', color: '#c8b890',
      skin: '#e8bd92', hair: '#7a5a42', hairDark: 'rgba(0,0,0,.2)', style: 'short',
      eye: '#5b7a5a', lash: '#43301f', age: 'teen',
      outfit: { type: 'coat', main: '#7a6a4f', accent: '#d8c8a8', dark: 'rgba(0,0,0,.3)' }
    },
    pazu: {
      name: 'Пазу', source: 'Лапута', color: '#e8c8a0',
      skin: '#f0c8a0', hair: '#4a3a32', hairDark: 'rgba(0,0,0,.2)', style: 'short',
      eye: '#5f7a6a', lash: '#3a2c24', age: 'teen',
      outfit: { type: 'tunic', main: '#d8d2c0', accent: '#8a6a4a', dark: 'rgba(0,0,0,.25)' },
      acc: ['cap', 'goggles'], cap: '#7a5a3f', accColor: '#b08a4a', glass: '#a8c8c8'
    },
    sheeta: {
      name: 'Шита', source: 'Лапута', color: '#c8d8e8',
      skin: '#f4d2b4', hair: '#2e2a32', hairDark: 'rgba(0,0,0,.3)', style: 'braids',
      eye: '#6f7f9a', lash: '#2a2430', age: 'child', browWidth: 3, eyeScale: 1.04,
      outfit: { type: 'dress', main: '#7a9ac0', accent: '#f0e8d8', dark: 'rgba(0,0,0,.25)' },
      acc: ['pendant'], tie: '#b84a4a'
    },
    satsuki: {
      name: 'Сацуки', source: 'дом у камфорного дерева', color: '#e8d080',
      skin: '#f2cba6', hair: '#7a5a42', hairDark: 'rgba(0,0,0,.18)', style: 'pigtails',
      eye: '#6a5a4a', lash: '#4a3424', age: 'child', browWidth: 3.2,
      outfit: { type: 'dress', main: '#e8c860', accent: '#f4ead8', dark: 'rgba(0,0,0,.2)' },
      tie: '#b84a4a'
    },
    mei: {
      name: 'Мэй', source: 'дом у камфорного дерева', color: '#f0c0b0',
      skin: '#f6d2ae', hair: '#7a5a42', hairDark: 'rgba(0,0,0,.18)', style: 'twin',
      eye: '#6a5a4a', lash: '#4a3424', age: 'child', browWidth: 3.4, eyeScale: 1.02,
      outfit: { type: 'dress', main: '#e8a0a8', accent: '#f8ece0', dark: 'rgba(0,0,0,.18)' },
      tie: '#e8c860'
    },
    totoro: { name: 'Тоторо', source: 'хранитель леса', color: '#b8bcb0', render: totoro, spirit: true },
    kiki: {
      name: 'Кики', source: 'город Корико', color: '#b8a8d8',
      skin: '#f2c9a2', hair: '#26262a', hairDark: 'rgba(0,0,0,.25)', style: 'bob',
      eye: '#4a4a50', lash: '#1d1d20', age: 'teen', browWidth: 3.2,
      outfit: { type: 'dress', main: '#3d3f55', accent: '#e8e4d8', dark: 'rgba(0,0,0,.3)' },
      acc: ['bow'], bow: '#b84a4a'
    },
    jiji: { name: 'Дзидзи', source: 'ведьмин кот', color: '#d8c878', render: jiji, spirit: true },
    porco: {
      name: 'Порко', source: 'Адриатическое небо', color: '#e8b890',
      skin: '#e8b98e', hair: '#8a7a6a', hairDark: 'rgba(0,0,0,.2)', style: 'short',
      eye: '#5a5a52', lash: '#3a3228', age: 'adult',
      outfit: { type: 'coat', main: '#6a5a4a', accent: '#c84a3a', dark: 'rgba(0,0,0,.35)' },
      acc: ['mustache', 'snout', 'scarf'], beard: '#c8c0b0', snout: '#e8a898', scarf: '#c84a3a'
    },
    fio: {
      name: 'Фио', source: 'Адриатическое небо', color: '#e8b090',
      skin: '#f2c9a0', hair: '#a85a3a', hairDark: 'rgba(0,0,0,.2)', style: 'ponytail',
      eye: '#5a7a6a', lash: '#4a3020', age: 'teen', browWidth: 3.4,
      outfit: { type: 'overalls', main: '#7a8a5a', accent: '#e8dcc0', dark: 'rgba(0,0,0,.3)' },
      acc: ['goggles'], accColor: '#b08a4a', glass: '#a8c8c8', tie: '#b84a4a'
    },
    san: {
      name: 'Сан', source: 'лес Мононоке', color: '#d8b8a0',
      skin: '#f0c9a6', hair: '#3a3030', hairDark: 'rgba(0,0,0,.25)', style: 'long',
      eye: '#6a5a4a', lash: '#2a2420', age: 'teen', browWidth: 3.4, eyeScale: 1.02,
      outfit: { type: 'fur', main: '#8a4a3a', accent: '#e8e2d4', dark: 'rgba(0,0,0,.25)' },
      fur: '#e8e2d4', acc: ['paint', 'earring']
    },
    ashitaka: {
      name: 'Аситака', source: 'лес Мононоке', color: '#c8a878',
      skin: '#e8bd92', hair: '#3a302c', hairDark: 'rgba(0,0,0,.2)', style: 'short',
      eye: '#5a6a5a', lash: '#2e2620', age: 'adult',
      outfit: { type: 'coat', main: '#5a6a8a', accent: '#b84a3a', dark: 'rgba(0,0,0,.3)' }
    },
    chihiro: {
      name: 'Тихиро', source: 'купальни Юбабы', color: '#e8a8b8',
      skin: '#f4d0ac', hair: '#6a4a3a', hairDark: 'rgba(0,0,0,.18)', style: 'ponytail',
      eye: '#5a4a3a', lash: '#3a2a20', age: 'child', browWidth: 3.4,
      outfit: { type: 'tunic', main: '#e8a0b0', accent: '#8ab0a0', dark: 'rgba(0,0,0,.2)' }
    },
    haku: {
      name: 'Хаку', source: 'купальни Юбабы', color: '#a8c8b8',
      skin: '#f2d6bc', hair: '#2a2a34', hairDark: 'rgba(0,0,0,.28)', style: 'long',
      eye: '#6a8a7a', lash: '#22242a', age: 'teen',
      outfit: { type: 'robe', main: '#f0ece0', accent: '#7aa08a', dark: 'rgba(0,0,0,.18)' }
    },
    sophie: {
      name: 'Софи', source: 'Ходячий замок', color: '#c8d8d0',
      skin: '#f0cdb0', hair: '#d8d2c4', hairDark: 'rgba(120,110,90,.15)', style: 'bob',
      eye: '#6a7a6a', lash: '#8a7a68', age: 'adult', browWidth: 3.2,
      outfit: { type: 'dress', main: '#6a7a9a', accent: '#e8e0d0', dark: 'rgba(0,0,0,.25)' }
    },
    howl: {
      name: 'Хаул', source: 'Ходячий замок', color: '#a8d8d0',
      skin: '#f4d4b6', hair: '#e8cf88', hairDark: 'rgba(160,120,40,.2)', style: 'wavy',
      eye: '#6a9a8a', lash: '#8a7040', age: 'adult',
      outfit: { type: 'coat', main: '#3a5a80', accent: '#d84a4a', dark: 'rgba(0,0,0,.3)' },
      acc: ['earring'], accColor: '#d8b868'
    },
    calcifer: { name: 'Кальцифер', source: 'сердце замка', color: '#f0a05a', render: calcifer, spirit: true },
    sosuke: {
      name: 'Сосуке', source: 'берег Поньо', color: '#e8d070',
      skin: '#f4cfa8', hair: '#6a4a3a', hairDark: 'rgba(0,0,0,.2)', style: 'short',
      eye: '#5a5a4a', lash: '#3a2a20', age: 'child',
      outfit: { type: 'tunic', main: '#e8d060', accent: '#7aa0b0', dark: 'rgba(0,0,0,.22)' }
    },
    ponyo: {
      name: 'Поньо', source: 'берег Поньо', color: '#f0a080',
      skin: '#f6d6b4', hair: '#d85a3a', hairDark: 'rgba(120,30,10,.18)', style: 'bob',
      eye: '#5a7a8a', lash: '#6a3020', age: 'child', browWidth: 3.6, eyeScale: 1.05,
      outfit: { type: 'dress', main: '#e88a4a', accent: '#f4e4d0', dark: 'rgba(0,0,0,.2)' },
      acc: ['shell'], accColor: '#e8c8a0'
    },
    jiro: {
      name: 'Дзиро', source: 'небо, которое снится', color: '#d8c8a8',
      skin: '#ecc5a2', hair: '#2e2a2a', hairDark: 'rgba(0,0,0,.25)', style: 'slick',
      eye: '#5a5a52', lash: '#26221f', age: 'adult',
      outfit: { type: 'suit', main: '#6a5a4a', accent: '#e8e4d8', dark: 'rgba(0,0,0,.3)', tie: '#7a4a3a' },
      acc: ['glasses']
    },
    nahoko: {
      name: 'Нахоко', source: 'небо, которое снится', color: '#e8c0a8',
      skin: '#f2cdb0', hair: '#4e3830', hairDark: 'rgba(0,0,0,.22)', style: 'long',
      eye: '#6a5a4e', lash: '#332824', age: 'adult', browWidth: 3.2,
      outfit: { type: 'dress', main: '#a87878', accent: '#efe4d4', dark: 'rgba(0,0,0,.24)' }
    },
    mahito: {
      name: 'Махито', source: 'башня утрат', color: '#b8c8c8',
      skin: '#f0cba8', hair: '#2e2a2c', hairDark: 'rgba(0,0,0,.25)', style: 'short',
      eye: '#5a5a52', lash: '#2a2624', age: 'teen',
      outfit: { type: 'school', main: '#3a4a5a', accent: '#e8e0d0', dark: 'rgba(0,0,0,.3)' },
      acc: ['bandage']
    },
    heron: {
      name: 'Серая цапля', source: 'башня утрат', color: '#b8b8a8',
      skin: '#e8c8a8', hair: '#9a9a94', hairDark: 'rgba(80,80,70,.2)', style: 'short',
      eye: '#6a6a5a', lash: '#6a6658', age: 'adult',
      outfit: { type: 'coat', main: '#4a4a50', accent: '#c8b8a0', dark: 'rgba(0,0,0,.35)' },
      acc: ['feather'], feather: '#b8b8ac'
    },
    eboshi: {
      name: 'Леди Эбоси', source: 'лес Мононоке', color: '#c8a0b8',
      skin: '#f0c8a4', hair: '#2a2a32', hairDark: 'rgba(0,0,0,.3)', style: 'long',
      eye: '#5a4a4a', lash: '#2a2428', age: 'adult',
      outfit: { type: 'robe', main: '#4a3a4a', accent: '#c8a050', dark: 'rgba(0,0,0,.35)' }
    },
    yubaba: {
      name: 'Юбаба', source: 'купальни', color: '#c8b090',
      skin: '#e8c8a8', hair: '#b8b0a0', hairDark: 'rgba(0,0,0,.2)', style: 'bald',
      eye: '#5a4a3a', lash: '#3a3028', age: 'old',
      outfit: { type: 'robe', main: '#3a2a2a', accent: '#c8a050', dark: 'rgba(0,0,0,.4)' }
    },
    dola: {
      name: 'Дола', source: 'Лапута', color: '#d0a8a0',
      skin: '#e8c4a2', hair: '#d8a0a0', hairDark: 'rgba(80,40,40,.25)', style: 'braids',
      eye: '#5a4a3a', lash: '#3a2a24', age: 'old',
      outfit: { type: 'coat', main: '#3a5a7a', accent: '#c8a050', dark: 'rgba(0,0,0,.35)' },
      acc: ['earring'], accColor: '#d8b860'
    },
    dreamer: {
      name: 'Сновидец', source: 'мальчик, который видит сны', color: '#cfe4d8',
      skin: '#f0cba8', hair: '#3d3530', hairDark: 'rgba(0,0,0,.22)', style: 'short',
      eye: '#5f7f76', lash: '#2f2824', age: 'teen', browWidth: 3.4,
      outfit: { type: 'tunic', main: '#e7e0d0', accent: '#7f9e8d', dark: 'rgba(0,0,0,.2)' },
      acc: ['scarf'], scarf: '#b8d8c8', tie: '#b8d8c8'
    },
    oldman: {
      name: 'Он', source: 'человек у окна', color: '#e8d2a0',
      skin: '#e8c6a4', hair: '#c8c4b8', hairDark: 'rgba(80,70,60,.16)', style: 'short',
      eye: '#5e6e64', lash: '#6a6458', age: 'old', browWidth: 5.4,
      outfit: { type: 'coat', main: '#6b5a48', accent: '#e9dfcd', dark: 'rgba(0,0,0,.3)' },
      acc: ['glasses', 'beard'], beard: '#ded9cc', accColor: '#b08a4a'
    },
    wife: {
      name: 'Она', source: 'та, кто ждёт', color: '#e8c4b0',
      skin: '#f0cdb0', hair: '#c9c1b1', hairDark: 'rgba(90,80,65,.15)', style: 'short',
      eye: '#6a5a4a', lash: '#8a7a68', age: 'old', browWidth: 4.6,
      outfit: { type: 'dress', main: '#7b6a7b', accent: '#efe6d6', dark: 'rgba(0,0,0,.24)' },
      acc: ['bun', 'apron'], bun: '#c9c1b1', apron: '#e9dfcd', tie: '#b8a0a8'
    },
    couple: {
      name: 'Он и она', source: 'двое в комнате у окна', color: '#e8d2a0',
      skin: '#e8c6a4', hair: '#c8c4b8', hairDark: 'rgba(80,70,60,.16)', style: 'short',
      eye: '#5e6e64', lash: '#6a6458', age: 'old', browWidth: 5.4,
      outfit: { type: 'coat', main: '#4a4a52', accent: '#e9dfcd', dark: 'rgba(0,0,0,.3)' },
      acc: [], voices: ['oldman', 'wife']
    }
  };

  function render(id, mood) {
    var c = CHARS[id];
    if (!c) return '';
    var m = mood || 'neutral';
    if (PHOTOS[id]) return photoPortrait(id, m);
    if (c.render) return c.render(m);
    return humanPortrait(c, m);
  }

  window.Portraits = {
    chars: CHARS,
    render: render,
    nameOf: function (id) { var c = CHARS[id]; return c ? c.name : ''; },
    sourceOf: function (id) { var c = CHARS[id]; return c ? c.source : ''; },
    colorOf: function (id) { var c = CHARS[id]; return c ? c.color : '#e6b464'; },
    has: function (id) { return !!CHARS[id]; }
  };
})();
