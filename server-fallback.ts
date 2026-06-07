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
        // Fisher-Yates based random — NEVER use modulo index (causes A,B,C,D,A,B,C,D pattern!)
        const letters = ["A", "B", "C", "D"];
        answerKeyDesc = letters[Math.floor(Math.random() * 4)];
      } else if (type === "Pilihan Ganda Kompleks") {
        // Pick 2 random distinct correct answers
        const pgkOpts = ["A", "B", "C", "D"];
        const shuffled = pgkOpts.sort(() => Math.random() - 0.5);
        answerKeyDesc = `${shuffled[0]}, ${shuffled[1]}`;
      } else if (type === "Menjodohkan") {
        answerKeyDesc = "Lihat pairs";
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

export function getComplexAndMatchingContent(subject: string, topic: string, num: number, stim: string, qtext: string, opts: string[], key: string, expl: string, schoolInfo?: any) {
  const topicLower = topic.toLowerCase();
  const subLower = subject.toLowerCase();

  let finalOptions = [
    `Pernyataan A mengenai ${topic} yang benar`,
    `Pernyataan B terkait penerapan ${topic}`,
    `Pernyataan C tentang pemahaman ${topic}`,
    `Pernyataan D mengenai materi ${topic}`
  ];
  let finalPairs = [
    { question: `Pernyataan 1 tentang ${topic}`, answer: `Jawaban A` },
    { question: `Pernyataan 2 tentang ${topic}`, answer: `Jawaban B` },
    { question: `Pernyataan 3 tentang ${topic}`, answer: `Jawaban C` }
  ];
  let answerKeyPGK = "A, C";

  if (subLower.includes("matematika")) {
    if (topicLower.includes("cacah") || topicLower.includes("bilangan") || topicLower.includes("nilai tempat")) {
      const isLarge = stim.includes("4.250");
      if (isLarge) {
        finalOptions = [
          "Angka 4 menempati nilai tempat ribuan dengan nilai 4.000",
          "Angka 2 menempati nilai tempat ratusan dengan nilai 200",
          "Angka 5 menempati nilai tempat puluhan dengan nilai 50",
          "Angka 0 menempati nilai tempat ratusan dengan nilai 100"
        ];
        answerKeyPGK = "A, B, C";
        finalPairs = [
          { question: "Angka 4", answer: "Nilai tempat Ribuan" },
          { question: "Angka 2", answer: "Nilai tempat Ratusan" },
          { question: "Angka 5", answer: "Nilai tempat Puluhan" }
        ];
      } else {
        finalOptions = [
          "Angka 4 menempati nilai tempat puluhan dengan nilai 40",
          "Angka 2 menempati nilai tempat satuan dengan nilai 2",
          "Bilangan 42 nilainya lebih besar dari 40",
          "Angka 4 menempati nilai tempat satuan dengan nilai 4"
        ];
        answerKeyPGK = "A, B, C";
        finalPairs = [
          { question: "Angka 4", answer: "Nilai tempat Puluhan" },
          { question: "Angka 2", answer: "Nilai tempat Satuan" },
          { question: "Bilangan 42", answer: "Terdiri atas 4 puluhan dan 2 satuan" }
        ];
      }
    } else if (topicLower.includes("kpk") || topicLower.includes("fpb") || topicLower.includes("pembagian") || topicLower.includes("perkalian")) {
      finalOptions = [
        "Mereka akan bertemu bersama kembali pada hari ke-12",
        "Hari pertemuan bersama dicari menggunakan Kelipatan Persekutuan Terkecil (KPK)",
        "KPK dari 4 dan 6 adalah 12",
        "Mereka akan bertemu bersama kurang dari 10 hari lagi"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Kunjungan Evi", answer: "Setiap 4 hari sekali" },
        { question: "Kunjungan Fandi", answer: "Setiap 6 hari sekali" },
        { question: "Pertemuan bersama kembali", answer: "12 hari lagi" }
      ];
    } else if (topicLower.includes("luas") || topicLower.includes("persegi panjang") || topicLower.includes("keliling")) {
      finalOptions = [
        "Luas keseluruhan lapangan tersebut adalah 150 meter persegi",
        "Bentuk lapangan olahraga sekolah tersebut adalah persegi panjang",
        "Keliling lapangan tersebut adalah 50 meter",
        "Luas lapangan tersebut lebih kecil dari 100 meter persegi"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Panjang lapangan", answer: "15 meter" },
        { question: "Lebar lapangan", answer: "10 meter" },
        { question: "Luas lapangan", answer: "150 meter persegi" }
      ];
    } else if (topicLower.includes("segitiga") || topicLower.includes("sudut") || topicLower.includes("geometri")) {
      finalOptions = [
        "Segitiga tersebut memiliki satu sudut yang besarnya tepat 90 derajat",
        "Segitiga siku-siku memiliki sudut siku-siku sebesar 90 derajat",
        "Jumlah sudut dalam bangun datar segitiga selalu 180 derajat",
        "Segitiga tersebut tergolong sebagai segitiga sama sisi"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Sudut siku-siku", answer: "Besarnya tepat 90 derajat" },
        { question: "Jumlah sudut segitiga", answer: "Totalnya 180 derajat" },
        { question: "Nama bangun datar", answer: "Segitiga Siku-Siku" }
      ];
    } else if (topicLower.includes("pecahan")) {
      finalOptions = [
        "Pecahan 2/4 senilai dengan pecahan 1/2",
        "Kue yang diterima Andi dapat digambarkan dengan mewarnai 2 bagian dari total 4 bagian lingkaran",
        "Pecahan 2/4 nilainya lebih besar dari pecahan 3/4",
        "Pecahan 2/4 memiliki pembilang 2 dan penyebut 4"
      ];
      answerKeyPGK = "A, B, D";
      finalPairs = [
        { question: "Pecahan 2/4", answer: "Senilai dengan 1/2" },
        { question: "Pembilang pecahan 2/4", answer: "Angka 2" },
        { question: "Penyebut pecahan 2/4", answer: "Angka 4" }
      ];
    } else {
      finalOptions = [
        "Jumlah seluruh pensil Evi sekarang adalah 7 buah",
        "Pensil Evi berjumlah 3 buah lebih sedikit dari 10",
        "Jumlah pensil Evi merupakan hasil penjumlahan 2 + 5",
        "Total pensil Evi sekarang merupakan bilangan genap"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Pensil Evi semula", answer: "2 buah pensil" },
        { question: "Pensil dari Fandi", answer: "5 buah pensil" },
        { question: "Jumlah seluruh pensil", answer: "7 buah pensil" }
      ];
    }
  } else if (subLower.includes("bahasa indonesia")) {
    if (topicLower.includes("ejaan") || topicLower.includes("menulis") || topicLower.includes("eyd") || topicLower.includes("kapital")) {
      finalOptions = [
        "Nama diri orang (Andi) di awal kalimat wajib ditulis dengan huruf kapital",
        "Huruf pertama unsur nama geografi (Desa Makmur) wajib menggunakan huruf kapital",
        "Kata 'kemarin' dan 'sore' bukan nama diri sehingga ditulis dengan huruf kecil",
        "Seluruh kata dalam kalimat wajib ditulis menggunakan huruf kapital semua"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Awal kalimat (Andi)", answer: "Wajib huruf kapital A" },
        { question: "Nama geografi (Desa Makmur)", answer: "Huruf kapital pada D dan M" },
        { question: "Kata umum (kemarin sore)", answer: "Menggunakan huruf kecil" }
      ];
    } else {
      finalOptions = [
        "Tokoh Roni rajin merawat koleksi buku miliknya",
        "Roni membersihkan debu di sampul bukunya setiap hari Sabtu",
        "Alat yang dipakai Roni untuk membersihkan debu adalah kemoceng bulu ayam",
        "Roni menyimpan tumpukan bukunya di dalam kardus mainan secara acak"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Tokoh utama cerita", answer: "Roni" },
        { question: "Waktu merawat buku", answer: "Setiap hari Sabtu" },
        { question: "Alat yang digunakan", answer: "Kemoceng bulu ayam" }
      ];
    }
  } else if (subLower.includes("pancasila")) {
    if (topicLower.includes("simbol") || topicLower.includes("pancasila") || topicLower.includes("lambang")) {
      finalOptions = [
        "Sila kedua Pancasila disimbolkan dengan Rantai Emas",
        "Sila ketiga Pancasila disimbolkan dengan Pohon Beringin",
        "Sila kesatu Pancasila disimbolkan dengan Bintang Emas",
        "Sila kelima Pancasila disimbolkan dengan Kepala Banteng"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Sila Kesatu", answer: "Bintang Emas" },
        { question: "Sila Kedua", answer: "Rantai Emas" },
        { question: "Sila Ketiga", answer: "Pohon Beringin" }
      ];
    } else {
      finalOptions = [
        "Piket kerja bakti membersihkan kelas mencerminkan gotong royong",
        "Kerja bakti bersama teman-teman mencerminkan nilai Persatuan Indonesia",
        "Saling menghargai di lingkungan sekolah menciptakan suasana rukun",
        "Mencontek pekerjaan rumah teman mencerminkan pengamalan sila ketiga"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Kerja bakti kelas", answer: "Sila ketiga Pancasila" },
        { question: "Menghargai teman", answer: "Kerukunan sekolah" },
        { question: "Kerja sama", answer: "Gotong royong bersama" }
      ];
    }
  } else if (subLower.includes("ipas") || subLower.includes("sains")) {
    if (topicLower.includes("wujud") || topicLower.includes("zat") || topicLower.includes("suhu")) {
      finalOptions = [
        "Menguap merupakan perubahan wujud zat dari cair menjadi gas",
        "Membeku merupakan perubahan wujud zat dari cair menjadi padat",
        "Uap air mendidih merupakan wujud zat dalam bentuk gas",
        "Perubahan wujud air mendidih menjadi gas disebut membeku"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Menguap", answer: "Perubahan wujud cair menjadi gas" },
        { question: "Membeku", answer: "Perubahan wujud cair menjadi padat" },
        { question: "Mengembun", answer: "Perubahan wujud gas menjadi cair" }
      ];
    } else if (topicLower.includes("tubuh") || topicLower.includes("fotosintesis") || topicLower.includes("organ")) {
      finalOptions = [
        "Akar tumbuhan berfungsi menyerap air dan unsur hara di dalam tanah",
        "Daun tumbuhan merupakan tempat utama terjadinya proses fotosintesis",
        "Batang tumbuhan menyalurkan air dari akar ke daun",
        "Bunga tumbuhan menyerap air secara langsung dari dalam tanah"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Akar", answer: "Menyerap air dan zat hara" },
        { question: "Daun", answer: "Tempat proses fotosintesis" },
        { question: "Batang", answer: "Penyalur air ke seluruh tubuh" }
      ];
    } else {
      finalOptions = [
        "Tumbuhan hijau bertindak sebagai produsen yang menghasilkan makanan sendiri",
        "Hewan pemakan tumbuhan (herbivora) bertindak sebagai konsumen tingkat satu",
        "Fotosintesis memerlukan energi matahari untuk membuat zat makanan",
        "Dekomposer memakan produsen secara langsung untuk membuat makanan"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Tumbuhan hijau", answer: "Produsen (pembuat makanan)" },
        { question: "Hewan herbivora", answer: "Konsumen tingkat satu" },
        { question: "Matahari", answer: "Sumber energi fotosintesis" }
      ];
    }
  } else if (subLower.includes("pjok") || subLower.includes("jasmani") || subLower.includes("olahraga")) {
    const isTemplate0 = stim.includes("non-lokomotor");
    const isTemplate1 = stim.includes("kaki bagian dalam");
    const isTemplate2 = stim.includes("menggiring bola");
    const isTemplate3 = stim.includes("cium lutut");
    const isTemplate4 = stim.includes("kasti");

    if (isTemplate0) {
      finalOptions = [
        "Gerakan meliukkan badan merupakan contoh gerak non-lokomotor",
        "Gerak non-lokomotor dilakukan di tempat tanpa memindahkan posisi kaki",
        "Menekuk lutut tergolong ke dalam contoh gerak non-lokomotor",
        "Berlari kencang memutari lapangan merupakan gerak non-lokomotor"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Meliukkan badan", answer: "Gerak non-lokomotor" },
        { question: "Berlari kencang", answer: "Gerak lokomotor" },
        { question: "Menendang bola", answer: "Gerak manipulatif" }
      ];
    } else if (isTemplate1) {
      finalOptions = [
        "Menendang bola dengan kaki bagian dalam bertujuan untuk operan pendek akurat",
        "Kaki bagian dalam memiliki bidang sentuh yang lebar untuk akurasi operan",
        "Mengoper bola melatih kerja sama regu dalam olahraga sepak bola",
        "Kaki bagian dalam digunakan untuk tembakan keras melambung sejauh-jauhnya"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Kaki bagian dalam", answer: "Umpan pendek dan akurat" },
        { question: "Punggung kaki", answer: "Tendangan keras ke gawang" },
        { question: "Kerja sama tim", answer: "Tujuan mengoper bola" }
      ];
    } else if (isTemplate2) {
      finalOptions = [
        "Menggiring bola zig-zag melewati cone melatih kelincahan kaki",
        "Keseimbangan tubuh membantu pergerakan lari melewati rintangan",
        "Kontrol sentuhan kaki yang lembut menjaga bola tetap dekat",
        "Bola harus ditendang sejauh-jauhnya agar tidak menyentuh cone"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Menggiring zig-zag", answer: "Melatih kelincahan" },
        { question: "Rintangan cone", answer: "Mangkok olahraga orange" },
        { question: "Kontrol kaki", answer: "Menjaga bola tetap dekat" }
      ];
    } else if (isTemplate3) {
      finalOptions = [
        "Latihan cium lutut meregangkan otot hamstring di paha belakang",
        "Gerakan cium lutut melatih kelenturan persendian tulang belakang",
        "Peregangan otot sebelum olahraga mengurangi risiko cedera",
        "Lutut harus ditekuk setinggi dada saat melakukan cium lutut"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Latihan cium lutut", answer: "Melatih kelenturan" },
        { question: "Otot hamstring", answer: "Otot paha bagian belakang" },
        { question: "Manfaat peregangan", answer: "Mengurangi risiko cedera" }
      ];
    } else if (isTemplate4) {
      finalOptions = [
        "Memukul bola kasti tergolong ke dalam kelompok gerak manipulatif",
        "Berlari ke tiang hinggap aman merupakan kelompok gerak lokomotor",
        "Gerak manipulatif melibatkan penguasaan objek di luar tubuh",
        "Melempar bola kasti merupakan contoh gerak non-lokomotor"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Memukul bola", answer: "Gerak manipulatif" },
        { question: "Berlari ke tiang", answer: "Gerak lokomotor" },
        { question: "Pemain kasti", answer: "Memukul dan berlari" }
      ];
    } else {
      finalOptions = [
        "Pemanasan melenturkan persendian and mempersiapkan otot tubuh",
        "Pemanasan secara signifikan mengurangi risiko terjadinya cedera",
        "Peregangan statis dan dinamis merupakan bagian dari pemanasan",
        "Pemanasan sebaiknya dilakukan setelah seluruh olahraga selesai"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Peregangan otot", answer: "Pemanasan (warming up)" },
        { question: "Manfaat pemanasan", answer: "Mencegah cedera olahraga" },
        { question: "Olahraga utama", answer: "Aktivitas fisik intensitas tinggi" }
      ];
    }
  } else if (subLower.includes("seni") || subLower.includes("rupa") || subLower.includes("musik") || subLower.includes("tari")) {
    const isTemplate0 = stim.includes("cat warna");
    const isTemplate1 = stim.includes("batik jumputan");
    const isTemplate2 = stim.includes("tarian daerah");
    const isTemplate3 = stim.includes("angklung");

    if (isTemplate0) {
      finalOptions = [
        "Percampuran warna primer kuning dan biru menghasilkan warna sekunder hijau",
        "Kuning dan biru merupakan contoh kelompok warna primer",
        "Warna hijau dikelompokkan sebagai warna sekunder",
        "Campuran warna merah dan kuning menghasilkan warna sekunder hijau"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Kuning dan Biru", answer: "Warna Primer" },
        { question: "Warna Hijau", answer: "Warna Sekunder" },
        { question: "Palet gambar", answer: "Wadah mencampur cat warna" }
      ];
    } else if (isTemplate1) {
      finalOptions = [
        "Daun suji menghasilkan warna hijau alami pada kerajinan kain",
        "Kunyit merupakan contoh bahan pewarna kuning yang bersifat alami",
        "Batik jumputan dirancang menggunakan teknik ikat celup",
        "Pewarna kimia sintetis jauh lebih ramah lingkungan daripada kunyit"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Batik jumputan", answer: "Teknik ikat celup" },
        { question: "Karet gelang", answer: "Bahan pengikat pola kain" },
        { question: "Kunyit dan daun suji", answer: "Pewarna alami tumbuhan" }
      ];
    } else if (isTemplate2) {
      finalOptions = [
        "Gerak imitatif meniru secara langsung gerakan alam sekitar",
        "Gerakan meniru daun bergoyang ditiup angin tergolong gerak imitatif",
        "Tarian daerah menggambarkan ekspresi budaya lokal masyarakat",
        "Gerak tari imitatif wajib menggunakan gerakan salto yang berbahaya"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Gerak imitatif", answer: "Meniru gerakan alam" },
        { question: "Gamelan", answer: "Alat musik pengiring tari" },
        { question: "Daun bergoyang", answer: "Stimulus gerak imitatif" }
      ];
    } else if (isTemplate3) {
      finalOptions = [
        "Angklung terbuat dari bahan bambu dan dimainkan secara ansambel",
        "Alat musik angklung dimainkan dengan digoyangkan atau digetarkan",
        "Angklung bambu merupakan alat musik tradisional dari Jawa Barat",
        "Angklung dimainkan dengan cara ditiup bagian ujung bambunya"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Angklung", answer: "Alat musik bambu Jawa Barat" },
        { question: "Teknik memainkan", answer: "Digoyangkan / digetarkan" },
        { question: "Ansambel", answer: "Dimainkan bersama secara kelompok" }
      ];
    } else {
      finalOptions = [
        "Bidang terbentuk dari batasan ujung-ujung garis yang saling bertemu",
        "Gambar dekoratif menggabungkan unsur garis, bidang/bentuk, dan warna",
        "Warna kontras memperindah tampilan visual gambar dekoratif",
        "Garis tidak memiliki fungsi dalam menyusun gambar dekoratif"
      ];
      answerKeyPGK = "A, B, C";
      finalPairs = [
        { question: "Unsur Bidang", answer: "Pertemuan ujung-ujung garis" },
        { question: "Gambar dekoratif", answer: "Kombinasi garis, bidang, dan warna" },
        { question: "Warna kontras", answer: "Memperindah visual gambar" }
      ];
    }
  } else {
    finalOptions = [
      `Memahami materi ${topic} secara mendalam dengan tekun berlatih`,
      `Menerapkan pemahaman ${topic} dalam kehidupan sehari-hari`,
      `Mempelajari ${topic} memperluas wawasan dan kecakapan kita`,
      `Menghafalkan ${topic} secara terpaksa tanpa memahami konsepnya`
    ];
    answerKeyPGK = "A, B, C";
    finalPairs = [
      { question: `Belajar ${topic}`, answer: "Memperluas wawasan diri" },
      { question: `Penerapan ${topic}`, answer: "Berguna di kehidupan nyata" },
      { question: `Evaluasi ${topic}`, answer: "Melihat capaian pemahaman" }
    ];
  }

  // Dynamically vary the number of correct options (2, 3, or 4) based on question number 'num'
  // to ensure variety across subjects, topics, and grades.
  if (finalOptions && finalOptions.length === 4) {
    const selector = num % 3;
    if (selector === 0) {
      // Case 2 correct:
      if (answerKeyPGK === "A, B, D") {
        const optB = finalOptions[1].trim();
        finalOptions[1] = `Tidak benar bahwa ${optB.charAt(0).toLowerCase() + optB.slice(1)}`;
        answerKeyPGK = "A, D";
      } else if (answerKeyPGK === "A, B, C") {
        const optB = finalOptions[1].trim();
        finalOptions[1] = `Tidak benar bahwa ${optB.charAt(0).toLowerCase() + optB.slice(1)}`;
        answerKeyPGK = "A, C";
      }
    } else if (selector === 2) {
      // Case 4 correct (benar semua):
      if (answerKeyPGK === "A, B, D") {
        const optC = finalOptions[2].trim();
        finalOptions[2] = `Tidak benar bahwa ${optC.charAt(0).toLowerCase() + optC.slice(1)}`;
        answerKeyPGK = "A, B, C, D";
      } else if (answerKeyPGK === "A, B, C") {
        const optD = finalOptions[3].trim();
        finalOptions[3] = `Tidak benar bahwa ${optD.charAt(0).toLowerCase() + optD.slice(1)}`;
        answerKeyPGK = "A, B, C, D";
      } else if (answerKeyPGK === "A, C") {
        const optB = finalOptions[1].trim();
        const optD = finalOptions[3].trim();
        finalOptions[1] = `Tidak benar bahwa ${optB.charAt(0).toLowerCase() + optB.slice(1)}`;
        finalOptions[3] = `Tidak benar bahwa ${optD.charAt(0).toLowerCase() + optD.slice(1)}`;
        answerKeyPGK = "A, B, C, D";
      } else {
        answerKeyPGK = "A, B, C, D";
      }
    }
  }

  return { finalOptions, finalPairs, answerKeyPGK };
}

export function generateFallbackSoal(schoolInfo: any, subject: string, kisiKisi: any[]) {
  const questions: any[] = [];

  const currentPhase = ["Kelas 1", "Kelas 2"].includes(schoolInfo?.gradeClass) 
    ? "Fase A" 
    : ["Kelas 3", "Kelas 4"].includes(schoolInfo?.gradeClass) 
      ? "Fase B" 
      : "Fase C";  const commonNames = {
    guru: [
      "Pak Wayan", "Ibu Fatimah", "Pak Stefanus", "Ibu Made", "Pak Yusuf", "Ibu Maria", 
      "Pak Joko", "Ibu Shinta", "Pak Bambang", "Ibu Sri", "Pak Hartono", "Ibu Ratih",
      "Pak RT Ahmad", "Pak Desa Tinus", "Bu Guru Yanti", "Pak Guru Anton"
    ],
    murid: [
      "Tinus", "Ahmad", "Winda", "Yanti", "Ira", "Wayan", "Made", "Siti", "Yusuf", "Maria", 
      "Dayu", "Lani", "Edo", "Udin", "Beni", "Anton", "Joni", "Roni", "Ghea", "Rani", 
      "Andi", "Budi", "Cici", "Dedi", "Evi", "Fandi", "Gita", "Hari", "Iwan", "Julia"
    ],
    desa: ["Desa Fatubai", "Desa Sukamaju", "Desa Makmur", "Kota Kupang", "Desa Subur", "Desa Nifuboke"],
    latar: [
      "taman bermain", "lapangan olahraga", "perpustakaan", "kebun belakang sekolah", 
      "sawah milik paman", "pantai berpasir", "ruang kelas", "pasar tradisional", 
      "teras depan rumah", "jalan desa", "ruang musik", "halaman depan"
    ],
    sekolah: [
      "SD Negeri Fatubai", "SD Inpres Nifuboke", "SD Katolik Santo Petrus", "SD Harapan Bangsa", 
      "SD Tunas Bangsa", "SD Negeri Merdeka", "SD Jaya Raya", "SD Karya Bhakti"
    ]
  };

  for (const row of kisiKisi) {
    const num = row.number;
    const topic = row.materi;
    const type = row.questionType;
    const level = row.cognitiveLevel;

    // Names instantiated stably based on question number so they don't shift randomly during re-renders
    const nameA = commonNames.murid[num % commonNames.murid.length];
    const nameB = commonNames.murid[(num + 5) % commonNames.murid.length];
    const nameGuru = commonNames.guru[num % commonNames.guru.length];
    const desa = commonNames.desa[num % commonNames.desa.length];
    const sekolah = commonNames.sekolah[num % commonNames.sekolah.length];
    const latar = commonNames.latar[num % commonNames.latar.length];

    let sc = ""; // SVG Content
    let stim = ""; // Stimulus Text
    let qtext = ""; // Question Text
    let opts: string[] = [];
    let key = "a";
    let expl = "";

    // Specific deterministic templates based on subject and topic
    if (subject.includes("Matematika")) {
      if (topic.includes("Pecahan") || topic.includes("pecahan")) {
        const pecTemplates = [
          {
            stimFaseA: `${nameA} punya 1 apel. Apel itu dipotong jadi 2 sama besar. 1 bagian dimakan.`,
            qtextFaseA: `Berapa bagian apel yang dimakan oleh ${nameA}?`,
            optsFaseA: ["A. 1/2 bagian", "B. 1/3 bagian", "C. 2/3 bagian", "D. 1/4 bagian"],
            keyFaseA: "a",
            explFaseA: "Apel dipotong 2 sama besar, 1 bagian nilainya setengah atau 1/2.",
            
            stimFaseBC: `Di ${sekolah}, Ibu Guru ${nameGuru} membawa kue melon. Kue dipotong menjadi 4 bagian sama besar untuk ${nameA} dan ${nameB}.`,
            qtextFaseBC: `${nameA} menerima 2/4 bagian dari kue melon. Manakah pecahan di bawah yang senilai dengan bagian ${nameA}?`,
            optsFaseBC: ["A. 1/2", "B. 1/3", "C. 2/3", "D. 3/8"],
            keyFaseBC: "a",
            explFaseBC: "Pecahan 2/4 disederhanakan dengan membagi pembilang dan penyebut dengan 2 menjadi 1/2."
          },
          {
            stimFaseA: `${nameA} membagi kue cokelat menjadi 4 bagian sama besar. ${nameB} makan 2 potong.`,
            qtextFaseA: `Pecahan yang menunjukkan kue cokelat yang dimakan ${nameB} adalah?`,
            optsFaseA: ["A. 2/4", "B. 1/4", "C. 3/4", "D. 4/4"],
            keyFaseA: "a",
            explFaseA: "Makan 2 potong dari 4 potong sama besar berarti 2/4 bagian.",

            stimFaseBC: `${nameA} memotong cokelat menjadi 8 bagian sama besar. Sebanyak 4 bagian diberikan kepada ${nameB}.`,
            qtextFaseBC: `Manakah di bawah ini pecahan yang senilai dengan bagian cokelat yang diterima oleh ${nameB}?`,
            optsFaseBC: ["A. 2/4", "B. 1/3", "C. 2/5", "D. 3/4"],
            keyFaseBC: "a",
            explFaseBC: "Cokelat yang diterima adalah 4/8, yang disederhanakan menjadi 1/2, setara dengan 2/4."
          },
          {
            stimFaseA: `${nameA} membagi selembar kertas lipat menjadi 4 bagian. Kertas itu diwarnai merah sebanyak 3 bagian.`,
            qtextFaseA: `Berapa bagian kertas lipat merah itu?`,
            optsFaseA: ["A. 3/4", "B. 1/4", "C. 2/4", "D. 4/4"],
            keyFaseA: "a",
            explFaseA: "Mewarnai 3 bagian dari 4 bagian berarti 3/4.",

            stimFaseBC: `${nameA} membawa martabak manis dan dipotong menjadi 6 bagian sama besar. Ia memakan 3/6 bagian martabak tersebut.`,
            qtextFaseBC: `Manakah pecahan berikut yang senilai dengan martabak yang dimakan oleh ${nameA}?`,
            optsFaseBC: ["A. 1/2", "B. 1/4", "C. 2/3", "D. 5/6"],
            keyFaseBC: "a",
            explFaseBC: "Pecahan 3/6 disederhanakan dengan membagi pembilang dan penyebut dengan 3 menjadi 1/2."
          },
          {
            stimFaseA: `Ada 4 buah jeruk di meja. ${nameA} makan 1 buah jeruk itu.`,
            qtextFaseA: `Berapa pecahan jeruk yang dimakan oleh ${nameA}?`,
            optsFaseA: ["A. 1/4", "B. 2/4", "C. 3/4", "D. 4/4"],
            keyFaseA: "a",
            explFaseA: "Memakan 1 dari 4 jeruk berarti 1/4 bagian jeruk.",

            stimFaseBC: `${nameA} membelah semangka menjadi 10 potong sama besar. Sebanyak 2/10 bagian dibagikan ke tetangga terdekat.`,
            qtextFaseBC: `Pecahan manakah yang senilai dengan buah semangka yang dibagikan kepada tetangga tersebut?`,
            optsFaseBC: ["A. 1/5", "B. 1/4", "C. 2/5", "D. 3/10"],
            keyFaseBC: "a",
            explFaseBC: "Pecahan 2/10 disederhanakan dengan membagi pembilang dan penyebut dengan 2 menjadi 1/5."
          }
        ];
        const t = pecTemplates[num % pecTemplates.length];
        if (currentPhase === "Fase A") {
          stim = t.stimFaseA; qtext = t.qtextFaseA; opts = t.optsFaseA; key = t.keyFaseA; expl = t.explFaseA;
        } else {
          stim = t.stimFaseBC; qtext = t.qtextFaseBC; opts = t.optsFaseBC; key = t.keyFaseBC; expl = t.explFaseBC;
        }
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
          const cacahTemplates = [
            {
              stim: `Di ${latar}, ${nameA} menghitung pensil warna miliknya. Ia memiliki pensil warna sebanyak 42 buah.`,
              qtext: "Pada bilangan 42, angka manakah yang menempati nilai tempat puluhan?",
              opts: ["A. Angka 4", "B. Angka 2", "C. Angka 0", "D. Angka 10"],
              key: "a",
              expl: "Pada bilangan 42, 4 menempati puluhan (40) dan 2 menempati satuan."
            },
            {
              stim: `Di kelas, ${nameA} menyusun buku cerita. Jumlah buku cerita yang tersusun adalah 85 buah.`,
              qtext: "Pada bilangan 85, angka manakah yang menempati nilai tempat satuan?",
              opts: ["A. Angka 5", "B. Angka 8", "C. Angka 0", "D. Angka 80"],
              key: "a",
              expl: "Pada bilangan 85, 8 menempati puluhan (80) dan 5 menempati satuan."
            },
            {
              stim: `${nameA} mengumpulkan mainan di halaman rumah. Terkumpul kelereng sebanyak 67 butir.`,
              qtext: "Pada bilangan 67, angka manakah yang menempati nilai tempat puluhan?",
              opts: ["A. Angka 6", "B. Angka 7", "C. Angka 10", "D. Angka 60"],
              key: "a",
              expl: "Pada bilangan 67, 6 menempati puluhan (60) dan 7 menempati satuan."
            },
            {
              stim: `Di perpustakaan, ${nameA} meminjam buku. Nomor antrean kartu perpustakaannya adalah 19.`,
              qtext: "Pada bilangan 19, angka manakah yang menempati nilai tempat satuan?",
              opts: ["A. Angka 9", "B. Angka 1", "C. Angka 10", "D. Angka 90"],
              key: "a",
              expl: "Pada bilangan 19, 1 menempati puluhan (10) dan 9 menempati satuan."
            }
          ];
          const t = cacahTemplates[num % cacahTemplates.length];
          stim = t.stim; qtext = t.qtext; opts = t.opts; key = t.key; expl = t.expl;
        } else {
          const cacahTemplates = [
            {
              stim: `Pak Guru ${nameGuru} di ${desa} sedang mendata sisa buku tulis perpustakaan. Buku tersusun sebanyak 4.250 buah.`,
              qtext: "Pada bilangan 4.250, manakah angka yang menempati nilai tempat ratusan?",
              opts: ["A. Angka 4", "B. Angka 2", "C. Angka 5", "D. Angka 0"],
              key: "b",
              expl: "Pada bilangan 4.250, ratusan ditempati oleh angka 2 (nilainya 200)."
            },
            {
              stim: `Nelayan di dekat ${desa} mengumpulkan hasil tangkapan ikan asin kering sebanyak 8.761 kemasan kantong plastik.`,
              qtext: "Pada bilangan 8.761, manakah angka yang menempati nilai tempat ribuan?",
              opts: ["A. Angka 8", "B. Angka 7", "C. Angka 6", "D. Angka 1"],
              key: "a",
              expl: "Pada bilangan 8.761, ribuan ditempati oleh angka 8 (nilainya 8.000)."
            },
            {
              stim: `Petugas pos di ${sekolah} mencatat surat yang dikirim. Nomor registrasi yang tercatat adalah 5.039.`,
              qtext: "Pada bilangan 5.039, manakah angka yang menempati nilai tempat puluhan?",
              opts: ["A. Angka 3", "B. Angka 5", "C. Angka 0", "D. Angka 9"],
              key: "a",
              expl: "Pada bilangan 5.039, puluhan ditempati oleh angka 3 (nilainya 30)."
            },
            {
              stim: `Koperasi ${sekolah} menjual alat tulis. Omzet bulanan yang tercatat adalah sebanyak 9.804 buah barang terjual.`,
              qtext: "Pada bilangan 9.804, manakah angka yang menempati nilai tempat ratusan?",
              opts: ["A. Angka 8", "B. Angka 9", "C. Angka 0", "D. Angka 4"],
              key: "a",
              expl: "Pada bilangan 9.804, ratusan ditempati oleh angka 8 (nilainya 800)."
            }
          ];
          const t = cacahTemplates[num % cacahTemplates.length];
          stim = t.stim; qtext = t.qtext; opts = t.opts; key = t.key; expl = t.expl;
        }
      }
      else if (topic.includes("KPK") || topic.includes("FPB") || topic.includes("Pembagian") || topic.includes("Perkalian")) {
        const kpkTemplates = [
          {
            stim: `${nameA} dan ${nameB} rajin berkunjung ke perpustakaan. ${nameA} berkunjung 4 hari sekali, ${nameB} 6 hari sekali.`,
            qtext: "Jika hari ini mereka bertemu, berapa hari lagikah mereka akan bertemu di perpustakaan bersama lagi?",
            opts: ["A. 8 hari", "B. 10 hari", "C. 12 hari", "D. 24 hari"],
            key: "c",
            expl: "KPK dari 4 dan 6 adalah 12. Maka mereka bertemu 12 hari lagi."
          },
          {
            stim: `${nameA} memiliki 12 kelereng merah dan ${nameB} memiliki 18 kelereng biru. Semua kelereng akan dimasukkan ke dalam wadah sama banyak.`,
            qtext: "Berapakah jumlah wadah terbanyak yang dapat digunakan untuk kelereng-kelereng tersebut?",
            opts: ["A. 6 wadah", "B. 4 wadah", "C. 3 wadah", "D. 8 wadah"],
            key: "a",
            expl: "FPB dari 12 dan 18 adalah 6. Jadi wadah terbanyak adalah 6."
          },
          {
            stim: `${nameA} berlatih bulu tangkis setiap 3 hari, sedangkan ${nameB} berlatih setiap 5 hari sekali di lapangan desa.`,
            qtext: "Berapa hari lagikah mereka akan berlatih bulu tangkis bersama-sama kembali?",
            opts: ["A. 15 hari", "B. 30 hari", "C. 8 hari", "D. 10 hari"],
            key: "a",
            expl: "KPK dari 3 dan 5 adalah 15. Jadi mereka berlatih bersama 15 hari lagi."
          },
          {
            stim: `Ibu membeli 15 jeruk dan 20 apel. Buah tersebut ingin dibagikan kepada teman ${nameA} sama rata tanpa sisa.`,
            qtext: "Berapakah jumlah teman terbanyak yang bisa menerima pembagian buah dari ibu?",
            opts: ["A. 5 orang", "B. 4 orang", "C. 10 orang", "D. 2 orang"],
            key: "a",
            expl: "FPB dari 15 dan 20 adalah 5. Jadi jumlah teman terbanyak adalah 5 orang."
          }
        ];
        const t = kpkTemplates[num % kpkTemplates.length];
        stim = t.stim; qtext = t.qtext; opts = t.opts; key = t.key; expl = t.expl;
      }
      else if (topic.includes("Luas") || topic.includes("Persegi Panjang") || topic.includes("Keliling")) {
        const luasTemplates = [
          {
            stim: `Lapangan olahraga berbentuk persegi panjang di ${sekolah} memiliki ukuran panjang 15 meter dan lebar 10 meter.`,
            qtext: "Berapakah luas keseluruhan dari lapangan olahraga tersebut?",
            opts: ["A. 25 meter persegi", "B. 50 meter persegi", "C. 150 meter persegi", "D. 300 meter persegi"],
            key: "c",
            expl: "Luas = panjang x lebar = 15 m x 10 m = 150 meter persegi."
          },
          {
            stim: `${nameA} menghias ubin lantai kelas berbentuk persegi dengan panjang sisinya adalah 30 cm.`,
            qtext: "Berapakah keliling keseluruhan ubin lantai kelas tersebut?",
            opts: ["A. 120 cm", "B. 90 cm", "C. 60 cm", "D. 900 cm"],
            key: "a",
            expl: "Keliling persegi = 4 x sisi = 4 x 30 cm = 120 cm."
          },
          {
            stim: `Meja belajar di ruang kelas ${sekolah} berbentuk persegi panjang dengan panjang 120 cm and lebar 50 cm.`,
            qtext: "Berapakah luas permukaan dari meja belajar tersebut?",
            opts: ["A. 6.000 cm persegi", "B. 340 cm persegi", "C. 170 cm persegi", "D. 5.000 cm persegi"],
            key: "a",
            expl: "Luas = panjang x lebar = 120 cm x 50 cm = 6.000 cm persegi."
          },
          {
            stim: `Paman membuat pagar untuk kebun bunga berbentuk persegi dengan panjang sisinya adalah 12 meter.`,
            qtext: "Berapakah luas kebun bunga milik paman tersebut?",
            opts: ["A. 144 meter persegi", "B. 48 meter persegi", "C. 24 meter persegi", "D. 96 meter persegi"],
            key: "a",
            expl: "Luas persegi = sisi x sisi = 12 m x 12 m = 144 meter persegi."
          }
        ];
        const t = luasTemplates[num % luasTemplates.length];
        stim = t.stim; qtext = t.qtext; opts = t.opts; key = t.key; expl = t.expl;

        sc = `<svg viewBox="0 0 150 100" style="max-width: 150px; display: block; margin: 10px auto;">
          <rect x="15" y="15" width="120" height="70" fill="#f1f5f9" stroke="#334155" stroke-width="3"/>
          <text x="75" y="10" font-family="sans-serif" font-size="10" text-anchor="middle">Panjang: 15 m</text>
          <text x="140" y="55" font-family="sans-serif" font-size="10" text-anchor="start">Lebar: 10 m</text>
          <text x="75" y="55" font-family="sans-serif" font-size="12" font-weight="bold" fill="#4f46e5" text-anchor="middle">Luas = ?</text>
        </svg>`;
      }
      else if (topic.includes("Segitiga") || topic.includes("segitiga") || topic.includes("Geometri")) {
        const geoTemplates = [
          {
            stim: `Siswa sedang mengamati bangun datar segitiga yang ditarik garis di papan tulis.`,
            qtext: "Jika sebuah segitiga memiliki sudut yang besarnya tepat 90 derajat, segitiga tersebut disebut?",
            opts: ["A. Segitiga Siku-Siku", "B. Segitiga Sama Sisi", "C. Segitiga Sama Kaki", "D. Segitiga Sembarang"],
            key: "a",
            expl: "Segitiga siku-siku memiliki salah satu sudut sebesar 90 derajat."
          },
          {
            stim: `Di ${latar}, ${nameA} membuat segitiga dari ranting kayu dengan ketiga sisinya sama panjang.`,
            qtext: "Segitiga yang memiliki ketiga sisi yang sama panjang dinamakan segitiga?",
            opts: ["A. Segitiga Sama Sisi", "B. Segitiga Sama Kaki", "C. Segitiga Siku-Siku", "D. Segitiga Sembarang"],
            key: "a",
            expl: "Segitiga sama sisi memiliki tiga sisi yang sama panjang."
          },
          {
            stim: `${nameGuru} menanyakan total jumlah sudut dalam bangun datar segitiga apa saja kepada para murid.`,
            qtext: "Berapakah jumlah seluruh sudut bagian dalam dari bangun datar segitiga?",
            opts: ["A. 180 derajat", "B. 90 derajat", "C. 360 derajat", "D. 270 derajat"],
            key: "a",
            expl: "Jumlah total sudut bagian dalam segitiga selalu 180 derajat."
          },
          {
            stim: `${nameB} memotong kertas lipat berbentuk segitiga yang mempunyai dua sisi sama panjang.`,
            qtext: "Segitiga yang memiliki dua sisi yang sama panjang dinamakan segitiga?",
            opts: ["A. Segitiga Sama Kaki", "B. Segitiga Sama Sisi", "C. Segitiga Siku-Siku", "D. Segitiga Sembarang"],
            key: "a",
            expl: "Segitiga sama kaki adalah segitiga dengan dua sisi sama panjang."
          }
        ];
        const t = geoTemplates[num % geoTemplates.length];
        stim = t.stim; qtext = t.qtext; opts = t.opts; key = t.key; expl = t.expl;

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
        const matMiscTemplates = [
          {
            stim: `Di koperasi ${sekolah}, ${nameA} membeli alat tulis untuk keperluan kelas.`,
            qtext: `Jika ${nameA} memiliki 2 pensil dan ${nameB} memberikan lagi 5 pensil yang sama, berapakah jumlah pensil ${nameA} sekarang?`,
            opts: ["A. 5 pensil", "B. 7 pensil", "C. 10 pensil", "D. 12 pensil"],
            key: "b",
            expl: "2 pensil + 5 pensil = 7 pensil."
          },
          {
            stim: `Di kebun, ${nameA} mengumpulkan daun kering. Ia mengumpulkan 8 daun kering, lalu angin meniup gugur 3 daun sehingga hilang.`,
            qtext: "Berapakah sisa daun kering yang masih disimpan oleh murid tersebut?",
            opts: ["A. 5 daun", "B. 3 daun", "C. 8 daun", "D. 11 daun"],
            key: "a",
            expl: "8 daun - 3 daun = 5 daun."
          },
          {
            stim: `${nameA} membawa 3 kantong berisi jeruk. Setiap kantong berisi 4 buah jeruk segar.`,
            qtext: "Berapakah jumlah buah jeruk secara keseluruhan yang dibawa oleh murid tersebut?",
            opts: ["A. 12 jeruk", "B. 7 jeruk", "C. 9 jeruk", "D. 16 jeruk"],
            key: "a",
            expl: "3 kantong x 4 jeruk = 12 jeruk."
          },
          {
            stim: `Ibu guru membawa 10 buku tulis. Buku tulis tersebut dibagikan rata kepada 2 murid yaitu ${nameA} dan ${nameB}.`,
            qtext: "Berapakah buku tulis yang diterima oleh masing-masing murid?",
            opts: ["A. 5 buku", "B. 2 buku", "C. 10 buku", "D. 4 buku"],
            key: "a",
            expl: "10 buku : 2 murid = 5 buku per murid."
          }
        ];
        const t = matMiscTemplates[num % matMiscTemplates.length];
        stim = t.stim; qtext = t.qtext; opts = t.opts; key = t.key; expl = t.expl;
      }
    }
    else if (subject.includes("Bahasa Indonesia")) {
      if (topic.includes("Ejaan") || topic.includes("Menulis") || topic.includes("EYD") || topic.includes("Kapital")) {
        const indEjaanTemplates = [
          {
            stimFaseA: `Ejaan huruf kapital digunakan pada nama orang di awal kalimat.`,
            qtextFaseA: `Penulisan nama orang dengan huruf kapital yang benar adalah...`,
            optsFaseA: ["A. Saya bermain dengan Udin.", "B. Saya bermain dengan udin.", "C. Saya bermain dengan UDIN.", "D. saya bermain dengan udin."],
            keyFaseA: "a",
            explFaseA: "Nama orang 'Udin' harus menggunakan huruf kapital di awal kata.",

            stimFaseBC: `Bacalah kalimat acak berikut! Kalimat ini ditulis oleh ${nameA} saat mencatat kegiatan kerja bakti di desa.`,
            qtextFaseBC: "Manakah kalimat di bawah ini yang menggunakan huruf kapital secara tepat sesuai dengan ejaan Bahasa Indonesia?",
            optsFaseBC: [
              "A. andi pergi ke desa makmur kemarin sore.",
              "B. Andi pergi ke Desa Makmur kemarin sore.",
              "C. andi Pergi Ke Desa Makmur Kemarin Sore.",
              "D. Andi pergi ke desa Makmur kemarin Sore."
            ],
            keyFaseBC: "b",
            explFaseBC: "Huruf kapital digunakan pada awal kalimat (Andi) dan pada unsur nama geografi (Desa Makmur)."
          },
          {
            stimFaseA: `Tanda titik (.) digunakan untuk mengakhiri kalimat berita.`,
            qtextFaseA: `Kalimat di bawah yang menggunakan tanda titik dengan benar adalah...`,
            optsFaseA: ["A. Wayan suka makan buah pisang.", "B. Wayan suka makan buah pisang?", "C. Wayan suka makan buah pisang!", "D. Wayan suka makan buah pisang,"],
            keyFaseA: "a",
            explFaseA: "Kalimat berita diakhiri dengan tanda titik.",

            stimFaseBC: `Pembelajaran menulis tentang tanda baca diajarkan oleh Ibu ${nameGuru} di depan kelas.`,
            qtextFaseBC: "Manakah kalimat berikut yang menggunakan tanda koma (,) dan titik (.) secara tepat?",
            optsFaseBC: [
              "A. Lani membeli buku, pensil, dan penggaris di koperasi.",
              "B. Lani membeli buku pensil dan penggaris di koperasi.",
              "C. Lani membeli buku, pensil dan penggaris, di koperasi.",
              "D. Lani, membeli buku, pensil dan penggaris di koperasi."
            ],
            keyFaseBC: "a",
            explFaseBC: "Tanda koma digunakan untuk merinci lebih dari dua benda (buku, pensil, dan penggaris)."
          },
          {
            stimFaseA: `Tanda tanya (?) digunakan untuk kalimat tanya.`,
            qtextFaseA: `Kalimat tanya di bawah ini yang paling benar adalah...`,
            optsFaseA: ["A. Siapa nama temanmu?", "B. Siapa nama temanmu.", "C. Siapa nama temanmu!", "D. Siapa nama temanmu,"],
            keyFaseA: "a",
            explFaseA: "Pertanyaan menanyakan informasi dan harus diakhiri tanda tanya.",

            stimFaseBC: `${nameB} menulis laporan pengamatan mengenai kebersihan lingkungan sekitar.`,
            qtextFaseBC: "Kalimat manakah yang menggunakan kata tanya dan tanda baca tanya secara benar?",
            optsFaseBC: [
              "A. Mengapa kita harus menjaga kebersihan lingkungan?",
              "B. Mengapa kita harus menjaga kebersihan lingkungan.",
              "C. Mengapa kita harus menjaga kebersihan lingkungan!",
              "D. Mengapa kita harus menjaga kebersihan lingkungan,"
            ],
            keyFaseBC: "a",
            explFaseBC: "Kata tanya 'Mengapa' menuntut penjelasan dan wajib diakhiri tanda tanya (?) di akhir kalimat."
          },
          {
            stimFaseA: `Nama hari diawali dengan huruf kapital.`,
            qtextFaseA: `Manakah penulisan nama hari yang paling benar?`,
            optsFaseA: ["A. Kami libur hari Minggu.", "B. Kami libur hari minggu.", "C. Kami libur Hari minggu.", "D. Kami libur hari MINGGU."],
            keyFaseA: "a",
            explFaseA: "Nama hari 'Minggu' wajib diawali huruf kapital.",

            stimFaseBC: `Guru menugaskan siswa mencatat kegiatan harian di buku harian masing-masing.`,
            qtextFaseBC: "Manakah kalimat berikut yang menuliskan nama hari dan bulan secara tepat?",
            optsFaseBC: [
              "A. Upacara hari Senin dilaksanakan bulan Agustus.",
              "B. Upacara hari senin dilaksanakan bulan agustus.",
              "C. Upacara Hari Senin dilaksanakan Bulan Agustus.",
              "D. Upacara hari Senin dilaksanakan Bulan agustus."
            ],
            keyFaseBC: "a",
            explFaseBC: "Nama hari (Senin) dan nama bulan (Agustus) wajib diawali dengan huruf kapital."
          }
        ];
        const t = indEjaanTemplates[num % indEjaanTemplates.length];
        if (currentPhase === "Fase A") {
          stim = t.stimFaseA; qtext = t.qtextFaseA; opts = t.optsFaseA; key = t.keyFaseA; expl = t.explFaseA;
        } else {
          stim = t.stimFaseBC; qtext = t.qtextFaseBC; opts = t.optsFaseBC; key = t.keyFaseBC; expl = t.explFaseBC;
        }
      } else {
        const indCompTemplates = [
          {
            stimFaseA: `${nameA} suka membaca buku cerita. Setiap pagi, ia membaca buku di perpustakaan.`,
            qtextFaseA: `Di mana tempat ${nameA} membaca buku cerita?`,
            optsFaseA: ["A. Di perpustakaan", "B. Di kantin", "C. Di lapangan", "D. Di pasar"],
            keyFaseA: "a",
            explFaseA: "Sesuai teks, tempat membaca buku adalah di perpustakaan.",

            stimFaseBC: `Bacalah teks berikut! ${nameA} rajin merawat koleksi buku miliknya di rumah. Setiap hari Sabtu, ia membersihkan debu memakai kemoceng bulu ayam.`,
            qtextFaseBC: `Berdasarkan bacaan di atas, apa yang dilakukan oleh ${nameA} setiap hari Sabtu untuk merawat bukunya?`,
            optsFaseBC: [
              "A. Membersihkan debu yang menempel di sampul buku",
              "B. Membeli buku cerita bergambar baru di toko kota",
              "C. Menyimpan tumpukan buku di dalam kardus mainan",
              "D. Meminjamkan seluruh bukunya kepada tetangga dekat"
            ],
            keyFaseBC: "a",
            explFaseBC: "Informasi eksplisit di teks menyatakan ia membersihkan debu memakai kemoceng bulu ayam."
          },
          {
            stimFaseA: `${nameA} menyiram bunga di kebun. Daun bunga disiram supaya tidak layu.`,
            qtextFaseA: `Mengapa ${nameA} menyiram daun bunga?`,
            optsFaseA: ["A. Supaya tidak layu", "B. Supaya basah semua", "C. Agar cepat mati", "D. Karena mau bermain air"],
            keyFaseA: "a",
            explFaseA: "Bunga disiram agar tidak layu.",

            stimFaseBC: `Bacalah teks berikut! Setiap sore, ${nameA} menyiram tanaman cabai di teras rumah. Tanaman itu disiram secara teratur agar tumbuh subur dan lekas berbuah lebat untuk membantu ibu memasak.`,
            qtextFaseBC: `Apakah tujuan utama ${nameA} menyiram tanaman cabai tersebut secara teratur?`,
            optsFaseBC: [
              "A. Agar tanaman tumbuh subur dan lekas berbuah lebat",
              "B. Agar tanaman tidak terlalu tinggi menghalangi jalan",
              "C. Untuk mengisi waktu luang sepulang dari bermain",
              "D. Menghabiskan air bersih di wadah penyimpanan teras"
            ],
            keyFaseBC: "a",
            explFaseBC: "Tanaman disiram agar tumbuh subur dan berbuah lebat."
          },
          {
            stimFaseA: `${nameA} membuang sampah makanan di tempat sampah. Halaman pun jadi bersih.`,
            qtextFaseA: `Membuang sampah di tempat sampah membuat halaman menjadi...`,
            optsFaseA: ["A. Bersih", "B. Kotor", "C. Penuh lalat", "D. Bau"],
            keyFaseA: "a",
            explFaseA: "Membuang sampah membuat halaman bersih.",

            stimFaseBC: `Bacalah teks berikut! ${nameA} selalu membuang sisa bungkus jajanan ke dalam tong sampah. Hal ini menjaga agar lingkungan tetap bersih dan bebas dari genangan sarang nyamuk.`,
            qtextFaseBC: "Berdasarkan kutipan teks di atas, apakah manfaat utama dari kebiasaan membuang sampah pada tempatnya?",
            optsFaseBC: [
              "A. Lingkungan tetap bersih dan bebas dari sarang nyamuk",
              "B. Sampah menumpuk lebih cepat di tempat pembuangan",
              "C. Memperindah ruangan kelas dengan aneka bungkus warna-warni",
              "D. Murid terbebas dari tugas piket membersihkan kelas"
            ],
            keyFaseBC: "a",
            explFaseBC: "Membuang sampah menjaga kebersihan dan mencegah nyamuk bersarang."
          },
          {
            stimFaseA: `Bel sekolah berbunyi keras. Anak-anak berbaris rapi masuk ke kelas.`,
            qtextFaseA: `Apa yang dilakukan anak-anak setelah bel berbunyi?`,
            optsFaseA: ["A. Berbaris rapi masuk kelas", "B. Pulang ke rumah", "C. Membeli makanan", "D. Bermain bola"],
            keyFaseA: "a",
            explFaseA: "Setelah bel berbunyi, anak-anak berbaris rapi masuk kelas.",

            stimFaseBC: `Bacalah teks berikut! Sebelum masuk ke ruang kelas, para murid dibiasakan berbaris tertib. Ketika bel tanda masuk berbunyi, mereka melangkah masuk teratur sambil bersalaman dengan bapak dan ibu guru.`,
            qtextFaseBC: "Kapan para murid melangkah masuk kelas secara teratur berdasarkan teks tersebut?",
            optsFaseBC: [
              "A. Ketika bel tanda masuk sekolah berbunyi",
              "B. Saat jam istirahat sekolah telah selesai",
              "C. Sebelum bapak dan ibu guru tiba di sekolah",
              "D. Sewaktu hari sudah sore dan pintu sekolah ditutup"
            ],
            keyFaseBC: "a",
            explFaseBC: "Melangkah masuk teratur dilakukan ketika bel tanda masuk berbunyi."
          }
        ];
        const t = indCompTemplates[num % indCompTemplates.length];
        if (currentPhase === "Fase A") {
          stim = t.stimFaseA; qtext = t.qtextFaseA; opts = t.optsFaseA; key = t.keyFaseA; expl = t.explFaseA;
        } else {
          stim = t.stimFaseBC; qtext = t.qtextFaseBC; opts = t.optsFaseBC; key = t.keyFaseBC; expl = t.explFaseBC;
        }
      }
    }
    else if (subject.includes("Pancasila")) {
      if (topic.includes("Simbol") || topic.includes("Pancasila") || topic.includes("Lambang")) {
        const pancSimbolTemplates = [
          {
            stimFaseA: `Perisai burung Garuda mempunyai simbol sila pertama.`,
            qtextFaseA: `Apa lambang atau simbol dari sila kesatu Pancasila?`,
            optsFaseA: ["A. Bintang emas", "B. Rantai emas", "C. Pohon beringin", "D. Kepala banteng"],
            keyFaseA: "a",
            explFaseA: "Sila ke-1 dilambangkan dengan Bintang Emas.",

            stimFaseBC: `Di dinding kelas terpajang lambang negara Garuda Pancasila dengan perisai di dadanya.`,
            qtextFaseBC: "Apakah lambang yang mewakili sila kesatu Pancasila pada perisai burung Garuda?",
            optsFaseBC: ["A. Bintang emas di tengah perisai", "B. Rantai baja lingkaran di kanan bawah", "C. Pohon beringin rindang di kanan atas", "D. Kepala banteng hitam di kiri atas"],
            keyFaseBC: "a",
            explFaseBC: "Bintang emas merupakan lambang Sila ke-1 Pancasila (Ketuhanan Yang Maha Esa)."
          },
          {
            stimFaseA: `Sila kedua Pancasila dilambangkan pada perisai Garuda.`,
            qtextFaseA: `Apa lambang atau simbol sila kedua Pancasila?`,
            optsFaseA: ["A. Rantai emas", "B. Bintang emas", "C. Pohon beringin", "D. Kepala banteng"],
            keyFaseA: "a",
            explFaseA: "Sila ke-2 dilambangkan dengan Rantai Emas.",

            stimFaseBC: `Ketika upacara bendera, murid-murid melafalkan Pancasila secara lantang dan khidmat.`,
            qtextFaseBC: "Manakah lambang atau simbol dari sila kedua Pancasila pada perisai burung Garuda?",
            optsFaseBC: ["A. Rantai emas lingkaran", "B. Bintang emas bercahaya", "C. Pohon beringin rindang", "D. Kepala banteng hitam"],
            keyFaseBC: "a",
            explFaseBC: "Rantai emas melambangkan Sila ke-2 Pancasila (Kemanusiaan yang Adil dan Beradab)."
          },
          {
            stimFaseA: `Lambang Pancasila sila ketiga digambar di perisai.`,
            qtextFaseA: `Apa simbol dari sila ketiga Pancasila?`,
            optsFaseA: ["A. Pohon beringin", "B. Rantai emas", "C. Bintang emas", "D. Kepala banteng"],
            keyFaseA: "a",
            explFaseA: "Sila ke-3 dilambangkan dengan Pohon Beringin.",

            stimFaseBC: `${nameGuru} menunjukkan kartu gambar sila Pancasila kepada anak-anak saat belajar.`,
            qtextFaseBC: "Apakah lambang dari sila ketiga Pancasila yang melambangkan persatuan rakyat Indonesia?",
            optsFaseBC: ["A. Pohon beringin", "B. Rantai emas lingkaran", "C. Bintang emas bersudut lima", "D. Kepala banteng hitam"],
            keyFaseBC: "a",
            explFaseBC: "Pohon beringin melambangkan Sila ke-3 Pancasila (Persatuan Indonesia)."
          },
          {
            stimFaseA: `Sila keempat Pancasila digambarkan pada perisai Garuda.`,
            qtextFaseA: `Apa lambang sila keempat Pancasila?`,
            optsFaseA: ["A. Kepala banteng", "B. Bintang emas", "C. Rantai emas", "D. Pohon beringin"],
            keyFaseA: "a",
            explFaseA: "Sila ke-4 dilambangkan dengan Kepala Banteng.",

            stimFaseBC: `Dalam materi Pancasila, siswa mempelajari arti musyawarah untuk mufakat di sekolah.`,
            qtextFaseBC: "Apakah simbol dari sila keempat Pancasila pada lambang negara Garuda Pancasila?",
            optsFaseBC: ["A. Kepala banteng", "B. Bintang emas", "C. Rantai emas lingkaran", "D. Padi dan kapas"],
            keyFaseBC: "a",
            explFaseBC: "Kepala banteng melambangkan Sila ke-4 Pancasila (Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan)."
          },
          {
            stimFaseA: `Sila kelima Pancasila digambar pada perisai burung Garuda.`,
            qtextFaseA: `Apa simbol sila kelima Pancasila?`,
            optsFaseA: ["A. Padi dan kapas", "B. Kepala banteng", "C. Bintang emas", "D. Rantai emas"],
            keyFaseA: "a",
            explFaseA: "Sila ke-5 dilambangkan dengan Padi dan Kapas.",

            stimFaseBC: `Keadilan sosial dilambangkan dengan tanaman pangan dan sandang sandaran bangsa.`,
            qtextFaseBC: "Apakah lambang yang mewakili sila kelima Pancasila pada perisai Garuda Pancasila?",
            optsFaseBC: ["A. Padi dan kapas", "B. Kepala banteng hitam", "C. Rantai emas lingkaran", "D. Bintang emas"],
            keyFaseBC: "a",
            explFaseBC: "Padi dan kapas melambangkan Sila ke-5 Pancasila (Keadilan Sosial bagi Seluruh Rakyat Indonesia)."
          }
        ];
        const t = pancSimbolTemplates[num % pancSimbolTemplates.length];
        if (currentPhase === "Fase A") {
          stim = t.stimFaseA; qtext = t.qtextFaseA; opts = t.optsFaseA; key = t.keyFaseA; expl = t.explFaseA;
        } else {
          stim = t.stimFaseBC; qtext = t.qtextFaseBC; opts = t.optsFaseBC; key = t.keyFaseBC; expl = t.explFaseBC;
        }

        sc = `<svg viewBox="0 0 100 100" style="max-width: 100px; display: block; margin: 10px auto;">
          <rect x="10" y="10" width="80" height="80" rx="10" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
          <circle cx="50" cy="50" r="22" stroke="#b45309" stroke-width="5" fill="none"/>
          <text x="50" y="54" font-family="sans-serif" font-size="12" font-weight="black" text-anchor="middle" fill="#b45309">⛓️</text>
        </svg>`;
      } else {
        const pancMiscTemplates = [
          {
            stimFaseA: `Piket kelas bersama membuat kelas menjadi bersih dan rapi.`,
            qtextFaseA: `Piket kelas bersama teman mencerminkan sila Pancasila ke...`,
            optsFaseA: ["A. Sila ketiga", "B. Sila kesatu", "C. Sila kedua", "D. Sila keempat"],
            keyFaseA: "a",
            explFaseA: "Piket bersama menumbuhkan persatuan (Sila ke-3).",

            stimFaseBC: `Siswa-siswi selalu membiasakan gotong royong dan menjaga kebersamaan dalam persahabatan mereka di sekolah.`,
            qtextFaseBC: "Di bawah ini, manakah kegiatan yang mencerminkan pengamalan sila ketiga Pancasila (Persatuan Indonesia) ketika berada di sekolah?",
            optsFaseBC: [
              "A. Melaksanakan piket kerja bakti membersihkan kelas bersama teman-teman",
              "B. Memilih-milih teman bermain berdasarkan asal daerah atau warna kulit",
              "C. Mencontek hasil pekerjaan rumah milik teman dekat secara diam-diam",
              "D. Mengabaikan nasihat dari guru kelas ketika sedang dinasehati"
            ],
            keyFaseBC: "a",
            explFaseBC: "Kerja bakti piket kelas bersama mencerminkan persatuan dan gotong royong sila ke-3."
          },
          {
            stimFaseA: `Memilih ketua kelas dilakukan dengan cara berdiskusi bersama.`,
            qtextFaseA: `Berdiskusi memilih ketua kelas mencerminkan sila Pancasila ke...`,
            optsFaseA: ["A. Sila keempat", "B. Sila kesatu", "C. Sila kedua", "D. Sila ketiga"],
            keyFaseA: "a",
            explFaseA: "Diskusi bersama untuk keputusan bersama mencerminkan musyawarah sila ke-4.",

            stimFaseBC: `Setiap ada perbedaan pendapat dalam menentukan piket kelas, ${nameGuru} selalu mengajak para murid berkumpul mencari kesepakatan.`,
            qtextFaseBC: "Sikap bermusyawarah mufakat untuk kepentingan bersama tersebut merupakan contoh pengamalan Pancasila yaitu sila ke?",
            optsFaseBC: [
              "A. Sila keempat",
              "B. Sila kesatu",
              "C. Sila kedua",
              "D. Sila ketiga"
            ],
            keyFaseBC: "a",
            explFaseBC: "Musyawarah mufakat diatur dalam sila ke-4 Pancasila."
          },
          {
            stimFaseA: `Sebelum makan, ${nameA} membaca doa menurut agamanya.`,
            qtextFaseA: `Membaca doa sebelum makan mencerminkan sila Pancasila ke...`,
            optsFaseA: ["A. Sila kesatu", "B. Sila kedua", "C. Sila ketiga", "D. Sila kelima"],
            keyFaseA: "a",
            explFaseA: "Berdoa mencerminkan ketuhanan sila ke-1.",

            stimFaseBC: `Di ${sekolah}, para murid memiliki latar belakang agama berbeda-beda namun tetap hidup rukun berdampingan.`,
            qtextFaseBC: "Sikap saling menghormati dan memberi kesempatan kepada teman berbeda agama untuk beribadah mencerminkan sila?",
            optsFaseBC: [
              "A. Sila kesatu",
              "B. Sila kedua",
              "C. Sila ketiga",
              "D. Sila kelima"
            ],
            keyFaseBC: "a",
            explFaseBC: "Toleransi beragama adalah perwujudan sila ke-1 Pancasila."
          },
          {
            stimFaseA: `${nameA} membagi bekal kue secara adil kepada teman sebangkunya.`,
            qtextFaseA: `Sikap membagi kue secara adil di kelas mencerminkan sila Pancasila ke...`,
            optsFaseA: ["A. Sila kelima", "B. Sila kesatu", "C. Sila kedua", "D. Sila ketiga"],
            keyFaseA: "a",
            explFaseA: "Sikap adil mencerminkan sila ke-5.",

            stimFaseBC: `Dalam kerja kelompok, ${nameA} membagi tugas secara adil kepada seluruh anggota tanpa membeda-bedakan.`,
            qtextFaseBC: "Tindakan membagi tugas secara adil kepada seluruh anggota kelompok mencerminkan sila Pancasila ke?",
            optsFaseBC: [
              "A. Sila kelima",
              "B. Sila kesatu",
              "C. Sila kedua",
              "D. Sila ketiga"
            ],
            keyFaseBC: "a",
            explFaseBC: "Berlaku adil kepada sesama teman merupakan wujud sila ke-5."
          }
        ];
        const t = pancMiscTemplates[num % pancMiscTemplates.length];
        if (currentPhase === "Fase A") {
          stim = t.stimFaseA; qtext = t.qtextFaseA; opts = t.optsFaseA; key = t.keyFaseA; expl = t.explFaseA;
        } else {
          stim = t.stimFaseBC; qtext = t.qtextFaseBC; opts = t.optsFaseBC; key = t.keyFaseBC; expl = t.explFaseBC;
        }
      }
    }
    else if (subject.includes("IPAS")) {
      if (topic.includes("Wujud") || topic.includes("Zat") || topic.includes("Suhu")) {
        const ipasWujudTemplates = [
          {
            stimFaseA: `Air panas di panci mengeluarkan asap putih. Air itu dipanaskan.`,
            qtextFaseA: `Perubahan dari air cair menjadi uap gas disebut...`,
            optsFaseA: ["A. Menguap", "B. Mencair", "C. Membeku", "D. Mengembun"],
            keyFaseA: "a",
            explFaseA: "Air cair menjadi gas uap air dinamakan menguap.",

            stimFaseBC: `Ketika air mendidih di dalam panci panas, air berubah wujud menjadi uap air.`,
            qtextFaseBC: "Apakah sebutan untuk proses perubahan wujud zat dari cair menjadi benda gas seperti peristiwa tersebut?",
            optsFaseBC: ["A. Menguap", "B. Mencair", "C. Membeku", "D. Mengembun"],
            keyFaseBC: "a",
            explFaseBC: "Perubahan wujud zat dari cair ke gas disebut menguap."
          },
          {
            stimFaseA: `Es batu ditaruh di tempat terbuka menjadi air.`,
            qtextFaseA: `Perubahan dari es padat menjadi air cair disebut...`,
            optsFaseA: ["A. Mencair", "B. Membeku", "C. Menguap", "D. Mengembun"],
            keyFaseA: "a",
            explFaseA: "Padat ke cair disebut mencair.",

            stimFaseBC: `Es batu diletakkan di tempat terbuka di bawah terik matahari lama-kelamaan menjadi air cair kembali.`,
            qtextFaseBC: "Proses perubahan wujud dari padat menjadi cair ini dinamakan?",
            optsFaseBC: ["A. Mencair", "B. Membeku", "C. Menguap", "D. Mengembun"],
            keyFaseBC: "a",
            explFaseBC: "Perubahan wujud dari padat ke cair adalah mencair."
          },
          {
            stimFaseA: `Air dingin dimasukkan ke dalam kulkas membeku jadi es.`,
            qtextFaseA: `Perubahan air cair menjadi es padat disebut...`,
            optsFaseA: ["A. Membeku", "B. Mencair", "C. Menguap", "D. Mengembun"],
            keyFaseA: "a",
            explFaseA: "Cair ke padat disebut membeku.",

            stimFaseBC: `Air dalam wadah plastik dimasukkan ke dalam ruang pembekuan (freezer) lemari es hingga mengeras.`,
            qtextFaseBC: "Perubahan wujud zat dari cair menjadi padat ini disebut dengan istilah?",
            optsFaseBC: ["A. Membeku", "B. Mencair", "C. Menguap", "D. Mengembun"],
            keyFaseBC: "a",
            explFaseBC: "Cair ke padat dinamakan membeku."
          },
          {
            stimFaseA: `Daun basah di pagi hari karena ada embun air.`,
            qtextFaseA: `Munculnya titik air di daun pada pagi hari disebut...`,
            optsFaseA: ["A. Mengembun", "B. Menguap", "C. Mencair", "D. Membeku"],
            keyFaseA: "a",
            explFaseA: "Gas udara malam berubah jadi titik air disebut mengembun.",

            stimFaseBC: `Pada pagi hari yang cerah, terdapat titik-titik air di atas permukaan daun pohon kelapa.`,
            qtextFaseBC: "Peristiwa terbentuknya titik air dari uap udara malam tersebut dinamakan?",
            optsFaseBC: ["A. Mengembun", "B. Menguap", "C. Mencair", "D. Menyublim"],
            keyFaseBC: "a",
            explFaseBC: "Perubahan gas uap menjadi cair disebut mengembun."
          }
        ];
        const t = ipasWujudTemplates[num % ipasWujudTemplates.length];
        if (currentPhase === "Fase A") {
          stim = t.stimFaseA; qtext = t.qtextFaseA; opts = t.optsFaseA; key = t.keyFaseA; expl = t.explFaseA;
        } else {
          stim = t.stimFaseBC; qtext = t.qtextFaseBC; opts = t.optsFaseBC; key = t.keyFaseBC; expl = t.explFaseBC;
        }
      }
      else if (topic.includes("Tubuh") || topic.includes("Fotosintesis") || topic.includes("Organ")) {
        const ipasOrganTemplates = [
          {
            stimFaseA: `Tumbuhan menyerap air dari dalam tanah menggunakan bagian bawahnya.`,
            qtextFaseA: `Bagian tumbuhan di dalam tanah yang menyerap air adalah...`,
            optsFaseA: ["A. Akar", "B. Daun", "C. Batang", "D. Bunga"],
            keyFaseA: "a",
            explFaseA: "Akar berfungsi menyerap air di tanah.",

            stimFaseBC: `Dalam pelajaran Sains, para murid mengamati struktur tumbuhan di halaman sekolah.`,
            qtextFaseBC: "Manakah bagian tubuh tumbuhan yang memiliki fungsi utama untuk menyerap air dan unsur hara di dalam tanah?",
            optsFaseBC: ["A. Akar", "B. Daun hijau", "C. Batang kayu", "D. Bunga hias"],
            keyFaseBC: "a",
            explFaseBC: "Akar menyerap air dan unsur hara dari tanah ke seluruh bagian tumbuhan."
          },
          {
            stimFaseA: `Tumbuhan memasak makanannya di daun berwarna hijau.`,
            qtextFaseA: `Tempat tumbuhan memasak makanan sendiri disebut...`,
            optsFaseA: ["A. Daun", "B. Akar", "C. Batang", "D. Biji"],
            keyFaseA: "a",
            explFaseA: "Fotosintesis terjadi di daun.",

            stimFaseBC: `Tumbuhan hijau membuat zat makanan sendiri dengan bantuan sinar matahari.`,
            qtextFaseBC: "Bagian tubuh tumbuhan manakah yang berfungsi sebagai tempat fotosintesis terjadi?",
            optsFaseBC: ["A. Daun", "B. Akar serabut", "C. Batang kayu", "D. Biji buah"],
            keyFaseBC: "a",
            explFaseBC: "Fotosintesis utamanya berlangsung di daun karena mengandung klorofil."
          },
          {
            stimFaseA: `Batang tumbuhan menyalurkan air dari akar ke daun.`,
            qtextFaseA: `Bagian tumbuhan yang mengalirkan air ke daun adalah...`,
            optsFaseA: ["A. Batang", "B. Akar", "C. Daun", "D. Bunga"],
            keyFaseA: "a",
            explFaseA: "Batang menyalurkan air dari bawah ke atas.",

            stimFaseBC: `Air dari dalam tanah diangkut naik menuju ke daun untuk proses fotosintesis.`,
            qtextFaseBC: "Organ tumbuhan manakah yang berfungsi sebagai saluran pengangkut air dari akar ke daun?",
            optsFaseBC: ["A. Batang", "B. Daun", "C. Bunga", "D. Buah"],
            keyFaseBC: "a",
            explFaseBC: "Batang mengangkut air dan mineral dari akar menuju daun."
          },
          {
            stimFaseA: `Bunga pada tumbuhan akan berubah menjadi biji baru.`,
            qtextFaseA: `Bagian tumbuhan yang berfungsi untuk perkembangbiakan adalah...`,
            optsFaseA: ["A. Bunga", "B. Akar", "C. Batang", "D. Daun"],
            keyFaseA: "a",
            explFaseA: "Bunga adalah alat perkembangbiakan tumbuhan generatif.",

            stimFaseBC: `Tumbuhan menghasilkan biji agar kelestariannya di alam bebas tetap terjaga.`,
            qtextFaseBC: "Bagian tumbuhan manakah yang berfungsi utama sebagai alat perkembangbiakan generatif?",
            optsFaseBC: ["A. Bunga", "B. Akar", "C. Batang", "D. Daun"],
            keyFaseBC: "a",
            explFaseBC: "Bunga mengandung benang sari dan putik untuk pembuahan generatif."
          }
        ];
        const t = ipasOrganTemplates[num % ipasOrganTemplates.length];
        if (currentPhase === "Fase A") {
          stim = t.stimFaseA; qtext = t.qtextFaseA; opts = t.optsFaseA; key = t.keyFaseA; expl = t.explFaseA;
        } else {
          stim = t.stimFaseBC; qtext = t.qtextFaseBC; opts = t.optsFaseBC; key = t.keyFaseBC; expl = t.explFaseBC;
        }

        sc = `<svg viewBox="0 0 100 100" style="max-width: 100px; display: block; margin: 10px auto;">
          <rect x="45" y="10" width="10" height="60" fill="#a16207"/>
          <circle cx="50" cy="25" r="20" fill="#15803d"/>
          <path d="M 50 70 Q 30 80 15 90 M 50 75 Q 40 85 30 95 M 50 70 Q 70 80 85 90 M 50 75 Q 60 85 70 95" stroke="#78350f" stroke-width="2.5" fill="none"/>
          <text x="80" y="80" font-family="sans-serif" font-size="8" fill="#78350f" font-weight="bold">Akar</text>
        </svg>`;
      }
      else {
        const ipasMiscTemplates = [
          {
            stimFaseA: `Tumbuhan hijau mendapat tenaga langsung dari sinar matahari.`,
            qtextFaseA: `Makhluk hidup yang membuat makanannya sendiri disebut...`,
            optsFaseA: ["A. Produsen", "B. Konsumen", "C. Pengurai", "D. Pemangsa"],
            keyFaseA: "a",
            explFaseA: "Produsen membuat makanannya sendiri.",

            stimFaseBC: `Dalam rantai makanan ekosistem sawah, padi merupakan tumbuhan hijau yang memproduksi zat makanan.`,
            qtextFaseBC: "Disebut apakah kedudukan makhluk hidup yang mampu membuat zat makanannya sendiri?",
            optsFaseBC: ["A. Produsen", "B. Konsumen tingkat I", "C. Konsumen tingkat II", "D. Pengurai"],
            keyFaseBC: "a",
            explFaseBC: "Tumbuhan memproduksi makanan sendiri sehingga disebut produsen."
          },
          {
            stimFaseA: `Sepeda ditekan remnya sehingga rodanya berhenti meluncur.`,
            qtextFaseA: `Gaya yang membuat roda sepeda berhenti meluncur adalah gaya...`,
            optsFaseA: ["A. Gaya gesek", "B. Gaya magnet", "C. Gaya listrik", "D. Gaya gravitasi"],
            keyFaseA: "a",
            explFaseA: "Karet rem bergesekan dengan roda menimbulkan gaya gesek.",

            stimFaseBC: `${nameA} mengendarai sepeda lalu menekan tuas rem hingga sepedanya berhenti.`,
            qtextFaseBC: "Gaya apakah yang bekerja menahan laju roda sepeda ketika karet rem bergesekan dengan roda?",
            optsFaseBC: ["A. Gaya gesek", "B. Gaya magnet", "C. Gaya gravitasi bumi", "D. Gaya pegas karet"],
            keyFaseBC: "a",
            explFaseBC: "Gaya gesek timbul dari dua permukaan benda yang saling bersentuhan menghambat gerak."
          },
          {
            stimFaseA: `Buah kelapa jatuh dari pohon tinggi langsung ke tanah.`,
            qtextFaseA: `Buah kelapa jatuh ke tanah karena tarikan gaya...`,
            optsFaseA: ["A. Gaya gravitasi", "B. Gaya magnet", "C. Gaya gesek", "D. Gaya otot"],
            keyFaseA: "a",
            explFaseA: "Gravitasi bumi menarik semua benda ke bawah.",

            stimFaseBC: `Buah mangga yang matang jatuh dari tangkai pohonnya langsung menuju ke permukaan tanah.`,
            qtextFaseBC: "Gaya tarik dari bumi manakah yang menyebabkan buah mangga jatuh ke bawah?",
            optsFaseBC: ["A. Gaya gravitasi bumi", "B. Gaya magnet bumi", "C. Gaya gesek udara", "D. Gaya pegas dahan"],
            keyFaseBC: "a",
            explFaseBC: "Gaya gravitasi menarik objek bermassa menuju pusat bumi."
          },
          {
            stimFaseA: `Ular memakan tikus di sawah paman agar padi aman.`,
            qtextFaseA: `Dalam rantai makanan di sawah, ular berperan sebagai...`,
            optsFaseA: ["A. Konsumen", "B. Produsen", "C. Pengurai", "D. Tumbuhan"],
            keyFaseA: "a",
            explFaseA: "Ular memakan hewan lain (tikus), maka ular berkedudukan sebagai konsumen.",

            stimFaseBC: `Tikus memakan padi di sawah, kemudian tikus dimangsa oleh ular sawah.`,
            qtextFaseBC: "Berdasarkan rantai makanan tersebut, apakah kedudukan ular sawah?",
            optsFaseBC: ["A. Konsumen tingkat II", "B. Produsen utama", "C. Konsumen tingkat I", "D. Pengurai (dekomposer)"],
            keyFaseBC: "a",
            explFaseBC: "Ular memakan tikus (konsumen I), sehingga ular bertindak sebagai konsumen tingkat II."
          }
        ];
        const t = ipasMiscTemplates[num % ipasMiscTemplates.length];
        if (currentPhase === "Fase A") {
          stim = t.stimFaseA; qtext = t.qtextFaseA; opts = t.optsFaseA; key = t.keyFaseA; expl = t.explFaseA;
        } else {
          stim = t.stimFaseBC; qtext = t.qtextFaseBC; opts = t.optsFaseBC; key = t.keyFaseBC; expl = t.explFaseBC;
        }
      }
    }
    else if (subject.includes("Agama")) {
      const agamaTemplates = [
        {
          stimFaseA: `Kita harus jujur kepada guru dan teman di sekolah.`,
          qtextFaseA: `Manakah contoh sikap jujur dan terpuji di ruang kelas?`,
          optsFaseA: ["A. Berkata yang benar kepada guru", "B. Berbohong kepada teman", "C. Menyembunyikan pensil teman", "D. Mencontek saat ulangan"],
          keyFaseA: "a",
          explFaseA: "Berkata benar adalah perilaku jujur.",

          stimFaseBC: `Pendidikan agama mengajarkan para murid untuk selalu membiasakan sikap jujur dalam setiap ucapan dan perbuatan.`,
          qtextFaseBC: "Manakah tindakan di sekolah yang mencerminkan sikap jujur dan amanah?",
          optsFaseBC: [
            "A. Mengakui kesalahan secara terbuka dan meminta maaf",
            "B. Menyembunyikan buku tulis teman sekelas yang terjatuh",
            "C. Menyalin jawaban ujian milik teman di sebelahnya",
            "D. Menyalahkan orang lain agar terhindar dari hukuman kelas"
          ],
          keyFaseBC: "a",
          explFaseBC: "Mengakui kesalahan dengan lapang dada adalah wujud konkret kejujuran."
        },
        {
          stimFaseA: `Semua teman harus diajak bermain bersama dengan rukun.`,
          qtextFaseA: `Sikap rukun dan terpuji dengan teman bermain adalah...`,
          optsFaseA: ["A. Mau berteman dengan siapa saja", "B. Memilih teman yang kaya saja", "C. Marah saat kalah bermain", "D. Mengajak teman bertengkar"],
          keyFaseA: "a",
          explFaseA: "Sikap ramah dan mau bermain dengan siapa saja menjaga kerukunan.",

          stimFaseBC: `Saat pelajaran Agama, siswa diajarkan membiasakan perilaku rendah hati dan saling mengasihi.`,
          qtextFaseBC: "Di bawah ini, manakah contoh sikap rendah hati yang patut dipraktikkan?",
          optsFaseBC: [
            "A. Mau berteman dengan siapa saja tanpa membeda-bedakan",
            "B. Memamerkan barang mewah baru dengan nada sombong",
            "C. Memotong perkataan teman ketika sedang berdiskusi",
            "D. Menyimpan amarah saat dinasihati bapak ibu guru"
          ],
          keyFaseBC: "a",
          explFaseBC: "Rendah hati ditunjukkan dengan mau berteman tulus tanpa memandang perbedaan derajat."
        },
        {
          stimFaseA: `Kita wajib membantu ibu dan ayah merapikan rumah.`,
          qtextFaseA: `Cara menghormati orang tua di rumah yang benar adalah...`,
          optsFaseA: ["A. Membantu pekerjaan rumah secara ikhlas", "B. Bermain game saat ibu memanggil", "C. Membangkang perintah ayah", "D. Berteriak meminta uang jajan"],
          keyFaseA: "a",
          explFaseA: "Membantu orang tua merupakan kewajiban luhur anak.",

          stimFaseBC: `Menghormati orang tua dan mendengarkan nasihat baiknya merupakan ajaran mulia dalam semua agama.`,
          qtextFaseBC: "Manakah tindakan seorang anak yang paling berbakti kepada orang tuanya?",
          optsFaseBC: [
            "A. Membantu meringankan pekerjaan rumah tangga dengan sukarela",
            "B. Mengabaikan perintah orang tua saat asyik bermain gawai",
            "C. Menuntut uang saku harian secara berlebihan",
            "D. Berbicara dengan nada tinggi dan ketus kepada ibu"
          ],
          keyFaseBC: "a",
          explFaseBC: "Meringankan beban orang tua dengan tulus adalah wujud konkret bakti anak."
        },
        {
          stimFaseA: `Membantu teman yang jatuh di halaman adalah perbuatan baik.`,
          qtextFaseA: `Sikap membantu teman yang jatuh merupakan contoh perilaku...`,
          optsFaseA: ["A. Tolong-menolong", "B. Sombong", "C. Acuh tak acuh", "D. Pilih kasih"],
          keyFaseA: "a",
          explFaseA: "Menolong orang yang kesulitan adalah bentuk tolong-menolong.",

          stimFaseBC: `Di ${sekolah}, ${nameA} melihat teman kelasnya terjatuh terpeleset di lapangan sekolah.`,
          qtextFaseBC: "Apakah tindakan terbaik yang mencerminkan sikap tolong-menolong antarsiswa?",
          optsFaseBC: [
            "A. Segera membantu teman tersebut berdiri dan mengantarnya ke UKS",
            "B. Menertawakan teman tersebut bersama dengan siswa lainnya",
            "C. Mengabaikan kejadian itu dan terus berjalan ke kantin",
            "D. Menyalahkan teman tersebut karena tidak berhati-hati melangkah"
          ],
          keyFaseBC: "a",
          explFaseBC: "Segera menolong teman yang kesakitan menunjukkan kepedulian sosial yang diajarkan agama."
        }
      ];
      const t = agamaTemplates[num % agamaTemplates.length];
      if (currentPhase === "Fase A") {
        stim = t.stimFaseA; qtext = t.qtextFaseA; opts = t.optsFaseA; key = t.keyFaseA; expl = t.explFaseA;
      } else {
        stim = t.stimFaseBC; qtext = t.qtextFaseBC; opts = t.optsFaseBC; key = t.keyFaseBC; expl = t.explFaseBC;
      }
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
    } else if (type === "Pilihan Ganda Kompleks" || type === "Menjodohkan") {
      const generated = getComplexAndMatchingContent(subject, topic, num, stim, qtext, opts, key, expl, schoolInfo);
      finalOptions = generated.finalOptions;
      finalPairs = generated.finalPairs;
      key = generated.answerKeyPGK;
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
      answerKey: type === "Pilihan Ganda" ? key : (type === "Pilihan Ganda Kompleks" ? key : "Sesuai pasangan yang benar"),
      alternativeAnswers: type === "Pilihan Ganda" ? [] : ["Alternatif jawaban logis sesuai kurikulum"],
      explanation: expl,
      svgContent: "",
      imageUrl: ""
    });
  }

  return questions;
}
