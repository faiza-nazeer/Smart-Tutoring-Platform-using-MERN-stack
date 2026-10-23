# eTutor: Smart Tutoring Platform (MERN)

A full-stack tutoring marketplace where students find tutors and book sessions, tutors manage their courses and sessions, and admins manage the platform.

**Live demo:** _add your Vercel link here_  
**API:** _add your Render link here_ (`/api/health` returns `{"status":"ok"}`)

> The free-tier backend sleeps when idle, so the first request after a quiet period can take up to about a minute.

## Features

- **Students:** browse tutors and courses, book sessions, view session history, edit profile
- **Tutors:** dashboard, manage own courses, confirm or complete sessions, view reviews
- **Admins:** manage users, tutors, courses and bookings; earnings charts; contact inbox
- **Auth:** JWT login/signup, bcrypt password hashing, role-based access on both API and UI routes

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router, Recharts |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB Atlas |
| Security | JWT, bcryptjs, helmet, CORS allow-list, login rate limiting |

## Demo accounts

After running `npm run seed` (see below), all use the password `Demo@12345`:

| Role | Email |
|---|---|
| Admin | admin@etutor.demo |
| Student | student@etutor.demo |
| Tutor | ayesha@etutor.demo |

## Run locally

```bash
# 1. Backend
cd backend
cp .env.example .env        # fill in MONGO_URI and a long random JWT_SECRET
npm install
npm run seed                # optional: creates demo accounts and sample data
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal, project root)
npm install
npm run dev                 # http://localhost:5173
```

## Environment variables

**Backend (`backend/.env`)**

| Name | Purpose |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `CLIENT_URL` | Frontend origin(s) allowed by CORS, comma-separated |
| `PORT` | Optional; hosts like Render set this automatically |

**Frontend (set in Vercel/Netlify)**

| Name | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base URL, e.g. `https://your-api.onrender.com/api` |

## Deploying

1. **MongoDB Atlas:** Network Access → allow `0.0.0.0/0`; create a database user.
2. **Backend → Render** (Web Service): root directory `backend`, build `npm install`, start `npm start`; set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.
3. **Frontend → Vercel:** build `npm run build`, output `dist`; set `VITE_API_URL`. `vercel.json` handles client-side routing.
4. Set `CLIENT_URL` on Render to the Vercel URL, then redeploy the backend.
5. Run `npm run seed` once (locally, pointed at the Atlas database) to create demo accounts.

## API overview

| Area | Access |
|---|---|
| `POST /api/auth/register`, `/login` | Public (rate limited). Signup can only create student or tutor accounts. |
| `GET /api/courses`, `/reviews` | Public |
| `GET /api/users` | Public, but emails and phone numbers are hidden unless you're an admin or the user themself |
| `/api/bookings` | Logged in; users only see their own bookings, admins see all |
| `POST/PUT/DELETE /api/courses` | Tutor (own courses) or admin |
| `/api/users` writes, `GET /api/contact` | Admin (users can edit their own profile) |

## Known limitations

- Password reset by email is not implemented (the endpoint is disabled by default because an email-only reset would let anyone take over an account).
- Payments are not integrated; session prices are displayed only.
- The student "My Courses" page currently shows sample data.
