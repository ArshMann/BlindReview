# BlindReview: Anonymous Peer Review Platform

An open-source platform enabling anonymous peer review workflows. BlindReview allows reviewers and authors to engage in transparent, bias-reduced feedback processes while maintaining anonymity throughout the review cycle.

## Project Overview

BlindReview is a proof-of-concept web application designed to facilitate anonymous peer review in academic and professional settings. The platform separates reviewer identity from review content, enabling fair and objective feedback while maintaining a complete audit trail of the review process.

### Key Goals
- **Anonymity**: Reviewers and authors remain anonymous to each other during the review process
- **Transparency**: Complete visibility into review status and feedback progression
- **Scalability**: Built on Azure cloud services to handle multiple concurrent reviews
- **Auditability**: Full tracking of all review submissions and interactions

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (React + TypeScript + Vite)                   │
│  - Anonymous user interface                             │
│  - Submission & review management                       │
│  - Real-time status updates                             │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/REST (Port 5173 ↔ 7106)
┌──────────────────▼──────────────────────────────────────┐
│  Backend (Azure Functions v4 + .NET 8)                  │
│  - Review API endpoints                                 │
│  - Authentication & anonymization logic                 │
│  - API validation & business rules                      │
└──────────────────┬──────────────────────────────────────┘
                   │ Managed Identity
┌──────────────────▼──────────────────────────────────────┐
│  Database (Azure Cosmos DB)                             │
│  - NoSQL document storage for reviews                   │
│  - Scalable, globally distributed                       │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

Before setting up BlindReview locally, ensure you have:

- **Node.js** v18.0.0 or higher
- **.NET 8 SDK** (download from [dotnet.microsoft.com](https://dotnet.microsoft.com/))
- **Git** for version control
- **VS Code** or your preferred code editor
- **Azure Functions Core Tools** (for local backend testing): `npm install -g azure-functions-core-tools@4 --unsafe-perm true`

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd BlindReview
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on **http://localhost:5173**

### 3. Backend Setup

Open a new terminal and navigate to the Functions directory:

```bash
cd Functions
dotnet build
dotnet run
```

The Azure Functions will start on **http://localhost:7106**

### 4. Verify Connectivity

1. Open http://localhost:5173 in your browser
2. Navigate to the **API Status** page
3. If you see "Backend Connected ✅", both frontend and backend are running correctly

## Running the Application

**Terminal 1 - Frontend Development Server:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Azure Functions Backend:**
```bash
cd Functions
dotnet run
```

The frontend automatically proxies API requests from `/api/*` to the backend at `http://localhost:7106/api/*`

### Available npm Scripts (Frontend)

- `npm run dev` – Start Vite development server with hot reload
- `npm run build` – Compile TypeScript and bundle for production
- `npm run lint` – Validate code with ESLint
- `npm run preview` – Preview the production build locally

## Current API Endpoints

### Placeholder Endpoint
**GET** `/api/PlaceHolder`
- Response: `{ "message": "Functions API is working ✅" }`
- Purpose: Health check to verify backend connectivity

### Planned Peer Review Endpoints
The following endpoints are planned for the full peer review workflow:

- **POST** `/api/submissions` – Submit a document for review
- **GET** `/api/submissions/{id}` – Retrieve a submission
- **POST** `/api/reviews` – Submit an anonymous review
- **GET** `/api/reviews/{submissionId}` – Fetch reviews for a submission
- **GET** `/api/status/{submissionId}` – Check review status and progress

For detailed technical architecture and technology choices, see [TECH.md](./TECH.md).

## Development Notes

- **Hot Reload**: The frontend supports hot module replacement (HMR) via Vite
- **API Proxy**: All `/api/*` requests are automatically routed to the local Functions backend
- **Database**: Cosmos DB is configured but not yet active in the placeholder endpoint

## Troubleshooting

**Frontend won't start?**
- Ensure Node.js v18+ is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -r node_modules && npm install`

**Backend won't connect?**
- Verify Azure Functions Core Tools: `func --version`
- Check that port 7106 is not in use: `netstat -an | find "7106"`
- Restart the Functions runtime: `dotnet run`

**CORS issues?**
- The Vite dev server includes a proxy for `/api` routes. If you're calling the API directly with incorrect origins, you may see CORS errors. Always use relative paths in frontend code.

## License & Academic Use

BlindReview is part of an academic project. For usage rights and collaboration inquiries, please contact the course instructors.

---

**For technology stack details, design rationale, and planned features, see [TECH.md](./TECH.md).**