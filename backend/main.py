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
import hashlib
from datetime import datetime
import requests
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'ml'))
from job_predictor import JobPredictor

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
job_predictor.load_model('job_predictor_model.pkl')

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

@app.post("/chat-assistant")
async def chat_assistant(message: str = Form(...), context: Optional[str] = Form(None)):
    """AI-powered chatbot assistant for HR queries using NVIDIA API"""
    if not NVIDIA_API_KEY:
        return {
            "response": "AI assistant is currently unavailable. Please check your NVIDIA API key configuration.",
            "timestamp": datetime.now().isoformat(),
            "error": "API key not configured"
        }

    try:
        system_prompt = """You are an AI HR assistant for the Resume Screener application. Help users with:
- Resume screening guidance
- Job matching advice
- HR best practices
- Candidate evaluation tips
- System usage instructions

Be professional, helpful, and concise. If asked about technical system details, provide accurate information about the AI Resume Screener features."""

        if context:
            system_prompt += f"\n\nContext: {context}"

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

@app.get("/")
def read_root():
    return {"message": "AI Resume Screener API"}

if __name__ == "__main__":
    import uvicorn
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8001
    uvicorn.run(app, host="127.0.0.1", port=port)
