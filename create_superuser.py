#!/usr/bin/env python3
"""
Script to create a superuser for the Health First Server application.
This script creates an admin user with full privileges.
"""

import sys
import os
import uuid
from datetime import datetime

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import SessionLocal, ProviderSQL
from app.utils.password_utils import hash_password


def create_superuser():
    """Create a superuser with admin privileges."""

    print("=== Health First Server - Superuser Creation ===")
    print()

    # Get superuser details
    print("Please provide the following information for the superuser:")
    print()

    first_name = input("First Name: ").strip()
    if not first_name:
        print("❌ First name is required!")
        return False

    last_name = input("Last Name: ").strip()
    if not last_name:
        print("❌ Last name is required!")
        return False

    email = input("Email: ").strip().lower()
    if not email:
        print("❌ Email is required!")
        return False

    phone_number = input("Phone Number (e.g., +1234567890): ").strip()
    if not phone_number:
        print("❌ Phone number is required!")
        return False

    password = input("Password: ").strip()
    if not password:
        print("❌ Password is required!")
        return False

    confirm_password = input("Confirm Password: ").strip()
    if password != confirm_password:
        print("❌ Passwords do not match!")
        return False

    # Validate password strength
    if len(password) < 8:
        print("❌ Password must be at least 8 characters long!")
        return False

    if not any(c.isupper() for c in password):
        print("❌ Password must contain at least one uppercase letter!")
        return False

    if not any(c.islower() for c in password):
        print("❌ Password must contain at least one lowercase letter!")
        return False

    if not any(c.isdigit() for c in password):
        print("❌ Password must contain at least one number!")
        return False

    if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
        print("❌ Password must contain at least one special character!")
        return False

    print()
    print("Creating superuser...")

    try:
        # Create database session
        db = SessionLocal()

        # Check if email already exists
        existing_user = db.query(ProviderSQL).filter(ProviderSQL.email == email).first()
        if existing_user:
            print(f"❌ User with email '{email}' already exists!")
            db.close()
            return False

        # Check if phone number already exists
        existing_phone = (
            db.query(ProviderSQL)
            .filter(ProviderSQL.phone_number == phone_number)
            .first()
        )
        if existing_phone:
            print(f"❌ User with phone number '{phone_number}' already exists!")
            db.close()
            return False

        # Create superuser
        superuser_id = str(uuid.uuid4())
        password_hash = hash_password(password)

        superuser = ProviderSQL(
            id=superuser_id,
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone_number=phone_number,
            password_hash=password_hash,
            specialization="System Administration",  # Default for admin
            license_number=f"ADMIN-{superuser_id[:8].upper()}",  # Generate admin license
            years_of_experience=0,  # Not applicable for admin
            clinic_street="System Admin",
            clinic_city="System",
            clinic_state="AD",
            clinic_zip="00000",
            verification_status="verified",  # Auto-verify admin
            is_active=True,
            role="superuser",  # Highest privilege level
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        # Add to database
        db.add(superuser)
        db.commit()

        print("✅ Superuser created successfully!")
        print()
        print("=== Superuser Details ===")
        print(f"Name: {first_name} {last_name}")
        print(f"Email: {email}")
        print(f"Phone: {phone_number}")
        print(f"Role: superuser")
        print(f"Status: verified")
        print(f"User ID: {superuser_id}")
        print()
        print("You can now login using this email and password.")
        print()

        db.close()
        return True

    except Exception as e:
        print(f"❌ Error creating superuser: {str(e)}")
        if "db" in locals():
            db.rollback()
            db.close()
        return False


def create_admin_user():
    """Create an admin user with elevated privileges."""

    print("=== Health First Server - Admin User Creation ===")
    print()

    # Get admin details
    print("Please provide the following information for the admin user:")
    print()

    first_name = input("First Name: ").strip()
    if not first_name:
        print("❌ First name is required!")
        return False

    last_name = input("Last Name: ").strip()
    if not last_name:
        print("❌ Last name is required!")
        return False

    email = input("Email: ").strip().lower()
    if not email:
        print("❌ Email is required!")
        return False

    phone_number = input("Phone Number (e.g., +1234567890): ").strip()
    if not phone_number:
        print("❌ Phone number is required!")
        return False

    password = input("Password: ").strip()
    if not password:
        print("❌ Password is required!")
        return False

    confirm_password = input("Confirm Password: ").strip()
    if password != confirm_password:
        print("❌ Passwords do not match!")
        return False

    # Validate password strength
    if len(password) < 8:
        print("❌ Password must be at least 8 characters long!")
        return False

    if not any(c.isupper() for c in password):
        print("❌ Password must contain at least one uppercase letter!")
        return False

    if not any(c.islower() for c in password):
        print("❌ Password must contain at least one lowercase letter!")
        return False

    if not any(c.isdigit() for c in password):
        print("❌ Password must contain at least one number!")
        return False

    if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
        print("❌ Password must contain at least one special character!")
        return False

    print()
    print("Creating admin user...")

    try:
        # Create database session
        db = SessionLocal()

        # Check if email already exists
        existing_user = db.query(ProviderSQL).filter(ProviderSQL.email == email).first()
        if existing_user:
            print(f"❌ User with email '{email}' already exists!")
            db.close()
            return False

        # Check if phone number already exists
        existing_phone = (
            db.query(ProviderSQL)
            .filter(ProviderSQL.phone_number == phone_number)
            .first()
        )
        if existing_phone:
            print(f"❌ User with phone number '{phone_number}' already exists!")
            db.close()
            return False

        # Create admin user
        admin_id = str(uuid.uuid4())
        password_hash = hash_password(password)

        admin_user = ProviderSQL(
            id=admin_id,
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone_number=phone_number,
            password_hash=password_hash,
            specialization="Administration",  # Default for admin
            license_number=f"ADMIN-{admin_id[:8].upper()}",  # Generate admin license
            years_of_experience=0,  # Not applicable for admin
            clinic_street="Admin Office",
            clinic_city="Admin",
            clinic_state="AD",
            clinic_zip="00000",
            verification_status="verified",  # Auto-verify admin
            is_active=True,
            role="admin",  # Admin privilege level
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        # Add to database
        db.add(admin_user)
        db.commit()

        print("✅ Admin user created successfully!")
        print()
        print("=== Admin User Details ===")
        print(f"Name: {first_name} {last_name}")
        print(f"Email: {email}")
        print(f"Phone: {phone_number}")
        print(f"Role: admin")
        print(f"Status: verified")
        print(f"User ID: {admin_id}")
        print()
        print("You can now login using this email and password.")
        print()

        db.close()
        return True

    except Exception as e:
        print(f"❌ Error creating admin user: {str(e)}")
        if "db" in locals():
            db.rollback()
            db.close()
        return False


def main():
    """Main function to run the user creation script."""

    print("Health First Server - User Management")
    print("=====================================")
    print()
    print("Choose an option:")
    print("1. Create Superuser (highest privileges)")
    print("2. Create Admin User (elevated privileges)")
    print("3. Exit")
    print()

    while True:
        choice = input("Enter your choice (1-3): ").strip()

        if choice == "1":
            print()
            create_superuser()
            break
        elif choice == "2":
            print()
            create_admin_user()
            break
        elif choice == "3":
            print("Goodbye!")
            break
        else:
            print("❌ Invalid choice. Please enter 1, 2, or 3.")
            print()


if __name__ == "__main__":
    main()
