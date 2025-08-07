#!/usr/bin/env python3
"""
Script to create a default admin user for the Health First Server application.
This script creates an admin user with predefined credentials for easy setup.
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


def create_default_admin():
    """Create a default admin user with predefined credentials."""

    # Default admin credentials
    admin_data = {
        "first_name": "Admin",
        "last_name": "User",
        "email": "admin@healthfirst.com",
        "phone_number": "+1234567890",
        "password": "AdminPassword123!",
        "role": "superuser",
    }

    print("=== Health First Server - Default Admin Creation ===")
    print()
    print(f"Creating default admin user with the following credentials:")
    print(f"Email: {admin_data['email']}")
    print(f"Password: {admin_data['password']}")
    print(f"Role: {admin_data['role']}")
    print()

    try:
        # Create database session
        db = SessionLocal()

        # Check if admin already exists
        existing_admin = (
            db.query(ProviderSQL)
            .filter(ProviderSQL.email == admin_data["email"])
            .first()
        )
        if existing_admin:
            print(f"✅ Admin user already exists with email '{admin_data['email']}'")
            print(f"User ID: {existing_admin.id}")
            print(f"Role: {existing_admin.role}")
            db.close()
            return True

        # Create admin user
        admin_id = str(uuid.uuid4())
        password_hash = hash_password(admin_data["password"])

        admin_user = ProviderSQL(
            id=admin_id,
            first_name=admin_data["first_name"],
            last_name=admin_data["last_name"],
            email=admin_data["email"],
            phone_number=admin_data["phone_number"],
            password_hash=password_hash,
            specialization="System Administration",
            license_number=f"ADMIN-{admin_id[:8].upper()}",
            years_of_experience=0,
            clinic_street="System Admin",
            clinic_city="System",
            clinic_state="AD",
            clinic_zip="00000",
            verification_status="verified",
            is_active=True,
            role=admin_data["role"],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        # Add to database
        db.add(admin_user)
        db.commit()

        print("✅ Default admin user created successfully!")
        print()
        print("=== Admin User Details ===")
        print(f"Name: {admin_data['first_name']} {admin_data['last_name']}")
        print(f"Email: {admin_data['email']}")
        print(f"Phone: {admin_data['phone_number']}")
        print(f"Role: {admin_data['role']}")
        print(f"Status: verified")
        print(f"User ID: {admin_id}")
        print()
        print("You can now login using:")
        print(f"Email: {admin_data['email']}")
        print(f"Password: {admin_data['password']}")
        print()
        print("⚠️  IMPORTANT: Change the default password after first login!")
        print()

        db.close()
        return True

    except Exception as e:
        print(f"❌ Error creating default admin user: {str(e)}")
        if "db" in locals():
            db.rollback()
            db.close()
        return False


def create_default_provider_admin():
    """Create a default provider admin user with predefined credentials."""

    # Default provider admin credentials
    admin_data = {
        "first_name": "Provider",
        "last_name": "Admin",
        "email": "provider.admin@healthfirst.com",
        "phone_number": "+1234567891",
        "password": "ProviderAdmin123!",
        "role": "admin",
    }

    print("=== Health First Server - Default Provider Admin Creation ===")
    print()
    print(f"Creating default provider admin user with the following credentials:")
    print(f"Email: {admin_data['email']}")
    print(f"Password: {admin_data['password']}")
    print(f"Role: {admin_data['role']}")
    print()

    try:
        # Create database session
        db = SessionLocal()

        # Check if admin already exists
        existing_admin = (
            db.query(ProviderSQL)
            .filter(ProviderSQL.email == admin_data["email"])
            .first()
        )
        if existing_admin:
            print(
                f"✅ Provider admin user already exists with email '{admin_data['email']}'"
            )
            print(f"User ID: {existing_admin.id}")
            print(f"Role: {existing_admin.role}")
            db.close()
            return True

        # Create admin user
        admin_id = str(uuid.uuid4())
        password_hash = hash_password(admin_data["password"])

        admin_user = ProviderSQL(
            id=admin_id,
            first_name=admin_data["first_name"],
            last_name=admin_data["last_name"],
            email=admin_data["email"],
            phone_number=admin_data["phone_number"],
            password_hash=password_hash,
            specialization="Provider Administration",
            license_number=f"PROV-ADMIN-{admin_id[:8].upper()}",
            years_of_experience=0,
            clinic_street="Provider Admin Office",
            clinic_city="Admin",
            clinic_state="AD",
            clinic_zip="00000",
            verification_status="verified",
            is_active=True,
            role=admin_data["role"],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        # Add to database
        db.add(admin_user)
        db.commit()

        print("✅ Default provider admin user created successfully!")
        print()
        print("=== Provider Admin User Details ===")
        print(f"Name: {admin_data['first_name']} {admin_data['last_name']}")
        print(f"Email: {admin_data['email']}")
        print(f"Phone: {admin_data['phone_number']}")
        print(f"Role: {admin_data['role']}")
        print(f"Status: verified")
        print(f"User ID: {admin_id}")
        print()
        print("You can now login using:")
        print(f"Email: {admin_data['email']}")
        print(f"Password: {admin_data['password']}")
        print()
        print("⚠️  IMPORTANT: Change the default password after first login!")
        print()

        db.close()
        return True

    except Exception as e:
        print(f"❌ Error creating default provider admin user: {str(e)}")
        if "db" in locals():
            db.rollback()
            db.close()
        return False


def main():
    """Main function to run the default admin creation script."""

    print("Health First Server - Default Admin Creation")
    print("============================================")
    print()
    print("Choose an option:")
    print("1. Create Default Superuser (highest privileges)")
    print("2. Create Default Provider Admin (elevated privileges)")
    print("3. Create Both")
    print("4. Exit")
    print()

    while True:
        choice = input("Enter your choice (1-4): ").strip()

        if choice == "1":
            print()
            create_default_admin()
            break
        elif choice == "2":
            print()
            create_default_provider_admin()
            break
        elif choice == "3":
            print()
            print("Creating both admin users...")
            print()
            create_default_admin()
            print()
            create_default_provider_admin()
            break
        elif choice == "4":
            print("Goodbye!")
            break
        else:
            print("❌ Invalid choice. Please enter 1, 2, 3, or 4.")
            print()


if __name__ == "__main__":
    main()
