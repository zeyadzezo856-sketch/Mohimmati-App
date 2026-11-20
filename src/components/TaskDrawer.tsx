import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  CircleDashed,
  PlayCircle,
  Plus,
  Save,
  X,
} from 'lucide-react';
import type { Task, TaskFormValues, TaskStatus } from '../types/task';
import { addDaysToISO } from '../utils/dateUtils';
import { STATUS_LABELS, validateTaskForm } from '../utils/taskLogic';

interface TaskDrawerProps {
  isOpen: boolean;
  editingTask: Task | null;
  todayISO: string;
  existingCourses: string[];
  onClose: () => void;
  onSave: (values: TaskFormValues, existingTaskId?: string) => boolean;
}

const STATUS_OPTIONS: Array<{
  value: TaskStatus;
  label: string;
  icon: typeof CircleDashed;
  activeClass: string;
}> = [
  {
    value: 'not_started',
    label: STATUS_LABELS.not_started,
    icon: CircleDashed,
    activeClass: 'border-[#64748B] bg-[#F1F5F9] text-[#191C22]',
  },
  {
    value: 'in_progress',
    label: STATUS_LABELS.in_progress,
    icon: PlayCircle,
    activeClass: 'border-[#2E7278] bg-[#EBF5F6] text-[#2E7278]',
  },
  {
    value: 'completed',
    label: STATUS_LABELS.completed,
    icon: CheckCircle2,
    activeClass: 'border-[#1E7E52] bg-[#EDF7F2] text-[#1E7E52]',
  },
];

