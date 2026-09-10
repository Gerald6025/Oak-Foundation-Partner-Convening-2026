# OAK Zimbabwe Partner Gathering — Registration & Attendance Platform

> **Event:** OAK Partner Convening · 9–11 November 2026 · Cresta Lodge, Msasa, Harare  
> **Built by:** Uncommon.org Students · Software Engineering & Product Design tracks

##  Overview

A live web platform for the OAK Zimbabwe Foundation Partner Gathering handling:
- **Registration** — Online form with QR code generation (`OAK-2026-XXXX-XXXX` format)
- **Check-in** — Camera-based QR scanning with live headcount
- **Programme** — Day-by-day event schedule
- **Partner Directory** — Partner organisations with links

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Backend | Supabase (Postgres + Auth + Storage) |
| QR Generation | `qrcode.react` |
| QR Scanning | `html5-qrcode` (browser camera) |
| Hosting | Vercel |

##  Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Supabase** project (free tier at [supabase.com](https://supabase.com))

### 1. Clone & Install

```bash
git clone <repo-url>
cd OAK
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration file:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Go to **Authentication > Users** and create an admin user for the coordination team
4. Copy your project credentials from **Settings > API**

### 3. Configure Environment

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Deploy to Vercel

```bash
npx vercel --prod
```

Set the same environment variables in Vercel's dashboard under **Settings > Environment Variables**.

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── register/page.tsx     # Registration form
│   ├── pass/[id]/page.tsx    # Attendee QR pass
│   ├── programme/page.tsx    # Public programme
│   ├── partners/page.tsx     # Partner directory
│   ├── admin/
│   │   ├── login/            # Admin login
│   │   ├── dashboard/        # Live headcount
│   │   ├── scanner/          # QR check-in scanner
│   │   └── attendees/        # Attendee management
│   └── api/
│       ├── register/         # Registration endpoint
│       └── check-in/         # Check-in endpoint
├── components/
│   └── layout/               # Header, BottomNav, AppShell
├── lib/
│   ├── supabase/             # Supabase client utilities
│   ├── types.ts              # TypeScript interfaces
│   ├── validators.ts         # Zod schemas
│   └── utils.ts              # Helpers
└── middleware.ts              # Auth guard
```

## Security

- **Row Level Security (RLS)** enabled on all tables
- `attendees` table has **no public SELECT policy** — personal data never leaks
- Sensitive data (dietary, accessibility, travel) only accessible via admin client
- Public pages only show names, organisations, and QR codes
- Admin routes protected by Supabase Auth middleware

##  Database Schema

| Table | Purpose |
|-------|---------|
| `attendees` | Registration data + QR tokens |
| `check_ins` | Daily attendance records (unique per attendee per day) |
| `partners` | Partner directory |
| `programme_sessions` | Event schedule |
| `documentation_posts` | Daily event documentation |



