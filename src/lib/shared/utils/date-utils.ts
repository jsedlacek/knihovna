export function formatDateCzech(dateString: string): string {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Prague",
  }).format(date);
}
