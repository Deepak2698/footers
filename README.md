# Footers — Footwear E-Commerce & ERP Platform

Full-stack MERN application for Footers footwear: public storefront, customer checkout, and admin ERP.

## Architecture

```
MongoDB → Express API → React Services → React Components → UI
```

| Layer | Tech | Path |
|-------|------|------|
| Frontend | React 19, TypeScript, Tailwind | `ecommerce-app/` |
| Backend | Node.js, Express, Mongoose | `backend/` |
| Database | MongoDB | via `MONGO_URI` |

## Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
cp .env.example .env   # configure MONGO_URI, JWT_SECRET
npm install
npm run seed:users     # create admin accounts
npm run seed           # seed products (destructive — clears products)
npm run dev            # http://localhost:5004
```

### Frontend
```bash
cd ecommerce-app
npm install
npm start              # http://localhost:3000
```

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API port | 5004 |
| `MONGO_URI` | MongoDB connection | required |
| `JWT_SECRET` | Auth token secret | required in prod |
| `CORS_ORIGIN` | Allowed frontend origin | localhost:3000 |
| `SHIPPING_PROVIDER` | dummy / shiprocket / delhivery / bluedart | dummy |
| `IMAGE_PROVIDER` | local / cloudinary / s3 / firebase | local |
| `GST_RATE` | Tax rate (0.18 = 18%) | 0 |
| `FREE_SHIPPING_THRESHOLD` | Free shipping min | 999 |
| `SHIPPING_FEE` | Standard shipping fee | 99 |
| `SMTP_*` | Email for invoices | optional |

### Frontend (`ecommerce-app/.env`)
```
REACT_APP_API_URL=http://localhost:5004/api
```

## Seed Users

| Role | Email | Password |
|------|-------|----------|
| **Owner** | adminboss@footers.in | Boss@dcc |
| **Staff** | admin@footers.in | admin@123 |

Login at `/login` → redirects to `/admin/dashboard`.

## Folder Structure

```
prototype/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── services/        # Shipping, Email, Images abstractions
│   ├── middleware/      # Auth, upload, validation
│   └── seeder/          # DB seed scripts
├── ecommerce-app/
│   ├── src/
│   │   ├── components/  # UI components + admin layout
│   │   ├── contexts/    # Auth, Cart
│   │   ├── pages/       # Storefront + admin pages
│   │   └── services/    # API clients
│   └── public/assets/   # Static images
├── README.md
└── TODO.md
```

## Common Commands

```bash
# Backend
npm run dev          # Development server
npm run seed         # Seed products
npm run seed:users   # Seed admin users

# Frontend
npm start            # Dev server
npm run build        # Production build
```

## Features

### Storefront
- Products from MongoDB (Home, Products, Featured, Product Detail)
- Search, category/brand filters, related products
- Cart (localStorage persistence)
- Checkout with address, payment method, coupon (SAVE10)
- Order tracking (`/track-order`)
- Email invoice (when SMTP configured)

### Admin ERP (`/admin`)
- Dashboard (owner/staff role-based)
- Products, Categories, Brands, Inventory
- Orders, Invoices, Reports
- Staff Management, Settings (owner only)

## Future Integrations

### Courier API
Set `SHIPPING_PROVIDER=shiprocket|delhivery|bluedart` and implement the adapter in `backend/services/shipping/ShippingService.js`. Only `DummyShippingProvider` is active now.

### Cloud Image Storage
Set `IMAGE_PROVIDER=cloudinary|s3|firebase` and implement the provider in `backend/services/images/ImageService.js`. Only `LocalImageProvider` is active now.

### Payment Gateway
Checkout collects payment method but does not process online payments yet. Integrate Razorpay/Stripe at checkout.

## Deployment

Backend (`backend/`) on **Render** and frontend (`ecommerce-app/`) on **Vercel**, backed by MongoDB Atlas.

### Backend → Render

A Blueprint is committed at `render.yaml` (repo root). In the Render dashboard: New → Blueprint → select this repo. Render reads `render.yaml` and creates the service with `rootDir: backend` already configured. You'll be prompted for the env vars marked `sync: false`:

| Variable | Value |
|----------|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long random string (never reuse the dev value) |
| `CORS_ORIGIN` | Your Vercel frontend URL, e.g. `https://footers.vercel.app` |

Render assigns the service a URL like `https://footers-backend.onrender.com` — copy it for the frontend step below. Health check is wired to `/api/health`.

After first deploy, seed the database once (Render dashboard → Shell, or run locally against the Atlas URI):
```bash
npm run seed:users
npm run seed
```

### Frontend → Vercel

Import the repo in Vercel, and set **Root Directory** to `ecommerce-app` in the project's General settings (the app lives in a subfolder, not the repo root). `ecommerce-app/vercel.json` handles the React Router SPA fallback. Set this env var before the first deploy (CRA bakes it in at build time — changing it later requires a redeploy):

| Variable | Value |
|----------|-------|
| `REACT_APP_API_URL` | `https://<your-render-backend>.onrender.com/api` |

### Notes / known limitations

- **Free-tier cold starts**: Render's free plan spins the backend down after inactivity; the first request after idle can take ~30s.
- **Admin image uploads**: `IMAGE_PROVIDER=local` writes to local disk, which is not persistent storage on Render's free tier (files can be lost on redeploy/restart). The seeded product catalog is unaffected since those images ship as static frontend assets. For durable admin-uploaded images in production, implement the `CLOUDINARY`/`S3` provider referenced in `backend/services/images/ImageService.js` and set `IMAGE_PROVIDER` accordingly.
- Enable HTTPS (Render and Vercel both provide this automatically) and set up MongoDB Atlas backups from the Atlas dashboard.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| API connection failed | Check backend running on port 5004, verify `REACT_APP_API_URL` |
| Login fails | Run `npm run seed:users`, check MongoDB connection |
| Empty products | Run `npm run seed` |
| Email not sent | Configure SMTP env vars (optional) |
| Cart empty after refresh | Cart uses localStorage — check browser storage |
# footers
