---
title: Menjalankan project secara lokal
description: Perintah utama untuk mengembangkan LogoIcon dan situs katalog.
---

## Pasang dependency

```bash
npm install
```

Project menggunakan npm workspaces dan Turborepo. Jalankan perintah dari root repository agar dependency antar-paket terdeteksi.

## Jalankan aplikasi

Untuk menjalankan katalog web dan dokumentasi bersama-sama:

```bash
npm run dev
```

Situs katalog berada di aplikasi `web`, sedangkan dokumentasi ini berada di aplikasi `docs`. Port ditampilkan oleh masing-masing dev server.

Untuk satu aplikasi saja:

```bash
npm run dev --workspace web
npm run dev --workspace docs
```

## Siklus build

```bash
npm run check-types
npm run lint
npm run build
```

Tugas Turbo mengikuti dependency graph. Build aplikasi yang memakai paket hasil generate akan menjalankan tugas generate yang diperlukan lebih dahulu.