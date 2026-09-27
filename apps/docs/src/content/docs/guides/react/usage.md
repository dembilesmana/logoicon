---
title: Penggunaan
description: Pola penggunaan komponen LogoIcon dalam aplikasi React.
---

## Import named export

Setiap ikon tersedia sebagai named export dari `@logoicon/react`. Jika package belum terpasang, ikuti [panduan instalasi React](/guides/react/installation). Import hanya ikon yang digunakan agar bundler dapat melakukan tree-shaking.

```tsx
import { GithubIconDark, LinkedinIcon } from "@logoicon/react";

export function SocialLinks() {
  return (
    <nav aria-label="Social links">
      <a href="https://github.com" aria-label="GitHub">
        <GithubIconDark width={20} height={20} aria-hidden="true" />
      </a>
      <a href="https://linkedin.com" aria-label="LinkedIn">
        <LinkedinIcon width={20} height={20} aria-hidden="true" />
      </a>
    </nav>
  );
}
```

## Props dan styling

Komponen menerima `SVGProps<SVGSVGElement>`, termasuk `className`, `style`, `width`, `height`, `fill`, `stroke`, `role`, dan `aria-*`.

```tsx
<GithubIconDark
  className="icon"
  width={32}
  height={32}
  style={{ display: "block" }}
  aria-hidden="true"
/>
```

Daftar komponen, tipe, dan helper metadata tersedia di [referensi API React](/reference/react-api). Jika Anda hanya memerlukan file ikon tanpa dependency, gunakan [panduan SVG langsung](/guides/basics).

## Aksesibilitas

Gunakan `aria-hidden="true"` ketika ikon hanya dekorasi dan label teks sudah tersedia. Jika ikon adalah satu-satunya isi tombol atau link, gunakan `aria-label` pada kontrol tersebut atau `role="img"` dan label yang sesuai.

## Nama ikon dinamis

Untuk picker atau katalog, gunakan `metadata` untuk memperoleh nama, lalu ambil komponen dari namespace paket. Selalu sediakan fallback karena data eksternal dapat merujuk ikon yang tidak terpasang pada versi paket saat ini.
