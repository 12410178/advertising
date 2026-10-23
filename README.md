# ClickGuard — API connected, original dashboard retained

Paket ini memperbaiki integrasi frontend React/Vite tanpa mendesain ulang dashboard. Kartu, grafik, tabel, filter, navigasi, dan dataset demo 350 event tetap dipertahankan.

## Perilaku data

- Frontend memeriksa `GET /health` secara terpisah. Respons `status: ok` menandai backend sebagai **terhubung**, meskipun koleksi event masih kosong.
- Frontend meminta `GET /api/events`. Jika API berisi event, data API menjadi sumber utama.
- Backend saat ini merespons `{ data: {}, total: 0, page: 1, limit: 50, totalPages: 0 }`. Itu berarti endpoint merespons, tetapi belum mengembalikan event. Dalam kondisi ini aplikasi memakai `public/data/demoEvents.json` sebagai preview agar tampilan tetap berisi seperti awal. Data preview bukan data MongoDB.
- `GET /api/monitoring/traffic` tetap dipanggil saat rentang grafik berubah. Jika respons traffic kosong, preview grafik sintetis tetap ditampilkan dengan catatan bahwa titik-titiknya adalah ilustrasi, bukan histori aktual.
- `GET /api/monitoring/metrics` membedakan konektivitas backend dari kesiapan model. Status `NO_MODEL_RUN_RECORDED` berarti belum ada hasil model tersimpan.
- Desain asli dipertahankan. Banner oranye traffic kosong di atas grafik dihilangkan agar komposisi awal dashboard tidak bergeser. Status koneksi ditampilkan lewat chip pada panel Model status, panel Pengaturan, dan footer.

## Instalasi aman

1. Buat cadangan `src/App.jsx` dan `src/index.css`.
2. Ekstrak paket ini; salin `src/App.jsx` dan `src/index.css` ke folder `src` proyek frontend. File `index.css` hanya menambah warna status terhubung secara halus; style dashboard lainnya dipertahankan.
3. Jangan menghapus `public/data/demoEvents.json`; file itu diperlukan untuk mempertahankan tampilan preview ketika database belum berisi event.
4. Pastikan `.env` di root proyek berisi:

   ```dotenv
   VITE_API_PROXY_TARGET=http://localhost:5000
   VITE_API_URL=
   ```

5. `vite.config.js` di paket memuat proxy `/api` dan `/health` menuju backend. Jika file Vite milik proyek sudah memiliki konfigurasi lain, gabungkan bagian `server.proxy` dan jangan menimpa konfigurasi lain.
6. Backend Express harus berjalan pada port 5000. Restart Vite setelah perubahan `.env` atau `vite.config.js`, lalu buka alamat yang tercetak di terminal Vite dan tekan `Ctrl+F5`.

## Uji API

Di terminal frontend, jalankan:

```powershell
node scripts/testApi.mjs
```

Skrip ini menguji health, events, dan traffic secara read-only. Tidak ada data baru yang ditulis ke MongoDB.

## Catatan penting

Dengan hasil API yang saat ini dikirimkan, dashboard akan menampilkan 350 event dari dataset preview lokal (77 fraud, 273 valid, 22,0% fraud rate) selama file demo lokal tersebut tetap tersedia. Begitu endpoint events mengembalikan data dari backend, tampilan berpindah ke data API. Agar isi dashboard disebut data aktual, event harus benar-benar disimpan oleh backend ke MongoDB.
