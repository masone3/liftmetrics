# Liftmetrics

A full-stack workout planner SaaS app — plan workouts, log training sessions, and track progress over time with data visualizations.

## Tech Stack

**Frontend**
- React
- React Router
- React Hook Form

**Backend**
- Express
- Prisma
- PostgreSQL

**Authentication**
- JWT
- bcrypt

**Data Visualization**
- Chart.js
- Recharts
- Day.js

**Deployment**
- Railway / Render (backend)
- Neon PostgreSQL (database)

## Data Model
User 1---* Workout
Workout 1---* Exercise
User 1---* WorkoutLog
WorkoutLog ---1 Workout
WorkoutLog 1--- SetEntry
SetEntry *---1 Exercise


- **User** — account/auth info
- **Workout** — a reusable template (e.g. "Push Day")
- **Exercise** — belongs to a Workout template
- **WorkoutLog** — a specific session a user actually performed
- **SetEntry** — reps/weight logged against an exercise within a session

## MVP Scope

- [ ] User registration & login (JWT + bcrypt)
- [ ] Create/edit workout templates
- [ ] Log workout sessions (sets, reps, weight)
- [ ] View workout history
- [ ] Progress charts (Chart.js / Recharts)

**Not in MVP (future):** social sharing, AI-generated programs, mobile app, template marketplace.

## Project Structure
liftmetrics/
├── client/ # React frontend
├── server/ # Express backend
└── README.md

## Getting Started

_Setup instructions coming in Day 2 (tooling) and Day 3 (environment config)._

## Roadmap

Built incrementally, day by day — see project notes for the full build plan.