"""
ML Model Training Pipeline
Automated training, versioning, and monitoring for ML models
"""

import os
import json
import joblib
import shutil
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Any
from pathlib import Path
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import hashlib


class ModelVersion:
    """Represents a specific version of a trained model"""
    
    def __init__(
        self,
        model_name: str,
        version: str,
        model_path: str,
        metadata: Dict
    ):
        self.model_name = model_name
        self.version = version
        self.model_path = model_path
        self.metadata = metadata
        self.created_at = datetime.utcnow()
    
    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        return {
            "model_name": self.model_name,
            "version": self.version,
            "model_path": self.model_path,
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat()
        }


class ModelRegistry:
    """Registry for managing model versions"""
    
    def __init__(self, registry_dir: str = "ml/models"):
        """
        Initialize model registry
        
        Args:
            registry_dir: Directory to store models and metadata
        """
        self.registry_dir = Path(registry_dir)
        self.registry_dir.mkdir(parents=True, exist_ok=True)
        self.metadata_file = self.registry_dir / "registry.json"
        self._load_registry()
    
    def _load_registry(self) -> None:
        """Load registry metadata"""
        if self.metadata_file.exists():
            with open(self.metadata_file, 'r') as f:
                self.registry = json.load(f)
        else:
            self.registry = {}
    
    def _save_registry(self) -> None:
        """Save registry metadata"""
        with open(self.metadata_file, 'w') as f:
            json.dump(self.registry, f, indent=2)
    
    def register_model(
        self,
        model_name: str,
        model_obj: Any,
        metrics: Dict,
        metadata: Dict = None
    ) -> str:
        """
        Register a new model version
        
        Args:
            model_name: Name of the model
            model_obj: Trained model object
            metrics: Model performance metrics
            metadata: Additional metadata
            
        Returns:
            Version string
        """
        # Generate version based on timestamp
        version = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        
        # Create model directory
        model_dir = self.registry_dir / model_name / version
        model_dir.mkdir(parents=True, exist_ok=True)
        
        # Save model
        model_path = model_dir / "model.pkl"
        joblib.dump(model_obj, model_path)
        
        # Prepare full metadata
        full_metadata = {
            "metrics": metrics,
            "created_at": datetime.utcnow().isoformat(),
            "model_path": str(model_path),
            **(metadata or {})
        }
        
        # Save metadata
        metadata_path = model_dir / "metadata.json"
        with open(metadata_path, 'w') as f:
            json.dump(full_metadata, f, indent=2)
        
        # Update registry
        if model_name not in self.registry:
            self.registry[model_name] = {
                "versions": [],
                "latest": None,
                "production": None
            }
        
        self.registry[model_name]["versions"].append({
            "version": version,
            "path": str(model_path),
            "metrics": metrics,
            "created_at": full_metadata["created_at"]
        })
        
        # Set as latest
        self.registry[model_name]["latest"] = version
        
        self._save_registry()
        
        return version
    
    def get_model(self, model_name: str, version: str = "latest") -> Optional[Any]:
        """
        Load a specific model version
        
        Args:
            model_name: Name of the model
            version: Version string or 'latest' or 'production'
            
        Returns:
            Loaded model object
        """
        if model_name not in self.registry:
            return None
        
        # Resolve version
        if version == "latest":
            version = self.registry[model_name]["latest"]
        elif version == "production":
            version = self.registry[model_name]["production"]
        
        if not version:
            return None
        
        # Find version info
        version_info = next(
            (v for v in self.registry[model_name]["versions"] if v["version"] == version),
            None
        )
        
        if not version_info:
            return None
        
        # Load model
        return joblib.load(version_info["path"])
    
    def promote_to_production(self, model_name: str, version: str) -> bool:
        """
        Promote a model version to production
        
        Args:
            model_name: Name of the model
            version: Version to promote
            
        Returns:
            True if successful
        """
        if model_name not in self.registry:
            return False
        
        # Verify version exists
        version_exists = any(
            v["version"] == version
            for v in self.registry[model_name]["versions"]
        )
        
        if not version_exists:
            return False
        
        self.registry[model_name]["production"] = version
        self._save_registry()
        
        return True
    
    def list_versions(self, model_name: str) -> List[Dict]:
        """List all versions of a model"""
        if model_name not in self.registry:
            return []
        
        return self.registry[model_name]["versions"]
    
    def get_metrics(self, model_name: str, version: str = "latest") -> Optional[Dict]:
        """Get metrics for a specific model version"""
        if model_name not in self.registry:
            return None
        
        # Resolve version
        if version == "latest":
            version = self.registry[model_name]["latest"]
        elif version == "production":
            version = self.registry[model_name]["production"]
        
        # Find version
        version_info = next(
            (v for v in self.registry[model_name]["versions"] if v["version"] == version),
            None
        )
        
        return version_info["metrics"] if version_info else None
    
    def compare_versions(self, model_name: str, versions: List[str]) -> Dict:
        """Compare metrics across multiple versions"""
        if model_name not in self.registry:
            return {}
        
        comparison = {}
        for version in versions:
            metrics = self.get_metrics(model_name, version)
            if metrics:
                comparison[version] = metrics
        
        return comparison
    
    def cleanup_old_versions(self, model_name: str, keep_last: int = 5) -> int:
        """
        Remove old model versions, keeping only the most recent
        
        Args:
            model_name: Name of the model
            keep_last: Number of recent versions to keep
            
        Returns:
            Number of versions removed
        """
        if model_name not in self.registry:
            return 0
        
        versions = self.registry[model_name]["versions"]
        
        if len(versions) <= keep_last:
            return 0
        
        # Sort by created_at
        sorted_versions = sorted(
            versions,
            key=lambda v: v["created_at"],
            reverse=True
        )
        
        # Keep recent versions and production
        production = self.registry[model_name].get("production")
        versions_to_keep = set()
        
        # Keep most recent
        for v in sorted_versions[:keep_last]:
            versions_to_keep.add(v["version"])
        
        # Always keep production
        if production:
            versions_to_keep.add(production)
        
        # Remove old versions
        removed_count = 0
        for version_info in versions:
            if version_info["version"] not in versions_to_keep:
                # Delete files
                model_path = Path(version_info["path"])
                if model_path.exists():
                    shutil.rmtree(model_path.parent)
                removed_count += 1
        
        # Update registry
        self.registry[model_name]["versions"] = [
            v for v in versions
            if v["version"] in versions_to_keep
        ]
        
        self._save_registry()
        
        return removed_count


