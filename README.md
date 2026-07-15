# AI Meal Planner

Generate 3 recipe options + nutrition estimate + shopping list from ingredients you have. Groq-powered.

GenAI role: constrained creative generation + structured JSON output.

## Stack

- Frontend: Next.js 14 (App Router) + Tailwind CSS
- Backend: Node.js + Express
- GenAI: Groq API (llama-3.3-70b-versatile)
- DB: MongoDB (saved favorites)
- Validation: Zod (enforces JSON shape returned by LLM)

## Folder structure
## Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier) or local Mongo
- Groq API key → https://console.groq.com/keys

## Setup

### 1. Backend

```bash
cd meal_planner
cd backend
npm install
```

Fill `.env`:

Run:
```bash
npm run dev
```
Server → `http://localhost:5000`

### 2. Frontend

If not scaffolded yet:
```bash
cd meal_planner
cd frontend
npx create-next-app@latest . --js --tailwind --app --no-src-dir --import-alias "@/*"
```

```bash
npm install
```

Fill `.env.local`:

Run:
```bash
npm run dev
```
App → `http://localhost:3000`

## Full run process (2 terminals)

```bash
# Terminal 1 — backend
cd meal_planner/backend
npm install
npm run dev

# Terminal 2 — frontend
cd meal_planner/frontend
npm install
npm run dev
```

Open `http://localhost:3000`. Start backend before frontend.

## Usage

1. Open app
2. Add ingredients (type + Enter)
3. Pick dietary restriction
4. Click "Generate Recipes"
5. Save favorites → view at `/favorites`

## API endpoints

| Method | Route | Body/Query |
|---|---|---|
| POST | `/api/generate-recipes` | `{ ingredients: [], restriction: "" }` |
| POST | `/api/favorites` | recipe object + `sessionId` |
| GET | `/api/favorites?sessionId=` | — |
| DELETE | `/api/favorites/:id` | — |

## Notes

- Nutrition values are AI estimates, not lab-verified.
- No auth in v1 — favorites tied to `sessionId` in browser localStorage.
- Rate limit: 20 generate calls / 15 min / IP.

