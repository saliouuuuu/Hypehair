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

## Com'è fatto

- **La prenotazione è il centro del sito.** Quattro passi — servizio,
  barbiere (JD / Baudena / indifferente), giorno e ora, contatti — con
  riepilogo sempre visibile. In fondo produce un messaggio WhatsApp già
  scritto per il salone.
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
  primo file disponibile — `marchio.mp4`, poi `marchio.png`, poi il disegno —
  e `mix-blend-mode: screen` toglie il fondo: resta solo l'elemento verde,
  qualunque sfondo abbia il file. I video partono in autoplay muto e si
  mettono in pausa fuori dallo schermo.
- **Palette e tipografia dal logo**: nero, bianco e i verdi iridescenti del
  vetro; serif in stile lettering del marchio.
- **Animazioni sobrie**: comparse allo scroll, parallasse leggera, testo che
  si accende parola per parola, schede che si impilano. Tutto disattivato
  automaticamente con `prefers-reduced-motion`.

## Da completare

Vedi `GUIDA.md` → *Cosa devi mandarmi*: foto, numero WhatsApp, indirizzo,
Instagram, orari reali e conferma dei prezzi.
