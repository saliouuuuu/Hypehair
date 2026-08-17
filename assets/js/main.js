/* ============================================================
   Hype Hair — script unico
   Vanilla JS, nessuna libreria. Commenti in italiano.
   ⚠️  I dati del salone si cambiano SOLO nel blocco CONFIG qui sotto.
   ============================================================ */

const CONFIG = {

  /* --- contatti: compila questi tre e il sito è vivo --- */
  whatsapp : '',            // solo numeri, con prefisso: es. '393401234567'
  tel      : '',            // come si legge:            es. '+39 340 123 4567'
  instagram: '',            // senza @:                  es. 'hypehair.cuneo'

  /* --- dove --- */
  indirizzo    : 'Cuneo (CN)',
  indirizzoFull: 'Cuneo (CN)',
  maps         : '',        // link Google Maps del salone

  /* --- orari di apertura (0 = domenica … 6 = sabato) ---
     null = chiuso. Ogni fascia è ['apertura','chiusura'].
     ⚠️ Da confermare con il salone. */
  orari: {
    0: null,
    1: null,
    2: [['09:00','13:00'], ['14:30','19:30']],
    3: [['09:00','13:00'], ['14:30','19:30']],
    4: [['09:00','13:00'], ['14:30','19:30']],
    5: [['09:00','13:00'], ['14:30','19:30']],
    6: [['09:00','18:00']]
  },

  /* --- regole di prenotazione --- */
  passoMinuti  : 30,   // ogni quanto proporre un orario
  anticipoOre  : 2,    // quanto prima si può prenotare
  giorniMax    : 60,   // fino a quanti giorni avanti si può scegliere
  durataDefault: 30,   // minuti, se il servizio non ne indica una

  /* Se un giorno arriva un sistema di prenotazione esterno (Fresha, Treatwell,
     il gestionale del salone…), incolla qui il link: il modulo continua a
     funzionare e in fondo compare anche il bottone verso quel sistema. */
  bookingUrl: ''
};

/* ---------- scorciatoie ---------- */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const RIDOTTO = matchMedia('(prefers-reduced-motion: reduce)').matches;
const GIORNI  = ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'];

/* Un solo giro di scroll per tutti gli effetti della pagina:
   qui si registrano le funzioni che devono girare mentre si scorre. */
const _tasks = [];
let _pending = false;
function loopScroll(fn){
  _tasks.push(fn);
  if (_tasks.length > 1) return;           // ascoltatori registrati una volta sola
  const run    = () => { _pending = false; _tasks.forEach(t => t()); };
  const chiedi = () => { if (!_pending) { _pending = true; requestAnimationFrame(run); } };
  addEventListener('scroll', chiedi, { passive:true });
  addEventListener('resize', chiedi);
  chiedi();
}

/* ============================================================
   1 — Apertura
   ============================================================ */
(function loader(){
  const bar = $('#loaderBar');
  let p = 0;
  const t = setInterval(() => {
    p = Math.min(100, p + Math.random() * 26);
    if (bar) bar.style.width = p + '%';
    if (p >= 100) clearInterval(t);
  }, 110);

  const via = () => {
    setTimeout(() => {
      document.body.classList.remove('is-loading');
      $$('[data-split]').forEach(el => el.classList.add('is-split-in'));
      const dock = $('#dock');
      if (dock) setTimeout(() => dock.classList.add('is-up'), 600);
    }, RIDOTTO ? 60 : 620);
  };

  if (document.readyState === 'complete') via();
  else addEventListener('load', via);
  // se qualcosa si impianta (rete lenta), entriamo comunque
  setTimeout(via, 3500);
})();

/* ============================================================
   2 — Testo spezzato in lettere
   ============================================================ */
$$('[data-split]').forEach(el => {
  const testo = el.textContent;
  el.textContent = '';
  [...testo].forEach((ch, i) => {
    const s = document.createElement('span');
    s.className = 'split-c';
    s.style.setProperty('--ci', i);
    s.textContent = ch === ' ' ? ' ' : ch;
    el.appendChild(s);
  });
  // il nome nella schermata di apertura parte subito
  if (el.closest('.loader')) el.classList.add('is-split-in');
});

