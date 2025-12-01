# 🚀 AI Resume Screener - Smart Hiring OS

A comprehensive dual-sided AI-powered platform that serves both candidates and recruiters. Revolutionize hiring with intelligent resume building, advanced screening, and seamless job matching.

## 🌟 What Makes This Different?

This isn't just a resume screener or resume builder - it's a **complete hiring ecosystem** that bridges candidates and recruiters through unified AI intelligence.

### 🎯 The Innovation

- **Dual-Sided Platform**: Separate portals for candidates and recruiters, working in harmony
- **Unified AI Profile Format**: Standardized resume data that eliminates format chaos
- **Bidirectional Matching**: AI matches candidates to jobs AND jobs to candidates
- **Continuous Improvement**: Dynamic profiles that evolve, not static PDFs
- **Network Effects**: Better candidates → Better for recruiters → More jobs → Better for candidates

## 🎭 Two Portals, One Intelligence

### 👤 Candidate Portal - Build Your Career

**For Job Seekers**: Create, optimize, and get matched with perfect opportunities

#### Features
- **AI Resume Builder**: Create professional, ATS-optimized resumes with multiple templates
- **Smart Resume Scoring**: Get instant feedback and improvement suggestions
- **Skill Gap Analysis**: Discover what skills you need for your dream job
- **Job Matching Engine**: Find jobs that match your profile (with % compatibility)
- **Application Tracking**: Manage all your applications in one place
- **Cover Letter Generator**: AI-powered personalized cover letters
- **Progress Tracker**: See your profile improvement over time
- **ATS Optimization**: Ensure your resume passes automated screening systems

### 🏢 Recruiter Portal - Hire Smarter

**For Companies**: Screen, rank, and hire the best candidates faster

#### Features
- **Bulk Resume Screening**: Upload and analyze hundreds of resumes instantly
- **AI Candidate Ranking**: Automatic ranking by job fit with detailed breakdowns
- **Job Posting Management**: Create and manage all your job openings
- **Red Flag Detection**: Identify employment gaps, inconsistencies, and concerns
- **Format Normalization**: Convert any resume format to standardized data
- **Team Collaboration**: Work with your hiring team, add notes and feedback
- **Advanced Analytics**: Track hiring metrics, conversion rates, and time-to-hire
- **Candidate Pipeline**: Manage candidates through your hiring workflow

## ✨ Key Features

### 🤖 AI-Powered Intelligence
- **NVIDIA AI Integration**: Advanced NLP for content generation and optimization
- **Semantic Matching**: Goes beyond keywords to understand context and meaning
- **Job Role Prediction**: Automatically classify candidates by best-fit roles
- **Skill Extraction**: Intelligently identify technical and soft skills
- **Experience Analysis**: Calculate years of experience and relevance

### 📊 Smart Analytics
- **Match Scores**: Detailed breakdown of candidate-job compatibility
- **Skill Gap Reports**: See what's missing and get learning recommendations
- **Red Flag Alerts**: Automated detection of resume inconsistencies
- **Trend Analysis**: Track hiring trends and candidate quality over time
- **Success Metrics**: Measure hiring effectiveness and ROI

### 🛡️ Enterprise-Ready
- **Role-Based Access**: Separate permissions for candidates, recruiters, and admins
- **JWT Authentication**: Secure token-based authentication
- **GDPR Compliant**: Privacy-first data handling
- **Team Management**: Invite team members with custom permissions
- **Subscription Plans**: Flexible pricing for different business sizes

### 🎯 Advanced Matching
- **Multi-Factor Scoring**: Skills, experience, education, location, and more
- **Explainable AI**: Understand why candidates match (or don't)
- **Bidirectional Discovery**: Candidates find jobs, recruiters find candidates
- **Real-Time Updates**: Matches improve as profiles are updated

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.9+)
- **Database**: SQLAlchemy ORM with PostgreSQL/SQLite
- **Authentication**: JWT with bcrypt password hashing
- **AI/ML**: NVIDIA API, spaCy, SentenceTransformers, scikit-learn
- **APIs**: RESTful architecture with OpenAPI documentation

### Frontend
- **Framework**: Next.js 14 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **API Client**: Axios with interceptors
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React

### Development Tools
- **Version Control**: Git
- **Testing**: pytest
- **API Documentation**: FastAPI auto-generated docs
- **Code Quality**: ESLint, TypeScript

## 📁 Project Structure

