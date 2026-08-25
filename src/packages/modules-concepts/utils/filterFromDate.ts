/**
 * Keeps the items whose `dateField` is on the selected day or after it.
 * `from` is the UTC midnight of the selected day, as emitted by the DatePicker.
 */
export function filterFromDate<T extends object>(
  data: T[],
  dateField: keyof T & string,
  from: string | undefined,
): T[] {
  if (!from) {
    return data;
  }
  const dayBefore = new Date(from);
  dayBefore.setDate(dayBefore.getDate() - 1);
  const threshold = dayBefore.getTime();

  return data.filter(
    (item) => new Date((item as Record<string, string>)[dateField]).getTime() > threshold,
  );
}
