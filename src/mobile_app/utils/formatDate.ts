export function formatDate(dateInput: string | number | Date | null): string {
  if (!dateInput) {
    return "N/A";
  }

  const date = new Date(dateInput);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
