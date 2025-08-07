#!/usr/bin/env python3
"""
Fixed script to create a superuser for the Health First Server application.
This script creates an admin user with full privileges using the correct database configuration.
"""

import sys
import os
import uuid
from datetime import datetime

# Set the correct database configuration
os.environ["DATABASE_TYPE"] = "postgresql"
os.environ["DATABASE_URL"] = (
    "postgresql://postgres:password@localhost:5435/provider_registration"
)

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

        # Hash password
        password_hash = hash_password(password)

        # Create superuser
        superuser = ProviderSQL(
            id=str(uuid.uuid4()),
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone_number=phone_number,
            password_hash=password_hash,
            specialization="Administrator",  # Default for superuser
            license_number=f"ADMIN-{uuid.uuid4().hex[:8].upper()}",  # Generate admin license
            years_of_experience=0,  # Not applicable for admin
            clinic_street="N/A",  # Not applicable for admin
            clinic_city="N/A",  # Not applicable for admin
            clinic_state="N/A",  # Not applicable for admin
            clinic_zip="N/A",  # Not applicable for admin
            verification_status="verified",  # Auto-verify superuser
            is_active=True,
            role="superuser",  # Set role as superuser
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        # Add to database
        db.add(superuser)
        db.commit()
        db.refresh(superuser)

        print("✅ Superuser created successfully!")
        print(f"   Name: {first_name} {last_name}")
        print(f"   Email: {email}")
        print(f"   Phone: {phone_number}")
        print(f"   Role: Superuser")
        print(f"   Status: Active")
        print()
        print("You can now log in to the application using these credentials.")

        db.close()
        return True

    except Exception as e:
        print(f"❌ Error creating superuser: {e}")
        if "db" in locals():
            db.rollback()
            db.close()
        return False


def main():
    """Main function to run the superuser creation."""
    try:
        success = create_superuser()
        if success:
            print("\n🎉 Superuser creation completed successfully!")
        else:
            print("\n❌ Superuser creation failed!")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n❌ Operation cancelled by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
