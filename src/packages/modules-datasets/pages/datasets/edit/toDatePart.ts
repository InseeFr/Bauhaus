/** Ne garde que la date d'un horodatage ISO (`2024-01-31T10:00:00` → `2024-01-31`). */
export const toDatePart = (value?: string) =>
  value?.includes("T") ? value.substring(0, value.indexOf("T")) : value;
