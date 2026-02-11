# TECH.md: BlindReview Technology Documentation

This document provides an in-depth overview of the BlindReview technology stack, architectural decisions, and implementation details.

## Technology Stack

### Frontend
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Runtime** | Node.js | 18.0.0+ | JavaScript runtime environment |
| **Framework** | React | 19.2.0 | UI component library for building interactive user interfaces |
| **Language** | TypeScript | 5.9.3 | Type-safe JavaScript for catching errors at compile-time |
| **Build Tool** | Vite | 7.3.1 | Lightning-fast build tool and dev server with hot module replacement |
| **Routing** | React Router DOM | 7.13.0 | Client-side routing for anonymous user flows |
| **Linting** | ESLint | Latest | Code quality and consistency enforcement |

### Backend
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Runtime** | .NET | 8.0 | Modern, performant framework for cloud applications |
| **Function Host** | Azure Functions | v4 | Serverless compute for scalable, event-driven API endpoints |
| **Worker Model** | Isolated | Latest | Process isolation for better security and dependency management |
| **HTTP Framework** | ASP.NET Core | 8.0 | HTTP server and routing for REST API endpoints |
| **SDK** | Azure.Core, Azure.Identity | Latest | Azure service authentication and communication |

### Database
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Database** | Azure Cosmos DB | v3 (SDK) | Globally distributed, NoSQL document database for review data |
| **API Model** | SQL API | - | SQL-like queries on JSON documents |
| **Authentication** | DefaultAzureCredential | - | Managed identity for secure Azure service authentication |

### Cloud Infrastructure
| Service | Purpose | Current Status |
|---------|---------|-----------------|
| **Azure Functions** | Serverless backend execution | ✅ Active (local emulation available) |
| **Azure Cosmos DB** | Review data persistence | ⏳ Configured, not yet enabled in endpoints |
| **Application Insights** | Performance monitoring & diagnostics | ✅ Configured in host.json |
| **Azure Storage Emulator** | Local development storage | ✅ Configured (UseDevelopmentStorage=true) |

## Architecture & Design Decisions

### Why React + TypeScript?
- **Type Safety**: TypeScript prevents entire classes of bugs at compile-time (especially valuable for anonymous data handling where correctness is critical)
- **Component Reusability**: React's component model allows us to build reusable UI elements for submissions, reviews, and status tracking
- **Developer Experience**: Hot Module Replacement (HMR) via Vite provides instant feedback during development
- **Ecosystem**: Rich library ecosystem for UI components, routing, and state management (future: Redux, Zustand)
- **Anonymous UI**: React's declarative UI model makes it simple to toggle between author/reviewer/admin views without exposing identity

### Why Azure Functions + Isolated Worker Model?
- **Serverless Scalability**: Automatically scales from zero to thousands of concurrent reviews without infrastructure management
- **Cost Efficiency**: Pay only for compute time actually used during review submission and retrieval
- **Process Isolation**: The isolated worker model prevents dependency conflicts and allows each function to run independently
- **Managed Identity**: SecureAzure credential flow eliminates the need for connection strings in code; authentication is handled by Azure's identity system
- **REST-Native**: Built-in HTTP trigger support makes REST API endpoint creation straightforward
- **Monitoring**: Deep integration with Application Insights for logging, tracing, and alerting

### Why Azure Cosmos DB?
- **NoSQL Flexibility**: Review documents have variable structure (metadata, content, rubrics) that fit naturally into JSON documents
- **Global Distribution**: If the platform scales internationally, Cosmos automatically replicates data across regions for low latency
- **Managed**: No database server maintenance required; Azure handles backups, patching, and scaling
- **Multi-API Support**: Supports SQL (for complex queries), Graph (for reviewer relationships), and Table APIs
- **Anonymous-Friendly**: Document partitioning can separate reviewer and author data without shared keys, enhancing privacy

### Why Vite?
- **Speed**: Vite's unbundled development mode means modules are served individually, enabling hot reloads in milliseconds (vs. Webpack's seconds)
- **ES Modules Native**: Built on ES module standards, not CommonJS, aligning with modern JavaScript
- **Production Optimization**: Automatic code-splitting and tree-shaking for minimal bundle size
- **Zero-Config**: Works out-of-box with React and TypeScript

## Current Implementation Status

