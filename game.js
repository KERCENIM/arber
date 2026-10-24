/* ============================================================
   ARBËRIKON — GAME MODE LOGIC
   Boot/gate intro (from pixel-theme) -> "SELECT YOUR PATH" menu
   -> rooms. Each room is a real <section> shown full-screen with
   all its real content and JS (dictionary, DNA map, posts, form)
   intact. Nothing about the data/features is reimplemented.
   ============================================================ */
(function () {
  var ROOMS = [
    { id: 'about',       name: 'The Question',   sub: 'About',       acc: '#5fe8c4', tag: 'An open inquiry into Albanian origins' },
    { id: 'history',     name: 'The Chronicle',  sub: 'History',     acc: '#e0556a', tag: 'From Illyria to independence, forged in the highlands' },
    { id: 'genetics',    name: 'The Bloodline',  sub: 'Genetics',    acc: '#5fe8c4', tag: 'Deep ancestry, read in living blood' },
    { id: 'linguistics', name: 'The Tongue',     sub: 'Linguistics', acc: '#c89aff', tag: 'A branch of Indo-European all its own' },
    { id: 'dictionary',  name: 'The Lexicon',    sub: 'Dictionary',  acc: '#5fe8c4', tag: 'English ⇄ Albanian — the living vocabulary' },
    { id: 'research',    name: 'The Study',      sub: 'Research',     acc: '#6ab8ff', tag: 'The scholarship behind the record' },
    { id: 'posts',       name: 'The Dispatches', sub: 'Posts',        acc: '#e0556a', tag: 'Dispatches from the @arberikon archive' },
    { id: 'contribute',  name: 'The Atlas',      sub: 'Map Yourself', acc: '#7ad88a', tag: 'Add your lineage to the map' }
  ];

  var EM = {
    about:       '<svg viewBox="0 0 24 24" fill="currentColor" shape-rendering="crispEdges"><rect x="4" y="4" width="7" height="16"/><rect x="13" y="4" width="7" height="16"/><rect x="11" y="4" width="2" height="16" opacity=".4"/></svg>',
    history:     '<svg viewBox="0 0 24 24" fill="currentColor" shape-rendering="crispEdges"><rect x="7" y="2" width="10" height="16"/><path d="M7 18l5 4 5-4z"/><rect x="9" y="6" width="6" height="2" fill="#120a26"/><rect x="9" y="10" width="6" height="2" fill="#120a26"/></svg>',
    genetics:    '<svg viewBox="0 0 24 24" fill="currentColor" shape-rendering="crispEdges"><rect x="7" y="3" width="3" height="2"/><rect x="14" y="3" width="3" height="2"/><rect x="9" y="7" width="6" height="2"/><rect x="6" y="11" width="4" height="2"/><rect x="14" y="11" width="4" height="2"/><rect x="9" y="15" width="6" height="2"/><rect x="7" y="19" width="3" height="2"/><rect x="14" y="19" width="3" height="2"/></svg>',
    linguistics: '<svg viewBox="0 0 24 24" fill="currentColor" shape-rendering="crispEdges"><rect x="4" y="4" width="16" height="12"/><path d="M8 16l-2 5 7-5z"/><rect x="7" y="7" width="10" height="2" fill="#120a26"/><rect x="7" y="11" width="6" height="2" fill="#120a26"/></svg>',
    dictionary:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><circle cx="10" cy="10" r="6"/><path d="M15 15l5 5" stroke-linecap="round"/></svg>',
    research:    '<svg viewBox="0 0 24 24" fill="currentColor" shape-rendering="crispEdges"><rect x="3" y="5" width="8" height="14"/><rect x="13" y="5" width="8" height="14"/><rect x="5" y="8" width="4" height="2" fill="#120a26"/><rect x="15" y="8" width="4" height="2" fill="#120a26"/></svg>',
    posts:       '<svg viewBox="0 0 24 24" fill="currentColor" shape-rendering="crispEdges"><rect x="5" y="3" width="14" height="18"/><rect x="7" y="6" width="10" height="2" fill="#120a26"/><rect x="7" y="10" width="10" height="2" fill="#120a26"/><rect x="7" y="14" width="7" height="2" fill="#120a26"/></svg>',
    contribute:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.4" fill="#120a26"/></svg>'
  };

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
    h.innerHTML = '<div class="room-emblem" style="color:' + r.acc + '">' + (EM[r.id] || '') + '</div>' +
                  '<div class="room-title" style="color:' + r.acc + '">' + r.name.toUpperCase() + '</div>' +
                  '<div class="room-sub">' + (r.tag || r.sub) + '</div>';
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
