# Guida al sito Hype Hair

Tutto quello che serve per far vivere il sito, spiegato senza tecnicismi.
Il sito è fatto di tre file: `index.html` (i testi), `assets/css/style.css`
(l'aspetto), `assets/js/main.js` (le cose che si muovono e la prenotazione).

---

## 1. Cosa devi mandarmi

### Le foto — la parte più importante

Il sito è pensato come una vetrina: **le foto sono il sito**. Servono
scattate col telefono in orizzontale o verticale come indicato, con la luce
del salone accesa e senza filtri Instagram (li mette già il sito).

| Nome del file        | Cosa deve esserci                                   | Formato consigliato |
|----------------------|-----------------------------------------------------|---------------------|
| `marchio.mp4`        | **Il video dell'elemento di vetro** che si muove (se ce l'hai) | quadrato, 3–6 secondi, in loop, max ~2 MB |
| `marchio.png`        | **Solo l'elemento di vetro verde** del logo, senza la scritta | quadrata, 1000 px |
| `hero.jpg`           | La foto d'apertura: il salone o un barbiere al lavoro | verticale o quadrata, molto larga (2000 px) |
| `atelier.jpg`        | Foto larga d'atmosfera: mani al lavoro, dettaglio    | orizzontale |
| `finale.jpg`         | Insegna, vetrina o poltrona vuota                    | orizzontale |
| `barbiere-jd.jpg`    | Ritratto di JD                                       | verticale |
| `barbiere-baudena.jpg` | Ritratto di Baudena                                | verticale |
| `work-01.jpg` → `work-09.jpg` | I tagli: fade, hair tattoo, barba, colore, forbice, bimbi, il salone | verticale 4:5 (come Instagram) |
| `og-cover.jpg`       | L'immagine che si vede quando mandi il link su WhatsApp | 1200 × 630 px |
| `apple-touch-icon.png` | Il logo tondo completo, su fondo nero              | 180 × 180 px |

**Il marchio.** Il sito è costruito sui colori del logo — nero, bianco e il
verde iridescente del vetro — e quell'elemento di vetro torna in sei punti:
schermata d'apertura, tondo in alto a sinistra, sigillo a metà pagina,
filigrana dietro alla prenotazione, timbro sulla conferma e firma nel footer.
Gira sempre piano su sé stesso e accelera quando scorri.

Per ora è ridisegnato in SVG (tre nastri sovrapposti). Il sito prende il
primo file che trova, in quest'ordine:

1. `marchio.mp4` — il **video** dell'elemento che si muove
2. `marchio.png` — l'elemento fermo
3. il disegno SVG, se non c'è nessuno dei due

**Lo sfondo non è un problema.** Nero, bianco o trasparente: il sito lo
toglie da solo e lascia solo l'elemento verde luminoso, che si stacca dal
fondo scuro come nel logo. Il file può arrivare così com'è, senza ritagli.

Il video parte da solo, senza audio, in loop e senza comandi a vista; fuori
dallo schermo si mette in pausa per non consumare batteria. Se il telefono
si rifiuta di farlo partire, si torna al PNG o al disegno senza che si veda
niente di strano.

**Come si caricano:** metti il file dentro `assets/img/` con esattamente
quel nome. Il riquadro grigio con la scritta sparisce da solo.
Finché la foto non c'è, il sito mostra un segnaposto elegante con scritto
cosa ci va: non si rompe niente.

> Consiglio: peso massimo ~400 KB a foto. Se sono pesanti le comprimo io.

### I dati del salone

Servono queste cose (ora nel sito ci sono i segnaposti):

- **Numero WhatsApp** del salone → è lì che arrivano le prenotazioni
- **Numero di telefono** da chiamare (può essere lo stesso)
- **Indirizzo completo** (via, numero, CAP)
- **Nome utente Instagram**
- **Orari veri di apertura**, giorno per giorno, comprese le pause pranzo
  e il giorno di chiusura

### Da confermare

1. **Prezzi.** Sul sito attuale il listino e il menù della prenotazione non
   dicono la stessa cosa: nel listino "Taglio con Forbici" sta a 25 €, nella
   tendina a 30 €; "Hair Tattoo" 27 € contro 25 €. Qui ho messo i prezzi del
   listino: dimmi quali sono giusti.
2. **Chi fa cosa.** Sotto JD e Baudena ci sono due descrizioni di comodo
   ("fade e hair tattoo", "forbice e colore"): scrivimi quelle vere.
3. **Durata dei servizi.** Ho stimato i minuti di ogni taglio: servono per
   proporre gli orari giusti. Se un taglio completo da voi dura un'ora,
   si cambia in un secondo.

---

## 2. Come funziona la prenotazione

