# Peksan Üretim - Frontend (Electron)\r
\r
Peksan Üretim masaüstü istemcisi. Electron + React + TypeScript ile geliştirilmiştir; electron-vite geliştirme deneyimi ve electron-builder paketleme/güncelleme altyapısı kullanılır.\r
\r
## Özellikler\r
- Electron (main, preload, renderer mimarisi)\r
- React 18 + Redux Toolkit\r
- MUI bileşen kütüphanesi\r
- electron-vite ile hızlı geliştirme (HMR)\r
- electron-builder ile kurulum paketi üretimi ve (generic) auto-update\r
\r
## Gereksinimler\r
- Node.js 16+ (önerilen LTS)\r
- npm 8+ (veya dilediğiniz paket yöneticisi)\r
- Windows için ek bir gereksinim yok; macOS notarization dosyası yer alır ancak Windows build’de devre dışı.\r
\r
## Kurulum\r
npm install

## Build ve Paketleme\r
```bash\r
# Prod build (renderer/main)\r
npm run build\r
\r
# Windows x64 kurulum paketi\r
npm run build:win\r
\r
# (İhtiyaç halinde)\r
npm run build:mac\r
npm run build:linux\r
```\r
Çıktılar `dist/`, `out/` ve `release/` altında üretilebilir. Kurulum dosyaları (`.exe`, `.dmg`, `.AppImage` vb.) `.gitignore` ile versiyon kontrolü dışında tutulur.\r


Kullanım:
1) Proje kökünde `.env` veya `.env.local` dosyası oluşturun.
2) İlgili anahtarları `VITE_` prefix’i ile tanımlayın.

## Auto-Update (electron-builder)\r
`electron-builder.yml` içinde `publish.provider=generic` ve `publish.url` yapılandırması bulunur.
- Kendi update sunucunuzu kullanacaksanız bu adresi derleme öncesi güncelleyin.\r
\r
## Proje Yapısı (özet)\r
- `src/main` → Electron main process\r
- `src/preload` → Preload script (IPC vb.)\r
- `src/renderer/src` → React uygulaması (UI)\r
- `electron.vite.config.ts` → Geliştirme/bundle ayarları\r
- `electron-builder.yml` → Paketleme/güncelleme ayarları\r
\r



 
