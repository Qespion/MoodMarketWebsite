# MoodMarket Website

AI-powered SEC filing analysis and investment insights SaaS platform.

## Tech Stack

- **Framework**: Next.js 15 (Static Export)
- **Styling**: Tailwind CSS
- **State**: Zustand + React Query
- **API Client**: Axios
- **Icons**: Lucide React

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
```

Static files will be generated in the `out/` directory.

## Deploy on Coolify

### Method 1: Docker (Recommended)

1. **Push to Git repository** (GitHub, GitLab, etc.)

2. **In Coolify**:
   - Create new application → Select repository
   - Coolify will auto-detect Dockerfile
   - Set environment variable (optional):
     ```
     NEXT_PUBLIC_API_BASE_URL=http://iw0g4808sw8ks4oco0k4gwsg.158.69.200.14.sslip.io
     ```
   - Deploy

### Method 2: Static Build

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **In Coolify**:
   - Create Static Site
   - Upload `out/` directory contents
   - Set build command: `npm run build`
   - Set output directory: `out`

## API Configuration

The API endpoint is configured via environment variable:

```env
NEXT_PUBLIC_API_BASE_URL=http://iw0g4808sw8ks4oco0k4gwsg.158.69.200.14.sslip.io
```

## Features

- 📊 Real-time SEC filing analysis feed
- 🔍 Advanced filters (recommendation, sentiment, significance, relevance)
- 📈 Company screener
- 📉 Analytics dashboard
- 🌙 Dark mode support
- 📱 Fully responsive design

## License

MIT
