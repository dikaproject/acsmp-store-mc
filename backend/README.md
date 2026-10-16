# SSSMC Backend API

Backend API untuk website promosi dan webstore Minecraft Server. Dibangun dengan Node.js, Express, Prisma, dan MySQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth dengan role ADMIN & VISITOR
- **Server Type Management**: CRUD server types (RPG, MIX, Skyblock, dll)
- **Product Management**: Manage coins, money, features & ranks dengan pricing
- **Produk Digital**: CRUD judul, deskripsi teks biasa, foto, dan tautan pemesanan WhatsApp
- **Order & Payment**: Integrasi Tripay payment gateway
- **Command Executor**: Auto-execute command ke Minecraft server panel
- **Gallery**: Showcase screenshot server
- **Guides/Wiki**: Tutorial & panduan untuk player
- **Settings**: Dynamic website configuration

## 📋 Prerequisites

- Node.js >= 14.x
- MySQL >= 5.7
- npm atau yarn

## 🛠️ Installation

1. **Clone & Install Dependencies**
```bash
cd sssmc-be
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi Anda:
```env
DATABASE_URL="mysql://user:password@localhost:3306/sssmc_db"
JWT_SECRET=your-secret-key
TRIPAY_API_KEY=your-tripay-key
TRIPAY_PRIVATE_KEY=your-tripay-private-key
TRIPAY_MERCHANT_CODE=your-merchant-code
```

3. **Database Setup**
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

4. **Start Development Server**
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## 📁 Project Structure

```
src/
├── config/          # Database & Multer configuration
├── controllers/     # Request handlers
├── middleware/      # Auth, validation, error handlers
├── routes/          # API routes
├── services/        # Business logic (Tripay, Command)
└── utils/           # Helper functions (JWT)

prisma/
├── schema.prisma    # Database schema
├── migrations/      # Database migrations
└── seed.js         # Database seeder
```

## 🔑 API Endpoints

### Public Endpoints

#### Server Types
- `GET /api/server-types` - Get all server types
- `GET /api/server-types/:id` - Get server type by ID

#### Products
- `GET /api/products` - Get all products
- `GET /api/products?serverTypeId=xxx&type=COIN` - Filter products
- `GET /api/products/:id` - Get product by ID

#### Digital Products
- `GET /api/digital-products` - Daftar produk digital, terbaru lebih dahulu
- `GET /api/digital-products/:id` - Detail produk digital

#### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/code/:orderCode` - Get order by code
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/:id/payment-status` - Check payment status
- `POST /api/orders/webhook` - Tripay webhook handler

#### Gallery
- `GET /api/gallery` - Get all gallery items
- `GET /api/gallery/:id` - Get gallery by ID

#### Guides
- `GET /api/guides` - Get all guides
- `GET /api/guides/:id` - Get guide by ID
- `GET /api/guides/slug/:slug` - Get guide by slug

#### Settings
- `GET /api/settings` - Get all settings

### Admin Endpoints (Require JWT Token + ADMIN role)

#### Server Types
- `POST /api/server-types` - Create server type
- `PUT /api/server-types/:id` - Update server type
- `DELETE /api/server-types/:id` - Delete server type

#### Products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Digital Products
- `POST /api/digital-products` - Tambah produk digital
- `PUT /api/digital-products/:id` - Edit produk digital
- `DELETE /api/digital-products/:id` - Hapus produk digital beserta fotonya

Gunakan `multipart/form-data`: `title` (maksimal 191 karakter), `description`
(teks biasa, maksimal 10.000 karakter), `redirectUrl` (URL HTTP/HTTPS lengkap,
maksimal 2.048 karakter), dan file `image` (JPG, PNG, GIF, atau WEBP, maksimal
5 MB). Semua field wajib saat membuat produk. Saat mengedit, foto lama tetap
digunakan jika tidak ada file pengganti. Tautan WhatsApp dapat diisi dengan
`https://wa.me/62...` beserta pesan pada query `text` bila diperlukan.
Pada form admin cukup isi nomor WhatsApp, misalnya `081222828282`;
frontend otomatis mengubahnya menjadi `https://wa.me/6281222828282`
sebelum dikirim sebagai `redirectUrl`. Awalan `62` dan `+62` juga diterima.

