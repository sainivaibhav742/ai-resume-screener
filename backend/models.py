from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, ForeignKey, Table, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

# Enums
class UserRole(str, enum.Enum):
    CANDIDATE = "candidate"
    RECRUITER = "recruiter"
    ADMIN = "admin"

class ApplicationStatus(str, enum.Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    SHORTLISTED = "shortlisted"
    REJECTED = "rejected"
    INTERVIEW = "interview"
    OFFERED = "offered"
    ACCEPTED = "accepted"

class JobStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    CLOSED = "closed"
    ARCHIVED = "archived"

# Association tables for many-to-many relationships
candidate_skills = Table(
    'candidate_skills',
    Base.metadata,
    Column('candidate_id', Integer, ForeignKey('candidates.id')),
    Column('skill_id', Integer, ForeignKey('skills.id'))
)

job_skills = Table(
    'job_skills',
    Base.metadata,
    Column('job_id', Integer, ForeignKey('jobs.id')),
    Column('skill_id', Integer, ForeignKey('skills.id'))
)

resume_tags = Table(
    'resume_tags',
    Base.metadata,
    Column('resume_id', Integer, ForeignKey('resumes.id')),
    Column('tag_id', Integer, ForeignKey('tags.id'))
)

# User Model
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.CANDIDATE)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Relationships
    candidate_profile = relationship("Candidate", back_populates="user", uselist=False, cascade="all, delete-orphan")
    recruiter_profile = relationship("Recruiter", back_populates="user", uselist=False, cascade="all, delete-orphan")

# Candidate Profile Model
class Candidate(Base):
    __tablename__ = "candidates"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    location = Column(String)
    headline = Column(String)
    summary = Column(Text)
    profile_photo = Column(String)  # URL to stored image
    linkedin_url = Column(String)
    github_url = Column(String)
    portfolio_url = Column(String)
    total_experience_years = Column(Float, default=0.0)
    preferred_role = Column(String)
    salary_expectation = Column(Integer)
    notice_period = Column(Integer)  # in days
    is_profile_public = Column(Boolean, default=True)
    profile_completion = Column(Integer, default=0)  # percentage
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="candidate_profile")
    skills = relationship("Skill", secondary=candidate_skills, back_populates="candidates")
    experiences = relationship("Experience", back_populates="candidate", cascade="all, delete-orphan")
    education = relationship("Education", back_populates="candidate", cascade="all, delete-orphan")
    certifications = relationship("Certification", back_populates="candidate", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="candidate", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="candidate", cascade="all, delete-orphan")
    matches = relationship("Match", back_populates="candidate", cascade="all, delete-orphan")

# Recruiter Profile Model
class Recruiter(Base):
    __tablename__ = "recruiters"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    company_name = Column(String)
    company_website = Column(String)
    company_size = Column(String)
    industry = Column(String)
    position = Column(String)
    profile_photo = Column(String)
    subscription_plan = Column(String, default="free")  # free, starter, professional, enterprise
    subscription_expiry = Column(DateTime(timezone=True))
    resumes_screened_count = Column(Integer, default=0)
    monthly_limit = Column(Integer, default=50)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="recruiter_profile")
    jobs = relationship("Job", back_populates="recruiter", cascade="all, delete-orphan")
    team_members = relationship("TeamMember", back_populates="recruiter", cascade="all, delete-orphan")
    screening_results = relationship("ScreeningResult", back_populates="recruiter", cascade="all, delete-orphan")

# Experience Model
class Experience(Base):
    __tablename__ = "experiences"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey('candidates.id'), nullable=False)
    job_title = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    location = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    is_current = Column(Boolean, default=False)
    description = Column(Text)
    achievements = Column(JSON)  # List of achievements
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    candidate = relationship("Candidate", back_populates="experiences")

# Education Model
class Education(Base):
    __tablename__ = "education"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey('candidates.id'), nullable=False)
    institution = Column(String, nullable=False)
    degree = Column(String, nullable=False)
    field_of_study = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    grade = Column(String)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    candidate = relationship("Candidate", back_populates="education")

# Certification Model
class Certification(Base):
    __tablename__ = "certifications"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey('candidates.id'), nullable=False)
    name = Column(String, nullable=False)
    issuing_organization = Column(String)
    issue_date = Column(DateTime)
    expiry_date = Column(DateTime)
    credential_id = Column(String)
    credential_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    candidate = relationship("Candidate", back_populates="certifications")

