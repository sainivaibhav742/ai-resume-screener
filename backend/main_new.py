from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import fitz  # PyMuPDF
from pdfminer.high_level import extract_text
import spacy
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
from typing import Dict, List, Optional
import os
import sys
import tempfile
import json
from pydantic import BaseModel
import hashlib
from datetime import datetime
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import database and models
from database import engine, get_db, Base
from models import User, Candidate, Recruiter, Resume, Job, Application, ScreeningResult

# Import routers
from routers import auth_routes, candidate_routes, recruiter_routes

# Load job predictor
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)
from ml.job_predictor import JobPredictor

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="AI Resume Screener - Smart Hiring OS",
    description="Dual-sided platform for candidates and recruiters with AI-powered matching",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_routes.router)
app.include_router(candidate_routes.router)
app.include_router(recruiter_routes.router)

# Load NLP models
nlp = spacy.load("en_core_web_sm")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Load job predictor model
job_predictor = JobPredictor()
model_path = os.path.join(os.path.dirname(__file__), '..', 'ml', 'job_predictor_model.pkl')
if os.path.exists(model_path):
    job_predictor.load_model(model_path)

# NVIDIA API configuration
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

# Pydantic models for legacy endpoints
class SummaryRequest(BaseModel):
    experience_data: Dict
    job_title: str

class SkillsRequest(BaseModel):
    job_title: str
    current_skills: List[str]

class OptimizeRequest(BaseModel):
    section_type: str
    content: str
    job_title: str

class ParseResumeRequest(BaseModel):
    raw_text: str