```
ai-resume-screener/
├── venv/                      # Virtual environment (create this)
├── backend/                   # FastAPI backend
│   ├── main.py               # Main API application (port 8000)
│   ├── init_db.py            # Database initialization script
│   ├── database.py           # Database configuration
│   ├── models.py             # SQLAlchemy models (18 tables)
│   ├── schemas.py            # Pydantic schemas
│   ├── auth.py               # JWT authentication
│   ├── ai_resume_screener.db # SQLite database
│   ├── routers/              # API route modules
│   │   ├── auth_routes.py
│   │   ├── candidate_routes.py
│   │   └── recruiter_routes.py
│   └── tests/                # Unit tests
│       └── test_main.py
├── frontend/                 # Next.js 16 frontend
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   │   ├── layout.tsx   # Root layout with Footer
│   │   │   ├── page.tsx     # Homepage (warm theme)
│   │   │   ├── candidate/   # Candidate portal
│   │   │   │   └── page.tsx
│   │   │   └── recruiter/   # Recruiter portal
│   │   │       └── page.tsx
│   │   └── components/      # React components
│   │       ├── ResumeUploader.tsx
│   │       ├── ResumeMakerForm.tsx
│   │       ├── Footer.tsx   # Modern footer
│   │       ├── ChatAssistant.tsx
│   │       ├── ThemeToggle.tsx
│   │       └── ScrollToTop.tsx
│   ├── package.json
│   └── tailwind.config.js   # Warm color theme config
├── ml/                      # Machine learning models
│   ├── job_predictor.py    # Job role classification
│   ├── train_models.py     # Model training scripts
│   └── job_predictor_model.pkl # Trained model
├── .env                     # Environment variables (optional)
├── .env.example             # Environment template
├── ARCHITECTURE.md          # System architecture docs
├── plan.md                  # Implementation plan
├── todo.md                  # Detailed TODO list
├── README.md                # This file
└── requirements.txt         # Python dependencies
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+** (Recommended: Python 3.13.9)
- **Node.js 18+** with npm
- **Git** for version control

### 📦 Installation & Setup

Follow these steps carefully to run the project in a virtual environment:

#### Step 1: Clone the Repository
```bash
git clone https://github.com/sainivaibhav742/ai-resume-screener.git
cd ai-resume-screener
```

#### Step 2: Backend Setup with Virtual Environment

```bash
# Create a virtual environment in the project root
python -m venv venv

# Activate the virtual environment
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On Windows (CMD):
venv\Scripts\activate.bat
# On macOS/Linux:
source venv/bin/activate

# Install all Python dependencies
pip install -r requirements.txt

# Install additional required packages
pip install email-validator

# Download spaCy language model (if needed)
python -m spacy download en_core_web_sm
```

#### Step 3: Initialize the Database

```bash
# Navigate to backend directory (keep venv activated)
cd backend

# Initialize the database with all tables
python init_db.py

# The database file will be created at: backend/ai_resume_screener.db
```

#### Step 4: Start the Backend Server

```bash
# Make sure you're in the backend directory with venv activated
python main.py

# Backend will start on: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

#### Step 5: Frontend Setup (New Terminal)

```bash
# Open a NEW terminal window
# Navigate to frontend directory
cd ai-resume-screener/frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev

# Frontend will start on: http://localhost:3000
```

### ✅ Running the Application

### 🔧 Troubleshooting

#### Virtual Environment Issues
```bash
# If virtual environment doesn't activate on Windows:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try activating again:
.\venv\Scripts\Activate.ps1

# Verify activation (you should see (venv) in your prompt)
```

#### Backend Issues
- **"Module not found" errors**: 
  ```bash
  # Ensure venv is activated and reinstall
  pip install -r requirements.txt
  pip install email-validator
  ```
- **Port 8000 already in use**:
  ```bash
  # Kill the process using the port
  # Windows:
  netstat -ano | findstr :8000
  taskkill /PID <PID> /F
  ```
- **Database errors**: Delete `backend/ai_resume_screener.db` and run `python init_db.py` again

#### Frontend Issues
- **Port 3000 conflict**: Next.js will automatically try port 3001, 3002, etc.
- **Build errors**: 
### 🔧 Configuration

#### Environment Variables (Optional)

Create a `.env` file in the project root if you need custom configuration:

```env
# Database Configuration (default: SQLite)
DATABASE_URL=sqlite:///./ai_resume_screener.db

# Server Configuration
HOST=127.0.0.1
PORT=8000

# JWT Secret (for production)
SECRET_KEY=your-secret-key-here

# API Keys (if using external services)
NVIDIA_API_KEY=your_nvidia_api_key_here
```

#### Model Training (Optional)

The project includes pre-trained models. To retrain:

```bash
# With venv activated
cd ml
python train_models.py
```*Model loading errors**: Ensure the ML model files are present in the `ml/` directory

### 🔧 Configuration

#### Environment Variables

Create a `.env` file in the backend directory:

```env
# NVIDIA API Configuration
# Get your API key from: https://ngc.nvidia.com/setup/api-key
NVIDIA_API_KEY=your_nvidia_api_key_here

# Optional: Database Configuration (for production)
DATABASE_URL=postgresql://user:password@localhost:5432/resume_screener

# Optional: Server Configuration
HOST=127.0.0.1
PORT=8001
```

#### Model Training (Optional)

To retrain the job prediction model:

```bash
cd ml
python train_models.py
```

## 🎮 Usage Guide

### Basic Resume Screening

