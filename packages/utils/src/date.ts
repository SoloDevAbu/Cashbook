const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

export function formatRelativeTime(date: string | Date): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const elapsed = now.getTime() - targetDate.getTime();

  if (elapsed < 0) {
    return 'in the future';
  }

  if (elapsed < MINUTE) {
    const seconds = Math.floor(elapsed / SECOND);
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  }

  if (elapsed < HOUR) {
    const minutes = Math.floor(elapsed / MINUTE);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  if (elapsed < DAY) {
    const hours = Math.floor(elapsed / HOUR);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  if (elapsed < WEEK) {
    const days = Math.floor(elapsed / DAY);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  if (elapsed < MONTH) {
    const weeks = Math.floor(elapsed / WEEK);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }

  if (elapsed < YEAR) {
    const months = Math.floor(elapsed / MONTH);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  const years = Math.floor(elapsed / YEAR);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

export function formatDate(date: string | Date): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(targetDate);
}