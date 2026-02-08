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
