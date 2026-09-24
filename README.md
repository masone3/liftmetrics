# Liftmetrics
 
A full-stack workout planner SaaS app — plan workouts, log training sessions, and track progress over time with real data visualizations.
 
**Live demo:** [https://liftmetrics.onrender.com](https://liftmetrics.onrender.com) *(replace with your actual frontend URL)*
**API:** [https://liftmetrics-api.onrender.com](https://liftmetrics-api.onrender.com) *(replace with your actual backend URL)*
 
> Note: this project runs on Render's free tier, so the backend may take 30–60 seconds to "wake up" on the first request after a period of inactivity.
 
---
 
## Overview
 
Liftmetrics lets users create workout templates, log real training sessions (sets, reps, weight), and visualize their progress over time — built as a hands-on project to learn a full production-shaped stack: relational data modeling, JWT authentication, and real deployment, from scratch, day by day.
 
## Features
 
- **Authentication** — secure registration/login with bcrypt password hashing and JWT sessions
- **Workout templates** — create reusable workouts with any number of exercises
- **Session logging** — log real training sessions with sets, reps, and weight, tied to a specific date
- **History** — browse past sessions with date-range filtering
- **Progress charts** — training volume over time (Recharts) and per-exercise max-weight progression (Chart.js)
- **Full CRUD** — edit and delete workouts, exercises, and logged sessions, with confirmation dialogs
- **Responsive design** — usable on mobile as well as desktop
- **Toast notifications & clean error handling** — including automatic session-expiry handling
## Tech Stack
 
**Frontend**
- React (Vite)
- React Router
- React Hook Form
- Day.js
- Recharts + Chart.js
**Backend**
- Express
- Prisma ORM
- PostgreSQL
**Authentication**
- JWT (jsonwebtoken)
- bcrypt
**Testing**
- Vitest + Supertest (backend)
- Vitest + React Testing Library (frontend)
**Deployment**
- Render (frontend static site + backend web service)
- Neon (serverless PostgreSQL, separate dev/production databases)
## Screenshots
 
*(Add a few screenshots or a short GIF here — Dashboard with charts, Workout detail, and the mobile view all make good choices.)*
 
```
![Dashboard](./docs/screenshots/dashboard.png)
![Workout Detail](./docs/screenshots/workout-detail.png)
```
 
## Data Model
 
```
User 1---* Workout
Workout 1---* Exercise
User 1---* WorkoutLog
WorkoutLog *---1 Workout
WorkoutLog 1---* SetEntry
SetEntry *---1 Exercise
```
 
- **User** — account/auth info
- **Workout** — a reusable template (e.g. "Push Day")
- **Exercise** — belongs to a Workout template
- **WorkoutLog** — a specific session a user actually performed
- **SetEntry** — reps/weight logged against an exercise within a session
## Project Structure
 
```
liftmetrics/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── api/         # API client + resource-specific request functions
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth + Toast context providers
│   │   ├── hooks/       # Custom hooks (useFetch, etc.)
│   │   └── pages/       # Route-level page components
│   └── ...
├── server/              # Express backend
│   ├── src/
│   │   ├── routes/      # Express route handlers
│   │   ├── middleware/  # Auth, error handling, rate limiting
│   │   ├── lib/         # Prisma client instance
│   │   └── app.js / server.js
│   ├── prisma/          # Schema + migrations
│   └── ...
├── docker-compose.yml   # Local Postgres for development/testing
└── README.md
```
 
## Getting Started (Local Development)
 
### Prerequisites
- Node.js 18+
- Docker (for local Postgres)
- A free [Neon](https://neon.tech) account (or use local Docker Postgres for everything)
### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/liftmetrics.git
cd liftmetrics
```
 
### 2. Start local Postgres
```bash
docker compose up -d
```
 
### 3. Backend setup
```bash
cd server
npm install
cp .env.example .env   # then fill in your own values, see below
npx prisma generate
npx prisma migrate dev
npm run dev
```
API runs at `http://localhost:5001`.
 
### 4. Frontend setup
```bash
cd client
npm install
cp .env.example .env   # then fill in your own values, see below
npm run dev
```
App runs at `http://localhost:5173`.
 
## Environment Variables
 
**`server/.env`**
| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string (local Docker or Neon) |
| `JWT_SECRET` | Random secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `15m` |
| `NODE_ENV` | `development` / `production` / `test` |
| `CLIENT_URL` | Deployed frontend URL, for CORS |
| `PORT` | Server port (Render sets this automatically in production) |
 
**`client/.env`**
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |
 
## Running Tests
 
**Backend:**
```bash
cd server
DATABASE_URL="your_local_test_db_url" npx vitest run
```
 
**Frontend:**
```bash
cd client
npm run test
```
 
## Deployment
 
- **Database:** Neon, with separate development and production projects/branches
- **Backend:** Render Web Service, root directory `server`, build command `npm install && npx prisma generate`
- **Frontend:** Render Static Site, root directory `client`, build command `npm install && npm run build`, publish directory `dist`, with a rewrite rule (`/*` → `/index.html`) to support client-side routing
## Possible Future Additions
 
- Social sharing of workout templates
- A public template marketplace
- AI-generated workout programs
- Refresh tokens for longer sessions
- CI/CD via GitHub Actions running the existing test suite on every push
## License
 
MIT
 
