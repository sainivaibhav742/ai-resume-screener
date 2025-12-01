from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import (
    User, Candidate as CandidateModel, Resume, Experience, 
    Education, Certification, Skill, Job, Application, Match
)
from schemas import (
    CandidateCreate, CandidateUpdate, CandidateResponse,
    ResumeCreate, ResumeUpdate, ResumeResponse,
    ExperienceCreate, ExperienceUpdate, ExperienceResponse,
    EducationCreate, EducationUpdate, EducationResponse,
    CertificationCreate, CertificationUpdate, CertificationResponse,
    SkillResponse, JobResponse, ApplicationCreate, ApplicationResponse,
    MatchResponse
)
from auth import get_current_candidate

router = APIRouter(prefix="/api/candidate", tags=["Candidate Portal"])

# Profile Management
@router.get("/profile", response_model=CandidateResponse)
async def get_candidate_profile(
    current_user: User = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Get candidate profile"""
    profile = db.query(CandidateModel).filter(CandidateModel.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/profile", response_model=CandidateResponse)
async def update_candidate_profile(
    profile_data: CandidateUpdate,
    current_user: User = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Update candidate profile"""
    profile = db.query(CandidateModel).filter(CandidateModel.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    for key, value in profile_data.dict(exclude_unset=True).items():
        setattr(profile, key, value)
    
    # Calculate profile completion
    completion = calculate_profile_completion(profile)
    profile.profile_completion = completion
    profile.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(profile)
    return profile

# Resume Management
@router.get("/resumes", response_model=List[ResumeResponse])
async def get_candidate_resumes(
    current_user: User = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Get all resumes for candidate"""
    profile = db.query(CandidateModel).filter(CandidateModel.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    resumes = db.query(Resume).filter(Resume.candidate_id == profile.id).all()
    return resumes

@router.post("/resumes", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def create_resume(
    resume_data: ResumeCreate,
    current_user: User = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Create a new resume"""
    profile = db.query(CandidateModel).filter(CandidateModel.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    new_resume = Resume(
        candidate_id=profile.id,
        title=resume_data.title,
        template=resume_data.template,
        content=resume_data.content
    )
    
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    return new_resume

@router.get("/resumes/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: int,
    current_user: User = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Get a specific resume"""
    profile = db.query(CandidateModel).filter(CandidateModel.user_id == current_user.id).first()
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.candidate_id == profile.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.put("/resumes/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: int,
    resume_data: ResumeUpdate,
    current_user: User = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Update a resume"""
    profile = db.query(CandidateModel).filter(CandidateModel.user_id == current_user.id).first()
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.candidate_id == profile.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    for key, value in resume_data.dict(exclude_unset=True).items():
        setattr(resume, key, value)
    
    resume.updated_at = datetime.utcnow()
    resume.version += 1
    
    db.commit()
    db.refresh(resume)
    return resume

@router.delete("/resumes/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Delete a resume"""
    profile = db.query(CandidateModel).filter(CandidateModel.user_id == current_user.id).first()
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.candidate_id == profile.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    db.delete(resume)
    db.commit()
    return None

# Experience Management
@router.get("/experiences", response_model=List[ExperienceResponse])
async def get_experiences(
    current_user: User = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Get all work experiences"""
    profile = db.query(CandidateModel).filter(CandidateModel.user_id == current_user.id).first()
    return profile.experiences if profile else []

@router.post("/experiences", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
async def create_experience(
    experience_data: ExperienceCreate,
    current_user: User = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Add work experience"""
    profile = db.query(CandidateModel).filter(CandidateModel.user_id == current_user.id).first()
    
    new_experience = Experience(
        candidate_id=profile.id,
        **experience_data.dict()
    )
    
    db.add(new_experience)
    db.commit()
    db.refresh(new_experience)
    return new_experience

# Education Management
@router.get("/education", response_model=List[EducationResponse])
async def get_education(
    current_user: User = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Get all education records"""
    profile = db.query(CandidateModel).filter(CandidateModel.user_id == current_user.id).first()
    return profile.education if profile else []

@router.post("/education", response_model=EducationResponse, status_code=status.HTTP_201_CREATED)
async def create_education(
    education_data: EducationCreate,
    current_user: User = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Add education record"""
    profile = db.query(CandidateModel).filter(CandidateModel.user_id == current_user.id).first()
    
    new_education = Education(
        candidate_id=profile.id,
        **education_data.dict()
    )
    
    db.add(new_education)
    db.commit()
    db.refresh(new_education)
    return new_education

# Job Matching
@router.get("/job-matches", response_model=List[MatchResponse])
async def get_job_matches(
    limit: int = 10,
    current_user: User = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Get matched jobs for candidate"""
    profile = db.query(CandidateModel).filter(CandidateModel.user_id == current_user.id).first()
    
    matches = db.query(Match).filter(
        Match.candidate_id == profile.id
    ).order_by(Match.overall_score.desc()).limit(limit).all()
    
    return matches

@router.get("/jobs", response_model=List[JobResponse])
async def browse_jobs(
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Browse available jobs"""
    query = db.query(Job).filter(Job.status == "published")
    
    if search:
        query = query.filter(
            (Job.title.contains(search)) | (Job.description.contains(search))
        )
    
    jobs = query.offset(skip).limit(limit).all()
    return jobs

# Applications
@router.get("/applications", response_model=List[ApplicationResponse])
async def get_applications(
    current_user: User = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Get all job applications"""
    profile = db.query(CandidateModel).filter(CandidateModel.user_id == current_user.id).first()
    
    applications = db.query(Application).filter(
        Application.candidate_id == profile.id
    ).order_by(Application.applied_at.desc()).all()
    
    return applications

@router.post("/applications", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def apply_to_job(
    application_data: ApplicationCreate,
    current_user: User = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Apply to a job"""
    profile = db.query(CandidateModel).filter(CandidateModel.user_id == current_user.id).first()
    
    # Check if already applied
    existing = db.query(Application).filter(
        Application.candidate_id == profile.id,
        Application.job_id == application_data.job_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")
    
    new_application = Application(
        candidate_id=profile.id,
        job_id=application_data.job_id,
        resume_id=application_data.resume_id,
        cover_letter=application_data.cover_letter
    )
    
    db.add(new_application)
    
    # Update job applications count
    job = db.query(Job).filter(Job.id == application_data.job_id).first()
    if job:
        job.applications_count += 1
    
    db.commit()
    db.refresh(new_application)
    return new_application

# Helper function
def calculate_profile_completion(profile: CandidateModel) -> int:
    """Calculate profile completion percentage"""
    fields = [
        profile.first_name, profile.last_name, profile.phone, 
        profile.location, profile.headline, profile.summary,
        profile.preferred_role
    ]
    completed = sum(1 for field in fields if field)
    
    # Add points for experiences, education, skills
    if len(profile.experiences) > 0:
        completed += 1
    if len(profile.education) > 0:
        completed += 1
    if len(profile.skills) > 0:
        completed += 1
    
    total_fields = 10
    return int((completed / total_fields) * 100)
