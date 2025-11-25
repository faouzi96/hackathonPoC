## FlowAnalyzer

FlowAnalyzer is a small monorepo-style package whose primary application is the root `main.ts` program.

The main application (root `main.ts`) is the AI analyzer: it inspects a target project, extracts project components (classes, interfaces, methods, etc.), and analyzes how they are connected. The React UI (`client/`) and the NestJS API (`api/`) provide supporting functionality to view, save, and manage the extracted flow data — they are primarily viewers/persistence layers for the analyzer results.

This README focuses on how to set up and run the project locally, what the major folders contain, the most relevant API endpoints used by the client, and how packaging works.

---

## Repository layout (important files/folders)

- `client/` — React UI (Vite + TypeScript). Entry at `client/src`.
- `api/` — NestJS backend serving `api/*` endpoints. Entry at `api/src`.
- `files-storage/` — persisted JSON files created by the API (flow JSON files).
- `flowData.json` — summary/registry of flows (used by the API service).
- `.flow-analyzer-creds/` — local folder in your home directory contains credentials files (not included in source control). Files present in this repo include e.g. `AZURE_AI_ENDPOINT`, `AZURE_AI_KEY`, `AZURE_MODEL_NAME`, `AZURE_DEPLOYMENT_NAME`, `AZURE_RESOURCE_NAME`, `AZURE_AI_API_VERSION` ...etc.
- `globals/`, `agents/`, `services/`, `utils/` — helper code used by the app components and server.

> Note: `node_modules/`, build artifacts (`dist/`, `build/`), and `coverage/` should be ignored in VCS. The repository already contains source for both client and API; compiled output is produced by their respective build steps.

---

## Prerequisites

- Node.js (recommend LTS, e.g. 18+ or 20+)
- npm (or an npm-compatible client)

All development commands below assume you run them from a terminal in the repository root. Commands for Windows PowerShell are provided where appropriate.

---

## Install dependencies

Install dependencies for both sub-projects (root, client and api):

PowerShell:

```powershell
npm install
cd client; npm install; cd ..
cd api; npm install; cd ..
```

You can also install both at once with one-liners or run `npm install` in each folder independently.

---

## Run (development)

Start the Application in one terminal:

PowerShell:

```powershell
npm run start:dev
```

The API listens by default on port `3001` (see `api/src/main.ts`) and sets the global prefix to `/api`, which renders the built version of the UI with it.

By default Vite serves the client (when ran as standalone application) on `http://localhost:3000`. The client configuration uses `client/src/api/apiConfig.ts` to point to the API base URL (`http://localhost:3001/api`) — update that file if you run the API on a different host/port.

---

## Build (production)

To run the compiled full Application in production mode:

```powershell
npm run start:prod
```

The above script is building the Client, Api, and the main application, before running the resulted main application.

### Packaging the full application

There is a root script that packages the application into a distributable tarball and performs some packaging steps to move built artifacts into a final layout. See the root `package.json` for the script:

PowerShell:

```powershell
npm run app:pack
```

What it does (high level): builds the TypeScript code, runs any packaging/pre-package steps and produces a packaged artifact that includes the pieces needed to run the analyzer and the UI. Check `local-scripts/package-app.js` for the exact packaging behavior.

---

## API Endpoints (used by client)

The API exposes a few endpoints under the `/api` prefix. These are the endpoints used by the client code in this repository:

- `GET /api/flow` — returns the list/overview of saved flows (used by the UI list).
- `GET /api/file/:id` — returns the JSON content of a saved flow (file hash used as `:id`).
- `POST /api/file` — save a flow JSON (the server will compute a file hash and persist it).
- `DELETE /api/file/:id` — delete a previously saved flow JSON and remove its record.

Example using `curl` to delete a flow (replace `<hash>`):

```bash
curl -X GET http://localhost:3001/api/file/<hash>
```

---

## Storage / Data

- Saved flow files are written to the `files-storage/` directory as `<fileHash>.json`.
- `flowData.json` contains the registry/metadata used by the API service to list available flows.

If you remove or move these files manually, the API will reflect those changes (errors for missing files are translated to 404 responses).

---

## Environment & credentials

The project contains a `creds/` folder used to store local secrets used for LLM connection. Do not commit real secrets to VCS — prefer environment variables or a secrets manager in CI.

If your runtime requires environment variables, you can export them in PowerShell like this:

---

---

## License

This project is licensed under the MIT license (permissive, open-source, free to use). If you prefer a different open-source license, replace the text below and add a `LICENSE` file at the repository root.

MIT License — see the `LICENSE` file for full terms (or add one if you publish).
