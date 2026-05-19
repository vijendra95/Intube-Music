# IntubeMedia.live - 24/7 YouTube Live Streaming Platform

Stream your pre-recorded videos 24/7 on YouTube, Facebook, Twitch and more — without keeping your PC on.

## Features

- **24/7 Non-Stop Streaming** — Loop pre-recorded videos continuously as live streams
- **Multi-Platform** — YouTube, Facebook, Twitch, Custom RTMP simultaneously
- **Video Gallery** — Upload MP4, MOV, AVI, WebM with drag-and-drop
- **Stream Designer** — Logo watermarks, overlays, lower-thirds
- **Smart Auto-Restart** — Automatic restart on failure
- **Live Analytics** — Views, watch time, concurrent viewers
- **Subscription Plans** — Basic (₹559/mo), Popular (₹699/mo), Custom (₹399+)
- **Referral System** — Earn 10% commission on referrals
- **Admin Panel** — User management, stream health monitoring
- **Mobile-First** — Fully responsive dark-themed design

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, TailwindCSS, Lucide Icons
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Streaming:** FFmpeg, RTMP
- **Payments:** Razorpay
- **Auth:** JWT, Google OAuth

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB
- FFmpeg

### Setup

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
cp .env.example .env
npm install
node server.js
```

### Docker

```bash
docker-compose up -d
```

## Project Structure

```
intubemedia-live/
├── frontend/              Next.js app
│   ├── src/app/
│   │   ├── page.tsx            Landing page
│   │   ├── (auth)/            Login, Register, Forgot Password
│   │   ├── dashboard/         User dashboard
│   │   │   ├── videos/        Video gallery
│   │   │   ├── streams/       Live streams
│   │   │   ├── subscription/  Plans
│   │   │   ├── referral/      Referral & Earn
│   │   │   ├── payments/      Payment history
│   │   │   └── settings/      Account settings
│   │   └── admin/             Admin panel
├── backend/               Express API
│   ├── routes/            API routes
│   ├── models/            MongoDB schemas
│   ├── middleware/        Auth middleware
│   └── services/          FFmpeg, RTMP, Payments
└── docker-compose.yml
```

## License

Private — All rights reserved.
