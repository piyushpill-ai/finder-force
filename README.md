# Finder Force - Awards Submission Platform

A modern awards submission and judging platform built with Next.js 14, Prisma, and PostgreSQL.

## Features

- 📋 **Create Categories** - Define award categories with custom metrics (numeric or text)
- 🚀 **Launch & Share** - Generate submission links for companies
- 📝 **Collect Submissions** - Companies fill in metrics via a beautiful form
- 👥 **Invite Judges** - Send email invitations to your judging panel
- ⚖️ **Score Entries** - Judges score each metric from 1-10
- 🏆 **Calculate Winners** - Weighted scoring determines category winners

## Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js
- **Email:** Resend

---

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL (or use SQLite for local dev)

### Setup

```bash
# Clone the repo
git clone <your-repo-url>
cd finder-force

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed sample data
npm run db:seed

# Start dev server
npm run dev
```

Open http://localhost:3000

### Default Login
- Email: `admin@finderforce.com`
- Password: `admin123`

---

## Deploy to Heroku

### 1. Create Heroku App

```bash
# Login to Heroku
heroku login

# Create app
heroku create finder-force-awards

# Add PostgreSQL
heroku addons:create heroku-postgresql:essential-0
```

### 2. Set Environment Variables

```bash
heroku config:set NEXTAUTH_SECRET="your-production-secret-key"
heroku config:set NEXTAUTH_URL="https://your-app-name.herokuapp.com"

# Optional: For email sending
heroku config:set RESEND_API_KEY="re_your_api_key"
heroku config:set EMAIL_FROM="Finder Force <awards@yourdomain.com>"
```

### 3. Deploy

```bash
# Add Heroku remote
heroku git:remote -a finder-force-awards

# Push to Heroku
git push heroku main

# Run database seed (optional)
heroku run npm run db:seed
```

### 4. Open Your App

```bash
heroku open
```

---

## Deploy to Vercel (Alternative)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/finder-force.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Add environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string (use [Neon](https://neon.tech) or [Supabase](https://supabase.com) for free PostgreSQL)
   - `NEXTAUTH_SECRET` - A random secret string
   - `NEXTAUTH_URL` - Your Vercel URL
   - `RESEND_API_KEY` - (Optional) For email sending

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | Random secret for auth | ✅ |
| `NEXTAUTH_URL` | Your app's URL | ✅ |
| `RESEND_API_KEY` | Resend API key for emails | Optional |
| `EMAIL_FROM` | Sender email address | Optional |

---

## Email Setup (Resend)

1. Sign up at [resend.com](https://resend.com) (free: 100 emails/day)
2. Get your API key
3. Add to environment variables:
   ```
   RESEND_API_KEY=re_your_api_key
   ```

Without the API key, judge invite links will be displayed in the UI for manual sharing.

---

## License

MIT

