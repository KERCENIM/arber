/* ============================================================
   ARBËRIKON — GAME MODE LOGIC
   Boot/gate intro (from pixel-theme) -> "SELECT YOUR PATH" menu
   -> rooms. Each room is a real <section> shown full-screen with
   all its real content and JS (dictionary, DNA map, posts, form)
   intact. Nothing about the data/features is reimplemented.
   ============================================================ */
(function () {
  var ROOMS = [
    { id: 'about',       name: 'The Question',   sub: 'About',       acc: '#5fe8c4' },
    { id: 'history',     name: 'The Chronicle',  sub: 'History',     acc: '#f0c860' },
    { id: 'genetics',    name: 'The Bloodline',  sub: 'Genetics',    acc: '#5fe8c4' },
    { id: 'linguistics', name: 'The Tongue',     sub: 'Linguistics', acc: '#c89aff' },
    { id: 'dictionary',  name: 'The Lexicon',    sub: 'Dictionary',  acc: '#ff9a6a' },
    { id: 'research',    name: 'The Study',      sub: 'Research',     acc: '#6ab8ff' },
    { id: 'posts',       name: 'The Dispatches', sub: 'Posts',        acc: '#e0556a' },
    { id: 'contribute',  name: 'The Atlas',      sub: 'Map Yourself', acc: '#7ad88a' }
  ];

  document.body.classList.add('game-mode');

  /* ---- dimmed gate backdrop (clone of the intro gate) ---- */
  var bg = document.createElement('div'); bg.id = 'game-bg';
  var gateSvg = document.querySelector('#arb-title svg');
  if (gateSvg) bg.appendChild(gateSvg.cloneNode(true));
  document.body.appendChild(bg);

  /* ---- mark each section as a room + inject its header ---- */
  ROOMS.forEach(function (r) {
    var sec = document.getElementById(r.id); if (!sec) return;
    sec.setAttribute('data-room', r.id);
    sec.style.setProperty('--racc', r.acc);
    var h = document.createElement('div');
    h.className = 'room-header';
    h.innerHTML = '<div class="room-title" style="color:' + r.acc + '">' + r.name.toUpperCase() +
                  '</div><div class="room-sub">' + r.sub + '</div>';
    sec.insertBefore(h, sec.firstChild);
  });

  /* ---- menu ---- */
  var menu = document.createElement('div'); menu.id = 'game-menu'; menu.className = 'hidden';
  var items = ROOMS.map(function (r) {
    return '<button class="gm-item" type="button" data-go="' + r.id + '">' + r.sub.toUpperCase() + '</button>';
  }).join('');
  menu.innerHTML = '<div class="gm-panel">' +
    '<div class="gm-brand">ARBËRIKON</div>' +
    '<div class="gm-head">★ SELECT YOUR PATH ★</div>' +
    '<div class="gm-list">' + items + '</div>' +
    '<div class="gm-hint">↑ ↓ &nbsp; select &nbsp;&middot;&nbsp; enter &nbsp;&middot;&nbsp; esc back</div>' +
    '</div>';
  document.body.appendChild(menu);

  /* ---- back button ---- */
  var back = document.createElement('button');
  back.id = 'game-back'; back.type = 'button'; back.innerHTML = '◄ BACK';
  document.body.appendChild(back);

  var current = null, sel = 0;
  var itemEls = [].slice.call(menu.querySelectorAll('.gm-item'));
  function paint() { itemEls.forEach(function (el, i) { el.classList.toggle('sel', i === sel); }); }

  function showMenu() {
    if (current) { var c = document.getElementById(current); if (c) c.classList.remove('room-open'); current = null; }
    document.body.classList.remove('room-active');
    menu.classList.remove('hidden');
    paint();
  }
  function openRoom(id) {
    var sec = document.getElementById(id); if (!sec) return;
    if (current) { var c = document.getElementById(current); if (c) c.classList.remove('room-open'); }
    menu.classList.add('hidden');
    sec.classList.add('room-open'); current = id;
    document.body.classList.add('room-active');
    sec.scrollTop = 0;
    // Leaflet (and anything size-sensitive) recalculates once visible
    setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 60);
    setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 380);
  }

  itemEls.forEach(function (el, i) {
    el.addEventListener('mouseenter', function () { sel = i; paint(); });
    el.addEventListener('click', function () { openRoom(el.dataset.go); });
  });
  back.addEventListener('click', showMenu);

  addEventListener('keydown', function (e) {
    if (!document.body.classList.contains('game-mode')) return;
    if (current) { if (e.key === 'Escape') { e.preventDefault(); showMenu(); } return; }
    if (menu.classList.contains('hidden')) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % itemEls.length; paint(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + itemEls.length) % itemEls.length; paint(); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openRoom(itemEls[sel].dataset.go); }
  });

  /* ---- hook the gate intro: Enter/Skip reveal the menu, not a scroll page ---- */
  var enter = document.getElementById('arb-enter'), skip = document.getElementById('arb-skip');
  if (enter) enter.addEventListener('click', function () { setTimeout(showMenu, 30); });
  if (skip)  skip.addEventListener('click',  function () { setTimeout(showMenu, 30); });

  /* ---- if the intro was already dismissed earlier (remembered), go straight to the menu ---- */
  var introEl = document.getElementById('arb-intro');
  if (!introEl || introEl.classList.contains('gone')) showMenu();
})();
