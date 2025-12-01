# 🎨 Visual Architecture Guide

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI RESUME SCREENER                           │
│                   Smart Hiring OS Platform                      │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  CANDIDATE   │    │   UNIFIED    │    │  RECRUITER   │
│   PORTAL     │◄───┤      AI      ├───►│   PORTAL     │
│  (Frontend)  │    │ INTELLIGENCE │    │  (Frontend)  │
└──────────────┘    └──────────────┘    └──────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  FastAPI Backend │
                    │   (60+ Routes)   │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │    Database      │
                    │  (15 Tables)     │
                    └──────────────────┘
```

## Backend Architecture

```
backend/
│
├── main_new.py ⭐ NEW
│   ├── FastAPI App Initialization
│   ├── CORS Middleware
│   ├── Router Registration
│   ├── Legacy Endpoints (backward compatible)
│   └── AI Integration (NVIDIA API)
│
├── database.py ⭐ NEW
│   ├── SQLAlchemy Engine
│   ├── Session Management
│   └── Database URL Configuration
│
├── models.py ⭐ NEW (15 Models)
│   ├── User (role-based)
│   ├── Candidate Profile
│   ├── Recruiter Profile
│   ├── Resume (with versioning)
│   ├── Job Posting
│   ├── Application (with status)
│   ├── Experience
│   ├── Education
│   ├── Certification
│   ├── Skill
│   ├── Match (AI scoring)
│   ├── ScreeningResult
│   ├── TeamMember
│   ├── Tag
│   └── Analytics
│
├── schemas.py ⭐ NEW (30+ Schemas)
│   ├── User Schemas (Create, Response, Login, Token)
│   ├── Candidate Schemas
│   ├── Recruiter Schemas
│   ├── Resume Schemas
│   ├── Job Schemas
│   ├── Application Schemas
│   └── Match Schemas
│
├── auth.py ⭐ NEW
│   ├── Password Hashing (bcrypt)
│   ├── JWT Token Creation
│   ├── Token Verification
│   ├── User Authentication
│   └── Role-Based Guards
│
├── init_db.py ⭐ NEW
│   ├── Create All Tables
│   ├── Drop All Tables
│   └── Database Management CLI
│
└── routers/ ⭐ NEW
    │
    ├── auth_routes.py
    │   ├── POST /api/auth/register
    │   ├── POST /api/auth/login
    │   ├── GET  /api/auth/me
    │   └── POST /api/auth/logout
    │
    ├── candidate_routes.py (25+ endpoints)
    │   ├── Profile Management
    │   │   ├── GET  /api/candidate/profile
    │   │   └── PUT  /api/candidate/profile
    │   │
    │   ├── Resume Management
    │   │   ├── GET    /api/candidate/resumes
    │   │   ├── POST   /api/candidate/resumes
    │   │   ├── GET    /api/candidate/resumes/{id}
    │   │   ├── PUT    /api/candidate/resumes/{id}
    │   │   └── DELETE /api/candidate/resumes/{id}
    │   │
    │   ├── Experience Management
    │   │   ├── GET  /api/candidate/experiences
    │   │   └── POST /api/candidate/experiences
    │   │
    │   ├── Education Management
    │   │   ├── GET  /api/candidate/education
    │   │   └── POST /api/candidate/education
    │   │
    │   ├── Job Discovery
    │   │   ├── GET /api/candidate/jobs
    │   │   └── GET /api/candidate/job-matches
    │   │
    │   └── Applications
    │       ├── GET  /api/candidate/applications
    │       └── POST /api/candidate/applications
    │
    └── recruiter_routes.py (25+ endpoints)
        ├── Profile Management
        │   ├── GET /api/recruiter/profile
        │   └── PUT /api/recruiter/profile
        │
        ├── Dashboard
        │   └── GET /api/recruiter/dashboard/stats
        │
        ├── Job Management
        │   ├── GET    /api/recruiter/jobs
        │   ├── POST   /api/recruiter/jobs
        │   ├── GET    /api/recruiter/jobs/{id}
        │   ├── PUT    /api/recruiter/jobs/{id}
        │   └── DELETE /api/recruiter/jobs/{id}
        │
        ├── Application Management
        │   ├── GET /api/recruiter/jobs/{id}/applications
        │   └── PUT /api/recruiter/applications/{id}
        │
        ├── Resume Screening
        │   ├── POST /api/recruiter/screen-resume
        │   └── GET  /api/recruiter/screening-results
        │
        ├── Candidate Ranking
        │   └── GET /api/recruiter/jobs/{id}/candidates/ranked
        │
        ├── Team Management
        │   ├── GET  /api/recruiter/team
        │   └── POST /api/recruiter/team
        │
        └── Analytics
            └── GET /api/recruiter/analytics
