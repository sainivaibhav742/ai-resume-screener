import sys
sys.path.append('ai-resume-screener/ml')
from job_predictor import JobPredictor
from sklearn.metrics import classification_report, accuracy_score
import numpy as np

def evaluate_job_predictor():
    """Evaluate the job predictor model"""
    predictor = JobPredictor()
    predictor.load_model('ai-resume-screener/ml/job_predictor_model.pkl')

    # Sample test data (different from training)
    test_data = [
        ("Full stack developer with React and Node.js", "Software Engineer"),
        ("Data analyst with SQL and Excel", "Data Scientist"),
        ("Marketing coordinator with social media experience", "Marketing Specialist"),
        ("DevOps engineer with Kubernetes", "DevOps Engineer"),
        ("HR specialist with recruitment", "HR Manager")
    ]

    X_test = [text for text, _ in test_data]
    y_true = [label for _, label in test_data]
    y_pred = [predictor.predict(text) for text in X_test]

    print("Job Predictor Evaluation:")
    print(f"Accuracy: {accuracy_score(y_true, y_pred)}")
    print(classification_report(y_true, y_pred))

if __name__ == "__main__":
    evaluate_job_predictor()
