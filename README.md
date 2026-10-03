# SessionTest

A full-stack TypeScript application for testing and validating session-based authentication flows.

## Overview

Provides a comprehensive environment to test user sessions, token expiry, concurrent sessions, and edge cases in auth workflows.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Auth | NextAuth.js / custom session handling |
| Testing | Jest, Playwright |

## Features

- Session management -- create, refresh, and invalidate sessions
- Expiry testing -- test token expiration scenarios
- Concurrent sessions -- handle multiple active sessions
- Security scenarios -- CSRF, replay attack testing
- Session analytics -- track active sessions

## Getting Started

```bash
git clone https://github.com/atharvez/SessionTest.git
cd SessionTest
npm install
cp .env.example .env.local
npm run dev
```

## License

MIT (c) Atharva Desai