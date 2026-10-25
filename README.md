# Progress 18 — Scatter Plot dan Event Terbaru pada Dashboard ClickGuard

> **Cara menggunakan bagian ini:** gabungkan ke `README.md` project yang sudah ada. Jangan mengganti seluruh README hanya dengan bagian ini. Deskripsi ini diselaraskan dengan versi `App.jsx` Progress 18 yang ditinjau.

## Tujuan aktivitas

Progress 18 berfokus pada bagian **React dashboard, Tailwind CSS & visualisasi** dengan target menampilkan scatter plot dan tabel event terbaru di halaman Overview ClickGuard. Perubahan mempertahankan struktur dashboard yang sudah ada dan menyambungkan ringkasan ke daftar event yang dapat ditelusuri lebih lanjut.

## Fitur yang didokumentasikan

- **Traffic/scatter plot:** menampilkan seri Valid dan Fraud dalam warna berbeda, titik per bucket waktu, garis tren, sumbu periode, dan tooltip. Pilihan periode pada UI mencakup Per jam, Per hari, Per minggu, Per bulan, dan Per tahun.
- **Event Terbaru:** memperlihatkan maksimum 10 event di Overview. Baris diurutkan dari timestamp terbaru yang dapat diparse dan menampilkan Click ID, IP Address, Device, Timestamp, Classification, serta Risk score. Klik/tekan Enter/Space pada baris membuka detail event.
- **Lihat semua event:** mereset filter klasifikasi/perangkat, mengembalikan pagination ke halaman pertama, dan menuju halaman Click events.
- **Kembali ke Overview:** tersedia pada halaman Click events.
- **Filter bersama:** filter klasifikasi (Semua/Fraud/Valid) dan perangkat (Semua perangkat/Desktop/Mobile/Tablet) membentuk satu koleksi hasil filter yang dipakai oleh empat KPI, grafik, preview Event Terbaru, dan tabel Click events.

## Sumber data dan endpoint

### Event

Frontend memuat event melalui:

```http
GET /api/events?page=1&limit=50
```

Implementasi melanjutkan permintaan halaman berikutnya sesuai informasi pagination pada payload API. Record yang diterima dinormalisasi sebelum dipakai di UI. `GET /api/events` adalah sumber untuk daftar event, KPI berbasis event, preview Event Terbaru, dan penghitungan grafik dari timestamp event.

### Traffic aggregation

Grafik juga mencoba endpoint agregasi:

```http
GET /api/monitoring/traffic?interval=hour
GET /api/monitoring/traffic?interval=day
```

Mode **Per jam** memakai `interval=hour`. Mode **Per hari, Per minggu, Per bulan, dan Per tahun** menggunakan `interval=day`, kemudian dikelompokkan lebih lanjut di frontend sesuai periode yang dipilih.

Jika endpoint agregasi tidak menghasilkan baris yang dapat dipakai, komponen mencoba menggunakan event API bertimestamp untuk menghitung bucket sendiri. Pada source code Progress 18 yang ditinjau, grafik tidak membuat titik demo sintetis saat sumber API tidak memiliki data yang bisa digambarkan; UI menunjukkan status loading, kosong, atau error sesuai kondisi.

Jika alamat API tidak ditentukan melalui `VITE_API_URL`, kode frontend membentuk path same-origin `/api/...` dan mengandalkan proxy Vite di konfigurasi development. Gunakan host/port yang sesuai untuk lingkungan project dan jangan memasukkan secret atau URI berkredensial ke README.

## Aturan filter dan perhitungan KPI

Koleksi `filtered` dibentuk berdasarkan klasifikasi dan tipe perangkat. Nilai KPI dihitung dari koleksi ini:

- `total = filtered.length`
- `fraudCount = jumlah event terfilter dengan label fraud`
- `validCount = total - fraudCount`
- `fraudRate = fraudCount / total * 100`, atau `0` saat total nol

Koleksi yang sama diberikan ke grafik dan dipakai saat menentukan 10 event terbaru. Karena itu, filter diharapkan mengubah KPI, grafik, dan tabel secara konsisten. Kategori perangkat disimpulkan dari kategori eksplisit, field device, sistem operasi, dan user-agent bila tersedia; record tanpa petunjuk yang bisa dipetakan mungkin tidak masuk filter desktop/mobile/tablet.

## Pemeriksaan build

Build frontend yang dilaporkan untuk Progress 18:

```text
vite v6.4.4 building for production...
✓ 1577 modules transformed.
✓ built in 9.81s
```

Output tersebut mendukung bahwa Vite berhasil membuat berkas produksi untuk source yang diuji. Build bukan bukti tunggal bahwa seluruh endpoint API, MongoDB, dan skenario interaksi browser telah lulus end-to-end.

## Checklist verifikasi yang disarankan

1. Jalankan frontend dan pastikan server Express hidup.
2. Buka Overview dan periksa bahwa KPI, grafik, dan tabel ditampilkan dari data API yang benar.
3. Buka `F12` → **Network**. Periksa request `/api/events` dan `/api/monitoring/traffic`, status HTTP, serta payload responsnya.
4. Ubah periode chart dan pastikan label bucket berubah sesuai pilihan. Bila API kosong/gagal, pastikan UI menampilkan status yang sesuai dan tidak menampilkan titik demo seolah-olah data aktual.
5. Terapkan filter Fraud, Valid, Desktop, Mobile, atau Tablet dan pastikan KPI, grafik, dan tabel mengikuti filter yang sama.
6. Klik satu baris Event Terbaru untuk membuka detail, kemudian uji **Lihat semua event** dan **Kembali ke Overview**.
7. Ambil screenshot aktual untuk Overview, tabel, filter, navigasi, dan output `npm run build`. Jangan membuat atau mengedit screenshot agar menyerupai hasil sukses.

## Status bukti saat catatan ini disusun

- **Source code:** komponen grafik, tabel Event Terbaru, filter bersama, dan handler navigasi tersedia dalam App.jsx yang diperiksa.
- **Build frontend:** dilaporkan berhasil oleh output Vite 6.4.4, 1.577 modul, 9,81 detik.
- **Tampilan browser:** pengguna melaporkan output browser sudah sesuai. Screenshot yang tersedia untuk lampiran ini hanya berupa potongan header panel Event Terbaru; ambil screenshot layar penuh untuk dokumentasi yang lebih lengkap.
- **API end-to-end:** jangan memberi status lulus hanya dari keberadaan `fetch()` atau hasil build. Cantumkan hasil aktual setelah memeriksa Network/HTTP response di lingkungan yang menjalankan backend.
