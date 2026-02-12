# Sprint 1 Demo - BlindReview

## Overview
Sprint 1 was all about getting the basics right - we set up the entire tech stack from scratch and got the skeleton of the application running. No fancy features yet, just getting the frontend and backend to talk to each other and making sure we had a solid foundation to build on. Think of it as laying the foundation for a house before worrying about the paint color.

---

## 1. Technology Stack (WHAT & WHY)

#### Frontend
- **React + TypeScript**
  - *Why:* Type safety catches bugs early. React's component structure makes it easy to build pages for different user roles. We didn't want to reinvent the wheel.
  - *Setup:* Arsh got the Vite dev environment running with hot reload so we could see changes instantly.

- **Vite**
  - *Why:* Faster than Create React App, which matters when you're iterating quickly. Plus it just works out of the box.

- **ESLint + TypeScript**
  - *Why:* Keeps the code clean and catches silly mistakes before they become real problems.

#### Backend
- **Azure Functions (.NET 8.0)**
  - *Why:* Scalable, serverless - good for something that might get random traffic spikes during submission deadlines. Markus handled the initial setup here.
  - *Language:* C# because that's what Azure Functions loves.

- **ASP.NET Core Runtime**
  - *Why:* It's the standard way to build APIs in the .NET world. We follow the beaten path.

#### Database
- **Azure Cosmos DB**
  - *Why:* NoSQL with flexible documents - perfect for when you're not 100% sure what your data structure will look like. Markus got this integrated.
  - *Model:* Set up Cosmos.cs abstraction so the rest of the backend doesn't have to think about database stuff directly.

#### Infrastructure & DevOps
- **Azure Cloud Platform**
  - Hosting and scalability for production deployment
  - Managed database service (Cosmos DB)
  - Function app hosting with automatic updates

#### Development Tools
- **Node.js** (Frontend) + **.NET SDK** (Backend)
- **VSCode** with debugging support for both runtimes

### The Honest Take
We picked this because it's what we know, it scales reasonably well, and it doesn't require an army of DevOps engineers to maintain. Azure is what the university has licenses for, so it made sense to use it. Plus, separation between frontend and backend means we could work on them independently without stepping on each other's toes - which is exactly what happened this sprint with Arsh/Ankit on frontend and Markus on backend.

---

## 2. Sprint Goal and Progress (WHAT & HOW MUCH)

### Sprint Goal
Establish the foundation for a blind peer review platform. This means setting up infrastructure and basic UI/UX scaffolding to support the core epics:
- **E1 (Must Have):** Let students submit papers to a double-blind review system
- **E2 (Must Have):** Let graduates submit resumes for recruiter reviews
- **E3-E5 (Lower Priority):** Credit system, reviewer reputation, and instructor dashboards

We focused on the skeleton because honestly, you can't build anything meaningful without a solid foundation first. And that foundation took most of the sprint.

### What We're Actually Building

**Core Epics (in order of importance):**

#### E1: Double-Blind Paper Submission (Must Have)
*"As a student or recent graduate, I want to submit my academic papers or projects to a double-blind system that hides my identity, so that I can receive objective feedback that is free from personal bias."*

**Sprint 1 Progress:**
- **Story 1.1:** Paper Submission Form
  - **Status:** 📋 Shell Created
  - **What happened:** SubmitPaper.tsx exists as an empty form. Infrastructure is ready, form logic and database integration come in Sprint 2.


#### E2: Resume Review by Industry Professionals (Must Have)
*"As a job-seeking graduate, I want to submit my resume to be reviewed by a verified industry recruiter, so that I can receive expert insights that help me pass initial screenings."*

**Sprint 1 Progress:**
- **Story 2.1:** Resume Submission Interface
  - **Status:** 📋 Shell Created
  - **What happened:** Similar to papers - we have a page framework (SubmitPaper works for resumes too). Actual form validation and file handling are Sprint 2.

#### E3: Earn Credits by Reviewing (Lower Priority)
*"As a user with a limited budget, I want to earn platform credits by providing high-quality reviews for others, so that I can unlock premium services like recruiter reviews."*

**Sprint 1 Progress:**
- **Story 3.1:** Credit System Architecture
  - **Status:** 💬 Design Discussion Only
  - **What happened:** We whiteboarded how credits flow - reviews generate credits, credits unlock features. But we decided not to code this in Sprint 1 because credit transactions only make sense once people can actually submit things.

#### E4: Build Reviewer Reputation (Lower Priority)
*"As a reviewer (student or professional), I want to use structured templates to provide feedback and earn 'helpfulness ratings' from authors, so that I can build a reputation for quality and potentially get paid for my time."*

**Sprint 1 Progress:**
- **Story 4.1:** Review Template System
  - **Status:** 📋 Shell Created
  - **What happened:** SubmitReview.tsx exists. The template structure (prompts for feedback, etc.) is planned but not built.


