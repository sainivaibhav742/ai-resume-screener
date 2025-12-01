from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import (
    User, Recruiter as RecruiterModel, Job, Resume, 
    ScreeningResult, TeamMember, Application, Skill
)
from schemas import (
    RecruiterCreate, RecruiterUpdate, RecruiterResponse,
    JobCreate, JobUpdate, JobResponse,
    ScreeningResultResponse, ApplicationUpdate
)
from auth import get_current_recruiter

router = APIRouter(prefix="/api/recruiter", tags=["Recruiter Portal"])

# Profile Management
@router.get("/profile", response_model=RecruiterResponse)
async def get_recruiter_profile(
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Get recruiter profile"""
    profile = db.query(RecruiterModel).filter(RecruiterModel.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/profile", response_model=RecruiterResponse)
async def update_recruiter_profile(
    profile_data: RecruiterUpdate,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Update recruiter profile"""
    profile = db.query(RecruiterModel).filter(RecruiterModel.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    for key, value in profile_data.dict(exclude_unset=True).items():
        setattr(profile, key, value)
    
    profile.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(profile)
    return profile

# Dashboard Stats
@router.get("/dashboard/stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics"""
    profile = db.query(RecruiterModel).filter(RecruiterModel.user_id == current_user.id).first()
    
    active_jobs = db.query(Job).filter(
        Job.recruiter_id == profile.id,
        Job.status == "published"
    ).count()
    
    total_applications = db.query(Application).join(Job).filter(
        Job.recruiter_id == profile.id
    ).count()
    
    pending_reviews = db.query(Application).join(Job).filter(
        Job.recruiter_id == profile.id,
        Application.status == "submitted"
    ).count()
    
    return {
        "active_jobs": active_jobs,
        "total_applications": total_applications,
        "pending_reviews": pending_reviews,
        "resumes_screened": profile.resumes_screened_count,
        "monthly_limit": profile.monthly_limit,
        "remaining_credits": profile.monthly_limit - profile.resumes_screened_count,
        "subscription_plan": profile.subscription_plan
    }

# Job Management
@router.get("/jobs", response_model=List[JobResponse])
async def get_recruiter_jobs(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Get all jobs posted by recruiter"""
    profile = db.query(RecruiterModel).filter(RecruiterModel.user_id == current_user.id).first()
    
    query = db.query(Job).filter(Job.recruiter_id == profile.id)
    
    if status:
        query = query.filter(Job.status == status)
    
    jobs = query.order_by(Job.created_at.desc()).offset(skip).limit(limit).all()
    return jobs

@router.post("/jobs", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    job_data: JobCreate,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Create a new job posting"""
    profile = db.query(RecruiterModel).filter(RecruiterModel.user_id == current_user.id).first()
    
    new_job = Job(
        recruiter_id=profile.id,
        title=job_data.title,
        company=job_data.company or profile.company_name,
        location=job_data.location,
        job_type=job_data.job_type,
        experience_level=job_data.experience_level,
        salary_min=job_data.salary_min,
        salary_max=job_data.salary_max,
        description=job_data.description,
        responsibilities=job_data.responsibilities,
        qualifications=job_data.qualifications,
        benefits=job_data.benefits
    )
    
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    
    # Add required skills
    if job_data.required_skills:
        for skill_name in job_data.required_skills:
            skill = db.query(Skill).filter(Skill.name == skill_name).first()
            if not skill:
                skill = Skill(name=skill_name)
                db.add(skill)
            new_job.required_skills.append(skill)
        db.commit()
    
    return new_job

@router.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: int,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Get a specific job posting"""
    profile = db.query(RecruiterModel).filter(RecruiterModel.user_id == current_user.id).first()
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.recruiter_id == profile.id
    ).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/jobs/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: int,
    job_data: JobUpdate,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Update a job posting"""
    profile = db.query(RecruiterModel).filter(RecruiterModel.user_id == current_user.id).first()
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.recruiter_id == profile.id
    ).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    for key, value in job_data.dict(exclude_unset=True).items():
        if key != "required_skills":
            setattr(job, key, value)
    
    # Update published_at if status changed to published
    if job_data.status == "published" and job.status != "published":
        job.published_at = datetime.utcnow()
    
    job.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(job)
    return job

@router.delete("/jobs/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(
    job_id: int,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Delete a job posting"""
    profile = db.query(RecruiterModel).filter(RecruiterModel.user_id == current_user.id).first()
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.recruiter_id == profile.id
    ).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db.delete(job)
    db.commit()
    return None

# Application Management
@router.get("/jobs/{job_id}/applications")
async def get_job_applications(
    job_id: int,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Get all applications for a job"""
    profile = db.query(RecruiterModel).filter(RecruiterModel.user_id == current_user.id).first()
    
    # Verify job belongs to recruiter
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.recruiter_id == profile.id
    ).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    query = db.query(Application).filter(Application.job_id == job_id)
    
    if status:
        query = query.filter(Application.status == status)
    
    applications = query.order_by(
        Application.match_score.desc().nullslast()
    ).offset(skip).limit(limit).all()
    
    return applications

@router.put("/applications/{application_id}")
async def update_application_status(
    application_id: int,
    update_data: ApplicationUpdate,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Update application status"""
    profile = db.query(RecruiterModel).filter(RecruiterModel.user_id == current_user.id).first()
    
    application = db.query(Application).join(Job).filter(
        Application.id == application_id,
        Job.recruiter_id == profile.id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(application, key, value)
    
    application.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(application)
    return application

# Resume Screening
@router.post("/screen-resume")
async def screen_resume(
    file: UploadFile = File(...),
    job_id: Optional[int] = None,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Screen a resume (upload and analyze)"""
    profile = db.query(RecruiterModel).filter(RecruiterModel.user_id == current_user.id).first()
    
    # Check monthly limit
    if profile.resumes_screened_count >= profile.monthly_limit:
        raise HTTPException(
            status_code=403,
            detail="Monthly screening limit reached. Please upgrade your plan."
        )
    
    # TODO: Implement resume parsing and screening logic
    # This will use the existing resume parsing functions from main.py
    
    profile.resumes_screened_count += 1
    db.commit()
    
    return {"message": "Resume screening functionality to be implemented"}

@router.get("/screening-results", response_model=List[ScreeningResultResponse])
async def get_screening_results(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Get all screening results"""
    profile = db.query(RecruiterModel).filter(RecruiterModel.user_id == current_user.id).first()
    
    results = db.query(ScreeningResult).filter(
        ScreeningResult.recruiter_id == profile.id
    ).order_by(ScreeningResult.created_at.desc()).offset(skip).limit(limit).all()
    
    return results

# Candidate Ranking
@router.get("/jobs/{job_id}/candidates/ranked")
async def get_ranked_candidates(
    job_id: int,
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Get ranked candidates for a job"""
    profile = db.query(RecruiterModel).filter(RecruiterModel.user_id == current_user.id).first()
    
    # Verify job belongs to recruiter
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.recruiter_id == profile.id
    ).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Get applications with candidates, sorted by match score
    applications = db.query(Application).filter(
        Application.job_id == job_id
    ).order_by(Application.match_score.desc().nullslast()).all()
    
    return applications

# Team Management
@router.get("/team")
async def get_team_members(
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Get all team members"""
    profile = db.query(RecruiterModel).filter(RecruiterModel.user_id == current_user.id).first()
    
    team_members = db.query(TeamMember).filter(
        TeamMember.recruiter_id == profile.id
    ).all()
    
    return team_members

@router.post("/team")
async def invite_team_member(
    email: str,
    name: str,
    role: str = "member",
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Invite a team member"""
    profile = db.query(RecruiterModel).filter(RecruiterModel.user_id == current_user.id).first()
    
    # Check if already invited
    existing = db.query(TeamMember).filter(
        TeamMember.recruiter_id == profile.id,
        TeamMember.email == email
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Team member already invited")
    
    new_member = TeamMember(
        recruiter_id=profile.id,
        email=email,
        name=name,
        role=role
    )
    
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    
    # TODO: Send invitation email
    
    return new_member

# Analytics
@router.get("/analytics")
async def get_analytics(
    current_user: User = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Get recruiter analytics"""
    profile = db.query(RecruiterModel).filter(RecruiterModel.user_id == current_user.id).first()
    
    # Get various metrics
    total_jobs = db.query(Job).filter(Job.recruiter_id == profile.id).count()
    published_jobs = db.query(Job).filter(
        Job.recruiter_id == profile.id,
        Job.status == "published"
    ).count()
    
    total_applications = db.query(Application).join(Job).filter(
        Job.recruiter_id == profile.id
    ).count()
    
    shortlisted = db.query(Application).join(Job).filter(
        Job.recruiter_id == profile.id,
        Application.status == "shortlisted"
    ).count()
    
    return {
        "total_jobs": total_jobs,
        "published_jobs": published_jobs,
        "total_applications": total_applications,
        "shortlisted_candidates": shortlisted,
        "resumes_screened": profile.resumes_screened_count,
        "conversion_rate": (shortlisted / total_applications * 100) if total_applications > 0 else 0
    }
