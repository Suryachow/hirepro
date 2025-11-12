Vercel deployment guide for this project

This document shows how to deploy the frontend to Vercel and options for hosting a backend (MongoDB + API). The frontend is a Vite React app located in the `project/` folder.

Quick summary

- Frontend: deploy `project/` to Vercel as a static site using the `build` script (`vite build`) which outputs to `dist/`.
- Backend: this repo doesn't contain a production backend. You can either:
  - Deploy serverless functions on Vercel (in a `/api` folder) that connect to MongoDB Atlas (recommended for small backends).
  - Deploy a separate Node/Express app to Render/Heroku/AWS/Google Cloud and set `VITE_API_URL` to that URL.

Prerequisites

- A Vercel account and Git repository with this code.
- A MongoDB Atlas cluster and connection string (if you host a backend that uses MongoDB).

Frontend deployment steps (recommended)

1. Push your repo to GitHub, GitLab, or Bitbucket.
2. Go to vercel.com and import the project repository.
3. When Vercel asks for project settings:
   - Framework Preset: Other (Vite)
   - Root Directory: project
   - Build Command: npm run build
   - Output Directory: dist
4. Add Environment Variable in Vercel (under Settings → Environment Variables):
   - Key: VITE_API_URL
   - Value: the URL of your API (for local testing you can use http://localhost:3001/api but production should be a reachable backend)
   - Set for Production (and Preview if you want preview deployments)
5. Deploy. Vercel will run `npm install` in the `project/` directory, then `npm run build` and publish the `dist/` folder.

Notes about Vite env vars

- Vite exposes environment variables prefixed with `VITE_` to the client. `VITE_API_URL` is used in the frontend `project/src/services/api.ts`. Make sure you set it in Vercel.

Backend options

Option A — Serverless functions on Vercel (good for small to medium APIs)

- Create an `api/` folder in this repository (at root or inside `project/`) and add Node serverless functions (e.g., `api/auth/login.js`, `api/jobs/index.js`).
- Use the MongoDB Atlas connection string as an environment variable (e.g., `MONGODB_URI`).
- Vercel will deploy each file in `api/` as a serverless function at `https://<your-vercel>.vercel.app/api/<name>`.

Pros: Simple, single deploy; scales automatically for many use-cases.
Cons: Cold-starts and execution limitations — for heavier backends a dedicated server may be better.

Option B — Separate Node/Express app (recommended for complex backends)

- Create a separate Node app (can be in this repo under `/backend`) using Express, connect to MongoDB Atlas, and deploy to Render, Railway, Fly.io, or a VM.
- Set `VITE_API_URL` in Vercel to the external API URL.

Example environment variables for backend

- MONGODB_URI: mongodb+srv://<user>:<password>@cluster0.mongodb.net/hirepro?retryWrites=true&w=majority
- JWT_SECRET: a long, random string
- NODE_ENV: production

Next steps

- If you'd like, I can scaffold a minimal backend (Express + Mongoose) that implements the endpoints the frontend expects (/auth, /jobs, /applications, /pipelines). Tell me if you prefer serverless functions on Vercel or a separate Express app and whether to wire up MongoDB Atlas (you can paste your connection string later).
