# GTNIC Web Development

Monorepo untuk pengembangan web GTNIC — memisahkan **Backend** (API) dan **Frontend** (UI) dalam satu repository agar kolaborasi, versioning, dan deployment lebih rapi.

Repo: `https://github.com/willdannaltairr/GTNIC-Web-Development.git` — branch utama: `main`

## Struktur Folder

```text
GTNIC/
├── backend/
│   └── myapp/              # Backend — Node.js + Express + TypeScript
│       ├── src/
│       │   └── app.ts      # Entry point Express
│       ├── package.json
│       ├── tsconfig.json
│       └── package-lock.json
│
├── frontend/
│   └── my-app/             # Frontend — Next.js 16 + React 19 + Tailwind CSS 4
│       ├── app/            # App Router (layout.jsx, page.jsx, globals.css)
│       ├── public/         # Aset statis
│       ├── package.json
│       ├── next.config.mjs
│       └── jsconfig.json
│
├── .gitignore              # Aturan ignore monorepo (node_modules, .next, .env, dist, dll)
└── README.md
```

## Prasyarat

- Node.js LTS (>= 18) + npm
- Git

## Cara Menjalankan

### 1. Clone (untuk anggota tim / komputer baru)

```bash
git clone https://github.com/willdannaltairr/GTNIC-Web-Development.git
cd GTNIC-Web-Development
```

### 2. Backend (`backend/myapp`)

```bash
cd backend/myapp
npm install
npx tsc --noEmit        # cek TypeScript (opsional)
node --version          # pastikan Node jalan
```

> `src/app.ts` adalah entry point Express. Jalankan dengan `ts-node` / `tsx` atau compile ke `dist/` sesuai kebutuhan.

### 3. Frontend (`frontend/my-app`)

```bash
cd frontend/my-app
npm install
npm run dev             # http://localhost:3000
npm run build           # build production
npm run start           # jalankan hasil build
npm run lint            # cek ESLint
```

## Alur Git yang Rapi (aturan yang kamu minta)

Urutan standar untuk push pertama — sudah disesuaikan untuk struktur `backend/` + `frontend/`:

```bash
# 1. Masuk ke root proyek
cd GTNIC

# 2. Inisialisasi (hanya sekali, lewati jika .git sudah ada)
git init

# 3. Pastikan .gitignore root sudah ada agar node_modules/.next/.env tidak ikut ke-commit
git status

# 4. Stage semua file backend + frontend yang relevan
git add .

# 5. Cek ulang apa yang akan di-commit
git status

# 6. Commit pertama
git commit -m "first commit"

# 7. Pastikan branch utama bernama main
git branch -M main

# 8. Sambungkan ke GitHub (hanya sekali, lewati jika origin sudah ada)
git remote add origin https://github.com/willdannaltairr/GTNIC-Web-Development.git

# 9. Push + set upstream
git push -u origin main
```

### Push harian setelah itu

```bash
git status
git add .
git commit -m "<tipe>: <pesan singkat>"
# contoh: feat: tambah API login | fix: perbaiki layout mobile | chore: update deps frontend
git push
```

### Cek remote & branch (jika error)

```bash
git remote -v
git branch -a
# kalau origin belum ada:
git remote add origin https://github.com/willdannaltairr/GTNIC-Web-Development.git
# kalau sudah ada tapi salah URL:
git remote set-url origin https://github.com/willdannaltairr/GTNIC-Web-Development.git
```

## Konvensi Commit

- `feat:` fitur baru
- `fix:` perbaikan bug
- `chore:` perawatan (deps, config, gitignore)
- `docs:` dokumentasi / README
- `style:` styling frontend tanpa ubah logika
- `refactor:` refactoring tanpa ubah perilaku

Contoh: `feat: tambah endpoint auth backend`, `fix: perbaiki respons API login`

## Catatan Penting

1. Jangan commit `node_modules/`, `.next/`, `.env` — sudah di-cover `.gitignore` root.
2. `package-lock.json` tetap di-commit agar versi dependency konsisten.
3. Satu PR / satu commit = satu tujuan. Pisahkan perubahan backend vs frontend jika bisa.
4. Selalu `git status` sebelum `git add` dan sebelum `git commit`.
