# Neighborly

Neighborly is a full-stack help-request app where users can log in, create nearby help requests, accept requests, and rate other users. The frontend is built with React and Vite, and the backend is an Express API connected to PostgreSQL.

## Features

- User registration and login with JWT authentication
- Create, view, accept, and complete help requests
- Rate users after completing work
- Nearby request feed driven by latitude and longitude
- React + Tailwind frontend with a Node.js + Express backend

## Project Structure

- `client/` - React app built with Vite
- `server/` - Express API with PostgreSQL access
- `docs/` - Project notes and documentation
- `database/` - Database-related assets

## Prerequisites

- Node.js 18 or newer
- npm
- PostgreSQL

## Setup

### 1. Install dependencies

From the project root, install packages for both apps:

```bash
cd client
npm install

cd ../server
npm install
```

### 2. Configure environment variables

Create a `.env` file in `server/` with the values required by the backend:

```env
PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
```

If your PostgreSQL setup uses separate connection fields instead of `DATABASE_URL`, match the values expected by `server/config/db.js`.

### 3. Start the backend

```bash
cd server
npm run dev
```

The API listens on the port defined in `server/.env`. The client expects the backend at `http://localhost:5000/api`.

### 4. Start the frontend

```bash
cd client
npm run dev
```

Vite runs the app on the default development port, usually `http://localhost:5173`.

## Available Scripts

### Client

- `npm run dev` - Start the Vite development server
- `npm run build` - Build the production bundle
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build locally

### Server

- `npm run dev` - Start the Express server with nodemon

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Requests

Protected by JWT authentication:

- `POST /api/request/create`
- `GET /api/request/all`
- `POST /api/request/accept`
- `POST /api/request/complete`

### Ratings

Protected by JWT authentication:

- `POST /api/rating/rate`

### Health Check

- `GET /` - Confirms the API is running and the database is reachable
- `GET /protected` - Example protected route that requires a valid JWT

## Frontend Routes

- `/` - Login page
- `/dashboard` - Request dashboard

## Notes

- The dashboard currently uses fixed coordinates for nearby request queries and request creation.
- Authentication tokens are stored in `localStorage` on successful login.