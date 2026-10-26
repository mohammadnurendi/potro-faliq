# QA — FALIQ. Portfolio v1.6

Tanggal: 26 Oktober 2026. Browser: Microsoft Edge (Chromium), headless, dengan emulasi viewport dan touch. Ini pemeriksaan browser; perangkat fisik dan Safari iOS belum diuji.

## Layout

Lulus pada 14 ukuran: 320×568, 360×640, 375×667, 390×844, 393×852, 412×915, 430×932, 568×320, 667×375, 844×390, 932×430, 768×1024, 1024×768, dan 1440×900.

- Tidak ditemukan horizontal overflow halaman, heading terpotong, atau konten utama di luar viewport.
- Judul hero berada di bawah header; portrait berhasil dimuat.
- Menu dapat digulir sampai tautan terakhir pada landscape pendek.
- Popup dapat digulir sampai tautan file asli; tombol tutup tetap dapat dijangkau pada HP.
- Screenshot hero, kontak, galeri, dan sertifikat diperiksa secara visual.

## Interaksi

- WhatsApp dan Instagram memakai simbol SVG yang sesuai; seluruh referensi sprite valid.
- Filter galeri mengubah jumlah kartu dengan benar.
- Navigasi foto, thumbnail, dan swipe horizontal berfungsi; swipe vertikal tidak mengganti foto.
- Sertifikat dapat diganti dan dibuka, dengan tautan menuju JPEG asli.
- Halaman di belakang popup terkunci dan posisi scroll dipulihkan saat popup ditutup.
- Tab dan Shift+Tab tetap di dalam menu; klik wordmark menutup menu.
- Fokus thumbnail tetap terjaga setelah pergantian gambar; Escape menutup popup.
- Tidak ditemukan error JavaScript pada pemeriksaan layout dan interaksi.
- Pemeriksaan aset, kontak, sintaks JavaScript, dan `git diff --check` lulus.

## Menjalankan ulang

Pemeriksaan aset tidak memerlukan dependency tambahan:

```powershell
python scripts/verify_site.py
node --check main.js
node --check motion-v15.js
```

Pemeriksaan browser membutuhkan paket Playwright dan Microsoft Edge. Script membuat HTTP server lokal sementara, lalu menutupnya setelah pengujian:

```powershell
node scripts/qa_responsive.cjs
```

Screenshot dan hasil JSON masuk ke `qa-output/` (diabaikan Git). Opsi: `QA_OUTPUT` untuk folder hasil, `QA_SIZES` untuk ukuran tertentu (contoh `390x844,844x390`), `QA_URL` untuk server yang sudah berjalan, dan `QA_CHANNEL` untuk channel browser Chromium lain yang terpasang.
