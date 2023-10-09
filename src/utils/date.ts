export function parseDate(dateString: string) {
  const dateParts = dateString.split('-').map((part) => Number(part));
  const [year, month, day] = dateParts;

  return new Date(year, month - 1, day);
}

export function isSameDate(date1: Date, date2: Date): boolean {
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);

  return date1.getTime() === date2.getTime();
}
