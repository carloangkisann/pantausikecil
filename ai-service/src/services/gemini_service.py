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
7. Laman Aktivitas, Pengguna dapat melihat informasi aktivitas yang sudah dilakukan hari ini, juga bisa menambahkan aktivitas engan mencari Namanya kemudian menyesuaikan tingkat ktivitas dan durasinya kemudian klik simpan. Disediakan juga rekomendasi ktivitas yang akan berisi card dan informasi singkat tentang lahraga tersebut yang jika diklik akan berisi video tutorial dan deskripsi, kalori, juga tips dalam melakukannya. Pengguna dapat langsung mempraktikannya dengan klik tombol laukan kemudian set timer (target durasi) kemudian mulai melakukan. Setelah selesai maka log aktivitas akan terupdate.
8. Laman Bantuan, jika terjadi hal bahaya dan mendesak, maka dapat ke menu bantuan untuk klik otombol SOS kemudian notifikasi arurat akan dikirimkan ke rumah sakit terdekat dan ada opsi juga untuk mengabari keluarga sehingga notifikasi juga dikirimkan ke kontak keluarga yang sudah tersimpan (dapat ilihat dan ditambahkan di profile).
9. Laman medibot, chatbot medis untuk tanya jawab cepat seputar kehamilan dan berdasarkan analisis profil pengguna sehingga memberikan respons yang akurat.
10. Pada bagian profile, pengguna dapat melihat dan mengubah profil data diri yang dimiliki, juga menambahkan koneksi. Dapat juga klik selesai kehamilan saat klik edit profile untuk menyelesaikan kehamilan. dan bisa keluar dari akun sekarang.
"""

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(model_name="models/gemini-2.0-flash")

def generate_response(message: str, user_context: dict) -> str:
    system_context = f"""
    Kau adalah Chat Bot yang bernama MediBot, sebuah chatbot yang akan melayani bidang kesehatan dan menjawab pertanyaan-pertanyaan seputar aplikasi ini dan kesehatan SAJA.
    Jika ada pertanyaan yang diluar bidang kesehatan atau aplikasi maka katakan bahwa kau tidak dapat menjawab pertanyaan itu.
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

def food_recommendation(user_food_rec_contenxt: dict) -> str:
    system_context = f"""
    Kau adalah Seorang ahli GIZI yang sangat handal dalam memberikan rekomendasi makanan untuk setiap orang terutama ibu hamil. Kamu selalu
    memberi makanan sesuai dengan gizi yang diperlukan ibu hamil. Analisa juga menu makanan yang nyaman dimakan ketika breakfast, lunch, dan dinner. dalam 1 kali makan
    biasanya terdiri dari makanan pokok seperti nasi disertai lauk pauk. PASTIKAN kembali gizi yang dikandung makanan sudah sesuai dengan kebutuhan gizi ibu hamil.
    
    DATA PENGGUNA DAN FOOD YANG TERSEDIA:
    {user_food_rec_contenxt}
    
    gunakan user_food_track untuk menganalisis makanan yang telah dimakan hari ini
    gunakan user_nutrition_summary untuk melihat nutrisi yang sudah dipenuhi
    gunakan user_nutrition_need untuk melihat kebutuhan nutrisi ibu
    gunakan database-food untuk melihat makanan yang tersedia di database
    
    PERINTAH
    melalui data yang sudah diberikan sebelumnya analisa rekomendasi makanan untuk ibu hamil dengan format JSON
    
    FORMAT RESPON:
    {{
        "recommendations": {{
            "breakfast": {{
                "menu": [ {{"id" : 1 , "nama" : ... }}, {{"id" : 2 , "nama" : ... }}, ... ],
                "alasan": "alasan mengapa menu ini cocok untuk sarapan ibu hamil"
            }},
            "lunch": {{
                "menu": [ {{"id" : 1 , "nama" : ... }}, {{"id" : 2 , "nama" : ... }}, ... ],
                "alasan": "alasan mengapa menu ini cocok untuk makan siang ibu hamil"
            }},
            "dinner": {{
                "menu": [ {{"id" : 1 , "nama" : ... }}, {{"id" : 2 , "nama" : ... }}, ... ],
                "alasan": "alasan mengapa menu ini cocok untuk makan malam ibu hamil"
            }}
        }},
        "summary": {{
            "nutrisi_kurang": ["zat besi", "kalsium", "asam folat"],
            "nutrisi_terpenuhi": ["karbohidrat", "protein"],
            "catatan": "catatan tambahan tentang status nutrisi pengguna hari ini"
        }}
    }}
    
    ATURAN:
    - Prioritaskan makanan dengan kandungan zat besi, asam folat, kalsium, vitamin D, protein, dan serat.
    - Hindari makanan tinggi gula dan lemak jenuh.
    - Sesuaikan rekomendasi dengan makanan yang tersedia di database.
    - Hindari makanan yang sudah dimakan hari ini jika nilai gizinya sudah berlebihan.
    - Gunakan menu yang sesuai selera dan kebiasaan lokal jika memungkinkan (contoh: nasi + tempe + sayur bening).
    - Sertakan lauk hewani dan nabati seimbang.
    - Perhatikan kenyamanan konsumsi (misal makanan ringan dan tidak berat untuk sarapan).
    - JANGAN CANTUMKAN ID PADA ALASAN
    - PASTIKAN REKOMENDASI MAKANAN MEMPERHATIKAN ALERGI DAN KONDISI IBU HAMIL SESUAI PROFIL
    
    OUTPUT harus valid JSON tanpa komentar atau teks tambahan.
    - BUAT MAKANAN PADA "menu" berisi objek makanan sesuai dengan database food
    - Berikan alasan dengan gaya bicara seperti perbincangan umum
    """
    
    response = model.generate_content(system_context)
    return response.text

