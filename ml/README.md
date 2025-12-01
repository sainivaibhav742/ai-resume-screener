# ML/AI Module

## Overview
Production-ready machine learning and AI components for the AI Resume Screener platform. This module provides advanced resume parsing, semantic job matching, skill recommendations, ATS optimization, and model training pipelines.

## Components

### 1. Advanced Resume Parser (`resume_parser.py`)
Extracts structured information from resume text using NLP.

**Features:**
- Personal information extraction (name, email, phone, location, social links)
- Multi-category skill extraction across 7 categories
- Experience parsing with dates, companies, positions, responsibilities
- Education extraction with degrees, institutions, GPA
- Professional summary and keyword extraction
- Smart section detection

**Usage:**
```python
from ml.resume_parser import AdvancedResumeParser

parser = AdvancedResumeParser()
result = parser.parse(resume_text)

print(f"Name: {result['personal_info']['name']}")
print(f"Skills: {result['skills']['all_skills']}")
print(f"Experience: {len(result['experience'])} positions")
```

### 2. Semantic Matcher (`semantic_matcher.py`)
Matches resumes to job postings using semantic similarity and weighted scoring.

**Features:**
- SentenceTransformer embeddings for deep semantic understanding
- Weighted scoring algorithm (semantic 30%, skills 35%, experience 15%, education 10%, keywords 10%)
- Skill gap analysis with required/preferred differentiation
- Match level categorization and recommendations
- Batch matching for multiple jobs

**Usage:**
```python
from ml.semantic_matcher import SemanticMatcher

matcher = SemanticMatcher()
match_result = matcher.match(resume_data, job_data)

print(f"Match Score: {match_result['match_percentage']}%")
print(f"Skill Gaps: {match_result['skill_gaps']}")
```

### 3. Skill Recommender (`skill_recommender.py`)
Provides personalized skill recommendations based on career goals.

**Features:**
- Comprehensive skill taxonomy with 50+ skills
- Career progression paths for 6 major roles
- Market trend analysis with hot skills
- Priority-based learning paths
- Complementary skill suggestions
- Market demand insights

**Usage:**
```python
from ml.skill_recommender import SkillRecommendationEngine

engine = SkillRecommendationEngine()
recommendations = engine.generate_recommendations(
    current_skills=["Python", "JavaScript", "React"],
    target_role="Senior Software Engineer",
    experience_years=3
)

print(f"Next skills: {recommendations['next_skills_to_learn']}")
print(f"Learning path: {len(recommendations['learning_path'])} phases")
```

### 4. ATS Optimizer (`ats_optimizer.py`)
Analyzes resumes for ATS (Applicant Tracking System) compatibility.

**Features:**
- Format analysis (tables, images, special characters)
- Keyword optimization with density calculation
- Structure validation
- Content quality analysis
- A-F grading system
- Prioritized recommendations
- Auto-optimization suggestions

**Usage:**
```python
from ml.ats_optimizer import ATSOptimizer

optimizer = ATSOptimizer()
analysis = optimizer.analyze(resume_text, job_keywords)

print(f"ATS Score: {analysis['overall_score']}/100")
print(f"Grade: {analysis['grade']}")
print(f"Recommendations: {len(analysis['recommendations'])}")
```

### 5. Model Pipeline (`model_pipeline.py`)
Automated ML model training, versioning, and monitoring.

**Features:**
- Model registry with version management
- Automated training with cross-validation
- Performance metrics tracking
- Model promotion to production
- Version comparison
- Drift detection
- Auto-retraining

**Usage:**
```python
from ml.model_pipeline import ModelRegistry, ModelTrainer

registry = ModelRegistry()
trainer = ModelTrainer(registry)

results = trainer.train_and_evaluate(
    model_name="job_classifier",
    model_obj=model,
    X=X_train,
    y=y_train
)

print(f"Accuracy: {results['metrics']['accuracy']}")
registry.promote_to_production("job_classifier", results['version'])
```

### 6. Job Predictor (`job_predictor.py`)
Predicts suitable job roles from resume text.

**Features:**
- TF-IDF vectorization
- Logistic regression classifier
- Pre-trained on 40 diverse examples
- 10 job categories
- Confidence scoring

**Usage:**
```python
from ml.job_predictor import JobPredictor

predictor = JobPredictor()
predictor.load_model('ml/job_predictor_model.pkl')

predicted_role = predictor.predict(resume_text)
print(f"Predicted Role: {predicted_role}")
```

## Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Train initial models
cd ml
python job_predictor.py
python train_models.py
```

## Testing

Run comprehensive integration tests:

```bash
cd backend/tests
python test_ml_integration.py
```

Expected output:
- ✓ Advanced Resume Parser - Extracted 20+ skills
- ✓ Semantic Matcher - 85%+ match scores
- ✓ Skill Recommender - 10+ recommendations
- ✓ ATS Optimizer - Score: 75-95/100
- ✓ Performance Features - Caching, monitoring, rate limiting

## Performance

- **Resume Parsing**: <200ms per resume
- **Job Matching**: <150ms per match
- **Skill Recommendations**: <100ms per request
- **ATS Analysis**: <250ms per resume
- **Cache Hit Rate**: 70-90%
- **API Rate Limit**: 60 req/min (standard), 30 req/min (ML operations)

## Model Files

Models are stored in `ml/models/` directory:
- `job_predictor_model.pkl` - Pre-trained job role classifier
- `models/` - Model registry for versioned models

## API Integration

All components are integrated into the main FastAPI backend:

```python
# Import ML components
from ml.resume_parser import AdvancedResumeParser
from ml.semantic_matcher import SemanticMatcher
from ml.skill_recommender import SkillRecommendationEngine
from ml.ats_optimizer import ATSOptimizer

# Initialize
advanced_parser = AdvancedResumeParser()
semantic_matcher = SemanticMatcher()
skill_recommender = SkillRecommendationEngine()
ats_optimizer = ATSOptimizer()
```

## Endpoints

- `POST /api/ml/parse-resume-advanced` - Parse resume
- `POST /api/ml/match-job-resume` - Match job and resume
- `POST /api/ml/recommend-skills` - Get skill recommendations
- `POST /api/ml/ats-analyze` - Analyze ATS compatibility
- `POST /api/ml/ats-optimize` - Get optimization suggestions

## Architecture

```
ml/
├── __init__.py
├── resume_parser.py       (450 lines) - NLP resume parsing
├── semantic_matcher.py    (350 lines) - Job-resume matching
├── skill_recommender.py   (450 lines) - Skill recommendations
├── ats_optimizer.py       (500 lines) - ATS optimization
├── model_pipeline.py      (400 lines) - Model training pipeline
├── job_predictor.py       (100 lines) - Job role prediction
├── train_models.py        (50 lines)  - Model training script
└── models/                           - Model registry

backend/
├── performance.py         (600 lines) - Performance optimization
└── tests/
    └── test_ml_integration.py (300 lines) - Integration tests
```

## Dependencies

- **spaCy** (3.7.2) - NLP processing
- **sentence-transformers** (2.2.2) - Semantic embeddings
- **scikit-learn** (1.3.2) - ML algorithms
- **joblib** (1.3.2) - Model serialization
- **numpy** - Numerical operations

## Contributing

When adding new ML features:
1. Create comprehensive tests in `test_ml_integration.py`
2. Add performance monitoring with `@monitor_performance`
3. Implement caching where appropriate with `@cached`
4. Document API endpoints in main backend
5. Update this README

## License

Part of the AI Resume Screener project.