Admin mengelola produk di `/admin/digital-products`. Katalog publik tersedia
di `/digital-products`, menu Fitur, dan section Produk Digital di beranda.
Produk digital menggunakan tabel sendiri dan tombol pemesanannya membuka
tautan yang disimpan admin.

Untuk database yang sudah mengikuti riwayat migrasi proyek, jalankan dari
direktori `backend` sebelum memakai fitur:

```bash
npx prisma migrate deploy
npm run prisma:generate
```

Migrasi `20261016000000_add_digital_products` hanya menambahkan tabel
`digital_products`. Migrasi belum dijalankan otomatis oleh implementasi ini.

#### Orders
- `GET /api/orders` - Get all orders (with pagination)
- `PATCH /api/orders/:id/status` - Update order status

#### Gallery
- `POST /api/gallery` - Create gallery item
- `PUT /api/gallery/:id` - Update gallery item
- `DELETE /api/gallery/:id` - Delete gallery item

#### Guides
- `POST /api/guides` - Create guide
- `PUT /api/guides/:id` - Update guide
- `DELETE /api/guides/:id` - Delete guide

#### Settings
- `POST /api/settings` - Upsert setting
- `POST /api/settings/bulk` - Bulk upsert settings
- `DELETE /api/settings/:key` - Delete setting

## 🔐 Authentication

Login untuk mendapatkan JWT token:

```bash
POST /api/auth/login
{
  "email": "admin@minecraft.com",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Gunakan token di header untuk protected endpoints:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 💰 Payment Flow (Tripay)

1. Customer create order via `POST /api/orders`
2. Backend create Tripay transaction & return payment URL
3. Customer melakukan pembayaran
4. Tripay mengirim webhook ke `POST /api/orders/webhook`
5. Backend update order status & execute command ke Minecraft panel
6. Command otomatis dijalankan (points give / eco give / lp user parent addtemp)

## 🎮 Minecraft Command Integration

Commands yang dieksekusi otomatis saat payment success:

**Untuk COIN:**
```bash
points give <username> <amount>
```

**Untuk MONEY:**
```bash
eco give <username> <amount>
```

**Untuk RANK:**
```bash
lp user <username> parent addtemp <group_name> <duration>d
```

Example:
- `points give ZuffyMC 100`
- `eco give ZuffyMC 100`
- `lp user ZuffyMC parent addtemp vip 30d`

## 📦 Database Schema

### Models
- **User**: Admin & visitor accounts
- **ServerType**: RPG, MIX, Skyblock, dll
- **Product**: Coins, Money, Features & Ranks dengan pricing
- **DigitalProduct**: Judul, deskripsi teks, foto, dan tautan pemesanan
- **Order**: Purchase transactions
- **OrderItem**: Order details
- **Gallery**: Screenshot showcase
- **Guide**: Wiki/Tutorial
- **Setting**: Website configuration

## 🧪 Testing

```bash
# Run tests
npm test

# Test with coverage
npm run test:coverage
```

## 📝 Default Admin Account

```
Email: admin@minecraft.com
Password: admin123
```

**⚠️ PENTING: Ganti password default setelah deployment!**

## 🚀 Deployment

### Production Setup

1. Update `.env` dengan production values
2. Set `NODE_ENV=production`
3. Set `TRIPAY_MODE=production`
4. Update `BASE_URL` dan `FRONTEND_URL`

### Run Production
```bash
npm start
```

### PM2 (Recommended)
```bash
npm install -g pm2
pm2 start src/app.js --name sssmc-api
pm2 startup
pm2 save
```

## 🔧 Troubleshooting

### Database Connection Error
- Pastikan MySQL running
- Check `DATABASE_URL` di `.env`
- Run `npx prisma generate` lagi

### Upload Error
- Pastikan folder `uploads/` ada dan writable
- Check disk space

### Tripay Webhook Not Working
- Pastikan `BASE_URL` accessible dari internet
- Check Tripay dashboard webhook settings
- Validate signature di logs

## 📞 Support

Untuk pertanyaan atau issue, silahkan contact:
- Email: admin@minecraft.com
- Discord: https://discord.gg/sssmc

## 📄 License

MIT License - feel free to use for your Minecraft server!

---

Made with ❤️ for SSSMC Community
