# Note Management System

This is a full-stack note management app with a Node.js/Express backend, MongoDB storage, and a React + Vite frontend.

The backend exposes a simple REST API for creating, reading, updating, deleting, and searching notes. The frontend talks to that API directly and provides the user interface for managing notes.

## Features

- Create, edit, delete, and pin notes
- Search notes by title, content, or tags
- MongoDB-backed persistence
- React + Vite frontend with TypeScript

## Project Structure

- `backend/` - Express server, MongoDB connection, and note API
- `frontend/` - React app built with Vite
- `core/` - Supporting assignment/debugging file used by the workspace

## Prerequisites

- Node.js 18 or newer
- npm
- A running MongoDB database, either local or hosted

## Environment Setup

Create a `backend/.env` file with your database connection string and optional port:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/note_management
PORT=5000
```

The frontend is configured to call the backend at `http://localhost:5000/api/notes`.
If you change the backend port, update `frontend/src/services/api.ts` accordingly.

## Install Dependencies

Install dependencies separately in each app folder:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run the App

Start the backend first:

```bash
cd backend
npm run dev
```

Then start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Backend Scripts

- `npm run dev` - Start the API with nodemon
- `npm start` - Start the API with Node.js

## Frontend Scripts

- `npm run dev` - Start the Vite dev server
- `npm run build` - Type-check and build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build locally

## API Overview

Base URL: `/api/notes`

- `GET /api/notes` - List notes, optionally using `?search=term`
- `GET /api/notes/:id` - Fetch one note
- `POST /api/notes` - Create a note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Note Shape

Notes use this data model:

```ts
{
  title: string;
  content?: string;
  tags?: string[];
  isPinned?: boolean;
}
```

## Troubleshooting

- If the frontend cannot load notes, make sure the backend is running on port `5000`.
- If the backend exits on startup, check that `MONGODB_URI` is set correctly in `backend/.env`.
- If you see dependency issues, reinstall with `npm install` in both `backend/` and `frontend/`.
