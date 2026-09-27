---
title: Basic
description: Salin atau unduh ikon LogoIcon lalu gunakan langsung tanpa package tambahan.
---

LogoIcon dapat digunakan tanpa library atau framework. Pilih ikon di situs [LogoIcon](https://logoicon.vercel.app), lalu gunakan tombol **Copy** untuk menyalin SVG atau **Download** untuk mengunduh file SVG.

## Menggunakan file SVG

Simpan file SVG yang sudah diunduh ke folder asset project, misalnya `public/icons/github.svg`. File tersebut dapat digunakan sebagai gambar dengan HTML:

```html
<img src="/icons/github.svg" width="24" height="24" alt="GitHub" />
```

Gunakan `alt` yang deskriptif jika ikon menyampaikan informasi. Untuk ikon dekoratif yang sudah memiliki label teks di sekitarnya, gunakan `alt=""`.

## Menyalin SVG ke HTML

Gunakan opsi **Copy** jika ingin menempelkan SVG langsung ke markup HTML:

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  id="2f7ccd17__svg1"
  version="1.1"
  viewBox="0 0 24 21.724138"
>
  <defs id="a213fb57__defs1"></defs>
  <title id="39c1f93f__title1">HTML5 CSS Styling Logo</title>
  <path
    id="1e32c004__path1"
    stroke-width="0.108893"
    d="M 3.5716878,0 2.7658802,4.0290381 H 19.165154 L 18.653358,6.6315789 H 2.2431942 L 1.4482759,10.660617 H 17.84755 l -0.914701,4.595281 -6.6098,2.188748 -5.7277677,-2.188748 0.3920145,-1.99274 H 0.95825771 L 0,18.098004 9.4736842,21.724138 20.395644,18.098004 21.84392,10.823956 22.137931,9.3647913 24,0 Z"
  ></path>
</svg>
```

Salin seluruh elemen `<svg>`, termasuk atribut `viewBox` dan elemen di dalamnya. Jangan menghapus atribut tersebut karena `viewBox` menjaga perbandingan ukuran ikon saat SVG diubah ukurannya.

## Mengubah ukuran dan warna

File SVG dapat diatur ukurannya dengan atribut HTML atau CSS:

```html
<img class="brand-icon" src="/icons/github.svg" alt="GitHub" />
```

```css
.brand-icon {
  width: 2rem;
  height: 2rem;
}
```

Warna inline SVG bergantung pada atribut `fill` atau `stroke` yang ada pada SVG tersebut. Jika SVG menggunakan `currentColor`, warnanya dapat mengikuti warna elemen induk:

```html
<svg class="brand-icon" aria-hidden="true" focusable="false">
  <!-- Tempel isi SVG hasil copy dari situs LogoIcon di sini. -->
</svg>
```

```css
.brand-icon {
  color: #111827;
  width: 2rem;
  height: 2rem;
}
```

## Kapan menggunakan library?

Gunakan SVG langsung jika Anda hanya membutuhkan asset ikon dan tidak ingin menambahkan dependency. Jika project Anda menggunakan React dan membutuhkan komponen yang dapat menerima props SVG, lihat [panduan penggunaan LogoIcon di React](/guides/react/usage) dan [panduan instalasi library React](/guides/react/installation).
