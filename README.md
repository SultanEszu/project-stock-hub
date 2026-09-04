# Stock Hub

Aplikasi manajemen persediaan dengan dua role login:

- `admin`: dapat melihat data dan melakukan tambah, edit, serta hapus.
- `bos`: hanya dapat melihat dashboard dan data persediaan.

## Menjalankan aplikasi lokal

1. Salin `.env.example` menjadi `.env`, lalu isi koneksi MySQL dan rahasia JWT.
2. Jalankan `npm install`.
3. Jalankan `npm run dev`.

Server akan membuat tabel `users` dan dua akun awal secara otomatis. Password hanya disimpan sebagai hash bcrypt.

Kredensial development default:

- Admin: `admin` / `admin123`
- Bos: `bos` / `bos123`

Ganti `ADMIN_PASSWORD`, `BOS_PASSWORD`, dan `JWT_SECRET` pada `.env` sebelum digunakan di luar development.

## Deployment production

Build frontend dan jalankan server Express dari root project:

```bash
npm ci --include=dev
npm run build
NODE_ENV=production npm start
```

Gunakan `npm ci --include=dev` pada tahap build karena Vite dan ESLint berada di `devDependencies`. Pada image runtime terpisah, dependency production saja sudah cukup setelah folder `dist` disalin.

Server akan melayani folder `dist` dan API pada domain yang sama. Jika frontend di-host terpisah, isi `VITE_API_URL` saat build dengan origin API, misalnya `https://api.domain-anda.com`.

Environment production wajib mengisi `JWT_SECRET`, `CORS_ORIGIN`, kredensial MySQL, serta username dan password admin/bos. Jangan gunakan nilai development dari `.env.example`.

Untuk production, gunakan MySQL managed, HTTPS melalui reverse proxy, process manager seperti PM2 atau Docker, backup database terjadwal, dan migration database yang dijalankan sebagai langkah deployment. Server saat ini masih membuat tabel secara otomatis ketika startup sehingga akses database harus memiliki izin schema pada deployment awal.

### Deployment dengan Docker atau Railway

Project sudah menyediakan `Dockerfile`. Railway dapat melakukan deploy langsung dari repository GitHub menggunakan Dockerfile tersebut. Tambahkan semua environment production pada pengaturan service, lalu deploy.

Untuk menguji image secara lokal:

```bash
docker build -t stock-hub .
docker run --env-file .env -p 3001:3001 stock-hub
```

Buka `http://localhost:3001`. Nilai `PORT` dari platform hosting akan digunakan oleh server secara otomatis.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