### ✅ Implemented
- **Frontend Project Structure**: React app with TypeScript, routing setup, pages for Home and ApiStatus
- **Backend Project Structure**: Azure Functions v4 with .NET 8, dependency injection configured, Cosmos DB client setup
- **Local Development Environment**: Vite dev server on port 5173, Functions runtime on port 7106, API proxy configured
- **Health Check Endpoint**: `GET /api/PlaceHolder` returns success message; allows verification of frontend-backend connectivity
- **Application Insights**: Wired up in `host.json` for future monitoring and diagnostics
- **defaultAzureCredential Setup**: Infrastructure ready for managed identity authentication to Cosmos DB

### ⏳ Not Yet Enabled
- **Cosmos DB Queries**: Integration code exists in `Database/Cosmos.cs` but is commented out in `PlaceHolder.cs`
  - Ready to uncomment and activate once database is provisioned
  - Dependency injection is fully configured (see `Program.cs` for service registration)
- **Authentication Flow**: Managed identity credential is registered but not yet required by endpoints
- **Error Handling**: Placeholder endpoints don't include comprehensive error handling (will be added with real endpoints)

---

## Configuration & Environment Variables

### Local Development Configuration
**File**: `local.settings.json` (Functions root directory)

Required environment variables for local testing:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
    "CosmosConnection": "https://<cosmosdb-account>.documents.azure.com:443/",
    "CosmosDatabase": "BlindReview",
    "CosmosContainer": "Reviews"
  }
}
```

### Frontend Configuration
**File**: `vite.config.ts`

The proxy configuration automatically routes `/api/*` requests to the local Functions instance:
```typescript
server: {
  proxy: {
    '/api': 'http://localhost:7106'
  }
}
```

### Backend Configuration
**File**: `host.json`

Application Insights sampling is enabled to reduce telemetry volume in production:
```json
{
  "functionTimeout": "00:05:00",
  "logging": {
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true,
        "excludedTypes": "Request"
      }
    }
  }
}
```

---

## Planned Features & Roadmap

### Phase 1: Core Peer Review Workflow
- **Review Submission**: Authors upload documents anonymously with metadata (title, subject, deadline)
- **Anonymous Reviewers**: Reviewers are assigned reviews without seeing author identity
- **Review Creation**: Reviewers submit feedback, ratings, and comments without exposing their identity
- **Aggregated Feedback**: Authors receive consolidated reviews (average ratings, compiled comments)

**New API Endpoints**:
```
POST   /api/submissions          → Create a new review submission
GET    /api/submissions/{id}     → Retrieve a submission
POST   /api/reviews              → Submit an anonymous review
GET    /api/reviews/{submissionId} → Fetch all reviews for a submission
GET    /api/status/{submissionId}  → Check review progress
```

### Phase 2: Review Administration
- **Review Cycle Management**: Create review cycles with configurable deadlines and acceptance dates
- **Reviewer Assignment**: Algorithmic matching of reviewers to submissions based on expertise
- **Review Visibility Control**: Granular permissions for who can see what (author sees reviews on deadline, reviewers can't see each other)
- **Revisable Reviews**: Track versions of reviews if reviewers need to revise their feedback

**New API Endpoints**:
```
POST   /api/cycles              → Create a review cycle
POST   /api/assignments         → Compute and assign reviewers to submissions
GET    /api/assignments         → List current assignments
PUT    /api/reviews/{id}        → Allow reviewers to revise submissions
```

### Phase 3: Analytics & Insights
- **Reviewer Statistics**: Track reviewer performance, consistency, and feedback quality
- **Submission Analytics**: Trends in review scores, common feedback themes
- **Dashboard**: Administrative dashboard for cycle monitoring and reviewer management
- **Conflict Detection**: Identify and flag potential conflicts of interest

**New API Endpoints**:
```
GET    /api/analytics/submissions  → Aggregate submission statistics
GET    /api/analytics/reviewers    → Reviewer performance metrics
GET    /api/dashboard              → Administrative dashboard data
```

### Future Enhancements
- **Email Notifications**: Notify authors and reviewers of important events (review assigned, feedback ready)
- **Multi-Language Support**: Internationalization for global academic audiences
- **Export to CSV/PDF**: Download review cycles and feedback in standard formats
- **Integration with Learning Management Systems**: Sync with Canvas, Blackboard, or Moodle
- **Machine Learning**: Sentiment analysis on review feedback, automatic plagiarism detection in submissions

---

## Development Workflow

### Getting Started
1. **Clone** the repo and install dependencies (see README.md)
2. **Run frontend** with `npm run dev` (port 5173)
3. **Run backend** with `dotnet run` (port 7106)
4. **Test connectivity** by navigating to the API Status page

### Adding a New Endpoint

**Backend (Azure Functions)**:
1. Create a new function class in the Functions directory, e.g., `SubmitReview.cs`
2. Decorate with `[Function("SubmitReview")]` and define HttpTrigger
3. Register any dependencies in `Program.cs` (e.g., Cosmos client)
4. Test locally with the Functions runtime

**Frontend (React)**:
1. Create a new page component in `src/pages/`
2. Add route in your router configuration
3. Call the API using `fetch()` or Axios
4. Handle async loading and error states

### Testing & Validation
- **Frontend**: Run `npm run lint` to check TypeScript and ESLint errors
- **Backend**: Use Visual Studio or `dotnet test` (test projects to be added)
- **Integration**: Call endpoints from the ApiStatus page or use Postman/Thunder Client

---

## Security Considerations

### Current State
- **DefaultAzureCredential**: Uses Azure's managed identity for service-to-service authentication (no hardcoded credentials)
- **HTTPS**: Backend runs over HTTPS in Azure; local development uses HTTP
- **CORS**: Vite proxy handles cross-origin requests; no explicit CORS headers needed for local development

### Future Improvements
- **API Authentication**: Add JWT tokens or Azure AD B2C for user authentication
- **Data Encryption**: Encrypt sensitive review data at rest in Cosmos DB
- **Audit Logging**: Log all review submissions, deletions, and access attempts
- **Role-Based Access Control**: Enforce permissions (admins vs. reviewers vs. authors)
- **Rate Limiting**: Prevent abuse of review submission and retrieval endpoints

---

## Performance & Scalability

### Frontend Optimization
- **Code Splitting**: Vite automatically splits chunks for lazy-loaded routes
- **Tree Shaking**: Unused code is removed during production build
- **Compression**: Production bundle is gzipped for faster downloads
- **Caching**: Static assets are cached with appropriate HTTP headers

### Backend Optimization
- **Serverless Auto-Scaling**: Azure Functions scales horizontally based on incoming requests
- **Connection Pooling**: Azure SDK handles connection pooling to Cosmos DB
- **Application Insights Sampling**: Reduces telemetry overhead while maintaining observability

### Database Optimization
- **Partitioning**: Cosmos DB partitions by submission ID to spread load across physical servers
- **Indexing**: Documents are indexed for fast queries on author, reviewer, and status fields
- **TTL**: Future: Implement time-to-live (TTL) on temporary data to auto-clean old reviews

---

## Troubleshooting & FAQ

### Q: Why is the Cosmos DB code commented out?
**A**: The project is in proof-of-concept phase. Cosmos DB is intentionally disabled to simplify local setup. Once the schema is finalized, uncomment the code in `PlaceHolder.cs` and provision a Cosmos DB instance in Azure.

### Q: How do I switch from local dev to Azure?
**A**: Update `CosmosConnection` in your Azure Function's application settings, ensure your Azure identity has Cosmos DB contributor access, and rebuild. No code changes needed thanks to DefaultAzureCredential.

### Q: Can I use a different frontend framework?
**A**: Yes, but you'd need to replicate the routing and API proxy setup. React was chosen for its ecosystem and community support in academic settings.

### Q: What's the maximum review size?
**A**: Azure Cosmos DB documents are limited to 2 MB. Very large PDFs should be stored in Azure Blob Storage with a reference in the review document.

---

## Links & Resources

- **[Microsoft Learn: Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/)**
- **[React Documentation](https://react.dev)**
- **[Vite Documentation](https://vitejs.dev)**
- **[Azure Cosmos DB Documentation](https://learn.microsoft.com/en-us/azure/cosmos-db/)**
- **[Azure Identity (DefaultAzureCredential)](https://learn.microsoft.com/en-us/dotnet/api/azure.identity.defaultazurecredential)**
- **[Azure Functions Isolated Worker Model](https://learn.microsoft.com/en-us/azure/azure-functions/dotnet-isolated-process-guide)**

---

**Last Updated**: February 11, 2026  
**Maintainers**: BlindReview Team  
**Status**: Active Development (Phase 1 - Core Peer Review Workflow)
