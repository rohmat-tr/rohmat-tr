# SIMAPAN

SIMAPAN (Sistem Informasi Manajemen Administrasi dan Pelayanan) adalah contoh aplikasi SPA untuk mengelola permohonan layanan administrasi internal pemerintahan/organisasi. Proyek ini mencakup frontend React + Tailwind dan backend Express dengan basis data SQL.

## Arsitektur & Struktur Folder
- `frontend/` – SPA React dengan React Router, Tailwind CSS, komponen modular.
  - `src/pages` – Halaman Dashboard dan Permohonan.
  - `src/components` – Komponen UI reusable (layout, tabel, modal, pagination, kartu statistik, dsb).
  - `src/api` – Klien API berbasis Axios.
- `backend/` – REST API Express.
  - `src/routes` – Endpoint ringkasan dan CRUD `service_requests`.
  - `src/db.js` – Koneksi MySQL dan bootstrap tabel.
- `database/schema.sql` – Skrip SQL (CREATE TABLE + INSERT contoh data).

## Menjalankan Backend
```bash
cd backend
cp .env.example .env # sesuaikan kredensial database MySQL/PostgreSQL (contoh MySQL)
npm install
npm run dev
```
Server akan berjalan di `http://localhost:4000`.

## Menjalankan Frontend
```bash
cd frontend
npm install
npm run dev
```
Aplikasi akan tersedia di `http://localhost:5173` dan menggunakan `VITE_API_BASE_URL` (default `http://localhost:4000/api`).

## SQL (MySQL)
Lihat `database/schema.sql` untuk struktur tabel dan contoh data:
- `service_requests`: menyimpan permohonan layanan (nomor referensi, pemohon, jenis layanan, status, catatan, timestamp).
- Index pada `reference_no` dan `status` untuk pencarian/paginasikan cepat.

## Fitur Utama
- Dashboard ringkasan statistik permohonan.
- Manajemen data permohonan layanan:
  - List tabel + pencarian + filter status + pagination.
  - Tambah, edit, hapus (konfirmasi) dengan validasi sederhana.
  - SPA tanpa reload; state dikelola dengan hooks.
- UI responsif dengan Tailwind, komponen reusable.

## Catatan Pengembangan
- Otentikasi belum diterapkan; fokus pada alur CRUD inti.
- Struktur dan komponen dapat diperluas untuk entitas lain sesuai kebutuhan instansi.
