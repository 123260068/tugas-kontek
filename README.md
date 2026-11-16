# Ruang Pattimura

Status ruang kosong, jadwal harian, pemesanan (web/QR), dan panel petugas untuk Gedung Pattimura.

## Menjalankan
1. `cp .env.example .env.local` lalu ganti `STAFF_PASSWORD` dan `AUTH_SECRET`.
2. `npm install && npm run dev` → http://localhost:3000
3. Petugas masuk di `/petugas`: kelola ruang, kunci ruang, ubah kontak, batalkan pemesanan.

## Produksi
- Tanpa Docker: `npm run build && npm start` (set `STAFF_PASSWORD`, `AUTH_SECRET`; `COOKIE_SECURE=true` bila memakai HTTPS).
- Docker: `docker build -t ruang . && docker run -d -p 3000:3000 -v ruang-data:/data -e STAFF_PASSWORD=... -e AUTH_SECRET=... ruang`

Data tersimpan di `data/db.json` (atau `$DATA_DIR`), jadi harus berjalan di satu server dengan disk tetap (bukan Vercel/serverless). Cadangkan file tersebut secara berkala.

## Catatan
- Mahasiswa mendapat kode pembatalan 4 digit saat memesan; petugas bisa membatalkan tanpa kode.
- Semua waktu memakai WIB.
- QR memakai api.qrserver.com; cetak lembar pintu lewat tombol di halaman tiap ruang.
