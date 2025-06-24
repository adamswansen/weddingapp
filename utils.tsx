// Simple UUID generator
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format time for display
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Check if current time is within event time range
export function isEventCurrent(eventTime: string): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Parse event time (e.g., "2:00 PM")
  const [time, period] = eventTime.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  let eventHour = hours;
  if (period === 'PM' && hours !== 12) {
    eventHour += 12;
  } else if (period === 'AM' && hours === 12) {
    eventHour = 0;
  }
  
  // Consider event "current" if within 30 minutes
  const eventTotalMinutes = eventHour * 60 + minutes;
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  
  return Math.abs(eventTotalMinutes - currentTotalMinutes) <= 30;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
} 