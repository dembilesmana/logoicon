# LogoIcon Docs

Situs dokumentasi LogoIcon dibangun dengan Astro dan Starlight. Isi dokumentasi berada di `src/content/docs` dan navigasinya dikonfigurasi di `astro.config.mjs`.

## Menjalankan secara lokal

Dari root repository:

```bash
pnpm install
pnpm --filter docs dev
```

Untuk build production:

```bash
pnpm --filter docs build
pnpm --filter docs preview
```

Lihat dokumentasi yang dihasilkan di [LogoIcon](https://github.com/dembilesmana/logoicon) atau mulai dari halaman [Pengenalan](src/content/docs/index.mdx).
