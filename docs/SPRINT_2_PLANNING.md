# Sprint 2 Planning Document
# BlindReview: Anonymous Peer Review Platform

**Sprint Duration:** 2-3 weeks  
**Sprint Goal:** Implement end-to-end paper submission workflow (Epic 1) with database persistence and basic authentication  
**Date:** February 15, 2026

---

## Table of Contents
1. [Sprint Goal & Scope](#1-sprint-goal--scope)
2. [Epics Identified](#2-epics-identified)
3. [User Stories & Story Points](#3-user-stories--story-points)
4. [Tasks & Assignment](#4-tasks--assignment)
5. [Sprint Ceremonies](#5-sprint-ceremonies)
6. [Sprint Demo Plan](#6-sprint-demo-plan)
7. [Definition of Done](#7-definition-of-done)

---

## 1. Sprint Goal & Scope

### Primary Goal
**Deliver a working end-to-end paper submission and review workflow** where:
- Students can submit papers anonymously
- Papers are stored in database with blind IDs
- System generates anonymous identifiers for authors
- Foundation is ready for reviewer assignment (Sprint 3)

### What's In Scope
- E1: Double-blind paper submission workflow  
- Database CRUD operations (Create, Read)  
- Basic user authentication (login/session)  
- File upload to Blob Storage  
- Anonymous ID generation  

### What's Out of Scope
- E2: Resume reviews (Sprint 3)  
- E3: Credit system (Sprint 4)  
- E4: Reviewer reputation (Sprint 4)  
- E5: Instructor dashboard (Sprint 5)  
- Email notifications  
- Advanced search/filtering  

### Why This Scope?
Sprint 1 proved we can't do everything. Focus on **one epic working completely** rather than five epics half-done. E1 is the highest priority and unlocks everything else.

---

## 2. Epics Identified

### Epic 1 (E1): Double-Blind Paper Submission System
**Priority:** MUST HAVE  
**Story Points:** 21 (Large)  
**Description:** As a student or recent graduate, I want to submit my academic papers to a double-blind system that hides my identity, so that I can receive objective feedback free from personal bias.

**Acceptance Criteria:**
- Student can create account and log in
- Student can upload paper (PDF) with title and abstract
- System assigns blind ID to submission (e.g., "BLN-8D4A")
- Paper and metadata are saved to database
- Student can view list of their submissions (with blind IDs)
- Author identity is never exposed in the submission record

**Business Value:** Core feature of the platform; without this, nothing else works

**Dependencies:** Database queries, Blob Storage integration, authentication

---

### Epic 2 (E2): Foundation Infrastructure (Enabler Epic)
**Priority:** MUST HAVE  
**Story Points:** 13 (Medium)  
**Description:** As a developer, I need working database queries and authentication so that I can build features on top of a solid foundation.

**Acceptance Criteria:**
- ICosmos methods implemented (InsertDocument, QueryDocuments)
- User login/logout with JWT tokens
- Blob Storage file upload working
- All integration points tested locally

**Business Value:** Unblocks all feature development; E1 cannot be completed without this

**Dependencies:** None (this IS the foundation)

---

## 3. User Stories & Story Points

### E1: Double-Blind Paper Submission

#### Story 1.1: User Registration & Login
**Story Points:** 5 (Medium)  
**Priority:** Must Have  
**Description:** As a student, I want to create an account and log in so that I can submit papers and track my submissions.

**Acceptance Criteria:**
- [ ] User can register with email and password
- [ ] Password is hashed before storage (bcrypt or similar)
- [ ] User can log in and receive JWT token
- [ ] Token is stored in browser (localStorage or cookie)
- [ ] Protected routes redirect to login if not authenticated

**Technical Notes:**
- Backend: `POST /api/auth/register` and `POST /api/auth/login`
- Frontend: Login page, registration page, auth context
- Database: Users collection in Cosmos DB

---

#### Story 1.2: Paper Submission Form
**Story Points:** 8 (Large)  
**Priority:** Must Have  
**Description:** As a student, I want to fill out a form with my paper details and upload the PDF so that the system can process my submission.

**Acceptance Criteria:**
- [ ] Form has fields: Title (text), Abstract (textarea), File (PDF upload)
- [ ] Validation: Title required, Abstract max 500 chars, File must be PDF < 10MB
- [ ] Frontend shows upload progress bar
- [ ] Form is disabled during submission (prevent double-submit)
- [ ] Success message shows blind ID after submission
- [ ] Error message shows if submission fails

**Technical Notes:**
- Frontend: SubmitPaper.tsx with form validation
- File upload uses multipart/form-data
- Displays blind ID in success modal

---

#### Story 1.3: Anonymous ID Generation
**Story Points:** 3 (Small)  
**Priority:** Must Have  
**Description:** As the system, I need to generate unique blind IDs for submissions so that reviewers never see author names.

**Acceptance Criteria:**
- [ ] Blind ID format: "BLN-{6 random alphanumeric chars}" (e.g., "BLN-A3F9X2")
- [ ] Blind IDs are unique (check database before assigning)
- [ ] Author hash is generated from user ID (one-way hash, non-reversible)
- [ ] Blind ID is returned to frontend in submission response

**Technical Notes:**
- Backend: AnonymizationEngine.GenerateBlindId()
- Use GUID and truncate, or random alphanumeric generator
- Store authorHash in submission document, never userId

---

#### Story 1.4: Save Submission to Database
**Story Points:** 5 (Medium)  
**Priority:** Must Have  
**Description:** As the backend, I need to save submission metadata to Cosmos DB so that it can be retrieved later.

**Acceptance Criteria:**
- [ ] Submission document has fields: id, blindId, title, abstract, contentBlobUrl, submittedAt, status, authorHash
- [ ] Document is inserted into "Submissions" container
- [ ] Partition key is submissionId
- [ ] Query test: Can retrieve submission by blindId
- [ ] Query test: Can list all submissions by authorHash (for "My Submissions" page)

**Technical Notes:**
- Backend: SubmissionService.CreateSubmission()
- Uses ICosmos.InsertDocument()
- Returns created submission with id and blindId

---

### E2: Foundation Infrastructure

#### Story 2.1: Implement Cosmos DB Queries
**Story Points:** 5 (Medium)  
**Priority:** Must Have  
**Description:** As a backend developer, I need working CRUD operations on Cosmos DB so that I can store and retrieve data.

**Acceptance Criteria:**
- [ ] ICosmos.InsertDocument() works for any document type
- [ ] ICosmos.GetDocument() retrieves document by ID
- [ ] ICosmos.QueryDocuments() runs SQL-like queries
- [ ] All methods handle errors gracefully (try/catch, log errors)
- [ ] Unit tests for each method (mock Cosmos client)

**Technical Notes:**
- Backend: Implement Cosmos.cs methods
- Use Azure.Cosmos SDK (already installed)
- Test with PlaceHolder endpoint first

---

#### Story 2.2: Blob Storage File Upload
**Story Points:** 5 (Medium)  
**Priority:** Must Have  
**Description:** As the backend, I need to upload files to Azure Blob Storage so that large PDFs don't bloat the database.

**Acceptance Criteria:**
- [ ] Backend accepts multipart/form-data file uploads
- [ ] File is uploaded to Blob Storage container "submissions"
- [ ] Blob URL is returned (e.g., https://.../submissions/{blobId}.pdf)
- [ ] File name is sanitized (remove spaces, special chars)
- [ ] Files are content-addressable (hash-based names to prevent duplicates)

**Technical Notes:**
- Backend: BlobService.UploadFile(stream, fileName)
- Use Azure.Storage.Blobs SDK
- Local dev: Use Azurite (Azure Storage Emulator)

---

#### Story 2.3: JWT Authentication Middleware
**Story Points:** 3 (Small)  
**Priority:** Must Have  
**Description:** As a backend developer, I need JWT token validation so that only authenticated users can access protected endpoints.

**Acceptance Criteria:**
- [ ] /api/auth/login returns JWT token on successful login
- [ ] Token includes claims: userId, email, role
- [ ] Protected endpoints check for valid token (e.g., POST /api/submissions requires auth)
- [ ] Invalid/expired tokens return HTTP 401 Unauthorized
- [ ] Token expiration: 24 hours

**Technical Notes:**
- Backend: Use Microsoft.AspNetCore.Authentication.JwtBearer
- Secret key stored in environment variable (not hardcoded)
- Frontend stores token in localStorage, includes in Authorization header

---

## 4. Tasks & Assignment

### Story 1.1: User Registration & Login (5 pts)

#### Tasks (Markus - Backend):
- [ ] **T1.1.1:** Create User model (C# class with Id, Email, PasswordHash, Role, Credits) - **1 hour**
- [ ] **T1.1.2:** Implement POST /api/auth/register endpoint (validate email, hash password, save to DB) - **1.5 hours**
- [ ] **T1.1.3:** Implement POST /api/auth/login endpoint (verify credentials, generate JWT) - **1.5 hours**
- [ ] **T1.1.4:** Test registration and login with Postman - **0.5 hours**

**Total: 4.5 hours**

#### Tasks (Arsh - Frontend):
- [ ] **T1.1.5:** Create Login page component with email/password form - **1 hour**
- [ ] **T1.1.6:** Create Register page component with email/password/confirm form - **1 hour**
- [ ] **T1.1.7:** Create AuthContext for managing auth state (login, logout, isAuthenticated) - **1.5 hours**
- [ ] **T1.1.8:** Implement token storage in localStorage - **0.5 hours**
- [ ] **T1.1.9:** Add protected route wrapper (redirect to login if not authenticated) - **1 hour**

**Total: 5 hours**

---

### Story 1.2: Paper Submission Form (8 pts)

#### Tasks (Arsh - Frontend):
- [ ] **T1.2.1:** Build form UI with Title, Abstract, File upload fields - **1.5 hours**
- [ ] **T1.2.2:** Add form validation (required fields, file type, file size) - **1 hour**
- [ ] **T1.2.3:** Implement file upload progress bar (show upload %) - **1 hour**
- [ ] **T1.2.4:** Add success modal showing blind ID after submission - **1 hour**
- [ ] **T1.2.5:** Add error handling and display error messages - **0.5 hours**

**Total: 5 hours**

#### Tasks (Markus - Backend):
- [ ] **T1.2.6:** Create POST /api/submissions endpoint (accept multipart/form-data) - **1.5 hours**
- [ ] **T1.2.7:** Parse file upload and extract title/abstract from request - **0.5 hours**
- [ ] **T1.2.8:** Integrate submission flow (anonymize → upload file → save to DB) - **1 hour**

**Total: 3 hours**

---

### Story 1.3: Anonymous ID Generation (3 pts)

#### Tasks (Markus - Backend):
- [ ] **T1.3.1:** Create AnonymizationEngine class with GenerateBlindId() method - **1 hour**
- [ ] **T1.3.2:** Implement blind ID format (BLN-{6 alphanumeric}) with uniqueness check - **1 hour**
- [ ] **T1.3.3:** Implement author hash generation (SHA256 of userId + salt) - **1 hour**
- [ ] **T1.3.4:** Unit test blind ID generation and hash generation - **0.5 hours**

**Total: 3.5 hours**

---

### Story 1.4: Save Submission to Database (5 pts)

#### Tasks (Markus - Backend):
- [ ] **T1.4.1:** Create Submission model (C# class with all fields) - **0.5 hours**
- [ ] **T1.4.2:** Implement SubmissionService.CreateSubmission() (orchestrates flow) - **1.5 hours**
- [ ] **T1.4.3:** Call ICosmos.InsertDocument() to save submission - **0.5 hours**
- [ ] **T1.4.4:** Test query: Retrieve submission by blindId - **1 hour**
- [ ] **T1.4.5:** Test query: List submissions by authorHash - **1 hour**

**Total: 4.5 hours**

---

### Story 2.1: Implement Cosmos DB Queries (5 pts)

#### Tasks (Markus - Backend):
- [ ] **T2.1.1:** Implement ICosmos.InsertDocument<T>() - **1 hour**
- [ ] **T2.1.2:** Implement ICosmos.GetDocument<T>() - **1 hour**
- [ ] **T2.1.3:** Implement ICosmos.QueryDocuments<T>() with SQL query support - **1.5 hours**
- [ ] **T2.1.4:** Add error handling and logging for all methods - **0.5 hours**
- [ ] **T2.1.5:** Test all methods with PlaceHolder endpoint - **1 hour**

**Total: 5 hours**

---

### Story 2.2: Blob Storage File Upload (5 pts)

#### Tasks (Markus - Backend):
- [ ] **T2.2.1:** Create BlobService class with UploadFile() method - **1.5 hours**
- [ ] **T2.2.2:** Integrate Azure.Storage.Blobs SDK (already in project) - **0.5 hours**
- [ ] **T2.2.3:** Implement file upload to "submissions" container - **1.5 hours**
- [ ] **T2.2.4:** Return blob URL after upload - **0.5 hours**
- [ ] **T2.2.5:** Test file upload with sample PDF - **1 hour**

**Total: 5 hours**

---

### Story 2.3: JWT Authentication Middleware (3 pts)

#### Tasks (Markus - Backend):
- [ ] **T2.3.1:** Add JwtBearer NuGet package to Functions project - **0.5 hours**
- [ ] **T2.3.2:** Configure JWT in Program.cs (secret key, expiration) - **1 hour**
- [ ] **T2.3.3:** Modify POST /api/submissions to require [Authorize] attribute - **0.5 hours**
- [ ] **T2.3.4:** Test authentication: Call endpoint without token (should return 401) - **0.5 hours**
- [ ] **T2.3.5:** Test authentication: Call endpoint with valid token (should return 200) - **0.5 hours**

**Total: 3 hours**

---

### Additional Frontend Tasks (Ankit)

#### Task Set: My Submissions Page
- [ ] **T-ANKIT-1:** Create MySubmissions page component - **1 hour**
- [ ] **T-ANKIT-2:** Fetch submissions from GET /api/submissions/mine - **1 hour**
- [ ] **T-ANKIT-3:** Display submissions in card layout (title, blind ID, status, date) - **1.5 hours**
- [ ] **T-ANKIT-4:** Add loading state and error handling - **0.5 hours**
- [ ] **T-ANKIT-5:** Add navigation link to "My Submissions" in header - **0.5 hours**

**Total: 4.5 hours**

---

## 5. Task Assignment Summary

| Team Member | Stories Assigned | Total Hours | Tasks |
|-------------|------------------|-------------|-------|
| **Markus** (Backend) | 1.1, 1.2 (partial), 1.3, 1.4, 2.1, 2.2, 2.3 | **29.5 hours** | T1.1.1-T1.1.4, T1.2.6-T1.2.8, T1.3.1-T1.3.4, T1.4.1-T1.4.5, T2.1.1-T2.1.5, T2.2.1-T2.2.5, T2.3.1-T2.3.5 |
| **Arsh** (Frontend) | 1.1 (partial), 1.2 (partial) | **10 hours** | T1.1.5-T1.1.9, T1.2.1-T1.2.5 |
| **Ankit** (Frontend) | My Submissions page | **4.5 hours** | T-ANKIT-1 through T-ANKIT-5 |

**Total Sprint Effort:** 44 hours (avg ~15 hours/person, realistic for 2-week sprint with school)

---

## 6. Sprint Ceremonies

### Daily Standups (Async)
**Format:** Discord message in #standup channel  
**Frequency:** Every weekday (Mon-Fri)  
**Time Commitment:** 5 minutes/day  

**Template:**
```
Yesterday: [What I completed]
Today: [What I'm working on]
Blockers: [None / Describe issue]
```

**Example:**
```
Yesterday: Completed POST /api/auth/register endpoint
Today: Working on JWT authentication middleware
Blockers: None
```

---

### Mid-Sprint Check-In (Synchronous)
**Date:** End of Week 1 (1 hour)  
**Format:** Discord voice call or in-person  
**Agenda:**
1. Review completed tasks (10 min)
2. Demo working features (20 min)
3. Discuss blockers (15 min)
4. Adjust plan if needed (10 min)
5. Confirm Week 2 priorities (5 min)

**Goal:** Catch issues early, adjust scope if we're behind

---

### Sprint Review (End of Sprint)
**Date:** Last day of Sprint 2 (1 hour)  
**Format:** In-person or recorded video demo  
**Agenda:**
1. Demo working submission flow (20 min)
2. Show database records and blob storage (10 min)
3. Discuss what worked/what didn't (15 min)
4. Review sprint metrics (velocity, completion rate) (10 min)
5. Plan Sprint 3 priorities (5 min)

**Deliverable:** Record demo for submission

---

### Sprint Retrospective (After Review)
**Date:** After sprint review (30 min)  
**Format:** Written document or quick call  
**Questions:**
- What went well?
- What didn't go well?
- What should we change for Sprint 3?

**Output:** Action items for next sprint (e.g., "pair program on backend tasks")

---

## 7. Sprint Demo Plan

### Demo Script (20 minutes)

#### Part 1: User Registration & Login (3 min)
**Demo:**
1. Navigate to Register page
2. Create account with email/password
3. Log out
4. Log in with created account
5. Show JWT token in browser localStorage

**Key Point:** "Authentication works - users can create accounts and log in securely"

---

#### Part 2: Paper Submission (5 min)
**Demo:**
1. Navigate to Submit Paper page
2. Fill out form (title, abstract, upload PDF)
3. Show validation (try submitting without file - should show error)
4. Submit valid paper
5. Show success modal with blind ID (e.g., "BLN-A3F9X2")

**Key Point:** "Students can submit papers anonymously and get a blind ID for tracking"

---

#### Part 3: Backend & Database (7 min)
**Demo:**
1. Open Postman, call POST /api/submissions (show JSON request/response)
2. Open Azure Portal, show Cosmos DB container with saved submission
3. Show submission document JSON (highlight blindId, authorHash, no userId)
4. Open Azure Blob Storage, show uploaded PDF
5. Call GET /api/submissions/mine, show list of submissions

**Key Point:** "Full end-to-end flow - data is saved to database, files are in blob storage"

---

#### Part 4: My Submissions Page (3 min)
**Demo:**
1. Navigate to My Submissions page
2. Show list of submitted papers (title, blind ID, status, date)
3. Click on a submission (future: view details)

**Key Point:** "Students can track their submissions with blind IDs"

---

#### Part 5: Code Walkthrough (2 min)
**Demo:**
1. Show AnonymizationEngine.GenerateBlindId() code
2. Show SubmissionService.CreateSubmission() flow
3. Highlight how author identity is never exposed

**Key Point:** "System architecture ensures anonymity by design"

---

### Demo Checklist
- [ ] Test environment is working (frontend + backend running)
- [ ] Sample data is ready (test account, test papers)
- [ ] Azure resources are accessible (Cosmos DB, Blob Storage)
- [ ] Screen recording tool ready (OBS, Zoom)
- [ ] All team members know their parts
- [ ] Backup plan if demo breaks (pre-recorded video)

---

## 8. Definition of Done

A user story is considered "Done" when:
- [ ] All tasks are completed and code is committed
- [ ] Code is reviewed by at least one team member
- [ ] Frontend and backend integration works (tested locally)
- [ ] Happy path is tested (e.g., successful submission)
- [ ] Error path is tested (e.g., invalid file upload)
- [ ] Code is deployed/merged to main branch
- [ ] Feature is demo-able (can show in sprint review)

**Note:** We don't have automated tests yet, so manual testing is acceptable for Sprint 2.

---

## 9. Risk Management

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Azure Cosmos DB quota exceeded** | Medium | High | Monitor usage, use local emulator for dev |
| **Team member gets sick** | Low | Medium | Cross-train on critical tasks |
| **Scope creep (adding features mid-sprint)** | High | High | Strict "no new features" rule, defer to Sprint 3 |
| **Blob Storage costs exceed budget** | Low | Medium | Use Azurite locally, only use real Azure for demo |
| **JWT auth takes longer than expected** | Medium | Medium | Use simpler session-based auth as fallback |

---

## 10. Sprint Metrics

### Velocity Tracking
- **Planned Story Points:** 34 (E1: 21 + E2: 13)
- **Target Completion:** 80% (27 story points)
- **Buffer:** 20% for unexpected issues

### Success Criteria
- - User can register and log in
- - User can submit paper with blind ID
- - Submission is saved to database
- - File is uploaded to blob storage
- - User can view their submissions

**If we complete all 5, Sprint 2 is a success.**

---

## Appendix: Story Point Reference

| Story Points | Complexity | Time Estimate | Examples |
|--------------|------------|---------------|----------|
| **1** | Trivial | 0.5-1 hour | Add field to model, fix typo |
| **2** | Very Small | 1-2 hours | Simple form validation, add button |
| **3** | Small | 2-3 hours | New API endpoint (simple CRUD) |
| **5** | Medium | 3-5 hours | Complex form with validation, auth middleware |
| **8** | Large | 5-8 hours | Multi-step flow, file upload with progress |
| **13** | Very Large | 8-13 hours | Full authentication system, complex integration |
| **21** | Epic | 13+ hours | Complete feature (should be broken down) |