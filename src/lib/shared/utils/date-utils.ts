/**
 * Shared date formatting utilities for consistent date display across the application.
 * These functions are designed to be safe for both server and client rendering.
 */

/**
 * Formats a date string to Czech locale format (e.g., "15. prosince 2024").
 * This function provides consistent formatting between server and client rendering
 * to avoid hydration mismatches.
 *
 * @param dateString ISO date string (e.g., "2024-12-15T10:30:00.000Z")
 * @returns Formatted date string in Czech locale
 */
export function formatDateCzech(dateString: string): string {
  const date = new Date(dateString);

  // Use a consistent approach that works the same on server and client
  const czechMonths = [
    "ledna",
    "února",
    "března",
    "dubna",
    "května",
    "června",
    "července",
    "srpna",
    "září",
    "října",
    "listopadu",
    "prosince",
  ];

  const day = date.getDate();
  const month = czechMonths[date.getMonth()];
  const year = date.getFullYear();

  return `${day}. ${month} ${year}`;
}

/**
 * Formats a timestamp with both date and time in Czech locale.
 *
 * @param dateString ISO date string
 * @returns Formatted date and time string
 */
export function formatDateTimeCzech(dateString: string): string {
  const date = new Date(dateString);

  const czechMonths = [
    "ledna",
    "února",
    "března",
    "dubna",
    "května",
    "června",
    "července",
    "srpna",
    "září",
    "října",
    "listopadu",
    "prosince",
  ];

  const day = date.getDate();
  const month = czechMonths[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}. ${month} ${year}, ${hours}:${minutes}`;
}
