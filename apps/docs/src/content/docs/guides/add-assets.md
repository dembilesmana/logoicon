---
title: Menambah aset ikon
description: Alur kontribusi untuk menambahkan file SVG baru ke LogoIcon.
---

## 1. Tambahkan SVG

Letakkan SVG baru di direktori kategori yang sesuai di `packages/core/assets`. Ikuti pola nama aset yang sudah ada, termasuk informasi brand, nama, warna, mode, dan kategori jika bagian tersebut digunakan oleh koleksi terkait.

## 2. Jalankan generator Core

Dari root repository:

```bash
npx turbo run generate --filter=@logoicon/core
```

Generator menghapus output lama lalu memproses semua file dari `assets` ke `.assets`. Jika ada SVG yang tidak valid, proses akan berhenti dan error perlu diperbaiki sebelum lanjut.

## 3. Generate komponen React

```bash
npx turbo run generate --filter=@logoicon/react
```

Langkah ini membaca ekspor aset Core, membuat file `.tsx`, index export, dan metadata React di `packages/react/.dist`.

## 4. Validasi

Jalankan pemeriksaan tipe dan build yang relevan:

```bash
npm run check-types
npx turbo run build --filter=@logoicon/react
```

Output `.assets`, `.dist`, dan `dist` adalah artefak build yang diabaikan Git. Jangan menambahkan hasil generate tersebut secara manual kecuali workflow repository memintanya.