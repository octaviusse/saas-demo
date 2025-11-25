# Mini SaaS Dashboard Demo

A static SaaS dashboard demo application that generates business metrics from a SQLite database at build-time. Built with React, Vite, Tailwind CSS, and deployed on PivoCloud.

## Features

- 📊 **Real-time Metrics**: MRR, Active Customers, Subscriptions, and Invoice counts
- 📋 **Invoice Management**: View latest invoices with status tracking
- 📝 **Activity Feed**: Monitor recent system events
- 🎨 **Dark Theme**: Modern UI with Tailwind CSS dark mode
- 🚀 **Static Deployment**: No runtime database connections
- 📈 **Optional Analytics**: PostHog integration for tracking

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Database**: SQLite 3 (build-time only)
- **Testing**: Vitest, React Testing Library
- **Analytics**: PostHog (optional)

## Quick Start

See [quickstart.md](specs/001-saas-dashboard-demo/quickstart.md) for detailed setup instructions.

```bash
# Install dependencies
npm install

# Create database and seed data
sqlite3 demo.db < schema.sql
node scripts/seed-database.js

# Generate mock data
npm run generate-data

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Docker build and build-time data generation

The Docker image is built in a multi-stage process. During the build, the repository will:

- Create a fresh `demo.db` with the sqlite schema (using `schema.sql`).
- Run `node scripts/seed-database.js` to populate the database with deterministic demo data.
- Generate `src/mockData.json` by executing `node generate-mock-data.js` so that the final `dist` bundle contains a static snapshot of metrics and recent events.

Important notes:

- The local `demo.db` is intentionally excluded from the build context (see `.dockerignore`) to avoid non-deterministic builds from developer files.
- If you need to inspect the generated database for debugging, run the seed and generate steps locally (see Quick Start above).
- To produce deterministic builds in CI, make sure `npm ci` and the build args are provided to the Docker build step.


## Project Structure

```
/
├── src/
│   ├── components/       # React components
│   ├── services/         # Analytics and utilities
│   ├── types/            # TypeScript definitions
│   └── mockData.json     # Generated at build-time
├── tests/                # Vitest tests
├── specs/                # Feature specifications
├── demo.db              # SQLite database (build-time)
└── generate-mock-data.js # Data generation script
```

## Documentation

- [Feature Specification](specs/001-saas-dashboard-demo/spec.md)
- [Implementation Plan](specs/001-saas-dashboard-demo/plan.md)
- [Data Model](specs/001-saas-dashboard-demo/data-model.md)
- [Quickstart Guide](specs/001-saas-dashboard-demo/quickstart.md)

## License

MIT
