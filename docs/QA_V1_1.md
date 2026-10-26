# QA v1.1 — 26 Oktober 2026

Pengujian otomatis dilakukan di Chromium (lokal melalui HTML, CSS, JavaScript dan gambar yang di-inline untuk menghindari pembatasan jaringan lingkungan uji).

| Viewport | 7 section | Photo asset | Contacts (6 anchors) | JS error | Horizontal overflow |
|---|---|---|---|---|---|
| 1440×900 | pass | pass | pass | none | none |
| 1024×768 | pass | pass | pass | none | none |
| 768×1024 | pass | pass | pass | none | none |
| 390×844 | pass | pass | pass | none | none |
| 320×640 | pass | pass | pass | none | none |

Interaction tests: gallery filter (2 entries for Pendidikan), photo popup open/Esc close, certificate next/slide index, mobile menu open/contact navigate/close. Automated tests are run against locally compiled HTML with exact source JS and assets. Link destination URLs are inspected. Website has **not** been hosted to the public internet; external WhatsApp and Instagram services could not be proven accessible by automated browser checks.

New in this version: `touchstart/touchend` for certificate gallery swipe, left/right keyboard navigation, more explicit contact destination labels, keyboard loop for mobile menu.