1. **Access the Application**: Open `http://localhost:3000` in your browser
2. **Upload Resume**: Click "Screen Resume" and upload a PDF or DOCX file
3. **Enter Job Description**: Paste the job requirements in the text area
4. **Optional**: Associate with a job posting ID for organized tracking
5. **Analyze**: Click "Analyze with AI" to get comprehensive results

### Using the AI Chat Assistant

- **Access**: Click the chat bubble in the bottom-right corner
- **Ask Questions**: Get help with HR best practices, resume screening tips, or system usage
- **Examples**:
  - "How should I evaluate a candidate's experience?"
  - "What are good interview questions for a software engineer?"
  - "How does the fit score work?"

### Job Posting Management

1. **Create Job Posting**: Click "Create Job Posting" from the resume uploader
2. **Fill Details**: Enter job title, description, and requirements
3. **Get Job ID**: Use the returned ID when screening resumes for that position
4. **Track Applications**: View analytics in the dashboard

### Dashboard Analytics

- **View Metrics**: Total resumes processed, average fit scores, top skills
- **Track Activity**: Monitor screening activity over time
- **Role Distribution**: See predicted job roles for candidates
- **Score Distribution**: Analyze fit score ranges

## 🔌 API Documentation

### Core Endpoints

#### POST `/screen-resume`
Screen a resume against a job description.

**Request:**
```json
{
  "file": "resume.pdf",
  "job_description": "Job requirements text...",
  "job_id": "optional-job-id"
}
```

**Response:**
```json
{
  "resume_data": {...},
  "predicted_role": "Software Engineer",
  "skill_gap": {...},
  "ats_optimization": {...},
  "language_tone": {...},
  "bias_detection": {...},
  "fit_score": 85.5,
  "recommendation": "Strong match",
  "ai_summary": "Professional summary...",
  "ai_analysis": "Detailed analysis..."
}
```

#### POST `/chat-assistant`
Get AI assistance for HR queries.

#### GET `/dashboard-stats`
Retrieve dashboard analytics.

#### POST `/create-job-posting`
Create a new job posting.

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Manual Testing
1. Upload the provided `test_resume.pdf`
2. Use sample job descriptions
3. Verify AI analysis and chat functionality
4. Check dashboard data updates

## 🚀 Deployment

### Development Deployment
- **Backend**: Runs on `http://127.0.0.1:8001`
- **Frontend**: Runs on `http://localhost:3000`
- **CORS**: Configured for local development

### Production Deployment Options

#### Option 1: Render.com
1. Connect GitHub repository
2. Set environment variables
3. Deploy backend as web service
4. Deploy frontend as static site

#### Option 2: AWS
1. **Backend**: Deploy to Elastic Beanstalk or ECS
2. **Frontend**: Deploy to Amplify or S3 + CloudFront
3. **Database**: Use RDS PostgreSQL
4. **AI Models**: Store in S3 or EFS

#### Option 3: Docker
```dockerfile
# Backend Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8001
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use TypeScript for frontend components
- Write tests for new features
- Update documentation for API changes

## 📊 Performance & Limitations

### Current Performance
- **Resume Processing**: ~2-5 seconds per resume
- **AI Analysis**: ~3-8 seconds (depends on NVIDIA API response)
- **Concurrent Users**: Supports multiple simultaneous screenings

### Known Limitations
- In-memory data storage (resets on server restart)
- NVIDIA API rate limits apply
- Large PDF files may take longer to process
- Model accuracy depends on training data quality

## 🔒 Security & Privacy

### Data Protection
- **Anonymization**: Personal data is hashed and anonymized
- **Encryption**: Sensitive data encrypted at rest
- **Retention**: Configurable data retention policies
- **Access Control**: API endpoints secured with proper validation

### Compliance
- **GDPR**: Right to erasure, data portability, consent management
- **Data Minimization**: Only collect necessary information
- **Bias Mitigation**: Automated bias detection and reporting

## 📈 Roadmap

### Current Status
✅ **All Core Features Implemented**
- NVIDIA AI integration for intelligent summarization
- Interactive chatbot assistant powered by Llama 3.1
- Complete HR dashboard with real-time analytics
- Job posting management system
- Advanced resume analysis with multiple AI models
- GDPR-compliant data handling and privacy protection
- Modern, responsive web interface

### Future Roadmap
- Multi-language resume support
- Advanced ML model fine-tuning
- Integration with popular ATS platforms
- Mobile application for on-the-go screening
- Advanced analytics and predictive insights
- Bulk processing optimization
- Custom scoring algorithms
- Integration with job boards and LinkedIn

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/sainivaibhav742/ai-resume-screener/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sainivaibhav742/ai-resume-screener/discussions)
- **Email**: For support or inquiries

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NVIDIA**: For providing powerful AI models and API access
- **spaCy**: For excellent NLP processing capabilities
- **FastAPI**: For the robust API framework
- **Next.js**: For the modern React framework
- **Open Source Community**: For the amazing tools and libraries

---

**Built with ❤️ using cutting-edge AI technology**
