# AI Resume Screener Project TODO

This TODO list outlines the phased plan for building the AI Resume Screener using NLP. Each phase is broken into logical steps. Check off items as they are completed.

## Phase 1: Project Setup and Core Infrastructure (Foundation Phase)
- [x] Create project directory (ai-resume-screener)
- [x] Initialize Git repository
- [x] Set up folder structure (frontend, backend, ml, docs)
- [x] Choose and configure tech stack (Backend: FastAPI, Frontend: Next.js, NLP: spaCy, DB: PostgreSQL)
- [x] Install initial dependencies (Python venv, Node.js, etc.)
- [x] Create basic project documentation (README.md, architecture diagram)

## Phase 2: MVP Core Features Development (Core Functionality Phase)
- [x] Implement resume parsing (extract data from PDFs/DOCs using PyMuPDF, pdfminer.six)
- [x] Add keyword matching against job descriptions
- [x] Develop experience and education analysis
- [x] Integrate skill extraction and categorization
- [x] Create resume scoring (0-100 fit score)
- [x] Build simple CLI or basic web interface for upload and scoring
- [x] Add unit tests for parsing and scoring logic
  - [x] Install pytest
  - [x] Create backend/tests/test_main.py
  - [x] Write tests for parse_resume function
  - [x] Write tests for calculate_fit_score function
  - [x] Run tests and ensure they pass

## Phase 3: AI/ML Enhancements Integration (Intelligence Phase)
- [x] Integrate semantic similarity scoring (SentenceTransformers)
- [x] Add job role prediction (classification model)
  - [x] Install scikit-learn
  - [x] Create ml/job_predictor.py with sklearn classifier
  - [x] Train model on sample data
  - [x] Integrate into backend/main.py
- [x] Implement skill gap analysis
  - [x] Compare required skills from job desc to extracted skills
  - [x] Add gap analysis to calculate_fit_score
- [x] Add ATS optimization check
  - [x] Check for keywords, format issues in resume
  - [x] Add ATS score to response
- [x] Incorporate language/tone evaluation and bias detection
  - [x] Use spaCy for sentiment analysis
  - [x] Detect biased language
  - [x] Add to scoring
- [x] Refine scoring with ML models
- [x] Add model training scripts and evaluation
  - [x] Create ml/train_models.py
  - [x] Add evaluation metrics

## Phase 4: HR-Facing Features and Dashboard (User Experience Phase)
- [ ] Develop job posting input functionality
- [ ] Create candidate ranking system
- [ ] Build detailed candidate reports
- [ ] Implement bulk resume upload
- [ ] Add dashboard with visualizations (charts)
- [ ] Implement user authentication and data storage
- [ ] Ensure privacy/security (encryption, GDPR)

## Phase 5: Advanced Ideas and Deployment (Expansion Phase)
- [ ] Integrate LLMs (e.g., GPT-4 for summarization)
- [ ] Build chatbot assistant
- [ ] Optimize for deployment (AWS/Render hosting)
- [ ] Add monitoring, logging, performance optimizations
- [ ] Conduct thorough testing (unit, integration, load)
- [ ] Gather feedback and finalize documentation

## Overall
- [ ] Review and adjust plan based on progress
- [ ] Ensure all phases are completed and tested
