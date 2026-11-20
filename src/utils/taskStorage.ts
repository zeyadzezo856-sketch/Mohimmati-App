import type { Task, TaskStatus } from '../types/task';
import { isValidISODate } from './dateUtils';

export const STORAGE_KEY = 'mohimmati_tasks_v1';

const VALID_STATUSES: ReadonlySet<TaskStatus> = new Set([
  'not_started',
  'in_progress',
  'completed',
]);

export interface StorageLoadResult {
  tasks: Task[];
  error: string | null;
}

export interface StorageSaveResult {
  ok: boolean;
  error: string | null;
}

function sanitizeTask(raw: unknown, index: number): Task | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const title = typeof record.title === 'string' ? record.title.trim() : '';
  const dueDate = typeof record.dueDate === 'string' ? record.dueDate.trim() : '';
  const status = record.status as TaskStatus;

  if (!title || !isValidISODate(dueDate) || !VALID_STATUSES.has(status)) {
    return null;
  }

  const nowISO = new Date().toISOString();
  const id =
    typeof record.id === 'string' && record.id.trim().length > 0
      ? record.id.trim()
      : `recovered-${Date.now()}-${index}`;

  const course = typeof record.course === 'string' ? record.course.trim() : '';
  const notes = typeof record.notes === 'string' ? record.notes.trim() : '';
  const createdAt =
    typeof record.createdAt === 'string' && !Number.isNaN(Date.parse(record.createdAt))
      ? record.createdAt
      : nowISO;
  const updatedAt =
    typeof record.updatedAt === 'string' && !Number.isNaN(Date.parse(record.updatedAt))
      ? record.updatedAt
      : createdAt;

  return {
    id,
    title,
    course,
    dueDate,
    notes,
    status,
    createdAt,
    updatedAt,
  };
}

export function loadTasksFromStorage(): StorageLoadResult {
  if (typeof window === 'undefined') {
    return { tasks: [], error: null };
  }

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return {
      tasks: [],
      error:
        'تعذّر الوصول إلى التخزين المحلي في هذا المتصفح. ستعمل المهام مؤقتاً خلال هذه الجلسة فقط.',
    };
  }

  if (raw === null || raw.trim() === '') {
    return { tasks: [], error: null };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      tasks: [],
      error:
        'تعذّر قراءة البيانات المحفوظة محلياً لأنها غير صالحة. تم البدء بقائمة مهام فارغة بأمان.',
    };
  }

  if (!Array.isArray(parsed)) {
    return {
      tasks: [],
      error:
        'تنسيق البيانات المحفوظة في المتصفح غير متوافق. تم البدء بقائمة مهام فارغة بأمان.',
    };
  }

  const sanitized: Task[] = [];
  let skipped = 0;

  for (let i = 0; i < parsed.length; i += 1) {
    const task = sanitizeTask(parsed[i], i);
    if (task) {
      sanitized.push(task);
    } else {
      skipped += 1;
    }
  }

  if (skipped > 0 && sanitized.length === 0 && parsed.length > 0) {
    return {
      tasks: [],
      error:
        'تعذّر استرداد المهام المحفوظة لعدم صلاحية بياناتها. تم البدء بقائمة جديدة.',
    };
  }

  if (skipped > 0) {
    return {
      tasks: sanitized,
      error:
        'تم استرداد المهام السليمة وتجاهل بعض السجلات التالفة في التخزين المحلي.',
    };
  }

  return { tasks: sanitized, error: null };
}

export function saveTasksToStorage(tasks: Task[]): StorageSaveResult {
  if (typeof window === 'undefined') {
    return { ok: true, error: null };
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return { ok: true, error: null };
  } catch {
    return {
      ok: false,
      error:
        'تعذّر حفظ التغييرات في التخزين المحلي للمتصفح. تحقق من مساحة التخزين أو إعدادات الخصوصية.',
    };
  }
}
