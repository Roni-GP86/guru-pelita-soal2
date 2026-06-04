export interface FallbackSubjectData {
  cp: string;
  element: string;
  topics: string[];
}

export const FALLBACK_CURRICULUMS: Record<string, FallbackSubjectData[]> = {
  // === MATEMATIKA ===
  "Matematika - Fase A": [
    {
      element: "Bilangan",
      cp: "Peserta didik menunjukkan pemahaman dan memiliki intuisi bilangan (number sense) pada bilangan cacah sampai 100, mereka dapat membaca, menulis, menentukan nilai tempat, membandingkan, mengurutkan, serta melakukan penjumlahan dan pengurangan bilangan cacah sampai 20.",
      topics: ["Mengenal Bilangan Cacah 1-50", "Nilai Tempat Puluhan dan Satuan", "Penjumlahan dan Pengurangan Sederhana", "Mengurutkan Bilangan Bulat Kecil"]
    },
    {
      element: "Aljabar",
      cp: "Peserta didik mengidentifikasi, menduplikasi, dan mengembangkan pola gambar dan pola bilangan sederhana dengan meniru pola yang sudah ada secara urut.",
      topics: ["Pola Gambar Segitiga dan Lingkaran", "Melengkapi Pola Bilangan 1-20", "Pola Berulang dengan Benda Konkrit"]
    },
    {
      element: "Pengukuran",
      cp: "Peserta didik memperkirakan dan mengukur panjang dan berat benda menggunakan satuan tidak baku (jengkal, depa, langkah kaki) serta membandingkan dua objek secara langsung.",
      topics: ["Mengukur Panjang dengan Jengkal", "Membandingkan Berat Dua Benda di Kelas", "Konsep Waktu Pagi Siang dan Malam"]
    },
    {
      element: "Geometri",
      cp: "Peserta didik mengenal berbagai bangun datar (segitiga, segi empat, lingkaran) dan bangun ruang (balok, kubus, bola) sederhana dalam kehidupan praktis sehari-hari.",
      topics: ["Ciri Sederhana Bangun Datar", "Perpindahan Lokasi Objek", "Memilah Bentuk Kubus dan Bola"]
    }
  ],
  "Matematika - Fase B": [
    {
      element: "Bilangan",
      cp: "Peserta didik menunjukkan pemahaman bilangan cacah sampai 10.000, menentukan nilai tempat, melakukan operasi perkalian dan pembagian, serta memahami pecahan senilai dan pecahan desimal persepuluhan.",
      topics: ["Nilai Tempat Ribuan dan Ratusan", "Operasi Perkalian dan Pembagian", "Pecahan Senilai & Sederhana", "Mengenal Desimal dan Persentase"]
    },
    {
      element: "Aljabar",
      cp: "Peserta didik mengidentifikasi pola gambar membesar dan mengecil, serta menggunakan operasi penjumlahan dan pengurangan dalam kalimat matematika terbuka menggunakan simbol variabel sederhana.",
      topics: ["Pola Gambar Membesar dan Menyusut", "Kalimat Terbuka dengan Simbol Kotak Sederhana", "Menyusun Pola Bilangan Lompat"]
    },
    {
      element: "Pengukuran",
      cp: "Peserta didik mengukur panjang dan luas menggunakan satuan baku (m, cm, kg, g, liter) serta menghitung keliling bangun datar sederhana.",
      topics: ["Mengukur dengan Penggaris dan Meteran", "Menghitung Keliling Persegi dan Segitiga", "Membaca Waktu Menggunakan Jam Dinding"]
    },
    {
      element: "Geometri",
      cp: "Peserta didik mendeskripsikan ciri-ciri berbagai bentuk bangun datar segitiga dan segi empat, serta menyusun (komposisi) atau mengurai (dekomposisi) bentuk geometri tersebut.",
      topics: ["Sifat Segitiga Siku-Siku dan Sama Kaki", "Sifat Persegi dan Persegi Panjang", "Jaring-Jaring Kubus Sederhana"]
    },
    {
      element: "Analisis Data",
      cp: "Peserta didik mengumpulkan data secara sederhana, mengurutkan, membandingkan, serta menyajikannya dalam bentuk tabel atau diagram batang.",
      topics: ["Membaca Diagram Batang Kelas", "Mengelompokkan Data Warna Kesukaan", "Menyusun Data Nilai Hasil Belajar"]
    }
  ],
  "Matematika - Fase C": [
    {
      element: "Bilangan",
      cp: "Peserta didik memahami bilangan cacah sampai 1.000.000, bilangan bulat negatif dalam skala termometer, melakukan operasi hitung pecahan (perkalian dan pembagian), serta memahami konsep rasio dan skala.",
      topics: ["Operasi Bilangan Bulat Negatif", "Perkalian dan Pembagian Pecahan Campuran", "Penerapan Skala pada Peta", "Menghitung Rasio dan Perbandingan Jumlah Benda"]
    },
    {
      element: "Aljabar",
      cp: "Peserta didik menganalisis dan menyelesaikan persamaan linear satu variabel sederhana dengan simbol, serta merancang tabel perbandingan senilai.",
      topics: ["Mencari Nilai Variabel Misterius", "Persamaan Linear Satu Variabel Sederhana", "Tabel Perbandingan Senilai dan Grafik"]
    },
    {
      element: "Pengukuran",
      cp: "Peserta didik menghitung keliling dan luas daerah lingkaran, luas permukaan gabungan, serta menghitung volume bangun ruang seperti kubus dan balok.",
      topics: ["Luas dan Keliling Poligon Gabungan", "Menghitung Volume Balok Beserta Kubus", "Hubungan Volume Liter desimeter kubik"]
    },
    {
      element: "Geometri",
      cp: "Peserta didik mengidentifikasi sifat-sifat bangun datar dan bangun ruang kompleks, membangun jaring-jaring prisma/tabung, serta memahami koordinat Kartesius.",
      topics: ["Sifat Jaring Jaring Tabung dan Limas", "Menggambar Titik di Koordinat Kartesius", "Sifat Sudut Berpelurus dan Berseberangan"]
    },
    {
      element: "Analisis Data",
      cp: "Peserta didik menyajikan dan menganalisis data dalam diagram lingkaran, serta menentukan nilai rata-rata (mean), median, dan modus dari suatu data tunggal.",
      topics: ["Menganalisis Diagram Lingkaran", "Menghitung Nilai Rata-Rata (Mean) Raport", "Menentukan Median dan Nilai Paling Sering Muncul (Modus)"]
    }
  ],

  // === BAHASA INDONESIA ===
  "Bahasa Indonesia - Fase A": [
    {
      element: "Menyimak",
      cp: "Peserta didik mampu bersikap menjadi penyimak yang baik, memahami instruksi lisan sederhana, serta menangkap alur cerita anak yang dibacakan dengan santun.",
      topics: ["Menyimak Cerita Dongeng Guru", "Merespons Petunjuk Lisan Permainan", "Mengidentifikasi Tokoh dalam Fabel lisan"]
    },
    {
      element: "Membaca dan Memirsa",
      cp: "Peserta didik mengeja suku kata dengan lancar, membaca kosakata harian, memaknai teks petunjuk bergambar, serta memahami isi bacaan cerita anak bergambar.",
      topics: ["Mengeja Kata Berpola K-V-K-V", "Membaca Teks Pendek Bergambar", "Memahami Isi Pesan Poster Kebersihan"]
    },
    {
      element: "Berbicara dan Presentasi",
      cp: "Peserta didik menyampaikan gagasan secara mandiri, menceritakan kembali cerita pendek dengan runtut, serta bersikap santun saat berbicara dengan guru dan teman.",
      topics: ["Perkenalan Diri yang Santun", "Menceritakan Pengalaman Masa Libur", "Melafalkan Puisi Anak dengan Intonasi Tepat"]
    },
    {
      element: "Menulis",
      cp: "Peserta didik menulis kalimat pendek dengan huruf tegak bersambung, menulis ejaan sederhana (tanda titik dan huruf kapital di awal kalimat), serta mengisi formulir data diri.",
      topics: ["Menulis Huruf Tegak Bersambung", "Penggunaan Huruf Kapital dan Titik", "Menulis Nama Lengkap dan Hobi"]
    }
  ],
  "Bahasa Indonesia - Fase B": [
    {
      element: "Menyimak",
      cp: "Peserta didik memahami ide pokok lisan dari teks naratif/eksposisi, merangkum instruksi yang didengarnya, serta menanggapi pertanyaan secara tepat.",
      topics: ["Menangkap Ide Pokok Teks Berita", "Menulis Rangkuman Instruksi Kerja Bakti", "Menjawab Tanya Jawab Stimulus Audio"]
    },
    {
      element: "Membaca dan Memirsa",
      cp: "Peserta didik membaca dengan intonasi lancar, mengidentifikasi tokoh, watak, latar cerita, memahami arti kata baru dari kamus besar/teks, dan membedakan fakta dan opini.",
      topics: ["Membaca Lancar dengan Intonasi Tepat", "Menganalisis Watak Tokoh Cerita Rakyat", "Membedakan Fakta dan Opini dalam Paragraf"]
    },
    {
      element: "Berbicara dan Presentasi",
      cp: "Peserta didik berdiskusi aktif dengan teman, menyampaikan gagasan disertai argumentasi sederhana, mempresentasikan hasil karya atau laporan pengamatan secara lisan.",
      topics: ["Etika Berdiskusi Kelompok", "Presentasi Laporan Hasil Pengamatan Kelas", "Menyampaikan Tanggapan yang Sopan"]
    },
    {
      element: "Menulis",
      cp: "Peserta didik menulis teks narasi, prosedur, deskripsi, atau laporan pengamatan dengan EYD yang tepat, serta merangkai paragraf padu dengan kosakata baru.",
      topics: ["Menyusun Paragraf Narasi", "Menulis Urutan Teks Prosedur Kegiatan", "Menerapkan Tanda Baca Koma dan Tanda Tanya"]
    }
  ],
  "Bahasa Indonesia - Fase C": [
    {
      element: "Menyimak",
      cp: "Peserta didik menganalisis informasi, gagasan, pikiran, atau pesan dari teks lisan/audio secara kritis, serta mencatat ide pokok dan pendukung.",
      topics: ["Menganalisis Pidato Kepala Sekolah lisan", "Mencatat Gagasan Pokok Wawancara", "Menilai Pesan Terselubung Cerita lisan"]
    },
    {
      element: "Membaca dan Memirsa",
      cp: "Peserta didik menganalisis karakter tokoh, nilai-nilai, atau pesan moral dari berbagai genre bacaan, memilah informasi dari teks multimoda.",
      topics: ["Menemukan Pesan Moral Hikayat Nusantara", "Menganalisis Karya Infografis Ilmiah", "Membedakan Kalimat Utama dan Penjelas"]
    },
    {
      element: "Berbicara dan Presentasi",
      cp: "Peserta didik berpidato, memerankan tokoh, memimpin diskusi kelompok dengan sopan, serta mempresentasikan data ilmiah sederhana secara runtut.",
      topics: ["Berpidato Tema Kemerdekaan RI", "Memimpin Rapat Musyawarah Kelas", "Apresiasi Seni Drama Singkat Kelas"]
    },
    {
      element: "Menulis",
      cp: "Peserta didik menulis karya sastra sederhana (pantun, puisi, cerpen), laporan ilmiah, teks eksposisi secara mandiri menggunakan EYD, konjungsi, dan variasi kalimat efektif.",
      topics: ["Menulis Pantun Nasihat Berima A-B-A-B", "Menyusun Laporan Penelitian Sains Sederhana", "Menulis Teks Eksposisi Argumentatif"]
    }
  ],

  // === PENDIDIKAN PANCASILA ===
  "Pendidikan Pancasila - Fase A": [
    {
      element: "Pancasila",
      cp: "Peserta didik mengenal simbol dan sila Pancasila, menceritakan hubungan simbol dengan sila, serta menerapkan nilai Pancasila di rumah dan sekolah.",
      topics: ["Simbol Garuda Pancasila", "Menghafal Sila-Sila Pancasila", "Contoh Gotong Royong Karakter Pancasila"]
    },
    {
      element: "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945",
      cp: "Peserta didik mengenal aturan di rumah dan di sekolah, menaati aturan tersebut, serta menyebutkan hak dan kewajiban.",
      topics: ["Aturan Makan dan Belajar di Rumah", "Kewajiban Memakai Seragam di Sekolah", "Menaati Guru dan Orang Tua"]
    },
    {
      element: "Bhinneka Tunggal Ika",
      cp: "Peserta didik menyebutkan identitas diri dan teman, menghargai perbedaan fisik dan kegemaran, serta menyebutkan keberagaman di sekolah.",
      topics: ["Saling Menghargai Perbedaan Fisik", "Keberagaman Suku Bangsa Teman Sekelas", "Sikap Toleransi Keberagaman"]
    },
    {
      element: "Negara Kesatuan Republik Indonesia",
      cp: "Peserta didik mengenal karakteristik lingkungan rumah dan sekolah, menceritakan contoh gotong-royong, serta menjaga persatuan lingkungan sekitar.",
      topics: ["Mengenal Bagian Lingkungan Rumah", "Kerja Bakti Bersama Keluarga", "Sikap Menjaga Persatuan Pertemanan"]
    }
  ],
  "Pendidikan Pancasila - Fase B": [
    {
      element: "Pancasila",
      cp: "Peserta didik menyusun urutan sila Pancasila, menceritakan makna simbol, menerapkan nilai Pancasila dalam kehidupan sehari-hari, serta mengidentifikasi gotong royong dan kebersamaan.",
      topics: ["Makna Filosofis Simbol Pancasila", "Penerapan Nilai Kejujuran Sila Kesatu", "Kegiatan Kerja Sama dan Gotong Royong"]
    },
    {
      element: "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945",
      cp: "Peserta didik mengidentifikasi aturan di sekolah, rumah, dan lingkungan sekitar, menaati aturan tersebut, serta hak dan kewajiban sebagai warga sekolah dan anggota keluarga.",
      topics: ["Melaksanakan Aturan di Lingkungan RT", "Hak Anak Mendapatkan Nilai Belajar", "Kewajiban Piket Kebersihan Kelas"]
    },
    {
      element: "Bhinneka Tunggal Ika",
      cp: "Peserta didik mengidentifikasi karakteristik fisik dan non-fisik orang, menghargai perbedaan adat istiadat, serta kerja sama dalam keberagaman suku nusantara.",
      topics: ["Menghargai Keberagaman Rumah Adat", "Sikap Kerja Sama Antarumat Beragama", "Melestarikan Permainan Tradisional Indonesia"]
    },
    {
      element: "Negara Kesatuan Republik Indonesia",
      cp: "Peserta didik mengenal wilayah kabupaten/kota, batas wilayah tempat tinggal, serta mengenali bagian NKRI dan sikap cinta tanah air.",
      topics: ["Struktur Organisasi Kelurahan dan Kecamatan", "Mengenal Batas Wilayah Kabupaten", "Sikap Cinta Tanah Air Menghormati Pahlawan"]
    }
  ],
  "Pendidikan Pancasila - Fase C": [
    {
      element: "Pancasila",
      cp: "Peserta didik memahami kedudukan Pancasila sebagai dasar negara, pandangan hidup bangsa, ideologi negara, dan menerapkannya dalam kehidupan sehari-hari secara konsisten, serta bangga terhadap keutuhan tanah air.",
      topics: ["Pancasila Sebagai Dasar Negara", "Peran Panitia Sembilan Perumus Pancasila", "Mengamalkan Sila-Sila dalam Kebijakan Kelas"]
    },
    {
      element: "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945",
      cp: "Peserta didik menyajikan hasil identifikasi aturan di sekolah, rumah, masyarakat, menerapkan norma susila, kesopanan, hukum, serta memahami pelaksanaan hak, kewajiban, dan tanggung jawab.",
      topics: ["Pengejawantahan Norma Kesopanan di Sekolah", "Sanksi Pelanggaran Norma Hukum", "Keseimbangan Pelaksanaan Hak dan Kewajiban Warga Negara"]
    },
    {
      element: "Bhinneka Tunggal Ika",
      cp: "Peserta didik mengidentifikasi keragaman suku, bahasa daerah, pakaian adat, kesenian daerah, ras, agama di tingkat nasional dan melestarikannya secara bangga.",
      topics: ["Upaya Pelestarian Kebudayaan Nasional", "Menghargai Keberagaman Agama Nasional", "Mencegah Sikap Diskriminasi Rasial"]
    },
    {
      element: "Negara Kesatuan Republik Indonesia",
      cp: "Peserta didik mengidentifikasi batas-batas kedaulatan NKRI, menjelaskan peran tokoh perjuangan kemerdekaan, menjaga keutuhan NKRI, dan berpartisipasi mewujudkan persatuan nasional.",
      topics: ["Tokoh Perjuangan Proklamasi Kemerdekaan", "Batas Astronomis dan Geografis NKRI", "Sikap Bela Negara Mempertahankan Persatuan"]
    }
  ],

  // === IPAS ===
  "IPAS - Fase A": [
    {
      element: "Pemahaman IPAS",
      cp: "Peserta didik mengidentifikasi anggota tubuh manusia, panca indra besertakan fungsinya, cara merawat kesehatan, serta mengenal hewan dan tumbuhan di sekitar lingkungan rumah.",
      topics: ["Mengidentifikasi Lima Panca Indra", "Merawat Kebersihan Gigi dan Rambut", "Mengenali Hewan Jinak dan Liar", "Bagian Daun dan Bunga Tumbuhan Sekitar"]
    },
    {
      element: "Keterampilan Proses",
      cp: "Peserta didik melakukan pengamatan mandiri terhadap gejala cuaca harian dan perubahan benda cair maupun padat di sekitar mereka.",
      topics: ["Mempraktekkan Siklus Es Batu Cair", "Mengukur Suhu Hangat dan Dingin", "Melihat Gejala Cuaca Hujan Cerah Mendung"]
    }
  ],
  "IPAS - Fase B": [
    {
      element: "Pemahaman IPAS (Sains)",
      cp: "Peserta didik mengidentifikasi bagian tubuh tumbuhan, proses fotosintesis, siklus hidup makhluk hidup, wujud zat dan perubahannya, bentuk gaya (gesek, magnet, gravitasi) dan energi dalam kehidupan sehari-hari.",
      topics: ["Fotosintesis Dapur Pembuatan Makanan", "Siklus Hidup Kupu-Kupu dan Katak", "Wujud Zat Padat Cair Gas dan Menguap", "Hubungan Gaya Tarik dan Dorong terhadap Benda"]
    },
    {
      element: "Pemahaman IPAS (Sosial)",
      cp: "Peserta didik mengidentifikasi ragam bentang alam, letak kabupaten/provinsi tempat tinggal melalui peta, peta tematik, kegiatan ekonomi masyarakat, dan interaksi sosial harian.",
      topics: ["Morfologi Wilayah Pantai dan Gunung", "Sektor Kegiatan Ekonomi Jasa dan Dagang", "Mengenal Sejarah Kerajaan Hindu Budha", "Sikap Toleransi Interaksi Sosial Beradab"]
    },
    {
      element: "Keterampilan Proses",
      cp: "Peserta didik merencanakan dan melaksanakan penyelidikan ilmiah kecil, merekam pengamatan secara sistematis, serta menarik kesimpulan fisis dasar.",
      topics: ["Mengamati Pertumbuhan Kacang Hijau", "Menyusun Grafik Pertumbuhan Batang Tumbuhan", "Merancang Eksperimen Sifat Sifat Cahaya"]
    }
  ],
  "IPAS - Fase C": [
    {
      element: "Pemahaman IPAS (Sains)",
      cp: "Peserta didik mengidentifikasi sistem organ tubuh manusia (pernapasan, pencernaan, peredaran darah, gerak), rantai makanan dan jaring ekologi, siklus air secara global, listrik dasar dan magnet, serta konversi/kekekalan energi.",
      topics: ["Sistem Organ Pernapasan Paru-Paru", "Rantai Makanan Produsen Konsumen Pengurai", "Tahapan Siklus Hidup Air Evaporasi", "Konsep Menyalakan Lampu Sirkuit Listrik"]
    },
    {
      element: "Pemahaman IPAS (Sosial)",
      cp: "Peserta didik memahami kondisi geografis Indonesia sebagai negara kepulauan, negara maritim/agraris, sejarah perjuangan bangsa di berbagai kerajaan, masa kolonial, proklamasi kemerdekaan, keragaman ekonomi.",
      topics: ["Karakteristik Maritim Kehidupan Indonesia", "Penjajahan Kolonial Belanda dan Jepang", "Peristiwa Rengasdengklok Proklamasi Kemerdekaan", "Kegiatan Impor Ekspor Indonesia Modern"]
    },
    {
      element: "Keterampilan Proses",
      cp: "Peserta didik merancang eksperimen ilmiah mandiri, mencatat data kuantitatif menggunakan alat bantu ukur relevan, mengomunikasikan kesimpulan ilmiah dalam bentuk laporan tertulis.",
      topics: ["Langkah Pengukuran Derajat Termometer", "Menguji Kekuatan Magnet Sederhana", "Menulis Laporan Pengaruh Cahaya pada Tanaman"]
    }
  ],

  // === BAHASA INGGRIS ===
  "Bahasa Inggris - Fase A": [
    {
      element: "Listening & Speaking (Menyimak & Berbicara)",
      cp: "Students use simple English to interact in social and school environments with formulaic language (greetings, introduced themselves, requests, thank you).",
      topics: ["Greetings and Saying Goodbye", "Introducing My Name and Age", "Responding to Simple Classroom Rules"]
    },
    {
      element: "Reading & Viewing (Membaca & Memirsa)",
      cp: "Students understand the main ideas of simple illustrated texts containing common words and matching them with pictures.",
      topics: ["Matching Animal Pictures in English", "Identifying Colors of Objects", "Reading Simple Picture Books"]
    },
    {
      element: "Writing & Presenting (Menulis & Mempresentasikan)",
      cp: "Students write basic english alphabets, trace vocabulary, and label objects using accurate letter formations.",
      topics: ["Tracing English Alphabet and Letters", "Labeling Classroom Stationery", "Writing My Favorite Food Name"]
    }
  ],
  "Bahasa Inggris - Fase B": [
    {
      element: "Listening & Speaking (Menyimak & Berbicara)",
      cp: "Students interact in simple english using repetitive structured phrases, expressing likes/dislikes, locations of objects, and asking simple prices.",
      topics: ["Expressing Favorite Foods and Drinks", "Asking 'Where is My Pencil?'", "Shopping Game Asking for Prices"]
    },
    {
      element: "Reading & Viewing (Membaca & Memirsa)",
      cp: "Students read short paragraph texts smoothly with good pronunciation, understanding specific basic key facts of the stories.",
      topics: ["Reading Story about Outdoor Pets", "Answering What Who Where on English text", "Identifying Verbs of Daily Activities"]
    },
    {
      element: "Writing & Presenting (Menulis & Mempresentasikan)",
      cp: "Students write short descriptions or simple messages with accurate capitalization, spelling, and basic punctuation.",
      topics: ["Writing Short Sentences about My Family", "Completing Pronouns He She They in senteces", "Using Capitals on Names and Days"]
    }
  ],
  "Bahasa Inggris - Fase C": [
    {
      element: "Listening & Speaking (Menyimak & Berbicara)",
      cp: "Students participate actively in simple dialogues, expressing future plans, describing past experiences, and asking for or giving help politely.",
      topics: ["Talking about Last Weekend Holiday", "Using 'Can You Help Me?' Polite Phrases", "Discussing Future Hobby Plans"]
    },
    {
      element: "Reading & Viewing (Membaca & Memirsa)",
      cp: "Students analyze main ideas, supporting details, and predict outcomes in fiction or informative paragraphs.",
      topics: ["Analyzing Main Ideas on English Posters", "Predicting Story Ends in Tales", "Understanding Recipes or Step Guides"]
    },
    {
      element: "Writing & Presenting (Menulis & Mempresentasikan)",
      cp: "Students write multi-sentence descriptions, emails, letters, and create graphic organizers using varied vocabulary.",
      topics: ["Writing Simple Letter to a Friend", "Describing My School in Two Paragraphs", "Designing English Infographics and Vocabulary lists"]
    }
  ],

  // === PJOK ===
  "PJOK - Fase A": [
    {
      element: "Keterampilan Gerak",
      cp: "Peserta didik mempraktikkan keterampilan gerak dasar lokomotor (berjalan, berlari, melompat), non-lokomotor (menekuk, meliuk), dan manipulatif (melempar, menangkap bola besar).",
      topics: ["Teknik Berlari Lurus dan Berkelok", "Melompat Rintangan Rendah", "Melempar Bola Mengarah ke Keranjang"]
    },
    {
      element: "Pengetahuan Gerak",
      cp: "Peserta didik mengidentifikasi konsep bagian tubuh yang bergerak, arah gerak harian, serta prinsip keseimbangan statis.",
      topics: ["Arah Gerak Ke Atas dan Ke Samping", "Menjaga Keseimbangan Berdiri Satu Kaki", "Mengidentifikasi Kelompok Otot Gerak Lokomotor"]
    },
    {
      element: "Pemanfaatan Aktivitas",
      cp: "Peserta didik melakukan permainan tradisional untuk menjaga kebugaran jasmani ringan dan kebersihan pakaian.",
      topics: ["Permainan Tradisional Gobak Sodor", "Kebersihan Pakaian dan Mandi Setelah Olahraga", "Makanan Sehat Menunjang Energi Tubuh"]
    }
  ],
  "PJOK - Fase B": [
    {
      element: "Keterampilan Gerak",
      cp: "Peserta didik mempraktikkan variasi pola gerak lakomotor, non-lokomotor, manipulatif pada olahraga beregu kaki (kasti, sepak bola dasar) dan senam lantai.",
      topics: ["Menggiring Bola Sepak Bola", "Memukul Bola Kasti dengan Pemukul Kayu", "Sikap Lilin Senam Lantai"]
    },
    {
      element: "Pengetahuan Gerak",
      cp: "Peserta didik memahami cara melakukan teknik menendang, melempar, menangkap, berayun, berguling secara aman.",
      topics: ["Teknik Melempar Kasti Melambung", "Analisis Sikap Awal Berguling Depan Matras", "Taktik Bertahan dalam Gobak Sodor"]
    },
    {
      element: "Pemanfaatan Aktivitas",
      cp: "Peserta didik mempraktikkan bentuk latihan kekuatan dan kelenturan, serta menghitung denyut jantung sebelum dan sesudah latihan harian.",
      topics: ["Latihan Plank dan Push Up Sederhana", "Menghitung Detak Jantung Per Menit", "Manfaat Melakukan Pemanasan Otot"]
    }
  ],
  "PJOK - Fase C": [
    {
      element: "Keterampilan Gerak",
      cp: "Peserta didik mempraktikkan kombinasi gerak dasar lokomotor, non-lokomotor, manipulatif pada permainan bola besar (basket, voli) dan atletik (dari estafet).",
      topics: ["Kombinasi Layup Shoot Bola Basket", "Set Up Service Bawah Voli", "Keterampilan Berlari Serah Estafet Tongkat"]
    },
    {
      element: "Pengetahuan Gerak",
      cp: "Peserta didik menganalisis taktik menyerang serta bertahan sederhana pada permainan tradisional/olahraga pilihan secara aman.",
      topics: ["Taktik Menyerang Pola 2 Lawan 1 Basket", "Menganalisis Titik Tolak Lompat Jauh", "Aturan Resmi Pertandingan Bola Voli"]
    },
    {
      element: "Pemanfaatan Aktivitas",
      cp: "Peserta didik menganalisis dan mempraktikkan latihan kebugaran jasmani intensitas sedang (interval training), merawat kesehatan reproduksi remaja.",
      topics: ["Merancang Jadwal Mingguan Interval Training", "Merawat Kebersihan Organ Reproduksi Remaja", "Pemberian P3K pada Luka Gores Memar"]
    }
  ],

  // === SENI RUPA ===
  "Seni Rupa - Fase A": [
    {
      element: "Mengalami",
      cp: "Peserta didik mengidentifikasi unsur rupa (garis, bentuk tunggal, warna primer merah kuning biru) dari benda-benda alam di sekitarnya.",
      topics: ["Mengenal Tiga Warna Primer", "Menemukan Garis Lurus dan Lengkung di Alam", "Mengelompokkan Bentuk Lingkaran Kotak"]
    },
    {
      element: "Menciptakan",
      cp: "Peserta didik membuat karya 2 dimensi menggunakan media pewarna kering (pensil warna, krayon) dengan teknik menggunting dan menempel kertas origami.",
      topics: ["Karya Mewarnai Pemandangan Asri", "Kolase Menempel Origami Satwa", "Menggambar Ekspresi Wajah Riang"]
    },
    {
      element: "Merefleksikan",
      cp: "Peserta didik menjelaskan alasan menyukai bagian karya gambarnya sendiri atau karya temannya menggunakan bahasa lisan yang santun.",
      topics: ["Mengapresiasi Gambar Teman dengan Pujian Sopan", "Menceritakan Arti Gambar Buatan Sendiri"]
    }
  ],
  "Seni Rupa - Fase B": [
    {
      element: "Mengalami",
      cp: "Peserta didik mengidentifikasi warna sekunder, tekstur (kasar, halus, licin), keseimbangan simetris pada objek-objek buatan manusia dan alam sekitar.",
      topics: ["Murnikan Warna Sekunder Hijau Jingga Ungu", "Mencerna Tekstur Kasar Halus Melalui Sentuhan", "Menganalisis Keseimbangan Simetris Dua Sisi Sempurna"]
    },
    {
      element: "Menciptakan",
      cp: "Peserta didik merancang dan membuat karya anyaman sederhana kertas, gambar bermotif batik flora, atau relief kecil menggunakan tanah liat/plastisin secara terampill.",
      topics: ["Membuat Anyaman Geometris Kertas", "Menggambar Dekoratif Ragam Hias Batik Flora", "Membentuk Relief Plastisin Bertema Hewan Laut"]
    },
    {
      element: "Merefleksikan",
      cp: "Peserta didik mengapresiasi dan membandingkan unsur keindahan visual dari berbagai karya seni rupa tradisional nusantara secara tertata.",
      topics: ["Mengapresiasi Keindahan Tenun Ikat Indonesia", "Membuat Ulasan Singkat Keindahan Gambar Lukisan"]
    }
  ],
  "Seni Rupa - Fase C": [
    {
      element: "Mengalami",
      cp: "Peserta didik mengidentifikasi komposisi warna tersier, proporsi antropometri wajah manusia, serta perspektif gambar linear satu titik hilang pada bidang gambar vertikal.",
      topics: ["Perspektif Satu Titik Hilang Jalan Raya", "Proporsi Wajah Menggambar Sketsa Manusia", "Mengenal Peran Intensitas Cahaya Gelap Terang"]
    },
    {
      element: "Menciptakan",
      cp: "Peserta didik merancang dan membuat produk seni dekoratif kriya (misal keramik hias, maket rumah tradisional) secara mandiri memanfaatkan barang bekas lingkungan sekitar.",
      topics: ["Merancang Kaleng Celengan Hias Unik", "Membuat Maket Rumah Adat dari Dus Bekas", "Merajut Kain Aksesoris Gantungan Kunci"]
    },
    {
      element: "Merefleksikan",
      cp: "Peserta didik menulis ulasan apresiatif kritis sederhana mengenai teknik penggambaran motif tradisional khas ragam budaya daerah di Indonesia.",
      topics: ["Menganalisis Makna Ornamen Ukiran Kayu Toraja", "Menulis Esai Kritik Seni Rupa Aliran Realis"]
    }
  ],

  // === SENI TARI ===
  "Seni Tari - Fase A": [
    {
      element: "Mengalami",
      cp: "Peserta didik memperagakan kombinasi gerak anggota tubuh (kepala, tangan, kaki) menirukan gerakan flora fauna di sawah atau hembusan angin sepoi-sepoi.",
      topics: ["Gerakan Meniru Kupu-Kupu Terbang", "Menirukan Pohon Tertiup Angin Topan", "Menirukan Gerakan Petani Menanam Padi"]
    },
    {
      element: "Menciptakan",
      cp: "Peserta didik menyusun gerak tari sederhana berdurasi pendek berdasarkan tempo ketukan musik pengiring yang riang gembira.",
      topics: ["Menyusun Urutan Tari Riang 30 Detik", "Menciptakan Tepukan Irama Mengiringi Langkah Tari", "Tarian Kelompok Kecil Saling Meniru Gerak"]
    }
  ],
  "Seni Tari - Fase B": [
    {
      element: "Mengalami",
      cp: "Peserta didik memperagakan variasi koordinasi gerak tari tradisional daerah asal dengan menerapkan konsep ruang, tingkat kelenturan tubuh, dan keselarasan wiraga.",
      topics: ["Koordinasi Langkah Silang Kaki Tari", "Gerak Lincah Selendang Penari Tradisional", "Mematuhi Batasan Ruang Gerak Pentas"]
    },
    {
      element: "Menciptakan",
      cp: "Peserta didik merangkai jalinan gerakan tari bertema permainan anak nusantara secara beregu sesuai pola lantai diagonal maupun lingkaran yang bervariasi.",
      topics: ["Merancang Pola Lantai Lingkaran Tarian Beregu", "Tari Kreatif Bertema Permainan Jamuran", "Menggabungkan Properti Caping dalam Gerakan"]
    }
  ],
  "Seni Tari - Fase C": [
    {
      element: "Mengalami",
      cp: "Peserta didik memperagakan kombinasi tingkat kerumitan gerak tari daerah nusantara dengan memperhatikan keselarasan irama tempo (wirama), wiraga, dan wirasa.",
      topics: ["Keselarasan Ketukan Tari dengan Gendang", "Menghayati Karakter Tegas Tarian Kepahlawanan", "Kombinasi Gerak Tari Saman Tangan Cepat"]
    },
    {
      element: "Menciptakan",
      cp: "Peserta didik memproduksi pagelaran drama tari kelompok kecil bertema heroisme pahlawan nasional, mengombinasikan tata rias dan properti tari yang relevan.",
      topics: ["Uji Peran Teatrikal Drama Tari Pahlawan", "Menyusun Konsep Tata Rias Kostum Tari Daerah", "Mengembangkan Kreasi Gerak Tari Kontemporer Nasional"]
    }
  ],

  // === SENI MUSIK ===
  "Seni Musik - Fase A": [
    {
      element: "Mengalami",
      cp: "Peserta didik mengidentifikasi tinggi-rendah nada (pitch), cepat-lambat tempo secara auditori, serta menirukan decak suara alam harian seperti kicau burung atau tetes air hujan.",
      topics: ["Membedakan Suara Tinggi Melengking dan Berat Bass", "Menirukan Ketukan Detik Jam Dinding", "Bernyanyi Ekspresif Lagu Pelangi-Pelangi"]
    },
    {
      element: "Menciptakan",
      cp: "Peserta didik membuat pola ritme sederhana menggunakan permainan tepuk tangan, hentakan kaki, atau alat perkusi sederhana buatan sendiri (botol pasir, kaleng).",
      topics: ["Ketukan Berirama Ganda Melalui Tepukan", "Membuat Perkusi Botol Pasir Unik", "Mengiringi Lagu Potong Bebek Angsa dengan Tebakan Nada"]
    }
  ],
  "Seni Musik - Fase B": [
    {
      element: "Mengalami",
      cp: "Peserta didik mengidentifikasi birama (2/4, 3/4, 4/4), membedakan kualitas timbre alat musik gesek, tiup, pukul khas nusantara harian.",
      topics: ["Mengidentifikasi Ketukan Birama Tiga Per Empat", "Mengenal Perbedaan Suara Seruling dan Angklung", "Membaca Notasi Angka Solmisasi Sederhana"]
    },
    {
      element: "Menciptakan",
      cp: "Peserta didik menyanyikan kumpulan melodi pendek menggunakan alat tiup dasar (melodika/rekorder) dengan teknik pernapasan perut aman.",
      topics: ["Meniup Melodika Notasi Lagu Ibu Kita Kartini", "Teknik Pernapasan Perut Saat Bernyanyi Paduan", "Membuat Aransemen Ketukan Alternatif"]
    }
  ],
  "Seni Musik - Fase C": [
    {
      element: "Mengalami",
      cp: "Peserta didik mengidentifikasi tangga nada diatonis mayor dan minor, serta membaca partitur not angka sederhana dengan lancar dalam paduan vokal.",
      topics: ["Membedakan Lagu Ceria Mayor dan Sedih Minor", "Membaca Simbol Istirahat Berhenti Bernyanyi", "Menganalisis Nada Dasar Do=C pada Partitur"]
    },
    {
      element: "Menciptakan",
      cp: "Peserta didik mengaransemen paduan suara vokal grup sederhana (2 suara) untuk menyanyikan lagu daerah nusantara diiringi harmonika/gitar.",
      topics: ["Aransemen Suara Alto dan Sopran Lagu Apuse", "Menyanyikan Kanon Kelompok Bersahut-Sahutan", "Menggabungkan Iringan Pianika dalam Lagu Nasional"]
    }
  ],

  // === PENDIDIKAN AGAMA ISLAM ===
  "Pendidikan Agama Islam - Fase A": [
    {
      element: "Al-Qur'an dan Hadis",
      cp: "Peserta didik mengenal huruf hijaiyah bersambung, melafalkan Surah Al-Fatihah, Al-Ikhlas, Al-Falaq, An-Nas dengan tartil dan benar.",
      topics: ["Mengenal Huruf Hijaiyah Berharakat", "Membaca Surah Al-Ikhlas Tartil", "Penerapan Hadis Kebersihan Iman"]
    },
    {
      element: "Akidah",
      cp: "Peserta didik mengenal Rukun Iman (Iman kepada Allah, Malaikat, Kitab, Rasul, Hari Kiamat, Qada Qadar) serta memahami Asmaul Husna Al-Rahman Al-Rahim.",
      topics: ["Makna Asmaul Husna Ar-Rahman Ar-Rahim", "Mengimani Sifat Allah Yang Maha Pencipta", "Mengenal Nama Sepuluh Malaikat Allah"]
    },
    {
      element: "Akhlak",
      cp: "Peserta didik membiasakan perilaku terpuji, bersikap sopan kepada orang tua, guru, menyayangi binatang, tumbuhan di lingkungan sekitar.",
      topics: ["Adab Berbicara dengan Orang Tua", "Berterima Kasih dan Minta Maaf", "Akhlak Menjaga Tanaman Kelestarian Lingkungan"]
    },
    {
      element: "Fikih",
      cp: "Peserta didik mengenal tata cara bersuci (wudu, tayamum) secara tertib, melafalkan azan dan ikamah, serta gerakan salat berjamaah.",
      topics: ["Rukun dan Cara Berwudu Sempurna", "Melafalkan Bacaan Lafal Azan", "Mengenali Gerakan Salat Lima Waktu"]
    }
  ],
  "Pendidikan Agama Islam - Fase B": [
    {
      element: "Al-Qur'an dan Hadis",
      cp: "Peserta didik membaca Al-Qur'an dengan tajwid izhar, ikhfa, idgam, memahami Surah Al-Hujurat ayat 13 tentang perdamaian, serta hadis tentang keragaman.",
      topics: ["Membaca Izhar Bilaghunnah Tajwid", "Memahami Surah Al-Ma'un Tentang Sosial", "Hadis Kewajiban Menuntut Ilmu"]
    },
    {
      element: "Akidah",
      cp: "Peserta didik memahami sifat wajib Allah, mengenal kitab-kitab suci Allah, serta nabi dan rasul yang termasuk Ulul Azmi.",
      topics: ["Mengimani Kitab Taurat, Zabur, Injil, Al-Qur'an", "Kisah Ketabahan Nabi Ibrahim Ulul Azmi", "Sifat Wajid Wujud, Qidam, Baqa"]
    },
    {
      element: "Akhlak",
      cp: "Peserta didik mempraktikkan sikap rendah hati, jujur, amanah, serta menghindari sikap berdusta dan sombong.",
      topics: ["Pentingnya Amanah Menjaga Barang Titipan", "Sikap Rendah Hati (Tawadhu) di Sekolah", "Mencegah Perbuatan Sombong (Takabur)"]
    },
    {
      element: "Fikih",
      cp: "Peserta didik memahami rukun salat, syarat sah salat, membatalkan salat, serta melafalkan zikir dan doa setelah salat.",
      topics: ["Rukun-Rukun Salat Berjumlah Tujuh Belas", "Syarat Sah Salat Menutup Aurat", "Zikir Tasbih, Tahmid, Takbir"]
    }
  ],
  "Pendidikan Agama Islam - Fase C": [
    {
      element: "Al-Qur'an dan Hadis",
      cp: "Peserta didik membaca dan menghafal Surah Al-Qadr, Al-Alaq, menganalisis hukum tajwid mad, membaca hadis menyayangi sesama manusia.",
      topics: ["Hukum Mad Thabii dan Far'i", "Tafsir Surah Al-Qadr Malam Kemuliaan", "Hadis Larangan Berbuat Zalim Sesama"]
    },
    {
      element: "Akidah",
      cp: "Peserta didik memahami iman kepada Hari Akhir (Kiamat Sugra dan Kubra), nama-nama lain hari kiamat, serta hikmah mengimani qada dan qadar.",
      topics: ["Tanda-Tanda Kiamat Sugra dan Kubra", "Yauumul Mizan dan Yaumul Mahsyar", "Hikmah Qada Qadar Berpikir Positif"]
    },
    {
      element: "Akhlak",
      cp: "Peserta didik membiasakan akhlak mulia kepedulian sosial, berbakti kepada orang tua (birrul walidain), serta cinta tanah air.",
      topics: ["Berbakti Sepenuh Hati Kepada Orang Tua", "Sifat Kepedulian Sosial Membantu Kaum Dhuafa", "Cinta Tanah Air Adalah Sebagian dari Iman"]
    },
    {
      element: "Fikih",
      cp: "Peserta didik menganalisis ketentuan zakat fitrah, zakat mal, puasa Ramadan, serta puasa sunah harian secara fikih.",
      topics: ["Ketentuan Pelaksanaan Zakat Fitrah", "Ketentuan Syarat Puasa Ramadan wajib", "Perjalanan Ibadah Haji dan Kurban"]
    }
  ],

  // === PENDIDIKAN AGAMA KRISTEN ===
  "Pendidikan Agama Kristen - Fase A": [
    {
      element: "Allah Pencipta",
      cp: "Peserta didik memuji kebesaran Allah yang menciptakan dirinya unik, menciptakan alam semesta, memelihara hewan dan tumbuhan.",
      topics: ["Allah Menciptakan Mataku Sempurna", "Taman Eden Ciptaan Allah Semesta", "Allah Memelihara Bunga Bakung di Ladang"]
    },
    {
      element: "Akhlak Hidup Kristen",
      cp: "Peserta didik membiasakan mengasihi keluarga, menghormati ayah ibu, bersikap ramah menolong teman di sekolah dasar.",
      topics: ["Melayani Ayah dan Ibu di Rumah", "Mengasihi Kakak dan Adik", "Mengucapkan Terima Kasih Atas Bantuan Teman"]
    }
  ],
  "Pendidikan Agama Kristen - Fase B": [
    {
      element: "Allah Pemelihara",
      cp: "Peserta didik memahami pemeliharaan Allah dalam kehidupan keluarga, mengatasi kesulitan, bersyukur atas keragaman bangsa.",
      topics: ["Nuh dan Bahtera Penyelamatan Allah", "Yusuf yang Mengampuni Saudara-saudaranya", "Allah Memelihara Bangsa Indonesia dalam Damai"]
    },
    {
      element: "Akhlak Hidup Kristen",
      cp: "Peserta didik mempraktikkan sikap disiplin belajar, jujur tidak menyontek, menjaga kerukunan antarsuku di sekolah.",
      topics: ["Kejujuran dalam Ulangan Sekolah", "Disiplin Waktu Belajar Ibadah", "Berteman dengan Semua Suku Bangsa"]
    }
  ],
  "Pendidikan Agama Kristen - Fase C": [
    {
      element: "Allah Penyelamat",
      cp: "Peserta didik memahami karya keselamatan Allah melalui Yesus Kristus, kematian dan kebangkitan Yesus, keselamatan hidup kekal.",
      topics: ["Yesus Menyembuhkan Orang Buta", "Kematian Yesus di Bukit Golgota", "Makna Kebangkitan Paskah Bagi Kita"]
    },
    {
      element: "Kemasyarakatan",
      cp: "Peserta didik menunjukkan tanggung jawab melestarikan kelestarian alam, melayani masyarakat, menyebarkan keadilan damai.",
      topics: ["Menjaga Kelestarian Hutan Air Dunia", "Sikap Adil Tidak Membeda-bedakan Teman", "Melayani Gereja dan Lingkungan Sekitar"]
    }
  ],

  // === PENDIDIKAN AGAMA KATOLIK ===
  "Pendidikan Agama Katolik - Fase A": [
    {
      element: "Pribadi Peserta Didik",
      cp: "Peserta didik mengenal dirinya sebagai pribadi yang dicintai Allah, mengenal anggota tubuhnya sebagai karunia Allah yang luhur, serta mengenal anggota keluarga dan teman-teman dekat.",
      topics: ["Aku Diri yang Unik Dicintai", "Merawat Anggota Tubuhku Mandiri", "Keluargaku yang Penuh Kasih Sayang", "Teman-Teman Sahabat di Sekitar Kelas"]
    },
    {
      element: "Yesus Kristus",
      cp: "Peserta didik mengenal kisah kelahiran Yesus, kisah masa kanak-kanak Yesus, serta meneladani kasih-Nya bagi orang miskin dan lemah.",
      topics: ["Misteri Kelahiran Yesus di Betlehem", "Keluarga Kudus Nazaret Panutan", "Yesus Menyayangi Anak-Anak Kecil"]
    }
  ],
  "Pendidikan Agama Katolik - Fase B": [
    {
      element: "Pribadi Peserta Didik",
      cp: "Peserta didik memahami keunikan dirinya sebagai citra Allah yang mulia, menyadari kelebihan dan keterbatasan diri, serta menghormati kesederhanaan sesama.",
      topics: ["Akulah Citra Hebat Allah", "Mengembangkan Kemampuanku Dengan Bersyukur", "Saling Menolong di Lingkungan Paroki"]
    },
    {
      element: "Gereja",
      cp: "Peserta didik memahami makna persekutuan murid Kristus, mengenali sakramen baptis, sakramen ekaristi, dan sakramen tobat sebagai karya rahmat.",
      topics: ["Rahmat Pembaptisan Menjadi Anak Allah", "Perjamuan Ekaristi Pemecah Roti Kudus", "Kerendahan Hati Mengaku Dosa Sakramen Tobat"]
    }
  ],
  "Pendidikan Agama Katolik - Fase C": [
    {
      element: "Kemasyarakatan",
      cp: "Peserta didik memahami jati diri perempuan dan laki-laki yang saling melengkapi, menyadari perannya dalam melestarikan ekologi alam, mewujudkan keadilan sosial.",
      topics: ["Perempuan dan Laki-laki Setara Sejajar", "Menjaga Ibu Bumi dari Kerusakan Sampah", "Mewujudkan Keadilan bagi Kelompok Rentan"]
    },
    {
      element: "Dialog Kemajemukan",
      cp: "Peserta didik menghargai perbedaan agama, membangun kerukunan antarumat beragama, berpartisipasi damai di Indonesia.",
      topics: ["Membangun Dialog Persaudaraan Iman Mandiri", "Dokumen Persaudaraan Manusia Abu Dhabi", "Sikap Toleran di Tengah Kemajemukan Nasional"]
    }
  ],

  // === PENDIDIKAN AGAMA HINDU ===
  "Pendidikan Agama Hindu - Fase A": [
    {
      element: "Kitab Suci Yadnya",
      cp: "Peserta didik mengenal ajaran Weda sebagai kitab suci umat Hindu, memahami arti bait mantra Tri Sandhya harian.",
      topics: ["Weda Sebagai Kitab Suci Utama", "Melafalkan Bait Pertama Tri Sandhya", "Mengenal Tri Kaya Parisudha Berbuat Baik"]
    },
    {
      element: "Karakter Etika",
      cp: "Peserta didik menerapkan ajaran kasih sayang makhluk hidup di sekitar rumah dan patuh pada guru rupaka (orang tua).",
      topics: ["Menyayangi Binatang Peliharaan Rumah", "Bakti Kepada Guru Rupaka di Rumah", "Menghormati Guru Pengajar di Sekolah"]
    }
  ],
  "Pendidikan Agama Hindu - Fase B": [
    {
      element: "Tatwa dan Filsafat",
      cp: "Peserta didik memahami konsep Panca Sradha sebagai lima pilar keyakinan Hindu, mengenal Sang Hyang Widhi Wasa.",
      topics: ["Membahas Panca Sradha Lima Aspek", "Atman Sebagai Sumber Hidup Jiwa", "Hukum Karma Phala Sebab Akibat"]
    },
    {
      element: "Yadnya Praktis",
      cp: "Peserta didik mempraktikkan tata cara sembahyang kramaning sembah, merangkai sarana upakara canang sari sederhana.",
      topics: ["Tata Cara Kramaning Sembah Lima Tahap", "Makna Warna Canang Sari Wadah Canang", "Jenis Yadnya pada Hari Suci Saraswati"]
    }
  ],
  "Pendidikan Agama Hindu - Fase C": [
    {
      element: "Ethika Tri Hita Karana",
      cp: "Peserta didik menganalisis dan menerapkan ajaran kehidupan harmonis Tri Hita Karana (Parahyangan, Pawongan, Palemahan).",
      topics: ["Parahyangan Hubungan Suci dengan Widhi", "Pawongan Keharmonisan Pertemanan Antarmurid", "Palemahan Bersih Menjaga Pura Lingkungan"]
    },
    {
      element: "Nusantara dan Sejarah",
      cp: "Peserta didik menjelaskan kejayaan peradaban Hindu nusantara, peninggalan candi-candi, heroisme tokoh sejarah ksatria.",
      topics: ["Kejayaan Majapahit Mpu Prapanca", "Situs Suci Candi Prambanan Keindahan", "Tokoh Kepemimpinan Gajah Mada Bersatu"]
    }
  ],

  // === PENDIDIKAN AGAMA BUDDHA ===
  "Pendidikan Agama Buddha - Fase A": [
    {
      element: "Sejarah Buddha",
      cp: "Peserta didik mengenal kisah kelahiran Pangeran Siddharta, kemegahan istana Kapilawastu, nama ayah ibu Pangeran.",
      topics: ["Melahirkan Sang Juru Selamat Siddharta", "Kasih Sayang Ratu Mahamaya Luhur", "Siddharta Kecil Belajar dengan Cerdas"]
    },
    {
      element: "Etika Pancasila",
      cp: "Peserta didik mematuhi pancasila buddhis dasar (pantangan membunuh, mencuri, berbohong, menyakiti) dalam kehidupan ramah.",
      topics: ["Pantangan Menyakiti Serangga Kecil", "Kejujuran Sifat Pancasila Buddha", "Adab Berkunjung ke Vihara Sembahyang"]
    }
  ],
  "Pendidikan Agama Buddha - Fase B": [
    {
      element: "Dharma Sastra",
      cp: "Peserta didik memahami ajaran hukum kesunyataan Empat Kebenaran Mulia (Ariya Sacca), menghargai kumpul biksu Sangha.",
      topics: ["Empat Kebenaran Mulia Jalan Tengah", "Sebab Duka Berasal dari Keinginan", "Menghormati Sangha Penjaga Ajaran Dharma"]
    },
    {
      element: "Meditasi Fokus",
      cp: "Peserta didik mempraktikkan duduk tenang meditasi pernapasan Anapanasati untuk konsentrasi belajar harian.",
      topics: ["Mempraktekkan Meditasi Duduk Anapanasati", "Menjaga Ketenangan Pikiran Sebelum Mengisi Soal", "Sikap Cinta Kasih Maitri Karuna"]
    }
  ],
  "Pendidikan Agama Buddha - Fase C": [
    {
      element: "Hukum Karma Reinkarnasi",
      cp: "Peserta didik menganalisis hukum sebab-akibat karma (Kamma), memahami roda reinkarnasi samsara, mencapai kedamaian nibbana.",
      topics: ["Hukum Karma Memandu Takdir Sehari-hari", "Upacara Hari Tri Suci Waisak Agung", "Arti Lambang Bunga Teratai Mekar Suci"]
    },
    {
      element: "Situs Kebudayaan",
      cp: "Peserta didik menjelaskan fakta kemegahan Candi Borobudur sebagai mandala Buddha terbesar di dunia, peradaban dinasti Syailendra.",
      topics: ["Sejarah Pembangunan Borobudur Abad Delapan", "Membaca Relief Kisah Jataka di Dinding Candi", "Wisata Religi Mendut dan Pawon"]
    }
  ],

  // === PENDIDIKAN AGAMA KHONGHUCU ===
  "Pendidikan Agama Khonghucu - Fase A": [
    {
      element: "Nabi Kongzi",
      cp: "Peserta didik mengenal Sang Nabi Kongzi sebagai utusan Tian, merayakan hari kelahiran Nabi, menyayangi saudara keluarga.",
      topics: ["Kelahiran Istimewa Nabi Kongzi", "Bakti Kepada Xiao Menyayangi Orang Tua", "Tanda Hormat Persembahan Altar Sederhana"]
    },
    {
      element: "Ibadah Ritual",
      cp: "Peserta didik mempraktikkan sikap hormat bersoja menggunakan telapak tangan rapat yang santun harian.",
      topics: ["Cara Melakukan Sembah Bersoja Benar", "Mengenali Sembahyang Hari Imlek Baru", "Nilai Kasih Cinta Kasih Teman"]
    }
  ],
  "Pendidikan Agama Khonghucu - Fase B": [
    {
      element: "Kitab Sishu",
      cp: "Peserta didik memahami ajaran klasik kitab suci Sishu, mendalami empat sifat mulia kemanusiaan (Ren, Yi, Li, Zhi).",
      topics: ["Kitab Suci Sishu Empat Kompilasi", "Sifat Ren Cinta Kasih Universal", "Sifat Li Kesusilaan Tata Krama Etika"]
    },
    {
      element: "Watak Sejati",
      cp: "Peserta didik mempraktikkan pengembangan watak sejati (Xing) yang bajik dari Tian dengan rajin belajar.",
      topics: ["Watak Sejati Xing Anugerah Suci Tian", "Pentingnya Belajar Menuntut Ilmu Kongbucu", "Menghindari Sifat Licik Xiaoren"]
    }
  ],
  "Pendidikan Agama Khonghucu - Fase C": [
    {
      element: "Etika Sosial Bakti",
      cp: "Peserta didik menganalisis ajaran bakti (Xiao) mendalam, menghargai arwah leluhur, melestarikan kuil kelenteng.",
      topics: ["Nilai Filosofi Bakti Xiao Anak Sholeh Kristen Buddha Islam Hindu", "Sembahyang Ceng Beng Doa Bersama Leluhur", "Struktur Bangunan Litang dan Kelenteng"]
    },
    {
      element: "Negara dan Kemasyarakatan",
      cp: "Peserta didik memahami konsep kerukunan nasional, mencintai persatuan NKRI, toleransi beragama di Indonesia.",
      topics: ["Bela Negara Konsep Kebajikan Junzi", "Toleransi Antaragama Menghargai Ritual lain", "Merayakan Cap Go Meh Persatuan Budaya"]
    }
  ]
};

