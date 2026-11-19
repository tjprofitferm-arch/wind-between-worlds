/* Ветер между мирами — офлайн-кэш PWA */
const CACHE = 'vmw-v27';
const CORE = [
  './',
  './index.html',
  './style.css',
  './bg.js',
  './chars.js',
  './story4.js',
  './dream1.js',
  './dream2.js',
  './dream3.js',
  './echoes.js',
  './echoes2.js',
  './engine.js',
  './manifest.webmanifest',
  './assets/bg/menu-collage.webp',
  './assets/bg/final-frame.webp',
  './assets/bg/anime/conan.webp',
  './assets/bg/anime/cagliostro.webp',
  './assets/bg/anime/nausicaa.webp',
  './assets/bg/anime/laputa.webp',
  './assets/bg/anime/totoro.webp',
  './assets/bg/anime/kiki.webp',
  './assets/bg/anime/porco.webp',
  './assets/bg/anime/mononoke.webp',
  './assets/bg/anime/spirited.webp',
  './assets/bg/anime/howl.webp',
  './assets/bg/anime/ponyo.webp',
  './assets/bg/anime/windrises.webp',
  './assets/bg/anime/heron.webp',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/char/cut/asbel.webp',
  './assets/char/cut/ashitaka_v2.webp',
  './assets/char/cut/calcifer.webp',
  './assets/char/cut/chihiro.webp',
  './assets/char/cut/clarisse_v12.webp',
  './assets/char/cut/conan_v3.webp',
  './assets/char/cut/couple_v3.webp',
  './assets/char/cut/dola_v3.webp',
  './assets/char/cut/dreamer_young.webp',
  './assets/char/cut/eboshi.webp',
  './assets/char/cut/fio.webp',
  './assets/char/cut/haku.webp',
  './assets/char/cut/heron_v2.webp',
  './assets/char/cut/howl_v5.webp',
  './assets/char/cut/jiji_v2.webp',
  './assets/char/cut/jiro.webp',
  './assets/char/cut/kiki_v20.webp',
  './assets/char/cut/lana_v4.webp',
  './assets/char/cut/lupin_v2.webp',
  './assets/char/cut/mahito_v2.webp',
  './assets/char/cut/mei.webp',
  './assets/char/cut/nahoko.webp',
  './assets/char/cut/nausicaa.webp',
  './assets/char/cut/pazu_v2.webp',
  './assets/char/cut/ponyo.webp',
  './assets/char/cut/porco.webp',
  './assets/char/cut/san.webp',
  './assets/char/cut/satsuki.webp',
  './assets/char/cut/sheeta.webp',
  './assets/char/cut/sophie_pad.webp',
  './assets/char/cut/sosuke.webp',
  './assets/char/cut/totoro_v2.webp',
  './assets/char/cut/yubaba_v2.webp',
  './assets/exp/cut/asbel_happy.webp',
  './assets/exp/cut/chihiro_neutral.webp',
  './assets/exp/cut/chihiro_sad.webp',
  './assets/exp/cut/chihiro_scared.webp',
  './assets/exp/cut/chihiro_worry.webp',
  './assets/exp/cut/howl_sad.webp',
  './assets/exp/cut/jiro_neutral.webp',
  './assets/exp/cut/kiki_happy.webp',
  './assets/exp/cut/kiki_joy.webp',
  './assets/exp/cut/kiki_sad.webp',
  './assets/exp/cut/mahito_neutral.webp',
  './assets/exp/cut/mahito_sad.webp',
  './assets/exp/cut/nahoko_happy.webp',
  './assets/exp/cut/nausicaa_determined.webp',
  './assets/exp/cut/nausicaa_sad.webp',
  './assets/exp/cut/nausicaa_surprised.webp',
  './assets/exp/cut/nausicaa_worry.webp',
  './assets/exp/cut/pazu_happy.webp',
  './assets/exp/cut/ponyo_happy.webp',
  './assets/exp/cut/ponyo_surprised.webp',
  './assets/exp/cut/porco_determined.webp',
  './assets/exp/cut/porco_neutral.webp',
  './assets/exp/cut/san_determined.webp',
  './assets/exp/cut/satsuki_happy.webp',
  './assets/exp/cut/satsuki_neutral.webp',
  './assets/exp/cut/satsuki_scared.webp',
  './assets/exp/cut/satsuki_scared2.webp',
  './assets/exp/cut/satsuki_worry.webp',
  './assets/exp/cut/sheeta_neutral.webp',
  './assets/exp/cut/sophie_happy.webp',
  './assets/exp/cut/sophie_worry.webp'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  // Свежая версия при сети, сохранённая — в офлайне.
  event.respondWith(
    fetch(event.request).then(res => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match(event.request).then(hit => hit || caches.match('./index.html')))
  );
});
