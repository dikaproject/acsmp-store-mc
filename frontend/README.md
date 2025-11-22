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
