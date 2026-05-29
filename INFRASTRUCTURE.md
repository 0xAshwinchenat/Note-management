# Infrastructure Overview

This repository contains a simple full-stack note management system with two main applications:

- A Node.js + Express backend that exposes a REST API and persists data in MongoDB.
- A React + Vite frontend that consumes the API and provides the note editor UI.

## Repository Layout

```text
notemanagement_system/
├── backend/
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── config/db.js
│       ├── controllers/noteController.js
│       ├── models/Note.js
│       └── routes/noteRoutes.js
└── frontend/
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── services/api.ts
        ├── components/
        ├── hooks/
        ├── styles/
        └── types/
```

## Runtime Architecture

### Backend

The backend is an Express server started from `backend/src/index.js`.

Core responsibilities:

- Load environment variables with `dotenv`.
- Connect to MongoDB through `backend/src/config/db.js`.
- Enable CORS so the browser frontend can call the API.
- Parse JSON request bodies.
- Mount note routes under `/api/notes`.

The note API is implemented in a controller/router split:

- `backend/src/routes/noteRoutes.js` defines the HTTP routes.
- `backend/src/controllers/noteController.js` contains the request handlers.
- `backend/src/models/Note.js` defines the MongoDB schema through Mongoose.

### Frontend

The frontend is a React application bootstrapped by Vite and rendered from `frontend/src/main.tsx`.

Core responsibilities:

- Render the main `App` component.
- Fetch, create, update, search, and delete notes through `frontend/src/services/api.ts`.
- Keep editor state in sync with the selected note.
- Use debounced input to reduce unnecessary search and autosave traffic.

## Request Flow

1. The user opens the React app.
2. `App.tsx` loads notes from the backend through `getNotes()`.
3. The frontend sends requests to `http://localhost:5000/api/notes`.
4. Express routes forward requests to the controller layer.
5. The controller queries or mutates MongoDB through the `Note` model.
6. The backend returns JSON to the frontend.
7. The UI updates the note list and editor state.

## Backend Details

### Server Entry Point

`backend/src/index.js` performs the app bootstrap:

- Reads `PORT` from the environment, defaulting to `5000`.
- Calls the MongoDB connection helper before starting the server.
- Registers `express.json()` and `cors()` middleware.

### Database Layer

`backend/src/config/db.js` connects to the database using `process.env.MONGODB_URI`.

Required backend environment variables:

- `MONGODB_URI` - MongoDB connection string.
- `PORT` - Optional server port override.

### Data Model

`backend/src/models/Note.js` defines a note document with:

- `title` as a required string with a 100-character limit.
- `content` as freeform text.
- `tags` as an array of strings.
- `isPinned` as a boolean flag.
- `createdAt` and `updatedAt` timestamps.

It also adds a text index on `title` and `content` to support search.

### API Surface

The backend exposes these routes under `/api/notes`:

- `GET /api/notes` to list notes, optionally filtered by the `search` query parameter.
- `GET /api/notes/:id` to fetch a single note.
- `POST /api/notes` to create a note.
- `PUT /api/notes/:id` to update a note.
- `DELETE /api/notes/:id` to delete a note.

Search currently uses MongoDB regex matching across `title`, `content`, and `tags`.

## Frontend Details

### App Structure

`frontend/src/App.tsx` is the main composition layer. It coordinates:

- The sidebar note list.
- The note editor.
- Search and debounce behavior.
- Create/delete confirmation flow.
- Error and loading states.

### API Client

`frontend/src/services/api.ts` wraps axios calls and currently targets:

- `http://localhost:5000/api/notes`

That means the frontend expects the backend to be running locally on port `5000` unless the client code is adjusted.

### UI Components

- `NoteCard.tsx` renders each note in the list.
- `NoteEditor.tsx` handles note editing, auto-save, pinning, and deletion.
- `ConfirmationModal.tsx` provides the two-step delete confirmation dialog.

### Frontend State Flow

- Notes are loaded into `App.tsx` state.
- Search input is debounced before triggering a backend fetch.
- Selecting a note opens it in the editor.
- Editing triggers an auto-save after a short delay.
- Pinning and deletion update both the backend and the local list state.

## Development Setup

### Backend Commands

From `backend/`:

- `npm install`
- `npm run dev`
- `npm run start`

### Frontend Commands

From `frontend/`:

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`

## Ports And Dependencies

- Backend API: `http://localhost:5000`
- Frontend dev server: Vite default port, usually `http://localhost:5173`
- Database: MongoDB via the `MONGODB_URI` connection string

## Operational Notes

- The backend must be running before the frontend can load or save notes.
- CORS is enabled on the backend so the browser app can call the API during local development.
- The frontend currently hardcodes the API base URL, so deployment to another environment would need a configurable API endpoint.

## Suggested Next Improvement

If you want this infrastructure document to stay accurate over time, the next useful step is to add an `.env.example` file and replace the hardcoded frontend API URL with an environment-based config.