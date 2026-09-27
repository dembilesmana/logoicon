# LogoIcon Docs

Situs dokumentasi LogoIcon dibangun dengan Astro dan Starlight. Isi dokumentasi berada di `src/content/docs` dan navigasinya dikonfigurasi di `astro.config.mjs`.

## Menjalankan secara lokal

Dari root repository:

```bash
npm install
npm run dev --workspace docs
```

Untuk build production:

```bash
npm run build --workspace docs
npm run preview --workspace docs
```

Lihat dokumentasi yang dihasilkan di [LogoIcon](https://github.com/dembilesmana/logoicon) atau mulai dari halaman [Pengenalan](src/content/docs/index.mdx).
