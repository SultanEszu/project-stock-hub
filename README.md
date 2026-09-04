# Stock Hub

Aplikasi manajemen persediaan dengan dua role login:

- `admin`: dapat melihat data dan melakukan tambah, edit, serta hapus.
- `bos`: hanya dapat melihat dashboard dan data persediaan.

## Menjalankan aplikasi

1. Salin `.env.example` menjadi `.env`, lalu isi koneksi MySQL dan rahasia JWT.
2. Jalankan `npm install`.
3. Jalankan `npm run dev`.

Server akan membuat tabel `users` dan dua akun awal secara otomatis. Password hanya disimpan sebagai hash bcrypt.

Kredensial development default:

- Admin: `admin` / `admin123`
- Bos: `bos` / `bos123`

Ganti `ADMIN_PASSWORD`, `BOS_PASSWORD`, dan `JWT_SECRET` pada `.env` sebelum digunakan di luar development.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