#### E5: Instructor Monitoring Dashboard (Lower Priority)
*"As a tutor or instructor, I want to use a centralized dashboard to monitor the quality and participation of my students' peer reviews, so that I can ensure they are engaging in meaningful learning."*

**Sprint 1 Progress:**
- **Story 5.1:** Instructor Dashboard
  - **Status:** 📋 Shell Created
  - **What happened:** We have page structure for this (Dashboard.tsx can be extended). No actual analytics or participant tracking yet.

---

### Planned Epics & Stories

#### Infrastructure & Foundation Setup (Critical for all epics)
This is what actually took the sprint:
- Database connection testing (Markus)
- Frontend-backend communication (Arsh + Markus)
- TypeScript type definitions and page structures (Ankit)
- Page routing and navigation (Ankit + Arsh)

Yes, this is boring. Yes, it's necessary. You can't build E1-E5 without it.

#### Authentication & Role Management
  - **Status:** 🔄 Not Started
  - **Why:** We wanted to get basic infrastructure working first. Auth is Sprint 2.

  - **Status:** 📋 Basic Pages Exist
  - **What happened:** Routing for Student/Reviewer/Admin roles is scaffolded.

#### User Interface & Core Workflows
  - **Status:** ✅ Basic Structure Done
  - **What happened:** Pages for each epic are scaffolded. Navigation works.


#### Backend Infrastructure (Supporting All Epics)
- **Azure Functions Setup** ✅ Done (Markus)
  - .NET 8.0 project initialized and ready

- **Cosmos DB Integration** ✅ Connection Works (Markus)
  - Cosmos.cs abstraction layer is ready
  - Database connection tested
  - No actual queries written yet (Sprint 2)

- **Azure Blob Storage** ❌ Not Started
  - Needed for paper/resume file uploads (Sprint 2)

### Progress Summary
**Real Talk:** We bit off more than we could chew with school in the way. But we got the foundation for all 5 epics standing.

- **What Actually Got Done:**
  - ✅ Project structure for frontend and backend working
  - ✅ Vite dev environment running (Arsh)
  - ✅ React pages scaffolded for E1, E2, E3, E4, E5 workflows (Ankit)
  - ✅ Routing between all major user flows works (Ankit + Arsh)
  - ✅ Backend Functions project initialized (Markus)
  - ✅ Cosmos DB connection tested and working (Markus)
  - ✅ Frontend can successfully call backend (Arsh + Markus)
  - ✅ TypeScript types framework defined (Ankit)

.

