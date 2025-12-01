"""
Advanced NLP Resume Parser
Extracts structured information from resume text including skills, experience, education, and more.
"""

import spacy
import re
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import json

class AdvancedResumeParser:
    def __init__(self):
        """Initialize the resume parser with spaCy model"""
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            # Download the model if not available
            import subprocess
            subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
            self.nlp = spacy.load("en_core_web_sm")
        
        # Common skill patterns and keywords
        self.skill_patterns = self._load_skill_patterns()
        self.education_keywords = ["bachelor", "master", "phd", "diploma", "degree", "b.s.", "m.s.", "b.a.", "m.a.", "mba"]
        self.experience_keywords = ["experience", "worked", "employed", "position", "role"]
        
    def _load_skill_patterns(self) -> Dict[str, List[str]]:
        """Load comprehensive skill patterns by category"""
        return {
            "programming_languages": [
                "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "go", "golang",
                "rust", "swift", "kotlin", "php", "perl", "r", "matlab", "scala", "dart"
            ],
            "web_technologies": [
                "html", "css", "react", "angular", "vue", "nodejs", "node.js", "express",
                "django", "flask", "fastapi", "spring boot", "asp.net", "next.js", "nuxt.js",
                "svelte", "jquery", "bootstrap", "tailwind", "sass", "less", "webpack", "vite"
            ],
            "databases": [
                "sql", "mysql", "postgresql", "mongodb", "redis", "cassandra", "dynamodb",
                "oracle", "sql server", "sqlite", "elasticsearch", "neo4j", "couchdb"
            ],
            "cloud_devops": [
                "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "jenkins",
                "gitlab", "github actions", "terraform", "ansible", "ci/cd", "devops"
            ],
            "data_science": [
                "machine learning", "deep learning", "tensorflow", "pytorch", "keras",
                "scikit-learn", "pandas", "numpy", "data analysis", "statistics",
                "nlp", "computer vision", "neural networks", "ai"
            ],
            "soft_skills": [
                "leadership", "communication", "teamwork", "problem solving", "analytical",
                "project management", "agile", "scrum", "collaboration", "presentation"
            ],
            "tools": [
                "git", "jira", "confluence", "slack", "figma", "adobe", "photoshop",
                "illustrator", "excel", "powerpoint", "tableau", "power bi", "looker"
            ]
        }
    
    def parse(self, text: str) -> Dict:
        """
        Main parsing method - extracts all information from resume text
        
        Args:
            text: Raw resume text
            
        Returns:
            Structured dictionary with extracted information
        """
        doc = self.nlp(text)
        
        return {
            "personal_info": self._extract_personal_info(text, doc),
            "skills": self._extract_skills(text, doc),
            "experience": self._extract_experience(text, doc),
            "education": self._extract_education(text, doc),
            "summary": self._extract_summary(text),
            "keywords": self._extract_keywords(doc),
            "metadata": {
                "parse_date": datetime.utcnow().isoformat(),
                "text_length": len(text),
                "word_count": len(text.split())
            }
        }
    
    def _extract_personal_info(self, text: str, doc) -> Dict:
        """Extract personal information (name, email, phone, location)"""
        info = {
            "name": None,
            "email": None,
            "phone": None,
            "location": None,
            "linkedin": None,
            "github": None
        }
        
        # Extract email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            info["email"] = emails[0]
        
        # Extract phone
        phone_patterns = [
            r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',  # US format
            r'\(\d{3}\)\s*\d{3}[-.]?\d{4}',     # (123) 456-7890
            r'\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}'  # International
        ]
        for pattern in phone_patterns:
            phones = re.findall(pattern, text)
            if phones:
                info["phone"] = phones[0]
                break
        
        # Extract name (usually first line or first PERSON entity)
        lines = text.split('\n')
        for line in lines[:5]:  # Check first 5 lines
            line = line.strip()
            if len(line.split()) <= 4 and len(line) > 3:  # Name shouldn't be too long
                # Avoid lines with common keywords
                if not any(keyword in line.lower() for keyword in ['email', 'phone', 'address', 'linkedin']):
                    info["name"] = line
                    break
        
        # Fallback: Use spaCy NER
        if not info["name"]:
            for ent in doc.ents:
                if ent.label_ == "PERSON":
                    info["name"] = ent.text
                    break
        
        # Extract location
        for ent in doc.ents:
            if ent.label_ in ["GPE", "LOC"]:
                info["location"] = ent.text
                break
        
        # Extract LinkedIn
        linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        linkedin = re.search(linkedin_pattern, text, re.IGNORECASE)
        if linkedin:
            info["linkedin"] = linkedin.group(0)
        
        # Extract GitHub
        github_pattern = r'github\.com/[\w-]+'
        github = re.search(github_pattern, text, re.IGNORECASE)
        if github:
            info["github"] = github.group(0)
        
        return info
    
    def _extract_skills(self, text: str, doc) -> Dict:
        """Extract skills categorized by type"""
        text_lower = text.lower()
        
        extracted_skills = {}
        all_skills = []
        
        for category, skills in self.skill_patterns.items():
            found_skills = []
            for skill in skills:
                # Use word boundaries for accurate matching
                pattern = r'\b' + re.escape(skill.lower()) + r'\b'
                if re.search(pattern, text_lower):
                    found_skills.append(skill.title())
                    all_skills.append(skill.title())
            
            if found_skills:
                extracted_skills[category] = found_skills
        
        return {
            "categorized": extracted_skills,
            "all_skills": sorted(list(set(all_skills))),
            "count": len(all_skills)
        }
    
    def _extract_experience(self, text: str, doc) -> List[Dict]:
        """Extract work experience with dates, companies, and positions"""
        experiences = []
        
        # Split text into sections (assuming experience section exists)
        experience_section = self._extract_section(text, ["experience", "work history", "employment"])
        
        if not experience_section:
            return experiences
        
        # Split by date patterns or double newlines
        entries = re.split(r'\n\n+', experience_section)
        
        for entry in entries:
            if len(entry.strip()) < 20:  # Skip very short entries
                continue
            
            exp_entry = {
                "position": None,
                "company": None,
                "duration": None,
                "start_date": None,
                "end_date": None,
                "description": None,
                "responsibilities": []
            }
            
            lines = entry.split('\n')
            
            # Try to extract position (usually first line)
            if lines:
                exp_entry["position"] = lines[0].strip()
            
            # Extract company (often contains "at", "with", or appears after position)
            for line in lines[:3]:
                if any(word in line.lower() for word in ["at ", "with ", "@"]):
                    exp_entry["company"] = line.strip()
                    break
            
            # Extract dates
            date_patterns = [
                r'(\d{4})\s*[-–]\s*(\d{4}|present)',
                r'(\w+\s+\d{4})\s*[-–]\s*(\w+\s+\d{4}|present)',
                r'(\d{1,2}/\d{4})\s*[-–]\s*(\d{1,2}/\d{4}|present)'
            ]
            
            for pattern in date_patterns:
                match = re.search(pattern, entry, re.IGNORECASE)
                if match:
                    exp_entry["start_date"] = match.group(1)
                    exp_entry["end_date"] = match.group(2)
                    exp_entry["duration"] = f"{match.group(1)} - {match.group(2)}"
                    break
            
            # Extract bullet points as responsibilities
            bullet_pattern = r'[•\-\*]\s*(.+)'
            responsibilities = re.findall(bullet_pattern, entry)
            if responsibilities:
                exp_entry["responsibilities"] = [r.strip() for r in responsibilities]
            
            # Store full description
            exp_entry["description"] = entry.strip()
            
            experiences.append(exp_entry)
        
        return experiences
    
    def _extract_education(self, text: str, doc) -> List[Dict]:
        """Extract education information"""
        education_entries = []
        
        education_section = self._extract_section(text, ["education", "academic background", "qualifications"])
        
        if not education_section:
            return education_entries
        
        # Split by double newlines or degree patterns
        entries = re.split(r'\n\n+', education_section)
        
        for entry in entries:
            if len(entry.strip()) < 10:
                continue
            
            edu_entry = {
                "degree": None,
                "field": None,
                "institution": None,
                "year": None,
                "gpa": None
            }
            
            # Extract degree type
            for keyword in self.education_keywords:
                if keyword in entry.lower():
                    # Find the line containing the degree
                    for line in entry.split('\n'):
                        if keyword in line.lower():
                            edu_entry["degree"] = line.strip()
                            break
                    break
            
            # Extract year
            year_pattern = r'\b(19|20)\d{2}\b'
            years = re.findall(year_pattern, entry)
            if years:
                edu_entry["year"] = years[-1]  # Take the most recent/last year
            
            # Extract GPA
            gpa_pattern = r'gpa[:\s]*(\d\.\d+)'
            gpa_match = re.search(gpa_pattern, entry, re.IGNORECASE)
            if gpa_match:
                edu_entry["gpa"] = gpa_match.group(1)
            
            # Try to extract institution using NER
            entry_doc = self.nlp(entry)
            for ent in entry_doc.ents:
                if ent.label_ == "ORG":
                    edu_entry["institution"] = ent.text
                    break
            
            education_entries.append(edu_entry)
        
        return education_entries
    
    def _extract_summary(self, text: str) -> Optional[str]:
        """Extract professional summary or objective"""
        summary_section = self._extract_section(
            text, 
            ["summary", "professional summary", "objective", "profile", "about"]
        )
        
        if summary_section:
            # Return first paragraph or first few sentences
            lines = summary_section.split('\n')
            summary_lines = [line.strip() for line in lines if len(line.strip()) > 30]
            if summary_lines:
                return ' '.join(summary_lines[:3])  # First 3 lines
        
        return None
    
    def _extract_keywords(self, doc) -> List[str]:
        """Extract important keywords and phrases using NER and noun chunks"""
        keywords = []
        
        # Extract named entities
        for ent in doc.ents:
            if ent.label_ in ["ORG", "PRODUCT", "GPE", "WORK_OF_ART"]:
                keywords.append(ent.text)
        
        # Extract noun chunks (important phrases)
        for chunk in doc.noun_chunks:
            if len(chunk.text.split()) >= 2:  # Multi-word phrases
                keywords.append(chunk.text)
        
        # Remove duplicates and return
        return list(set(keywords))[:30]  # Top 30 keywords
    
    def _extract_section(self, text: str, section_keywords: List[str]) -> Optional[str]:
        """Extract a specific section from resume text"""
        text_lower = text.lower()
        lines = text.split('\n')
        
        start_idx = None
        end_idx = None
        
        # Find section start
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            if any(keyword in line_lower for keyword in section_keywords):
                start_idx = i + 1
                break
        
        if start_idx is None:
            return None
        
        # Find section end (next major heading or end of document)
        common_headings = [
            "experience", "education", "skills", "projects", "certifications",
            "awards", "publications", "references", "summary", "objective"
        ]
        
        for i in range(start_idx, len(lines)):
            line_lower = lines[i].lower().strip()
            # Check if this is a new section (heading in ALL CAPS or matches common headings)
            if (line_lower and 
                (lines[i].strip().isupper() or 
                 any(heading in line_lower for heading in common_headings if heading not in section_keywords))):
                end_idx = i
                break
        
        if end_idx is None:
            end_idx = len(lines)
        
        section_text = '\n'.join(lines[start_idx:end_idx])
        return section_text.strip()
    
    def calculate_experience_years(self, experiences: List[Dict]) -> float:
        """Calculate total years of experience from experience entries"""
        total_months = 0
        
        for exp in experiences:
            if exp.get("start_date") and exp.get("end_date"):
                try:
                    # Simple year-based calculation
                    start_year = int(re.search(r'\d{4}', exp["start_date"]).group())
                    
                    if "present" in exp["end_date"].lower():
                        end_year = datetime.now().year
                    else:
                        end_year = int(re.search(r'\d{4}', exp["end_date"]).group())
                    
                    years = end_year - start_year
                    total_months += years * 12
                except:
                    pass
        
        return round(total_months / 12, 1)