export function TaskDrawer({
  isOpen,
  editingTask,
  todayISO,
  existingCourses,
  onClose,
  onSave,
}: TaskDrawerProps) {
  const [values, setValues] = useState<TaskFormValues>({
    title: '',
    course: '',
    dueDate: todayISO,
    notes: '',
    status: 'not_started',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof TaskFormValues, string>>
  >({});

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (editingTask) {
      setValues({
        title: editingTask.title,
        course: editingTask.course,
        dueDate: editingTask.dueDate,
        notes: editingTask.notes,
        status: editingTask.status,
      });
    } else {
      setValues({
        title: '',
        course: '',
        dueDate: todayISO,
        notes: '',
        status: 'not_started',
      });
    }
    setErrors({});

    const timer = window.setTimeout(() => {
      titleInputRef.current?.focus();
    }, 60);

    return () => window.clearTimeout(timer);
  }, [isOpen, editingTask, todayISO]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleFieldChange = <K extends keyof TaskFormValues>(
    field: K,
    value: TaskFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validation = validateTaskForm(values);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const saved = onSave(
      {
        title: values.title.trim(),
        course: values.course.trim(),
        dueDate: values.dueDate.trim(),
        notes: values.notes.trim(),
        status: values.status,
      },
      editingTask?.id
    );

    if (saved) {
      onClose();
    }
  };

  const quickDates = [
    { label: 'اليوم', date: todayISO },
    { label: 'غداً', date: addDaysToISO(todayISO, 1) },
    { label: 'بعد ٣ أيام', date: addDaysToISO(todayISO, 3) },
    { label: 'الأسبوع القادم', date: addDaysToISO(todayISO, 7) },
  ];

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center sm:items-stretch sm:justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-drawer-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C1F26]/45 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel (Left side in RTL desktop, Bottom sheet on mobile) */}
      <div className="relative z-10 flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-[#E2E6ED] bg-white shadow-[0_16px_32px_-8px_rgba(28,31,38,0.16)] sm:max-h-full sm:h-full sm:max-w-[460px] sm:rounded-t-none sm:rounded-r-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#E2E6ED] px-5 py-4 sm:px-6">
          <h2
            id="task-drawer-title"
            className="text-lg font-bold text-[#191C22]"
          >
            {editingTask ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#535D6C] transition-colors hover:bg-[#F1F3F7] hover:text-[#191C22] cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="flex-1 space-y-5 px-5 py-5 sm:px-6">
            {Object.keys(errors).length > 0 && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-xl border border-[#F8D7D7] bg-[#FDF2F2] px-3.5 py-2.5 text-xs font-medium text-[#C23434]"
              >
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>يرجى إكمال الحقول المطلوبة بشكل صحيح قبل الحفظ.</span>
              </div>
            )}

            {/* Title (Required) */}
            <div>
              <label
                htmlFor="task-title"
                className="mb-1.5 block text-sm font-semibold text-[#191C22]"
              >
                عنوان المهمة <span className="text-[#C23434]">*</span>
              </label>
              <input
                ref={titleInputRef}
                id="task-title"
                type="text"
                required
                value={values.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="مثال: تسليم المشروع النهائي"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? 'task-title-error' : undefined}
                className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-[#191C22] placeholder:text-[#8C96A5] transition-colors focus:outline-none focus:ring-3 ${
                  errors.title
                    ? 'border-[#C23434] focus:border-[#C23434] focus:ring-[#C23434]/15'
                    : 'border-[#E2E6ED] focus:border-[#1E3A5F] focus:ring-[#1E3A5F]/15'
                }`}
              />
              {errors.title && (
                <p
                  id="task-title-error"
                  role="alert"
                  className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#C23434]"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.title}</span>
                </p>
              )}
            </div>

            {/* Due Date (Required) */}
            <div>
              <label
                htmlFor="task-due-date"
                className="mb-1.5 block text-sm font-semibold text-[#191C22]"
              >
                تاريخ التسليم <span className="text-[#C23434]">*</span>
              </label>
              <input
                id="task-due-date"
                type="date"
                required
                value={values.dueDate}
                onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                aria-invalid={Boolean(errors.dueDate)}
                aria-describedby={
                  errors.dueDate ? 'task-due-date-error' : undefined
                }
                className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-[#191C22] tabular-nums transition-colors focus:outline-none focus:ring-3 ${
                  errors.dueDate
                    ? 'border-[#C23434] focus:border-[#C23434] focus:ring-[#C23434]/15'
                    : 'border-[#E2E6ED] focus:border-[#1E3A5F] focus:ring-[#1E3A5F]/15'
                }`}
              />
              {errors.dueDate && (
                <p
                  id="task-due-date-error"
                  role="alert"
                  className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#C23434]"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.dueDate}</span>
                </p>
              )}

              {/* Quick Date Shortcuts */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {quickDates.map((item) => {
                  const selected = values.dueDate === item.date;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleFieldChange('dueDate', item.date)}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                        selected
                          ? 'border-[#1E3A5F] bg-[#EEF2F7] text-[#1E3A5F]'
                          : 'border-[#E2E6ED] bg-[#F9F9FF] text-[#535D6C] hover:border-[#CBD5E1] hover:text-[#191C22]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Course / Subject (Required) */}
            <div>
              <label
                htmlFor="task-course"
                className="mb-1.5 block text-sm font-semibold text-[#191C22]"
              >
                اسم المقرر الدراسي <span className="text-[#C23434]">*</span>
              </label>
              <input
                id="task-course"
                type="text"
                required
                list="mohimmati-courses-list"
                value={values.course}
                onChange={(e) => handleFieldChange('course', e.target.value)}
                placeholder="مثال: هياكل البيانات، الفيزياء العامة"
                aria-invalid={Boolean(errors.course)}
                aria-describedby={errors.course ? 'task-course-error' : undefined}
                className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-[#191C22] placeholder:text-[#8C96A5] transition-colors focus:outline-none focus:ring-3 ${
                  errors.course
                    ? 'border-[#C23434] focus:border-[#C23434] focus:ring-[#C23434]/15'
                    : 'border-[#E2E6ED] focus:border-[#1E3A5F] focus:ring-[#1E3A5F]/15'
                }`}
              />
              {errors.course && (
                <p
                  id="task-course-error"
                  role="alert"
                  className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#C23434]"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.course}</span>
                </p>
              )}
              {existingCourses.length > 0 && (
                <datalist id="mohimmati-courses-list">
                  {existingCourses.map((course) => (
                    <option key={course} value={course} />
                  ))}
                </datalist>
              )}
            </div>

            {/* Status Segmented Control */}
            <div>
              <span className="mb-2 block text-sm font-semibold text-[#191C22]">
                الحالة
              </span>
              <div
                role="radiogroup"
                aria-label="حالة المهمة"
                className="grid grid-cols-3 gap-2"
              >
                {STATUS_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = values.status === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleFieldChange('status', option.value)}
                      className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? option.activeClass
                          : 'border-[#E2E6ED] bg-white text-[#535D6C] hover:border-[#CBD5E1] hover:text-[#191C22]'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes (Optional) */}
            <div>
              <label
                htmlFor="task-notes"
                className="mb-1.5 block text-sm font-semibold text-[#191C22]"
              >
                تفاصيل أو ملاحظات <span className="text-xs font-normal text-[#535D6C]">(اختياري)</span>
              </label>
              <textarea
                id="task-notes"
                rows={3}
                value={values.notes}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                placeholder="أضف متطلبات الواجب، رقم الفصل، أو رابط المرجع..."
                className="w-full resize-none rounded-xl border border-[#E2E6ED] bg-white p-3.5 text-sm text-[#191C22] placeholder:text-[#8C96A5] transition-colors focus:border-[#1E3A5F] focus:outline-none focus:ring-3 focus:ring-[#1E3A5F]/15"
              />
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="flex items-center gap-3 border-t border-[#E2E6ED] bg-[#F9F9FF] px-5 py-4 sm:px-6">
            <button
              type="submit"
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#1E3A5F] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#022448] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#1E3A5F]/30 cursor-pointer"
            >
              {editingTask ? (
                <>
                  <Save className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>حفظ التعديلات</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>إضافة المهمة</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#E2E6ED] bg-white px-5 py-2.5 text-sm font-semibold text-[#535D6C] transition-colors hover:border-[#CBD5E1] hover:text-[#191C22] cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
