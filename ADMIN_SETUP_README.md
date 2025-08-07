# Admin User Setup Guide

This guide explains how to create and manage admin users for the Health First Server application.

## Overview

The application supports three types of user roles:

1. **Provider** (default) - Regular healthcare providers
2. **Admin** - Elevated privileges for provider management
3. **Superuser** - Highest privileges for system administration

## Quick Setup

### Option 1: Create Default Admin Users (Recommended)

Run the default admin creation script to quickly set up admin users with predefined credentials:

```bash
python create_default_admin.py
```

This will create:
- **Superuser**: `admin@healthfirst.com` / `AdminPassword123!`
- **Provider Admin**: `provider.admin@healthfirst.com` / `ProviderAdmin123!`

### Option 2: Create Custom Admin Users

Run the interactive admin creation script to create custom admin users:

```bash
python create_superuser.py
```

This will prompt you for:
- First Name
- Last Name
- Email
- Phone Number
- Password (with validation)

## Admin User Features

### Superuser (Role: "superuser")
- Highest level of privileges
- Can manage all users and system settings
- Bypasses verification requirements
- Full access to all endpoints

### Admin (Role: "admin")
- Elevated privileges for provider management
- Can manage provider accounts
- Bypasses verification requirements
- Limited system access

### Provider (Role: "provider")
- Standard healthcare provider privileges
- Requires verification before login
- Standard access to provider features

## Login Process

1. **Start the application**:
   ```bash
   docker-compose up --build
   ```

2. **Login using the admin credentials**:
   ```bash
   curl -X POST "http://localhost:8001/api/v1/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "identifier": "admin@healthfirst.com",
       "password": "AdminPassword123!"
     }'
   ```

3. **Use the returned access token** for authenticated requests:
   ```bash
   curl -X GET "http://localhost:8001/api/v1/provider/profile" \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

## Security Considerations

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Important Security Notes
1. **Change default passwords** after first login
2. **Use strong, unique passwords** for production
3. **Keep admin credentials secure**
4. **Regularly rotate admin passwords**

## Database Schema Changes

The admin functionality adds a `role` field to the `providers` table:

```sql
ALTER TABLE providers ADD COLUMN role VARCHAR(20) DEFAULT 'provider';
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login with email/phone and password
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout and revoke tokens

### Provider Management (Admin/Superuser)
- `GET /api/v1/provider/profile` - Get own profile
- `PUT /api/v1/provider/profile` - Update own profile
- `GET /api/v1/provider/list` - List all providers (admin only)
- `PUT /api/v1/provider/{id}/status` - Update provider status (admin only)

## Troubleshooting

### Common Issues

1. **"User already exists" error**
   - The admin user already exists in the database
   - Use existing credentials or create a new admin with different email

2. **"Database connection failed" error**
   - Ensure the database is running
   - Check database configuration in `.env` file
   - Verify database URL and credentials

3. **"Invalid credentials" error**
   - Double-check email and password
   - Ensure the user is active and verified (for providers)
   - Check if account is locked due to failed attempts

### Database Migration

If you're adding the role field to an existing database:

```bash
# Create a new migration
alembic revision --autogenerate -m "Add role field to providers"

# Apply the migration
alembic upgrade head
```

## Support

For issues or questions about admin functionality:
1. Check the application logs in `logs/app.log`
2. Verify database connectivity
3. Ensure all dependencies are installed
4. Check the main README.md for general setup instructions 