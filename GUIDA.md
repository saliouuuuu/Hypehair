# Guida al sito Hype Hair

Tutto quello che serve per far vivere il sito, spiegato senza tecnicismi.
Il sito è fatto di tre file: `index.html` (i testi), `assets/css/style.css`
(l'aspetto), `assets/js/main.js` (le cose che si muovono e la prenotazione).

---

## 1. Cosa devi mandarmi

### Le foto e i video

**Quello che hai già mandato è dentro e funziona:** quattro foto dei tagli,
quattro reel e la GIF del marchio animato.

| Già dentro | Dove finisce |
|---|---|
| `hero.jpg` | apertura del sito |
| `work-01.jpg` `work-02.jpg` `work-03.jpg` | vetrina |
| `video-01.mp4` `video-03.mp4` `video-04.mp4` | vetrina, partono da soli senza audio |
| `video-02.mp4` | sfondo a tutta pagina della frase |
| `marchio.gif` | l'emblema che gira in sei punti del sito |

**Manca ancora** (il posto nel sito c'è già, aspetta solo il file):

| File | Cosa ci va |
|---|---|
| `work-04.jpg` | treccine con schiariture bionde |
| `work-05.jpg` | cornrows, vista di lato |
| `barbiere-jd.jpg` | ritratto di JD |
| `barbiere-baudena.jpg` | ritratto di Baudena |
| `og-cover.jpg` | 1200 × 630 px, l'anteprima quando si manda il link su WhatsApp |
| `apple-touch-icon.png` | 180 × 180 px, il logo tondo per la home del telefono |

**Come si caricano:** metti il file dentro `assets/img/` con esattamente
quel nome. Il riquadro col segnaposto sparisce da solo.

**Se vuoi aggiungere altri lavori** manda pure `work-04.jpg`, `video-05.mp4`
e così via: li aggiungo io al mosaico con la loro didascalia.

> Peso: le foto meglio sotto i 400 KB. I video pesanti si aprono comunque
> solo quando entrano nello schermo, ma se hai versioni più leggere è meglio.

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
