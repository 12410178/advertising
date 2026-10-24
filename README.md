# ClickGuard --- Dashboard Deteksi Fraud Klik Iklan

ClickGuard adalah dashboard React untuk memantau event klik iklan dan
menampilkan kategori Valid/Fraud. Frontend menggunakan Vite dan
berkomunikasi dengan backend Express.js serta MongoDB.

> **Penting tentang data:** dataset demo revisi berisi 350 event (273
> Valid, 77 Fraud; fraud rate 22,0%). Bukti backend terdahulu mencatat
> agregasi 5.000 event (3.759 Valid, 1.241 Fraud). Kedua angka berasal
> dari konteks/sumber berbeda. Tidak ada klaim bahwa dataset demo 350
> diubah menjadi 5.000.

## Arsitektur

-   React: antarmuka dashboard.
-   Vite: server pengembangan dan build frontend.
-   Tailwind CSS jika dependensi/konfigurasinya aktif; CSS biasa juga
    dapat digunakan di `src/index.css`.
-   Express.js: API backend.
-   MongoDB: database.
-   PowerShell: pemeriksaan API pada Windows.

## Prasyarat

-   Node.js dan npm.
-   MongoDB aktif dan dapat diakses backend.
-   File `.env` lokal backend yang dibuat dari `.env.example`.

## Konfigurasi lingkungan

Dari PowerShell, jika `.env` belum ada:

``` powershell
cd C:\Users\lenovo\ProjectAdvertising\click-fraud-backend
Copy-Item .env.example .env
notepad .env
```

Jika `.env` sudah ada, periksa sebelum menyalin agar tidak tertimpa.
Jangan commit atau membagikan nilai rahasia.

Contoh aturan `.gitignore` (gabungkan dengan aturan proyek yang sudah
ada, jangan hapus aturan lain):

``` gitignore
node_modules/
dist/
.env
.env.*
!.env.example
```

Periksa dari root repositori:

``` powershell
git status --short
git check-ignore -v .env
```

Jika `.env` pernah dilacak Git, pola ignore saja tidak menghapusnya dari
indeks.

## Menjalankan backend

Terminal pertama:

``` powershell
cd C:\Users\lenovo\ProjectAdvertising\click-fraud-backend
node .\src\server.js
```

Pastikan output server menunjukkan status aktual backend dan koneksi
database.

## Menjalankan frontend

Terminal kedua:

``` powershell
cd C:\Users\lenovo\ProjectAdvertising
npm install
npm run dev
```

Buka URL lokal yang dicetak Vite. Port dapat berubah jika port default
sedang digunakan.

## Endpoint yang diperiksa

Base URL lokal: `http://127.0.0.1:5000`

  ---------------------------------------------------------------------------------
  Endpoint                                      Tujuan
  --------------------------------------------- -----------------------------------
  `GET /health`                                 Status layanan dan database

  `GET /api/monitoring/traffic?interval=day`    Agregasi traffic harian

  `GET /api/monitoring/traffic?interval=hour`   Agregasi traffic per jam

  `GET /api/events`                             Daftar event, sesuai route backend

  `GET /api/monitoring/summary`                 Ringkasan monitoring jika route
                                                tersedia

  `GET /api/monitoring/metrics`                 Metrik/status model jika route
                                                tersedia

  `GET /api/blocked-ips`                        Daftar blocked IP jika route
                                                tersedia
  ---------------------------------------------------------------------------------

Verifikasi route di `click-fraud-backend/src` sebelum menganggap semua
endpoint tambahan tersedia pada checkout terbaru.

Bucket traffic dapat berisi `period`, `totalEvents`, `fraudCount`, dan
`validCount`. Jumlah bucket bukan jumlah event; total event dihitung
dengan menjumlahkan `totalEvents` pada seluruh bucket.

## Tes Activity 16

Tes frontend (pastikan script ada di `package.json`):

``` powershell
npm run test:activity16
```

