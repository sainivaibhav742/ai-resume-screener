# 🤖 AI Resume Screener

An advanced AI-powered resume screening platform that leverages cutting-edge NLP and machine learning to revolutionize HR recruitment processes. Built with NVIDIA AI integration for intelligent analysis and automated candidate evaluation.

## ✨ Key Features

### 🔍 Advanced Resume Analysis
- **Multi-format Support**: Parse resumes from PDF, DOCX, and text files
- **Intelligent Parsing**: Extract structured data including name, skills, experience, and education
- **AI-Powered Summarization**: NVIDIA Llama 3.1 generates concise, professional resume summaries

### 🎯 Smart Job Matching
- **Semantic Similarity**: Advanced NLP matching beyond simple keyword searches
- **Skill Gap Analysis**: Identify missing competencies and provide development recommendations
- **Fit Score Calculation**: Comprehensive scoring algorithm combining multiple factors

### 📊 HR Dashboard & Analytics
- **Real-time Analytics**: Track screening activities and performance metrics
- **Candidate Ranking**: Automated ranking system with detailed reports
- **Job Posting Management**: Create and manage job descriptions with ease

### 🛡️ Compliance & Security
- **GDPR Compliant**: Privacy-first data handling with data anonymization
- **Bias Detection**: Automated identification of potentially biased language
- **Secure Storage**: Encrypted data storage with configurable retention policies

### 🤖 AI Assistant
- **NVIDIA-Powered Chatbot**: Interactive HR assistant for guidance and best practices
- **Contextual Help**: Real-time assistance with resume screening and recruitment questions
- **Intelligent Recommendations**: AI-driven suggestions for hiring decisions

### ⚡ Performance Features
- **ATS Optimization Check**: Ensure resume compatibility with Applicant Tracking Systems
- **Language & Tone Analysis**: Evaluate communication style and professionalism
- **Bulk Processing Ready**: Framework for processing multiple resumes simultaneously

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.8+)
- **AI/ML**: NVIDIA API (Llama 3.1 8B), spaCy, SentenceTransformers, scikit-learn
- **Data Processing**: PyMuPDF, pdfminer.six
- **Database**: In-memory storage (production-ready for PostgreSQL/SQLAlchemy)

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
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
├── backend/                    # FastAPI backend
│   ├── main.py                # Main API application
│   └── tests/                 # Unit tests
│       └── test_main.py
├── frontend/                  # Next.js frontend
│   ├── src/
│   │   ├── app/              # Next.js app router
│   │   │   ├── layout.tsx    # Root layout with chat assistant
│   │   │   ├── page.tsx      # Landing page
│   │   │   └── job-posting/  # Job posting form
│   │   │       └── page.tsx
│   │   └── components/       # React components
│   │       ├── ResumeUploader.tsx
│   │       ├── Dashboard.tsx
│   │       ├── JobPostingForm.tsx
│   │       └── ChatAssistant.tsx
│   ├── package.json
│   └── tailwind.config.js
├── ml/                       # Machine learning models
│   ├── job_predictor.py     # Job role classification
│   ├── train_models.py      # Model training scripts
│   └── job_predictor_model.pkl # Trained model
├── docs/                    # Documentation
├── test_resume.pdf         # Sample resume for testing
├── README.md               # This file
├── TODO.md                 # Development roadmap
└── requirements.txt       # Python dependencies
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** with pip
- **Node.js 18+** with npm
- **Git** for version control
- **NVIDIA API Key** (get from [NVIDIA NGC](https://ngc.nvidia.com/))

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/sainivaibhav742/ai-resume-screener.git
cd ai-resume-screener
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r ../requirements.txt

# Download spaCy language model
python -m spacy download en_core_web_sm

# Set NVIDIA API key (create .env file in project root)
# Copy the provided .env file and update with your NVIDIA API key
# Get your key from: https://ngc.nvidia.com/setup/api-key
```

#### 3. Machine Learning Model Setup

```bash
# Navigate to ml directory
cd ../ml

# Train the job prediction model (optional - pre-trained model included)
python train_models.py
```

#### 4. Frontend Setup

```bash
# Open new terminal and navigate to frontend directory
cd ../frontend

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

#### 5. Start Backend Server

```bash
# In backend terminal (with virtual environment activated)
cd ../backend
python main.py
```

### Running the Application

Once all components are set up:

1. **Backend API** will be running on `http://127.0.0.1:8001`
2. **Frontend Application** will be running on `http://localhost:3000`
3. **API Documentation** available at `http://127.0.0.1:8001/docs`

### Testing the Setup

1. Open `http://localhost:3000` in your browser
2. Upload the provided `test_resume.pdf` file
3. Enter a sample job description (e.g., "Software Engineer with Python experience")
4. Click "Analyze with AI" to test the resume screening functionality
5. Try the AI Chat Assistant in the bottom-right corner
6. Check the Dashboard for analytics

### Troubleshooting

- **Backend won't start**: Ensure virtual environment is activated and all dependencies are installed
- **Frontend won't load**: Check that `npm install` completed successfully and no port conflicts
- **API calls fail**: Verify NVIDIA API key is set correctly in `.env` file
- **Model loading errors**: Ensure the ML model files are present in the `ml/` directory

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
