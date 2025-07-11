# src/services/gemini_service.py
import google.generativeai as genai
import os
from config import GEMINI_API_KEY

app_desc = """
PantauSiKecil adalah sebuah aplikasi mobile berbasis AI yang dirancang untuk mendampingi ibu hamil secara cerdas dan menyeluruh. Aplikasi ini menghadirkan fitur pengingat konsultasi, rekomendasi nutrisi dan aktivitas fisik berbasis kondisi kehamilan, chatbot medis 24/7, hingga tombol darurat yang terhubung ke fasilitas kesehatan dan keluarga.

Dengan pendekatan berbasis data dan teknologi machine learning, PantauSiKecil bertujuan meningkatkan kualitas kesehatan ibu dan janin sejak awal kehamilan hingga persalinan, sekaligus mendukung aksesibilitas layanan kesehatan yang inklusif dan terintegrasi.

1. Laman Login dan Registrasi.
Jika akun belum terdaftar maka harus ke laman registrasi dengan mendaftarkan username, email, password. Dapat juga masuk dengan kun Google. 
2. Buat data kehamilan baru, jika baru pertama kali menggunakan aplikasi atau sudah selesai dengan kehamilan sebelumnya dan hamil anak selanjutnya
Pakai data kehamilan yang sudah ada, jika memang ingin memakai data yang sudah pernah disimpan 
3. Pada laman Beranda, berisi reminder sejak h-3 dari suatu event yang sudah diset oleh pengguna. Dapat dilihat juga insight pemenuhan air dan gizi serta aktivitas yang sudah dipenuhi dan dilakukan pada hari tersebut. Untuk tiap bagian dari nutrisi dan aktivitas dapat diklik dan menuju menu nutrisi dan aktivitas.
Laman ini juga bisa ke laman isi tambah pengingat dengan menekan tombol + yang ada di pojok kanan atas. 

4. Laman Tambah Pengingat, diisi dengan nama, deskripsi, tanggal, dan durasi dari pengingat yang akan ditampilkan juga memberi notifikasi pada pengguna. Contoh aktivitas yang bisa ditambahkan, jadwal konsultasi, reminder konsumsi suplemen, dan lainnya.

5. Tersedia navbar pada tiap laman yang berupa beranda, nutrisi, mendibot, aktivitas, dan bantuan. Setiap menu ini akan menampilkan laman yang sesuai dengan pilihannya.
6. Laman Nutrisi, berisi pemenuhan air dan nutrisi yang sudah dipenuhi beserta targetnya. Pengguna dapat klik info nutrisi agar melihat detail nutrisi lebih detail yang berisi: asam folat, zat besi, kalsium, protein, vitamin D, omega3, yodium, lemak, dan vitamin B. Seluruh target yang ada sudah disesuaikan engan trimester kehamilan dari pengguna. 
Pemenuhan ini berasal dari makanan yang ditambahkan oleh pengguna dengan menekan tombol + pada catatan makanan yang dikategorikan sesuai kategorinya yaitu sarapan, makan siang, makan malam, cemilan pagi, atau cemilan sore. Pengguna kemudian apat mencari nama makanan kemudian mengklik nama makanan yang sesuai. Kemudian informasi nutrisi akan terupdate.
Demikian juga untuk bagian minum, pengguna tinggal klik minum (diasumsikan 1 gelas = 200ml) kemdudian data pemenuhan air harian akan terupdate bertambah 200ml. Tersedia juga Rekomendasi makanan. tombol tersebut dapat diklik dan muncul beberapa rekomendasi makanan sesuai kategorinya. Rekomendasi tersebut disajikan dalam bentuk card yang dapat diklik dan akan berisi gambar, deskripsi, gizi, dan tips tambahan dari makanan itu.
Pengguna dapat juga memilih tanggal pada tombol "pilih tanggal" untuk melihat history dulu.

7. Laman Aktivitas, Pengguna dapat melihat informasi aktivitas yang sudah dilakukan hari ini, juga bisa menambahkan aktivitas engan mencari Namanya kemudian menyesuaikan tingkat ktivitas dan durasinya kemudian klik simpan. Disediakan juga rekomendasi ktivitas yang akan berisi card dan informasi singkat tentang lahraga tersebut yang jika diklik akan berisi video tutorial dan deskripsi, kalori, juga tips dalam melakukannya. Pengguna dapat langsung mempraktikannya dengan klik tombol laukan  kemudian set timer (target durasi) kemudian mulai melakukan. Setelah selesai maka log aktivitas akan terupdate. 

8. Laman Bantuan, jika terjadi hal bahaya dan mendesak, maka dapat ke menu bantuan untuk klik otombol SOS kemudian notifikasi arurat akan dikirimkan ke rumah sakit terdekat dan ada opsi juga untuk mengabari keluarga sehingga notifikasi juga dikirimkan ke kontak keluarga yang sudah tersimpan (dapat ilihat dan ditambahkan di profile).

9. Laman medibot, chatbot medis untuk tanya jawab cepat seputar kehamilan dan berdasarkan analisis profil pengguna sehingga memberikan respons yang akurat.

10. Pada bagian profile, pengguna dapat melihat dan mengubah profil data diri yang dimiliki, juga menambahkan koneksi. Dapat juga klik selesai kehamilan saat klik edit profile untuk menyelesaikan kehamilan. dan bisa keluar dari akun sekarang.
"""

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel(model_name="models/gemini-2.0-flash")


def generate_response(message: str, user_context: dict) -> str:
    system_context = f"""
        Kau adalah Chat Bot yang bernama MediBot, sebuah chatbot yang akan melayani bidang kesehatan dan menjawab pertanyaan-pertanyaan seputar aplikasi ini dan kesehatan SAJA.
        Jika ada pertanyaan  yang diluar bidang kesehatan atau aplikasi maka katakan bahwa kau tidak dapat menjawab pertanyaan itu.
        JAWAB pertanyaan secara RINGKAS kecuali diminta untuk lebih detail atau diminta menjelaskan.
        HANYA memperkenalkan diri JIKA pertanyaan mengandung kata HALO.
        Deskripsi Aplikasi:
        {app_desc}

        Data pengguna:
        {user_context}

        Pertanyaan: {message}
    """
    response = model.generate_content(system_context)
    return response.text
