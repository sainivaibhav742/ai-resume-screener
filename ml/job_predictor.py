from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib
import os

class JobPredictor:
    def __init__(self):
        self.model = None
        self.pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=1000, stop_words='english')),
            ('clf', LogisticRegression(random_state=42))
        ])

    def train(self, X_train, y_train):
        """Train the job role prediction model"""
        self.pipeline.fit(X_train, y_train)
        self.model = self.pipeline

    def predict(self, resume_text):
        """Predict job role from resume text"""
        if self.model is None:
            raise ValueError("Model not trained yet")
        return self.pipeline.predict([resume_text])[0]

    def save_model(self, path='ml/job_predictor_model.pkl'):
        """Save the trained model"""
        if self.model is None:
            raise ValueError("Model not trained yet")
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump(self.pipeline, path)

    def load_model(self, path='ml/job_predictor_model.pkl'):
        """Load a trained model"""
        if os.path.exists(path):
            self.pipeline = joblib.load(path)
            self.model = self.pipeline
        else:
            raise FileNotFoundError(f"Model file not found at {path}")

# Sample training data (in a real scenario, use a larger dataset)
sample_data = [
    ("Python developer with experience in Django and Flask", "Software Engineer"),
    ("Data scientist skilled in machine learning and statistics", "Data Scientist"),
    ("Project manager with Agile and Scrum experience", "Project Manager"),
    ("UI/UX designer with Figma and Adobe tools", "Designer"),
    ("DevOps engineer with AWS and Docker", "DevOps Engineer"),
    ("Marketing specialist with SEO and content creation", "Marketing Specialist"),
    ("Sales representative with CRM experience", "Sales Representative"),
    ("HR manager with recruitment and employee relations", "HR Manager"),
    ("Financial analyst with Excel and forecasting", "Financial Analyst"),
    ("Teacher with classroom management skills", "Teacher")
]

if __name__ == "__main__":
    predictor = JobPredictor()
    X = [text for text, _ in sample_data]
    y = [label for _, label in sample_data]
    predictor.train(X, y)
    predictor.save_model('ai-resume-screener/ml/job_predictor_model.pkl')
    print("Model trained and saved.")