# Root endpoint
@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Welcome to AI Resume Screener - Smart Hiring OS",
        "version": "2.0.0",
        "documentation": "/docs",
        "portals": {
            "candidate": "/api/candidate",
            "recruiter": "/api/recruiter"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.get("/dashboard-stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    # Return mock data for now
    return {
        "totalResumes": 65,
        "averageScore": 76.5,
        "topSkills": [
            {"skill": "Python", "count": 45},
            {"skill": "JavaScript", "count": 38},
            {"skill": "React", "count": 32},
            {"skill": "SQL", "count": 28},
            {"skill": "AWS", "count": 25}
        ],
        "roleDistribution": [
            {"role": "Software Engineer", "count": 25},
            {"role": "Data Scientist", "count": 18},
            {"role": "Product Manager", "count": 12},
            {"role": "DevOps Engineer", "count": 10}
        ],
        "weeklyActivity": [
            {"week": "Week 1", "count": 12},
            {"week": "Week 2", "count": 18},
            {"week": "Week 3", "count": 15},
            {"week": "Week 4", "count": 20}
        ],
        "scoreDistribution": [
            {"range": "90-100", "count": 8},
            {"range": "80-89", "count": 15},
            {"range": "70-79", "count": 20},
            {"range": "60-69", "count": 12},
            {"range": "50-59", "count": 8},
            {"range": "0-49", "count": 2}
        ]
    }

@app.get("/screening-results")
async def get_screening_results():
    """Get recent screening results"""
    # Return mock data for now
    return {
        "screening_results": [
            {
                "id": "1",
                "candidate_name": "John Developer",
                "job_id": None,
                "fit_score": 92,
                "predicted_role": "Senior Software Engineer",
                "skills": ["Python", "React", "AWS", "Docker"],
                "experience_years": 5,
                "timestamp": datetime.utcnow().isoformat(),
                "recommendation": "Strong Match"
            },
            {
                "id": "2",
                "candidate_name": "Sarah Data",
                "job_id": None,
                "fit_score": 87,
                "predicted_role": "Data Scientist",
                "skills": ["Python", "Machine Learning", "SQL", "Pandas"],
                "experience_years": 4,
                "timestamp": datetime.utcnow().isoformat(),
                "recommendation": "Strong Match"
            },
            {
                "id": "3",
                "candidate_name": "Mike Frontend",
                "job_id": None,
                "fit_score": 78,
                "predicted_role": "Frontend Developer",
                "skills": ["JavaScript", "React", "CSS", "TypeScript"],
                "experience_years": 3,
                "timestamp": datetime.utcnow().isoformat(),
                "recommendation": "Good Match"
            }
        ]
    }


# Legacy utility functions (keep for backward compatibility)
def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF"""
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        try:
            return extract_text(file_path)
        except Exception as e2:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()

def anonymize_text(text: str) -> str:
    """Remove or anonymize personal information"""
    text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL]', text)
    text = re.sub(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', '[PHONE]', text)
    text = re.sub(r'\b\d{1,5}\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|place|pl|court|ct|circle|cir)\b', '[ADDRESS]', text, flags=re.IGNORECASE)
    return text

def extract_skills_nlp(text: str) -> List[str]:
    """Extract skills from text using NLP"""
    doc = nlp(text.lower())
    
    technical_skills = [
        'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'php', 'go', 'rust', 'swift', 'kotlin',
        'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'fastapi',
        'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform',
        'git', 'jenkins', 'ci/cd', 'agile', 'scrum',
        'machine learning', 'deep learning', 'nlp', 'computer vision', 'tensorflow', 'pytorch',
        'html', 'css', 'rest api', 'graphql', 'microservices'
    ]
    
    found_skills = set()
    for skill in technical_skills:
        if skill in text.lower():
            found_skills.add(skill)
    
    for ent in doc.ents:
        if ent.label_ in ['ORG', 'PRODUCT']:
            if len(ent.text) > 2:
                found_skills.add(ent.text.lower())
    
    return list(found_skills)

def extract_experience(text: str) -> Dict:
    """Extract years of experience"""
    experience_patterns = [
        r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)',
        r'experience\s*[:–-]?\s*(\d+)\+?\s*(?:years?|yrs?)',
    ]
    
    for pattern in experience_patterns:
        matches = re.finditer(pattern, text.lower())
        for match in matches:
            years = int(match.group(1))
            return {"years": years, "found": True}
    
    return {"years": 0, "found": False}

def extract_education(text: str) -> List[str]:
    """Extract education qualifications"""
    education_keywords = [
        'bachelor', 'master', 'phd', 'doctorate', 'mba', 'b.tech', 'm.tech', 
        'b.e.', 'm.e.', 'b.sc', 'm.sc', 'diploma', 'associate degree'
    ]
    
    found_education = []
    text_lower = text.lower()
    
    for keyword in education_keywords:
        if keyword in text_lower:
            found_education.append(keyword)
    
    return found_education

# Legacy endpoints (for backward compatibility with existing frontend)
@app.post("/upload-resume/")
async def upload_resume_legacy(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(None)
):
    """Legacy resume upload endpoint"""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        resume_text = extract_text_from_pdf(tmp_file_path)
        os.unlink(tmp_file_path)
        
        if not resume_text or len(resume_text.strip()) < 50:
            raise HTTPException(status_code=400, detail="Could not extract text from resume")
        
        # Extract information
        skills = extract_skills_nlp(resume_text)
        experience = extract_experience(resume_text)
        education = extract_education(resume_text)
        
        # Predict job role
        try:
            predicted_role = job_predictor.predict(resume_text)
        except:
            predicted_role = "Unable to predict"
        
        # Calculate match score if job description provided
        match_score = None
        if job_description:
            resume_embedding = embedding_model.encode([resume_text])
            job_embedding = embedding_model.encode([job_description])
            match_score = float(cosine_similarity(resume_embedding, job_embedding)[0][0] * 100)
        
        return {
            "message": "Resume processed successfully",
            "extracted_data": {
                "skills": skills,
                "experience_years": experience.get("years", 0),
                "education": education,
                "predicted_role": predicted_role,
                "match_score": round(match_score, 2) if match_score else None
            },
            "raw_text": resume_text[:500]  # First 500 chars
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")

@app.post("/parse-resume/")
async def parse_resume(request: ParseResumeRequest):
    """Parse resume text"""
    text = request.raw_text
    
    skills = extract_skills_nlp(text)
    experience = extract_experience(text)
    education = extract_education(text)
    
    try:
        predicted_role = job_predictor.predict(text)
    except:
        predicted_role = "Unable to predict"
    
    return {
        "skills": skills,
        "experience_years": experience.get("years", 0),
        "education": education,
        "predicted_role": predicted_role
    }

# AI-powered endpoints using NVIDIA API
@app.post("/ai/generate-summary/")
async def generate_summary(request: SummaryRequest):
    """Generate professional summary using AI"""
    if not NVIDIA_API_KEY:
        raise HTTPException(status_code=500, detail="NVIDIA API key not configured")
    
    prompt = f"""Generate a professional resume summary for a {request.job_title} position based on this experience:
    
{json.dumps(request.experience_data, indent=2)}

Create a compelling 3-4 sentence summary that highlights key achievements and skills."""
    
    try:
        response = requests.post(
            NVIDIA_API_URL,
            headers={
                "Authorization": f"Bearer {NVIDIA_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "meta/llama-3.1-8b-instruct",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7,
                "max_tokens": 200
            },
            timeout=30
        )
        response.raise_for_status()
        result = response.json()
        summary = result['choices'][0]['message']['content'].strip()
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

@app.post("/ai/suggest-skills/")
async def suggest_skills(request: SkillsRequest):
    """Suggest additional skills for a job title"""
    if not NVIDIA_API_KEY:
        raise HTTPException(status_code=500, detail="NVIDIA API key not configured")
    
    prompt = f"""For a {request.job_title} position, suggest 5-10 important skills that are missing from this list:
Current skills: {', '.join(request.current_skills)}

Provide only the missing skills as a comma-separated list, focusing on technical and professional skills."""
    
    try:
        response = requests.post(
            NVIDIA_API_URL,
            headers={
                "Authorization": f"Bearer {NVIDIA_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "meta/llama-3.1-8b-instruct",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7,
                "max_tokens": 150
            },
            timeout=30
        )
        response.raise_for_status()
        result = response.json()
        skills_text = result['choices'][0]['message']['content'].strip()
        suggested_skills = [s.strip() for s in skills_text.split(',')]
        return {"suggested_skills": suggested_skills}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

@app.post("/ai/optimize-content/")
async def optimize_content(request: OptimizeRequest):
    """Optimize resume content using AI"""
    if not NVIDIA_API_KEY:
        raise HTTPException(status_code=500, detail="NVIDIA API key not configured")
    
    prompt = f"""Optimize this {request.section_type} section for a {request.job_title} resume:

{request.content}

Make it more professional, impactful, and ATS-friendly. Keep it concise."""
    
    try:
        response = requests.post(
            NVIDIA_API_URL,
            headers={
                "Authorization": f"Bearer {NVIDIA_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "meta/llama-3.1-8b-instruct",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7,
                "max_tokens": 300
            },
            timeout=30
        )
        response.raise_for_status()
        result = response.json()
        optimized = result['choices'][0]['message']['content'].strip()
        return {"optimized_content": optimized}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
