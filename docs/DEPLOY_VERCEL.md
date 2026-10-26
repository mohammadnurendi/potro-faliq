# Panduan Hosting di Vercel — Tanpa Database

Situs ini dibangun sebagai **static website**, sehingga tidak perlu database, API key, backend, npm, atau deployment build.

## Cara melalui GitHub (direkomendasikan)

1. Ekstrak paket `Faliq_Portfolio_GitHub_Ready_v1_2.zip`.
2. Masukkan **isi ZIP** (bukan folder pembungkus) ke root repo GitHub baru. Pastikan `index.html` ada di root.
3. Buka Vercel → Add New → Project → Import Git Repository.
4. Pilih repository tersebut.
5. Framework preset: `Other` (static).
6. Build command: kosongkan / nonaktifkan; Output Directory: root project / `.` jika diminta.
7. Deploy. Vercel akan menayangkan `index.html` dan aset lokal.
8. Uji semua navigasi, galeri, kontak, PDF, sertifikat, dan mobile.
9. Jika perlu, tambah domain di project settings, lalu update metadata `og:image` setelah domain tersedia.

## Pilihan preview lokal

- Double-click `index.html`, atau
- Jalankan `python -m http.server 8000` dari folder situs, lalu buka `http://localhost:8000`.

## Update kontak

- WhatsApp: `https://wa.me/62813...` dengan kode negara, tanpa `+`/nol awal.
- Email: `mailto:alamat@email.com`.
- Instagram: `https://www.instagram.com/username/`.

Tidak membutuhkan database karena semua konten disimpan di kode/berkas lokal. Saat konten berubah, lakukan commit dan Vercel redeploy otomatis.

**Perhatian:** Publikasi membuat semua aset di folder situs dapat diakses siapa saja. Ikuti daftar persetujuan di `PUBLICATION_CHECKLIST.md`.

Pemilik telah menyetujui publikasi konten dan kontak pada 26 Oktober 2026. Persetujuan orang lain yang muncul dalam foto tetap perlu diperiksa sebelum repo dan situs dibuat publik.