Tes endpoint API:

``` powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-activity16-api.ps1
```

Build frontend:

``` powershell
npm run build
```

Simpan output aktual setelah menjalankan perintah pada revisi terbaru.
Hasil dari versi sebelumnya tidak membuktikan semua perubahan terbaru
telah diuji ulang.

### Hasil API yang terlihat pada sesi revisi

-   `GET /health`: `status: ok`, `database: connected`.
-   Traffic harian: 367 bucket, dari `2024-02-18` sampai `2025-02-18`.
-   Traffic per jam: 3.786 bucket.
-   Ringkasan tes endpoint: 3 berhasil, 0 gagal.

Ini membuktikan endpoint merespons dan mengembalikan bucket pada sesi
tersebut; belum membuktikan total event terkini sama dengan angka pada
laporan terdahulu.

## Dataset demo versus backend

  -------------------------------------------------------------------------
  Sumber                Total           Valid           Fraud Catatan
  ----------- --------------- --------------- --------------- -------------
  Dataset                 350             273              77 Data demo
  demo revisi                                                 untuk
                                                              tampilan
                                                              sesuai revisi

  Backend               5.000           3.759           1.241 Hasil
  pada bukti                                                  historis dari
  terdahulu                                                   bukti
                                                              sebelumnya;
                                                              verifikasi
                                                              ulang untuk
                                                              kondisi
                                                              terbaru
  -------------------------------------------------------------------------

Fraud rate dataset demo adalah `(77 / 350) × 100% = 22,0%`. Jangan
mencampur angka demo dengan agregasi API. Label Valid/Fraud adalah
kategori data, bukan metrik akurasi, precision, atau recall model.

## Tailwind CSS

Tailwind memakai pendekatan utility-first: kelas seperti `flex`,
`gap-4`, `rounded-xl`, `border`, `text-sm`, dan `bg-white` membantu
mengatur layout, jarak, warna, tipografi, border, dan responsivitas.
Verifikasi `package.json`, konfigurasi Tailwind, CSS entry, dan
`src/index.css`. Jika proyek memakai Tailwind dan CSS biasa,
dokumentasikan keduanya; jangan mengklaim semua styling berasal dari
Tailwind tanpa bukti konfigurasi.

## Troubleshooting

-   Health gagal: pastikan backend berjalan pada port yang benar.
-   Database gagal terhubung: periksa status MongoDB dan konfigurasi
    `.env` tanpa membagikan rahasia.
-   Traffic kosong: bedakan respons sukses tanpa bucket dari error
    server/jaringan. Jangan menampilkan data sintetis sebagai histori
    aktual.
-   Label waktu keliru: periksa field `period`, pengurutan, agregasi,
    dan zona waktu UTC/lokal.
-   Model belum tersedia: koneksi database tidak membuktikan model run
    sudah tersimpan atau inferensi berjalan.
-   Tes/build gagal: perbaiki berdasarkan error terbaru lalu jalankan
    ulang.

## Checklist bukti akhir

-   [ ] `npm run test:activity16` terbaru.
-   [ ] `npm run build` terbaru.
-   [ ] Screenshot grafik untuk setiap filter yang tersedia.
-   [ ] Screenshot tooltip dan legenda.
-   [ ] Screenshot tes API terbaru.
-   [ ] Panel demo diberi label demo dan panel API diberi label backend.
-   [ ] `.env` diabaikan Git dan rahasia tidak ikut commit.
-   [ ] Status model mengikuti respons backend yang benar-benar
    tersedia.

## Batasan

Dokumentasi ini merangkum bukti yang tersedia saat penyusunan.
Verifikasi skrip, endpoint tambahan, konfigurasi Tailwind, build/test,
dan filter pada checkout terbaru. Keberhasilan API tidak membuktikan
model siap, dan dataset demo tidak mewakili jumlah dokumen MongoDB
kecuali diperiksa langsung.
