/**
 * Format a timestamp into a readable date string
 * @param {string|Date} timestamp - ISO string or Date object
 * @returns {string} Formatted date
 */
export function formatDate(timestamp) {
    if (!timestamp) return '';
    
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    
    // Check if invalid date
    if (isNaN(date.getTime())) return '';
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    // Format: same day → "Today"
    if (isSameDay(date, today)) {
      return 'Today';
    }
    
    // Format: yesterday → "Yesterday"
    if (isSameDay(date, yesterday)) {
      return 'Yesterday';
    }
    
    // Format: within a week → "Monday", "Tuesday", etc.
    const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return date.toLocaleDateString(undefined, { weekday: 'long' });
    }
    
    // Format: within current year → "May 20"
    if (date.getFullYear() === today.getFullYear()) {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
    
    // Format: different year → "May 20, 2023"
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
  
  /**
   * Format a timestamp into a readable time string
   * @param {string|Date} timestamp - ISO string or Date object 
   * @returns {string} Formatted time
   */
  export function formatTime(timestamp) {
    if (!timestamp) return '';
    
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    
    // Check if invalid date
    if (isNaN(date.getTime())) return '';
    
    // Format: HH:MM AM/PM
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  }
  
  /**
   * Check if two dates are the same day
   * @param {Date} date1 - First date
   * @param {Date} date2 - Second date
   * @returns {boolean} True if same day
   */
  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  
  /**
   * Format a timestamp as a relative time (e.g., "just now", "2 minutes ago")
   * @param {string|Date} timestamp - ISO string or Date object
   * @returns {string} Relative time
   */
  export function formatRelativeTime(timestamp) {
    if (!timestamp) return '';
    
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    
    // Check if invalid date
    if (isNaN(date.getTime())) return '';
    
    const now = new Date();
    const secondsDiff = Math.floor((now - date) / 1000);
    
    // Less than a minute
    if (secondsDiff < 60) {
      return 'just now';
    }
    
    // Less than an hour
    if (secondsDiff < 3600) {
      const minutes = Math.floor(secondsDiff / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Less than a day
    if (secondsDiff < 86400) {
      const hours = Math.floor(secondsDiff / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Less than a week
    if (secondsDiff < 604800) {
      const days = Math.floor(secondsDiff / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
    // Default to formatted date
    return formatDate(date);
  }