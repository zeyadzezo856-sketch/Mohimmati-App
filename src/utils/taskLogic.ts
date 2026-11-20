import type {
  Task,
  TaskCounts,
  TaskFilter,
  TaskFormValues,
  TaskSort,
  TaskStatus,
} from '../types/task';
import {
  formatArabicDate,
  getTodayLocalISO,
  isTaskOverdue,
  isValidISODate,
  normalizeDigitsToWestern,
} from './dateUtils';

export const STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: 'لم تبدأ',
  in_progress: 'قيد التنفيذ',
  completed: 'مكتملة',
};

export function generateTaskId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function validateTaskForm(values: TaskFormValues): {
  valid: boolean;
  errors: Partial<Record<keyof TaskFormValues, string>>;
} {
  const errors: Partial<Record<keyof TaskFormValues, string>> = {};

  if (!values.title || values.title.trim().length === 0) {
    errors.title = 'عنوان المهمة مطلوب ولا يمكن تركه فارغاً.';
  } else if (values.title.trim().length > 140) {
    errors.title = 'عنوان المهمة طويل جداً (الحد الأقصى 140 حرفاً).';
  }

  if (!values.course || values.course.trim().length === 0) {
    errors.course = 'اسم المقرر مطلوب ولا يمكن تركه فارغاً.';
  } else if (values.course.trim().length > 80) {
    errors.course = 'اسم المقرر طويل جداً (الحد الأقصى 80 حرفاً).';
  }

  if (!values.dueDate || values.dueDate.trim().length === 0) {
    errors.dueDate = 'تاريخ التسليم مطلوب.';
  } else if (!isValidISODate(values.dueDate.trim())) {
    errors.dueDate = 'يرجى اختيار تاريخ تسليم صحيح.';
  }

  if (
    values.status !== 'not_started' &&
    values.status !== 'in_progress' &&
    values.status !== 'completed'
  ) {
    errors.status = 'يرجى اختيار حالة صحيحة للمهمة.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function computeTaskCounts(
  tasks: Task[],
  todayISO: string = getTodayLocalISO()
): TaskCounts {
  let upcoming = 0;
  let overdue = 0;
  let completed = 0;
  let inProgress = 0;
  let notStarted = 0;

  for (const task of tasks) {
    if (task.status === 'completed') {
      completed += 1;
      continue;
    }

    if (task.status === 'in_progress') {
      inProgress += 1;
    } else if (task.status === 'not_started') {
      notStarted += 1;
    }

    if (isTaskOverdue(task, todayISO)) {
      overdue += 1;
    } else {
      upcoming += 1;
    }
  }

  return {
    total: tasks.length,
    upcoming,
    overdue,
    completed,
    inProgress,
    notStarted,
  };
}

export function extractUniqueCourses(tasks: Task[]): string[] {
  const seen = new Set<string>();
  for (const task of tasks) {
    const trimmed = task.course.trim();
    if (trimmed) {
      seen.add(trimmed);
    }
  }
  return Array.from(seen).sort((a, b) => a.localeCompare(b, 'ar'));
}

export function matchesSearchQuery(task: Task, rawQuery: string): boolean {
  const query = normalizeDigitsToWestern(rawQuery.trim().toLowerCase());
  if (!query) {
    return true;
  }

  const haystack = normalizeDigitsToWestern(
    [
      task.title,
      task.course,
      task.notes,
      task.dueDate,
      formatArabicDate(task.dueDate),
      STATUS_LABELS[task.status],
    ]
      .join(' ')
      .toLowerCase()
  );

  return haystack.includes(query);
}

export function filterAndSortTasks(
  tasks: Task[],
  options: {
    filter: TaskFilter;
    searchQuery: string;
    courseFilter: string;
    sort: TaskSort;
    todayISO?: string;
  }
): Task[] {
  const todayISO = options.todayISO ?? getTodayLocalISO();

  const filtered = tasks.filter((task) => {
    if (options.courseFilter && task.course.trim() !== options.courseFilter) {
      return false;
    }

    if (!matchesSearchQuery(task, options.searchQuery)) {
      return false;
    }

    switch (options.filter) {
      case 'all':
        return true;
      case 'upcoming':
        return task.status !== 'completed' && !isTaskOverdue(task, todayISO);
      case 'overdue':
        return isTaskOverdue(task, todayISO);
      case 'in_progress':
        return task.status === 'in_progress';
      case 'not_started':
        return task.status === 'not_started';
      case 'completed':
        return task.status === 'completed';
      default:
        return true;
    }
  });

  return [...filtered].sort((a, b) => {
    if (options.sort === 'created_desc') {
      return b.createdAt.localeCompare(a.createdAt);
    }

    // Keep active tasks before completed tasks when viewing mixed lists
    const aCompleted = a.status === 'completed';
    const bCompleted = b.status === 'completed';
    if (aCompleted !== bCompleted) {
      return aCompleted ? 1 : -1;
    }

    const dateComparison =
      options.sort === 'due_asc'
        ? a.dueDate.localeCompare(b.dueDate)
        : b.dueDate.localeCompare(a.dueDate);

    if (dateComparison !== 0) {
      return dateComparison;
    }

    return a.createdAt.localeCompare(b.createdAt);
  });
}
