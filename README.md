# SessionTest ðŸ§ª

A full-stack TypeScript application for testing and validating session-based authentication flows.

## Overview

SessionTest provides a comprehensive environment to test user sessions, token expiry, concurrent sessions, and edge cases in auth workflows.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Auth | NextAuth.js / custom session handling |
| Testing | Jest, Playwright |

## Features

- ðŸ” **Session Management** â€” Create, refresh, and invalidate sessions
- â±ï¸ **Expiry Testing** â€” Test token expiration scenarios
- ðŸ‘¥ **Concurrent Sessions** â€” Handle multiple active sessions
- ðŸ›¡ï¸ **Security Scenarios** â€” CSRF, replay attack testing
- ðŸ“Š **Session Analytics** â€” Track active sessions

## Getting Started

```bash
git clone https://github.com/atharvez/SessionTest.git
cd SessionTest
npm install
cp .env.example .env.local
npm run dev
```

## License

MIT Â© [Atharva Desai](https://github.com/atharvez)