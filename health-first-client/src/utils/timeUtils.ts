import { TimeSlot, ValidationError, SlotConflict } from '../types/appointment';

// Common timezone options
export const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Phoenix', label: 'Arizona Time (MST)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKST)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
];

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

export const convertTimeToTimezone = (
  time: string,
  date: string,
  fromTimezone: string,
  toTimezone: string
): string => {
  try {
    const dateTime = new Date(`${date}T${time}:00`);
    
    // Create a date in the source timezone
    const sourceDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: fromTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).formatToParts(dateTime);

    const sourceDateTime = new Date(
      `${sourceDate.find(p => p.type === 'year')?.value}-${sourceDate.find(p => p.type === 'month')?.value}-${sourceDate.find(p => p.type === 'day')?.value}T${sourceDate.find(p => p.type === 'hour')?.value}:${sourceDate.find(p => p.type === 'minute')?.value}:00`
    );

    // Convert to target timezone
    const targetTime = new Intl.DateTimeFormat('en-CA', {
      timeZone: toTimezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(sourceDateTime);

    return targetTime;
  } catch (error) {
    console.error('Error converting timezone:', error);
    return time;
  }
};

export const getCurrentTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const isValidTimeRange = (startTime: string, endTime: string): boolean => {
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);
  return start < end;
};

export const validateSlotDuration = (duration: number): ValidationError | null => {
  if (duration < 15 || duration > 480) {
    return {
      field: 'slotDuration',
      message: 'Slot duration must be between 15 minutes and 8 hours'
    };
  }
  return null;
};

export const validateBreakDuration = (duration: number): ValidationError | null => {
  if (duration < 0 || duration > 120) {
    return {
      field: 'breakDuration',
      message: 'Break duration must be between 0 and 120 minutes'
    };
  }
  return null;
};

export const checkSlotConflicts = (
  newSlot: Partial<TimeSlot>,
  existingSlots: TimeSlot[]
): SlotConflict[] => {
  const conflicts: SlotConflict[] = [];

  if (!newSlot.startTime || !newSlot.endTime) {
    return conflicts;
  }

  // Check if start time is before end time
  if (!isValidTimeRange(newSlot.startTime, newSlot.endTime)) {
    conflicts.push({
      type: 'invalid_time',
      message: 'Start time must be before end time'
    });
  }

  // Check if date is in the past
  if (newSlot.date) {
    const slotDate = new Date(newSlot.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (slotDate < today) {
      conflicts.push({
        type: 'past_date',
        message: 'Cannot create slots for past dates'
      });
    }
  }

  // Check for overlapping slots
  const overlappingSlots = existingSlots.filter(slot => {
    if (slot.id === newSlot.id) return false; // Skip self when editing
    if (slot.date !== newSlot.date) return false;
    if (slot.providerId !== newSlot.providerId) return false;

    const slotStart = new Date(`2000-01-01T${slot.startTime}:00`);
    const slotEnd = new Date(`2000-01-01T${slot.endTime}:00`);
    const newStart = new Date(`2000-01-01T${newSlot.startTime}:00`);
    const newEnd = new Date(`2000-01-01T${newSlot.endTime}:00`);

    return (newStart < slotEnd && newEnd > slotStart);
  });

  if (overlappingSlots.length > 0) {
    conflicts.push({
      type: 'overlap',
      message: `This slot overlaps with ${overlappingSlots.length} existing slot(s)`,
      conflictingSlots: overlappingSlots
    });
  }

  return conflicts;
};

export const generateTimeOptions = (
  startHour: number = 6,
  endHour: number = 22,
  interval: number = 15
): { value: string; label: string }[] => {
  const options: { value: string; label: string }[] = [];
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      if (hour === endHour && minute > 0) break;
      
      const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const timeLabel = formatTime(timeValue);
      
      options.push({
        value: timeValue,
        label: timeLabel
      });
    }
  }
  
  return options;
};

export const addMinutesToTime = (time: string, minutes: number): string => {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
};

export const calculateSlotEndTime = (startTime: string, duration: number): string => {
  return addMinutesToTime(startTime, duration);
};

export const formatDateForDisplay = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTimeForDisplay = (
  date: string,
  time: string,
  timezone: string
): string => {
  const dateTime = new Date(`${date}T${time}:00`);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(dateTime);
};