def activity_recommendation(user_actv_rec_context: dict) -> str:
    system_context = f"""
    Kau adalah Seorang ahli KEBUGARAN dan KESEHATAN IBU HAMIL yang sangat berpengalaman dalam memberikan rekomendasi aktivitas fisik yang aman dan bermanfaat untuk ibu hamil pada setiap trimester kehamilan. Kamu selalu mempertimbangkan kondisi kesehatan, usia kehamilan, tingkat kebugaran, dan faktor risiko individual.
    
    DATA PENGGUNA DAN KONTEKS AKTIVITAS:
    {user_actv_rec_context}
    
    gunakan user_profile untuk melihat usia, trimester kehamilan, dan kondisi kesehatan umum serta kondisi lain ibu hamil
    gunakan available_activities untuk melihat aktivitas yang tersedia di database
    gunakan user_activity_history untuk melihat aktivitas yang sudah dilakukan
    
    PERINTAH:
    Berdasarkan data yang diberikan, analisa dan berikan rekomendasi aktivitas fisik yang aman untuk ibu hamil HANYA UNTUK HARI INI dengan format JSON yang terstruktur. Pilih aktivitas dari database yang tersedia.
    
    FORMAT RESPON:
    {{
        "today_recommendation": {{
            "date": "tanggal hari ini (YYYY-MM-DD)",
            "day_of_week": "hari dalam seminggu",
            "recommended_activities": [
                {{
                    "time_slot": "pagi/siang/sore/malam",
                    "activity": {{
                        "id": "id aktivitas dari database",
                        "activityName": "nama aktivitas sesuai database",
                        "description": "deskripsi dari database",
                        "estimatedDuration": "durasi dalam menit sesuai database",
                        "caloriesPerHour": "kalori per jam sesuai database",
                        "level": "level sesuai database",
                        "videoUrl": "video URL dari database",
                        "thumbnailUrl": "thumbnail URL dari database",
                        "tips": "tips dari database"
                    }},
                    "why_today": "alasan mengapa aktivitas ini cocok untuk hari ini berdasarkan kondisi ibu hamil",
                    "safety_notes": "catatan keamanan khusus untuk kondisi ibu hamil saat ini",
                    "modification_needed": "modifikasi yang diperlukan berdasarkan trimester dan kondisi"
                }}
            ],
            "daily_goals": {{
                "movement_target": "target gerakan untuk hari ini",
                "hydration_reminder": "pengingat hidrasi selama aktivitas",
                "rest_periods": "kapan waktu istirahat yang disarankan"
            }},
            "weather_consideration": "pertimbangan cuaca untuk aktivitas hari ini",
            "energy_level_tips": "tips mengelola energi berdasarkan trimester saat ini"
        }},
        "trimester_specific": {{
            "current_trimester": "trimester saat ini",
            "safe_activity_levels": ["level aktivitas yang aman untuk trimester ini"],
            "avoid_activities": ["nama aktivitas yang harus dihindari"],
            "special_considerations": "pertimbangan khusus untuk trimester ini"
        }},
        "health_considerations": {{
            "safe_for_user": true,
            "warning_signs": ["tanda bahaya saat berolahraga yang harus diperhatikan"],
            "when_to_stop": ["kapan harus menghentikan aktivitas"],
            "emergency_contacts": "reminder untuk selalu siap kontak darurat"
        }},
        "summary": {{
            "total_recommended_duration": "total durasi aktivitas yang direkomendasikan hari ini",
            "calorie_burn_estimate": "estimasi kalori yang akan terbakar",
            "motivation_message": "pesan motivasi untuk ibu hamil",
            "next_day_preparation": "tips persiapan untuk aktivitas esok hari"
        }}
    }}
    
    ATURAN KEAMANAN KHUSUS IBU HAMIL:
    - HANYA pilih aktivitas dengan level "Ringan" atau "Sedang" untuk ibu hamil
    - HINDARI aktivitas dengan level "Berat" untuk ibu hamil
    - Prioritaskan aktivitas seperti: Jalan Kaki Santai, Yoga Prenatal, Pilates Prenatal, Latihan Peregangan Ringan, Latihan Kegel, Senam Hamil
    - Untuk trimester 1: Hindari aktivitas berlebihan karena risiko mual dan kelelahan
    - Untuk trimester 2: Periode paling aman untuk aktivitas, tapi tetap hati-hati
    - Untuk trimester 3: Hindari aktivitas berbaring telentang, fokus pada persiapan persalinan
    - Selalu sertakan pemanasan dan pendinginan
    - Pertimbangkan perubahan pusat gravitasi dan keseimbangan
    - Stop jika ada nyeri, pusing, sesak napas berlebihan, atau perdarahan
    
    AKTIVITAS YANG SANGAT DIREKOMENDASIKAN UNTUK IBU HAMIL:
    - Jalan Kaki Santai, Yoga Prenatal, Pilates Prenatal
    - Latihan Kegel, Latihan Peregangan Ringan, Senam Hamil  
    - Berenang (jika tersedia), Latihan Bola, Bersepeda Statis
    
    AKTIVITAS YANG HARUS DIHINDARI:
    - Voli, Basket, Hiking (level Berat)
    - Latihan Sirkuit (level Berat)
    - Aktivitas dengan risiko jatuh atau benturan
    
    KHUSUS UNTUK REKOMENDASI HARI INI:
    - Berikan 2-3 aktivitas yang praktis dan mudah dilakukan
    - Pertimbangkan waktu saat ini dan energi ibu hamil
    - Sertakan aktivitas dengan durasi bervariasi (10-60 menit)
    - Berikan alternatif berdasarkan tingkat energi
    - Fokus pada manfaat jangka pendek dan jangka panjang
    - Berikan motivasi dan encouragement
    
    OUTPUT harus valid JSON tanpa komentar atau teks tambahan.
    - PASTIKAN semua aktivitas yang direkomendasikan ADA di database available_activities
    - GUNAKAN data lengkap sesuai format database (id, activityName, description, dll)
    - BERIKAN alasan yang personal berdasarkan kondisi ibu hamil
    """
    
    response = model.generate_content(system_context)
    return response.text