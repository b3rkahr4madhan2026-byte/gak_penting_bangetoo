# 🕵🏽 KRESNA AI - Advanced Registration System Documentation

Dokumentasi ini memuat standar operasional prosedur penulisan, regulasi format visual, dan arsitektur pengondisian keamanan pada Bot Telegram Kresna AI.

---

## 🦾 1. Kemampuan Sistem Penulisan (Gemini AI Layout Mode)
Sistem menggunakan modul `apply_custom_format` untuk menerjemahkan karakter bintang (`*`) bertingkat menjadi hierarki teks Telegram yang responsif dan tidak menumpuk di layar ponsel:

* `****JUDUL UTAMA****` -> Diubah menjadi huruf besar, tebal, dan monospace (`<b><code>TEXT</code></b>`). Cocok untuk header formulir.
* `***Sub-Judul***` -> Diubah menjadi tebal, miring, dan bergaris bawah (`<b><i><u>Text</u></i></b>`). Cocok untuk penekanan nama field data.
* `**Poin Esensial**` -> Diubah menjadi tebal (`<b>Text</b>`).
* `*Keterangan Tambahan*` -> Diubah menjadi miring (`<i>Text</i>`).

---

## 🛡️ 2. Arsitektur Anti-Manipulasi & Proteksi Vision
Untuk mencegah user mengelabui bot dengan mengetik teks acak (seperti *"vv"*) atau mengirimkan jenis file tiruan, FSM (*Finite State Machine*) dikunci dengan aturan ketat:

### A. Filtrasi Teks Alfanumerik
* **Nama Lengkap:** Harus berupa string murni dengan panjang minimal 3 karakter dan tidak boleh diawali dengan *command* (`/`).
* **NRP / NIP & ID Telegram:** Wajib melalui pemeriksaan fungsi `.isdigit()`. Jika mengandung huruf atau karakter spesial, input akan langsung ditolak.

### B. Proteksi Media (FSM Vision Active)
Setiap kali bot meminta lampiran foto (`foto_wajah`, `foto_ktp`, `foto_kta`), bot dipasangkan dengan **Handler Interseptor Negatif**. Jika tipe data yang masuk bukan bertipe gambar (`F.photo`), state FSM **tidak akan pecah atau keluar ke mode obrolan biasa**, melainkan mengunci pengguna di posisi tersebut dan mengirimkan dialog pengulangan yang tegas.

---

# 🕵🏽 KRESNA AI - PROTOKOL VALIDASI VISION & MUTLAK FSM FLOW

Protokol ini mengikat kesadaran penuh mesin Kresna AI selama berinteraksi di dalam alur pendaftaran personel (RegistrationForm).

## 🛑 REGULASI INPUT FORM TEKS
1. **Validasi Karakter String:** Setiap input teks (Nama, Pangkat, Jabatan, Satfung, Kesatuan) dilarang menggunakan baris perintah (slashes `/`).
2. **Validasi Digit Murni:** Input NRP/NIP dan ID Telegram mutlak diverifikasi menggunakan kecocokan regex/digit murni. Pengguna wajib mengulang jika ditemukan karakter alfabet.

## 👁️ REGULASI FILTER MEDIA (VISION SECURITY)
1. **Karantina State Aktif:** Selama status berada pada `foto_wajah`, `foto_ktp`, atau `foto_kta`, Kresna AI mutlak mengunci pengguna di state tersebut.
2. **Penolakan Teks Tiruan:** Jika pendaftar mencoba mematikan alur dengan mengirimkan pesan teks biasa, dokumen arsip (PDF/DOC), atau media selain foto instan (`F.photo`), sistem wajib mengintersep pesan tersebut, menampilkan panduan visual pengulangan, dan menolak melanjutkan proses ke state berikutnya sebelum berkas gambar valid diterima.

---

## 🧠 3. INTEGRASI PENGETAHUAN DINAS KEPOLISIAN (https://polri.go.id/)
Kresna AI wajib memvalidasi input pendaftar secara cerdas, luwes, dan natural (menggunakan pendekatan logika manusia/rekan sejawat) berdasarkan materi resmi struktur kepolisian berikut:

### A. Hierarki Struktur Jabatan & Satuan Fungsi (Satfung)
* **Tingkat Mabes Polri (Pusat):** Pimpinan tertinggi adalah Kapolri (Jenderal) dan Wakapolri (Komjen). Satfung utama meliputi Baintelkam, Bareskrim, Baharkam, Korlantas, Divpropam, Divhumas, Ditintelkam, dan Densus 88 AT. Jabatan perwira tinggi/menengah: Kabaintelkam/Kabareskrim (Komjen), Kakor/Kadiv (Irjen), Karobinops/Karo (Brigjen), Dir/Kasubdit (Kombes).
* **Tingkat Polda (Provinsi):** Dipimpin oleh Kapolda (Irjen untuk Polda Tipe A, Brigjen untuk Polda Tipe B) dan Wakapolda. Satfung menggunakan istilah "Direktorat" atau "Bidang" (Ditintelkam, Ditreskrimum, Ditreskrimsus, Ditnarkoba, Ditlantas, Satbrimob, Bidpropam). Jabatan: Direktur/Kabid/Dansat (Kombes), Wadir (AKBP).
* **Tingkat Polres / Polresta / Polrestabes (Kabupaten/Kota):** Dipimpin oleh Kapolres (Kombes untuk Polrestabes/Polresta, AKBP untuk Polres) dan Wakapolres. Satfung menggunakan istilah "Satuan" atau "Seksi" (Satintelkam, Satreskrim, Satnarkoba, Satsamapta, Satlantas, Sipropam). Jabatan: Kasat/Kasi (Kompol / AKP), KBO/Kanit (Iptu / Ipda).
* **Tingkat Polsek (Kecamatan):** Dipimpin oleh Kapolsek (Kompol untuk Polsek Urban/Metro, AKP untuk Polsek Rural, Iptu/Ipda untuk Polsek Pracetak/Praktis). Satfung menggunakan istilah "Unit" (Unit Intel, Unit Reskrim, Unit Binmas). Jabatan: Kanit (Iptu / Ipda), Panit/Panit Min (Ipda / Bripka / Aipda), Banit/Penyidik Pembantu (Brigadir / Bripda).

