# FreedomGuard Config Hub

[cloudflarebutton]

A resilient, sophisticated configuration aggregator for V2Ray/Xray clients, featuring a native-app-like interface for fetching and managing anti-censorship keys. FreedomGuard is a high-performance, resilient Progressive Web Application (PWA) designed to serve as a centralized hub for fetching, aggregating, and managing censorship-resistant VPN configurations (VLESS, VMESS, Trojan). Built specifically for users in restrictive network environments (like Iran), it mimics the user experience of a native VPN application while operating within the browser's capabilities.

## Features

- **Native VPN App Experience**: Large, pulsating "Activate" button with real-time status updates (Scanning, Ready, Offline).
- **Intelligent Config Fetching**: Aggregates from multiple resilient sources (GFW-Slayer Iran/China/Russia/Global, community lists) via Cloudflare Worker proxy to bypass CORS.
- **Advanced Parsing**: Handles JSON profiles, Base64-encoded subscriptions, and standard VLESS/VMESS/Trojan schemes with deduplication.
- **Export Options**: One-tap "Copy All" to clipboard, QR code generation for v2rayNG import.
- **Persistent Storage**: Configurations cached in localStorage for offline access.
- **Cyberpunk-Minimalist UI**: Dark theme with neon accents, smooth animations, mobile-first responsive design.
- **Views**: Dashboard (Home), Config Manager (detailed list/QR), Settings (source management).
- **Proxy Reliability**: Cloudflare Worker handles flaky GitHub fetches with CORS stripping.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion (animations), Lucide React (icons), Zustand (state), react-qr-code, js-base64
- **Backend/Proxy**: Cloudflare Workers, Hono
- **UI/UX**: Responsive design, PWA-ready, Theme toggle (light/dark), Sonner (toasts), React Router
- **Data**: TanStack Query, Zod (validation), localStorage persistence
- **Dev Tools**: ESLint, Bun

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (package manager)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (for deployment)
- Node.js (for some dev deps, but Bun primary)

### Installation

1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd freedom_guard_hub
   ```

2. Install dependencies:
   ```
   bun install
   ```

### Development

1. Start the development server:
   ```
   bun run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or configured PORT).

2. In a new terminal, for Worker proxy testing (optional):
   ```
   wrangler dev
   ```

### Building

```
bun run build
```

Preview production build:
```
bun run preview
```

## Usage

1. **Dashboard**: Tap "ACTIVATE" to fetch configs. Watch real-time logs.
2. **Copy & Import**: "Copy All" → Switch to v2rayNG → "Import Config from Clipboard".
3. **Config Manager**: View individual keys, generate QR codes.
4. **Settings**: Toggle regions (Iran/China/Russia/Global), add custom URLs.

The app proxies fetches through `/api/proxy?url=<target>` to handle CORS.

## Deployment

Deploy to Cloudflare Workers/Pages with one command:

```
bun run deploy
```

This builds the frontend assets and deploys the Worker (including proxy routes).

[cloudflarebutton]

**Note**: Ensure you're logged in with `wrangler login` and have a Cloudflare account. The Worker handles `/api/*` routes automatically.

## Architecture

```
Client (React/Zustand) → Cloudflare Worker (/api/proxy) → GitHub Subscriptions
↓
Parsed Configs → localStorage + UI Display (Copy/QR)
```

- **Worker Routes**: Add custom endpoints in `worker/userRoutes.ts`.
- **Frontend Routing**: React Router in `src/main.tsx`.
- **State**: Zustand with persistence for configs/status.

## Contributing

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit changes (`git commit -m 'Add some AmazingFeature'`).
4. Push (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.