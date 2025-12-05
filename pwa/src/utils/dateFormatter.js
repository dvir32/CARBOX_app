/**
 * Formats an ISO timestamp to a readable format (local time)
 * @param {string} isoString - ISO timestamp string (e.g., "2025-08-16T23:52:00Z")
 * @returns {string} Formatted date string (e.g., "16 August 2025, 23:52")
 */
export const formatTimestamp = (isoString) => {
  if (!isoString) return '';

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // optional
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return isoString;
  }
};
