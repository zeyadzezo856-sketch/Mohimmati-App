import { useEffect } from 'react';
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  CircleDashed,
  Clock,
  Pencil,
  PlayCircle,
  Trash2,
  X,
} from 'lucide-react';
import type { Task, TaskStatus } from '../types/task';
import {
  formatArabicDate,
  formatArabicRelativeDay,
  getDueUrgency,
  isTaskOverdue,
} from '../utils/dateUtils';
import { STATUS_LABELS } from '../utils/taskLogic';

interface TaskDetailModalProps {
  task: Task | null;
  todayISO: string;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onChangeStatus: (task: Task, status: TaskStatus) => void;
}

export function TaskDetailModal({
  task,
  todayISO,
  onClose,
  onEdit,
  onDelete,
  onChangeStatus,
}: TaskDetailModalProps) {
  useEffect(() => {
    if (!task) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [task, onClose]);

  if (!task) {
    return null;
  }

  const overdue = isTaskOverdue(task, todayISO);
  const urgency = getDueUrgency(task, todayISO);
  const relativeDay = formatArabicRelativeDay(task.dueDate, task.status, todayISO);

  const statusButtons: Array<{
    value: TaskStatus;
    label: string;
    icon: typeof CircleDashed;
  }> = [
    { value: 'not_started', label: STATUS_LABELS.not_started, icon: CircleDashed },
    { value: 'in_progress', label: STATUS_LABELS.in_progress, icon: PlayCircle },
    { value: 'completed', label: STATUS_LABELS.completed, icon: CheckCircle2 },
  ];

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-detail-title"
    >
      <div
        className="fixed inset-0 bg-[#1C1F26]/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[#E2E6ED] bg-white shadow-[0_16px_32px_-8px_rgba(28,31,38,0.16)] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#E2E6ED] px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#535D6C]">تفاصيل المهمة</p>
            <h2
              id="task-detail-title"
              className={`mt-1 text-lg font-bold leading-snug ${
                task.status === 'completed'
                  ? 'line-through text-[#535D6C]'
                  : 'text-[#191C22]'
              }`}
            >
              {task.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق التفاصيل"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#535D6C] transition-colors hover:bg-[#F1F3F7] hover:text-[#191C22] cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-5 py-5 sm:px-6">
          {/* Status / Overdue Indicators */}
          <div className="flex flex-wrap items-center gap-2">
            {overdue && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#F8D7D7] bg-[#FDF2F2] px-2.5 py-1 text-xs font-semibold text-[#C23434]">
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                <span>متأخرة</span>
              </span>
            )}
            {!overdue && urgency === 'today' && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#FDE68A] bg-[#FEF9EE] px-2.5 py-1 text-xs font-semibold text-[#B45309]">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>تستحق اليوم</span>
              </span>
            )}
          </div>

          <dl className="space-y-3 rounded-xl border border-[#E2E6ED] bg-[#F9F9FF] p-4 text-sm">
            {task.course && (
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-[#535D6C]">
                  <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>المقرر الدراسي</span>
                </dt>
                <dd className="font-semibold text-[#1E3A5F]">{task.course}</dd>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-[#535D6C]">
                <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>تاريخ التسليم</span>
              </dt>
              <dd className="text-left font-medium text-[#191C22] tabular-nums">
                <span>{formatArabicDate(task.dueDate)}</span>
                {relativeDay && (
                  <span
                    className={`block text-xs ${
                      overdue ? 'text-[#C23434]' : 'text-[#535D6C]'
                    }`}
                  >
                    {relativeDay}
                  </span>
                )}
              </dd>
            </div>
          </dl>

          {/* Notes */}
          <div>
            <h3 className="mb-1.5 text-xs font-semibold text-[#535D6C]">
              الملاحظات
            </h3>
            {task.notes ? (
              <p className="whitespace-pre-wrap rounded-xl border border-[#E2E6ED] bg-white p-3.5 text-sm leading-relaxed text-[#191C22]">
                {task.notes}
              </p>
            ) : (
              <p className="rounded-xl border border-dashed border-[#E2E6ED] bg-[#F9F9FF] p-3.5 text-sm text-[#535D6C]">
                لا توجد ملاحظات مضافة لهذه المهمة.
              </p>
            )}
          </div>

          {/* Quick Status Update */}
          <div>
            <h3 className="mb-2 text-xs font-semibold text-[#535D6C]">
              حالة المهمة
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {statusButtons.map((btn) => {
                const Icon = btn.icon;
                const active = task.status === btn.value;
                return (
                  <button
                    key={btn.value}
                    type="button"
                    onClick={() => onChangeStatus(task, btn.value)}
                    className={`flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'border-[#1E3A5F] bg-[#1E3A5F] text-white'
                        : 'border-[#E2E6ED] bg-white text-[#535D6C] hover:border-[#CBD5E1] hover:text-[#191C22]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-[#E2E6ED] bg-[#F9F9FF] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(task);
            }}
            className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-[#F8D7D7] bg-[#FDF2F2] px-4 py-2 text-sm font-semibold text-[#C23434] transition-colors hover:bg-[#FCE5E5] cursor-pointer"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            <span>حذف</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-[#1E3A5F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#022448] cursor-pointer"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
              <span>تعديل المهمة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
