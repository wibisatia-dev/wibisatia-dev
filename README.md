# Wibisatia Web — Login, Daftar, dan Database

Aplikasi komunitas responsif berbasis Vite + Supabase Auth + PostgreSQL. Database menyimpan profil pengguna; Supabase Auth menyimpan kredensial secara aman (kata sandi tidak disimpan sendiri oleh aplikasi).

## Yang dibutuhkan
- Node.js versi 20.19+ atau 22.12+
- Akun Supabase gratis: https://supabase.com/
- Akun GitHub dan Netlify untuk publikasi gratis (opsional)

## 1. Buat database Supabase
1. Buat project baru di https://supabase.com/dashboard.
2. Buka **SQL Editor**.
3. Buka file `supabase-schema.sql`, salin seluruh isinya, lalu jalankan (**Run**).
4. Di **Authentication → URL Configuration**, set Site URL ke URL lokal saat pengembangan, misalnya `http://localhost:5173`. Setelah deploy, ganti ke URL situs Netlify.
5. Di **Authentication → Providers → Email**, aktifkan provider Email. Untuk produksi, biarkan verifikasi email aktif.

## 2. Hubungkan aplikasi
1. Salin `.env.example` menjadi `.env.local`.
2. Di Supabase: **Project Settings → API** (atau **Connect**), salin Project URL dan publishable/anon key.
3. Isi `.env.local` seperti ini:

   ```env
   VITE_SUPABASE_URL=https://project-id-anda.supabase.co
   VITE_SUPABASE_ANON_KEY=publishable_or_anon_key_anda
   ```

   Gunakan hanya publishable/anon key di browser. **Jangan pernah masukkan `service_role` key atau secret key ke frontend.**

## 3. Jalankan di komputer
Di folder proyek, buka terminal:

```bash
npm install
npm run dev
```

Buka URL yang ditampilkan Vite, biasanya `http://localhost:5173`.

Uji alur:
1. Pilih Daftar, masukkan nama, email, dan kata sandi minimal 8 karakter.
2. Jika verifikasi email aktif, buka email verifikasi terlebih dahulu.
3. Masuk memakai email dan kata sandi.
4. Dashboard menampilkan profil yang tersimpan di tabel `profiles`.
5. Tekan Keluar untuk mengakhiri sesi.

## 4. Publikasi gratis via Netlify
1. Upload folder proyek ini ke repository GitHub (jangan unggah `.env.local`).
2. Di https://app.netlify.com/, pilih **Add new site → Import an existing project** lalu hubungkan repository.
3. Build command: `npm run build`; Publish directory: `dist`.
4. Di **Site configuration → Environment variables**, tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dengan nilai dari Supabase.
5. Deploy. Salin URL situs Netlify, lalu masukkan URL tersebut di Supabase **Authentication → URL Configuration** sebagai Site URL. Tambahkan juga URL situs ke Redirect URLs jika diminta.
6. Jika mengubah environment variables, lakukan deploy ulang.

## Keamanan dan batasan
- RLS diaktifkan pada tabel `profiles`. Pengguna yang masuk dapat membaca profil anggota, sedangkan hanya pemilik akun yang dapat menambah/mengubah profilnya.
- Password ditangani Supabase Auth, tidak ditulis ke tabel profil.
- Ini implementasi awal: login, daftar, sesi, profil, dan database profil berfungsi setelah Supabase dikonfigurasi. Posting diskusi, komentar, moderasi, dan reset password belum dibuat.
- Email confirmation bergantung pada pengaturan Supabase dan konfigurasi email project.
- Sebelum peluncuran publik, atur kebijakan privasi, syarat penggunaan, batasan akses data profil, dan proteksi penyalahgunaan sesuai kebutuhan.
