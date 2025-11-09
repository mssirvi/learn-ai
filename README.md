## learnAI — personal monorepo for learning AI

This repository is a personal monorepo used to learn and experiment with AI-related ideas and tooling. It contains small example projects and experiments (backend services, frontend demos, and language-model experiments) so you can iterate quickly and try out different approaches.

What you'll find here
- Small backend experiments that call model APIs and expose simple endpoints.
- Frontend examples (Next.js) that demonstrate streaming and chat-style UIs.
- A few one-off utilities and agents for experimenting with prompt engineering and tool use.

This repo is intentionally lightweight and exploratory — code is written for learning and experimentation rather than production readiness.

---

### Quick start

1.  **Install dependencies:**

    ```bash
    # from repository root, then enter the workspace you want to run
    cd backend
    npm install

    cd ../frontend
    npm install
    ```

2.  **Create env files**

    -   Backend: `backend/.env` (if present)

        ```
        GEMINI_API_KEY=your_gemini_api_key_here
        ```

    -   Frontend: `frontend/.env` (if present)

        ```
        NEXT_PUBLIC_API_URL=http://localhost:3001
        ```

3.  **Start a project** (each project has its own scripts; run from that folder):

    ```bash
    # backend
    cd backend
    npm run dev

    # frontend
    cd frontend
    npm run dev
    ```

    Check each package's README or `package.json` scripts for details.

---

### Notes on use

- This workspace is for learning: expect rapid iteration, commented experiments, and sometimes incomplete code.
- If you add experiments, please keep them in clearly named folders and add a short README for how to run them.

---
