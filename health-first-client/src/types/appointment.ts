export interface TimeSlot {
  id: string;
  providerId: string;
  date: string; // ISO date string
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  timezone: string;
  appointmentType: AppointmentType;
  slotDuration: number; // minutes
  breakDuration: number; // minutes
  maxAppointments: number;
  currentBookings: number;
  location: LocationInfo;
  pricing: PricingInfo;
  notes?: string;
  tags: string[];
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  status: 'available' | 'booked' | 'blocked' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly';
  interval: number; // every N days/weeks/months
  endDate: string; // ISO date string
  daysOfWeek?: number[]; // 0-6, Sunday = 0
  dayOfMonth?: number; // 1-31
}

export interface AppointmentType {
  id: string;
  name: string;
  duration: number; // minutes
  description?: string;
  color: string;
}

export interface LocationInfo {
  type: 'physical' | 'virtual' | 'hybrid';
  address?: string;
  room?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  virtualLink?: string;
  instructions?: string;
}

export interface PricingInfo {
  fee: number;
  currency: string;
  insuranceAccepted: string[];
  paymentMethods: string[];
  cancellationPolicy?: string;
}

export interface Provider {
  id: string;
  name: string;
  specialization: string[];
  experience: number; // years
  rating: number;
  reviewCount: number;
  clinicName?: string;
  profileImage?: string;
  bio?: string;
  languages: string[];
  certifications: string[];
  availableTimezones: string[];
}

export interface Appointment {
  id: string;
  slotId: string;
  patientId: string;
  providerId: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  appointmentType: AppointmentType;
  location: LocationInfo;
  pricing: PricingInfo;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  dateRange: {
    start: string;
    end: string;
  };
  specialization?: string[];
  location?: {
    city?: string;
    state?: string;
    radius?: number; // miles
  };
  appointmentTypes?: string[];
  insuranceAccepted?: string[];
  maxPrice?: number;
  currency?: string;
  timezone: string;
  availableOnly: boolean;
}

export interface SlotConflict {
  type: 'overlap' | 'booking_exists' | 'invalid_time' | 'past_date';
  message: string;
  conflictingSlots?: TimeSlot[];
}

export interface ValidationError {
  field: string;
  message: string;
}
