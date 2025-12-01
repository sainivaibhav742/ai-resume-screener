"""
ATS (Applicant Tracking System) Optimizer
Analyzes resumes for ATS compatibility and provides optimization recommendations
"""

import re
from typing import Dict, List, Set, Tuple
import json


class ATSOptimizer:
    def __init__(self):
        """Initialize ATS Optimizer"""
        self.ats_friendly_sections = [
            "summary", "professional summary", "profile",
            "experience", "work experience", "employment history",
            "education", "academic background",
            "skills", "technical skills", "core competencies",
            "certifications", "certificates",
            "projects", "achievements", "awards"
        ]
        
        self.problematic_elements = {
            "tables": r'<table|<td|<tr',
            "images": r'<img|!\[.*\]\(',
            "graphics": r'<svg|<canvas',
            "text_boxes": r'<div.*position.*absolute',
            "columns": r'column-count|display.*flex.*column'
        }
        
        self.recommended_fonts = [
            "Arial", "Calibri", "Georgia", "Helvetica", 
            "Times New Roman", "Verdana", "Cambria"
        ]
        
        self.action_verbs = [
            "achieved", "implemented", "developed", "created", "designed",
            "built", "improved", "increased", "reduced", "managed",
            "led", "directed", "coordinated", "executed", "delivered",
            "optimized", "streamlined", "launched", "established", "spearheaded"
        ]
    
    def analyze(self, resume_text: str, job_keywords: List[str] = None) -> Dict:
        """
        Comprehensive ATS analysis of resume
        
        Args:
            resume_text: Raw resume text
            job_keywords: Target job keywords (optional)
            
        Returns:
            Complete ATS analysis with score and recommendations
        """
        # Run all analysis components
        format_score = self._analyze_format(resume_text)
        keyword_score = self._analyze_keywords(resume_text, job_keywords)
        structure_score = self._analyze_structure(resume_text)
        content_score = self._analyze_content(resume_text)
        
        # Calculate overall ATS score (weighted average)
        overall_score = (
            format_score["score"] * 0.25 +
            keyword_score["score"] * 0.35 +
            structure_score["score"] * 0.20 +
            content_score["score"] * 0.20
        )
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            format_score, keyword_score, structure_score, content_score
        )
        
        # Identify critical issues
        critical_issues = self._identify_critical_issues(
            format_score, keyword_score, structure_score, content_score
        )
        
        return {
            "overall_score": round(overall_score, 1),
            "ats_friendly": overall_score >= 70,
            "grade": self._get_grade(overall_score),
            "breakdown": {
                "format": format_score,
                "keywords": keyword_score,
                "structure": structure_score,
                "content": content_score
            },
            "critical_issues": critical_issues,
            "recommendations": recommendations,
            "estimated_pass_rate": f"{min(95, int(overall_score))}%"
        }
    
    def _analyze_format(self, text: str) -> Dict:
        """Analyze resume format for ATS compatibility"""
        issues = []
        score = 100
        
        # Check for problematic formatting
        for element, pattern in self.problematic_elements.items():
            if re.search(pattern, text, re.IGNORECASE):
                issues.append(f"Contains {element} which may not parse correctly")
                score -= 15
        
        # Check for special characters that might confuse ATS
        special_chars = len(re.findall(r'[^\w\s\-.,;:()\[\]@/]', text))
        if special_chars > 20:
            issues.append(f"Contains {special_chars} special characters (reduce to improve parsing)")
            score -= 10
        
        # Check for standard format markers
        if not re.search(r'\n\n', text):
            issues.append("Lacks clear paragraph breaks")
            score -= 10
        
        # Check line length (very long lines might indicate formatting issues)
        lines = text.split('\n')
        long_lines = sum(1 for line in lines if len(line) > 200)
        if long_lines > 5:
            issues.append(f"{long_lines} very long lines detected (may indicate formatting issues)")
            score -= 10
        
        return {
            "score": max(0, score),
            "issues": issues,
            "passed": score >= 70
        }
    
    def _analyze_keywords(self, text: str, job_keywords: List[str] = None) -> Dict:
        """Analyze keyword optimization"""
        text_lower = text.lower()
        
        if not job_keywords:
            # Use generic important keywords if no job-specific ones provided
            job_keywords = [
                "experience", "skills", "education", "project", "team",
                "developed", "managed", "implemented", "achieved"
            ]
        
        # Count keyword matches
        matched_keywords = []
        missing_keywords = []
        
        for keyword in job_keywords:
            keyword_lower = keyword.lower()
            # Check for exact match and variations
            if re.search(r'\b' + re.escape(keyword_lower) + r'\b', text_lower):
                matched_keywords.append(keyword)
            else:
                missing_keywords.append(keyword)
        
        # Calculate score
        if job_keywords:
            match_rate = len(matched_keywords) / len(job_keywords)
            score = match_rate * 100
        else:
            score = 50  # Neutral score if no keywords provided
        
        # Check keyword density
        word_count = len(text.split())
        keyword_count = sum(len(re.findall(r'\b' + re.escape(kw.lower()) + r'\b', text_lower)) 
                           for kw in matched_keywords)
        keyword_density = (keyword_count / word_count * 100) if word_count > 0 else 0
        
        issues = []
        if keyword_density < 2:
            issues.append(f"Low keyword density ({keyword_density:.1f}%) - increase mentions of key skills")
        elif keyword_density > 5:
            issues.append(f"High keyword density ({keyword_density:.1f}%) - avoid keyword stuffing")
        
        if len(missing_keywords) > len(job_keywords) * 0.5:
            issues.append(f"Missing {len(missing_keywords)} important keywords")
        
        return {
            "score": round(score, 1),
            "matched_keywords": matched_keywords,
            "missing_keywords": missing_keywords,
            "keyword_density": round(keyword_density, 2),
            "issues": issues,
            "passed": score >= 60
        }
    
    def _analyze_structure(self, text: str) -> Dict:
        """Analyze resume structure and organization"""
        issues = []
        score = 100
        
        text_lower = text.lower()
        found_sections = []
        
        # Check for standard sections
        required_sections = ["experience", "education", "skills"]
        for section in required_sections:
            if section in text_lower:
                found_sections.append(section)
            else:
                issues.append(f"Missing '{section}' section")
                score -= 20
        
        # Check for optional but recommended sections
        optional_sections = ["summary", "certifications", "projects"]
        for section in optional_sections:
            if section in text_lower:
                found_sections.append(section)
        
        # Check for contact information
        has_email = bool(re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text))
        has_phone = bool(re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text))
        
        if not has_email:
            issues.append("Missing email address")
            score -= 15
        if not has_phone:
            issues.append("Missing phone number")
            score -= 10
        
        # Check for dates in experience section
        experience_section = self._extract_section(text, ["experience", "work history"])
        if experience_section:
            date_count = len(re.findall(r'\b\d{4}\b|\b\w+\s+\d{4}\b', experience_section))
            if date_count < 2:
                issues.append("Experience section lacks date information")
                score -= 15
        
        return {
            "score": max(0, score),
            "found_sections": found_sections,
            "has_email": has_email,
            "has_phone": has_phone,
            "issues": issues,
            "passed": score >= 70
        }
    
    def _analyze_content(self, text: str) -> Dict:
        """Analyze resume content quality for ATS"""
        issues = []
        score = 100
        
        # Check for action verbs
        text_lower = text.lower()
        action_verbs_found = [
            verb for verb in self.action_verbs
            if re.search(r'\b' + verb + r'\b', text_lower)
        ]
        
        if len(action_verbs_found) < 5:
            issues.append(f"Only {len(action_verbs_found)} action verbs found (use more dynamic language)")
            score -= 15
        
        # Check for quantifiable achievements
        numbers = re.findall(r'\b\d+%|\b\d+\+|\$\d+|\b\d+x\b', text)
        if len(numbers) < 3:
            issues.append("Add quantifiable achievements (percentages, numbers, metrics)")
            score -= 15
        
        # Check resume length
        word_count = len(text.split())
        if word_count < 200:
            issues.append(f"Resume too short ({word_count} words) - add more detail")
            score -= 20
        elif word_count > 1000:
            issues.append(f"Resume too long ({word_count} words) - be more concise")
            score -= 10
        
        # Check for buzzwords without context
        buzzwords = ["team player", "hard worker", "detail-oriented", "results-driven"]
        buzzword_count = sum(1 for bw in buzzwords if bw in text_lower)
        if buzzword_count > 3:
            issues.append("Too many generic buzzwords - provide specific examples instead")
            score -= 10
        
        # Check for bullet points in experience
        bullet_count = len(re.findall(r'[•\-\*]\s', text))
        if bullet_count < 5:
            issues.append("Use more bullet points to improve readability")
            score -= 10
        
        return {
            "score": max(0, score),
            "action_verbs_count": len(action_verbs_found),
            "quantifiable_achievements": len(numbers),
            "word_count": word_count,
            "bullet_points": bullet_count,
            "issues": issues,
            "passed": score >= 70
        }
    
    def _generate_recommendations(
        self, 
        format_score: Dict, 
        keyword_score: Dict, 
        structure_score: Dict, 
        content_score: Dict
    ) -> List[Dict]:
        """Generate prioritized recommendations"""
        recommendations = []
        
        # Format recommendations
        if format_score["score"] < 70:
            recommendations.append({
                "category": "format",
                "priority": "high",
                "title": "Fix Formatting Issues",
                "description": "Remove tables, images, and complex layouts. Use simple, clean formatting.",
                "impact": "high"
            })
        
        # Keyword recommendations
        if keyword_score["score"] < 60:
            recommendations.append({
                "category": "keywords",
                "priority": "critical",
                "title": "Add Missing Keywords",
                "description": f"Include these keywords: {', '.join(keyword_score['missing_keywords'][:5])}",
                "impact": "critical"
            })
        
        # Structure recommendations
        if structure_score["score"] < 70:
            recommendations.append({
                "category": "structure",
                "priority": "high",
                "title": "Improve Resume Structure",
                "description": "Add missing sections and ensure proper organization with clear headings.",
                "impact": "high"
            })
        
        # Content recommendations
        if content_score["score"] < 70:
            recommendations.append({
                "category": "content",
                "priority": "medium",
                "title": "Enhance Content Quality",
                "description": "Use more action verbs and add quantifiable achievements.",
                "impact": "medium"
            })
        
        # Always recommend these best practices
        recommendations.append({
            "category": "general",
            "priority": "medium",
            "title": "Use Standard Fonts",
            "description": f"Stick to ATS-friendly fonts: {', '.join(self.recommended_fonts[:4])}",
            "impact": "low"
        })
        
        recommendations.append({
            "category": "general",
            "priority": "low",
            "title": "Save as .docx or PDF",
            "description": "Most ATS systems parse .docx and PDF files best.",
            "impact": "medium"
        })
        
        return recommendations
    
    def _identify_critical_issues(
        self,
        format_score: Dict,
        keyword_score: Dict,
        structure_score: Dict,
        content_score: Dict
    ) -> List[str]:
        """Identify critical issues that must be fixed"""
        critical = []
        
        if format_score["score"] < 50:
            critical.append("Severe formatting issues detected - resume may not parse correctly")
        
        if keyword_score["score"] < 40:
            critical.append("Missing too many important keywords - will likely be rejected")
        
        if not structure_score.get("has_email"):
            critical.append("Missing email address - cannot be contacted")
        
        if structure_score["score"] < 50:
            critical.append("Poor resume structure - missing required sections")
        
        if content_score.get("word_count", 0) < 150:
            critical.append("Resume too short - insufficient information")
        
        return critical
    
    def _extract_section(self, text: str, section_keywords: List[str]) -> str:
        """Extract a specific section from resume text"""
        text_lower = text.lower()
        lines = text.split('\n')
        
        start_idx = None
        for i, line in enumerate(lines):
            if any(keyword in line.lower() for keyword in section_keywords):
                start_idx = i + 1
                break
        
        if start_idx is None:
            return ""
        
        # Find end (next major section or end of document)
        common_headings = ["experience", "education", "skills", "projects", "certifications"]
        end_idx = len(lines)
        
        for i in range(start_idx, len(lines)):
            if any(heading in lines[i].lower() for heading in common_headings 
                   if heading not in section_keywords):
                end_idx = i
                break
        
        return '\n'.join(lines[start_idx:end_idx])
    
    def _get_grade(self, score: float) -> str:
        """Convert score to letter grade"""
        if score >= 90:
            return "A"
        elif score >= 80:
            return "B"
        elif score >= 70:
            return "C"
        elif score >= 60:
            return "D"
        else:
            return "F"
    
    def optimize_text(self, text: str, job_keywords: List[str] = None) -> Dict:
        """
        Provide specific text optimizations
        
        Args:
            text: Resume text to optimize
            job_keywords: Keywords to optimize for
            
        Returns:
            Optimized suggestions
        """
        suggestions = []
        
        # Suggest adding missing keywords naturally
        if job_keywords:
            analysis = self.analyze(text, job_keywords)
            missing = analysis["breakdown"]["keywords"]["missing_keywords"]
            
            if missing:
                suggestions.append({
                    "type": "keyword_insertion",
                    "priority": "high",
                    "keywords": missing[:5],
                    "suggestion": f"Naturally incorporate these keywords into your experience descriptions: {', '.join(missing[:5])}"
                })
        
        # Suggest replacing weak phrases
        weak_phrases = {
            "responsible for": "managed",
            "helped with": "contributed to",
            "worked on": "developed",
            "duties included": "key achievements include"
        }
        
        for weak, strong in weak_phrases.items():
            if weak in text.lower():
                suggestions.append({
                    "type": "phrase_replacement",
                    "priority": "medium",
                    "original": weak,
                    "replacement": strong,
                    "suggestion": f"Replace '{weak}' with '{strong}' for stronger impact"
                })
        
        return {
            "suggestions": suggestions,
            "auto_improvements": self._auto_optimize(text)
        }
    
    def _auto_optimize(self, text: str) -> str:
        """Auto-apply safe optimizations"""
        optimized = text
        
        # Remove extra whitespace
        optimized = re.sub(r'\n\n\n+', '\n\n', optimized)
        optimized = re.sub(r'  +', ' ', optimized)
        
        # Ensure proper spacing after bullets
        optimized = re.sub(r'([•\-\*])(\w)', r'\1 \2', optimized)
        
        return optimized


if __name__ == "__main__":
    # Test the ATS optimizer
    sample_resume = """
    John Doe
    john.doe@email.com | (555) 123-4567
    
    EXPERIENCE
    Software Engineer at Tech Corp
    2020 - Present
    • Developed web applications using Python and React
    • Improved system performance by 30%
    • Led team of 5 developers
    
    EDUCATION
    Bachelor of Science in Computer Science
    University of California, 2020
    
    SKILLS
    Python, JavaScript, React, SQL, Docker
    """
    
    optimizer = ATSOptimizer()
    job_keywords = ["Python", "React", "Docker", "AWS", "Kubernetes", "Leadership"]
    result = optimizer.analyze(sample_resume, job_keywords)
    
    print(json.dumps(result, indent=2))
