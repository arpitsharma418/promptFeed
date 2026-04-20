# PromptFeed

PromptFeed is a full-stack app for publishing, discovering, and reusing AI prompts.

The project uses a React frontend and an Express/MongoDB API. Users can create accounts, publish prompts, browse community submissions, like prompts, copy them for reuse, and manage their own profile and prompt library.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Auth: JWT in HTTP-only cookies, bcryptjs
- Client HTTP: Axios

## Repository Layout

```text
.
├─ backend/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ package.json
│  └─ server.js
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ pages/
│  │  ├─ App.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  ├─ package.json
│  └─ vite.config.js
└─ README.md
```

## Features

- Cookie-based JWT authentication
- Prompt creation, editing, and deletion
- Explore page with search, category filtering, and sort options
- Likes and usage tracking
- Prompt detail pages with copy-to-clipboard support
- User profile editing
- Responsive UI with light and dark theme support

## Requirements

- Node.js 18+
- npm
- MongoDB Atlas cluster or a local MongoDB instance

## Local Development

### 1. Clone and install

```bash
git clone <your-repo-url>
cd prompt-directory
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies in a second terminal:

```bash
cd frontend
npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the app

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## API Overview

### Auth

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create a new user, set auth cookie, and return user info |
| `POST` | `/api/auth/login` | Authenticate, set auth cookie, and return user info |
| `POST` | `/api/auth/logout` | Clear the auth cookie |
| `GET` | `/api/auth/me` | Get the current authenticated user |
| `PUT` | `/api/auth/profile` | Update profile fields |

### Prompts

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/prompts` | List prompts with optional search, category, and sort query params |
| `GET` | `/api/prompts/stats/overview` | Public stats for homepage counts |
| `GET` | `/api/prompts/:id` | Get a prompt by id |
| `POST` | `/api/prompts` | Create a prompt |
| `PUT` | `/api/prompts/:id` | Update a prompt owned by the current user |
| `DELETE` | `/api/prompts/:id` | Delete a prompt owned by the current user |
| `PUT` | `/api/prompts/:id/like` | Toggle like on a prompt |
| `PUT` | `/api/prompts/:id/use` | Increment prompt usage count |
| `GET` | `/api/prompts/user/my-prompts` | List prompts created by the current user |

## Deployment Notes

### Backend

The backend can be deployed to any Node-compatible host such as Render, Railway, or Fly.io.

Required environment variables:

- `MONGO_URI`
- `JWT_SECRET`
- `PORT`
- `CLIENT_URL`

Start command:

```bash
node server.js
```

### Frontend

The frontend can be deployed to Vercel, Netlify, or any static hosting provider that supports Vite builds.

Required environment variables:

- `VITE_API_URL`

Build command:

```bash
npm run build
```

## Development Notes

- The frontend expects the API base URL from `VITE_API_URL`.
- The backend uses `CLIENT_URL` for CORS.
- User auth state is restored from `/api/auth/me`; the JWT is stored in an HTTP-only backend cookie.
- Homepage stats are fetched from the API and reflect live database counts.

## Troubleshooting

### MongoDB connection fails

- Verify `MONGO_URI`
- Confirm your database user credentials
- If using Atlas, make sure network access is configured correctly

### CORS errors in the browser

- Check that `CLIENT_URL` matches the frontend origin exactly
- Check that `VITE_API_URL` points to the correct backend

### Port conflicts

- Change `PORT` in `backend/.env`
- Update `VITE_API_URL` if the backend port changes locally