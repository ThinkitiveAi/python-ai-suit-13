"""Initial migration - create all tables

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create enum types
    verification_status_enum = postgresql.ENUM(
        "pending", "verified", "rejected", name="verificationstatus"
    )
    verification_status_enum.create(op.get_bind())

    gender_enum = postgresql.ENUM(
        "male", "female", "other", "prefer_not_to_say", name="gender"
    )
    gender_enum.create(op.get_bind())

    recurrence_pattern_enum = postgresql.ENUM(
        "daily", "weekly", "monthly", name="recurrencepattern"
    )
    recurrence_pattern_enum.create(op.get_bind())

    slot_status_enum = postgresql.ENUM(
        "available", "booked", "cancelled", "blocked", "maintenance", name="slotstatus"
    )
    slot_status_enum.create(op.get_bind())

    appointment_type_enum = postgresql.ENUM(
        "consultation", "follow_up", "emergency", "telemedicine", name="appointmenttype"
    )
    appointment_type_enum.create(op.get_bind())

    location_type_enum = postgresql.ENUM(
        "clinic", "hospital", "telemedicine", "home_visit", name="locationtype"
    )
    location_type_enum.create(op.get_bind())

    # Create providers table
    op.create_table(
        "providers",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("first_name", sa.String(length=50), nullable=False),
        sa.Column("last_name", sa.String(length=50), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone_number", sa.String(length=20), nullable=False),
        sa.Column("password_hash", sa.Text(), nullable=False),
        sa.Column("specialization", sa.String(length=100), nullable=False),
        sa.Column("license_number", sa.String(length=50), nullable=False),
        sa.Column("years_of_experience", sa.Integer(), nullable=False),
        sa.Column("clinic_street", sa.String(length=200), nullable=False),
        sa.Column("clinic_city", sa.String(length=100), nullable=False),
        sa.Column("clinic_state", sa.String(length=50), nullable=False),
        sa.Column("clinic_zip", sa.String(length=20), nullable=False),
        sa.Column(
            "verification_status",
            sa.Enum("pending", "verified", "rejected", name="verificationstatus"),
            nullable=True,
        ),
        sa.Column("license_document_url", sa.String(length=500), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("last_login", sa.DateTime(), nullable=True),
        sa.Column("failed_login_attempts", sa.Integer(), nullable=True),
        sa.Column("locked_until", sa.DateTime(), nullable=True),
        sa.Column("login_count", sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_providers_email"), "providers", ["email"], unique=True)
    op.create_index(
        op.f("ix_providers_license_number"),
        "providers",
        ["license_number"],
        unique=True,
    )
    op.create_index(
        op.f("ix_providers_phone_number"), "providers", ["phone_number"], unique=True
    )

    # Create refresh_tokens table
    op.create_table(
        "refresh_tokens",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("provider_id", sa.String(length=36), nullable=False),
        sa.Column("token_hash", sa.String(length=255), nullable=False),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("is_revoked", sa.Boolean(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("last_used_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_refresh_tokens_provider_id"),
        "refresh_tokens",
        ["provider_id"],
        unique=False,
    )

    # Create patients table
    op.create_table(
        "patients",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("first_name", sa.String(length=50), nullable=False),
        sa.Column("last_name", sa.String(length=50), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone_number", sa.String(length=20), nullable=False),
        sa.Column("password_hash", sa.Text(), nullable=False),
        sa.Column("date_of_birth", sa.Date(), nullable=False),
        sa.Column(
            "gender",
            sa.Enum("male", "female", "other", "prefer_not_to_say", name="gender"),
            nullable=False,
        ),
        sa.Column("address_street", sa.String(length=200), nullable=False),
        sa.Column("address_city", sa.String(length=100), nullable=False),
        sa.Column("address_state", sa.String(length=50), nullable=False),
        sa.Column("address_zip", sa.String(length=20), nullable=False),
        sa.Column("emergency_contact_name", sa.String(length=100), nullable=True),
        sa.Column("emergency_contact_phone", sa.String(length=20), nullable=True),
        sa.Column(
            "emergency_contact_relationship", sa.String(length=50), nullable=True
        ),
        sa.Column("medical_history", sa.JSON(), nullable=True),
        sa.Column("insurance_provider", sa.String(length=100), nullable=True),
        sa.Column("insurance_policy_number", sa.String(length=50), nullable=True),
        sa.Column("email_verified", sa.Boolean(), nullable=True),
        sa.Column("phone_verified", sa.Boolean(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("last_login", sa.DateTime(), nullable=True),
        sa.Column("failed_login_attempts", sa.Integer(), nullable=True),
        sa.Column("locked_until", sa.DateTime(), nullable=True),
        sa.Column("login_count", sa.Integer(), nullable=True),
        sa.Column("data_encryption_key", sa.String(length=255), nullable=True),
        sa.Column("audit_trail_enabled", sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_patients_email"), "patients", ["email"], unique=True)
    op.create_index(
        op.f("ix_patients_phone_number"), "patients", ["phone_number"], unique=True
    )

    # Create patient_refresh_tokens table
    op.create_table(
        "patient_refresh_tokens",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("patient_id", sa.String(length=36), nullable=False),
        sa.Column("token_hash", sa.String(length=255), nullable=False),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("is_revoked", sa.Boolean(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("last_used_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_patient_refresh_tokens_patient_id"),
        "patient_refresh_tokens",
        ["patient_id"],
        unique=False,
    )

    # Create provider_availability table
    op.create_table(
        "provider_availability",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("provider_id", sa.String(length=36), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("start_time", sa.Time(), nullable=False),
        sa.Column("end_time", sa.Time(), nullable=False),
        sa.Column("timezone", sa.String(length=50), nullable=False),
        sa.Column("is_recurring", sa.Boolean(), nullable=True),
        sa.Column(
            "recurrence_pattern",
            sa.Enum("daily", "weekly", "monthly", name="recurrencepattern"),
            nullable=True,
        ),
        sa.Column("recurrence_end_date", sa.Date(), nullable=True),
        sa.Column("slot_duration", sa.Integer(), nullable=True),
        sa.Column("break_duration", sa.Integer(), nullable=True),
        sa.Column(
            "status",
            sa.Enum(
                "available",
                "booked",
                "cancelled",
                "blocked",
                "maintenance",
                name="slotstatus",
            ),
            nullable=True,
        ),
        sa.Column("max_appointments_per_slot", sa.Integer(), nullable=True),
        sa.Column("current_appointments", sa.Integer(), nullable=True),
        sa.Column(
            "appointment_type",
            sa.Enum(
                "consultation",
                "follow_up",
                "emergency",
                "telemedicine",
                name="appointmenttype",
            ),
            nullable=True,
        ),
        sa.Column("location", sa.JSON(), nullable=True),
        sa.Column("pricing", sa.JSON(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("special_requirements", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ["provider_id"],
            ["providers.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_provider_availability_provider_id"),
        "provider_availability",
        ["provider_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_provider_availability_date"),
        "provider_availability",
        ["date"],
        unique=False,
    )

    # Create appointment_slots table
    op.create_table(
        "appointment_slots",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("availability_id", sa.String(length=36), nullable=False),
        sa.Column("provider_id", sa.String(length=36), nullable=False),
        sa.Column("slot_start_time", sa.DateTime(), nullable=False),
        sa.Column("slot_end_time", sa.DateTime(), nullable=False),
        sa.Column(
            "status",
            sa.Enum(
                "available",
                "booked",
                "cancelled",
                "blocked",
                "maintenance",
                name="slotstatus",
            ),
            nullable=True,
        ),
        sa.Column("patient_id", sa.String(length=36), nullable=True),
        sa.Column("appointment_type", sa.String(length=50), nullable=False),
        sa.Column("booking_reference", sa.String(length=100), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ["availability_id"],
            ["provider_availability.id"],
        ),
        sa.ForeignKeyConstraint(
            ["patient_id"],
            ["patients.id"],
        ),
        sa.ForeignKeyConstraint(
            ["provider_id"],
            ["providers.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_appointment_slots_availability_id"),
        "appointment_slots",
        ["availability_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_appointment_slots_booking_reference"),
        "appointment_slots",
        ["booking_reference"],
        unique=True,
    )
    op.create_index(
        op.f("ix_appointment_slots_patient_id"),
        "appointment_slots",
        ["patient_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_appointment_slots_provider_id"),
        "appointment_slots",
        ["provider_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_appointment_slots_slot_start_time"),
        "appointment_slots",
        ["slot_start_time"],
        unique=False,
    )


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_index(
        op.f("ix_appointment_slots_slot_start_time"), table_name="appointment_slots"
    )
    op.drop_index(
        op.f("ix_appointment_slots_provider_id"), table_name="appointment_slots"
    )
    op.drop_index(
        op.f("ix_appointment_slots_patient_id"), table_name="appointment_slots"
    )
    op.drop_index(
        op.f("ix_appointment_slots_booking_reference"), table_name="appointment_slots"
    )
    op.drop_index(
        op.f("ix_appointment_slots_availability_id"), table_name="appointment_slots"
    )
    op.drop_table("appointment_slots")

    op.drop_index(
        op.f("ix_provider_availability_date"), table_name="provider_availability"
    )
    op.drop_index(
        op.f("ix_provider_availability_provider_id"), table_name="provider_availability"
    )
    op.drop_table("provider_availability")

    op.drop_index(
        op.f("ix_patient_refresh_tokens_patient_id"),
        table_name="patient_refresh_tokens",
    )
    op.drop_table("patient_refresh_tokens")

    op.drop_index(op.f("ix_patients_phone_number"), table_name="patients")
    op.drop_index(op.f("ix_patients_email"), table_name="patients")
    op.drop_table("patients")

    op.drop_index(op.f("ix_refresh_tokens_provider_id"), table_name="refresh_tokens")
    op.drop_table("refresh_tokens")

    op.drop_index(op.f("ix_providers_phone_number"), table_name="providers")
    op.drop_index(op.f("ix_providers_license_number"), table_name="providers")
    op.drop_index(op.f("ix_providers_email"), table_name="providers")
    op.drop_table("providers")

    # Drop enum types
    op.execute("DROP TYPE IF EXISTS locationtype")
    op.execute("DROP TYPE IF EXISTS appointmenttype")
    op.execute("DROP TYPE IF EXISTS slotstatus")
    op.execute("DROP TYPE IF EXISTS recurrencepattern")
    op.execute("DROP TYPE IF EXISTS gender")
    op.execute("DROP TYPE IF EXISTS verificationstatus")
