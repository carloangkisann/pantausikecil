<div align="center">
  <h1>PantauSiKecil</h1>
  <h3>Ekosistem Cerdas Berbasis AI untuk Mendampingi Ibu Hamil di Era Digital</h3>
  <p><em>Proyek ini dikembangkan untuk <strong>Gunadarma Code Week 2025</strong></em></p>
  <p>
    <img src="https://img.shields.io/badge/Status-Development-orange?style=flat-square" alt="Status"/>
    <img src="https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React Native"/>
    <img src="https://img.shields.io/badge/FastAPI-005571?style=flat-square&logo=fastapi" alt="FastAPI"/>
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  </p>
  <img src="docs/img/PantauSiKecil.png" alt="PantauSiKecil"/>
</div>

---

## 📖 Overview

**PantauSiKecil** adalah sebuah aplikasi mobile berbasis AI yang dirancang untuk mendampingi ibu hamil secara cerdas dan menyeluruh. Aplikasi ini menghadirkan fitur pengingat konsultasi, rekomendasi nutrisi dan aktivitas fisik berbasis kondisi kehamilan, chatbot medis 24/7, hingga tombol darurat yang terhubung ke fasilitas kesehatan dan keluarga.

Dengan pendekatan berbasis data dan teknologi machine learning, PantauSiKecil bertujuan meningkatkan kualitas kesehatan ibu dan janin sejak awal kehamilan hingga persalinan, sekaligus mendukung aksesibilitas layanan kesehatan yang inklusif dan terintegrasi.


---

## Fitur Utama

### 🔔 **Pengingat Otomatis**
- Jadwal konsultasi dokter kandungan
- Reminder konsumsi vitamin dan suplemen
- Notifikasi aktivitas kehamilan penting

### 🧠 **Rekomendasi AI Personal**
- Saran nutrisi berbasis trimester kehamilan
- Rekomendasi aktivitas fisik yang aman

### 🤖 **MediBot 24/7**
- Chatbot medis untuk tanya jawab cepat seputar kehamilan
- Analisis profil pengguna untuk respons yang akurat
- Tersedia 24 jam setiap hari

### 📍 **Tombol Darurat Terintegrasi**
- Koneksi langsung ke rumah sakit terdekat
- Notifikasi otomatis ke kontak keluarga
- Lokasi GPS real-time untuk respons cepat

---

## Kemampuan AI

- **Personalized Recommendation Engine** - Nutrisi & aktivitas personal
- **Chatbot Kehamilan (MediBot)** - Analisis profil pengguna

---

## 🛠️ Tech Stack

<div align="center">
  <table>
    <tr>
      <th>Layer</th>
      <th>Technology</th>
      <th>Purpose</th>
    </tr>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/Frontend-4CAF50?style=for-the-badge" alt="Frontend"/>
      </td>
      <td><strong>React Native</strong><br>NativeWind</td>
      <td>Cross-platform mobile development dengan styling yang efisien</td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/Backend-2196F3?style=for-the-badge" alt="Backend"/>
      </td>
      <td><strong>Express.js</strong><br>Node.js</td>
      <td>RESTful API dan server-side logic</td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/Database-FF9800?style=for-the-badge" alt="Database"/>
      </td>
      <td><strong>PostgreSQL</strong><br>Redis</td>
      <td>Data storage dan caching untuk performa optimal</td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/AI%20Service-9C27B0?style=for-the-badge" alt="AI Service"/>
      </td>
      <td><strong>FastAPI</strong><br>Python</td>
      <td>Machine learning dan AI processing</td>
    </tr>
  </table>
</div>

---

## 📱 Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="docs/img/home.png" alt="Home Page" width="200"/>
        <br><b>Home</b>
      </td>
      <td align="center">
        <img src="docs/img/medibot.png" alt="MediBot" width="200"/>
        <br><b>MediBot 24/7</b>
      </td>
      <td align="center">
        <img src="docs/img/recommendation.png" alt="Recommendation" width="200"/>
        <br><b>Rekomendasi Nutrisi</b>
      </td>
    </tr>
  </table>
</div>

---

## 🧑‍💻 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- PostgreSQL database
- Expo CLI (for mobile development)

### Mobile Setup

```bash
# Masuk ke folder mobile
cd mobile

# Install dependencies
npm install

# Jalankan Expo
npx expo start
```

### Backend Setup

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Buat file .env dan isi sesuai contoh di bawah
# Jalankan server
npm run dev
```

#### Environment Variables (.env)
```bash
# Server Configuration
PORT = 5001
NODE_ENV = development

# Database Configuration
DATABASE_URL = postgresql://postgres:pantauSiKecik@db.qaqfiuhagxhmkvysisrg.supabase.co:5432/postgres

# JWT Configuration
JWT_SECRET = 13dca519dfc53b07014e086dbc357838a4a91d02f6072071aa9b688400c1d128
JWT_EXPIRES_IN = 24h

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=pantausikecilofficial@gmail.com
EMAIL_PASS=sjdt sccn esat fnpe
EMAIL_FROM=noreply@pantausikecil.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

CHATBOT_API_URL=https://pantausikecil-ai-service.up.railway.app
```

### AI Service Setup

```bash
# Masuk ke folder AI service
cd ai-service

# Buat dan aktifkan virtual environment
python -m venv venv
source venv/bin/activate  # Untuk Mac/Linux
# atau
venv\Scripts\activate     # Untuk Windows

# Install dependencies
pip install -r requirements.txt

# Buat file .env dan isi sesuai contoh di bawah
# Jalankan server FastAPI
uvicorn main:app --reload --app-dir src
```
#### Environment Variables (.env)
```bash
GEMINI_API_KEY=AIzaSyAGATZArJvH-qQ-JSfgdlq4wOOKyX7y29s
BACKEND_URL=https://pantausikecil-backend.up.railway.app
```

---

## 👥 Tim Developer

<div align="center">
  <table>
    <tr>
      <td align="center">
        <b>Alfian Hanif</b>
        <br>Backend Developer
      </td>
      <td align="center">
        <b>Carlo Angkisan</b>
        <br>AI Engineer
      </td>
      <td align="center">
        <b>Dzaky Aurelia</b>
        <br>Frontend Developer
      </td>
      <td align="center">
        <b>Heleni Gratia</b>
        <br>Researcher
      </td>
      <td align="center">
        <b>Naomi Risaka</b>
        <br>UI/UX Designer
      </td>
    </tr>
  </table>
</div>

---


## 🌐 Contact & Links

<div align="left">

  **📧 Email**: pantausikecilofficial@gmail.com  
  **📱 Demo**: [Try our demo](https://www.figma.com/proto/LTaaKNHkwkTaDQksiOSoBd/Design?node-id=14-105&t=yzYLtXzx4UhFECUM-1)
  
</div>

---

<div align="center">
  <p><strong>Dibuat oleh Tim PantauSiKecil © 2025</strong></p>
  <p><em>Untuk masa depan yang lebih sehat bagi ibu dan bayi Indonesia</em></p>
</div>