class ModelTrainer:
    """Automated model training with evaluation and monitoring"""
    
    def __init__(self, registry: ModelRegistry):
        """
        Initialize model trainer
        
        Args:
            registry: Model registry instance
        """
        self.registry = registry
        self.training_history = []
    
    def train_and_evaluate(
        self,
        model_name: str,
        model_obj: Any,
        X: np.ndarray,
        y: np.ndarray,
        test_size: float = 0.2,
        cv_folds: int = 5
    ) -> Dict:
        """
        Train model with cross-validation and evaluation
        
        Args:
            model_name: Name of the model
            model_obj: Model object to train
            X: Feature matrix
            y: Target labels
            test_size: Test set size
            cv_folds: Number of cross-validation folds
            
        Returns:
            Training results with metrics
        """
        training_start = datetime.utcnow()
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, stratify=y
        )
        
        # Train model
        model_obj.fit(X_train, y_train)
        
        # Evaluate on test set
        y_pred = model_obj.predict(X_test)
        
        test_metrics = {
            "accuracy": float(accuracy_score(y_test, y_pred)),
            "precision": float(precision_score(y_test, y_pred, average='weighted', zero_division=0)),
            "recall": float(recall_score(y_test, y_pred, average='weighted', zero_division=0)),
            "f1_score": float(f1_score(y_test, y_pred, average='weighted', zero_division=0))
        }
        
        # Cross-validation
        cv_scores = cross_val_score(
            model_obj, X_train, y_train, cv=cv_folds, scoring='accuracy'
        )
        
        cv_metrics = {
            "cv_mean": float(np.mean(cv_scores)),
            "cv_std": float(np.std(cv_scores)),
            "cv_scores": [float(s) for s in cv_scores]
        }
        
        training_end = datetime.utcnow()
        training_time = (training_end - training_start).total_seconds()
        
        # Combine metrics
        all_metrics = {
            **test_metrics,
            **cv_metrics,
            "training_time_seconds": training_time,
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "features": X.shape[1] if len(X.shape) > 1 else 1
        }
        
        # Register model
        version = self.registry.register_model(
            model_name=model_name,
            model_obj=model_obj,
            metrics=all_metrics,
            metadata={
                "training_start": training_start.isoformat(),
                "training_end": training_end.isoformat()
            }
        )
        
        # Record in history
        self.training_history.append({
            "model_name": model_name,
            "version": version,
            "metrics": all_metrics,
            "timestamp": training_end.isoformat()
        })
        
        return {
            "model_name": model_name,
            "version": version,
            "metrics": all_metrics,
            "success": True
        }
    
    def auto_retrain_if_needed(
        self,
        model_name: str,
        model_obj: Any,
        X: np.ndarray,
        y: np.ndarray,
        performance_threshold: float = 0.8
    ) -> Dict:
        """
        Automatically retrain model if performance drops below threshold
        
        Args:
            model_name: Name of the model
            model_obj: Model object
            X: Feature matrix
            y: Target labels
            performance_threshold: Minimum acceptable accuracy
            
        Returns:
            Retraining results
        """
        # Get current production model metrics
        current_metrics = self.registry.get_metrics(model_name, "production")
        
        should_retrain = False
        reason = ""
        
        if not current_metrics:
            should_retrain = True
            reason = "No production model exists"
        elif current_metrics.get("accuracy", 0) < performance_threshold:
            should_retrain = True
            reason = f"Current accuracy {current_metrics['accuracy']:.3f} below threshold {performance_threshold}"
        
        if should_retrain:
            print(f"Retraining triggered: {reason}")
            result = self.train_and_evaluate(model_name, model_obj, X, y)
            
            # Promote to production if better than threshold
            if result["metrics"]["accuracy"] >= performance_threshold:
                self.registry.promote_to_production(model_name, result["version"])
                result["promoted_to_production"] = True
            
            result["retrain_reason"] = reason
            return result
        
        return {
            "model_name": model_name,
            "retrained": False,
            "reason": "Model performance is acceptable",
            "current_metrics": current_metrics
        }
    
    def get_training_history(self, model_name: Optional[str] = None) -> List[Dict]:
        """Get training history for all models or specific model"""
        if model_name:
            return [
                h for h in self.training_history
                if h["model_name"] == model_name
            ]
        return self.training_history


