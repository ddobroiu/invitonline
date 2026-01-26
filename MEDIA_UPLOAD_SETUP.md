# 🎵🎬📸 Configurare Upload Media (Audio/Video/Imagini)

## Funcționalitate Nouă

Aplicația suportă acum încărcarea de fișiere **audio**, **video** și **imagini** pentru anumite template-uri de invitații:

- **🎬 Template Netflix**: Suportă upload video (MP4, WebM, max 100MB)
- **💿 Template Vinyl**: Suportă upload audio (MP3, WAV, max 50MB)
- **🛂 Template Passport**: Suportă upload imagine pentru fotografia de pașaport (JPG, PNG, max 10MB)
- **📰 Template Newspaper**: Suportă upload imagine pentru articolul de ziar (JPG, PNG, max 10MB)

## Configurare Cloudinary

Pentru a activa funcționalitatea de upload, trebuie să configurezi un cont gratuit Cloudinary:

### Pasul 1: Creează cont Cloudinary

1. Accesează [https://cloudinary.com](https://cloudinary.com)
2. Click pe **"Sign Up for Free"**
3. Completează formularul sau autentifică-te cu Google/GitHub
4. Verifică email-ul și activează contul

### Pasul 2: Obține credențialele

1. După autentificare, vei fi redirecționat către **Dashboard**
2. În secțiunea **"Product Environment Credentials"** vei găsi:
   - **Cloud Name** (ex: `dqwerty123`)
   - **API Key** (ex: `123456789012345`)
   - **API Secret** (ex: `abcdefghijklmnopqrstuvwxyz123`)

### Pasul 3: Configurează variabilele de mediu

Editează fișierul `.env` din rădăcina proiectului și completează:

```env
# === CLOUDINARY (Media Upload) ===
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Exemplu complet:**
```env
CLOUDINARY_CLOUD_NAME=dqwerty123
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123
```

### Pasul 4: Restart server-ul

După ce ai salvat fișierul `.env`, restart server-ul de development:

```bash
# Oprește serverul (Ctrl+C)
# Apoi pornește-l din nou:
npm run dev
```

## Cum funcționează

### Pentru clienți (utilizatori):

1. Selectează template-ul **Netflix** sau **Vinyl** în pagina de creare
2. În pasul de **Configurare**, vei vedea o secțiune nouă pentru upload media
3. Click pe **"Selectează fișier Audio/Video"**
4. Alege fișierul de pe computer
5. Așteaptă încărcarea (se afișează progress)
6. Fișierul va fi afișat în preview și va fi redat în invitația finală

### Pentru template Netflix:

- Video-ul va apărea ca **"Trailer Oficial"** între secțiunea hero și episoade
- Vizitatorii pot da play/pause și controla volumul
- Video-ul are un poster placeholder până când se dă play

### Pentru template Vinyl:

- Audio-ul va fi redat automat când vizitatorul dă click pe vinyl sau butonul play
- Animația vinyl-ului se sincronizează cu redarea audio
- Sound wave-ul se animează când audio-ul este activ

### Pentru template Passport:

- Imaginea va apărea în zona de fotografie a pașaportului
- Dacă nu se încarcă imagine, se afișează o iconiță placeholder
- Imaginea este optimizată automat la dimensiunea corectă

### Pentru template Newspaper:

- Imaginea va apărea în articolul de ziar ca fotografie principală
- Dacă nu se încarcă imagine, se afișează o iconiță placeholder
- Imaginea este optimizată automat pentru print-style

## Limitări Plan Gratuit Cloudinary

- **Stocare**: 25 GB
- **Bandwidth**: 25 GB/lună
- **Transformări**: 25 credite/lună
- **Video**: Max 10 minute/video

Pentru majoritatea utilizatorilor, planul gratuit este suficient!

## Troubleshooting

### Eroare: "Upload failed"

1. Verifică că ai completat corect toate cele 3 variabile în `.env`
2. Asigură-te că ai restartat serverul după modificarea `.env`
3. Verifică că fișierul nu depășește limita de mărime (50MB audio, 100MB video)

### Video/Audio nu se redă

1. Verifică că browser-ul suportă formatul (folosește MP4 pentru video, MP3 pentru audio)
2. Deschide consola browser-ului (F12) și caută erori
3. Verifică că URL-ul Cloudinary este valid (ar trebui să înceapă cu `https://res.cloudinary.com/`)

### Fișierul se încarcă prea lent

1. Comprimă fișierul înainte de upload
2. Pentru video: folosește rezoluție mai mică (720p în loc de 1080p)
3. Pentru audio: folosește bitrate mai mic (128kbps în loc de 320kbps)

## Securitate

- Fișierele sunt stocate pe CDN-ul global Cloudinary (securizat)
- API Secret-ul nu este expus în frontend (doar în server-side API routes)
- Fișierele sunt publice dar URL-urile sunt greu de ghicit (UUID-uri)

## Suport

Pentru probleme sau întrebări, contactează echipa de development.
