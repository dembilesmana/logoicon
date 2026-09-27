---
title: Perintah workspace
description: Referensi perintah npm dan Turborepo yang tersedia di repository.
---

Jalankan semua perintah berikut dari root repository.

| Perintah | Fungsi |
| --- | --- |
| `npm install` | Memasang dependency semua workspace. |
| `npm run dev` | Menjalankan web dan docs dalam mode watch. |
| `npm run build` | Build workspace yang ditargetkan oleh script root. |
| `npm run check-types` | Menjalankan pemeriksaan TypeScript. |
| `npm run lint` | Menjalankan lint pada workspace. |
| `npm run format` | Memformat file TypeScript, TSX, dan Markdown. |
| `npx turbo run generate --filter=@logoicon/core` | Generate aset Core. |
| `npx turbo run generate --filter=@logoicon/react` | Generate komponen React dan metadata. |
| `npm run build --workspace docs` | Build situs dokumentasi saja. |

Gunakan filter Turborepo untuk membatasi pekerjaan ke paket tertentu dan menghindari build aplikasi yang tidak terkait.