```

## Frontend Architecture

```
frontend/src/
│
├── app/
│   │
│   ├── page.tsx (Landing Page)
│   │   ├── Hero Section
│   │   ├── Features Grid
│   │   ├── Stats Display
│   │   └── Navigation
│   │
│   ├── candidate/ ⭐ NEW
│   │   └── page.tsx
│   │       ├── Candidate Dashboard
│   │       ├── Profile Stats
│   │       ├── Quick Actions
│   │       │   ├── Build Resume
│   │       │   ├── Browse Jobs
│   │       │   └── Update Profile
│   │       └── Recent Activity
│   │
│   └── recruiter/ ⭐ NEW
│       └── page.tsx
│           ├── Recruiter Dashboard
│           ├── Dashboard Stats
│           ├── Usage Meter
│           ├── Quick Actions
│           │   ├── Post Job
│           │   ├── Screen Resume
│           │   └── View Candidates
│           └── Recent Applications
│
├── components/
│   ├── ResumeUploader.tsx (existing)
│   ├── Dashboard.tsx (existing)
│   ├── ResumeMakerForm.tsx (existing)
│   ├── JobPostingForm.tsx (existing)
│   ├── ChatAssistant.tsx (existing)
│   ├── ThemeToggle.tsx (existing)
│   └── Footer.tsx (existing)
│
└── lib/ ⭐ NEW
    └── api.ts
        ├── Axios Configuration
        ├── Request Interceptors (add token)
        ├── Response Interceptors (handle 401)
        │
        ├── authAPI
        │   ├── register()
        │   ├── login()
        │   ├── logout()
        │   └── getCurrentUser()
        │
        ├── candidateAPI
        │   ├── Profile: get, update
        │   ├── Resumes: CRUD operations
        │   ├── Experience: get, create
        │   ├── Education: get, create
        │   ├── Jobs: browse, getMatches
        │   └── Applications: get, apply
        │
        ├── recruiterAPI
        │   ├── Profile: get, update
        │   ├── Dashboard: getStats
        │   ├── Jobs: CRUD operations
        │   ├── Applications: get, updateStatus
        │   ├── Screening: screenResume, getResults
        │   ├── Candidates: getRanked
        │   ├── Team: get, invite
        │   └── Analytics: get
        │
        └── Helper Functions
            ├── setAuthToken()
            ├── clearAuthTokens()
            └── isAuthenticated()
```

## Database Schema

```
┌─────────────┐
│    users    │
├─────────────┤
│ id (PK)     │
│ email       │◄───────────┐
│ password    │            │
│ role        │            │
│ is_active   │            │
└─────────────┘            │
       │                   │
       │                   │
   ┌───┴───┐              │
   │       │              │
   ▼       ▼              │
┌──────────┐  ┌──────────┐│
│candidates│  │recruiters││
├──────────┤  ├──────────┤│
│ id (PK)  │  │ id (PK)  ││
│ user_id  │  │ user_id  ││
│ name     │  │ company  ││
│ skills   │  │ plan     ││
│ ...      │  │ ...      ││
└────┬─────┘  └────┬─────┘│
     │             │       │
     │             │       │
     ▼             ▼       │
