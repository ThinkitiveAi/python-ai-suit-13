# Database Migration Guide

This guide explains how to set up and use database migrations with Alembic in your health-first-server project.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Migration Configuration](#migration-configuration)
4. [Creating Migrations](#creating-migrations)
5. [Applying Migrations](#applying-migrations)
6. [Migration Commands](#migration-commands)
7. [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

- Python 3.8+
- PostgreSQL (or MySQL)
- Alembic 1.13.0 (already in requirements.txt)

## 🗄️ Database Setup

### 1. Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database and User

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create database
CREATE DATABASE provider_registration;

# Create user (replace with your desired username/password)
CREATE USER your_username WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE provider_registration TO your_username;

# Exit PostgreSQL
\q
```

### 3. Update Environment Variables

Create or update your `.env` file:

```bash
# Database Configuration
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://your_username:your_secure_password@localhost/provider_registration
```

## ⚙️ Migration Configuration

The project is already configured with Alembic. Key files:

- `alembic.ini` - Main configuration file
- `alembic/env.py` - Environment configuration
- `alembic/versions/` - Migration files directory

## 📝 Creating Migrations

### Method 1: Auto-generate from Models (Recommended)

```bash
# Create migration from current models
alembic revision --autogenerate -m "Description of changes"

# Example
alembic revision --autogenerate -m "Add new patient fields"
```

### Method 2: Manual Migration

```bash
# Create empty migration file
alembic revision -m "Manual migration description"
```

Then edit the generated file in `alembic/versions/`.

### Method 3: Use Pre-created Migration

The project includes a pre-created initial migration:
- `alembic/versions/001_initial_migration.py`

This creates all tables for your models:
- `providers` - Healthcare provider information
- `refresh_tokens` - Provider refresh tokens
- `patients` - Patient information
- `patient_refresh_tokens` - Patient refresh tokens
- `provider_availability` - Provider availability schedules
- `appointment_slots` - Individual appointment slots

## 🚀 Applying Migrations

### 1. Check Current Status

```bash
# Show current migration
alembic current

# Show migration history
alembic history

# Show pending migrations
alembic show head
```

### 2. Apply Migrations

```bash
# Apply all pending migrations
alembic upgrade head

# Apply specific migration
alembic upgrade <revision_id>

# Apply one migration at a time
alembic upgrade +1
```

### 3. Rollback Migrations

```bash
# Rollback one migration
alembic downgrade -1

# Rollback to specific migration
alembic downgrade <revision_id>

# Rollback all migrations
alembic downgrade base
```

## 📋 Migration Commands Reference

| Command | Description |
|---------|-------------|
| `alembic init alembic` | Initialize Alembic in a project |
| `alembic revision --autogenerate -m "message"` | Create migration from models |
| `alembic revision -m "message"` | Create empty migration |
| `alembic upgrade head` | Apply all pending migrations |
| `alembic upgrade <revision>` | Apply specific migration |
| `alembic downgrade -1` | Rollback one migration |
| `alembic downgrade <revision>` | Rollback to specific migration |
| `alembic current` | Show current migration |
| `alembic history` | Show migration history |
| `alembic show <revision>` | Show migration details |
| `alembic stamp <revision>` | Mark database as at specific revision |

## 🔍 Migration Workflow

### Typical Development Workflow

1. **Make model changes** in your SQLAlchemy models
2. **Generate migration**:
   ```bash
   alembic revision --autogenerate -m "Add new field to patients"
   ```
3. **Review migration** file in `alembic/versions/`
4. **Apply migration**:
   ```bash
   alembic upgrade head
   ```

### Production Deployment

1. **Backup database** before applying migrations
2. **Test migrations** in staging environment
3. **Apply migrations**:
   ```bash
   alembic upgrade head
   ```
4. **Verify** database schema

## 🛠️ Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Error**: `FATAL: password authentication failed`

**Solution**:
- Check database credentials in `.env` file
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Test connection: `psql -h localhost -U your_username -d provider_registration`

#### 2. Migration Already Applied

**Error**: `Target database is not up to date`

**Solution**:
```bash
# Check current status
alembic current

# Apply pending migrations
alembic upgrade head
```

#### 3. Migration Conflicts

**Error**: `Multiple heads detected`

**Solution**:
```bash
# Show all heads
alembic heads

# Merge heads
alembic merge heads -m "Merge multiple heads"
```

#### 4. Enum Type Issues

**Error**: `type "enum_name" already exists`

**Solution**: Drop and recreate enum types in migration:
```python
def upgrade():
    # Drop existing enum if exists
    op.execute('DROP TYPE IF EXISTS enum_name')
    # Create enum
    enum_type = postgresql.ENUM('value1', 'value2', name='enum_name')
    enum_type.create(op.get_bind())
```

### Debugging Tips

1. **Check migration files**: Review generated migration files before applying
2. **Use verbose output**: Add `-v` flag to see detailed output
3. **Test in isolation**: Test migrations on a copy of your database
4. **Check logs**: Review PostgreSQL logs for detailed error messages

## 📊 Database Schema Overview

Your project includes these main tables:

### Core Tables
- **providers** - Healthcare provider information
- **patients** - Patient information and medical history
- **provider_availability** - Provider scheduling and availability
- **appointment_slots** - Individual appointment time slots

### Authentication Tables
- **refresh_tokens** - Provider authentication tokens
- **patient_refresh_tokens** - Patient authentication tokens

### Key Features
- UUID primary keys for security
- Proper foreign key relationships
- Indexes on frequently queried fields
- JSON fields for flexible data storage
- Enum types for constrained values
- Timestamps for audit trails

## 🎯 Next Steps

1. **Set up your database** with correct credentials
2. **Update your `.env` file** with database URL
3. **Apply the initial migration**: `alembic upgrade head`
4. **Verify tables**: Check that all tables were created correctly
5. **Start developing**: Make model changes and create new migrations as needed

## 📚 Additional Resources

- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Note**: Always backup your database before applying migrations in production! 