// Map specific topic names to elements & cp
export function getTopicMetadata(subject: string, topicName: string, phaseParam?: string) {
  const currentPhase = phaseParam || "Fase B";
  const keyName = `${subject} - ${currentPhase}`;
  const curriculum = FALLBACK_CURRICULUMS[keyName] || FALLBACK_CURRICULUMS[`${subject} - Fase B`] || FALLBACK_CURRICULUMS["Matematika - Fase B"];
  
  const matched = curriculum.find(item => item.topics.includes(topicName));
  if (matched) {
    return { element: matched.element, cp: matched.cp };
  }
  
  return {
    element: "Penerapan Kompetensi",
    cp: `Peserta didik menguasai konsep dan pengaplikasian praktis materi pokok ${topicName} dalam kehidupan sehari-hari berdasarkan Kurikulum Merdeka ${currentPhase}.`
  };
}

export function generateFallbackKisiKisi(schoolInfo: any, subject: string, selectedTopics: string[], questionConfigs: any[]) {
  const rows: any[] = [];
  let numberIndex = 1;

  const currentPhase = ["Kelas 1", "Kelas 2"].includes(schoolInfo?.gradeClass) 
    ? "Fase A" 
    : ["Kelas 3", "Kelas 4"].includes(schoolInfo?.gradeClass) 
      ? "Fase B" 
      : "Fase C";

  // Distribute the requested questions sequentially across the configurations
  for (const config of questionConfigs) {
    const count = Number(config.count) || 0;
    const type = config.type || "Pilihan Ganda";
    const level = config.cognitiveLevel || "Level 2";

    for (let i = 0; i < count; i++) {
      // Pick a topic cyclically from selectedTopics
      const topic = selectedTopics[(numberIndex - 1) % selectedTopics.length];
      const meta = getTopicMetadata(subject, topic, currentPhase);

      let stimulus = "";
      if (level === "Level 1") {
        stimulus = `Disajikan pertanyaan langsung tentang konsep dasar ${topic}, siswa dapat membuktikannya secara cepat.`;
      } else if (level === "Level 2") {
        stimulus = `Disajikan sebuah stimulus deskriptif sederhana kehidupan sehari-hari anak tentang ${topic}, siswa mampu mengimplementasikan penyelesaian yang akurat.`;
      } else {
        stimulus = `Disajikan sebuah skenario pemecahan masalah (HOTS) terkait ${topic} di lingkungan sekolah dasar, siswa mampu menganalisis kesimpulan secara tepat.`;
      }

      let answerKeyDesc = "Jawaban singkat benar";
      if (type === "Pilihan Ganda") {
        const letters = ["A", "B", "C", "D"];
        answerKeyDesc = letters[(numberIndex - 1) % 4];
      } else if (type === "Uraian") {
        answerKeyDesc = "Penjelasan/uraian benar";
      }

      rows.push({
        number: numberIndex,
        cp: meta.cp,
        element: meta.element,
        materi: topic,
        indicator: stimulus,
        cognitiveLevel: level + (level === "Level 3" ? " - Menganalisis (HOTS)" : level === "Level 2" ? " - Mengaplikasikan" : " - Memahami"),
        questionType: type,
        answerKey: answerKeyDesc
      });

      numberIndex++;
    }
  }

  return rows;
}

