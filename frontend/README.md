# SSSMC Frontend

Modern, responsive, and elegant frontend for SSSMC (Simple Server Shop Minecraft) built with React, Vite, Tailwind CSS, and Framer Motion.

## 🚀 Tech Stack

- **React 18** - Modern UI library
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animation library
- **React Router DOM** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Toast notifications

## 📁 Project Structure

```
sssmc-fe/
├── public/               # Static assets (add logo files here)
├── src/
│   ├── components/       # Reusable components
│   │   ├── layout/       # Navbar, Footer, Layout
│   │   └── ui/           # Button, Card, Input, Badge
│   ├── lib/              # API client & utilities
│   ├── pages/            # Page components
│   ├── store/            # Zustand stores (cart, auth)
│   ├── App.jsx           # Root component with routes
│   └── index.css         # Global styles + Tailwind
├── .env                  # Environment variables
├── tailwind.config.js    # Tailwind configuration
└── vite.config.js        # Vite configuration
```

## 🛠️ Installation

### Prerequisites
- Node.js 20+
- Backend API running on `http://localhost:5000`

### Setup Steps

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
copy .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

3. **Add logo files to `public/` directory**
- `logo.png` - Static logo
- `logo.gif` - Animated logo

4. **Start development server**
```bash
npm run dev
```

App runs at `http://localhost:5173`

## 📦 Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🌐 Features

### Completed ✅
- **Home Page** - Hero, server types, gallery, CTA
- **Shop Page** - Product listing, filters, cart integration
- **Cart Store** - Persistent shopping cart
- **Auth Store** - Authentication state management

### Next Phase 🔄
- Cart/Checkout page
- Order tracking
- Guides page
- Admin dashboard

## 🎨 Design System

