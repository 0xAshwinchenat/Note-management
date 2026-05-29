# File Map and Responsibilities — notemanagement_system

This file explains every folder and the important files in the `notemanagement_system` workspace so you can describe them in interviews.

Repository root: `notemanagement_system/`

## Top-level folders

- `backend/` — Express API and data layer (Node.js, Mongoose).
- `frontend/` — Vite + React + TypeScript UI.

---

## backend/ (detailed)

Files and purpose:

- `package.json` — npm metadata and scripts. Key scripts:
  - `npm start` runs `node src/index.js` (production start).
  - `npm run dev` runs nodemon for development.

- `.env` — environment overrides used by `dotenv`.
  - `MONGODB_URI` — connection string (example: `mongodb://localhost:27017/notemanagement`).
  - `PORT` — server port (defaults to `5000`).

- `src/index.js` — application bootstrap
  - Loads `.env`, configures middleware (`cors`, `express.json()`), mounts routes, and starts the HTTP server.
  - After the recent change, it waits for `connectDB()` to succeed before calling `app.listen()`.

- `src/config/db.js` — database connector
  - Exports `connectDB()` which uses `mongoose.connect(process.env.MONGODB_URI)`.
  - On connection failure the helper logs the error and exits the process (fail-fast).

- `src/models/Note.js` — Mongoose model
  - Note schema fields: `title` (required, maxlength 100), `content`, `tags` (array), `isPinned` (boolean), and timestamps.
  - Adds a text index on `title` and `content` for search.

- `src/controllers/noteController.js` — controller functions
  - `getNotes(req, res)` — supports `?search=` (regex on title/content/tags) and sorts pinned then by updatedAt.
  - `getNoteById`, `createNote`, `updateNote`, `deleteNote` — standard CRUD with status codes.
  - Validates `title` presence on create and responds with 400 on invalid input.

- `src/routes/noteRoutes.js` — route definitions
  - Mounts controller handlers:
    - `GET /api/notes` — list/search
    - `POST /api/notes` — create
    - `GET/PUT/DELETE /api/notes/:id` — single note retrieval, update, delete

Operational notes (backend):

- The backend is stateful only in that it needs a MongoDB connection. The process exits if DB connection fails.
- CORS is enabled to allow the frontend dev server to call the API.
- All code is CommonJS (Node `require`), package `type` is `commonjs`.

---

## frontend/ (detailed)

Files and purpose:

- `package.json` — frontend dependencies and scripts
  - `npm run dev` runs Vite dev server (Hot Module Replacement)
  - `npm run build` runs TypeScript build and Vite build

- `index.html` — Vite HTML entry template.

- `src/main.tsx` — app entry point
  - Renders React `App` into `#root`.

- `src/App.tsx` — main app composition and state
  - Holds global UI state: `notes`, `selectedNoteId`, `search`, `loading`, `error`.
  - Calls `getNotes()` (debounced by `useDebounce`) to load/filter notes.
  - Creates notes via `createNote()` and updates local list optimistically.
  - Shows `NoteEditor` when a note is selected; otherwise shows an empty state.

- `src/services/api.ts` — API client wrapper around axios
  - `API_URL` currently hardcoded to `http://localhost:5000/api/notes`.
  - Exposes: `getNotes`, `getNoteById`, `createNote`, `updateNote`, `deleteNote`.
  - Suggestion: replace with `import.meta.env.VITE_API_URL` for deployment.

- `src/components/NoteEditor.tsx` — editor component
  - Local form state for `title`, `content`, `tags`, `isPinned`.
  - Uses `useDebounce` to auto-save after a delay (1000ms) to reduce requests.
  - Validates title not empty; shows saving indicator.

- `src/components/NoteCard.tsx` — note list item
  - Displays note title, preview, saved date, first two tags, pinned icon, and delete button.

- `src/components/ConfirmationModal.tsx` — confirmation UI
  - Reusable modal with an optional two-step confirmation (`step` prop).

- `src/hooks/useDebounce.ts` — small hook
  - Returns a debounced version of a value after a delay.

- `src/types/index.ts` — TypeScript interfaces
  - `Note`, `CreateNoteInput`, `UpdateNoteInput` — used across the frontend.

- `src/styles/App.css` and `src/index.css` — styles for the app UI.

Operational notes (frontend):

- The frontend expects the backend API to be available at `http://localhost:5000` by default.
- Dev server default port is Vite's (commonly `5173`). When deployed, set a runtime environment variable for the API base URL.

---

## How files interact (request flow)

1. Browser loads `index.html` and Vite serves the React app from `src/main.tsx`.
2. `App.tsx` calls `getNotes()` from `src/services/api.ts`.
3. The API client makes requests to `http://localhost:5000/api/notes`.
4. Express app (`backend/src/index.js`) receives the request and passes it to `noteRoutes`.
5. `noteRoutes` dispatches to controller functions in `noteController.js`.
6. Controllers use the `Note` Mongoose model to query/update MongoDB.
7. MongoDB responds; controller sends JSON back to frontend, which updates UI.

---

## Interview prep: exact file references to show

- Startup & DB: `backend/src/index.js`, `backend/src/config/db.js`, `backend/.env`.
- Data model: `backend/src/models/Note.js`.
- Business logic: `backend/src/controllers/noteController.js`.
- Routes: `backend/src/routes/noteRoutes.js`.
- API client: `frontend/src/services/api.ts`.
- Autosave flow: `frontend/src/components/NoteEditor.tsx` and `frontend/src/hooks/useDebounce.ts`.

---

## Quick commands (copyable)

Backend:
```bash
cd backend
npm install
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Stop the backend if MongoDB is unreachable — it will exit with a connection error.

---

If you want, I can now:
- Generate a single-page cheat-sheet summarizing what to say in interviews (short bullets for each file).
- Add inline code comments inside each file to annotate purpose (I can edit files to add comments).
- Create `.env.example` and switch the frontend to use `VITE_API_URL`.

Tell me which next step you prefer.
