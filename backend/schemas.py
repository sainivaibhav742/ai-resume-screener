from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from models import UserRole, ApplicationStatus, JobStatus

# Auth Schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    role: UserRole = UserRole.CANDIDATE

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[int] = None

class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Candidate Schemas
class CandidateBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    headline: Optional[str] = None
    summary: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    preferred_role: Optional[str] = None
    salary_expectation: Optional[int] = None
    notice_period: Optional[int] = None

class CandidateCreate(CandidateBase):
    pass

class CandidateUpdate(CandidateBase):
    pass

class CandidateResponse(CandidateBase):
    id: int
    user_id: int
    profile_photo: Optional[str]
    total_experience_years: float
    is_profile_public: bool
    profile_completion: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Recruiter Schemas
class RecruiterBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    company_name: Optional[str] = None
    company_website: Optional[str] = None
    company_size: Optional[str] = None
    industry: Optional[str] = None
    position: Optional[str] = None

class RecruiterCreate(RecruiterBase):
    pass

class RecruiterUpdate(RecruiterBase):
    pass

class RecruiterResponse(RecruiterBase):
    id: int
    user_id: int
    profile_photo: Optional[str]
    subscription_plan: str
    subscription_expiry: Optional[datetime]
    resumes_screened_count: int
    monthly_limit: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Experience Schemas
class ExperienceBase(BaseModel):
    job_title: str
    company_name: str
    location: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_current: bool = False
    description: Optional[str] = None
    achievements: Optional[List[str]] = []

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(ExperienceBase):
    pass

class ExperienceResponse(ExperienceBase):
    id: int
    candidate_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Education Schemas
class EducationBase(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    grade: Optional[str] = None
    description: Optional[str] = None

class EducationCreate(EducationBase):
    pass

class EducationUpdate(EducationBase):
    pass

class EducationResponse(EducationBase):
    id: int
    candidate_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Certification Schemas
class CertificationBase(BaseModel):
    name: str
    issuing_organization: Optional[str] = None
    issue_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None

class CertificationCreate(CertificationBase):
    pass

class CertificationUpdate(CertificationBase):
    pass

class CertificationResponse(CertificationBase):
    id: int
    candidate_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Skill Schemas
class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: int
    
    class Config:
        from_attributes = True

# Resume Schemas
class ResumeBase(BaseModel):
    title: str
    template: str = "modern"
    content: Optional[dict] = {}

class ResumeCreate(ResumeBase):
    pass

class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    template: Optional[str] = None
    content: Optional[dict] = None

class ResumeResponse(ResumeBase):
    id: int
    candidate_id: int
    score: float
    ats_score: float
    is_default: bool
    version: int
    file_url: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Job Schemas
class JobBase(BaseModel):
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    experience_level: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    description: Optional[str] = None
    responsibilities: Optional[List[str]] = []
    qualifications: Optional[List[str]] = []
    benefits: Optional[List[str]] = []

class JobCreate(JobBase):
    required_skills: Optional[List[str]] = []

class JobUpdate(JobBase):
    status: Optional[JobStatus] = None
    required_skills: Optional[List[str]] = []

class JobResponse(JobBase):
    id: int
    recruiter_id: int
    status: JobStatus
    views_count: int
    applications_count: int
    created_at: datetime
    updated_at: Optional[datetime]
    published_at: Optional[datetime]
    expires_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Application Schemas
class ApplicationBase(BaseModel):
    cover_letter: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    job_id: int
    resume_id: Optional[int] = None

class ApplicationUpdate(BaseModel):
    status: Optional[ApplicationStatus] = None
    notes: Optional[dict] = None

class ApplicationResponse(ApplicationBase):
    id: int
    candidate_id: int
    job_id: int
    resume_id: Optional[int]
    status: ApplicationStatus
    match_score: Optional[float]
    applied_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Match Schemas
class MatchResponse(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    overall_score: float
    skills_match: Optional[float]
    experience_match: Optional[float]
    education_match: Optional[float]
    location_match: Optional[float]
    explanation: Optional[dict]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Screening Result Schemas
class ScreeningResultResponse(BaseModel):
    id: int
    recruiter_id: int
    resume_id: int
    job_id: Optional[int]
    overall_score: Optional[float]
    role_prediction: Optional[str]
    skill_gaps: Optional[dict]
    red_flags: Optional[dict]
    strengths: Optional[dict]
    recommendations: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