- **What We Haven't Touched Yet:**
  - ❌ Database queries/CRUD operations (connection works, queries don't)
  - ❌ Azure blob storage for paper/resume file uploads
  - ❌ Form validation and submission logic for any epic
  - ❌ Authentication/authorization
  - ❌ Any actual feature implementation (it's all scaffolding)

---

## 3. Progress Demo (SHOW US)

### Live Demonstration

#### What We're Actually Showing
1. **Frontend Navigation Works for All Epics**
   - You can click around between pages (E1, E2, E3, E4, E5 workflows)
   - It's a real React app with actual routing
   - Pages render without crashing
   - Each epic has its own submission/review interface (even if empty)

2. **Backend Infrastructure is Solid**
   - Azure Functions project is set up and compiles
   - Cosmos DB connection works (we tested it)
   - Frontend can successfully call backend and get responses
   - Ready to add actual business logic in Sprint 2

3. **Foundation for All 5 Epics**
   - E1 (Double-blind papers): Paper submission page exists
   - E2 (Resume reviews): Same form can handle resumes
   - E3, E4, E5 (Credits, reputation, instructor dash): All have page shells ready


#### What Actually Works
- ✅ Frontend dev environment (Arsh)
- ✅ React framework and routing (Ankit + Arsh)
- ✅ Backend project compiles (Markus)
- ✅ Database connection established (Markus)
- ✅ Frontend → Backend communication (Arsh + Markus)

#### What Doesn't Work Yet
- **E1 (Papers):** Form exists but doesn't save, anonymity not implemented
- **E2 (Resumes):** Form exists but doesn't save, recruiter verification not implemented
- **E3 (Credits):** Credit tracking system not built, no earned/spent logic
- **E4 (Helpfulness):** Review templates not implemented, rating system not built
- **E5 (Instructor Dashboard):** Dashboard shell exists but no analytics or participant tracking
- **Backend:** No database queries, no authentication, no file uploads to blob storage

---

## 4. Agile Process (HOW YOU WORKED)


### How We Actually Worked

#### The Process
- **Sprint Duration:** 2 weeks
- **Standup:** Just 3 of us checking in when we hit problems
- **Tools:** MostlyDiscord for quick chats, occasionally in person chats.

#### What Happened
**Week 1:** Everyone got their environment set up
- Markus got Azure Functions and Cosmos DB running
- Arsh got Vite and React configured with hot reload
- Ankit started scaffolding the pages

**Week 2:** Made them talk to each other
- Arsh and Markus figured out how frontend should call backend
- Ankit kept building out the page structure
- Started defining types so TypeScript wouldn't yell at us

#### Actual Challenges
1. **Getting Vite and React configured properly**
   - Arsh spent time on this. It just works now.

2. **Making sure frontend and backend could communicate**
   - Got it working, which was the real win of Sprint 1

3. **TypeScript types everywhere**
   - Ankit created INITIAL types.ts with all the data models
   - Will hopefully be organized moving forward

#### Agile Things We Did
- Regular discord updates so nobody got too far stuck
- Divided work so people weren't stepping on each other (Markus on backend, Arsh on frontend setup, Ankit on file structure and skeleton setup)
- Built skeleton first, details later (which is what agile is supposed to be about)
- All three of us bounced ideas off each other even though we had separate roles

---

## 5. Team Collaboration (HOW YOU WORKED TOGETHER)

### Team Breakdown
**Markus** - Backend infrastructure  
**Arsh** - Frontend setup and connecting to backend  
**Ankit** - Pages, routing, types, and keeping everything organized

### How We Actually Collaborated

#### Markus's Role
- Set up Azure Functions project
- Got Cosmos DB connected and tested the connection
- Built the ICosmos abstraction layer (connection works, queries don't exist yet)
- Figured out basic API request handling

#### Arsh's Role
- Got Vite and React running with hot reload
- Made frontend talk to backend (this was the win)
- Dealt with build configuration

#### Ankit's Role
- Created all the page components (Home, Dashboard, SubmitPaper, etc.)
- Configure up routing
- Defined TypeScript types
- Organized our discussions and turned them into this markdown

#### Communication
- We had Discord calls when something needed quick decisions
- Didn't need formal meetings because we're only 3 people

#### Biggest Win
Frontend and backend actually communicate. That's much harder to do if you don't get it right at the start. We did.

#### Biggest Lesson
Don't design complex features in meetings. Build something simple, see how it breaks, then design the complex stuff. We should have known this.

#### What We'd Tell Next Sprint
- Be realistic about time (school exists)
- Finished > Complicated
- Database queries matter more than design discussions right now

### Why We Overestimated

Honest answer: we all have other classes. Multiple projects. Quizzes. We looked at the scope at the start of the sprint and thought "yeah we can do all that." Turns out we couldn't. School wins. What we actually accomplished is more like what one person could do in a solid week, stretched across three people over two weeks while juggling other coursework.

---

## Real Talk

### The Real Takeaway

**We got the skeleton standing** and it actually works. That's honestly the hardest part.

**What Went Well:**
- Setup worked without major disasters
- Everyone knew what they were doing
- Frontend and backend can talk to each other
- We had some good design discussions about the big picture

**Why That's Okay:**
- At least the foundation is solid
- We're not going to waste time rewriting this
- Now we can actually build on something that works

**What We Should Have Done Differently:**
- Estimated for real instead of optimistically
- Said "no" to design discussions about complex features we didn't have time for
- Focused on one feature working end-to-end instead of trying to spread thin

### Sprint 2 Priorities (in order of importance)

**Foundation Enablers:**
1. **Write Database Queries** - SELECT, INSERT, UPDATE queries so we can actually save/retrieve data (all epics depend on this)
2. **Basic Authentication & User Sessions** - JWT tokens or session management (all epics need this)
3. **File Upload to Azure Blob Storage** - Required for papers, resumes, and review artifacts (E1, E2, E4)

**Epic Implementation (in priority order):**
1. **E1 - Double-Blind Paper Submission (Must Have)**
   - Complete form logic, validation, and database save
   - Implement anonymity (strip author info, assign blind IDs)

2. **E2 - Resume Review by Recruiters (Must Have)**
   - Reuse paper submission form/logic, adapt for resume files
   - Implement recruiter verification system

3. **E3 - Credit System for Reviews (Lower Priority)**
   - Credit transaction tracking in database
   - Integration with review submissions

4. **E4 - Reviewer Reputation (Lower Priority)**
   - Review template implementation
   - Helpfulness rating calculation

5. **E5 - Instructor Dashboard (Lower Priority)**
   - Analytics queries for student participation
   - Quality metrics and visualization

**Key Rule for Sprint 2:** Don't design anything else in meetings. Build E1, see what breaks, then properly design the rest.


---

**Sprint 1 Demo by:** Markus, Arsh, and Ankit  
**Date:** February 11, 2026  
**Status:** Foundation set. Features coming next sprint (hopefully).
