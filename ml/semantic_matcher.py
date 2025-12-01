"""
Semantic Job-Resume Matcher
Advanced matching system using semantic similarity and weighted scoring
"""

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, List, Tuple
import numpy as np
import re


class SemanticMatcher:
    def __init__(self):
        """Initialize semantic matcher with sentence transformer model"""
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Weights for different matching criteria
        self.weights = {
            "semantic_similarity": 0.30,
            "skills_match": 0.35,
            "experience_match": 0.15,
            "education_match": 0.10,
            "keyword_match": 0.10
        }
    
    def match(self, resume_data: Dict, job_data: Dict) -> Dict:
        """
        Calculate comprehensive match score between resume and job
        
        Args:
            resume_data: Parsed resume data dictionary
            job_data: Job posting data dictionary
            
        Returns:
            Dictionary with overall score and breakdown
        """
        scores = {
            "semantic_similarity": self._calculate_semantic_similarity(resume_data, job_data),
            "skills_match": self._calculate_skills_match(resume_data, job_data),
            "experience_match": self._calculate_experience_match(resume_data, job_data),
            "education_match": self._calculate_education_match(resume_data, job_data),
            "keyword_match": self._calculate_keyword_match(resume_data, job_data)
        }
        
        # Calculate weighted overall score
        overall_score = sum(
            scores[key] * self.weights[key] 
            for key in scores.keys()
        )
        
        # Calculate skill gaps
        skill_gaps = self._identify_skill_gaps(resume_data, job_data)
        
        return {
            "overall_score": round(overall_score, 2),
            "match_percentage": round(overall_score * 100, 1),
            "scores_breakdown": {k: round(v, 2) for k, v in scores.items()},
            "skill_gaps": skill_gaps,
            "recommendation": self._generate_recommendation(overall_score),
            "match_level": self._get_match_level(overall_score)
        }
    
    def _calculate_semantic_similarity(self, resume_data: Dict, job_data: Dict) -> float:
        """Calculate semantic similarity between resume and job description"""
        # Combine relevant resume text
        resume_text = " ".join(filter(None, [
            resume_data.get("summary") or "",
            " ".join([exp.get("description") or "" for exp in resume_data.get("experience", [])]),
            " ".join(resume_data.get("skills", {}).get("all_skills", []))
        ]))
        
        # Job description text
        job_text = " ".join([
            job_data.get("description", ""),
            job_data.get("requirements", ""),
            " ".join(job_data.get("required_skills", [])),
            " ".join(job_data.get("preferred_skills", []))
        ])
        
        if not resume_text.strip() or not job_text.strip():
            return 0.0
        
        # Calculate embeddings
        resume_embedding = self.model.encode([resume_text])
        job_embedding = self.model.encode([job_text])
        
        # Calculate cosine similarity
        similarity = cosine_similarity(resume_embedding, job_embedding)[0][0]
        
        return max(0.0, min(1.0, similarity))  # Clamp between 0 and 1
    
    def _calculate_skills_match(self, resume_data: Dict, job_data: Dict) -> float:
        """Calculate skills match score"""
        resume_skills = set([
            skill.lower() 
            for skill in resume_data.get("skills", {}).get("all_skills", [])
        ])
        
        required_skills = set([
            skill.lower() 
            for skill in job_data.get("required_skills", [])
        ])
        
        preferred_skills = set([
            skill.lower() 
            for skill in job_data.get("preferred_skills", [])
        ])
        
        if not required_skills and not preferred_skills:
            return 0.5  # Neutral score if no skills specified
        
        # Calculate required skills match (weighted more heavily)
        required_match = 0.0
        if required_skills:
            matched_required = resume_skills.intersection(required_skills)
            required_match = len(matched_required) / len(required_skills)
        
        # Calculate preferred skills match
        preferred_match = 0.0
        if preferred_skills:
            matched_preferred = resume_skills.intersection(preferred_skills)
            preferred_match = len(matched_preferred) / len(preferred_skills)
        
        # Weighted combination (required skills are more important)
        if required_skills and preferred_skills:
            score = (required_match * 0.7) + (preferred_match * 0.3)
        elif required_skills:
            score = required_match
        else:
            score = preferred_match
        
        return score
    
    def _calculate_experience_match(self, resume_data: Dict, job_data: Dict) -> float:
        """Calculate experience match score"""
        # Extract years of experience from resume
        experiences = resume_data.get("experience", [])
        total_years = self._calculate_total_years(experiences)
        
        # Get required years from job
        required_years = job_data.get("required_experience_years", 0)
        
        if required_years == 0:
            return 0.5  # Neutral if no experience requirement
        
        # Calculate score based on how close candidate is to requirement
        if total_years >= required_years:
            # Meet or exceed requirement
            excess = total_years - required_years
            if excess <= 2:
                return 1.0  # Perfect match
            else:
                # Slightly lower score for significantly more experience (might be overqualified)
                return max(0.8, 1.0 - (excess - 2) * 0.05)
        else:
            # Below requirement
            ratio = total_years / required_years
            return max(0.0, ratio)
    
    def _calculate_education_match(self, resume_data: Dict, job_data: Dict) -> float:
        """Calculate education match score"""
        education_entries = resume_data.get("education", [])
        required_education = job_data.get("required_education", "").lower()
        
        if not required_education:
            return 0.5  # Neutral if no education requirement
        
        # Education level hierarchy
        education_levels = {
            "phd": 5, "doctorate": 5,
            "master": 4, "mba": 4, "m.s.": 4, "m.a.": 4,
            "bachelor": 3, "b.s.": 3, "b.a.": 3,
            "associate": 2,
            "diploma": 1, "certificate": 1
        }
        
        # Get required level
        required_level = 0
        for edu_type, level in education_levels.items():
            if edu_type in required_education:
                required_level = level
                break
        
        # Get candidate's highest education level
        candidate_level = 0
        for entry in education_entries:
            degree = entry.get("degree", "").lower()
            for edu_type, level in education_levels.items():
                if edu_type in degree:
                    candidate_level = max(candidate_level, level)
        
        if required_level == 0:
            return 0.5
        
        if candidate_level >= required_level:
            return 1.0
        elif candidate_level == required_level - 1:
            return 0.7  # One level below
        else:
            return 0.3  # Significantly below
    
    def _calculate_keyword_match(self, resume_data: Dict, job_data: Dict) -> float:
        """Calculate keyword match score"""
        resume_text = " ".join(filter(None, [
            resume_data.get("summary") or "",
            " ".join([exp.get("description") or "" for exp in resume_data.get("experience", [])]),
        ])).lower()
        
        job_keywords = job_data.get("keywords", [])
        if not job_keywords:
            # Extract keywords from job description
            job_text = job_data.get("description", "") + " " + job_data.get("requirements", "")
            job_keywords = self._extract_keywords(job_text)
        
        if not job_keywords:
            return 0.5
        
        # Count matches
        matched_keywords = sum(
            1 for keyword in job_keywords 
            if keyword.lower() in resume_text
        )
        
        return matched_keywords / len(job_keywords)
    
    def _identify_skill_gaps(self, resume_data: Dict, job_data: Dict) -> Dict:
        """Identify missing skills and provide recommendations"""
        resume_skills = set([
            skill.lower() 
            for skill in resume_data.get("skills", {}).get("all_skills", [])
        ])
        
        required_skills = set([
            skill.lower() 
            for skill in job_data.get("required_skills", [])
        ])
        
        preferred_skills = set([
            skill.lower() 
            for skill in job_data.get("preferred_skills", [])
        ])
        
        # Find gaps
        missing_required = list(required_skills - resume_skills)
        missing_preferred = list(preferred_skills - resume_skills)
        
        return {
            "missing_required_skills": missing_required,
            "missing_preferred_skills": missing_preferred,
            "total_gaps": len(missing_required) + len(missing_preferred),
            "critical_gaps": len(missing_required)
        }
    
    def _calculate_total_years(self, experiences: List[Dict]) -> float:
        """Calculate total years of experience"""
        from datetime import datetime
        total_months = 0
        
        for exp in experiences:
            if exp.get("start_date") and exp.get("end_date"):
                try:
                    # Extract years
                    start_year = int(re.search(r'\d{4}', exp["start_date"]).group())
                    
                    if "present" in exp["end_date"].lower():
                        end_year = datetime.now().year
                    else:
                        end_year = int(re.search(r'\d{4}', exp["end_date"]).group())
                    
                    years = max(0, end_year - start_year)
                    total_months += years * 12
                except:
                    pass
        
        return round(total_months / 12, 1)
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract important keywords from text"""
        # Simple keyword extraction based on word frequency
        words = re.findall(r'\b[a-z]{4,}\b', text.lower())
        
        # Remove common stopwords
        stopwords = {
            "with", "that", "this", "from", "will", "have", "been", "were",
            "your", "their", "would", "could", "should", "about", "which"
        }
        
        words = [w for w in words if w not in stopwords]
        
        # Count frequency
        word_freq = {}
        for word in words:
            word_freq[word] = word_freq.get(word, 0) + 1
        
        # Return top keywords
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        return [word for word, freq in sorted_words[:20]]
    
    def _generate_recommendation(self, score: float) -> str:
        """Generate recommendation based on match score"""
        if score >= 0.8:
            return "Strong Match - Highly recommended for interview"
        elif score >= 0.65:
            return "Good Match - Recommended for consideration"
        elif score >= 0.5:
            return "Moderate Match - Review carefully"
        elif score >= 0.35:
            return "Weak Match - May not meet requirements"
        else:
            return "Poor Match - Does not meet requirements"
    
    def _get_match_level(self, score: float) -> str:
        """Get match level category"""
        if score >= 0.8:
            return "excellent"
        elif score >= 0.65:
            return "good"
        elif score >= 0.5:
            return "moderate"
        elif score >= 0.35:
            return "weak"
        else:
            return "poor"
    
    def batch_match(self, resume_data: Dict, job_postings: List[Dict]) -> List[Dict]:
        """
        Match a resume against multiple job postings
        
        Args:
            resume_data: Parsed resume data
            job_postings: List of job posting data dictionaries
            
        Returns:
            List of match results sorted by score
        """
        results = []
        
        for job in job_postings:
            match_result = self.match(resume_data, job)
            results.append({
                "job_id": job.get("id"),
                "job_title": job.get("title"),
                "company": job.get("company"),
                **match_result
            })
        
        # Sort by overall score (descending)
        results.sort(key=lambda x: x["overall_score"], reverse=True)
        
        return results


if __name__ == "__main__":
    # Test the matcher
    import json
    
    # Sample resume data
    resume_data = {
        "summary": "Experienced software engineer with 5 years of full-stack development",
        "skills": {
            "all_skills": ["Python", "JavaScript", "React", "Node.js", "PostgreSQL", "Docker", "AWS"]
        },
        "experience": [
            {"start_date": "2020", "end_date": "present", "description": "Senior developer"},
            {"start_date": "2018", "end_date": "2020", "description": "Software engineer"}
        ],
        "education": [
            {"degree": "Bachelor of Science in Computer Science"}
        ]
    }
    
    # Sample job data
    job_data = {
        "title": "Full Stack Developer",
        "description": "Build modern web applications using React and Node.js",
        "requirements": "5+ years of experience in full-stack development",
        "required_skills": ["JavaScript", "React", "Node.js", "PostgreSQL"],
        "preferred_skills": ["Docker", "AWS", "TypeScript"],
        "required_experience_years": 5,
        "required_education": "Bachelor's degree"
    }
    
    matcher = SemanticMatcher()
    result = matcher.match(resume_data, job_data)
    
    print(json.dumps(result, indent=2))
