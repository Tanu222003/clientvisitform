# Park Solitaire Client Visit CRM

Production-ready Real Estate CRM web application featuring multi-property sales desks, site visit management, real-time sync, and analytics.

---

## Architecture Overview

```
 ┌─────────────────────────────────────────────────────────────┐
 │                      User's Browser                         │
 └──────────────┬──────────────────────────────┬───────────────┘
                │                              │
                │ 1. Frontend UI & Assets      │ 2. API Calls (/api/*)
                ▼                              ▼
 ┌──────────────────────────────┐ ┌──────────────────────────────┐
 │       VERCEL (Frontend)      │ │      RAILWAY (Backend)       │
 │   - React + Vite SPA         │ │   - Node.js + Express API    │
 │   - Edge Rewrites (/api/*) ──┼─┼─► - Health Check: /api/health│
 │   - Static Asset Caching     │ │   - PostgreSQL or File-JSON  │
 └──────────────────────────────┘ └──────────────────────────────┘
```

- **Frontend on Vercel**: High-speed CDN edge delivery for the React + Vite single-page application. All `/api/*` traffic is proxied directly to Railway via `vercel.json` rewrites (eliminating CORS and simplifying domain management).
- **Backend on Railway**: Express API handling visit records, site visits, authentication, multi-device synchronization, and database operations (`PostgreSQL` with fallback to persistent JSON storage).

---

## 1. Hosting Backend on Railway

The backend server is located in `server/` and entry point is `server/index.js`. Railway configuration is defined in [`railway.json`](./railway.json) and [`Dockerfile`](./Dockerfile).

### Option A: Deploy via GitHub (Recommended)
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "Configure Railway backend & Vercel frontend"
   git push origin main
   ```
2. Log in to [Railway](https://railway.app).
3. Click **+ New Project** > **Deploy from GitHub repo**.
4. Select your repository (`park-solitaire-client-app`).
5. Railway will automatically detect [`railway.json`](./railway.json) (Nixpacks builder) and deploy.
6. In your Railway service settings:
   - Go to **Settings** > **Networking** > click **Generate Domain** (e.g. `https://your-backend.up.railway.app`).
   - (Optional) Click **+ New** in the project canvas > **Database** > **Add PostgreSQL**. Railway will automatically link the database and inject `DATABASE_URL`.
7. Verify deployment:
   ```bash
   curl https://<your-railway-domain>.up.railway.app/api/health
   ```
   Expected response: `{"status":"ok", ...}`

### Option B: Deploy via Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway init

# Deploy
railway up
```

---

## 2. Hosting Frontend on Vercel

The frontend is built with React and Vite, outputting to `dist/`. [`vercel.json`](./vercel.json) routes SPA paths to `/index.html` and forwards `/api/*` to Railway.

### Option A: Deploy via GitHub (Recommended)
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository (`park-solitaire-client-app`).
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**:
   - `VITE_API_URL` = `/api`
   - `VITE_BACKEND_URL` = `https://<your-railway-domain>.up.railway.app/api`
6. Click **Deploy**.

### Option B: Deploy via Vercel CLI
```bash
# Deploy to preview
npx vercel

# Deploy to production
npx vercel --prod
```

> **Note on API proxying**: If your Railway domain changes, update the destination in [`vercel.json`](./vercel.json):
> ```json
> {
>   "source": "/api/:path*",
>   "destination": "https://<your-railway-domain>.up.railway.app/api/:path*"
> }
> ```

---

## 3. Environment Variables

See [`.env.example`](./.env.example) for reference:

| Variable | Platform | Description | Example |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Vercel | Base API path | `/api` |
| `VITE_BACKEND_URL` | Vercel | Direct Railway URL fallback | `https://park-solitaire-crm-production.up.railway.app/api` |
| `PORT` | Railway | Server port (auto-set by Railway) | `5001` or `8080` |
| `DATABASE_URL` | Railway | PostgreSQL connection string | `postgresql://...` |
| `DATA_DIR` | Railway | Path for file-backed storage | `./server/data` |

---

## 4. Local Development

Run frontend and backend simultaneously:

```bash
# Terminal 1: Backend Server (Port 5001)
npm run server

# Terminal 2: Vite Dev Server (Port 5173)
npm run dev
```

Run test suite:
```bash
npm test
```

Build for production:
```bash
npm run build
```
