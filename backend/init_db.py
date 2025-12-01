"""
Database initialization script
Run this to create all tables
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base
from models import (
    User, Candidate, Recruiter, Experience, Education, 
    Certification, Skill, Resume, Job, Application, 
    Match, ScreeningResult, TeamMember, Tag, Analytics
)

def init_db():
    """Initialize database with all tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")
    
    # Print created tables
    print("\nCreated tables:")
    for table in Base.metadata.sorted_tables:
        print(f"  - {table.name}")

def drop_all():
    """Drop all tables (use with caution!)"""
    print("WARNING: This will delete all tables and data!")
    confirm = input("Type 'yes' to confirm: ")
    if confirm.lower() == 'yes':
        Base.metadata.drop_all(bind=engine)
        print("✓ All tables dropped")
    else:
        print("Operation cancelled")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Database management')
    parser.add_argument('--drop', action='store_true', help='Drop all tables')
    parser.add_argument('--init', action='store_true', help='Initialize database')
    
    args = parser.parse_args()
    
    if args.drop:
        drop_all()
    
    if args.init or not (args.drop):
        init_db()
