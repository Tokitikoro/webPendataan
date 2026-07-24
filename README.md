# SIMI Aqua Dashboard

Dashboard monitoring survei dengan tampilan biru-aqua, kalender, kartu capaian, tabel target/realisasi, pencarian, dan sumber data Google Spreadsheet. Siap deploy ke Vercel.

## Jalankan lokal
```bash
npm install
cp .env.example .env.local
npm run dev
```
Buka `http://localhost:3000`. Tanpa env, aplikasi otomatis memakai data demo.

## Format Google Spreadsheet
Baris pertama wajib berupa header berikut:
```text
id,kategori,kegiatan,periode,penanggung_jawab,jan_target,jan_realisasi,feb_target,feb_realisasi,mar_target,mar_realisasi,apr_target,apr_realisasi,mei_target,mei_realisasi,jun_target,jun_realisasi,jul_target,jul_realisasi,agu_target,agu_realisasi,sep_target,sep_realisasi,okt_target,okt_realisasi,nov_target,nov_realisasi,des_target,des_realisasi
```
Publikasikan sheet sebagai CSV, lalu isi `GOOGLE_SHEET_CSV_URL`. Data disegarkan server setiap 5 menit.

## Deploy Vercel
1. Push folder ini ke GitHub.
2. Import repository di Vercel.
3. Tambahkan Environment Variable `GOOGLE_SHEET_CSV_URL`.
4. Deploy.

> Jika data tidak boleh publik, ganti integrasi CSV dengan Google Sheets API + service account. Jangan menyimpan kredensial di repository.
