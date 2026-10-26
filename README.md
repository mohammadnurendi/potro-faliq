# FALIQ. — Cinematic Interactive Portfolio v1.6

Versi 1.6 mengganti ikon kontak dan navigasi dengan SVG lokal serta merapikan tampilan HP:

- Logo WhatsApp dan Instagram sesuai layanan; ikon email, unduh, panah, dan tutup tampil konsisten.
- Layout adaptif mulai 320px, termasuk portrait, landscape, tablet, dan desktop.
- Safe area iPhone, tombol sentuh minimal 44px, menu yang dapat digulir, serta popup foto dan sertifikat yang tetap dapat dibaca.
- Scroll halaman kembali ke posisi semula setelah popup ditutup; gesture vertikal tidak mengganti foto.
- Navigasi keyboard tetap berada dalam menu/popup yang sedang terbuka.

Hasil uji dan cara menjalankan pemeriksaan browser ada di `docs/QA_V1_6.md`.

Versi 1.5 menambahkan delapan kategori motion ringan dan memperbarui UI sesuai revisi.

- Tanpa logo/badge pada hero; navbar wordmark teks.
- Section terang memakai putih bersih; bagian kontak memakai biru kuat.
- Micro-interactions: magnetic & spring on buttons.
- Scroll/reveal animations and directional parallax.
- Smooth blue chapter transitions on internal navigation (single-page site).
- Morphing blue shape in hero.
- CSS 3D hover on gallery and certificate card (bukan scene WebGL/objek 3D berat).
- Gallery modal with separately viewable photos, thumbnails, responsive sizing, full certificate assets.
- Respects `prefers-reduced-motion`; most effects disabled on touch devices.

## Run locally (Windows, VS Code)

```powershell
py -m http.server 5500
```

Open http://localhost:5500 . Jangan jalankan dua server pada port yang sama; tutup dengan Ctrl+C.

## Deploy

File statis di root. Push ke GitHub dan gunakan Vercel Other / static (tanpa build command), atau upload sebagai static website.

## Data

Kontak bisa diedit pada `site-config.js`. Publikasi foto orang lain tetap perlu izin yang sesuai.

## Important

Animasi 3D adalah efek CSS perspektif, bukan 3D scene yang menggunakan WebGL. Website single-page menggunakan transisi antar-section, bukan transisi antar-rute.

Sertifikat asli tersedia di `assets/certificates/original/`; tautan “Buka file asli” membuka JPEG asli. Foto dengan situasi privat dikecualikan dari galeri publik.
