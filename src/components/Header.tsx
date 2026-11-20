import { BookOpenCheck, Plus } from 'lucide-react';
import { formatArabicDate } from '../utils/dateUtils';

interface HeaderProps {
  todayISO: string;
  onAddTask: () => void;
}

export function Header({ todayISO, onAddTask }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E2E6ED] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E3A5F] text-white shadow-xs">
            <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold text-[#191C22] whitespace-nowrap">
            مهمّتي
          </span>
        </div>

        {/* Contextual Date Reference (Desktop/Tablet) */}
        <div className="hidden md:flex items-center text-sm text-[#535D6C] whitespace-nowrap tabular-nums">
          <span>اليوم: {formatArabicDate(todayISO)}</span>
        </div>

        {/* Primary Action */}
        <button
          type="button"
          onClick={onAddTask}
          className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-[#1E3A5F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#022448] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#1E3A5F]/30 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>إضافة مهمة</span>
        </button>
      </div>
    </header>
  );
}