┌─────────┐  ┌──────────┐ │
│ resumes │  │   jobs   │ │
├─────────┤  ├──────────┤ │
│ id (PK) │  │ id (PK)  │ │
│ cand_id │  │ recr_id  │─┘
│ content │  │ title    │
│ score   │  │ status   │
└────┬────┘  └────┬─────┘
     │            │
     │            │
     └────┬───────┘
          │
          ▼
   ┌─────────────┐
   │applications │
   ├─────────────┤
   │ id (PK)     │
   │ cand_id     │
   │ job_id      │
   │ resume_id   │
   │ status      │
   │ match_score │
   └─────────────┘

Additional Tables:
├── experiences (candidate work history)
├── education (candidate education)
├── certifications (candidate certs)
├── skills (skill taxonomy)
├── matches (AI match scores)
├── screening_results (resume analysis)
├── team_members (recruiter teams)
├── tags (categorization)
└── analytics (usage tracking)
```

## Authentication Flow

```
┌──────────┐                     ┌──────────┐
│  Client  │                     │  Server  │
└────┬─────┘                     └────┬─────┘
     │                                │
     │  POST /api/auth/register       │
     ├───────────────────────────────►│
     │  {email, password, role}       │
     │                                │
     │  ◄─────────────────────────────┤
     │  {user_data}                   │
     │                                │
     │  POST /api/auth/login          │
     ├───────────────────────────────►│
     │  {email, password}             │
     │                                │
     │  ◄─────────────────────────────┤
     │  {access_token, refresh_token} │
     │                                │
     │  [Store tokens in localStorage]│
     │                                │
     │  GET /api/candidate/profile    │
     │  Authorization: Bearer {token} │
     ├───────────────────────────────►│
     │                                │
     │  [Verify token & role]         │
     │                                │
     │  ◄─────────────────────────────┤
     │  {profile_data}                │
     │                                │
```

## Data Flow: Resume Creation

```
┌──────────────┐
│  Candidate   │
│   Portal     │
└──────┬───────┘
       │
       │ 1. Fill Resume Form
       │
       ▼
┌──────────────────┐
│ ResumeBuilder    │
│   Component      │
└──────┬───────────┘
       │
       │ 2. candidateAPI.createResume()
       │
       ▼
┌──────────────────┐
│   API Client     │
│  (with token)    │
└──────┬───────────┘
       │
       │ 3. POST /api/candidate/resumes
       │
       ▼
┌──────────────────┐
│ candidate_routes │
│  .create_resume()│
└──────┬───────────┘
       │
       │ 4. Validate & Save
       │
       ▼
┌──────────────────┐
│    Database      │
│ Resume Table     │
└──────┬───────────┘
       │
       │ 5. Return Resume Object
       │
       ▼
┌──────────────────┐
│    Response      │
│ {resume_data}    │
└──────────────────┘
```

## Data Flow: Job Matching

```
┌──────────────────┐
│   Candidate      │
│   Profile        │
└────────┬─────────┘
         │
         │ Skills, Experience, Education
         │
         ▼
┌─────────────────────┐
│  Matching Engine    │
│  (AI Algorithm)     │
└────────┬────────────┘
         │
         │ Calculate Scores
         │
         ├──► Skills Match
         ├──► Experience Match
         ├──► Education Match
         └──► Location Match
                │
                ▼
         ┌──────────────┐
         │ Match Object │
         │ overall: 85% │
         │ breakdown:   │
         │  - skills: 90%│
         │  - exp: 80%  │
         │  - edu: 85%  │
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │  Display to  │
         │  Candidate   │
         │  & Recruiter │
         └──────────────┘
```

## User Journey: Candidate

```
1. Register/Login
   └─► /api/auth/register
   └─► /api/auth/login

2. Complete Profile
   └─► /api/candidate/profile
   └─► /api/candidate/experiences
   └─► /api/candidate/education

