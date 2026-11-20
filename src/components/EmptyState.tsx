import { Plus, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  variant: 'empty' | 'no-results';
  onAddTask: () => void;
  onResetFilters: () => void;
}

export function EmptyState({
  variant,
  onAddTask,
  onResetFilters,
}: EmptyStateProps) {
  if (variant === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E2E6ED] bg-white px-6 py-14 text-center shadow-[0_1px_3px_rgba(28,31,38,0.04)]">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#F1F5F9] text-[#535D6C]">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            className="h-10 w-10"
            aria-hidden="true"
          >
            <circle
              cx="28"
              cy="28"
              r="16"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <path
              d="M40 40L52 52"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M22 28H34"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-[#191C22]">
          لا توجد مهام مطابقة
        </h2>
        <p className="mt-1.5 max-w-md text-sm text-[#535D6C]">
          لم نجد مهام تطابق كلمات البحث أو التصفية المحددة حالياً. جرّب تعديل البحث أو إظهار جميع المهام.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[#E2E6ED] bg-[#F9F9FF] px-4 py-2 text-sm font-semibold text-[#1E3A5F] transition-colors hover:border-[#CBD5E1] hover:bg-[#F1F3F7] cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>إعادة ضبط البحث والتصفية</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E2E6ED] bg-white px-6 py-16 text-center shadow-[0_1px_3px_rgba(28,31,38,0.04)]">
      <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[#F1F5F9] text-[#1E3A5F]">
        <svg
          viewBox="0 0 80 80"
          fill="none"
          className="h-12 w-12"
          aria-hidden="true"
        >
          <rect
            x="16"
            y="14"
            width="48"
            height="54"
            rx="8"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            d="M28 28H52"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M28 40H52"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M28 52H42"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle
            cx="56"
            cy="56"
            r="12"
            fill="#EDF7F2"
            stroke="#1E7E52"
            strokeWidth="2.5"
          />
          <path
            d="M51.5 56L54.5 59L60.5 53"
            stroke="#1E7E52"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-[#191C22]">
        لا توجد مهام حالياً
      </h2>
      <p className="mt-2 max-w-md text-sm text-[#535D6C]">
        أنت على المسار الصحيح! ابدأ بإضافة واجباتك أو مشاريعك الدراسية ومواعيد تسليمها لمتابعتها بسهولة في هذا المتصفح.
      </p>
      <button
        type="button"
        onClick={onAddTask}
        className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#1E3A5F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#022448] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#1E3A5F]/25 cursor-pointer"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        <span>أضف مهمتك الأولى</span>
      </button>
    </div>
  );
}