/* ============================================================
   2bis — L'emblema del marchio
   L'elemento di vetro del logo, ricostruito in SVG. Si monta ovunque
   ci sia data-emblem. Se in assets/img/ arriva marchio.png (il PNG
   vero su fondo nero) viene usato quello e l'SVG si fa da parte.
   data-spin = di quanti gradi gira mentre si scorre la pagina.
   ============================================================ */
(function emblemi(){
  // Il profilo a rombo stondato del marchio. Tre anelli quasi uguali,
  // ruotati fra loro: sovrapponendosi disegnano il nodo di vetro del logo.
  const D = 'M100 12C140 40 160 60 188 100C160 140 140 160 100 188C60 160 40 140 12 100C40 60 60 40 100 12Z';

  const anello = (n, rot, scala, spessore) => `
      <g class="emblem__r emblem__r--${n}">
        <g transform="translate(100 100) rotate(${rot}) scale(${scala}) translate(-100 -100)">
          <path class="emblem__p" d="${D}" stroke="url(#hhVetro${n})" stroke-width="${spessore}"/>
        </g>
      </g>`;

  const corpo = `
    <span class="emblem__halo"></span>
    <span class="emblem__body">
      <img src="assets/img/marchio.png" alt="" loading="lazy" onerror="this.hidden=true">
      <svg class="emblem__svg" viewBox="0 0 200 200" aria-hidden="true">
        ${anello(1, 0,  1,   15)}
        ${anello(2, 30, .93, 17)}
        ${anello(3, 60, .84, 13)}
      </svg>
    </span>`;

  const tutti = $$('[data-emblem]');
  tutti.forEach(el => {
    el.classList.add('emblem');
    el.innerHTML = corpo;
  });

  // quelli con data-spin girano seguendo lo scroll
  const mobili = tutti.filter(el => parseFloat(el.dataset.spin) > 0);
  if (RIDOTTO || !mobili.length) return;

  loopScroll(() => {
    mobili.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -300 || r.top > innerHeight + 300) return;
      // 0 quando entra dal basso, 1 quando è uscito in alto
      const avanz = 1 - (r.top + r.height / 2) / (innerHeight + r.height);
      el.style.setProperty('--spin', (avanz * parseFloat(el.dataset.spin)).toFixed(2) + 'deg');
    });
  });
})();

/* ============================================================
   3 — Nav, menu, barra di avanzamento
   ============================================================ */
(function nav(){
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu'), prog = $('#progress');
  let last = 0;

  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('is-stuck', y > 24);
    // la nav si nasconde scendendo, torna salendo
    if (!menu.classList.contains('is-open')) {
      nav.classList.toggle('is-hidden', y > last && y > 320);
    }
    last = y;

    const h = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.setProperty('--p', h > 0 ? (y / h).toFixed(4) : 0);
  };
  addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  const chiudi = () => {
    menu.classList.remove('is-open');
    menu.setAttribute('inert', '');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Apri il menu');
    document.body.classList.remove('is-locked');
  };

  burger.addEventListener('click', () => {
    const aperto = menu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(aperto));
    burger.setAttribute('aria-label', aperto ? 'Chiudi il menu' : 'Apri il menu');
    document.body.classList.toggle('is-locked', aperto);
    if (aperto) { menu.removeAttribute('inert'); nav.classList.remove('is-hidden'); }
    else chiudi();
  });

  $$('#menu a').forEach(a => a.addEventListener('click', chiudi));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) chiudi(); });
})();

/* ============================================================
   4 — Comparse allo scroll
   ============================================================ */
(function reveals(){
  const io = new IntersectionObserver((voci) => {
    voci.forEach(v => {
      if (v.isIntersecting) { v.target.classList.add('is-in'); io.unobserve(v.target); }
    });
  }, { threshold:.12, rootMargin:'0px 0px -8% 0px' });

  $$('[data-reveal]').forEach(el => io.observe(el));
})();

/* ============================================================
   5 — Manifesto: parole che si accendono
   ============================================================ */