3. Build Resume
   └─► /api/candidate/resumes (POST)
   └─► Get Score & Feedback

4. Browse Jobs
   └─► /api/candidate/jobs
   └─► /api/candidate/job-matches

5. Apply to Jobs
   └─► /api/candidate/applications (POST)

6. Track Applications
   └─► /api/candidate/applications (GET)

7. Improve Profile
   └─► Based on feedback
   └─► Update resume
   └─► Get better matches
```

## User Journey: Recruiter

```
1. Register/Login
   └─► /api/auth/register
   └─► /api/auth/login

2. Setup Company Profile
   └─► /api/recruiter/profile

3. Post Job
   └─► /api/recruiter/jobs (POST)

4. Screen Resumes
   └─► /api/recruiter/screen-resume (POST)
   └─► Get AI Analysis

5. Review Applications
   └─► /api/recruiter/jobs/{id}/applications

6. Rank Candidates
   └─► /api/recruiter/jobs/{id}/candidates/ranked

7. Update Status
   └─► /api/recruiter/applications/{id} (PUT)

8. Collaborate
   └─► /api/recruiter/team
   └─► Add notes, share feedback

9. Track Metrics
   └─► /api/recruiter/analytics
```

## File Structure Summary

```
ai-resume-screener/
│
├── 📁 backend/
│   ├── main_new.py ⭐ (main app)
│   ├── database.py ⭐ (DB config)
│   ├── models.py ⭐ (15 models)
│   ├── schemas.py ⭐ (30+ schemas)
│   ├── auth.py ⭐ (authentication)
│   ├── init_db.py ⭐ (DB setup)
│   └── routers/ ⭐
│       ├── auth_routes.py
│       ├── candidate_routes.py
│       └── recruiter_routes.py
│
├── 📁 frontend/
│   └── src/
│       ├── app/
│       │   ├── candidate/ ⭐
│       │   └── recruiter/ ⭐
│       └── lib/
│           └── api.ts ⭐
│
├── 📁 ml/
│   ├── job_predictor.py
│   └── train_models.py
│
├── 📁 docs/
│   ├── SETUP.md ⭐
│   ├── STATUS.md ⭐
│   ├── plan.md ⭐
│   ├── todo.md ⭐
│   ├── IMPLEMENTATION_SUMMARY.md ⭐
│   └── ARCHITECTURE.md ⭐ (this file)
│
├── start.ps1 ⭐
├── start.sh ⭐
├── .env.example ⭐
├── requirements.txt (updated)
└── README.md (updated)

⭐ = New or Updated File
```

## Technology Stack Visual

```
┌─────────────────────────────────────────────┐
│              FRONTEND                       │
├─────────────────────────────────────────────┤
│ Next.js 14  │ React 19  │ TypeScript      │
│ Tailwind    │ Axios     │ Chart.js        │
└─────────────────────────────────────────────┘
                     │
                HTTP/JSON
                     │
┌─────────────────────────────────────────────┐
│              BACKEND API                    │
├─────────────────────────────────────────────┤
│ FastAPI │ Pydantic │ JWT Auth             │
│ Uvicorn │ CORS     │ OpenAPI              │
└─────────────────────────────────────────────┘
                     │
                SQL/ORM
                     │
┌─────────────────────────────────────────────┐
│              DATABASE                       │
├─────────────────────────────────────────────┤
│ PostgreSQL / SQLite                         │
│ SQLAlchemy ORM                              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│              AI/ML LAYER                    │
├─────────────────────────────────────────────┤
│ NVIDIA API  │ spaCy   │ Transformers      │
│ scikit-learn│ PyMuPDF │ Job Predictor     │
└─────────────────────────────────────────────┘
```

---

**This architecture provides:**
- ✅ Clean separation of concerns
- ✅ Scalable microservices-ready design
- ✅ Role-based access control
- ✅ Comprehensive API coverage
- ✅ Database normalization
- ✅ Security best practices
- ✅ Easy to extend and maintain
