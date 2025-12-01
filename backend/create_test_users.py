"""
Create test users for the application
Creates candidate, recruiter, and admin users with simple passwords
"""

import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User, UserRole
import bcrypt

# Database setup
DATABASE_URL = "sqlite:///./ai_resume_screener.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

# Fix the enum values to match the model
UserRole.candidate = UserRole.CANDIDATE
UserRole.recruiter = UserRole.RECRUITER
UserRole.admin = UserRole.ADMIN

def create_test_users():
    """Create three test users: candidate, recruiter, and admin"""
    db = SessionLocal()
    
    try:
        # Test users data
        test_users = [
            {
                "email": "candidate@gmail.com",
                "password": "1234",
                "role": UserRole.CANDIDATE,
                "full_name": "Test Candidate",
                "is_active": True
            },
            {
                "email": "recruiter@gmail.com",
                "password": "1234",
                "role": UserRole.RECRUITER,
                "company_name": "Test Company",
                "is_active": True
            },
            {
                "email": "admin@gmail.com",
                "password": "1234",
                "role": UserRole.ADMIN,
                "full_name": "System Admin",
                "is_active": True
            }
        ]
        
        for user_data in test_users:
            # Check if user already exists
            existing_user = db.query(User).filter(User.email == user_data["email"]).first()
            
            if existing_user:
                print(f"User {user_data['email']} already exists. Updating password and details...")
                existing_user.hashed_password = hash_password(user_data["password"])
                existing_user.role = user_data["role"]
                existing_user.is_active = user_data["is_active"]
                
                db.commit()
                print(f"✓ Updated {user_data['email']} ({user_data['role'].value})")
            else:
                # Create new user
                new_user = User(
                    email=user_data["email"],
                    hashed_password=hash_password(user_data["password"]),
                    role=user_data["role"],
                    is_active=user_data["is_active"]
                )
                
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
                print(f"✓ Created {user_data['email']} ({user_data['role'].value}) - User ID: {new_user.id}")
        
        print("\n" + "="*60)
        print("Test users created successfully!")
        print("="*60)
        print("\nLogin credentials:")
        print("\nCandidate:")
        print("  Email: candidate@gmail.com")
        print("  Password: 1234")
        print("\nRecruiter:")
        print("  Email: recruiter@gmail.com")
        print("  Password: 1234")
        print("\nAdmin:")
        print("  Email: admin@gmail.com")
        print("  Password: 1234")
        print("="*60)
        
    except Exception as e:
        print(f"Error creating test users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_users()