(function parole(){
  const blocchi = $$('[data-words]');
  if (!blocchi.length) return;

  blocchi.forEach(b => {
    const parole = b.textContent.trim().split(/\s+/);
    b.textContent = '';
    parole.forEach(p => {
      const s = document.createElement('span');
      s.className = 'w';
      s.textContent = p + ' ';
      b.appendChild(s);
    });
  });

  const aggiorna = () => {
    blocchi.forEach(b => {
      const r = b.getBoundingClientRect();
      // avanzamento: da quando entra dal basso a quando esce in alto
      const avanz = (innerHeight * .85 - r.top) / (innerHeight * .55 + r.height * .5);
      const w = $$('.w', b);
      const q = Math.round(Math.max(0, Math.min(1, avanz)) * w.length);
      w.forEach((el, i) => el.classList.toggle('is-lit', i < q));
    });
  };
  loopScroll(aggiorna);
})();

/* ============================================================
   6 — Parallasse: le foto scorrono più lente del testo
   ============================================================ */
(function parallasse(){
  if (RIDOTTO) return;
  const el = $$('[data-parallax]');
  if (!el.length) return;

  loopScroll(() => {
    el.forEach(n => {
      const r = n.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      const centro = r.top + r.height / 2 - innerHeight / 2;
      const k = parseFloat(n.dataset.parallax) || .1;
      n.style.transform = `translate3d(0, ${(centro * k).toFixed(2)}px, 0)`;
    });
  });
})();

/* ============================================================
   7 — Numeri che salgono
   ============================================================ */
(function numeri(){
  const io = new IntersectionObserver((voci) => {
    voci.forEach(v => {
      if (!v.isIntersecting) return;
      const el = v.target;
      io.unobserve(el);
      const fine = parseFloat(el.dataset.count);
      const dec  = parseInt(el.dataset.dec || 0, 10);
      const suf  = el.dataset.suffix || '';
      if (RIDOTTO) { el.textContent = fine.toFixed(dec) + suf; return; }

      const durata = 1400, t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / durata);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = (fine * e).toFixed(dec).replace('.', ',') + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold:.5 });

  $$('[data-count]').forEach(el => io.observe(el));
})();

/* ============================================================
   8 — Cursore, magnetici, inclinazione
   ============================================================ */
(function tocchiFini(){
  if (RIDOTTO || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;

  const cur = $('#cursor');
  document.body.classList.add('has-cursor');
  let x = 0, y = 0, rx = 0, ry = 0;

  addEventListener('mousemove', e => {
    x = e.clientX; y = e.clientY;
    cur.style.setProperty('--x', x + 'px');
    cur.style.setProperty('--y', y + 'px');
  }, { passive:true });

  (function anello(){
    rx += (x - rx) * .16;
    ry += (y - ry) * .16;
    cur.style.setProperty('--rx', rx.toFixed(1) + 'px');
    cur.style.setProperty('--ry', ry.toFixed(1) + 'px');
    requestAnimationFrame(anello);
  })();

  $$('a, button, .frame, [data-magnetic]').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hot'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hot'));
  });

  // bottoni che seguono il mouse, appena appena
  $$('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * .18;
      const dy = (e.clientY - r.top - r.height / 2) * .3;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  // schede che si inclinano
  $$('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--ry', (((e.clientX - r.left) / r.width) - .5) * 6 + 'deg');
      el.style.setProperty('--rx', (.5 - ((e.clientY - r.top) / r.height)) * 6 + 'deg');
    });
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  });
})();

/* ============================================================
   9 — Vetrina a schermo intero
   ============================================================ */
(function lightbox(){
  const lb = $('#lb'), fig = $('#lbFig');
  const pezzi = $$('[data-lb]');
  if (!lb || !pezzi.length) return;
  let i = 0;

  const mostra = (n) => {
    i = (n + pezzi.length) % pezzi.length;
    const p = pezzi[i];
    const img = $('img', p);
    const cap = $('figcaption', p);
    fig.innerHTML = '';

    if (img && !img.hidden && img.complete && img.naturalWidth) {
      const c = img.cloneNode();
      c.hidden = false; c.loading = 'eager';
      fig.appendChild(c);
    } else {
      // foto non ancora caricata: mostriamo il segnaposto, non un riquadro rotto
      const box = document.createElement('div');
      box.className = 'frame';
      box.innerHTML = $('.ph', p).outerHTML;
      fig.appendChild(box);
    }
    if (cap) fig.appendChild(cap.cloneNode(true));
  };

  const apri = (n) => {
    mostra(n);
    lb.hidden = false;
    document.body.classList.add('is-locked');
    $('#lbClose').focus();
  };
  const chiudi = () => {
    lb.hidden = true;
    document.body.classList.remove('is-locked');
  };

  pezzi.forEach((p, n) => {
    const f = $('.frame', p);
    f.setAttribute('role', 'button');
    f.setAttribute('tabindex', '0');
    f.addEventListener('click', () => apri(n));
    f.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); apri(n); }
    });
  });

  $('#lbClose').addEventListener('click', chiudi);
  $('#lbPrev').addEventListener('click', () => mostra(i - 1));
  $('#lbNext').addEventListener('click', () => mostra(i + 1));
  lb.addEventListener('click', e => { if (e.target === lb) chiudi(); });
  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape')     chiudi();
    if (e.key === 'ArrowLeft')  mostra(i - 1);
    if (e.key === 'ArrowRight') mostra(i + 1);
  });
})();

