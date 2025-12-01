"""
Skill Recommendation Engine
Analyzes candidate skills and provides personalized recommendations for career growth
"""

from typing import Dict, List, Set, Tuple
import json
from datetime import datetime


class SkillRecommendationEngine:
    def __init__(self):
        """Initialize skill recommendation engine"""
        self.skill_taxonomy = self._load_skill_taxonomy()
        self.career_paths = self._load_career_paths()
        self.market_trends = self._load_market_trends()
    
    def _load_skill_taxonomy(self) -> Dict:
        """Load comprehensive skill taxonomy with relationships"""
        return {
            "programming_languages": {
                "Python": {
                    "related": ["Django", "Flask", "FastAPI", "Pandas", "NumPy"],
                    "level": "core",
                    "category": "backend"
                },
                "JavaScript": {
                    "related": ["React", "Node.js", "TypeScript", "Vue", "Angular"],
                    "level": "core",
                    "category": "frontend"
                },
                "TypeScript": {
                    "related": ["JavaScript", "React", "Angular", "Node.js"],
                    "level": "advanced",
                    "category": "frontend"
                },
                "Java": {
                    "related": ["Spring Boot", "Hibernate", "Maven", "Gradle"],
                    "level": "core",
                    "category": "backend"
                },
                "Go": {
                    "related": ["Docker", "Kubernetes", "Microservices"],
                    "level": "advanced",
                    "category": "backend"
                }
            },
            "frameworks": {
                "React": {
                    "related": ["JavaScript", "TypeScript", "Next.js", "Redux", "React Query"],
                    "level": "intermediate",
                    "category": "frontend"
                },
                "Node.js": {
                    "related": ["JavaScript", "Express", "NestJS", "MongoDB", "PostgreSQL"],
                    "level": "intermediate",
                    "category": "backend"
                },
                "Django": {
                    "related": ["Python", "PostgreSQL", "Redis", "Celery"],
                    "level": "intermediate",
                    "category": "backend"
                },
                "FastAPI": {
                    "related": ["Python", "Pydantic", "SQLAlchemy", "Uvicorn"],
                    "level": "intermediate",
                    "category": "backend"
                }
            },
            "cloud_devops": {
                "AWS": {
                    "related": ["Docker", "Kubernetes", "Terraform", "EC2", "S3", "Lambda"],
                    "level": "intermediate",
                    "category": "cloud"
                },
                "Docker": {
                    "related": ["Kubernetes", "Docker Compose", "CI/CD"],
                    "level": "intermediate",
                    "category": "devops"
                },
                "Kubernetes": {
                    "related": ["Docker", "Helm", "Prometheus", "Grafana"],
                    "level": "advanced",
                    "category": "devops"
                },
                "Terraform": {
                    "related": ["AWS", "Azure", "GCP", "Infrastructure as Code"],
                    "level": "advanced",
                    "category": "devops"
                }
            },
            "data_science": {
                "Machine Learning": {
                    "related": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas"],
                    "level": "advanced",
                    "category": "ai"
                },
                "TensorFlow": {
                    "related": ["Python", "Keras", "Deep Learning", "Neural Networks"],
                    "level": "advanced",
                    "category": "ai"
                },
                "Pandas": {
                    "related": ["Python", "NumPy", "Data Analysis", "SQL"],
                    "level": "intermediate",
                    "category": "data"
                }
            },
            "databases": {
                "PostgreSQL": {
                    "related": ["SQL", "Database Design", "Indexing", "Query Optimization"],
                    "level": "intermediate",
                    "category": "database"
                },
                "MongoDB": {
                    "related": ["NoSQL", "Database Design", "Indexing"],
                    "level": "intermediate",
                    "category": "database"
                },
                "Redis": {
                    "related": ["Caching", "In-Memory Database", "Session Management"],
                    "level": "intermediate",
                    "category": "database"
                }
            }
        }
    
    def _load_career_paths(self) -> Dict:
        """Load career progression paths"""
        return {
            "Software Engineer": {
                "core_skills": ["Python", "JavaScript", "Git", "SQL", "REST APIs"],
                "next_level": "Senior Software Engineer",
                "recommended_skills": ["System Design", "Docker", "AWS", "Testing", "CI/CD"],
                "typical_years": 2
            },
            "Senior Software Engineer": {
                "core_skills": ["System Design", "Architecture", "Mentoring", "Docker", "Kubernetes"],
                "next_level": "Tech Lead / Engineering Manager",
                "recommended_skills": ["Leadership", "Project Management", "Microservices", "Performance Optimization"],
                "typical_years": 4
            },
            "Data Scientist": {
                "core_skills": ["Python", "Machine Learning", "Statistics", "Pandas", "SQL"],
                "next_level": "Senior Data Scientist",
                "recommended_skills": ["Deep Learning", "TensorFlow", "Big Data", "MLOps", "A/B Testing"],
                "typical_years": 2
            },
            "Frontend Developer": {
                "core_skills": ["JavaScript", "React", "HTML", "CSS", "TypeScript"],
                "next_level": "Senior Frontend Developer",
                "recommended_skills": ["Performance Optimization", "Testing", "Web Accessibility", "Next.js", "State Management"],
                "typical_years": 2
            },
            "Backend Developer": {
                "core_skills": ["Python", "Node.js", "SQL", "REST APIs", "Authentication"],
                "next_level": "Senior Backend Developer",
                "recommended_skills": ["Microservices", "Message Queues", "Caching", "System Design", "GraphQL"],
                "typical_years": 2
            },
            "DevOps Engineer": {
                "core_skills": ["Docker", "Kubernetes", "CI/CD", "Linux", "Bash"],
                "next_level": "Senior DevOps Engineer / SRE",
                "recommended_skills": ["Terraform", "Monitoring", "Security", "Cloud Architecture", "GitOps"],
                "typical_years": 2
            }
        }
    
    def _load_market_trends(self) -> Dict:
        """Load current market trends and in-demand skills"""
        return {
            "hot_skills_2024": [
                "AI/ML", "Python", "React", "TypeScript", "Kubernetes", 
                "AWS", "Docker", "Go", "Rust", "GraphQL"
            ],
            "emerging_technologies": [
                "Large Language Models", "Edge Computing", "WebAssembly",
                "Serverless", "Blockchain", "Quantum Computing"
            ],
            "industry_demand": {
                "AI/ML Engineer": "very_high",
                "Cloud Architect": "high",
                "Full Stack Developer": "high",
                "DevOps Engineer": "high",
                "Data Engineer": "high",
                "Cybersecurity Specialist": "high"
            }
        }
    
    def generate_recommendations(
        self, 
        current_skills: List[str],
        target_role: str = None,
        experience_years: float = 0
    ) -> Dict:
        """
        Generate personalized skill recommendations
        
        Args:
            current_skills: List of current skills
            target_role: Desired career role (optional)
            experience_years: Years of experience
            
        Returns:
            Dictionary with recommendations and learning paths
        """
        current_skills_lower = [skill.lower() for skill in current_skills]
        
        # Analyze current skill profile
        skill_profile = self._analyze_skill_profile(current_skills)
        
        # Get complementary skills
        complementary = self._find_complementary_skills(current_skills)
        
        # Get career progression recommendations
        career_recommendations = self._get_career_recommendations(
            current_skills, target_role, experience_years
        )
        
        # Get trending skills relevant to profile
        trending = self._get_relevant_trending_skills(current_skills)
        
        # Get skills to learn next
        next_skills = self._prioritize_next_skills(
            current_skills, complementary, career_recommendations, trending
        )
        
        # Generate learning path
        learning_path = self._generate_learning_path(current_skills, next_skills, target_role)
        
        return {
            "current_profile": skill_profile,
            "skill_gaps": career_recommendations.get("missing_skills", []),
            "next_skills_to_learn": next_skills[:10],
            "complementary_skills": complementary[:15],
            "trending_skills": trending[:10],
            "career_path": career_recommendations,
            "learning_path": learning_path,
            "market_insights": self._get_market_insights(current_skills, target_role)
        }
    
    def _analyze_skill_profile(self, skills: List[str]) -> Dict:
        """Analyze the candidate's skill profile"""
        profile = {
            "total_skills": len(skills),
            "skill_categories": {},
            "strengths": [],
            "level": "beginner"
        }
        
        # Categorize skills
        for skill in skills:
            skill_lower = skill.lower()
            for category, skill_dict in self.skill_taxonomy.items():
                for skill_name, skill_info in skill_dict.items():
                    if skill_lower == skill_name.lower() or skill_lower in [s.lower() for s in skill_info.get("related", [])]:
                        cat = skill_info.get("category", category)
                        if cat not in profile["skill_categories"]:
                            profile["skill_categories"][cat] = []
                        profile["skill_categories"][cat].append(skill)
        
        # Identify strengths (categories with most skills)
        if profile["skill_categories"]:
            sorted_cats = sorted(
                profile["skill_categories"].items(),
                key=lambda x: len(x[1]),
                reverse=True
            )
            profile["strengths"] = [cat for cat, skills in sorted_cats[:3]]
        
        # Determine level based on number and type of skills
        if len(skills) >= 15:
            profile["level"] = "expert"
        elif len(skills) >= 10:
            profile["level"] = "advanced"
        elif len(skills) >= 5:
            profile["level"] = "intermediate"
        
        return profile
    
    def _find_complementary_skills(self, current_skills: List[str]) -> List[str]:
        """Find skills that complement current skill set"""
        complementary = set()
        current_lower = [s.lower() for s in current_skills]
        
        for category, skill_dict in self.skill_taxonomy.items():
            for skill_name, skill_info in skill_dict.items():
                if skill_name.lower() in current_lower:
                    # Add related skills
                    for related in skill_info.get("related", []):
                        if related.lower() not in current_lower:
                            complementary.add(related)
        
        return list(complementary)
    
    def _get_career_recommendations(
        self, 
        current_skills: List[str], 
        target_role: str,
        experience_years: float
    ) -> Dict:
        """Get career-specific recommendations"""
        current_lower = [s.lower() for s in current_skills]
        
        # Determine current or target role
        if not target_role:
            # Try to infer role from skills
            target_role = self._infer_role(current_skills)
        
        if target_role not in self.career_paths:
            return {"target_role": target_role, "missing_skills": [], "next_level": None}
        
        path = self.career_paths[target_role]
        
        # Find missing core skills
        missing_core = [
            skill for skill in path["core_skills"]
            if skill.lower() not in current_lower
        ]
        
        # Find missing recommended skills for next level
        missing_recommended = [
            skill for skill in path.get("recommended_skills", [])
            if skill.lower() not in current_lower
        ]
        
        # Determine readiness for next level
        core_completeness = 1.0 - (len(missing_core) / len(path["core_skills"]))
        ready_for_next = core_completeness >= 0.8 and experience_years >= path.get("typical_years", 0)
        
        return {
            "current_role": target_role,
            "next_level": path.get("next_level"),
            "missing_skills": missing_core + missing_recommended,
            "missing_core_skills": missing_core,
            "missing_recommended_skills": missing_recommended,
            "core_completeness": round(core_completeness * 100, 1),
            "ready_for_promotion": ready_for_next,
            "estimated_time_to_next_level": path.get("typical_years", 0)
        }
    
    def _get_relevant_trending_skills(self, current_skills: List[str]) -> List[str]:
        """Get trending skills relevant to current profile"""
        current_lower = [s.lower() for s in current_skills]
        
        # Filter hot skills that aren't already known
        relevant_trending = [
            skill for skill in self.market_trends["hot_skills_2024"]
            if skill.lower() not in current_lower
        ]
        
        # Add emerging technologies
        emerging = [
            skill for skill in self.market_trends["emerging_technologies"]
            if skill.lower() not in current_lower
        ]
        
        return relevant_trending + emerging
    
    def _prioritize_next_skills(
        self,
        current_skills: List[str],
        complementary: List[str],
        career_recs: Dict,
        trending: List[str]
    ) -> List[Dict]:
        """Prioritize which skills to learn next"""
        priority_skills = []
        current_lower = [s.lower() for s in current_skills]
        
        # Priority 1: Missing core skills for current role
        for skill in career_recs.get("missing_core_skills", []):
            if skill.lower() not in current_lower:
                priority_skills.append({
                    "skill": skill,
                    "priority": "critical",
                    "reason": "Required for current role",
                    "category": "career_essential"
                })
        
        # Priority 2: Missing recommended skills for next level
        for skill in career_recs.get("missing_recommended_skills", [])[:5]:
            if skill.lower() not in current_lower:
                priority_skills.append({
                    "skill": skill,
                    "priority": "high",
                    "reason": "Needed for career advancement",
                    "category": "career_growth"
                })
        
        # Priority 3: Trending skills that complement current stack
        for skill in trending[:5]:
            if skill.lower() not in current_lower and skill not in [s["skill"] for s in priority_skills]:
                priority_skills.append({
                    "skill": skill,
                    "priority": "medium",
                    "reason": "High market demand",
                    "category": "market_trend"
                })
        
        # Priority 4: Complementary skills
        for skill in complementary[:5]:
            if skill.lower() not in current_lower and skill not in [s["skill"] for s in priority_skills]:
                priority_skills.append({
                    "skill": skill,
                    "priority": "medium",
                    "reason": "Complements your current skills",
                    "category": "complementary"
                })
        
        return priority_skills
    
    def _generate_learning_path(
        self,
        current_skills: List[str],
        next_skills: List[Dict],
        target_role: str
    ) -> List[Dict]:
        """Generate a structured learning path"""
        learning_path = []
        
        # Group by priority and create phases
        critical_skills = [s for s in next_skills if s["priority"] == "critical"]
        high_priority = [s for s in next_skills if s["priority"] == "high"]
        medium_priority = [s for s in next_skills if s["priority"] == "medium"]
        
        if critical_skills:
            learning_path.append({
                "phase": 1,
                "title": "Foundation Building (1-3 months)",
                "skills": [s["skill"] for s in critical_skills],
                "focus": "Essential skills required for your current role",
                "estimated_duration": "1-3 months"
            })
        
        if high_priority:
            learning_path.append({
                "phase": 2,
                "title": "Career Advancement (3-6 months)",
                "skills": [s["skill"] for s in high_priority[:5]],
                "focus": "Skills for promotion to next level",
                "estimated_duration": "3-6 months"
            })
        
        if medium_priority:
            learning_path.append({
                "phase": 3,
                "title": "Market Competitiveness (6-12 months)",
                "skills": [s["skill"] for s in medium_priority[:5]],
                "focus": "Stay current with industry trends",
                "estimated_duration": "6-12 months"
            })
        
        return learning_path
    
    def _get_market_insights(self, current_skills: List[str], target_role: str) -> Dict:
        """Provide market insights based on skills and role"""
        insights = {
            "demand_level": "moderate",
            "salary_trend": "stable",
            "job_opportunities": "moderate",
            "competitiveness": "moderate"
        }
        
        if target_role and target_role in self.market_trends.get("industry_demand", {}):
            insights["demand_level"] = self.market_trends["industry_demand"][target_role]
        
        # Check if candidate has hot skills
        hot_skills_count = sum(
            1 for skill in current_skills
            if skill.lower() in [s.lower() for s in self.market_trends["hot_skills_2024"]]
        )
        
        if hot_skills_count >= 5:
            insights["competitiveness"] = "high"
            insights["job_opportunities"] = "excellent"
        elif hot_skills_count >= 3:
            insights["competitiveness"] = "good"
            insights["job_opportunities"] = "good"
        
        return insights
    
    def _infer_role(self, skills: List[str]) -> str:
        """Infer likely role from skill set"""
        skills_lower = [s.lower() for s in skills]
        
        role_indicators = {
            "Software Engineer": ["python", "java", "javascript", "git"],
            "Frontend Developer": ["react", "javascript", "html", "css"],
            "Backend Developer": ["python", "node.js", "sql", "api"],
            "Data Scientist": ["machine learning", "python", "pandas", "statistics"],
            "DevOps Engineer": ["docker", "kubernetes", "ci/cd", "aws"]
        }
        
        best_match = ("Software Engineer", 0)
        
        for role, indicators in role_indicators.items():
            match_count = sum(1 for ind in indicators if ind in skills_lower)
            if match_count > best_match[1]:
                best_match = (role, match_count)
        
        return best_match[0]


if __name__ == "__main__":
    # Test the recommendation engine
    engine = SkillRecommendationEngine()
    
    current_skills = ["Python", "JavaScript", "React", "SQL", "Git"]
    recommendations = engine.generate_recommendations(
        current_skills=current_skills,
        target_role="Senior Software Engineer",
        experience_years=3
    )
    
    print(json.dumps(recommendations, indent=2))
