"""
Integration Tests for ML/AI Features
Tests the new ML components and performance optimization
"""

import sys
import os

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, project_root)

from ml.resume_parser import AdvancedResumeParser
from ml.semantic_matcher import SemanticMatcher
from ml.skill_recommender import SkillRecommendationEngine
from ml.ats_optimizer import ATSOptimizer
from backend.performance import (
    cached, monitor_performance, rate_limit,
    cache_manager, performance_monitor, api_rate_limiter
)
import json


# Sample resume text for testing
SAMPLE_RESUME = """
John Doe
john.doe@email.com | (555) 123-4567 | San Francisco, CA
linkedin.com/in/johndoe | github.com/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years of expertise in full-stack development.
Proficient in Python, JavaScript, React, and cloud technologies. Strong problem-solving
skills and proven track record of delivering high-quality software solutions.

EXPERIENCE
Senior Software Engineer
Tech Corp | San Francisco, CA
2020 - Present
• Developed microservices architecture using Python and FastAPI
• Implemented CI/CD pipelines with Docker and Kubernetes
• Led team of 5 developers in agile environment
• Improved system performance by 40% through optimization
• Reduced deployment time by 60% with automated pipelines

Software Engineer
StartUp Inc | San Francisco, CA
2018 - 2020
• Built web applications using React and Node.js
• Optimized database queries in PostgreSQL, reducing load time by 30%
• Collaborated with cross-functional teams
• Implemented RESTful APIs serving 10,000+ daily requests

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley
2018
GPA: 3.8

SKILLS
Programming: Python, JavaScript, TypeScript, Java
Web: React, Node.js, FastAPI, Django, Express
Database: PostgreSQL, MongoDB, Redis
Cloud: AWS, Docker, Kubernetes, Terraform
Tools: Git, Jenkins, JIRA, Confluence
"""


def test_resume_parser():
    """Test advanced resume parser"""
    print("\n=== Testing Advanced Resume Parser ===")
    
    parser = AdvancedResumeParser()
    result = parser.parse(SAMPLE_RESUME)
    
    print("\nParsed Information:")
    print(f"Name: {result['personal_info']['name']}")
    print(f"Email: {result['personal_info']['email']}")
    print(f"Phone: {result['personal_info']['phone']}")
    print(f"Total Skills: {result['skills']['count']}")
    print(f"Skills: {', '.join(result['skills']['all_skills'][:10])}")
    print(f"Experience Entries: {len(result['experience'])}")
    print(f"Education Entries: {len(result['education'])}")
    
    assert result['personal_info']['name'] is not None
    assert result['personal_info']['email'] == "john.doe@email.com"
    assert result['skills']['count'] > 0
    assert len(result['experience']) > 0
    
    print("✓ Resume parser test passed!")
    return result


def test_semantic_matcher():
    """Test semantic job-resume matching"""
    print("\n=== Testing Semantic Matcher ===")
    
    # Get parsed resume
    parser = AdvancedResumeParser()
    resume_data = parser.parse(SAMPLE_RESUME)
    
    # Sample job data
    job_data = {
        "title": "Senior Full Stack Developer",
        "description": "Build modern web applications using React, Node.js, and cloud technologies",
        "requirements": "5+ years of experience in full-stack development with Python and JavaScript",
        "required_skills": ["Python", "JavaScript", "React", "Node.js", "PostgreSQL", "AWS"],
        "preferred_skills": ["Docker", "Kubernetes", "TypeScript", "CI/CD"],
        "required_experience_years": 5,
        "required_education": "Bachelor's degree in Computer Science"
    }
    
    matcher = SemanticMatcher()
    match_result = matcher.match(resume_data, job_data)
    
    print(f"\nMatch Score: {match_result['match_percentage']}%")
    print(f"Match Level: {match_result['match_level']}")
    print(f"Recommendation: {match_result['recommendation']}")
    print("\nScores Breakdown:")
    for key, value in match_result['scores_breakdown'].items():
        print(f"  {key}: {value:.2f}")
    
    print(f"\nSkill Gaps: {len(match_result['skill_gaps']['missing_required_skills'])} required, "
          f"{len(match_result['skill_gaps']['missing_preferred_skills'])} preferred")
    
    assert match_result['overall_score'] > 0
    assert match_result['match_percentage'] > 0
    
    print("✓ Semantic matcher test passed!")
    return match_result


def test_skill_recommender():
    """Test skill recommendation engine"""
    print("\n=== Testing Skill Recommender ===")
    
    engine = SkillRecommendationEngine()
    
    current_skills = ["Python", "JavaScript", "React", "SQL", "Git"]
    recommendations = engine.generate_recommendations(
        current_skills=current_skills,
        target_role="Senior Software Engineer",
        experience_years=3
    )
    
    print(f"\nCurrent Profile:")
    print(f"  Total Skills: {recommendations['current_profile']['total_skills']}")
    print(f"  Level: {recommendations['current_profile']['level']}")
    print(f"  Strengths: {', '.join(recommendations['current_profile']['strengths'])}")
    
    print(f"\nCareer Path:")
    print(f"  Current Role: {recommendations['career_path']['current_role']}")
    print(f"  Next Level: {recommendations['career_path']['next_level']}")
    print(f"  Core Completeness: {recommendations['career_path']['core_completeness']}%")
    print(f"  Ready for Promotion: {recommendations['career_path']['ready_for_promotion']}")
    
    print(f"\nTop 5 Skills to Learn:")
    for skill in recommendations['next_skills_to_learn'][:5]:
        print(f"  - {skill['skill']} ({skill['priority']}) - {skill['reason']}")
    
    print(f"\nLearning Path: {len(recommendations['learning_path'])} phases")
    
    assert len(recommendations['next_skills_to_learn']) > 0
    assert len(recommendations['learning_path']) > 0
    
    print("✓ Skill recommender test passed!")
    return recommendations


