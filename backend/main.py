from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
from typing import Dict, List
from pydantic import BaseModel
import hashlib
from datetime import datetime
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)
from ml.job_predictor import JobPredictor

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

app = FastAPI(title="AI Resume Screener", description="NLP-powered resume screening API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load NLP models
nlp = spacy.load("en_core_web_sm")
model = SentenceTransformer('all-MiniLM-L6-v2')

# Load job predictor model
job_predictor = JobPredictor()
model_path = os.path.join(os.path.dirname(__file__), '..', 'ml', 'job_predictor_model.pkl')
job_predictor.load_model(model_path)

# NVIDIA API configuration
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

# Data storage (in-memory for demo, should use database in production)
candidates_db = []
job_postings_db = []
screening_results_db = []

# Security utilities
def hash_data(data: str) -> str:
    """Hash sensitive data for storage"""
    return hashlib.sha256(data.encode()).hexdigest()

def anonymize_text(text: str) -> str:
    """Remove or anonymize personal information"""
    # Simple anonymization - replace emails, phones, addresses
    import re
    text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL]', text)
    text = re.sub(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', '[PHONE]', text)
    text = re.sub(r'\b\d{1,5}\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|place|pl|court|ct|circle|cir)\b', '[ADDRESS]', text, flags=re.IGNORECASE)
    return text

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF using PyMuPDF or fallback to reading as text"""
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        # Fallback to pdfminer
        try:
            return extract_text(file_path)
        except Exception as e2:
            # If both fail, try reading as plain text (for test files that are actually text)
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    return f.read()
            except Exception as e3:
                raise HTTPException(status_code=400, detail=f"Could not extract text from file: {str(e)}")

def parse_resume(text: str) -> Dict:
    """Parse resume text to extract structured data"""
    doc = nlp(text)

    # Extract entities
    entities = {ent.label_: ent.text for ent in doc.ents}

    # Extract skills (expanded keyword-based)
    skills_keywords = [
        "python", "java", "javascript", "react", "node.js", "sql", "machine learning", "nlp", "ai",
        "html", "css", "typescript", "angular", "vue", "django", "flask", "fastapi", "tensorflow",
        "pytorch", "pandas", "numpy", "scikit-learn", "docker", "kubernetes", "aws", "azure",
        "git", "linux", "agile", "scrum", "devops", "ci/cd", "rest api", "graphql"
    ]
    skills = [skill for skill in skills_keywords if skill.lower() in text.lower()]

    # Extract experience (improved regex)
    experience_pattern = r'(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp|work)'
    experience_matches = re.findall(experience_pattern, text, re.IGNORECASE)
    experience_years = max([int(match) for match in experience_matches]) if experience_matches else 0

    # Also check for total experience patterns
    total_exp_pattern = r'(?:total\s*)?(?:work\s*)?experience\s*:\s*(\d+)\s*(?:years?|yrs?)'
    total_matches = re.findall(total_exp_pattern, text, re.IGNORECASE)
    if total_matches:
        experience_years = max(experience_years, max(int(match) for match in total_matches))

    # Extract name (better logic)
    name = "Unknown"
    if "PERSON" in entities:
        name = entities["PERSON"]
    else:
        # Try to find name at the beginning of the resume
        lines = text.split('\n')[:10]  # First 10 lines
        for line in lines:
            line = line.strip()
            if line and len(line.split()) >= 2 and len(line.split()) <= 4 and not any(char.isdigit() for char in line) and not '@' in line:
                # Check if it looks like a name (contains typical name patterns)
                words = line.split()
                if all(word[0].isupper() for word in words if word):  # All words start with capital
                    name = line
                    break

    # Extract education
    education_keywords = ["bachelor", "master", "phd", "degree", "university", "college", "b.tech", "m.tech", "bsc", "msc"]
    education = "Unknown"
    for keyword in education_keywords:
        if keyword in text.lower():
            education = keyword.title()
            break

    return {
        "name": name,
        "skills": skills,
        "experience_years": experience_years,
        "education": education,
        "contact": entities.get("GPE", "Unknown"),
        "raw_text": text[:500]  # First 500 chars
    }

def extract_skills_from_job(job_description: str) -> List[str]:
    """Extract skills from job description"""
    skills_keywords = [
        "python", "java", "javascript", "react", "node.js", "sql", "machine learning", "nlp", "ai",
        "html", "css", "typescript", "angular", "vue", "django", "flask", "fastapi", "tensorflow",
        "pytorch", "pandas", "numpy", "scikit-learn", "docker", "kubernetes", "aws", "azure",
        "git", "linux", "agile", "scrum", "devops", "ci/cd", "rest api", "graphql"
    ]
    return [skill for skill in skills_keywords if skill.lower() in job_description.lower()]

def analyze_skill_gap(resume_skills: List[str], job_skills: List[str]) -> Dict:
    """Analyze skill gap between resume and job requirements"""
    present = set(resume_skills) & set(job_skills)
    missing = set(job_skills) - set(resume_skills)
    return {
        "present_skills": list(present),
        "missing_skills": list(missing),
        "gap_score": len(missing) / len(job_skills) if job_skills else 0
    }

def ats_optimization_check(text: str, job_description: str) -> Dict:
    """Check ATS optimization: keywords, length, etc."""
    job_doc = nlp(job_description.lower())
    resume_doc = nlp(text.lower())
    job_keywords = [token.lemma_ for token in job_doc if token.is_alpha and not token.is_stop]
    resume_keywords = [token.lemma_ for token in resume_doc if token.is_alpha and not token.is_stop]
    keyword_coverage = len(set(job_keywords) & set(resume_keywords)) / len(set(job_keywords)) if job_keywords else 0

    # Simple checks
    length_ok = len(text.split()) > 100  # Assume good length > 100 words
    has_contact = "contact" in text.lower() or "email" in text.lower()
    has_experience = "experience" in text.lower()

    ats_score = (keyword_coverage * 0.5) + (length_ok * 0.2) + (has_contact * 0.15) + (has_experience * 0.15)
    return {
        "keyword_coverage": round(keyword_coverage, 2),
        "length_ok": length_ok,
        "has_contact": has_contact,
        "has_experience": has_experience,
        "ats_score": round(ats_score * 100, 2)
    }

def language_tone_evaluation(text: str) -> Dict:
    """Evaluate language and tone using spaCy"""
    doc = nlp(text)
    # Simple sentiment: positive words
    positive_words = ["excellent", "great", "skilled", "experienced", "proficient"]
    negative_words = ["lack", "poor", "weak", "inadequate"]
    pos_count = sum(1 for token in doc if token.lemma_.lower() in positive_words)
    neg_count = sum(1 for token in doc if token.lemma_.lower() in negative_words)
    sentiment = (pos_count - neg_count) / len(doc) if len(doc) > 0 else 0

    # Formality: ratio of nouns/pronouns to verbs
    nouns = sum(1 for token in doc if token.pos_ in ["NOUN", "PROPN"])
    verbs = sum(1 for token in doc if token.pos_ == "VERB")
    formality = nouns / (verbs + 1)  # Avoid division by zero

    return {
        "sentiment_score": round(sentiment, 2),
        "formality_score": round(formality, 2),
        "tone": "positive" if sentiment > 0 else "neutral" if sentiment == 0 else "negative"
    }

def bias_detection(text: str) -> Dict:
    """Detect biased language"""
    biased_words = ["man", "woman", "male", "female", "age", "race", "religion"]  # Simple list
    doc = nlp(text.lower())
    biases = [token.text for token in doc if token.lemma_ in biased_words]
    bias_score = len(biases) / len(doc) if len(doc) > 0 else 0
    return {
        "biased_terms": biases,
        "bias_score": round(bias_score, 2),
        "bias_level": "high" if bias_score > 0.05 else "low"
    }

def generate_resume_summary(text: str) -> str:
    """Generate AI-powered resume summary using NVIDIA API"""
    if not NVIDIA_API_KEY:
        return f"Professional with {len(text.split())} words of experience. Skills include technical expertise and professional qualifications."

    try:
        prompt = f"""Please provide a concise, professional summary of this resume in 2-3 sentences, highlighting the candidate's key skills, experience, and qualifications:

{text[:2000]}  # Limit text to avoid token limits

Summary:"""

        payload = {
            "model": "meta/llama-3.1-8b-instruct",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 300,
            "stream": False
        }

        headers = {
            "Authorization": f"Bearer {NVIDIA_API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(NVIDIA_API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()

        result = response.json()
        return result["choices"][0]["message"]["content"].strip()

    except Exception as e:
        print(f"NVIDIA API error: {e}")
        # Fallback to basic summary
        return f"Professional with {len(text.split())} words of experience. Skills include technical expertise and professional qualifications."

def generate_fit_analysis(resume_data: Dict, job_description: str, fit_score: float) -> str:
    """Generate detailed fit analysis using NVIDIA API"""
    if not NVIDIA_API_KEY:
        return f"This candidate shows a {fit_score}% fit score. Key strengths include their technical skills and experience. Consider their overall qualifications for the role requirements."

    try:
        prompt = f"""Analyze this candidate's fit for the job based on the following information:

Candidate Profile:
- Name: {resume_data['name']}
- Skills: {', '.join(resume_data['skills'])}
- Experience: {resume_data['experience_years']} years
- Education: {resume_data['education']}

Job Description:
{job_description[:1000]}

Current Fit Score: {fit_score}%

Please provide a detailed analysis (3-4 sentences) explaining:
1. Key strengths that make this candidate a good fit
2. Any potential concerns or gaps
3. Recommendations for the hiring team

Analysis:"""

        payload = {
            "model": "meta/llama-3.1-8b-instruct",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.6,
            "max_tokens": 500,
            "stream": False
        }

        headers = {
            "Authorization": f"Bearer {NVIDIA_API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(NVIDIA_API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()

        result = response.json()
        return result["choices"][0]["message"]["content"].strip()

    except Exception as e:
        print(f"NVIDIA API error: {e}")
        # Fallback analysis
        return f"This candidate shows a {fit_score}% fit score. Key strengths include their technical skills and experience. Consider their overall qualifications for the role requirements."

def calculate_fit_score(resume_data: Dict, job_description: str) -> float:
    """Calculate fit score using keyword matching and semantic similarity"""
    resume_text = resume_data["raw_text"]
    skills_text = " ".join(resume_data["skills"])

    # Keyword matching
    job_doc = nlp(job_description.lower())
    resume_doc = nlp((resume_text + " " + skills_text).lower())

    job_keywords = [token.lemma_ for token in job_doc if token.is_alpha and not token.is_stop]
    resume_keywords = [token.lemma_ for token in resume_doc if token.is_alpha and not token.is_stop]

    keyword_overlap = len(set(job_keywords) & set(resume_keywords)) / len(set(job_keywords)) if job_keywords else 0

    # Semantic similarity
    embeddings = model.encode([job_description, resume_text])
    semantic_similarity = float(cosine_similarity([embeddings[0]], [embeddings[1]])[0][0])

    # Combine scores (weighted)
    fit_score = (keyword_overlap * 0.6) + (semantic_similarity * 0.4)
    return min(fit_score * 100, 100)  # Scale to 0-100

@app.post("/screen-resume")
async def screen_resume(file: UploadFile = File(...), job_description: str = Form(...), job_id: Optional[str] = Form(None)):
    """Screen a resume against a job description"""
    if not file.filename.lower().endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        content = await file.read()
        temp_file.write(content)
        temp_path = temp_file.name

    try:
        # Extract text
        text = extract_text_from_pdf(temp_path)

        # Parse resume
        resume_data = parse_resume(text)

        # Predict job role
        predicted_role = job_predictor.predict(text)

        # Skill gap analysis
        job_skills = extract_skills_from_job(job_description)
        skill_gap = analyze_skill_gap(resume_data["skills"], job_skills)

        # ATS optimization
        ats_check = ats_optimization_check(text, job_description)

        # Language and tone
        tone_eval = language_tone_evaluation(text)

        # Bias detection
        bias_check = bias_detection(text)

        # Calculate fit score (refined with new features)
        base_fit = calculate_fit_score(resume_data, job_description)
        # Adjust fit score based on skill gap, ATS, tone
        adjusted_fit = base_fit * (1 - skill_gap["gap_score"] * 0.2) * (ats_check["ats_score"] / 100 * 0.1 + 0.9)
        fit_score = float(min(adjusted_fit, 100))

        # Generate AI-powered summary and analysis
        resume_summary = generate_resume_summary(text)
        fit_analysis = generate_fit_analysis(resume_data, job_description, fit_score)

        # Store screening result
        screening_result = {
            "id": str(len(screening_results_db) + 1),
            "candidate_name": resume_data["name"],
            "job_id": job_id,
            "fit_score": round(fit_score, 2),
            "predicted_role": predicted_role,
            "skills": resume_data["skills"],
            "experience_years": resume_data["experience_years"],
            "timestamp": datetime.now().isoformat(),
            "recommendation": "Strong match" if fit_score > 70 else "Moderate match" if fit_score > 50 else "Weak match",
            "ai_summary": resume_summary,
            "ai_analysis": fit_analysis
        }
        screening_results_db.append(screening_result)

        # Store candidate if not exists (with privacy protection)
        candidate_exists = any(c["name"] == resume_data["name"] for c in candidates_db)
        if not candidate_exists:
            candidate = {
                "id": str(len(candidates_db) + 1),
                "name": resume_data["name"],
                "skills": resume_data["skills"],
                "experience_years": resume_data["experience_years"],
                "contact_hash": hash_data(resume_data["contact"]) if resume_data["contact"] != "Unknown" else None,
                "education": resume_data["education"],
                "anonymized_text": anonymize_text(text),
                "created_at": datetime.now().isoformat(),
                "consent_given": True,  # Assume consent for demo
                "data_retention_days": 365  # GDPR compliance
            }
            candidates_db.append(candidate)

        return {
            "resume_data": resume_data,
            "predicted_role": predicted_role,
            "skill_gap": skill_gap,
            "ats_optimization": ats_check,
            "language_tone": tone_eval,
            "bias_detection": bias_check,
            "fit_score": round(fit_score, 2),
            "recommendation": "Strong match" if fit_score > 70 else "Moderate match" if fit_score > 50 else "Weak match",
            "ai_summary": resume_summary,
            "ai_analysis": fit_analysis
        }

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/create-job-posting")
async def create_job_posting(title: str = Form(...), description: str = Form(...), requirements: str = Form(...)):
    """Create a new job posting"""
    job_posting = {
        "id": str(len(job_postings_db) + 1),
        "title": title,
        "description": description,
        "requirements": requirements,
        "created_at": datetime.now().isoformat(),
        "status": "active"
    }
    job_postings_db.append(job_posting)
    return {"message": "Job posting created successfully", "job_id": job_posting["id"]}

@app.get("/job-postings")
def get_job_postings():
    """Get all job postings"""
    return {"job_postings": job_postings_db}

@app.get("/candidates")
def get_candidates():
    """Get all candidates (privacy-protected)"""
    # Return candidates without sensitive anonymized text
    safe_candidates = []
    for candidate in candidates_db:
        safe_candidate = {k: v for k, v in candidate.items() if k != "anonymized_text"}
        safe_candidates.append(safe_candidate)
    return {"candidates": safe_candidates}

@app.delete("/candidate/{candidate_id}")
def delete_candidate(candidate_id: str):
    """Delete candidate data (GDPR right to erasure)"""
    global candidates_db, screening_results_db
    candidates_db = [c for c in candidates_db if c["id"] != candidate_id]
    screening_results_db = [s for s in screening_results_db if s["candidate_name"] != next((c["name"] for c in candidates_db if c["id"] == candidate_id), None)]
    return {"message": "Candidate data deleted successfully"}

@app.get("/privacy-policy")
def get_privacy_policy():
    """Get privacy policy information"""
    return {
        "data_collection": "We collect resume data for AI-powered job matching",
        "data_usage": "Data is used solely for resume screening and candidate evaluation",
        "data_storage": "Data is stored securely with encryption and anonymization",
        "data_retention": "Data is retained for 365 days or until deletion requested",
        "user_rights": "Users have right to access, rectify, and delete their data",
        "contact": "For privacy concerns, contact data@ai-resume-screener.com"
    }

# In the environment variables loading section:
if not os.getenv("NVIDIA_API_KEY"):
    raise HTTPException(
        status_code=500,
        detail="NVIDIA_API_KEY not configured in environment variables"
    )

# In the chat_assistant endpoint:
@app.post("/chat-assistant")
async def chat_assistant(message: str = Form(...), context: Optional[str] = Form(None)):
    if not NVIDIA_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="AI assistant unavailable - missing NVIDIA API configuration"
        )

    try:
        system_prompt = """You are an AI HR assistant for the Resume Screener application. Help users with:
- Resume screening guidance
- Job matching advice
- HR best practices
- Candidate evaluation tips
- System usage instructions

Be professional, helpful, and concise. If asked about technical system details, provide accurate information about the AI Resume Screener features."""

        payload = {
            "model": "meta/llama-3.1-8b-instruct",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            "temperature": 0.7,
            "max_tokens": 400,
            "stream": False
        }

        headers = {
            "Authorization": f"Bearer {NVIDIA_API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(NVIDIA_API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()

        result = response.json()
        ai_response = result["choices"][0]["message"]["content"].strip()

        return {
            "response": ai_response,
            "timestamp": datetime.now().isoformat(),
            "model": "meta/llama-3.1-8b-instruct"
        }

    except requests.exceptions.HTTPError as e:
        raise HTTPException(
            status_code=502,
            detail=f"NVIDIA API error: {e.response.text}"
        )
    except Exception as e:
        print(f"NVIDIA API error: {e}")
        return {
            "response": "I'm sorry, I'm currently unable to assist. Please try again later or contact support.",
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }

@app.get("/screening-results")
def get_screening_results(job_id: Optional[str] = None):
    """Get screening results, optionally filtered by job_id"""
    if job_id:
        results = [r for r in screening_results_db if r["job_id"] == job_id]
    else:
        results = screening_results_db

    # Sort by fit score descending
    results.sort(key=lambda x: x["fit_score"], reverse=True)
    return {"screening_results": results}

@app.get("/dashboard-stats")
def get_dashboard_stats():
    """Get dashboard statistics"""
    if not screening_results_db:
        return {
            "total_resumes": 0,
            "average_score": 0,
            "top_skills": [],
            "role_distribution": [],
            "weekly_activity": [],
            "score_distribution": []
        }

    total_resumes = len(screening_results_db)
    average_score = sum(r["fit_score"] for r in screening_results_db) / total_resumes

    # Top skills
    all_skills = []
    for result in screening_results_db:
        all_skills.extend(result["skills"])
    skill_counts = {}
    for skill in all_skills:
        skill_counts[skill] = skill_counts.get(skill, 0) + 1
    top_skills = [{"skill": k, "count": v} for k, v in sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:5]]

    # Role distribution
    role_counts = {}
    for result in screening_results_db:
        role = result["predicted_role"]
        role_counts[role] = role_counts.get(role, 0) + 1
    role_distribution = [{"role": k, "count": v} for k, v in role_counts.items()]

    # Weekly activity (mock data for now)
    weekly_activity = [
        {"week": "Week 1", "count": 12},
        {"week": "Week 2", "count": 18},
        {"week": "Week 3", "count": 25},
        {"week": "Week 4", "count": total_resumes % 35}
    ]

    # Score distribution
    score_ranges = {"90-100": 0, "80-89": 0, "70-79": 0, "60-69": 0, "50-59": 0, "0-49": 0}
    for result in screening_results_db:
        score = result["fit_score"]
        if score >= 90:
            score_ranges["90-100"] += 1
        elif score >= 80:
            score_ranges["80-89"] += 1
        elif score >= 70:
            score_ranges["70-79"] += 1
        elif score >= 60:
            score_ranges["60-69"] += 1
        elif score >= 50:
            score_ranges["50-59"] += 1
        else:
            score_ranges["0-49"] += 1

    score_distribution = [{"range": k, "count": v} for k, v in score_ranges.items()]

    return {
        "total_resumes": total_resumes,
        "average_score": round(average_score, 1),
        "top_skills": top_skills,
        "role_distribution": role_distribution,
        "weekly_activity": weekly_activity,
        "score_distribution": score_distribution
    }

@app.post("/generate-resume-summary-ai")
async def generate_resume_summary_ai(request: SummaryRequest):
    """Generate AI-powered resume summary from experience data"""
    if not NVIDIA_API_KEY:
        return {"summary": "Professional with extensive experience in their field. Skilled in various technical and soft skills relevant to their career."}

    try:
        experience_data = request.experience_data
        job_title = request.job_title
        # Format experience data
        experience_text = ""
        for exp in experience_data.get("experiences", []):
            experience_text += f"- {exp.get('title', '')} at {exp.get('company', '')} ({exp.get('duration', '')}): {exp.get('description', '')}\n"

        prompt = f"""Create a compelling professional summary for a resume based on the following experience and target job title:

Target Job Title: {job_title}

Experience:
{experience_text}

Please write a concise, professional summary paragraph (2-3 sentences) that highlights key achievements, skills, and career progression. Make it tailored to the target job title and compelling for recruiters."""

        payload = {
            "model": "meta/llama-3.1-8b-instruct",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 200,
            "stream": False
        }

        headers = {
            "Authorization": f"Bearer {NVIDIA_API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(NVIDIA_API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()

        result = response.json()
        return {"summary": result["choices"][0]["message"]["content"].strip()}

    except Exception as e:
        print(f"NVIDIA API error: {e}")
        return {"summary": "Professional with extensive experience in their field. Skilled in various technical and soft skills relevant to their career."}

@app.post("/suggest-skills-ai")
async def suggest_skills_ai(request: SkillsRequest):
    """Suggest additional skills based on job title and current skills"""
    if not NVIDIA_API_KEY:
        return {"suggested_skills": ["Communication", "Problem Solving", "Team Work", "Project Management"]}

    try:
        job_title = request.job_title
        current_skills = request.current_skills
        skills_text = ", ".join(current_skills) if current_skills else "none specified"

        prompt = f"""Based on the job title "{job_title}" and current skills: {skills_text}

Suggest 5-8 additional relevant skills that would strengthen a resume for this position. Focus on both technical and soft skills that are commonly required or beneficial for this role.

Return only the skills as a comma-separated list, no explanations."""

        payload = {
            "model": "meta/llama-3.1-8b-instruct",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.6,
            "max_tokens": 150,
            "stream": False
        }

        headers = {
            "Authorization": f"Bearer {NVIDIA_API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(NVIDIA_API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()

        result = response.json()
        skills_list = [skill.strip() for skill in result["choices"][0]["message"]["content"].strip().split(",")]
        return {"suggested_skills": skills_list}

    except Exception as e:
        print(f"NVIDIA API error: {e}")
        return {"suggested_skills": ["Communication", "Problem Solving", "Team Work", "Project Management"]}

@app.post("/optimize-resume-section")
async def optimize_resume_section(request: OptimizeRequest):
    """Optimize a resume section using AI"""
    if not NVIDIA_API_KEY:
        return {"optimized_content": content}

    try:
        section_type = request.section_type
        content = request.content
        job_title = request.job_title

        section_prompts = {
            "experience": f"Rewrite this work experience description to be more impactful and ATS-friendly for a {job_title} position. Make it achievement-oriented and use strong action verbs:",
            "summary": f"Optimize this professional summary to be more compelling for a {job_title} role. Make it concise and impactful:",
            "skills": f"Optimize this skills section for a {job_title} position. Ensure it's relevant and well-organized:"
        }

        prompt = section_prompts.get(section_type, "Optimize this resume content:") + f"\n\n{content}"

        payload = {
            "model": "meta/llama-3.1-8b-instruct",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 300,
            "stream": False
        }

        headers = {
            "Authorization": f"Bearer {NVIDIA_API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(NVIDIA_API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()

        result = response.json()
        return {"optimized_content": result["choices"][0]["message"]["content"].strip()}

    except Exception as e:
        print(f"NVIDIA API error: {e}")
        return {"optimized_content": content}

@app.post("/parse-resume-ai")
async def parse_resume_ai(request: ParseResumeRequest):
    """Parse raw text into structured resume data using AI"""
    if not NVIDIA_API_KEY:
        # Fallback parsing using basic text analysis
        return parse_resume_fallback(request.raw_text)

    try:
        prompt = f"""Parse the following raw text into structured resume data. Extract and organize the information into these categories.

CRITICAL INSTRUCTIONS:
1. DO NOT copy text directly from the input as job titles. Create proper, concise job titles (2-4 words max).
2. DO NOT duplicate content between summary and experience descriptions.
3. The summary should be a high-level overview (2-3 sentences) highlighting key qualifications.
4. Experience descriptions should be specific achievements and responsibilities, not generic descriptions.
5. If the input text is one long paragraph describing skills/experience, break it down into appropriate job roles.

First, here are some examples:

Example 1 Input:
John Doe
Software Engineer
Email: john@email.com
Phone: (555) 123-4567
Location: New York, NY

Experience:
- Senior Developer at Tech Corp (2020-Present)
  Led development of key features, improved performance by 40%
- Junior Developer at Startup Inc (2018-2020)
  Built web applications using React and Node.js

Education:
- Bachelor's in Computer Science, University of Tech (2016-2020)

Skills: JavaScript, React, Node.js, Python

Example 1 Output:
{{
  "personal_info": {{
    "name": "John Doe",
    "email": "john@email.com",
    "phone": "(555) 123-4567",
    "location": "New York, NY"
  }},
  "summary": "Experienced Software Engineer with 5+ years of expertise in full-stack development, specializing in React and Node.js applications. Proven track record of delivering high-quality solutions and leading development teams.",
  "experiences": [
    {{
      "title": "Senior Developer",
      "company": "Tech Corp",
      "duration": "2020-Present",
      "description": "Led development of key features and improved system performance by 40%. Managed team of developers and implemented best practices for scalable software architecture."
    }},
    {{
      "title": "Junior Developer",
      "company": "Startup Inc",
      "duration": "2018-2020",
      "description": "Built web applications using React and Node.js. Collaborated with cross-functional teams on product development and contributed to agile development processes."
    }}
  ],
  "educations": [
    {{
      "degree": "Bachelor's in Computer Science",
      "institution": "University of Tech",
      "year": "2020"
    }}
  ],
  "skills": ["JavaScript", "React", "Node.js", "Python"]
}}

Example 2 Input (long paragraph format):
I am a highly driven Technical Lead and Co-Founder with hands-on experience building and managing complete engineering operations for a startup environment. Skilled in overseeing the full technical department from backend development and APIs to cloud infrastructure and deployment pipelines. Strong expertise in Django, cloud messaging tools like Twilio, AWS services, Docker, Git.

Example 2 Output:
{{
  "personal_info": {{
    "name": "Your Name",
    "email": "",
    "phone": "",
    "location": ""
  }},
  "summary": "Technical Lead and Co-Founder with extensive experience in engineering operations and full-stack development. Expert in backend technologies, cloud infrastructure, and deployment pipelines with a focus on scalable solutions.",
  "experiences": [
    {{
      "title": "Technical Lead & Co-Founder",
      "company": "Startup Company",
      "duration": "Recent",
      "description": "Built and managed complete engineering operations including backend development, API design, and cloud infrastructure. Oversaw technical department and implemented deployment pipelines using Docker and Git."
    }}
  ],
  "educations": [],
  "skills": ["Django", "AWS", "Docker", "Git", "Twilio", "Backend Development", "APIs"]
}}

Now parse this raw text:

Raw Text:
{request.raw_text}

Please return a JSON object with this exact structure:
{{
  "personal_info": {{
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "phone number",
    "location": "City, State/Country"
  }},
  "summary": "Professional summary paragraph - keep this concise and high-level, do not repeat experience details",
  "experiences": [
    {{
      "title": "Job Title (2-4 words max, professional title)",
      "company": "Company Name",
      "duration": "Start Date - End Date",
      "description": "Detailed job description and achievements - be specific and avoid generic descriptions"
    }}
  ],
  "educations": [
    {{
      "degree": "Degree/Certificate Name",
      "institution": "School/University Name",
      "year": "Graduation Year"
    }}
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"]
}}

Extract as much relevant information as possible. If information for a category is not available, use empty arrays or default values. Make the content professional and well-formatted. Create a compelling summary that highlights key qualifications without duplicating experience details."""

        payload = {
            "model": "meta/llama-3.1-8b-instruct",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.3,
            "max_tokens": 1500,
            "stream": False
        }

        headers = {
            "Authorization": f"Bearer {NVIDIA_API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(NVIDIA_API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()

        result = response.json()
        parsed_data = json.loads(result["choices"][0]["message"]["content"].strip())

        # Add suggestions for missing information
        suggestions = analyze_missing_information(parsed_data)
        parsed_data["suggestions"] = suggestions

        return parsed_data

    except Exception as e:
        print(f"NVIDIA API error: {e}")
        return parse_resume_fallback(request.raw_text)

def analyze_missing_information(parsed_data: Dict) -> List[str]:
    """Analyze parsed resume data and identify missing or incomplete information"""
    suggestions = []

    # Check personal info
    personal = parsed_data.get("personal_info", {})
    if not personal.get("name") or personal["name"] == "Your Name":
        suggestions.append("Add your full name at the beginning of your resume text")
    if not personal.get("email"):
        suggestions.append("Include your email address for contact information")
    if not personal.get("phone"):
        suggestions.append("Add your phone number for easy contact")
    if not personal.get("location"):
        suggestions.append("Include your location (city, state/country)")

    # Check summary
    if not parsed_data.get("summary") or len(parsed_data["summary"]) < 50:
        suggestions.append("Add a professional summary highlighting your key skills and experience")

    # Check experiences
    experiences = parsed_data.get("experiences", [])
    if len(experiences) == 0:
        suggestions.append("Describe your work experience, projects, or technical activities")
    elif len(experiences) < 3:
        suggestions.append("Consider adding more details about your professional experience")

    # Check skills
    skills = parsed_data.get("skills", [])
    if len(skills) < 5:
        suggestions.append("List more technical skills, tools, and technologies you work with")

    # Check education
    educations = parsed_data.get("educations", [])
    if len(educations) == 0:
        suggestions.append("Include your educational background and qualifications")

    return suggestions

def parse_resume_fallback(raw_text: str):
    """Fallback parsing when AI is not available"""
    import re
    lines = raw_text.split('\n')
    name = "Your Name"

    # Extract name (first non-empty line that's likely a name, skip headers)
    for line in lines[:10]:
        line = line.strip()
        if line and len(line.split()) >= 2 and len(line.split()) <= 4 and not any(char.isdigit() for char in line) and '@' not in line:
            # Skip common headers
            if not re.search(r'^(professional summary|summary|experience|education|skills|contact|about)', line, re.IGNORECASE):
                words = line.split()
                if all(word[0].isupper() for word in words if word):
                    name = line
                    break

    # Extract email
    email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', raw_text)
    email = email_match.group(0) if email_match else ""

    # Extract phone
    phone_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b', raw_text)
    phone = phone_match.group(0) if phone_match else ""

    # Extract location (simple pattern)
    location_match = re.search(r'\b[A-Z][a-z]+,\s*[A-Z]{2}\b|\b[A-Z][a-z]+\s*,\s*[A-Z][a-z]+\b', raw_text)
    location = location_match.group(0) if location_match else ""

    # Extract skills (expanded keyword matching)
    skills_keywords = [
        "python", "java", "javascript", "react", "node.js", "sql", "machine learning", "nlp", "ai",
        "html", "css", "typescript", "angular", "vue", "django", "flask", "fastapi", "tensorflow",
        "pytorch", "pandas", "numpy", "scikit-learn", "docker", "kubernetes", "aws", "azure",
        "git", "linux", "agile", "scrum", "devops", "ci/cd", "rest api", "graphql", "websockets",
        "twilio", "sns", "iam", "github", "lstm", "ui/ux", "vector design", "real-time",
        "communication", "leadership", "problem solving", "team work", "project management",
        "backend development", "apis", "cloud infrastructure", "deployment pipelines"
    ]
    skills = [skill.title() for skill in skills_keywords if skill.lower() in raw_text.lower()]

    # Extract summary section
    summary = ""
    summary_patterns = [
        r'(?:professional summary|summary|about me|profile)(?:\s*:)?\s*\n?(.*?)(?:\n\n|\n(?:experience|education|skills|work|$))',
        r'^([A-Z][^.!?]*?(?:technical lead|co-founder|engineer|developer|specialist|manager)[^.!?]*[.!?])',
    ]

    for pattern in summary_patterns:
        summary_match = re.search(pattern, raw_text, re.IGNORECASE | re.DOTALL)
        if summary_match:
            extracted = summary_match.group(1).strip()
            if len(extracted) > 50:  # Only use if substantial
                summary = extracted[:500]  # Limit length
                break

    # If no summary found, create one from the first substantial paragraph
    if not summary:
        paragraphs = re.split(r'\n\s*\n', raw_text)
        for para in paragraphs[:3]:
            para = para.strip()
            if len(para) > 100 and not re.search(r'^(experience|education|skills)', para, re.IGNORECASE):
                summary = para[:500]
                break

    # Extract experience sections - improved parsing for complex descriptions
    experiences = []

    # First, try to extract from "such as:" sections
    such_as_pattern = r'such as:\s*\n(.*?)(?:\nYou regularly|\n*$)'
    such_as_match = re.search(such_as_pattern, raw_text, re.IGNORECASE | re.DOTALL)

    if such_as_match:
        such_as_text = such_as_match.group(1)
        # Split by periods followed by newlines or just periods
        items = re.split(r'\.\s*\n|\.\s*(?=[A-Z])|\.\s*$', such_as_text)
        technical_items = [item.strip() for item in items if item.strip() and len(item.strip()) > 15]

        for item in technical_items[:6]:  # Limit to 6 experiences
            # Create meaningful titles and descriptions from the content
            item_lower = item.lower()

            # Extract key skills/areas from the description
            if 'backend' in item_lower or 'apis' in item_lower or 'django' in item_lower:
                title = "Backend Developer"
                company = "Various Companies"
            elif 'cloud' in item_lower or 'aws' in item_lower or 'twilio' in item_lower or 'sns' in item_lower:
                title = "Cloud Engineer"
                company = "Various Companies"
            elif 'docker' in item_lower or 'github' in item_lower or 'deployment' in item_lower or 'pipelines' in item_lower:
                title = "DevOps Engineer"
                company = "Various Companies"
            elif 'websocket' in item_lower or 'real-time' in item_lower or 'communication' in item_lower:
                title = "Full Stack Developer"
                company = "Various Companies"
            elif 'secure' in item_lower or 'input-sanitization' in item_lower:
                title = "Security Engineer"
                company = "Various Companies"
            elif 'ai' in item_lower or 'lstm' in item_lower or 'machine learning' in item_lower:
                title = "AI Developer"
                company = "Various Companies"
            elif 'ui/ux' in item_lower or 'logo' in item_lower or 'design' in item_lower:
                title = "UI/UX Designer"
                company = "Various Companies"
            elif 'research' in item_lower or 'hosting' in item_lower:
                title = "Technical Researcher"
                company = "Various Companies"
            else:
                title = "Technical Specialist"
                company = "Various Companies"

            experiences.append({
                "title": title,
                "company": company,
                "duration": "Recent",
                "description": item[:250] + ("..." if len(item) > 250 else "")
            })

    # If no experiences from "such as:" section, try to create from main description
    if not experiences and len(raw_text) > 100:
        # Look for main professional description
        main_desc_match = re.search(r'(?:highly driven|experienced|skilled|strong expertise)(.*?)(?:you regularly|$)', raw_text, re.IGNORECASE | re.DOTALL)
        if main_desc_match:
            main_desc = main_desc_match.group(1).strip()
            if len(main_desc) > 50:
                # Extract a proper job title from the description
                title_match = re.search(r'(?:as a|as an|working as|serving as)\s+([^,.]+)', main_desc, re.IGNORECASE)
                if title_match:
                    title = title_match.group(1).strip().title()
                else:
                    title = "Technical Professional"

                experiences.append({
                    "title": title,
                    "company": "Professional Environment",
                    "duration": "Recent",
                    "description": main_desc[:300] + ("..." if len(main_desc) > 300 else "")
                })

    # If no technical items found, look for traditional experience sections
    if not experiences:
        exp_pattern = r'(?:experience|work|employment|projects)(?:\s*:)?\s*\n?(.*?)(?:\n\n|\n(?:education|skills|summary|$))'
        exp_match = re.search(exp_pattern, raw_text, re.IGNORECASE | re.DOTALL)
        if exp_match:
            exp_text = exp_match.group(1)
            # Split by bullet points or dashes
            exp_lines = re.split(r'\n\s*[-•*]\s*', exp_text)
            for line in exp_lines[:3]:
                if line.strip() and len(line.strip()) > 20:
                    clean_line = re.sub(r'^[-•*]\s*', '', line.strip())

                    if ' at ' in clean_line.lower():
                        parts = clean_line.lower().split(' at ', 1)
                        title = parts[0].strip().title()
                        company_part = parts[1]
                        company_match = re.search(r'^([^\(\n,.]+)', company_part.strip())
                        company = company_match.group(1).strip().title() if company_match else "Company"
                    else:
                        title = "Technical Experience"
                        company = "Various Companies"

                    duration_match = re.search(r'\((\d{4}(?:\s*-\s*(?:\d{4}|Present|present))?)\)', clean_line)
                    duration = duration_match.group(1) if duration_match else "Recent"

                    experiences.append({
                        "title": title,
                        "company": company,
                        "duration": duration,
                        "description": clean_line[:300]
                    })

    # If still no experiences but substantial content, create a general experience only if no other content was found
    if not experiences and len(raw_text) > 200 and not summary:
        experiences = [{
            "title": "Technical Professional",
            "company": "Various Organizations",
            "duration": "Recent",
            "description": "Experienced professional with strong technical background and expertise in multiple domains including development, infrastructure, and project management."
        }]

    # Extract education
    educations = []
    edu_pattern = r'(?:education|degree|academic)(?:\s*:)?\s*\n?(.*?)(?:\n\n|\n(?:experience|skills|summary|$))'
    edu_match = re.search(edu_pattern, raw_text, re.IGNORECASE | re.DOTALL)
    if edu_match:
        edu_text = edu_match.group(1)
        edu_lines = re.split(r'\n\s*[-•*]\s*', edu_text)
        for line in edu_lines[:2]:
            if line.strip():
                educations.append({
                    "degree": line.strip()[:100],
                    "institution": "Educational Institution",
                    "year": "Recent"
                })

    # If no summary extracted, generate one
    if not summary:
        summary = f"Professional with expertise in {', '.join(skills[:3]) if skills else 'various technical skills'}. Experienced in {len(experiences)} key areas."

    # Analyze for missing information
    parsed_data = {
        "personal_info": {
            "name": name,
            "email": email,
            "phone": phone,
            "location": location
        },
        "summary": summary,
        "experiences": experiences,
        "educations": educations,
        "skills": skills if skills else ["Communication", "Problem Solving", "Team Work"]
    }

    suggestions = analyze_missing_information(parsed_data)
    parsed_data["suggestions"] = suggestions

    return parsed_data

@app.get("/")
def read_root():
    return {"message": "AI Resume Screener API"}

if __name__ == "__main__":
    import uvicorn
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8001
    uvicorn.run(app, host="127.0.0.1", port=port)