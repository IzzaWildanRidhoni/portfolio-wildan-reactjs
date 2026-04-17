# 🌐 IzzaWildan — Portfolio

<img width="3586" height="1672" alt="Image" src="https://github.com/user-attachments/assets/92b326c0-d02f-4373-b0f3-aef23d2e1e76" />

---

## 🛠️ Tech Stack

- **Backend** — Laravel 10
- **Frontend** — React 19 + Inertia.js
- **Styling** — Tailwind CSS
- **Build Tool** — Vite
- **Database** — MySQL 8
- **Editor** — Tiptap (rich text editor)

---

## 🚀 Menjalankan dengan Docker

### Prasyarat
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) sudah terinstall dan berjalan

### Langkah-langkah

**1. Clone repository**
```bash
git clone https://github.com/username/portfolio.git
cd portfolio
```

**2. Buat folder docker**
```bash
mkdir docker
mkdir docker/nginx
mkdir docker/php
```

**3. Setup file environment**
```bash
cp .env.example .env
```

Lalu edit `.env`, ubah bagian database:
```dotenv
DB_HOST=mysql
DB_USERNAME=portfolio_user
DB_PASSWORD=secret
```

**4. Jalankan Docker Compose**
```bash
docker compose up -d --build
```

> ⏳ Proses pertama kali agak lama karena download image. Selanjutnya lebih cepat.

**5. Jalankan migrasi database**
```bash
docker compose exec app php artisan migrate --seed
```

**6. Storage link**
```bash
docker compose exec app php artisan storage:link
```

**7. Clear cache**
```bash
docker compose exec app php artisan config:clear
docker compose exec app php artisan cache:clear
```

---

## 🌍 Akses Aplikasi

| Service | URL |
|---|---|
| Website | http://localhost:8000 |
| Vite HMR | http://localhost:5173 |
| MySQL | localhost:3307 |

---

## 📦 Struktur Docker

```
portfolio/
├── docker-compose.yml
├── docker/
│   ├── Dockerfile
│   ├── nginx/
│   │   └── default.conf
│   └── php/
│       └── local.ini
```

---

## 🔧 Perintah Berguna

```bash
# Matikan semua container
docker compose down

# Lihat log
docker compose logs -f

# Masuk ke container
docker compose exec app bash

# Fix permission storage
docker compose exec app chmod -R 775 storage bootstrap/cache
```

---

## 👨‍💻 Developer

**Izza Wildan** — [GitHub](https://github.com/username)