if __name__ == "__main__":
    # Test the parser
    sample_resume = """
    John Doe
    john.doe@email.com | (555) 123-4567 | San Francisco, CA
    linkedin.com/in/johndoe | github.com/johndoe
    
    PROFESSIONAL SUMMARY
    Experienced software engineer with 5+ years of expertise in full-stack development.
    Proficient in Python, JavaScript, and cloud technologies.
    
    EXPERIENCE
    Senior Software Engineer
    Tech Corp | San Francisco, CA
    2020 - Present
    • Developed microservices using Python and FastAPI
    • Implemented CI/CD pipelines with Docker and Kubernetes
    • Led team of 5 developers
    
    Software Engineer
    StartUp Inc | San Francisco, CA
    2018 - 2020
    • Built web applications using React and Node.js
    • Optimized database queries in PostgreSQL
    • Collaborated with cross-functional teams
    
    EDUCATION
    Bachelor of Science in Computer Science
    University of California, Berkeley
    2018
    GPA: 3.8
    
    SKILLS
    Programming: Python, JavaScript, TypeScript, Java
    Web: React, Node.js, FastAPI, Django
    Database: PostgreSQL, MongoDB, Redis
    Cloud: AWS, Docker, Kubernetes
    """
    
    parser = AdvancedResumeParser()
    result = parser.parse(sample_resume)
    
    print(json.dumps(result, indent=2))
