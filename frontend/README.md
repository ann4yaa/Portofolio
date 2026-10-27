# Portfolio

## Pengembangan lokal

1. Jalankan MySQL dari Laragon.
2. Di folder `frontend`, salin `.env.example` menjadi `.env` dan isi konfigurasi
   MySQL. Untuk Contact, isi `REACT_APP_EMAILJS_SERVICE_ID`,
   `REACT_APP_EMAILJS_TEMPLATE_ID`, dan `REACT_APP_EMAILJS_PUBLIC_KEY` di
   `.env.local` dengan nilai dari EmailJS Account → API Keys dan Email Services.
   Atur alamat penerima di template EmailJS dan gunakan variabel `name`,
   `email`, `reply_to`, dan `message`. Pesan dikirim langsung oleh browser ke
   EmailJS; pesan tidak disimpan di database atau inbox admin.
3. Jalankan website dan API lokal:

   ```powershell
   npm install
   npm run dev
   ```

   Website berjalan di `http://localhost:3000`, API lokal di
   `http://localhost:5000`.

4. Di terminal kedua, jalankan admin lokal:

   ```powershell
   npm run build:admin
   Set-Location admin
   $env:PORT = "3001"
   npm start
   ```

   Buka `http://localhost:3001`. Admin dan MySQL hanya dipakai secara lokal,
   bukan di-deploy. Jika menggunakan admin yang disajikan backend di
   `http://localhost:5000/admin`, jalankan `npm run build:admin` setiap kali
   source admin berubah agar build lokalnya ikut diperbarui.

## Ekspor dan publish

Ekspor satu kali semua project MySQL yang sudah ada beserta gambar lama:

```powershell
npm run export:projects
```

Perintah ini membaca database lokal, menyalin gambar dari folder `uploads`
lama ke `public/assets/uploads`, lalu membuat `public/projects.json`. Bila
folder gambar lama berada di lokasi lain, atur `LEGACY_UPLOADS_DIR` sebelum
menjalankan perintah.

Setiap tambah/edit/hapus project lewat admin lokal akan memperbarui
`public/projects.json` secara otomatis dan membersihkan gambar project yang
sudah tidak dipakai. Setelah memeriksa perubahan di website lokal, publish
website statis dengan:

```powershell
npm run publish
```

Perintah tersebut menjalankan build lalu `vercel --prod`. Pasang/login ke Vercel
CLI terlebih dahulu dan tambahkan ketiga variabel `REACT_APP_EMAILJS_*` pada
Project Settings → Environment Variables di Vercel. Pastikan
`public/projects.json` serta `public/assets/uploads/` ikut masuk ke commit
sebelum deploy. Form Contact mengirim email ke penerima yang ditentukan di
template EmailJS; tab Pesan admin hanya menjelaskan alur ini dan bukan inbox
pesan.
