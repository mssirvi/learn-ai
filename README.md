## learnAI — local dev scaffold for experimenting with Gemini

This repository is a small TypeScript/Node.js + Next.js workspace to experiment with Google's Gemini. It is organized into separate `backend/` and `frontend/` folders so you can iterate on API logic and UI independently.

- **backend**: Express + TypeScript service that calls Gemini and exposes a Server-Sent-Events (SSE) `/api/chat` endpoint.
- **frontend**: Next.js (app router) + TypeScript UI that connects to the backend and streams responses.

---

### Quick start

1.  **Install dependencies:**

    ```bash
    # from repository root
    cd backend
    npm install

    cd ../frontend
    npm install
    ```

2.  **Create env files**

    -   Backend: `backend/.env` (required)

        ```
        GEMINI_API_KEY=your_gemini_api_key_here
        ```

    -   Frontend: `frontend/.env` (optional)

        ```
        NEXT_PUBLIC_API_URL=http://localhost:3001
        ```

3.  **Start dev servers** (in separate terminals):

    ```bash
    # backend
    cd backend
    npm run dev

    # frontend
    cd frontend
    npm run dev
    ```

    The frontend runs at `http://localhost:3000` and the backend at `http://localhost:3001`.

---

### Project layout

```
.
├─ backend/
│  ├─ src/
│  │  ├─ controllers/chat.controller.ts   # Express handler with SSE + chat logic
│  │  ├─ services/gemini.service.ts      # Wrapper around @google/genai calls
│  │  └─ store/chatStore.ts               # In-memory chat store
├─ frontend/
│  ├─ src/app/page.tsx                    # Main Next page (chat UI)
│  ├─ src/hooks/useChat.ts                # Hook that orchestrates chat UI + service
│  └─ src/services/chat.service.ts        # Client-side SSE reader
```

---

### Contributing

-   Add features under `frontend/src/components` for UI improvements.
-   For backend changes, keep controller logic small and place API wrapper code inside `services/`.
