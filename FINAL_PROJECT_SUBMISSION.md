# BlindReview — Final Project Submission

## Table of contents

1. [Submission checklist (handout)](#1-submission-checklist-handout)  
2. [Project summary & HLD](#2-project-summary--hld-high-level-design)  
3. [Codebase & documentation](#3-codebase--documentation)  
4. [Tests](#4-tests-functional--unit)  
5. [CI/CD pipeline](#5-cicd-pipeline)  
6. [Code reviews & collaboration](#6-code-reviews--collaboration)  
7. [Evaluation criteria mapping](#7-evaluation-criteria-mapping)

---

## 1. Submission checklist (handout)

| Deliverable | Location |
|-------------|--------------------------|
| **Codebase with documentation** | Repository root: [README.md](https://github.com/ArshMann/BlindReview/blob/main/README.md) (setup, architecture overview, endpoints overview); deep stack notes: [TECH.md](https://github.com/ArshMann/BlindReview/blob/main/TECH.md) |
| **Unit / functional tests** | Backend: [Functions.Tests/](https://github.com/ArshMann/BlindReview/tree/main/Functions.Tests) · Frontend: [frontend/src/](https://github.com/ArshMann/BlindReview/tree/main/frontend/src) (look for `__tests__` folders and `*.test.ts(x)` files) |
| **CI/CD pipeline configuration** | [`.github/workflows/`](https://github.com/ArshMann/BlindReview/tree/main/.github/workflows) -- see [Section 5](#5-cicd-pipeline) |
| **Project report (HLD)** | **This document:** [FINAL_PROJECT_SUBMISSION.md](https://github.com/ArshMann/BlindReview/blob/main/FINAL_PROJECT_SUBMISSION.md) · [Section 2](#2-project-summary--hld-high-level-design) |
| **Code reviews** | GitHub [Pull Requests](https://github.com/ArshMann/BlindReview/pulls) for this repository |

---

## 2. Project summary & HLD (High-Level Design)

### 2.1 Problem statement

Peer review in academic and professional settings often suffers from bias when reviewers know the author, and from opaque processes when tooling does not separate identity from feedback. BlindReview is a proof-of-concept web platform that supports anonymous-style review workflows: authors submit work, reviewers receive assignments and submit feedback, and the system is designed to keep identities separated where the workflow requires it, while still supporting authentication and auditing on the server side.

### 2.2 Key architectural choices

The system follows a three-tier, cloud-oriented/hybrid layout: a SPA talks to a serverless HTTP API, which persists data in managed Azure services.

#### Logical architecture

![Architecture Diagram](https://github.com/ArshMann/BlindReview/blob/main/docs/imgs/architecture.png?raw=true)

#### Major technology decisions

| Area | Choice | Rationale |
|------|--------|-----------|
| **Frontend** | React, TypeScript, Vite | Strong typing for API contracts; fast dev feedback (HMR); component model fits distinct author/reviewer flows. |
| **Backend** | Azure Functions v4, isolated worker, .NET 8 | Pay-per-use scaling (on consumption model, but cold start), clear HTTP triggers for REST endpoints, DI for easily testable services. |
| **Persistence** | Cosmos DB (documents) + Blob Storage (files) | JSON documents fit variable review metadata; blobs suit larger submission files. |
| **Security** | JWT bearer tokens; middleware bypass only for `Login` / `CreateUser` | Consistent protection of review and user APIs without duplicating auth checks in every function. Also in-house, so we manage everything |
| **Reviewer assignment** | Pluggable strategies (`IAssignmentStrategy`) | Encapsulates rules (e.g. default vs. dedicated reviewer) and keeps assignment logic unit-testable and easily modifiable. |

> [!Note] Most if not all of these services are also free or pay-per-use, which was a deciding factor in choosing the services that we did. It costed $0.12 to run this project throughout the ~4 month period

#### Deployment architecture

![Deployment Diagram](https://github.com/ArshMann/BlindReview/blob/main/docs/imgs/deployment-process.png?raw=true)

### 2.3 Key challenges and how they were resolved

| Challenge | Resolution |
|-----------|------------|
| **Separating public vs. protected API calls** | Central `AuthMiddleware` validates Bearer JWTs and injects user context; registration and login are explicitly excluded. |
| **Assigning reviews fairly and extensibly** | `AssignmentService` composes one or more `IAssignmentStrategy` implementations so new rules can be added without rewriting the rest of the API. |
| **Large files vs. document DB** | Metadata and review structure in Cosmos; file payloads stored in Blob Storage with URLs referenced from application models. |
| **Consistent API responses and errors** | Shared HTTP helpers (`Handlers`) and a `Result<T>` pattern reduce duplicated parsing/response code. |
| **Frontend/backend contract drift** | Shared understanding encoded in TypeScript types ([`frontend/src/types.ts`](https://github.com/ArshMann/BlindReview/blob/main/frontend/src/types.ts)) aligned with backend models. |

### 2.4 Lessons learned and potential future improvements

- **Lessons learned:** Serverless functions plus a static SPA keeps operational overhead low; investing in tests for assignment strategies and auth pays off because that logic is easy to break with small changes. CI that runs tests before deploy catches regressions early, keeping issues from making it to production.
- **Future improvements:** Richer role-based authorization; email notifications for assignments and deadlines; formal conflict-of-interest checks; export of review cycles (CSV/PDF); deeper observability dashboards; optional integration with LMS tools. (See roadmap-style notes in [TECH.md](https://github.com/ArshMann/BlindReview/blob/main/TECH.md).)

---

## 3. Codebase & documentation

### 3.1 Repository layout (concise)

| Path | Purpose |
|------|---------|
| [`frontend/`](https://github.com/ArshMann/BlindReview/tree/main/frontend) | React SPA: pages, auth, services, UI components |
| [`Functions/`](https://github.com/ArshMann/BlindReview/tree/main/Functions) | Azure Functions: users, reviewables/reviews, assignments, Cosmos, blob storage, middleware |
| [`Functions.Tests/`](https://github.com/ArshMann/BlindReview/tree/main/Functions.Tests) | xUnit tests for services, models, utilities |
| [`docs/`](https://github.com/ArshMann/BlindReview/tree/main/docs) | Project documentation (sprint/demo notes, etc.) |
| [`.github/workflows/`](https://github.com/ArshMann/BlindReview/tree/main/.github/workflows) | CI/CD workflows |

### 3.2 Documentation set

- **[README.md](https://github.com/ArshMann/BlindReview/blob/main/README.md)** — Project goals, architecture diagram, local setup (Functions on port 7106, Vite on 5173), proxy behavior, troubleshooting.  
- **[TECH.md](https://github.com/ArshMann/BlindReview/blob/main/TECH.md)** — Stack versions, design rationale, configuration samples, security and performance notes.  
- **This submission** — HLD narrative, checklist links, CI/CD explanation for graders: [FINAL_PROJECT_SUBMISSION.md](https://github.com/ArshMann/BlindReview/blob/main/FINAL_PROJECT_SUBMISSION.md).

### 3.3 Representative API surface (Azure Functions)

Backend functions include (non-exhaustive): user lifecycle and login; upload/download/delete of reviewable files; list/get reviewables and comments; list reviewer assignments. See the [`Functions/`](https://github.com/ArshMann/BlindReview/tree/main/Functions) tree for `.cs` sources and the authoritative list of `[Function("...")]` endpoints.

---

## 4. Tests (functional / unit)

Tests are intended to **lock in behavior** of domain logic, auth utilities, and critical UI flows.

### 4.1 Backend (`Functions.Tests`)

- **Framework:** xUnit, with Moq and FluentAssertions.  
- **Examples:** [`AssignmentServiceTests.cs`](https://github.com/ArshMann/BlindReview/blob/main/Functions.Tests/Services/AssignmentServiceTests.cs), [`DefaultAssignmentStrategyTests.cs`](https://github.com/ArshMann/BlindReview/blob/main/Functions.Tests/Services/DefaultAssignmentStrategyTests.cs), [`DedicatedReviewerStrategyTests.cs`](https://github.com/ArshMann/BlindReview/blob/main/Functions.Tests/Services/DedicatedReviewerStrategyTests.cs), [`TokenServiceTests.cs`](https://github.com/ArshMann/BlindReview/blob/main/Functions.Tests/Utils/TokenServiceTests.cs), [`ModelTests.cs`](https://github.com/ArshMann/BlindReview/blob/main/Functions.Tests/Models/ModelTests.cs), [`RailsTests.cs`](https://github.com/ArshMann/BlindReview/blob/main/Functions.Tests/Utils/RailsTests.cs).

**Run locally:**

```bash
dotnet test Functions.Tests/Functions.Tests.csproj --configuration Release
```

### 4.2 Frontend (`frontend`)

- **Framework:** Vitest, React Testing Library, jsdom.  
- **Examples:** auth ([`AuthContext.test.tsx`](https://github.com/ArshMann/BlindReview/blob/main/frontend/src/auth/__tests__/AuthContext.test.tsx), [`ProtectedRoute.test.tsx`](https://github.com/ArshMann/BlindReview/blob/main/frontend/src/auth/__tests__/ProtectedRoute.test.tsx)), services ([`assignmentService.test.ts`](https://github.com/ArshMann/BlindReview/blob/main/frontend/src/services/__tests__/assignmentService.test.ts), [`reviewableService.test.ts`](https://github.com/ArshMann/BlindReview/blob/main/frontend/src/services/__tests__/reviewableService.test.ts)), pages ([`Login.test.tsx`](https://github.com/ArshMann/BlindReview/blob/main/frontend/src/pages/__tests__/Login.test.tsx)), types ([`types.test.ts`](https://github.com/ArshMann/BlindReview/blob/main/frontend/src/__tests__/types.test.ts)).

**Run locally (after `npm ci` in `frontend/`):**

```bash
cd frontend
npm test
```

The **Static Web Apps** workflow runs `npm ci` and `npm test` on Ubuntu before deploy, so frontend tests are part of the automated pipeline.

---

## 5. CI/CD pipeline

### 5.1 Overview

The project uses **GitHub Actions** with **two workflows** that automate build, test, and deployment to Azure:

1. **Frontend → Azure Static Web Apps**  
2. **Backend → Azure Function App (.NET 8)**

Together they implement **continuous integration** (build + test on each trigger) and **continuous deployment** (deploy to Azure when criteria are met).

### 5.2 Workflow 1: Deploy web app to Azure Static Web Apps

**File:** [`azure-staticwebapp.yml`](https://github.com/ArshMann/BlindReview/blob/main/.github/workflows/azure-staticwebapp.yml)

| Aspect | Detail |
|--------|--------|
| **Triggers** | Push to `main`; pull requests (opened, synchronize, reopened, closed) targeting `main`. |
| **Steps (simplified)** | Checkout → `npm ci` in `frontend/` → **`npm test`** → Azure Static Web Apps deploy action (`upload`). |
| **PR behavior** | Closed PRs run a “close” job to tear down preview environments (Azure SWA integration). |
| **Secrets** | `AZURE_STATIC_WEB_APPS_API_TOKEN` (deployment token). `GITHUB_TOKEN` used for PR comments. |

**Benefits:** Every change to the default branch is **built and tested** before hosting; PRs get **preview deployments** and automated feedback, reducing broken production UI.

### 5.3 Workflow 2: Deploy .NET project to Azure Function App

**File:** [`azure-functions-app-dotnet.yml`](https://github.com/ArshMann/BlindReview/blob/main/.github/workflows/azure-functions-app-dotnet.yml)

| Aspect | Detail |
|--------|--------|
| **Triggers** | Push to `main`. |
| **Environment** | GitHub Environment `dev` (can enforce protection rules). |
| **Runner** | `windows-latest` (matches template for Functions deployment). |
| **Steps (simplified)** | Checkout → setup .NET 8 → `dotnet build` (Release) for `Functions/` → **`dotnet test`** on `Functions.Tests` → Azure Functions deploy action with publish profile. |
| **Secrets** | `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` (and optionally Azure RBAC if you switch auth mode). |

**Benefits:** Backend releases are **repeatable**, **test-gated**, and tied to a known .NET SDK version; failures in tests block deployment.

### 5.4 Reliability and automation (evaluation alignment)

- **Automation:** No manual build or FTP step; merge to `main` drives deployment after tests pass.  
- **Reliability:** Separating frontend and backend pipelines allows one service to deploy independently; test steps catch many regressions before Azure receives artifacts.  
- **Documentation:** Workflow files contain inline comments linking to Microsoft and Azure Actions documentation for token and profile setup.

### 5.5 Operational prerequisites (for instructors / TAs verifying “fully operational”)

- Azure resources: Static Web App + Function App must exist.  
- Repository secrets must be configured as described in the workflow headers.  
- Without secrets, workflows may **fail at deploy** while still demonstrating **build and test** stages if adapted for forked grading—confirm on the [**Actions**](https://github.com/ArshMann/BlindReview/actions) tab of the course’s fork or team repo.

---

## 6. Code reviews & collaboration

- **Process:** Use GitHub [**Pull Requests**](https://github.com/ArshMann/BlindReview/pulls) with description, review requests, and resolved conversation threads for major features (auth, assignments, reviewables, CI).
  - Some Code Reviews:  
    - [Add business logic to assign reviewables. Currently uses default random + bugfixes #16](https://github.com/ArshMann/BlindReview/pull/16)
    - [Create Auth, cleanup blob (Redundant here but wcyd), jwt middleware #6](https://github.com/ArshMann/BlindReview/pull/6)

---

## 7. Evaluation criteria mapping

| Criterion | Where it is addressed |
|-----------|------------------------|
| **Code quality & structure** | Modular [`frontend/`](https://github.com/ArshMann/BlindReview/tree/main/frontend) and [`Functions/`](https://github.com/ArshMann/BlindReview/tree/main/Functions); shared HTTP/result utilities; DI in [`Program.cs`](https://github.com/ArshMann/BlindReview/blob/main/Functions/Program.cs); ESLint on frontend. |
| **Documentation** | [README.md](https://github.com/ArshMann/BlindReview/blob/main/README.md), [TECH.md](https://github.com/ArshMann/BlindReview/blob/main/TECH.md), this HLD. |
| **Functional / unit tests** | [Section 4](#4-tests-functional--unit); `dotnet test` and `npm test` in CI. |
| **Course concepts** | Cloud (Azure SWA, Functions, Cosmos, Blob), REST APIs, authentication, automated testing, CI/CD, separation of concerns. |
| **CI/CD operational** | [Section 5](#5-cicd-pipeline); live status on GitHub [**Actions**](https://github.com/ArshMann/BlindReview/actions) tab. |
| **Collaboration** | PR-based workflow; peer review form per course instructions. |