# Skill Model
class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    category = Column(String)  # Technical, Soft, Language, Tool, etc.
    description = Column(Text)
    
    # Relationships
    candidates = relationship("Candidate", secondary=candidate_skills, back_populates="skills")
    jobs = relationship("Job", secondary=job_skills, back_populates="required_skills")

# Resume Model
class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey('candidates.id'), nullable=False)
    title = Column(String, nullable=False)
    template = Column(String, default="modern")
    content = Column(JSON)  # Structured resume data
    raw_text = Column(Text)
    file_url = Column(String)
    score = Column(Float, default=0.0)
    ats_score = Column(Float, default=0.0)
    is_default = Column(Boolean, default=False)
    version = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    candidate = relationship("Candidate", back_populates="resumes")
    tags = relationship("Tag", secondary=resume_tags, back_populates="resumes")
    screening_results = relationship("ScreeningResult", back_populates="resume", cascade="all, delete-orphan")

# Job Model
class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey('recruiters.id'), nullable=False)
    title = Column(String, nullable=False)
    company = Column(String)
    location = Column(String)
    job_type = Column(String)  # Full-time, Part-time, Contract, etc.
    experience_level = Column(String)  # Entry, Mid, Senior, etc.
    salary_min = Column(Integer)
    salary_max = Column(Integer)
    description = Column(Text)
    responsibilities = Column(JSON)  # List of responsibilities
    qualifications = Column(JSON)  # List of qualifications
    benefits = Column(JSON)  # List of benefits
    status = Column(Enum(JobStatus), default=JobStatus.DRAFT)
    views_count = Column(Integer, default=0)
    applications_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True))
    
    # Relationships
    recruiter = relationship("Recruiter", back_populates="jobs")
    required_skills = relationship("Skill", secondary=job_skills, back_populates="jobs")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
    matches = relationship("Match", back_populates="job", cascade="all, delete-orphan")

# Application Model
class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey('candidates.id'), nullable=False)
    job_id = Column(Integer, ForeignKey('jobs.id'), nullable=False)
    resume_id = Column(Integer, ForeignKey('resumes.id'))
    cover_letter = Column(Text)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.SUBMITTED)
    match_score = Column(Float)
    notes = Column(JSON)  # For recruiter notes
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    candidate = relationship("Candidate", back_populates="applications")
    job = relationship("Job", back_populates="applications")

# Match Model (for candidate-job matching)
class Match(Base):
    __tablename__ = "matches"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey('candidates.id'), nullable=False)
    job_id = Column(Integer, ForeignKey('jobs.id'), nullable=False)
    overall_score = Column(Float, nullable=False)
    skills_match = Column(Float)
    experience_match = Column(Float)
    education_match = Column(Float)
    location_match = Column(Float)
    explanation = Column(JSON)  # Detailed breakdown
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    candidate = relationship("Candidate", back_populates="matches")
    job = relationship("Job", back_populates="matches")

# Screening Result Model
class ScreeningResult(Base):
    __tablename__ = "screening_results"
    
    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey('recruiters.id'), nullable=False)
    resume_id = Column(Integer, ForeignKey('resumes.id'), nullable=False)
    job_id = Column(Integer, ForeignKey('jobs.id'))
    overall_score = Column(Float)
    role_prediction = Column(String)
    skill_gaps = Column(JSON)
    red_flags = Column(JSON)
    strengths = Column(JSON)
    recommendations = Column(Text)
    raw_analysis = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    recruiter = relationship("Recruiter", back_populates="screening_results")
    resume = relationship("Resume", back_populates="screening_results")

# Team Member Model
class TeamMember(Base):
    __tablename__ = "team_members"
    
    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey('recruiters.id'), nullable=False)
    email = Column(String, nullable=False)
    name = Column(String)
    role = Column(String)  # Admin, Member, Viewer
    permissions = Column(JSON)
    invited_at = Column(DateTime(timezone=True), server_default=func.now())
    accepted_at = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    
    # Relationships
    recruiter = relationship("Recruiter", back_populates="team_members")

# Tag Model
class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    category = Column(String)
    
    # Relationships
    resumes = relationship("Resume", secondary=resume_tags, back_populates="tags")

# Analytics Model
class Analytics(Base):
    __tablename__ = "analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    event_type = Column(String, nullable=False)  # profile_view, resume_upload, job_view, etc.
    event_data = Column(JSON)
    ip_address = Column(String)
    user_agent = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