È il cuore del sito. Il cliente fa quattro cose:

1. sceglie il **servizio** (dal listino o dai bottoni)
2. sceglie il **barbiere** — JD, Baudena o "indifferente"
3. sceglie **giorno e ora**, tra quelli in cui il salone è aperto
4. lascia **nome e telefono**

A quel punto il sito prepara un messaggio già scritto e apre WhatsApp:
al salone arriva tutto in chiaro, servizio, prezzo, orario e nome.
Voi rispondete "confermato" e basta.

**Niente pagamenti online, niente account, niente app da scaricare.**

Il cliente può anche partire dal listino: tocca "Taglio Completo" e la
prenotazione si apre già compilata. Oppure dalla scheda di un barbiere:
"Prenota con JD" e il barbiere è già scelto.

### Attenzione: gli orari proposti non sanno chi è già prenotato

Il sito propone gli orari in cui il salone è **aperto**, non quelli
**liberi**: non è collegato a un'agenda. Per questo la conferma la date voi.
Se un giorno volete l'agenda vera (slot che spariscono quando sono presi),
si aggancia un servizio tipo Fresha o Treatwell — nel file `main.js` c'è già
la riga `bookingUrl` pronta per il collegamento.

---

## 3. Cambiare le cose da soli

### I contatti e gli orari

Apri `assets/js/main.js`. Le prime 40 righe sono così:

```js
const CONFIG = {
  whatsapp : '',      // qui il numero: 393401234567
  tel      : '',      // qui: +39 340 123 4567
  instagram: '',      // qui: hypehair.cuneo
  ...
```

Scrivi tra le virgolette e salva. Gli orari sono poco sotto: `null` vuol
dire chiuso, `[['09:00','13:00'], ['14:30','19:30']]` vuol dire aperto la
mattina e il pomeriggio con la pausa in mezzo. `0` è domenica, `6` è sabato.

Quando metti il numero WhatsApp, il bottone "Chiama" e quello di WhatsApp
compaiono da soli in tutto il sito.

### I prezzi

Apri `index.html` e cerca la sezione **LISTINO**. Ogni voce è una riga così:

```html
<li data-service data-name="Taglio Base" data-price="20" data-dur="30" data-cat="Capelli">
  <button type="button"><span class="price__n">Taglio Base</span><i class="price__dots"></i><span class="price__v">20 €</span></button>
  <small>Macchinetta, sfumatura e styling.</small>
</li>
```

- `data-price` → il prezzo (solo il numero)
- `data-dur` → quanto dura in minuti
- `data-from="1"` → aggiunge il "da" davanti al prezzo
- il testo dentro `<span class="price__v">` è quello che si legge

**Il modulo di prenotazione legge da qui.** Cambi il prezzo nel listino e
cambia anche nella prenotazione: non c'è da toccarlo in due posti.

### I testi

Sono tutti dentro `index.html`, in chiaro. Cerca la frase che vuoi cambiare
e riscrivila. Le righe che iniziano con `<!--` sono note per chi lavora al
sito, non si vedono online.

---

## 4. Mandare il sito online

Il sito non ha bisogno di essere "compilato": si pubblica la cartella così
com'è. Su Netlify il file `netlify.toml` è già configurato: colleghi il
repository e ogni modifica salvata va online da sola in un minuto.

Per il dominio `hypehair.it` basta puntarlo al nuovo sito quando siamo
pronti: fino a quel momento il vecchio resta al suo posto.

---

## 5. Cosa fa il sito che il vecchio non faceva

- **Si sceglie il barbiere** nel percorso di prenotazione, con la faccia e
  la specialità di ognuno, non in una tendina anonima
- **Si prenota dal listino**: tocchi il prezzo e sei già dentro
- **Le foto sono protagoniste**, in una vetrina che si muove allo scroll
- **Riepilogo sempre in vista** mentre prenoti: servizio, barbiere, orario,
  totale
- **Nessun caricamento di pagina**: tutto è su una schermata sola, veloce
  anche con poca linea
- **Aperto / chiuso in tempo reale** nella sezione "Dove siamo"
- Funziona anche a **motion ridotto** e da tastiera, per chi ne ha bisogno

---

## 6. Domande veloci

**Se cambio una foto devo avvisare qualcuno?**
No. Sostituisci il file con lo stesso nome e dopo un'ora al massimo si vede
la nuova ovunque.

**Se sbaglio qualcosa rompo il sito?**
Ogni modifica resta registrata: si torna indietro in un clic. Ma vale la
regola: cambia una cosa per volta e guarda com'è venuta.

**Posso aggiungere un terzo barbiere?**
Sì. Si duplica una scheda nella sezione Barbieri e un bottone nella
prenotazione. Dimmelo e lo preparo.
