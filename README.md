# Daily Goal Tracker

A mobile-friendly goal tracking app for Health, Professional, and Personal goals.

## Tech Stack
- **Next.js 14** (App Router)
- **Neon PostgreSQL** (Serverless)
- **Tailwind CSS** (Dark mode)
- **Vercel** (Deployment)

## Setup

### 1. Clone and install
```bash
npm install
```

### 2. Set up Neon database
1. Go to [neon.tech](https://neon.tech) and create a database
2. Copy your connection string
3. Create `.env.local` file:
```
DATABASE_URL=postgres://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 3. Run the schema
Execute `schema.sql` in your Neon SQL Editor to create tables and seed data.

### 4. Run locally
```bash
npm run dev
```

### 5. Deploy to Vercel
1. Connect this repo to Vercel
2. Add `DATABASE_URL` environment variable
3. Deploy

## Features
- ✅ Day-specific training tasks (auto-detects day of week)
- ✅ Collapsible category cards with progress bars
- ✅ Animated task completion
- ✅ Mobile-first dark UI
- ✅ Data persists across devices