- **Primary**: Emerald (#10b981)
- **Secondary**: Indigo (#6366f1)
- **Accent**: Amber (#f59e0b)
- **Dark Theme**: Default

## 🔌 API Integration

```javascript
import { productAPI } from './lib/api';

// Get products
const products = await productAPI.getAll({ serverTypeId: 1 });
```

## 🎯 State Management

```javascript
// Cart
const { addItem, getTotalItems } = useCartStore();

// Auth
const { login, logout, user } = useAuthStore();
```

## 🚀 Deployment

```bash
npm run build   # Creates dist/ folder
```

Deploy `dist/` to:
- **Vercel**: `vercel --prod`
- **Netlify**: Connect repo, build command: `npm run build`, dir: `dist`

Set environment variable:
```
VITE_API_URL=https://your-api-domain.com/api
```

## 🐛 Troubleshooting

- **Node Warning**: Update to v20.19+ (or ignore, works fine)
- **Tailwind Errors**: VSCode warning only, ignore
- **Images Not Loading**: Check backend is running and `.env` is correct

---

**Built for SSSMC Community**

## Produk Digital

Katalog publik: `/digital-products`. Admin: `/admin/digital-products`.
Beranda menampilkan tiga produk terbaru dengan tautan ke katalog lengkap.
Menu katalog tersedia di Fitur dan footer. Judul, deskripsi teks biasa,
foto, dan tautan pemesanan dikelola melalui API `/api/digital-products`.
Form admin menerima nomor WhatsApp (contoh `081222828282`) dan membuat
tautan `https://wa.me/6281222828282` otomatis. Awalan `62`/`+62`, spasi,
dan tanda hubung juga didukung. Nomor dari tautan WhatsApp lama otomatis
diisi saat edit; pesan pada tautan lama tetap dipertahankan jika nomor sama.
Lihat README backend untuk migrasi dan batas input.

Desain mengikuti arahan agar sama dengan situs yang ada: warna gelap dan
aksen arcane memakai token brand; font Outfit dan komponen bersama menjaga
konsistensi; grid foto memudahkan membandingkan produk; jarak antarkonten
memisahkan informasi dan tindakan pemesanan. Ikon pesan dan tautan membedakan
tujuan WhatsApp dan kontak lain. ENERGY 2 / RHYTHM 1 / MOTION 1.

### Verifikasi 16 Oktober 2026

Cakupan laporan hanya fitur produk digital. Tes browser menggunakan API
simulasi dan tidak menulis ke database proyek. MySQL lokal belum tersedia;
migrasi dan integrasi database nyata belum diuji.

| Pemeriksaan | Hasil dan bukti |
| --- | --- |
| Hard Gate: layout (R-03) | PASS: admin, modal, dan katalog pada 375 px serta 1440 px tidak overflow; token panjang terbungkus. |
| Hard Gate: konten (R-02, R-17, R-18, R-28, R-36, R-38) | PASS: fitur tidak menambahkan klaim, testimonial, statistik, FAQ, atau data contoh tersimpan. |
| Hard Gate: aset dan arah (R-23, R-37) | PASS: foto diunggah admin; logo, font, dan palet mengikuti situs sesuai permintaan. |
| Hard Gate: navigasi dan tindakan (R-24, R-26) | PASS: Fitur, menu mobile, footer, dan tombol beranda menuju katalog; tautan pemesanan memakai URL yang disimpan. |
| Hard Gate: kontras (R-25) | PASS: putih/arcane 5,74:1; muted/elevated 6,79:1; glow/ink 5,66:1; batas input/elevated 3,87:1. |
| Hard Gate: status data (R-27) | PASS: loading, kosong, pencarian tanpa hasil, gagal memuat, dan coba lagi diuji di admin dan publik. |
| Hard Gate: keyboard (R-32) | PASS: form fokus ke judul, fokus tetap dalam dialog, Escape menutup dan mengembalikan fokus ke pembuka; dialog hapus juga diuji. |
| Hard Gate: implementasi dan tema (R-33, R-34) | PASS: perubahan ditulis langsung di source; memakai tema situs yang ada. |
| Hard Gate: verifikasi (R-35) | PASS: build produksi, 5 tes backend, 10 tes frontend, dan 30 pemeriksaan browser lulus; tidak ada exception JavaScript. |
| Purpose Gate | PASS: kartu membandingkan produk setara; aksen menandai tindakan; ikon mengikuti fungsi; tidak ada ilustrasi atau efek dekoratif tambahan. |
| Liveliness | PASS: heading menjadi fokus, foto adalah konten utama, arcane mengulang identitas situs, dan motion terbatas pada feedback kontrol/loading. |
| Craftsmanship (C-1 sampai C-5) | PASS: CRUD, validasi, retry, keyboard, dan ukuran layar diuji; konten uji hanya berada di respons simulasi. |
| Quality Locks (R-05, R-11, R-15, R-16, R-20, R-21, R-29 sampai R-31) | PASS: katalog mengikuti isi produk, radius memakai komponen bersama, CTA menyebut tindakan, warna/font mengikuti arahan pemilik. |

Alur klik yang lulus: tambah lalu upload foto, validasi foto wajib dan format,
gagal simpan lalu retry, edit tanpa foto, ganti foto, pencarian dan hapus
pencarian, buka URL tujuan, batal hapus, Escape, gagal hapus lalu retry, dan
hapus berhasil. Deskripsi berisi markup tampil sebagai teks biasa. Tautan
dengan skema berbahaya tidak dibuat menjadi tombol pada katalog.

ESLint untuk file fitur baru dan API client lulus. Lint seluruh proyek masih
memiliki temuan lama di file lain. Lima pesan resource HTTP 500 pada uji
browser merupakan respons gagal yang sengaja disimulasikan untuk menguji retry.

Pembaruan input nomor WhatsApp: PASS pada build produksi, lint file yang
diubah, dan 14 tes frontend. Uji browser dengan API simulasi membuktikan
input `081222828282` menghasilkan URL yang benar, nomor tidak valid diblokir,
nomor lama terisi saat edit, pesan lama tetap tersimpan, perubahan nomor
menghasilkan tautan baru, serta form 375 px tidak overflow dan tidak menimbulkan
exception JavaScript. Tema, komponen, dan arah desain tetap sama.
