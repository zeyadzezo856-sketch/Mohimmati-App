import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  CircleDashed,
  Clock,
  Eye,
  Pencil,
  PlayCircle,
  Trash2,
} from 'lucide-react';
import type { Task, TaskStatus } from '../types/task';
import {
  formatArabicDate,
  formatArabicRelativeDay,
  getDueUrgency,
  isTaskOverdue,
} from '../utils/dateUtils';
import { STATUS_LABELS } from '../utils/taskLogic';

interface TaskCardProps {
  task: Task;
  todayISO: string;
  onToggleComplete: (task: Task) => void;
  onChangeStatus: (task: Task, status: TaskStatus) => void;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const STATUS_STYLE: Record<
  TaskStatus,
  {
    bg: string;
    border: string;
    text: string;
    icon: typeof CircleDashed;
  }
> = {
  not_started: {
    bg: 'bg-[#F1F5F9]',
    border: 'border-[#E2E8F0]',
    text: 'text-[#475569]',
    icon: CircleDashed,
  },
  in_progress: {
    bg: 'bg-[#EBF5F6]',
    border: 'border-[#D3ECEE]',
    text: 'text-[#2E7278]',
    icon: PlayCircle,
  },
  completed: {
    bg: 'bg-[#EDF7F2]',
    border: 'border-[#D0EDE0]',
    text: 'text-[#1E7E52]',
    icon: CheckCircle2,
  },
};

export function TaskCard({
  task,
  todayISO,
  onToggleComplete,
  onChangeStatus,
  onView,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const isCompleted = task.status === 'completed';
  const overdue = isTaskOverdue(task, todayISO);
  const urgency = getDueUrgency(task, todayISO);
  const relativeLabel = formatArabicRelativeDay(task.dueDate, task.status, todayISO);
  const statusConfig = STATUS_STYLE[task.status];
  const StatusIcon = statusConfig.icon;

  const cardSurfaceClass = overdue
    ? 'border-[#F8D7D7] bg-[#FDF2F2]/40 hover:border-[#EABABA]'
    : 'border-[#E2E6ED] bg-white hover:border-[#CBD5E1]';

  const dateTextClass = overdue
    ? 'text-[#C23434] font-medium'
    : urgency === 'today' || urgency === 'soon'
      ? 'text-[#B45309] font-medium'
      : 'text-[#535D6C]';

  return (
    <article
      className={`group rounded-2xl border p-4 sm:p-5 transition-all duration-150 shadow-[0_1px_3px_rgba(28,31,38,0.04)] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_-2px_rgba(28,31,38,0.07)] ${cardSurfaceClass}`}
    >
      <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between md:gap-4">
        {/* Right / Start Section: Completion Checkbox + Title & Metadata */}
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onToggleComplete(task)}
            aria-label={
              isCompleted
                ? `إلغاء إكمال المهمة: ${task.title}`
                : `تحديد المهمة كمكتملة: ${task.title}`
            }
            aria-pressed={isCompleted}
            className="flex h-11 w-11 -mt-1.5 -mr-1.5 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-[#F1F3F7] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#1E3A5F]/25 cursor-pointer"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                isCompleted
                  ? 'border-[#1E7E52] bg-[#1E7E52] text-white'
                  : overdue
                    ? 'border-[#C23434] bg-white group-hover:bg-[#FDF2F2]'
                    : 'border-[#94A3B8] bg-white group-hover:border-[#1E3A5F]'
              }`}
            >
              {isCompleted && <Check className="h-3.5 w-3.5 stroke-[2.75]" aria-hidden="true" />}
            </span>
          </button>

          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onView(task)}
              className={`block max-w-full text-start text-base sm:text-[17px] font-semibold leading-snug transition-colors hover:text-[#1E3A5F] focus-visible:outline-none focus-visible:underline cursor-pointer ${
                isCompleted ? 'line-through text-[#535D6C]' : 'text-[#191C22]'
              }`}
            >
              {task.title}
            </button>

            {/* Unboxed Metadata Row */}
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[#535D6C]">
              {task.course && (
                <>
                  <span className="font-medium text-[#1E3A5F]">{task.course}</span>
                  <span aria-hidden="true" className="text-[#CBD5E1]">
                    ·
                  </span>
                </>
              )}

              <span className={`inline-flex items-center gap-1.5 tabular-nums ${dateTextClass}`}>
                <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{formatArabicDate(task.dueDate)}</span>
              </span>

              {relativeLabel && (
                <>
                  <span aria-hidden="true" className="text-[#CBD5E1]">
                    ·
                  </span>
                  <span className={`tabular-nums ${dateTextClass}`}>{relativeLabel}</span>
                </>
              )}
            </div>

            {task.notes && (
              <p className="mt-1.5 line-clamp-1 text-[13px] text-[#535D6C]">
                {task.notes}
              </p>
            )}
          </div>
        </div>

        {/* Left / End Section: Overdue / Status Badges & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pr-9 md:pr-0 md:justify-end md:shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Strict Overdue Label (never shown for due-today or completed) */}
            {overdue && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#F8D7D7] bg-[#FDF2F2] px-2.5 py-1 text-xs font-semibold text-[#C23434] whitespace-nowrap">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>متأخرة</span>
              </span>
            )}

            {/* Approaching Due Today indicator (explicitly NOT overdue) */}
            {!overdue && urgency === 'today' && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#FDE68A] bg-[#FEF9EE] px-2.5 py-1 text-xs font-semibold text-[#B45309] whitespace-nowrap">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>اليوم</span>
              </span>
            )}

            {/* Explicit Status Badge + Quick Status Selector */}
            <div className="relative inline-flex items-center">
              <StatusIcon
                className={`pointer-events-none absolute right-2.5 h-3.5 w-3.5 ${statusConfig.text}`}
                aria-hidden="true"
              />
              <select
                value={task.status}
                onChange={(e) => onChangeStatus(task, e.target.value as TaskStatus)}
                aria-label={`تغيير حالة المهمة: ${task.title}`}
                className={`min-h-[34px] appearance-none rounded-lg border pr-7 pl-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#1E3A5F]/20 cursor-pointer whitespace-nowrap ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text}`}
              >
                <option value="not_started">{STATUS_LABELS.not_started}</option>
                <option value="in_progress">{STATUS_LABELS.in_progress}</option>
                <option value="completed">{STATUS_LABELS.completed}</option>
              </select>
            </div>
          </div>

          {/* View, Edit & Delete Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onView(task)}
              aria-label={`عرض تفاصيل المهمة: ${task.title}`}
              title="عرض التفاصيل"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#535D6C] transition-colors hover:bg-[#F1F3F7] hover:text-[#1E3A5F] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#1E3A5F]/25 cursor-pointer"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(task)}
              aria-label={`تعديل المهمة: ${task.title}`}
              title="تعديل"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#535D6C] transition-colors hover:bg-[#F1F3F7] hover:text-[#1E3A5F] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#1E3A5F]/25 cursor-pointer"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(task)}
              aria-label={`حذف المهمة: ${task.title}`}
              title="حذف"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#535D6C] transition-colors hover:bg-[#FDF2F2] hover:text-[#C23434] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#C23434]/25 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
