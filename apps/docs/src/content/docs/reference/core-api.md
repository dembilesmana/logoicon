---
title: API Core
description: API dan subpath aset dari paket @logoicon/core.
---

## `getData(path)`

```ts
import { getData } from "@logoicon/core";

const svg = await getData(".assets/github/index.svg");
```

`getData` membaca file relatif terhadap direktori paket Core dan mengembalikan `Promise<string>`. API ini terutama dipakai oleh generator atau tooling internal.

## Subpath `@logoicon/core/assets`

Subpath `assets` menyediakan ekspor aset yang dikonsumsi generator React. Ia bukan API komponen untuk aplikasi pengguna dan dapat berubah mengikuti proses generate.

## Status paket

`@logoicon/core` ditandai private di workspace. Pengguna aplikasi sebaiknya memasang `@logoicon/react`; Core dipakai untuk pengembangan, pemrosesan SVG, dan pembuatan artefak library.