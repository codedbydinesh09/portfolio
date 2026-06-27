# Dinesh Portfolio CMS

A premium, Neumorphic Portfolio Management System built with React 19, TypeScript, Vite, and Supabase.
Every visible part of the portfolio is editable directly through the secure Admin Dashboard without touching any code.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4, Vanilla CSS (neumorphism design tokens)
- **Animations:** Framer Motion
- **Backend/Database:** Supabase (Auth, PostgreSQL, Storage)
- **Routing:** React Router v7
- **Notifications:** React Hot Toast

## Features

- 🎨 Neumorphic design system
- 🔒 Secure admin dashboard
- 📁 File uploads via Supabase Storage
- 📝 Full CMS for Hero, About, Skills, Projects, Certificates, and Contact sections
- ⚡ Real-time updates via Supabase Realtime

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

## Environment Setup

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and set:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_anon_key_here
VITE_ADMIN_SECRET=your_admin_secret_here
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

## Supabase Database Setup

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and open your project.
2. Click **SQL Editor** in the left sidebar and create a **New query**.
3. Copy the contents of `supabase_setup.sql` (included in this repo) and run it.
4. This creates all required tables (`profile`, `skills`, `projects`, `certificates`, `contact`) and configures Row Level Security policies.

## Supabase Storage Setup

1. In your Supabase dashboard, go to **Storage**.
2. Create a new bucket named **`portfolio`** and set it to **Public**.
3. In the SQL Editor, run the following to allow uploads:

```sql
CREATE POLICY "Public access to portfolio bucket" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "Admin can upload to portfolio bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio');
CREATE POLICY "Admin can update files in portfolio bucket" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio');
CREATE POLICY "Admin can delete files from portfolio bucket" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio');
```

## Admin User Setup

1. In Supabase, go to **Authentication → Providers** and ensure **Email** is enabled.
2. Optionally disable **Confirm email** for easier local testing.
3. Go to **Authentication → Users** and click **Add user → Create new user**.
4. Enter your admin email and a strong password.

## Running Locally

```bash
npm install
npm run dev
```

Visit:
- Portfolio: `http://localhost:5173`
- Admin panel: `http://localhost:5173/admin/login`

## Building for Production

```bash
npm run build
```

The output will be in the `dist/` folder.

## Deployment

You can deploy the `dist/` folder to any static hosting service:

- **Vercel:** Connect your GitHub repo and set environment variables in the Vercel dashboard.
- **Netlify:** Drag and drop the `dist/` folder or connect your GitHub repo. Set environment variables in Site Settings.
- **Cloudflare Pages:** Connect your GitHub repo and add environment variables.

> Make sure to configure your Supabase project's **Allowed Origins** in the Supabase Dashboard under **Authentication → URL Configuration** to include your deployed domain.

## Technologies Used

| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS v4 | Utility Styling |
| Framer Motion | Animations |
| Supabase | Auth, Database, Storage |
| React Router v7 | Client-side Routing |
| React Hot Toast | Notifications |
| React Icons | Icon Library |

## License

MIT — see [LICENSE](./LICENSE) for details.
