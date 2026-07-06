# Madrasah Sore Madani — Web App (Prototipe Next.js)

Ini adalah project Next.js siap-jalan berisi prototipe frontend Aplikasi Manajemen
Madrasah Sore Madani (Dashboard, Data Guru, Data Siswa, Absensi Guru, Catatan
Harian, Rekapan Laporan, Pengaturan). Data masih tersimpan di memori browser
(belum tersambung ke database sungguhan) — cocok untuk demo & validasi UI/UX.

## 1. Menjalankan di Komputer Sendiri (Localhost)

Prasyarat: Node.js versi 18 ke atas ([nodejs.org](https://nodejs.org)).

```bash
# 1. Masuk ke folder project
cd madani-app

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev
```

Buka browser ke **http://localhost:3000** — aplikasi akan tampil dan bisa diakses
oleh siapa saja di jaringan lokal yang sama (misalnya HP di WiFi yang sama) lewat
alamat IP komputer Anda, contoh: `http://192.168.1.10:3000`.

## 2. Deploy ke Internet (Dapat URL Publik) — via Vercel

Vercel adalah hosting gratis resmi untuk Next.js, paling mudah untuk pemula.

**Langkah singkat:**

1. Buat akun gratis di [vercel.com](https://vercel.com) (bisa pakai akun GitHub).
2. Upload folder `madani-app` ini ke repository GitHub baru:
   ```bash
   cd madani-app
   git init
   git add .
   git commit -m "Prototipe awal Madrasah Sore Madani"
   git branch -M main
   git remote add origin https://github.com/USERNAME/madani-app.git
   git push -u origin main
   ```
3. Di dashboard Vercel, klik **Add New → Project**, pilih repository `madani-app`.
4. Klik **Deploy** — Vercel otomatis mendeteksi ini project Next.js. Tunggu 1–2 menit.
5. Anda akan mendapat URL publik, contoh: `https://madani-app.vercel.app`
   yang bisa dibuka dan dibagikan ke siapa saja.

**Alternatif tanpa GitHub:** install Vercel CLI (`npm i -g vercel`), lalu jalankan
`vercel` di dalam folder project dan ikuti instruksi di terminal.

## 3. Catatan Penting — Ini Baru Prototipe

- Data (guru, siswa, absensi, dll) **hilang setiap kali halaman di-refresh**
  karena belum ada database. Untuk pemakaian operasional nyata, tahap
  selanjutnya (sesuai rencana 16 tahap) adalah membangun:
  - Database MySQL sungguhan
  - Backend API (Laravel 12 atau Next.js API Routes) untuk autentikasi,
    penyimpanan data permanen, dan validasi bisnis (RBAC, dsb.)
  - Menghubungkan frontend ini ke API tersebut menggantikan data mock (`useState`)
- Setelah backend siap, deploy akan sedikit berbeda: frontend tetap di
  Vercel/hosting sejenis, backend + database di layanan seperti Railway,
  Hostinger, atau VPS (butuh domain & biaya hosting bulanan).

## Struktur Folder

```
madani-app/
├── app/
│   ├── layout.js       # Root layout Next.js
│   ├── page.js         # Halaman utama (render MadaniApp)
│   └── globals.css     # Tailwind directives
├── components/
│   └── MadaniApp.jsx   # Seluruh UI aplikasi (Dashboard, CRUD, dsb.)
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```
