export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  
  // Future dates
  if (diffInSeconds > 0) {
    if (diffInSeconds < 60) {
      return 'in ' + diffInSeconds + 's';
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return 'in ' + diffInMinutes + 'm';
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return 'in ' + diffInHours + 'h';
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return 'in ' + diffInDays + 'd';
    }
    return formatDate(date);
  }
  
  // Past dates
  const absDiff = Math.abs(diffInSeconds);
  
  if (absDiff < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(absDiff / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes + 'm ago';
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours + 'h ago';
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  if (diffInDays < 7) {
    return diffInDays + ' days ago';
  }
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks + 'w ago';
  }
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return months + 'mo ago';
  }
  
  return formatDate(date);
}

export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Get timezone abbreviation for a date (PT, ET, etc.)
 * @param date The date to get timezone for
 * @param timezone Optional timezone (defaults to 'America/Los_Angeles' for PT)
 */
export function getTimezoneAbbr(date: Date, timezone: string = 'America/Los_Angeles'): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short',
  });

  const parts = formatter.formatToParts(date);
  const timeZonePart = parts.find(part => part.type === 'timeZoneName');
  return timeZonePart?.value || 'PT';
}

/**
 * Format date with timezone label
 */
export function formatDateWithTimezone(date: Date, timezone: string = 'America/Los_Angeles'): string {
  const formatted = formatDate(date);
  const tz = getTimezoneAbbr(date, timezone);
  return `${formatted}`;
}

/**
 * Format time with timezone label
 */
export function formatTimeWithTimezone(date: Date, timezone: string = 'America/Los_Angeles'): string {
  const formatted = formatTime(date);
  const tz = getTimezoneAbbr(date, timezone);
  return `${formatted} ${tz}`;
}

/**
 * Format datetime with timezone label
 */
export function formatDateTimeWithTimezone(date: Date, timezone: string = 'America/Los_Angeles'): string {
  const formatted = formatDateTime(date);
  const tz = getTimezoneAbbr(date, timezone);
  return `${formatted} ${tz}`;
}

/**
 * Format relative time with absolute time and timezone
 */
export function formatRelativeTimeWithAbsolute(date: Date, timezone: string = 'America/Los_Angeles'): string {
  const relative = formatRelativeTime(date);
  const absolute = formatDateTimeWithTimezone(date, timezone);

  // If it's a relative time (not a formatted date), add the absolute time
  if (!relative.includes(',')) {
    return `${relative} (${absolute})`;
  }

  return relative;
}

/**
 * Format jackpot amount to standardized currency format
 */
export function formatJackpot(amount: string): string {
  // If already formatted with commas and dollar sign, return as is
  if (amount.includes(',') && amount.includes('$')) {
    return amount;
  }

  // Extract number from strings like "$340 Million" or "$1.2 Billion"
  const match = amount.match(/\$?([\d.]+)\s*(Million|Billion|Thousand|K|M|B)?/i);
  if (!match) return amount;

  const [, numStr, unit] = match;
  const num = parseFloat(numStr);

  if (unit) {
    const unitLower = unit.toLowerCase();
    let multiplier = 1;

    if (unitLower === 'thousand' || unitLower === 'k') multiplier = 1000;
    else if (unitLower === 'million' || unitLower === 'm') multiplier = 1000000;
    else if (unitLower === 'billion' || unitLower === 'b') multiplier = 1000000000;

    const fullAmount = num * multiplier;
    return `$${fullAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }

  // If no unit, format as is with commas
  return `$${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
