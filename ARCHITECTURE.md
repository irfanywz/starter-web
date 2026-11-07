# Arsitektur

Dokumen ini menjelaskan struktur dan aturan proyek. Dibaca bersama `README.md` dan `CHANGELOG.md`.

## Ringkasan

- Aplikasi web **offline/portable**: hasil build satu file `dist/index.html` yang bisa dibuka langsung di browser tanpa server.
- Stack: React 18, TypeScript, Vite 5, Tailwind CSS v4, Zustand, React Router (HashRouter), Tabler Icons.
- Target browser utama: Chrome dan Edge (karena File System Access API).
- Semua data disimpan di browser: localStorage (lewat zustand `persist`) dan IndexedDB.
- Layer API (`lib/api.ts`) disediakan tapi belum dipakai; aplikasi saat ini tidak punya backend.

## Peta folder

```
scripts/release.mjs        Alur rilis: lint, format check, test, build, salin ke release/
src/
├── main.tsx               Entry point: init tema, error handler global, persist storage, render
├── App.tsx                Definisi route (HashRouter)
├── index.css              Tailwind + variant dark
├── vite-env.d.ts          Tipe env VITE_* dan __APP_VERSION__
├── components/
│   ├── layout/            AppLayout (kerangka halaman), Navbar
│   ├── feedback/          ErrorBoundary, Toaster
│   └── ui/                Komponen reusable: Button, Card, ThemeToggle
├── pages/                 Satu file per route: WorkspacePage, SettingsPage, AboutPage, NotFoundPage
├── stores/                State global zustand: useThemeStore, useToastStore, useWorkspaceStore
├── lib/                   Helper murni: env, idb, fsAccess, logger, storage, theme, api, download, utils
└── test/setup.ts          Setup Vitest (jest-dom, fake-indexeddb, cleanup)
```

## Route

| Path         | Halaman       | Keterangan                                   |
| ------------ | ------------- | -------------------------------------------- |
| `#/`         | WorkspacePage | Pilih folder kerja, lihat isi folder         |
| `#/settings` | SettingsPage  | Tema, izin penyimpanan persisten, log, versi |
| `#/about`    | AboutPage     | Info aplikasi                                |
| `#/*`        | NotFoundPage  | Route tidak dikenal                          |

Semua halaman dirender di dalam `AppLayout`, yang berisi Navbar, `ErrorBoundary` (per halaman), dan `Toaster`.

## Alur data

**Tema**: `useThemeStore` (mode: system/light/dark, disimpan di localStorage key `theme`). `lib/theme.ts` menerapkan class `dark` ke `<html>` dan memantau perubahan preferensi OS. Skrip di `index.html` melakukan hal yang sama sebelum React jalan supaya tidak ada kilatan.

**Toast**: `useToastStore` menyimpan daftar toast dalam memori. Panggil `toast.success/error/info/warning(pesan)` dari mana saja, termasuk di luar komponen. Toast hilang otomatis setelah 4 detik. Dirender oleh `Toaster`.

**Folder kerja**: `useWorkspaceStore` mengatur status (`unsupported` | `empty` | `needs-permission` | `ready`). Handle `FileSystemDirectoryHandle` disimpan di IndexedDB (key `workspace-dir`). Setelah aplikasi dibuka ulang, izin harus diminta lagi lewat klik user (`grantAccess`), karena browser mewajibkan user gesture.

**Log**: `lib/logger.ts` menyimpan maksimal 300 entri di IndexedDB (key `app-logs`) lewat antrean tulis, supaya penulisan bersamaan tidak bentrok. Sumbernya: `ErrorBoundary`, error global (`window.onerror`, `unhandledrejection`), dan pemanggilan manual. User bisa mengunduh atau menghapus log di Pengaturan.

**Penyimpanan persisten**: `lib/storage.ts` meminta `navigator.storage.persist()` saat start. Status ditampilkan di Pengaturan, dan user bisa meminta ulang dari sana.

**Database**: `lib/idb.ts` adalah wrapper IndexedDB key-value (`get`, `set`, `del`) tanpa dependency. Ada satu object store bernama `kv`.

## Aturan dan konvensi

- Import memakai alias `@/` (contoh: `@/lib/env`).
- Baca environment hanya lewat `env` di `lib/env.ts`. Jangan akses `import.meta.env` langsung di tempat lain.
- Panggil backend hanya lewat `api` di `lib/api.ts` (jika suatu saat dipakai).
- Logika global ditaruh di `stores/`. Komponen hanya membaca state dan memanggil action.
- Logika murni (tanpa React) ditaruh di `lib/`.
- Komponen UI generik di `components/ui/`, komponen spesifik halaman cukup di `pages/`.
- Setiap file di `pages/` dan `components/` hanya boleh export default satu komponen (aturan `react-refresh`).
- Warna selalu disertai varian `dark:` untuk permukaan dan teks.
- Teks UI dalam Bahasa Indonesia.
- Setiap fitur baru minimal punya test untuk logika utamanya.

## Cara menambah sesuatu

- **Halaman baru**: buat `src/pages/NamaPage.tsx`, daftarkan route di `App.tsx`, dan tambahkan link di `links` pada `Navbar.tsx`.
- **State baru**: buat `src/stores/useNamaStore.ts` dengan zustand. Pakai `persist` jika data harus bertahan setelah refresh.
- **Data besar atau benda non-JSON**: simpan di IndexedDB lewat `idb.set/get`.
- **Environment baru**: tambahkan ke `ImportMetaEnv` di `vite-env.d.ts`, lalu baca di `lib/env.ts`, dan tambahkan ke `.env.example`.

## Build dan rilis

- `npm run dev`: development server.
- `npm run build` atau `npm run dist`: typecheck, lalu build ke `dist/index.html` (single file).
- `npm run test`: jalankan semua test (Vitest, jsdom, fake-indexeddb).
- `npm run lint`, `npm run format`, `npm run format:check`.
- `npm run release`: lint, format check, test, build, lalu salin ke `release/<nama>-v<versi>.html`.
- Versi naik di `package.json`. Catat perubahan di `CHANGELOG.md`.

## Batasan yang perlu diingat

- File System Access API hanya ada di Chromium (Chrome, Edge). Firefox dan Safari menampilkan pesan tidak didukung.
- Izin folder harus diminta ulang setiap aplikasi dibuka. Ini batasan browser, bukan bug.
- `showDirectoryPicker` mensyaratkan secure context. Apakah `file://` dianggap secure context perlu diuji di tiap versi Chrome. Kalau tidak berfungsi, jalankan lewat `npm run preview`.
- Environment variable di-bake saat build. Mengubah `.env` harus build ulang.
- localStorage terbatas sekitar 5 MB dan hanya string. Untuk data besar, pakai IndexedDB.
- Layer API belum dipakai. Jika aplikasi tetap offline, layer ini bisa dihapus.