/* ============================================================
   10 — Orari e "aperto adesso"
   ============================================================ */
function fasceDi(d){ return CONFIG.orari[d] || null; }

(function orari(){
  const ul = $('#hours'), stato = $('#openState'), testo = $('#openText');
  if (!ul) return;

  const oggi = new Date().getDay();
  for (let i = 1; i <= 7; i++) {
    const d = i % 7;                       // partiamo da lunedì
    const f = fasceDi(d);
    const li = document.createElement('li');
    li.className = d === oggi ? 'is-today' : '';
    li.innerHTML = `<span>${GIORNI[d]}</span><span>${
      f ? f.map(x => x[0] + '–' + x[1]).join(' · ') : 'chiuso'
    }</span>`;
    ul.appendChild(li);
  }

  const ora = new Date();
  const min = ora.getHours() * 60 + ora.getMinutes();
  const f = fasceDi(oggi);
  const aperto = !!f && f.some(([a, b]) => min >= inMin(a) && min < inMin(b));

  stato.classList.add(aperto ? 'is-open' : 'is-shut');
  if (aperto) {
    const fine = f.find(([a, b]) => min >= inMin(a) && min < inMin(b))[1];
    testo.textContent = `Aperto adesso · fino alle ${fine}`;
  } else {
    // primo giorno utile
    let n = 1, pross = null;
    while (n <= 7 && !pross) {
      const g = (oggi + n) % 7;
      if (fasceDi(g)) pross = { g, o: fasceDi(g)[0][0], n };
      n++;
    }
    testo.textContent = pross
      ? `Chiuso · riapre ${pross.n === 1 ? 'domani' : GIORNI[pross.g]} alle ${pross.o}`
      : 'Chiuso';
  }
})();

function inMin(hhmm){
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/* ============================================================
   11 — Mappa (si carica solo se la chiedi)
   ============================================================ */
(function mappa(){
  const btn = $('#mapBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const q = encodeURIComponent(CONFIG.indirizzoFull || 'Hype Hair Cuneo');
    if (CONFIG.maps) { open(CONFIG.maps, '_blank', 'noopener'); return; }
    const f = document.createElement('iframe');
    f.src = `https://www.google.com/maps?q=${q}&output=embed`;
    f.loading = 'lazy';
    f.title = 'Mappa: dove siamo';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    btn.replaceWith(f);
  });
})();

/* ============================================================
   12 — Contatti nel documento
   ============================================================ */
(function contatti(){
  const wa = CONFIG.whatsapp.replace(/\D/g, '');

  $$('[data-info]').forEach(el => {
    switch (el.dataset.info) {
      case 'indirizzo':      el.textContent = CONFIG.indirizzo; break;
      case 'indirizzo-full': if (CONFIG.indirizzoFull !== CONFIG.indirizzo) el.innerHTML = CONFIG.indirizzoFull; break;
      case 'tel-link':
        if (CONFIG.tel) el.href = 'tel:' + CONFIG.tel.replace(/\s/g, '');
        break;
      case 'instagram-link':
        if (CONFIG.instagram) {
          el.href = 'https://www.instagram.com/' + CONFIG.instagram + '/';
          el.target = '_blank'; el.rel = 'noopener';
          if (el.classList.contains('ilink')) el.textContent = '@' + CONFIG.instagram + ' →';
        }
        break;
    }
  });

  // finché non c'è un numero, i bottoni "Chiama" restano nascosti:
  // meglio un bottone in meno che uno che non chiama nessuno
  if (!CONFIG.tel) {
    $$('[data-info="tel-link"]').forEach(el => el.hidden = true);
  }
  window.__wa = wa;
})();

