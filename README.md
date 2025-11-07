## learnAI — local dev scaffold for experimenting with Gemini

This repository is a small TypeScript/Node.js + Next.js workspace to experiment with Google's Gemini (via `@google/genai`) and build a simple streaming chat UI. It is organized into separate `backend/` and `frontend/` folders so you can iterate on API logic and UI independently.

High level:
- backend: Express + TypeScript service that calls Gemini and exposes a Server-Sent-Events (SSE) `/api/chat` endpoint that streams token chunks.
- frontend: Next.js (app router) + TypeScript UI that connects to the backend, streams responses, and shows a chat-like experience.

---

Quick start (dev)

1. Install dependencies (each side manages its own dependencies):

```bash
# from repository root
cd backend
npm install

cd ../frontend
npm install
```

2. Create env files

- Backend: `backend/.env` (required)

```
GEMINI_API_KEY=your_gemini_api_key_here
```

- Frontend: `frontend/.env` (optional). If you want to customize the API URL in development, add:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Note: Next.js only exposes env vars that start with `NEXT_PUBLIC_` to client code.

3. Start dev servers (in separate terminals):

```bash
# backend (hot reload using ts-node-dev)
cd backend
npm run dev

# frontend (Next.js)
cd frontend
npm run dev
```

The frontend runs at http://localhost:3000 by default and talks to the backend at http://localhost:3001 (unless overridden by `NEXT_PUBLIC_API_URL`).

---

Development notes & scripts

- backend/package.json scripts added:
	- `dev` — starts `ts-node-dev` for fast hot-reload during TypeScript development
	- `dev:nodemon` — alternative using `nodemon` + `ts-node`

- frontend/package.json scripts:
	- `dev` — Next.js dev server (hot reload)

If you update env files, restart the dev servers (they read env at startup).

---

How chat context works (in-memory prototype)

- The backend keeps a simple in-memory store keyed by a `chatId` (see `backend/src/store/chatStore.ts`).
- When the client sends the first message, the server will create a `chatId` and emit it immediately over SSE. The frontend persists that `chatId` to `localStorage` (key: `learnai_chat_id`) and includes it in subsequent requests.
- The server keeps the conversation as an array of messages and builds a combined prompt from the last N messages (default N=10) to provide context for the model. This is simple and good for local testing — for production you should persist chats to Redis or a DB.

Request/response contract (SSE)

- Endpoint: `POST /api/chat`
- Request JSON body:
	- `prompt` (string) — required
	- `chatId` (string) — optional; server will return one if not present
- Response: SSE stream where each data message contains JSON like `{ text?: string, done?: boolean, chatId?: string, error?: string }`.
	- Server emits `chatId` early so the client can persist it.
	- `text` chunks are streamed as they arrive from Gemini.
	- When complete the server sends `{ done: true, chatId }`.

Client behavior

- The frontend uses `frontend/src/services/chat.service.ts` to POST to `/api/chat` and read the stream.
- The `useChat` hook (`frontend/src/hooks/useChat.ts`) persists `chatId` to `localStorage` and re-uses it on subsequent requests so the conversation context is preserved in the in-memory store.

Limitations & next steps

- Current chat store is in-memory and ephemeral. For persistence and scaling replace it with Redis or a database.
- We currently send the last N messages as context. For longer histories switch to token-aware truncation or implement summarization.
- You can add: `GET /api/chat/:chatId` to fetch full history, auth to lock chats to users, or embed+RAG retrieval for external knowledge.

---

Project layout (relevant files)

```
.
├─ backend/
│  ├─ src/
│  │  ├─ controllers/chat.controller.ts   # Express handler with SSE + chat logic
│  │  ├─ routes/chat.routes.ts            # Router wiring
│  │  ├─ services/gemini.service.ts      # Wrapper around @google/genai calls
│  │  ├─ store/chatStore.ts               # In-memory chat store (dev)
│  │  └─ index.ts                         # Express app entry
├─ frontend/
│  ├─ src/app/page.tsx                    # Main Next page (chat UI)
│  ├─ src/components/                     # UI components (ChatInput, ChatMessage, Loader)
│  ├─ src/hooks/useChat.ts                # Hook that orchestrates chat UI + service
│  └─ src/services/chat.service.ts        # Client-side SSE reader and POST helper
```

Contributing

- Add features under `frontend/src/components` for UI improvements.
- For backend changes, keep controller logic small and place API wrapper code inside `services/`.

If you want, I can:
- Add a `GET /api/chat/:chatId` debug endpoint to inspect stored history (quick)
- Swap the in-memory store to Redis and wire a simple persistence layer (requires a Redis instance)
- Add token-counting and automatic summarization of old messages

Happy hacking — tell me which next step you'd like and I can implement it.