export function formatDateCzech(dateString: string): string {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
