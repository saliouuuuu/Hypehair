# Hype Hair — sito vetrina

Barberia a Cuneo. Sito statico a pagina unica: HTML, CSS e JavaScript
scritti a mano, nessuna build, nessuna dipendenza da installare.

```
index.html            tutti i testi e il listino
assets/css/style.css  aspetto e animazioni
assets/js/main.js     scroll, vetrina e motore di prenotazione
assets/img/           le foto (nomi fissi, vedi GUIDA.md)
netlify.toml          pubblicazione
GUIDA.md              guida per il salone: cosa mandare, cosa si cambia da soli
```

## Provarlo in locale

```bash
python3 -m http.server 8899
# poi apri http://localhost:8899
```

## Mobile first, davvero

Il foglio di stile parte dal telefono: le regole di base sono quelle dello
schermo piccolo e le media query sono tutte `min-width` (560 / 820 / 1000),
mai il contrario. Sul telefono la vetrina è a colonna singola, il riepilogo
grande sparisce — lo sostituisce la barra bassa che dice sempre cosa stai
prenotando — e scegliendo il giorno gli orari vengono portati al centro
dello schermo. Bersagli da dito ≥ 40 px, nessun testo sotto 11,5 px, zero
scroll orizzontale da 360 px in su.

## Peso e velocità

Misurato con Chromium su un telefono simulato (390 px, DPR 3):

| | Apertura | Chi va dritto a prenotare | Tutta la pagina |
|---|---|---|---|
| **Ora** | 611 KB · LCP 1,4 s | 611 KB | 22 MB (i quattro reel) |
| Prima | 2,7 MB · LCP 14 s | — | 24 MB |

Come:

- **WebP a più misure** con `<picture>`/`srcset`: il telefono scarica una
  foto da 40–70 KB dove prima ne prendeva una da 300 KB
- **Caratteri serviti dal sito** (`assets/fonts/`, Inter variabile + tre
  tagli di Cormorant, solo latino): niente CSS di terze parti che blocca
  il primo render — da solo valeva 12 secondi di LCP
- **Marchio animato** da GIF 2,4 MB a un'unica copia WebP da 199 KB,
  ritagliata a 200 px, un fotogramma sì e uno no, condivisa da tutti e sei
  gli emblemi: si scarica una volta sola, all'apertura, e poi è già in cache.
  Il fondo nero non c'è più: l'alfa è ricavata dalla luce del vetro, così il
  marchio si appoggia su qualunque sfondo senza trucchi di fusione
- **Video** con `src` agganciato solo in prossimità e **annullato** se ci
  si allontana senza guardarli; in pausa fuori campo
- **Risparmio dati o linea lenta** (`saveData`, `effectiveType`): video ed
  emblema animato non partono affatto
- `width`/`height` su ogni foto: **CLS 0**, la pagina non balla
- Sfocature `backdrop-filter` disattivate sui touch, dove costano di più

## Com'è fatto

- **La prenotazione è la prima cosa dopo l'apertura.** Chi entra per
  prenotare non deve scorrere niente: hero, poi il modulo. Sotto vengono il
  marchio che gira, la galleria dei lavori e tutto il resto.
- **Il modulo è costruito come un onboarding:** **una domanda per schermata** — tipo di servizio, servizio,
  barbiere, giorno, ora, contatti — con avanzamento automatico appena si
  risponde, nessun bottone "avanti", e le risposte date che restano in alto
  come targhette da toccare per correggerle. In fondo produce un messaggio
  WhatsApp già scritto per il salone.
- **Una sola fonte per i prezzi.** Il modulo di prenotazione legge servizi,
  prezzi e durate dal listino in `index.html` (`data-service`, `data-price`,
  `data-dur`): si aggiorna in un posto solo.
- **Contatti e orari in un blocco solo**, in cima a `main.js` (`CONFIG`).
  Finché il numero WhatsApp non è compilato il sito resta usabile: mostra il
  riepilogo da copiare e nasconde i bottoni che non porterebbero da nessuna
  parte.
- **Le foto mancanti non rompono niente**: al loro posto compare un
  segnaposto che dice quale scatto ci va e con che nome salvarlo.
- **Il marchio è il filo conduttore.** L'elemento di vetro del logo è
  ricostruito in SVG (tre nastri sovrapposti in `screen`, gradienti definiti
  una volta sola in `index.html`) e ricompare in sei punti: apertura, nav,
  sigillo di metà pagina, filigrana della prenotazione, conferma, footer.
  Gira di suo e accelera con lo scroll (`data-spin`). Ogni emblema prende il
  primo file disponibile — `marchio-gira-220.webp`, poi `marchio-220.webp`,
  `marchio.gif`, `marchio.png`, infine il disegno. Il primo ha il fondo
  trasparente per davvero; ai file di riserva, che il fondo nero ce l'hanno,
  la classe `.is-opaco` rimette lo `screen` di prima.
- **La trama a righe del marchio** sta dietro al sigillo di metà pagina:
  non è un fondale, è una luce. Si accende in `screen` sul nero, si scurisce
  in `multiply` sulla carta, e la macchia è misurata in pixel — non in
  percentuale — così sul desktop non diventa un sipario largo quanto lo
  schermo, e su tutti e quattro i lati sfuma prima di toccare il bordo.
- **Palette e tipografia dal logo**: nero, bianco e i verdi iridescenti del
  vetro; serif in stile lettering del marchio.
- **Due versioni, un interruttore.** Il bottone nella nav passa da scuro a
  chiaro; la scelta resta in `localStorage` e viene applicata da uno script
  in `<head>` prima del primo disegno, così non si vede il lampo. Tutti i
  colori passano da gettoni CSS ridefiniti sotto `:root[data-tema="chiaro"]`
  — nel foglio non è rimasto nessun colore scritto a mano, tranne gli scrim
  sopra le foto, che restano scuri di proposito (`--su-foto` per il testo
  che ci sta sopra). Sul chiaro il marchio torna dentro al suo disco nero,
  perché `mix-blend-mode: screen` su carta lo cancellerebbe.
- **Animazioni sobrie**: comparse allo scroll, parallasse leggera, testo che
  si accende parola per parola, schede che si impilano. Tutto disattivato
  automaticamente con `prefers-reduced-motion`.

## Da completare

Vedi `GUIDA.md` → *Cosa devi mandarmi*: foto, numero WhatsApp, indirizzo,
Instagram, orari reali e conferma dei prezzi.
