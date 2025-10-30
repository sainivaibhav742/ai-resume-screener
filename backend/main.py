from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
from pdfminer.high_level import extract_text
import spacy
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
from typing import Dict, List
import os
import sys
import tempfile
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
job_predictor.load_model('../ml/job_predictor_model.pkl')

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
            # If both fail, try reading as plain text (for test files)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    return f.read()
            except Exception as e3:
                raise HTTPException(status_code=400, detail=f"Could not extract text from PDF: {str(e)}")

def parse_resume(text: str) -> Dict:
    """Parse resume text to extract structured data"""
    doc = nlp(text)

    # Extract entities
    entities = {ent.label_: ent.text for ent in doc.ents}

    # Extract skills (simple keyword-based for now)
    skills_keywords = ["python", "java", "javascript", "react", "node.js", "sql", "machine learning", "nlp", "ai"]
    skills = [skill for skill in skills_keywords if skill.lower() in text.lower()]

    # Extract experience (basic regex)
    experience_pattern = r'(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)'
    experience_matches = re.findall(experience_pattern, text, re.IGNORECASE)
    experience_years = max([int(match) for match in experience_matches]) if experience_matches else 0

    return {
        "name": entities.get("PERSON", "Unknown"),
        "skills": skills,
        "experience_years": experience_years,
        "education": entities.get("ORG", "Unknown"),  # Simplified
        "contact": entities.get("GPE", "Unknown"),  # Simplified
        "raw_text": text[:500]  # First 500 chars
    }

def extract_skills_from_job(job_description: str) -> List[str]:
    """Extract skills from job description"""
    skills_keywords = ["python", "java", "javascript", "react", "node.js", "sql", "machine learning", "nlp", "ai"]
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
async def screen_resume(file: UploadFile = File(...), job_description: str = Form(...)):
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

        return {
            "resume_data": resume_data,
            "predicted_role": predicted_role,
            "skill_gap": skill_gap,
            "ats_optimization": ats_check,
            "language_tone": tone_eval,
            "bias_detection": bias_check,
            "fit_score": round(fit_score, 2),
            "recommendation": "Strong match" if fit_score > 70 else "Moderate match" if fit_score > 50 else "Weak match"
        }

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/")
def read_root():
    return {"message": "AI Resume Screener API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)