export function generateFallbackSoal(schoolInfo: any, subject: string, kisiKisi: any[]) {
  const questions: any[] = [];

  const currentPhase = ["Kelas 1", "Kelas 2"].includes(schoolInfo?.gradeClass) 
    ? "Fase A" 
    : ["Kelas 3", "Kelas 4"].includes(schoolInfo?.gradeClass) 
      ? "Fase B" 
      : "Fase C";

  const commonNames = {
    guru: ["Pak Bambang", "Ibu Sri", "Pak Hartono", "Ibu Ratih", "Pak Joko", "Ibu Shinta"],
    murid: ["Andi", "Budi", "Cici", "Dedi", "Evi", "Fandi", "Gita", "Hari", "Iwan", "Julia", "Rian", "Sari"],
    desa: ["Desa Sukamaju", "Desa Makmur", "Kota Harapan", "Desa Subur"],
    sekolah: ["SD Negeri Nusantara", "SD Merdeka", "SD Harapan Bangsa", "SD Bakti Luhur"]
  };

  for (const row of kisiKisi) {
    const num = row.number;
    const topic = row.materi;
    const type = row.questionType;
    const level = row.cognitiveLevel;

    // Names instantiated stably based on question number so they don't shift randomly during re-renders
    const nameA = commonNames.murid[num % commonNames.murid.length];
    const nameB = commonNames.murid[(num + 1) % commonNames.murid.length];
    const nameGuru = commonNames.guru[num % commonNames.guru.length];
    const desa = commonNames.desa[num % commonNames.desa.length];
    const sekolah = commonNames.sekolah[num % commonNames.sekolah.length];

    let sc = ""; // SVG Content
    let stim = ""; // Stimulus Text
    let qtext = ""; // Question Text
    let opts: string[] = [];
    let key = "a";
    let expl = "";

    // Specific deterministic templates based on subject and topic
    if (subject.includes("Matematika")) {
      if (topic.includes("Pecahan") || topic.includes("pecahan")) {
        stim = `Di ${sekolah}, Ibu Guru ${nameGuru} membawa sebuah kue melon. Ibu memotong kue tersebut menjadi beberapa bagian sama besar untuk dibagikan kepada ${nameA} dan ${nameB}.`;
        qtext = `${nameA} mendapatkan 2/4 bagian dari kue tersebut. Manakah di bawah ini pecahan yang senilai dengan kue yang diterima oleh ${nameA}?`;
        opts = ["A. 1/2", "B. 1/3", "C. 2/3", "D. 3/8"];
        key = "a";
        expl = "Pecahan 2/4 jika disederhanakan dengan membagi pembilang dan penyebut dengan angka 2 akan menghasilkan 1/2. Maka 2/4 senilai dengan 1/2.";
        
        sc = `<svg viewBox="0 0 120 120" style="max-width: 120px; display: block; margin: 10px auto;">
          <circle cx="60" cy="60" r="50" stroke="#334155" stroke-width="3" fill="none"/>
          <path d="M 60 10 A 50 50 0 0 1 110 60 A 50 50 0 0 1 60 110 L 60 60 Z" fill="#cbd5e1" stroke="#334155" stroke-width="2"/>
          <line x1="60" y1="10" x2="60" y2="110" stroke="#334155" stroke-width="2"/>
          <line x1="10" y1="60" x2="110" y2="60" stroke="#334155" stroke-width="2"/>
          <text x="60" y="5" font-family="sans-serif" font-size="8" text-anchor="middle" font-weight="bold">Kue Melon</text>
        </svg>`;
      } 
      else if (topic.includes("Cacah") || topic.includes("cacah") || topic.includes("Bilangan")) {
        if (currentPhase === "Fase A") {
          stim = `Pak Guru ${nameGuru} di ${desa} sedang mengumpulkan pensil warna di kelas. Pak Guru mengumpulkan pensil warna sebanyak 42 buah.`;
          qtext = "Pada bilangan 42, angka manakah yang menempati nilai tempat puluhan?";
          opts = ["A. Angka 4", "B. Angka 2", "C. Angka 0", "D. Angka 10"];
          key = "a";
          expl = "Pada bilangan 42: angka 4 menempati nilai tempat puluhan (nilainya 40), sedangkan angka 2 menempati nilai tempat satuan. Jadi nilai puluhan ditempati oleh angka 4.";
        } else {
          stim = `Pak Guru ${nameGuru} di ${desa} sedang mendata sisa buku tulis perpustakaan. Lemari perpustakaan mengumpulkan buku dan berhasil menyusun sebanyak 4.250 buah buku pelajaran.`;
          qtext = "Pada bilangan 4.250, manakah angka yang menempati nilai tempat ratusan?";
          opts = ["A. Angka 4", "B. Angka 2", "C. Angka 5", "D. Angka 0"];
          key = "b";
          expl = "Pada bilangan 4.250: 4 menempati ribuan, 2 menempati ratusan, 5 menempati puluhan, dan 0 menempati satuan. Jadi ratusan ditempati oleh angka 2.";
        }
      }
      else if (topic.includes("KPK") || topic.includes("FPB") || topic.includes("Pembagian") || topic.includes("Perkalian")) {
        stim = `${nameA} dan ${nameB} adalah murid yang rajin mendatangi perpustakaan sekolah. ${nameA} pergi ke perpustakaan ${sekolah} setiap 4 hari sekali, sedangkan ${nameB} berkunjung setiap 6 hari sekali.`;
        qtext = "Jika hari ini mereka membaca buku bersama di perpustakaan, berapa hari lagikah mereka akan bertemu bersama di perpustakaan kembali?";
        opts = ["A. 8 hari", "B. 10 hari", "C. 12 hari", "D. 24 hari"];
        key = "c";
        expl = "Pertemuan bersama dicari menggunakan Kelipatan Persekutuan Terkecil (KPK) dari 4 dan 6. Kelipatan 4 = 4, 8, 12, 16... Kelipatan 6 = 6, 12, 18... KPK terendah adalah 12.";
      }
      else if (topic.includes("Luas") || topic.includes("Persegi Panjang") || topic.includes("Keliling")) {
        stim = `Lapangan olah raga di ${sekolah} memiliki bentuk persegi panjang dengan ukuran panjang 15 meter dan lebar 10 meter.`;
        qtext = "Berapakah luas keseluruhan dari lapangan olah raga sekolah dasar tersebut?";
        opts = ["A. 25 meter persegi", "B. 50 meter persegi", "C. 150 meter persegi", "D. 300 meter persegi"];
        key = "c";
        expl = "Luas persegi panjang dihitung dengan mengalikan panjang dan lebar. Luas = 15 meter x 10 meter = 150 meter persegi.";
        
        sc = `<svg viewBox="0 0 150 100" style="max-width: 150px; display: block; margin: 10px auto;">
          <rect x="15" y="15" width="120" height="70" fill="#f1f5f9" stroke="#334155" stroke-width="3"/>
          <text x="75" y="10" font-family="sans-serif" font-size="10" text-anchor="middle">Panjang: 15 m</text>
          <text x="140" y="55" font-family="sans-serif" font-size="10" text-anchor="start">Lebar: 10 m</text>
          <text x="75" y="55" font-family="sans-serif" font-size="12" font-weight="bold" fill="#4f46e5" text-anchor="middle">Luas = ?</text>
        </svg>`;
      }
      else if (topic.includes("Segitiga") || topic.includes("segitiga") || topic.includes("Geometri")) {
        stim = `Siswa kelas ${schoolInfo?.gradeClass || "4"} sedang mempelajari bangun datar segitiga siku-siku menggunakan sedotan plastik daur ulang.`;
        qtext = "Jika sebuah segitiga memiliki salah satu sudut yang besarnya tepat 90 derajat, segitiga tersebut termasuk golongan jenis segitiga apa?";
        opts = ["A. Segitiga Sama Sisi", "B. Segitiga Siku-Siku", "C. Segitiga Sama Kaki", "D. Segitiga Sembarang"];
        key = "b";
        expl = "Segitiga yang mempunyai satu sudut sebesar 90 derajat didefinisikan sebagai Segitiga Siku-siku.";
        
        sc = `<svg viewBox="0 0 120 100" style="max-width: 120px; display: block; margin: 10px auto;">
          <polygon points="20,80 100,80 20,20" fill="#f8fafc" stroke="#334155" stroke-width="3"/>
          <rect x="20" y="70" width="10" height="10" fill="none" stroke="#334155" stroke-width="1.5"/>
          <text x="15" y="85" font-size="10" font-family="sans-serif">A</text>
          <text x="105" y="85" font-size="10" font-family="sans-serif">B</text>
          <text x="15" y="15" font-size="10" font-family="sans-serif">C</text>
          <text x="35" y="65" font-size="9" fill="#e11d48">90°</text>
        </svg>`;
      }
      else {
        stim = `Di koperasi ${sekolah}, ${nameA} membeli pensil untuk keperluan ujian akhir tahun sekolah Merdeka.`;
        qtext = `Jika ${nameA} memiliki 2 pensil baru dan ${nameB} memberikan lagi 5 pensil yang sama, berapakah jumlah seluruh pensil ${nameA} sekarang?`;
        opts = ["A. 5 pensil", "B. 7 pensil", "C. 10 pensil", "D. 12 pensil"];
        key = "b";
        expl = "Jumlah pensil dihitung dengan menambahkan pensil awal dengan pensil pemberian. 2 pensil + 5 pensil = 7 pensil.";
      }
    }
    else if (subject.includes("Bahasa Indonesia")) {
      stim = `Bacalah teks singkat berikut! ${nameA} rajin merawat koleksi buku miliknya di rumah. Setiap hari Sabtu, ia membersihkan debu yang menempel pada sampul buku memakai kemoceng bulu ayam.`;
      
      if (topic.includes("Ejaan") || topic.includes("Menulis") || topic.includes("EYD") || topic.includes("Kapital")) {
        qtext = "Manakah kalimat di bawah ini yang menggunakan huruf kapital secara tepat sesuai dengan kaidah ejaan Bahasa Indonesia?";
        opts = [
          "A. andi pergi ke desa makmur kemarin sore.",
          "B. Andi pergi ke Desa Makmur kemarin sore.",
          "C. andi Pergi Ke Desa Makmur Kemarin Sore.",
          "D. Andi pergi ke desa Makmur kemarin Sore."
        ];
        key = "b";
        expl = "Huruf kapital digunakan pada awal kalimat (Andi) dan pada huruf pertama unsur nama geografi (Desa Makmur). Maka pilihan B adalah yang paling tepat.";
      } else {
        qtext = `Berdasarkan teks bacaan, apa yang dilakukan oleh ${nameA} setiap hari Sabtu untuk merawat bukunya?`;
        opts = [
          "A. Membeli buku cerita bergambar baru di kota",
          "B. Menyimpan tumpukan buku di dalam kardus mainan",
          "C. Membersihkan debu yang menempel di sampul buku",
          "D. Meminjamkan seluruh bukunya kepada tetangga rumah"
        ];
        key = "c";
        expl = "Sesuai informasi eksplisit di dalam teks stimulus, setiap hari Sabtu ia membersihkan debu yang menempel di sampul buku memakai kemoceng.";
      }
    }
    else if (subject.includes("Pancasila")) {
      stim = `Siswa-siswi di ${sekolah} selalu mengamalkan nilai gotong royong dan kebersamaan dalam persahabatan mereka di kelas maupun luar kelas.`;
      
      if (topic.includes("Simbol") || topic.includes("Pancasila") || topic.includes("Lambang")) {
        qtext = "Manakah lambang atau simbol dari sila kedua Pancasila pada perisai burung Garuda?";
        opts = ["A. Bintang emas", "B. Rantai emas lingkaran", "C. Pohon beringin rindang", "D. Kepala banteng hitam"];
        key = "b";
        expl = "Simbol Sila kedua Pancasila (Kemanusiaan yang Adil dan Beradab) diwakili oleh lambang Rantai Emas. Bintang adalah sila ke-1, Beringin ke-3, Kepala Banteng ke-4, Padi & Kapas ke-5.";
        
        sc = `<svg viewBox="0 0 100 100" style="max-width: 100px; display: block; margin: 10px auto;">
          <rect x="10" y="10" width="80" height="80" rx="10" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
          <circle cx="50" cy="50" r="22" stroke="#b45309" stroke-width="5" fill="none"/>
          <text x="50" y="54" font-family="sans-serif" font-size="12" font-weight="black" text-anchor="middle" fill="#b45309">⛓️</text>
        </svg>`;
      } else {
        qtext = `Di bawah ini, manakah kegiatan yang mencerminkan pengamalan sila ketiga Pancasila (Persatuan Indonesia) ketika berada di sekolah?`;
        opts = [
          "A. Memilih-milih teman bermain berdasarkan asal daerah atau warna kulit",
          "B. Melaksanakan piket kerja bakti membersihkan kelas bersama teman-teman",
          "C. Mencontek hasil pekerjaan rumah milik teman dekat dengan diam-diam",
          "D. Mengabaikan nasihat dari guru kelas ketika sedang dinasehati"
        ];
        key = "b";
        expl = "Kerja bakti piket kelas bersama mencerminkan persatuan, kebersamaan, dan kerjasama yang selaras dengan Sila ketiga Pancasila.";
      }
    }
    else if (subject.includes("IPAS")) {
      stim = `Dalam pelajaran Sains di ${sekolah}, ${nameGuru} mengajak para siswa melakukan eksplorasi ekologi di taman belakang kelas.`;
      
      if (topic.includes("Wujud") || topic.includes("Zat") || topic.includes("Suhu")) {
        qtext = "Ketika air mendidih di dalam panci panas, air berubah wujud menjadi uap air. Perubahan wujud dari benda cair menjadi benda gas ini disebut dengan istilah apa?";
        opts = ["A. Mencair", "B. Membeku", "C. Menguap", "D. Mengembun"];
        key = "c";
        expl = "Perubahan wujud zat dari cair ke gas atau udara disebut Menguap. Sebaliknya gas ke cair adalah mengembun, cair ke padat membeku, padat ke cair mencair.";
      } 
      else if (topic.includes("Tubuh") || topic.includes("Fotosintesis") || topic.includes("Organ")) {
        qtext = "Manakah bagian tubuh tumbuhan yang memiliki fungsi utama untuk menyerap air dan unsur hara di dalam tanah?";
        opts = ["A. Daun hijau", "B. Batang kayu", "C. Bunga hias", "D. Akar serabut"];
        key = "d";
        expl = "Akar tumbuhan berfungsi menyerap air dan garam-garam mineral (unsur hara) dari dalam tanah untuk disalurkan ke daun.";
        
        sc = `<svg viewBox="0 0 100 100" style="max-width: 100px; display: block; margin: 10px auto;">
          <rect x="45" y="10" width="10" height="60" fill="#a16207"/>
          <circle cx="50" cy="25" r="20" fill="#15803d"/>
          <path d="M 50 70 Q 30 80 15 90 M 50 75 Q 40 85 30 95 M 50 70 Q 70 80 85 90 M 50 75 Q 60 85 70 95" stroke="#78350f" stroke-width="2.5" fill="none"/>
          <text x="80" y="80" font-family="sans-serif" font-size="8" fill="#78350f" font-weight="bold">Akar</text>
        </svg>`;
      }
      else {
        qtext = "Makhluk hidup yang berperan menghasilkan makanan sendiri melalui bantuan sinar matahari (fotosintesis) disebut dengan kedudukan apa?";
        opts = ["A. Produsen", "B. Konsumen tingkat satu", "C. Konsumen tingkat dua", "D. Pengurai (Dekomposer)"];
        key = "a";
        expl = "Tumbuhan hijau dikelompokkan sebagai Produsen karena mampu mendesain zat makanan sendiri melalui klorofil dan fotosintesis.";
      }
    }
    else if (subject.includes("Agama")) {
      stim = `Saat pelajaran Agama di ${sekolah}, siswa diajarkan untuk senantiasa membiasakan perilaku jujur, rendah hati, dan saling mengasihi sesama manusia.`;
      
      qtext = "Di bawah ini, manakah contoh sikap rendah hati dan terpuji yang patut dipraktikkan dalam berinteraksi dengan teman kelas?";
      opts = [
        "A. Memamerkan nilai raport yang bagus dengan nada meremehkan usaha teman",
        "B. Mau bermain dengan semua teman tanpa membedakan latar belakang agama",
        "C. Memotong perkataan teman ketika sedang menyampaikan gagasan",
        "D. Menyimpan amarah ketika dinasihati oleh bapak dan ibu guru"
      ];
      key = "b";
      expl = "Sikap ramah dan mau berteman secara ikhlas dengan siapa saja tanpa diskriminasi adalah cerminan ajaran budi pekerti luhur di semua pengajaran agama.";
    }
    else if (subject.toLowerCase().includes("pjok") || subject.toLowerCase().includes("jasmani") || subject.toLowerCase().includes("olahraga") || subject.toLowerCase().includes("penjas")) {
      // Dynamic physical education templates
      const templates = [
        {
          stim: `Dalam modul kesehatan jasmani di ${sekolah}, ${nameA} sedang berlatih gerakan dasar non-lokomotor yaitu menekuk lutut dan meliukkan badan di lapangan sekolah.`,
          qtext: `Gerakan meliukkan badan tanpa memindahkan posisi kaki dari lantai merupakan contoh dari kelompok gerak dasar apa?`,
          opts: [
            "A. Gerak Lokomotor",
            "B. Gerak Non-lokomotor",
            "C. Gerak Manipulatif",
            "D. Gerak Refleks"
          ],
          key: "b",
          expl: "Gerak non-lokomotor adalah aktivitas fisik yang dilakukan di tempat tanpa disertai perpindahan seluruh tubuh, salah satunya adalah meliukkan badan."
        },
        {
          stim: `Guru olahraga ${nameGuru} mengajarkan cara menendang bola dengan kaki bagian dalam untuk mengoper bola kepada teman seregunya secara akurat setelah tiupan peluit.`,
          qtext: `Di bawah ini, manakah tujuan utama dari menendang bola menggunakan kaki bagian dalam ketika berolahraga sepak bola?`,
          opts: [
            "A. Mengirim umpan jarak jauh melambung tinggi",
            "B. Melakukan tembakan keras jarak jauh ke gawang lawan",
            "C. Melakukan operan pendek yang akurat dan terarah",
            "D. Menghentikan bola yang bergulir dengan sangat cepat"
          ],
          key: "c",
          expl: "Kaki bagian dalam memiliki bidang sentuh yang lebar, sehingga sangat ideal untuk melakukan operan sepak bola jarak dekat secara akurat."
        },
        {
          stim: `${nameA} sedang melakukan gerakan menggiring bola melewati barisan rintangan berupa mangkok olahraga (orange cones) secara berurutan dan zig-zag.`,
          qtext: `Di bawah ini, manakah koordinasi gerak yang paling krusial ketika menggiring bola melewati barisan cone agar bola tidak menyentuh rintangan?`,
          opts: [
            "A. Keseimbangan tubuh dan kontrol sentuhan kaki pada bola",
            "B. Kekuatan tangan saat memegang kaos olahraga",
            "C. Kecepatan lari kencang tanpa memperhatikan posisi bola",
            "D. Lompatan kaki yang setinggi-tingginya di atas cone"
          ],
          key: "a",
          expl: "Menggiring bola melalui rintangan memerlukan keseimbangan tubuh serta kontrol sentuhan kaki yang lembut dan konstan agar bola tetap dekat."
        },
        {
          stim: `Pengukuran kebugaran jasmani di ${sekolah} meliputi tes kelenturan tubuh. ${nameB} mencoba melakukan cium lutut dari posisi duduk selonjor tegak tanpa menekuk lututnya.`,
          qtext: `Latihan cium lutut berguna untuk meregangkan otot bagian tubuh sebelah mana agar terhindar dari cedera otot?`,
          opts: [
            "A. Otot leher dan bahu atas",
            "B. Otot punggung dan paha bagian belakang (hamstring)",
            "C. Otot pergelangan tangan dan jemari",
            "D. Otot dada dan perut bagian samping"
          ],
          key: "b",
          expl: "Gerakan mencium lutut meregangkan otot-otot tulang belakang serta hamstring di paha belakang secara efektif."
        },
        {
          stim: `Saat bermain bola kasti bersama di lapangan, regu pemukul berupaya memukul bola kasti sejauh mungkin lalu berlari kencang mengelilingi tiang hinggap aman.`,
          qtext: `Tindakan memukul bola kasti dan melempar bola kasti tergolong ke dalam kelompok jenis gerak dasar apa dalam penjaskes?`,
          opts: [
            "A. Gerak Lokomotor",
            "B. Gerak Non-lokomotor",
            "C. Gerak Manipulatif",
            "D. Gerak Statis"
          ],
          key: "c",
          expl: "Gerak manipulatif melibatkan penguasaan atau penggunaan suatu objek di luar tubuh, seperti memukul atau melempar bola."
        },
        {
          stim: `Sebelum melakukan aktivitas olahraga lari cepat atau permainan bola basket, ${nameGuru} selalu memimpin para murid untuk melakukan peregangan statis dan dinamis.`,
          qtext: `Apakah manfaat utama dari melakukan tahapan pemanasan (warming up) yang cukup sebelum melakukan olahraga berintensitas tinggi?`,
          opts: [
            "A. Menghabiskan energi tubuh agar cepat merasa lelah",
            "B. Meningkatkan suhu tubuh, kelenturan sendi, dan mencegah cedera",
            "C. Menentukan juara dari permainan olahraga yang dimainkan",
            "D. Mempersingkat waktu jalannya pertandingan utama"
          ],
          key: "b",
          expl: "Pemanasan melenturkan persendian, meningkatkan sirkulasi darah ke otot, dan secara signifikan memperkecil risiko cedera olahraga."
        }
      ];
      const template = templates[num % templates.length];
      stim = template.stim;
      qtext = template.qtext;
      opts = template.opts;
      key = template.key;
      expl = template.expl;
    }
    else if (subject.toLowerCase().includes("seni") || subject.toLowerCase().includes("rupa") || subject.toLowerCase().includes("musik") || subject.toLowerCase().includes("tari")) {
      // Dynamic Arts templates
      const templates = [
        {
          stim: `Dalam mata pelajaran Seni Rupa di ${sekolah}, siswa diajarkan mengenali warna primer dan sekunder. ${nameA} mencampurkan cat warna biru dan kuning di atas palet gambarnya.`,
          qtext: `Hasil dari percampuran warna primer biru dan kuning di atas palet gambar ${nameA} akan menghasilkan warna sekunder apa?`,
          opts: [
            "A. Warna Hijau",
            "B. Warna Jingga",
            "C. Warna Ungu",
            "D. Warna Cokelat"
          ],
          key: "a",
          expl: "Percampuran warna primer kuning dan biru menghasilkan warna sekunder hijau."
        },
        {
          stim: `Siswa kelas ${schoolInfo?.gradeClass || "4"} mempelajari kerajinan tradisional batik jumputan menggunakan teknik ikat celup menggunakan karet gelang dan pewarna pakaian.`,
          qtext: `Bahan pewarna batik yang berasal dari tumbuh-tumbuhan alami seperti daun suji atau kunyit disebut pewarna jenis apa?`,
          opts: [
            "A. Pewarna Sintesis",
            "B. Pewarna Alami",
            "C. Pewarna Kimia",
            "D. Pewarna Buatan"
          ],
          key: "b",
          expl: "Pewarna alami diperoleh langsung dari tumbuh-tumbuhan atau hewan di alam, seperti daun suji (hijau) atau kunyit (kuning)."
        },
        {
          stim: `${nameB} sedang berlatih memeragakan tarian daerah dengan gerakan kaki menyilang dan tangan meliuk mengikuti alunan irama musik tradisional gamelan.`,
          qtext: `Jenis gerak tari daerah yang meniru gerakan alam, seperti daun bergoyang tertiup angin atau aliran sungai, disebut gerak tari apa?`,
          opts: [
            "A. Gerak murni",
            "B. Gerak maknawi",
            "C. Gerak imitatif",
            "D. Gerak akrobatik"
          ],
          key: "c",
          expl: "Gerak imitatif adalah gerakan tari yang dihasilkan dari eksplorasi dengan cara meniru langsung fenomena atau gerak benda di alam sekitar."
        },
        {
          stim: `Pada pelajaran Seni Musik, ${nameGuru} mengenalkan berbagai jenis alat musik tradisional Indonesia, salah satunya adalah angklung dari Jawa Barat yang dimainkan secara ansambel.`,
          qtext: `Bagaimanakah teknik utama memainkan alat musik angklung bambu agar dapat mengeluarkan nada yang indah dan harmonis?`,
          opts: [
            "A. Ditiup beruntun",
            "B. Digoyangkan atau digetarkan",
            "C. Dipukul dengan stik pemukul",
            "D. Dipetik senarnya"
          ],
          key: "b",
          expl: "Angklung dimainkan dengan cara digoyangkan/digetarkan sehingga bambu-bambunya berbenturan dan menghasilkan bunyi nada yang khas."
        },
        {
          stim: `Mendesain gambar dekoratif memerlukan pemahaman terhadap garis, bentuk, dan warna kontras agar gambar tampak indah dipandang.`,
          qtext: `Pertemuan antara ujung-ujung garis yang membentuk suatu bidang tertutup dalam seni rupa disebut unsur dasar apa?`,
          opts: [
            "A. Garis",
            "B. Bentuk / Bidang",
            "C. Tekstur",
            "D. Warna"
          ],
          key: "b",
          expl: "Bidang atau bentuk adalah unsur rupa yang terbentuk dari pertemuan atau batasan garis-garis yang membungkus suatu area."
        }
      ];
      const template = templates[num % templates.length];
      stim = template.stim;
      qtext = template.qtext;
      opts = template.opts;
      key = template.key;
      expl = template.expl;
    }
    else {
      // General highly varied templates for any unspecified school subject
      const templates = [
        {
          stim: `Siswa di ${sekolah} sedang memprioritaskan pemahaman mandiri mengenai materi ${topic} bersama kelompok belajar kelas.`,
          qtext: `Tindakan manakah yang dapat memperkuat penguasaan kompetensi ${topic} secara efektif sesuai Kurikulum Merdeka?`,
          opts: [
            "A. Berlatih secara tekun dan menerapkannya dalam proyek kehidupan nyata sehari-hari",
            "B. Menghafal materi semalam suntuk hanya ketika akan diadakan ujian dadakan",
            "C. Menaruh buku catatan di laci sekolah tanpa berniat mengulangnya kembali",
            "D. Meminta teman sekelas untuk mewakili pengerjaan seluruh tugas evaluasi diri"
          ],
          key: "a",
          expl: "Belajar tekun secara bermakna dan mempraktikkan ilmu dalam kehidupan sehari-hari adalah sarana penguasaan kompetensi yang sejati."
        },
        {
          stim: `Saat mengeksplorasi ${topic} di kelas, ${nameA} berdiskusi aktif menemukan berbagai ide kreatif baru dalam merampungkan tugas kelompoknya.`,
          qtext: `Mengapa kerja sama tim dan diskusi terbuka sangat penting ketika kita mempelajari materi baru seperti ${topic}?`,
          opts: [
            "A. Agar tugas kelompok bertumpu pada satu orang terpintar saja di kelas",
            "B. Untuk bertukar pikiran dan melatih sikap toleransi terhadap perbedaan pendapat",
            "C. Supaya dapat bersantai menyalin pekerjaan milik teman satu tim",
            "D. Untuk mendominasi pembicaraan tanpa menghargai pemikiran teman lainnya"
          ],
          key: "b",
          expl: "Diskusi kelompok memupuk kolaborasi, rasa hormat, toleransi, dan mempercepat perluasan wawasan mengenai materi baru."
        },
        {
          stim: `Ibu Guru ${nameGuru} memberikan kuis kreatif bermateri ${topic} guna melihat perkembangan pemahaman materi ajar mingguan para murid.`,
          qtext: `Sebagai pelajar yang bertanggung jawab, bagaimana sikap terbaik kita apabila menghadapi soal kuis ${topic} yang dirasa sulit untuk dijawab?`,
          opts: [
            "A. Langsung menyerah dan berputus asa tanpa berusaha memikirkannya sama sekali",
            "B. Bertanya dengan jujur kepada guru atau mencoba menjawabnya dengan tenang terlebih dahulu",
            "C. Mencari celah untuk mencontek lembar jawaban teman sebangku dengan terburu-buru",
            "D. Marah dan menyalahkan materi kuis yang dinilai terlampau tinggi tingkat kesulitannya"
          ],
          key: "b",
          expl: "Bersikap jujur, mencoba dengan tenang, dan berkonsultasi kepada guru setelah kuis adalah sikap mental pembelajar Pancasila."
        },
        {
          stim: `Melalui pembelajaran berkelanjutan, setiap siswa diharapkan mempraktikkan hal-hal positif terkait ${topic} untuk membantu lingkungan sekitarnya.`,
          qtext: `Penerapan positif dari materi pokok ${topic} di kehidupan nyata diharapkan bermuara pada tujuan akhir apa?`,
          opts: [
            "A. Menjadi lebih baik, bermanfaat bagi orang lain, serta memecahkan masalah kehidupan",
            "B. Mendapatkan pujian yang berlebihan dari orang lain dan menyombongkan diri",
            "C. Menghindari tugas-tugas dan kewajiban sekolah di hari-hari berikutnya",
            "D. Menjadi individu yang acuh tak acuh dengan kondisi kehidupan masyarakat sekitar"
          ],
          key: "a",
          expl: "Materi pelajaran dipelajari agar membawa kegunaan nyata secara mandiri bagi diri sendiri, sesama, dan lingkungan hidup."
        }
      ];
      const template = templates[num % templates.length];
      stim = template.stim;
      qtext = template.qtext;
      opts = template.opts;
      key = template.key;
      expl = template.expl;
    }

    let finalOptions: string[] = [];
    let finalPairs: any[] = [];
    
    if (type === "Pilihan Ganda") {
      // Force shuffle options for offline fallback to destroy sequential patterns
      let rawOpts = [...opts];
      const originalCorrectOpt = opts[key.toLowerCase().charCodeAt(0) - 97];
      
      for (let i = rawOpts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rawOpts[i], rawOpts[j]] = [rawOpts[j], rawOpts[i]];
      }
      
      let newCorrectIdx = 0;
      finalOptions = rawOpts.map((opt, idx) => {
        if (opt === originalCorrectOpt) {
          newCorrectIdx = idx;
        }
        return `${String.fromCharCode(65 + idx)}. ${opt.replace(/^[A-D][.\s)]+/, "").trim()}`;
      });
      key = String.fromCharCode(97 + newCorrectIdx);
    } else if (type === "Pilihan Ganda Kompleks") {
      finalOptions = [
        `Konsep A mengenai ${topic} yang dipelajari`,
        `Kondisi B mengenai penerapan ${topic}`,
        `Analisis C terkait pemahaman ${topic}`,
        `Kesimpulan D mengenai materi ${topic}`
      ];
      key = "A, C";
    } else if (type === "Menjodohkan") {
      finalPairs = [
        { question: `Konsep A dari ${topic}`, answer: "Jawaban A" },
        { question: `Konsep B dari ${topic}`, answer: "Jawaban B" },
        { question: `Konsep C dari ${topic}`, answer: "Jawaban C" },
        { question: `Konsep D dari ${topic}`, answer: "Jawaban D" }
      ];
    }

    questions.push({
      number: num,
      questionType: type,
      cognitiveLevel: level,
      materi: topic,
      stimulusText: stim,
      questionText: type === "Menjodohkan" && !qtext.includes("Jodohkan") ? "Jodohkanlah pernyataan di kolom kiri dengan jawaban di kolom kanan!" : qtext,
      options: finalOptions,
      pairs: finalPairs,
      answerKey: type === "Pilihan Ganda" ? key : (type === "Pilihan Ganda Kompleks" ? "A, C" : "Sesuai pasangan yang benar"),
      alternativeAnswers: type === "Pilihan Ganda" ? [] : ["Alternatif jawaban logis sesuai kurikulum"],
      explanation: expl,
      svgContent: "",
      imageUrl: ""
    });
  }

  return questions;
}
