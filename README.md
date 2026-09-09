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

