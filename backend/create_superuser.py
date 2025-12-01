"""
Create superuser script for AI Resume Screener
Usage: python create_superuser.py
"""

import sys
import os
from sqlalchemy.orm import Session
from passlib.context import CryptContext

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
from models import User, UserRole

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)

def create_superuser(
    email: str = "user@gmail.com",
    password: str = "1234",
    role: UserRole = UserRole.ADMIN
):
    """Create a superuser account"""
    
    # Create all tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Create database session
    db: Session = SessionLocal()
    
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print(f"❌ User with email '{email}' already exists!")
            print(f"   ID: {existing_user.id}")
            print(f"   Role: {existing_user.role}")
            print(f"   Active: {existing_user.is_active}")
            
            # Update password if requested
            response = input("\nUpdate password? (y/n): ")
            if response.lower() == 'y':
                existing_user.hashed_password = hash_password(password)
                existing_user.role = role
                existing_user.is_active = True
                existing_user.is_verified = True
                db.commit()
                print(f"✅ Password updated for {email}")
            return
        
        # Create new superuser
        hashed_password = hash_password(password)
        
        new_user = User(
            email=email,
            hashed_password=hashed_password,
            role=role,
            is_active=True,
            is_verified=True
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print(f"\n✅ Superuser created successfully!")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        print(f"   Role: {role.value}")
        print(f"   User ID: {new_user.id}")
        print(f"\n⚠️  Please change the password after first login!")
        
    except Exception as e:
        print(f"❌ Error creating superuser: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 50)
    print("AI Resume Screener - Create Superuser")
    print("=" * 50)
    
    # Default values
    email = "user@gmail.com"
    password = "1234"
    
    # Allow custom input
    custom = input(f"\nUse default credentials (user@gmail.com / 1234)? (y/n): ")
    if custom.lower() == 'n':
        email = input("Enter email: ").strip()
        password = input("Enter password: ").strip()
    
    create_superuser(email=email, password=password)
