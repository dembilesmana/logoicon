---
title: Metadata
description: Filter, kelompokkan, dan paginasi katalog ikon menggunakan metadata bawaan.
---

Package `@logoicon/react` mengekspor metadata statis untuk membangun pencarian, filter, atau katalog ikon dalam aplikasi React. Instal package melalui [panduan instalasi React](/guides/react/installation). Untuk daftar lengkap tipe dan fungsi metadata, lihat [referensi API React](/reference/react-api).

## Filter berdasarkan brand

```ts
import { getAll } from "@logoicon/react";

const githubIcons = getAll().filter((icon) => icon.brand === "github");
```

Helper untuk daftar filter tersedia melalui `listBrands()` dan `listCategories()`:

```ts
import { listBrands, listCategories } from "@logoicon/react";

const brands = listBrands();
const categories = listCategories();
```

Kedua fungsi mengembalikan nilai unik yang sudah diurutkan.

## Paginasi

`paginate` menerima array readonly, nomor halaman, dan jumlah item per halaman. Nomor halaman dinormalisasi ke rentang yang tersedia dan minimal selalu menghasilkan satu halaman.

```ts
import { getAll, paginate } from "@logoicon/react";

const result = paginate(getAll(), 1, 24);
// { page, perPage, total, pages, items }
```

`items` adalah potongan array untuk halaman aktif; `total` adalah jumlah seluruh item; `pages` adalah jumlah halaman.

Untuk penggunaan ikon sebagai komponen, lihat [panduan penggunaan React](/guides/react/usage). Metadata package ini tidak diperlukan jika Anda hanya [mengunduh atau menyalin SVG](/guides/basics) dari katalog.
