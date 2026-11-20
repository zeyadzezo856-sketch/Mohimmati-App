import type { TaskStatus } from '../types/task';

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function getTodayLocalISO(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODateLocal(dateStr: string): Date | null {
  if (!ISO_DATE_REGEX.test(dateStr)) {
    return null;
  }
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  return parsed;
}

export function isValidISODate(dateStr: string): boolean {
  return parseISODateLocal(dateStr) !== null;
}

export function addDaysToISO(baseISO: string, days: number): string {
  const baseDate = parseISODateLocal(baseISO) ?? new Date();
  const next = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate() + days
  );
  return getTodayLocalISO(next);
}

/**
 * Constraint rules:
 * - A completed task is NEVER marked overdue.
 * - A task due today is NOT overdue.
 * - Only non-completed tasks with dueDate strictly before today's local date are overdue.
 */
export function isTaskOverdue(
  task: { dueDate: string; status: TaskStatus },
  todayISO: string = getTodayLocalISO()
): boolean {
  if (task.status === 'completed') {
    return false;
  }
  if (!isValidISODate(task.dueDate)) {
    return false;
  }
  return task.dueDate < todayISO;
}

export type DueUrgency = 'completed' | 'overdue' | 'today' | 'soon' | 'normal';

export function getDaysDiffFromToday(
  dueDateISO: string,
  todayISO: string = getTodayLocalISO()
): number | null {
  const due = parseISODateLocal(dueDateISO);
  const today = parseISODateLocal(todayISO);
  if (!due || !today) {
    return null;
  }
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((due.getTime() - today.getTime()) / msPerDay);
}

export function getDueUrgency(
  task: { dueDate: string; status: TaskStatus },
  todayISO: string = getTodayLocalISO()
): DueUrgency {
  if (task.status === 'completed') {
    return 'completed';
  }
  if (isTaskOverdue(task, todayISO)) {
    return 'overdue';
  }
  const diff = getDaysDiffFromToday(task.dueDate, todayISO);
  if (diff === 0) {
    return 'today';
  }
  if (diff !== null && diff > 0 && diff <= 2) {
    return 'soon';
  }
  return 'normal';
}

export function formatArabicDate(isoDate: string): string {
  const parsed = parseISODateLocal(isoDate);
  if (!parsed) {
    return isoDate;
  }
  try {
    return new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(parsed);
  } catch {
    return isoDate;
  }
}

export function formatArabicRelativeDay(
  dueDateISO: string,
  status: TaskStatus,
  todayISO: string = getTodayLocalISO()
): string {
  const diff = getDaysDiffFromToday(dueDateISO, todayISO);
  if (diff === null) {
    return '';
  }

  if (status === 'completed') {
    if (diff === 0) return 'موعدها اليوم';
    if (diff === 1) return 'موعدها غداً';
    if (diff === -1) return 'كان موعدها أمس';
    return '';
  }

  if (diff < 0) {
    const abs = Math.abs(diff);
    if (abs === 1) return 'متأخرة بيوم واحد';
    if (abs === 2) return 'متأخرة بيومين';
    if (abs <= 10) return `متأخرة منذ ${abs} أيام`;
    return `متأخرة منذ ${abs} يوماً`;
  }

  if (diff === 0) return 'تستحق اليوم';
  if (diff === 1) return 'تستحق غداً';
  if (diff === 2) return 'بعد يومين';
  if (diff <= 10) return `خلال ${diff} أيام`;
  return `خلال ${diff} يوماً`;
}

export function normalizeDigitsToWestern(input: string): string {
  return input.replace(/[٠-٩]/g, (char) =>
    String(char.charCodeAt(0) - 0x0660)
  );
}
