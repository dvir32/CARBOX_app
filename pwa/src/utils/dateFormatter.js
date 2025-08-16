/**
 * Formats an ISO timestamp to a readable format
 * @param {string} isoString - ISO timestamp string (e.g., "2025-08-16T23:52:00Z")
 * @returns {string} Formatted date string (e.g., "16 August 2025, 23:52")
 */
export const formatTimestamp = (isoString) => {
  if (!isoString) return '';
  
  try {
    const date = new Date(isoString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return isoString; // Return original if parsing fails
    }
    
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return isoString; // Return original if there's an error
  }
};

/**
 * Formats a time string (HH:MM) to a readable format
 * @param {string} timeString - Time string (e.g., "23:52")
 * @returns {string} Formatted time string (e.g., "23:52")
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  // If it's already in HH:MM format, return as is
  if (timeString.includes(':')) {
    return timeString;
  }
  
  // If it's an ISO string, format it
  return formatTimestamp(timeString);
};
