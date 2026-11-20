import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import type { FeedbackMessage } from '../types/task';

interface FeedbackToastProps {
  feedback: FeedbackMessage | null;
  onDismiss: () => void;
}

export function FeedbackToast({ feedback, onDismiss }: FeedbackToastProps) {
  if (!feedback) {
    return null;
  }

  const styles = {
    success: {
      container: 'border-[#D0EDE0] bg-[#EDF7F2] text-[#1E7E52]',
      icon: CheckCircle2,
    },
    error: {
      container: 'border-[#F8D7D7] bg-[#FDF2F2] text-[#C23434]',
      icon: AlertCircle,
    },
    info: {
      container: 'border-[#D3ECEE] bg-[#EBF5F6] text-[#2E7278]',
      icon: Info,
    },
  }[feedback.type];

  const Icon = styles.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md sm:left-6 sm:right-auto sm:w-auto sm:min-w-[320px]"
    >
      <div
        className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-[0_8px_24px_-4px_rgba(28,31,38,0.12)] ${styles.container}`}
      >
        <div className="flex items-center gap-2.5 text-sm font-medium">
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{feedback.text}</span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="إغلاق التنبيه"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-black/5 cursor-pointer"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
