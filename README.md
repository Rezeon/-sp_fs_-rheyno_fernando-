# 🧑‍💻 Fullstack Project - Multi-User Project Management App

Repository ini merupakan hasil pengerjaan project fullstack untuk submission “Fullstack Sellerpintar” oleh **Rheyno Fernando Velga Wesi Aji**. Aplikasi ini memungkinkan user untuk membuat project, mengundang anggota tim, membuat task, mengubah status task, dan menghapus project/task.


## 🚀 Fitur Utama

- Autentikasi menggunakan JWT
- Manajemen project:
  - Buat project
  - Hapus project (jika owner)
  - Lihat project milik sendiri dan yang diikuti
- Manajemen anggota:
  - Undang user ke dalam project
  - Hanya owner yang bisa mengundang anggota
- Task Management:
  - Buat, lihat, edit (status), dan hapus task
  - Set assignee dari daftar anggota project
  - Status: `TODO`, `IN_PROGRESS`, `DONE`

---

## 🛠️ Teknologi yang Digunakan

### 🔧 Backend
- Node.js + Express.js
- Prisma ORM + PostgreSQL
- JSON Web Token (JWT) untuk autentikasi
- Next.js API Routes (for SSR-friendly API)

### 🎨 Frontend
- Next.js App Router (Client Components)
- Tailwind CSS
- ShadCN UI Components
- React Hooks

---

## ⚙️ Cara Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/rheynof/sp_fs_rheyno_fernando.git
cd sp_fs_rheyno_fernando

2. Setup Environment Variables
Buat file .env berdasarkan .env.example di root folder. Contoh:

env

# .env (untuk backend)
DATABASE_URL=postgresql://user:password@localhost:5432/nama_database
JWT_SECRET=your_jwt_secret

# Jika pakai frontend Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
3. Install Dependencies & Jalankan
Backend (API & Database)

npm install
npx prisma generate
npx prisma migrate dev
npm run dev
Frontend (Next.js Client)

cd app
npm install
npm run dev
Aplikasi akan berjalan di: http://localhost:3000

🧪 Fitur Pengujian Manual
Register & Login User

Create Project

Invite Member by Email

Create & Assign Tasks

Update Status Task

Delete Task / Delete Project (Owner Only)

📁 Struktur Folder
📦 sp_fs_rheyno_fernando
├── prisma/
│   ├── schema.prisma
├── app/ (Next.js)
│   ├── api/ (API Routes)
│   ├── projects/
│   ├── components/
│   └── ...
├── .env.example
├── README.md
└── ...
📝 Catatan
Semua API terlindungi dengan token JWT

Hanya owner yang dapat menghapus project dan mengundang anggota

Project sudah dideploy. Dapat dijalankan dan langsung ke halaman /register atau login saja

👨‍💻 Author
Rheyno Fernando Velga Wesi Aji
Email: rheynoternando@gmail.com
Solo, Indonesia








