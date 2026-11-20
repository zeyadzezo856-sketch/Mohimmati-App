import { useEffect } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import type { Task } from '../types/task';

interface DeleteConfirmModalProps {
  task: Task | null;
  onCancel: () => void;
  onConfirm: (task: Task) => void;
}

export function DeleteConfirmModal({
  task,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    if (!task) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [task, onCancel]);

  if (!task) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
    >
      <div
        className="fixed inset-0 bg-[#1C1F26]/45 backdrop-blur-[2px]"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#E2E6ED] bg-white p-6 shadow-[0_16px_32px_-8px_rgba(28,31,38,0.16)]">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FDF2F2] text-[#C23434]">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="delete-confirm-title"
              className="text-lg font-bold text-[#191C22]"
            >
              تأكيد حذف المهمة
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#535D6C]">
              هل أنت متأكد من حذف المهمة{' '}
              <span className="font-semibold text-[#191C22]">
                «{task.title}»
              </span>
              ؟ لا يمكن التراجع عن هذا الإجراء بعد التنفيذ.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-[#E2E6ED] bg-white px-4 py-2 text-sm font-semibold text-[#535D6C] transition-colors hover:border-[#CBD5E1] hover:text-[#191C22] cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={() => onConfirm(task)}
            className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-[#C23434] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#A62828] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#C23434]/30 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            <span>حذف المهمة</span>
          </button>
        </div>
      </div>
    </div>
  );
}
