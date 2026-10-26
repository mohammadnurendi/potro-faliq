# QA — FALIQ. Portfolio v1.5

Pengujian browser dilakukan dengan Chromium melalui render yang menyematkan aset secara lokal. Pengujian URL localhost langsung di browser otomasi dibatasi lingkungan uji, tetapi HTTP server Python dapat menyajikan file HTML/CSS/JS melalui kode status 200.

## Hasil

- JavaScript error: tidak ditemukan pada tiga ukuran layar (1440×900, 390×844, 320×720).
- Horizontal overflow: tidak ditemukan pada tiga ukuran layar.
- Hero: foto utama berhasil dimuat, badge/logo tambahan tidak ada.
- About: warna latar CSS terhitung rgb(255,255,255).
- Contact: latar bright blue (gradien #284dff–#4166ff).
- Galeri: modal 3 foto, thumbnail dan navigasi berikutnya berfungsi.
- Sertifikat: modal memuat sertifikat terbuka berukuran 720×953, bukan preview disamarkan.
- Tautan sertifikat: mengarah ke file JPEG asli dalam `assets/certificates/original/`.
- Transition navigasi: klik anchor About dan Journey menuju bagian yang sesuai; efek wipe berhenti sesudah animasi.
- Keyboard Escape: menutup modal.
- Motion: memperhatikan `prefers-reduced-motion`.

## Catatan

Efek 3D adalah CSS perspective/tilt ringan, bukan WebGL. Animasi halaman adalah transisi antara bagian single-page, bukan antarhalaman terpisah.

Foto pribadi/sensitif dikeluarkan dari galeri publik. Untuk orang lain yang tampak dalam dokumentasi, izin publikasi tetap harus dipastikan secara independen.