$('#year').textContent = new Date().getFullYear();

/* ============================================================
   13 — PRENOTAZIONE: il cuore del sito
   ============================================================ */
(function prenota(){

  /* --- servizi: letti dal listino, così i prezzi stanno in un posto solo --- */
  const SERVIZI = $$('#priceList [data-service]').map(li => ({
    nome : li.dataset.name,
    prezzo: parseFloat(li.dataset.price),
    da   : li.dataset.from === '1',
    dur  : parseInt(li.dataset.dur || CONFIG.durataDefault, 10),
    cat  : li.dataset.cat,
    li
  }));

  const stato = { svc:null, who:null, giorno:null, ora:null, step:1 };

  const panels  = $$('#wizPanels .panel');
  const tappe   = $$('#wizSteps li');
  const btnNext = $('#wizNext'), btnBack = $('#wizBack');

  /* ---------- 13.1 elenco servizi ---------- */
  const cont = $('#svcList');
  const perCat = {};
  SERVIZI.forEach(s => (perCat[s.cat] ||= []).push(s));

  Object.entries(perCat).forEach(([cat, lista]) => {
    const g = document.createElement('div');
    g.innerHTML = `<p class="svc__cat">${cat}</p><div class="svc__row"></div>`;
    const row = $('.svc__row', g);
    lista.forEach(s => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'svc__btn';
      b.innerHTML = `<b>${s.nome}</b><span>${s.da ? 'da ' : ''}${s.prezzo} € · ${s.dur} min</span>`;
      b.addEventListener('click', () => scegliServizio(s));
      s.btn = b;
      row.appendChild(b);
    });
    cont.appendChild(g);
  });

  function scegliServizio(s){
    stato.svc = s;
    SERVIZI.forEach(x => {
      x.btn.classList.toggle('is-on', x === s);
      x.li.classList.toggle('is-picked', x === s);
    });
    stato.ora = null;                 // la durata cambia: gli orari vanno rifatti
    if (stato.giorno) disegnaOrari();
    aggiorna();
  }

  // dal listino: tocchi un prezzo e parte la prenotazione
  SERVIZI.forEach(s => {
    $('button', s.li).addEventListener('click', () => {
      scegliServizio(s);
      vaiA(2);
      $('#prenota').scrollIntoView({ behavior: RIDOTTO ? 'auto' : 'smooth', block:'start' });
      toast(`${s.nome} selezionato`);
    });
  });

  /* ---------- 13.2 barbiere ---------- */
  $$('#whoList .who__card').forEach(c => {
    c.addEventListener('click', () => {
      stato.who = c.dataset.who;
      $$('#whoList .who__card').forEach(x => x.classList.toggle('is-on', x === c));
      aggiorna();
    });
  });

  // i bottoni "Prenota con …" della sezione Barbieri
  $$('[data-book-with]').forEach(b => {
    b.addEventListener('click', () => {
      const chi = b.dataset.bookWith;
      stato.who = chi;
      $$('#whoList .who__card').forEach(x => x.classList.toggle('is-on', x.dataset.who === chi));
      vaiA(stato.svc ? 3 : 1);
      $('#prenota').scrollIntoView({ behavior: RIDOTTO ? 'auto' : 'smooth', block:'start' });
      toast(`Prenoti con ${chi}`);
      aggiorna();
    });
  });

  /* ---------- 13.3 calendario ---------- */
  const grid = $('#calGrid'), label = $('#calLabel');
  const oggi = new Date(); oggi.setHours(0, 0, 0, 0);
  const ultimo = new Date(oggi); ultimo.setDate(ultimo.getDate() + CONFIG.giorniMax);
  let mese = new Date(oggi.getFullYear(), oggi.getMonth(), 1);

  function disegnaMese(){
    label.textContent = mese.toLocaleDateString('it-IT', { month:'long', year:'numeric' });
    grid.innerHTML = '';

    const primo = new Date(mese.getFullYear(), mese.getMonth(), 1);
    const salti = (primo.getDay() + 6) % 7;              // lunedì primo
    const giorni = new Date(mese.getFullYear(), mese.getMonth() + 1, 0).getDate();

    for (let i = 0; i < salti; i++) {
      const v = document.createElement('div');
      v.className = 'cal__day is-off';
      grid.appendChild(v);
    }

    for (let g = 1; g <= giorni; g++) {
      const d = new Date(mese.getFullYear(), mese.getMonth(), g);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cal__day';
      b.textContent = g;

      const chiuso  = !fasceDi(d.getDay());
      const passato = d < oggi;
      const troppo  = d > ultimo;
      if (chiuso || passato || troppo) {
        b.disabled = true;
        b.title = chiuso ? 'Chiuso' : '';
      } else {
        b.addEventListener('click', () => {
          stato.giorno = d;
          stato.ora = null;
          $$('.cal__day', grid).forEach(x => x.classList.remove('is-on'));
          b.classList.add('is-on');
          disegnaOrari();
          aggiorna();
        });
      }
      if (+d === +oggi) b.classList.add('is-today');
      if (stato.giorno && +d === +stato.giorno) b.classList.add('is-on');
      grid.appendChild(b);
    }

    $('#calPrev').disabled = mese <= new Date(oggi.getFullYear(), oggi.getMonth(), 1);
    $('#calNext').disabled = mese >= new Date(ultimo.getFullYear(), ultimo.getMonth(), 1);
  }

  $('#calPrev').addEventListener('click', () => { mese.setMonth(mese.getMonth() - 1); disegnaMese(); });
  $('#calNext').addEventListener('click', () => { mese.setMonth(mese.getMonth() + 1); disegnaMese(); });
  disegnaMese();

  /* ---------- 13.4 orari liberi ---------- */
  function disegnaOrari(){
    const box = $('#slots');
    box.innerHTML = '';
    if (!stato.giorno) { box.innerHTML = '<p class="slots__empty">Scegli prima un giorno.</p>'; return; }

    const fasce = fasceDi(stato.giorno.getDay()) || [];
    const durata = stato.svc ? stato.svc.dur : CONFIG.durataDefault;
    const adesso = new Date();
    const soglia = adesso.getTime() + CONFIG.anticipoOre * 3600e3;

    let n = 0;
    fasce.forEach(([a, b]) => {
      for (let m = inMin(a); m + durata <= inMin(b); m += CONFIG.passoMinuti) {
        const q = new Date(stato.giorno);
        q.setHours(Math.floor(m / 60), m % 60, 0, 0);
        if (q.getTime() < soglia) continue;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'slot';
        btn.style.setProperty('--si', n++);
        btn.textContent = `${String(Math.floor(m / 60)).padStart(2,'0')}:${String(m % 60).padStart(2,'0')}`;
        btn.addEventListener('click', () => {
          stato.ora = btn.textContent;
          $$('.slot', box).forEach(x => x.classList.remove('is-on'));
          btn.classList.add('is-on');
          aggiorna();
        });
        box.appendChild(btn);
      }
    });

    if (!n) box.innerHTML = '<p class="slots__none">Per questo giorno non ci sono più orari liberi. Prova il giorno dopo.</p>';
  }

  /* ---------- 13.5 passi ---------- */
  function vaiA(n){
    stato.step = Math.max(1, Math.min(4, n));
    panels.forEach(p => {
      const on = +p.dataset.step === stato.step;
      p.hidden = !on;
      p.classList.toggle('is-on', on);
    });
    tappe.forEach((t, i) => {
      t.classList.toggle('is-on', i + 1 === stato.step);
      t.classList.toggle('is-done', i + 1 < stato.step);
    });
    btnBack.hidden = stato.step === 1;
    btnNext.hidden = stato.step === 4;
    aggiorna();
  }

  function completo(n){
    if (n === 1) return !!stato.svc;
    if (n === 2) return !!stato.who;
    if (n === 3) return !!(stato.giorno && stato.ora);
    return true;
  }

  btnNext.addEventListener('click', () => { if (completo(stato.step)) vaiA(stato.step + 1); });
  btnBack.addEventListener('click', () => vaiA(stato.step - 1));

  /* ---------- 13.6 riepilogo ---------- */
  function quando(){
    if (!stato.giorno) return null;
    const d = stato.giorno.toLocaleDateString('it-IT', { weekday:'long', day:'numeric', month:'long' });
    return stato.ora ? `${d}, ore ${stato.ora}` : d;
  }

  function aggiorna(){
    const set = (id, val) => {
      const el = $(id);
      el.textContent = val || '—';
      el.classList.toggle('is-set', !!val);
    };
    set('#sumSvc',  stato.svc ? stato.svc.nome : null);
    set('#sumWho',  stato.who);
    set('#sumWhen', quando());
    set('#sumDur',  stato.svc ? stato.svc.dur + ' min' : null);

    $('#sumTot').textContent = stato.svc
      ? (stato.svc.da ? 'da ' : '') + stato.svc.prezzo + ' €'
      : '—';

    btnNext.disabled = !completo(stato.step);
    btnNext.textContent = stato.step === 3 ? 'Ci siamo →' : 'Continua →';
  }
  aggiorna();

  /* ---------- 13.7 invio ---------- */
  $('#bookForm').addEventListener('submit', e => {
    e.preventDefault();
    const nome = $('#fNome').value.trim();
    const tel  = $('#fTel').value.trim();
    const note = $('#fNote').value.trim();
    const err  = $('#formErr');

    const problemi = [];
    if (nome.length < 2) problemi.push('il nome');
    if (tel.replace(/\D/g, '').length < 8) problemi.push('un telefono valido');
    if (!stato.svc)  problemi.push('il servizio');
    if (!stato.who)  problemi.push('il barbiere');
    if (!stato.giorno || !stato.ora) problemi.push('giorno e ora');

    if (problemi.length) {
      err.hidden = false;
      err.textContent = 'Manca ' + problemi.join(', ') + '.';
      return;
    }
    err.hidden = true;

    const testo =
`Ciao Hype Hair! Vorrei prenotare:

• Servizio: ${stato.svc.nome} (${stato.svc.da ? 'da ' : ''}${stato.svc.prezzo} €, ${stato.svc.dur} min)
• Barbiere: ${stato.who}
• Quando: ${quando()}
• Nome: ${nome}
• Telefono: ${tel}${note ? `\n• Note: ${note}` : ''}

Confermate voi? Grazie!`;

    const recap = $('#doneRecap');
    recap.textContent = testo;

    const wa = window.__wa;
    const link = $('#doneWa');
    if (wa) {
      link.href = `https://wa.me/${wa}?text=${encodeURIComponent(testo)}`;
      link.target = '_blank'; link.rel = 'noopener';
      link.hidden = false;
      $('#doneMsg').textContent = 'Ti apriamo WhatsApp con il messaggio già scritto: mandalo e ricevi la conferma.';
    } else {
      // numero non ancora inserito: si copia e si manda a mano
      link.hidden = true;
      $('#doneMsg').textContent = 'Copia il messaggio qui sotto e mandalo al salone: ti confermano loro l’orario.';
    }

    if (CONFIG.bookingUrl) {
      let alt = $('#doneAlt');
      if (!alt) {
        alt = document.createElement('a');
        alt.id = 'doneAlt';
        alt.className = 'btn btn--glass';
        alt.target = '_blank'; alt.rel = 'noopener';
        alt.textContent = 'Vai al sistema di prenotazione';
        $('.done__acts').appendChild(alt);
      }
      alt.href = CONFIG.bookingUrl;
    }

    $('.wiz').hidden = true;
    $('#done').hidden = false;
    $('#done').scrollIntoView({ behavior: RIDOTTO ? 'auto' : 'smooth', block:'center' });
  });

  $('#doneCopy').addEventListener('click', async () => {
    const t = $('#doneRecap').textContent;
    try {
      await navigator.clipboard.writeText(t);
      toast('Messaggio copiato');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = t; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
      toast('Messaggio copiato');
    }
  });

  $('#doneAgain').addEventListener('click', () => {
    stato.svc = stato.who = stato.giorno = stato.ora = null;
    SERVIZI.forEach(s => { s.btn.classList.remove('is-on'); s.li.classList.remove('is-picked'); });
    $$('#whoList .who__card').forEach(x => x.classList.remove('is-on'));
    $('#bookForm').reset();
    disegnaMese(); disegnaOrari();
    $('#done').hidden = true;
    $('.wiz').hidden = false;
    vaiA(1);
    $('#prenota').scrollIntoView({ behavior: RIDOTTO ? 'auto' : 'smooth', block:'start' });
  });
})();

/* ============================================================
   14 — Messaggini
   ============================================================ */
let _toastT;
function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('is-up');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('is-up'), 2400);
}