class ModelMonitor:
    """Monitor model performance in production"""
    
    def __init__(self):
        self.predictions_log = []
        self.performance_alerts = []
    
    def log_prediction(
        self,
        model_name: str,
        model_version: str,
        input_data: Any,
        prediction: Any,
        actual: Any = None,
        confidence: float = None
    ) -> None:
        """Log a model prediction for monitoring"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "model_name": model_name,
            "model_version": model_version,
            "prediction": prediction,
            "actual": actual,
            "confidence": confidence,
            "correct": prediction == actual if actual is not None else None
        }
        
        self.predictions_log.append(log_entry)
    
    def get_recent_performance(
        self,
        model_name: str,
        hours: int = 24
    ) -> Dict:
        """Get recent performance metrics"""
        cutoff_time = datetime.utcnow().timestamp() - (hours * 3600)
        
        recent_logs = [
            log for log in self.predictions_log
            if log["model_name"] == model_name and
            datetime.fromisoformat(log["timestamp"]).timestamp() > cutoff_time
        ]
        
        if not recent_logs:
            return {"error": "No recent predictions found"}
        
        # Calculate metrics
        total = len(recent_logs)
        with_actual = [log for log in recent_logs if log["actual"] is not None]
        correct = [log for log in with_actual if log["correct"]]
        
        return {
            "model_name": model_name,
            "time_period_hours": hours,
            "total_predictions": total,
            "predictions_with_feedback": len(with_actual),
            "accuracy": len(correct) / len(with_actual) if with_actual else None,
            "average_confidence": np.mean([
                log["confidence"] for log in recent_logs
                if log["confidence"] is not None
            ]) if any(log["confidence"] is not None for log in recent_logs) else None
        }
    
    def check_for_drift(
        self,
        model_name: str,
        threshold: float = 0.1
    ) -> Dict:
        """Check for model drift based on recent performance"""
        recent_perf = self.get_recent_performance(model_name, hours=24)
        
        if "accuracy" not in recent_perf or recent_perf["accuracy"] is None:
            return {"drift_detected": False, "reason": "Insufficient data"}
        
        # Compare with historical performance
        # This is simplified - in production, use more sophisticated drift detection
        drift_detected = False
        
        # Example: Check if accuracy dropped significantly
        if recent_perf["accuracy"] < (1 - threshold):
            drift_detected = True
        
        return {
            "drift_detected": drift_detected,
            "current_performance": recent_perf,
            "threshold": threshold
        }


# Example usage and utility functions

def create_training_pipeline(
    model_name: str,
    model_factory: callable,
    data_loader: callable
) -> Dict:
    """
    Create a complete training pipeline
    
    Args:
        model_name: Name of the model
        model_factory: Function that returns a new model instance
        data_loader: Function that returns (X, y) training data
        
    Returns:
        Training results
    """
    # Initialize components
    registry = ModelRegistry()
    trainer = ModelTrainer(registry)
    
    # Load data
    X, y = data_loader()
    
    # Create model
    model = model_factory()
    
    # Train and evaluate
    results = trainer.train_and_evaluate(model_name, model, X, y)
    
    # Promote to production if good enough
    if results["metrics"]["accuracy"] >= 0.8:
        registry.promote_to_production(model_name, results["version"])
        results["promoted_to_production"] = True
    
    return results


if __name__ == "__main__":
    # Example: Train a simple model
    from sklearn.linear_model import LogisticRegression
    from sklearn.datasets import make_classification
    
    # Create sample data
    X, y = make_classification(n_samples=1000, n_features=20, n_classes=3, random_state=42)
    
    # Initialize registry and trainer
    registry = ModelRegistry(registry_dir="ml/models_test")
    trainer = ModelTrainer(registry)
    
    # Train model
    model = LogisticRegression(max_iter=1000)
    results = trainer.train_and_evaluate("test_classifier", model, X, y)
    
    print("Training Results:")
    print(json.dumps(results, indent=2))
    
    # List versions
    print("\nModel Versions:")
    versions = registry.list_versions("test_classifier")
    for v in versions:
        print(f"  {v['version']}: accuracy={v['metrics']['accuracy']:.3f}")
    
    # Promote to production
    registry.promote_to_production("test_classifier", results["version"])
    print(f"\nPromoted version {results['version']} to production")
