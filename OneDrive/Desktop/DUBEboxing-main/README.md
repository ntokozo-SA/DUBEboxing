# Dube Boxing Club

A modern, responsive boxing club website built with React. Includes a public site and an admin dashboard for content management — all running in the browser with no backend server.

## Features

### Public Website
- **Home Page**: Full-width autoplay video with welcome text
- **Events Page**: Grid layout displaying event posters
- **Gallery Page**: Images with category filtering and club history
- **Team Page**: Team member profiles
- **Contact Page**: Contact details with WhatsApp integration
- **Floating WhatsApp Button**: Visible on all public pages

### Admin Dashboard
- **Currently disabled** — requires a backend server (events, gallery, team management, settings, analytics)
- Visiting `/admin` shows an unavailable notice and links back to the public site

## Tech Stack

- **React 19** — UI framework
- **TailwindCSS** — Styling
- **React Router** — Navigation
- **localStorage** — Client-side data persistence

## Project Structure

```
DUBEboxing-main/
├── client/                 # React frontend (entire app)
│   ├── public/             # Static assets (videos, images)
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Public and admin pages
│       ├── services/       # Data layer (api.js, storage.js)
│       └── utils/          # Helpers (image URL resolver)
└── package.json            # Root scripts (proxies to client)
```

## Quick Start

### Prerequisites
- Node.js v16 or higher
- npm

### Installation

```bash
cd client
npm install
```

### Development

From the project root:

```bash
npm run dev
```

Or from the `client` folder:

```bash
npm start
```

- Public website: http://localhost:3000
- Admin panel: disabled at `/admin` (no backend connected)

## Data Storage

All content (events, gallery, team, settings, analytics) is stored in the browser's **localStorage**. This means:

- Data persists per browser/device
- Clearing browser data removes admin content
- No server or database is required
- Deploy as a static site (Netlify, Vercel, GitHub Pages, etc.)

For production sites with shared content across users, consider migrating to a headless CMS or Firebase/Supabase later.

## Deployment

Build the static site:

```bash
npm run build
```

Deploy the `client/build` folder to any static hosting provider.

## License

MIT License