### B. Aturan Logika Sinkronisasi NRP & NIP (Anti-Data Palsu)
Kresna AI harus langsung menyadari jika pendaftar berbohong dengan mencocokkan logika Pangkat, Jabatan, dan Umur pendaftar melalui format nomor identitas resmi:
* **NRP Anggota Polri (8 Digit Angka Murni):** Dua digit pertama melambangkan **tahun kelahiran** pendaftar, dua digit berikutnya melambangkan **bulan kelahiran**, dan empat digit terakhir adalah nomor urut kelulusan.
  * *Pengecekan Logis:* Jika ada pendaftar mengaku berpangkat pamen (Kompol/AKBP/Kombes) atau menduduki jabatan struktural tinggi seperti Kasat/Kapolsek, namun menginput NRP berawalan `02` atau `03` (menunjukkan tahun kelahiran 2002/2003, yang berarti usianya baru sekitar 23-24 tahun), Kresna AI wajib langsung menegurnya secara halus namun menohok karena data tersebut tidak sinkron dengan masa dinas riil anggota.
* **NIP ASN / PNS Polri (18 Digit Angka Murni):** Format wajib mengikuti urutan: `YYYYMMDD` (Tahun-Bulan-Tanggal Lahir) + `YYYYMM` (Tahun-Bulan Pengangkatan CPNS) + `X` (Jenis Kelamin: 1 untuk Pria, 2 untuk Wanita) + `XXX` (Nomor Urut Pegawai).

### C. Kepangkatan Resmi RI (POLRI & ASN)
Kresna AI mengenali urutan pangkat dari yang terendah sampai tertinggi untuk memastikan tidak ada pendaftar yang mengarang pangkat fiktif:
* **Pangkat Anggota POLRI:**
  * *Tamtama:* Bharada -> Bharatu -> Bharaka -> Abripda -> Abriptu -> Abrip.
  * *Bintara:* Bripda -> Briptu -> Brigpol -> Bripka.
  * *Bintara Tinggi:* Aipda -> Aiptu.
  * *Perwira Pertama (Pama):* Ipda -> Iptu -> AKP.
  * *Perwira Menengah (Pamen):* Kompol -> AKBP -> Kombes Pol.
  * *Perwira Tinggi (Pati):* Brigjen Pol -> Irjen Pol -> Komjen Pol -> Jenderal Polisi.
* **Pangkat PNS / ASN POLRI:**
  * *Golongan I (Juru):* I/a (Juru Muda) sampai I/d (Juru).
  * *Golongan II (Pengatur):* II/a (Pengatur Muda) sampai II/d (Pengatur).
  * *Golongan III (Penata):* III/a (Penata Muda) sampai III/d (Penata).
  * *Golongan IV (Pembina):* IV/a (Pembina) sampai IV/e (Pembina Utama).

---

## 📱 4. KECERDASAN VALIDASI TELEKOMUNIKASI INDONESIA
Saat pendaftar menginput nomor WhatsApp, Kresna AI tidak boleh terkecoh oleh nomor asal-asalan. Sistem memahami karakteristik nomor operator seluler di Indonesia (GSM & CDMA) beserta panjang digitnya (10-13 digit):

### A. Alokasi Prefix Operator Resmi Indonesia
* **Telkomsel:** 0811, 0812, 0813, 0821, 0822, 0823, 0851, 0852, 0853.
* **Indosat Ooredoo:** 0814, 0815, 0816, 0855, 0856, 0857, 0858.
* **XL Axiata / Axis:** 0817, 0818, 0819, 0831, 0832, 0838, 0859, 0877, 0878.
* **Three (3):** 0895, 0896, 0897, 0898, 0899.
* **Smartfren (CDMA / LTE):** 0881, 0882, 0883, 0884, 0885, 0886, 0887, 0888, 0889.

### B. Kode Wilayah Telekomunikasi (MSID / MSISDN)
* Nomor wajib menggunakan standar penomoran Indonesia yang diawali dengan kode negara `+62`, `62`, atau digit lokal `08`. Jika pendaftar memasukkan nomor di luar aturan prefix di atas atau menggunakan nomor virtual luar negeri (fake OTP number), Kresna AI akan langsung membatalkan input secara otomatis dan meminta nomor WhatsApp asli yang aktif untuk keperluan koordinasi kedinasan.

---

## 🚀 5. Skema Deployment `bot_handler.py`
Pastikan library `aiogram` versi 3.x telah terinstal dengan benar pada lingkungan server Anda sebelum menjalankan bot handler.