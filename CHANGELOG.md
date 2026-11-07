# Changelog

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/). Versi mengikuti [SemVer](https://semver.org/lang/id/).

## [0.3.0] - 2026-11-07

### Ditambahkan

- Halaman Pengaturan: pilihan tema, status penyimpanan persisten, unduh dan hapus log, versi aplikasi.
- Permintaan penyimpanan persisten saat aplikasi dibuka (`navigator.storage.persist`).
- Logger yang menyimpan log di IndexedDB (maksimal 300 entri) dan bisa diunduh sebagai file .txt.
- Penangkap error global (`window.onerror` dan `unhandledrejection`) yang mencatat ke log.
- Favicon SVG yang disisipkan langsung di `index.html`, dan judul halaman mengikuti `VITE_APP_NAME`.
- Versi aplikasi diambil otomatis dari `package.json` (`__APP_VERSION__`).
- Perintah `npm run release` yang menjalankan lint, format check, test, build, lalu menyalin hasil ke `release/`.
- Dokumen `ARCHITECTURE.md` dan `CHANGELOG.md`.

### Diubah

- Halaman utama sekarang Workspace (pilih dan kelola folder kerja), menggantikan halaman todo contoh.
- ErrorBoundary sekarang mencatat error ke log.

### Dihapus

- Halaman todo contoh dan store `useAppStore`.
- Folder `types/` yang kosong.

## [0.2.0] - 2026-11-07

### Ditambahkan

- Akses folder lewat File System Access API (`showDirectoryPicker`).
- Penyimpanan handle folder di IndexedDB (`lib/idb.ts`) dengan permintaan izin ulang saat aplikasi dibuka.
- Store `useWorkspaceStore` dan halaman Workspace.

### Diubah

- Data todo sekarang disimpan lewat `persist` di localStorage.

## [0.1.0] - 2026-11-07

### Ditambahkan

- Fondasi aplikasi: React 18, TypeScript, Vite 5, Tailwind CSS v4, Zustand.
- Routing dengan HashRouter dan AppLayout.
- Layer API (`lib/api.ts`) dan konfigurasi environment (`lib/env.ts`).
- ErrorBoundary.
- Tema terang, gelap, dan ikuti sistem, dengan toast notifikasi.
- ESLint (flat config), Prettier, dan Vitest dengan Testing Library.
- Build single-file lewat `vite-plugin-singlefile` dan `npm run dist`.
