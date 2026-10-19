# ClickGuard — Project Advertising

Kerangka awal dashboard React untuk proyek Sistem Deteksi Fraud Klik Iklan Digital Menggunakan Machine Learning (Kelompok 2).

## Ruang lingkup
- React + JavaScript dengan Vite.
- Tailwind CSS untuk styling.
- Layout dashboard responsif: sidebar, header, kartu metrik, panel traffic, status model, dan tabel event.
- Komponen dipisah agar mudah dikembangkan pada aktivitas integrasi berikutnya.
- Data metrik sengaja berupa placeholder. Frontend ini belum mengklaim terhubung ke API atau model machine learning.

## Prasyarat
- Node.js versi LTS yang masih didukung.
- npm.

## Instalasi dan menjalankan
1. Ekstrak folder proyek.
2. Buka terminal di folder `Project Advertising`.
3. Jalankan:

   ```bash
   npm install
   npm run dev
   ```

4. Buka URL lokal yang ditampilkan Vite di terminal (umumnya `http://localhost:5173`).

## Pemeriksaan build

```bash
npm run build
npm run preview
```

## Struktur folder

```text
Project Advertising/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    └── components/
        ├── MetricCard.jsx
        ├── Panel.jsx
        └── Sidebar.jsx
```

## Catatan integrasi
Laporan Progress 8 yang tersedia membahas service database, bukan bukti endpoint HTTP Express telah tersedia. Sebelum menghubungkan data nyata, konfirmasikan route/API dari anggota backend. Status `model_runs` juga tidak boleh ditafsirkan sebagai bukti bahwa model sudah terlatih atau siap digunakan.
