# Neuro — Brain Training Web App (v1)

This repository contains a minimal Next.js + TypeScript starter for the Neuro brain-training web app with Tailwind CSS.

Quick start

1. Install dependencies

```powershell
cd c:\Users\Abdulla\Neuro
npm install
```

2. Run development server

```powershell
npm run dev
```

Open http://localhost:3000

What I added

- `app/` — Next.js App Router pages and layout
- `components/` — reusable UI components (Navbar, Footer, GameCard, StatCard)
- `lib/mockData.ts` — mock games and user data (change values here)
- `styles/globals.css` — Tailwind imports and base styles
- Tailwind/PostCSS and TypeScript configs

How to change mock data

- Edit `lib/mockData.ts` to update games, tags, difficulties, or the mock user.

Notes

- Tailwind must be installed locally (package.json includes devDependencies). Run `npm install` before `npm run dev`.
- This is a first-version scaffold: game Play buttons are placeholders linking to `/games`.