def test_ats_optimizer():
    """Test ATS optimizer"""
    print("\n=== Testing ATS Optimizer ===")
    
    optimizer = ATSOptimizer()
    
    job_keywords = ["Python", "React", "Docker", "AWS", "Kubernetes", "Leadership", "Agile"]
    analysis = optimizer.analyze(SAMPLE_RESUME, job_keywords)
    
    print(f"\nATS Score: {analysis['overall_score']}/100")
    print(f"Grade: {analysis['grade']}")
    print(f"ATS Friendly: {'Yes' if analysis['ats_friendly'] else 'No'}")
    print(f"Estimated Pass Rate: {analysis['estimated_pass_rate']}")
    
    print("\nBreakdown:")
    for category, data in analysis['breakdown'].items():
        print(f"  {category.capitalize()}: {data['score']}/100 {'✓' if data['passed'] else '✗'}")
    
    if analysis['critical_issues']:
        print(f"\nCritical Issues: {len(analysis['critical_issues'])}")
        for issue in analysis['critical_issues']:
            print(f"  ⚠ {issue}")
    
    print(f"\nTop Recommendations:")
    for rec in analysis['recommendations'][:3]:
        print(f"  {rec['priority'].upper()}: {rec['title']}")
    
    assert analysis['overall_score'] > 0
    assert 'A' <= analysis['grade'] <= 'F'
    
    print("✓ ATS optimizer test passed!")
    return analysis


def test_performance_features():
    """Test performance optimization features"""
    print("\n=== Testing Performance Features ===")
    
    # Test caching
    @cached(ttl=60)
    def expensive_function(x):
        return x ** 2
    
    import time
    start = time.time()
    result1 = expensive_function(10)
    time1 = time.time() - start
    
    start = time.time()
    result2 = expensive_function(10)  # Should be cached
    time2 = time.time() - start
    
    print(f"\nCache Test:")
    print(f"  First call: {time1*1000:.2f}ms")
    print(f"  Cached call: {time2*1000:.2f}ms")
    print(f"  Speedup: {time1/time2 if time2 > 0 else float('inf'):.1f}x")
    
    cache_stats = cache_manager.get_stats()
    print(f"\nCache Stats:")
    print(f"  Size: {cache_stats['size']}")
    print(f"  Hits: {cache_stats['hits']}")
    print(f"  Misses: {cache_stats['misses']}")
    print(f"  Hit Rate: {cache_stats['hit_rate']:.1f}%")
    
    # Test performance monitoring
    @monitor_performance
    def monitored_function(n):
        return sum(range(n))
    
    for _ in range(5):
        monitored_function(1000)
    
    metrics = performance_monitor.get_metrics("monitored_function")
    print(f"\nPerformance Monitoring:")
    print(f"  Calls: {metrics['calls']}")
    print(f"  Avg Time: {metrics['avg_time']*1000:.2f}ms")
    print(f"  Min Time: {metrics['min_time']*1000:.2f}ms")
    print(f"  Max Time: {metrics['max_time']*1000:.2f}ms")
    
    # Test rate limiting
    print(f"\nRate Limiting:")
    allowed_count = 0
    for i in range(65):  # Try to exceed 60 req/min limit
        if api_rate_limiter.is_allowed("test_user"):
            allowed_count += 1
    
    print(f"  Allowed: {allowed_count}/65 requests")
    print(f"  Rate limited: {65 - allowed_count} requests")
    
    rate_stats = api_rate_limiter.get_stats("test_user")
    print(f"  Remaining: {rate_stats['remaining']} requests")
    print(f"  Wait time: {rate_stats['wait_time']:.1f}s")
    
    print("✓ Performance features test passed!")


def run_all_tests():
    """Run all integration tests"""
    print("=" * 60)
    print("Running ML/AI Integration Tests")
    print("=" * 60)
    
    try:
        # Test each component
        parsed_resume = test_resume_parser()
        match_result = test_semantic_matcher()
        recommendations = test_skill_recommender()
        ats_analysis = test_ats_optimizer()
        test_performance_features()
        
        print("\n" + "=" * 60)
        print("All Tests Passed! ✓")
        print("=" * 60)
        
        # Summary
        print("\nTest Summary:")
        print(f"  ✓ Advanced Resume Parser - Extracted {parsed_resume['skills']['count']} skills")
        print(f"  ✓ Semantic Matcher - {match_result['match_percentage']}% match score")
        print(f"  ✓ Skill Recommender - {len(recommendations['next_skills_to_learn'])} recommendations")
        print(f"  ✓ ATS Optimizer - Score: {ats_analysis['overall_score']}/100")
        print(f"  ✓ Performance Features - Caching, monitoring, rate limiting")
        
        return True
        
    except Exception as e:
        print(f"\n✗ Test Failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
