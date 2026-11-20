import { AlertTriangle, CalendarClock, CheckCircle2 } from 'lucide-react';
import type { TaskCounts, TaskFilter } from '../types/task';

interface SummaryMetricsProps {
  counts: TaskCounts;
  activeFilter: TaskFilter;
  onSelectFilter: (filter: TaskFilter) => void;
}

export function SummaryMetrics({
  counts,
  activeFilter,
  onSelectFilter,
}: SummaryMetricsProps) {
  const cards: Array<{
    key: TaskFilter;
    label: string;
    value: number;
    hint: string;
    icon: typeof CalendarClock;
    iconBg: string;
    iconColor: string;
    activeBorder: string;
    alertBorder?: string;
  }> = [
    {
      key: 'upcoming',
      label: 'المهام القادمة',
      value: counts.upcoming,
      hint: 'تشمل مهام اليوم والمستقبل',
      icon: CalendarClock,
      iconBg: 'bg-[#EEF2F7]',
      iconColor: 'text-[#1E3A5F]',
      activeBorder: 'border-[#1E3A5F] ring-2 ring-[#1E3A5F]/15',
    },
    {
      key: 'overdue',
      label: 'المهام المتأخرة',
      value: counts.overdue,
      hint: counts.overdue > 0 ? 'تجاوزت موعد التسليم' : 'لا توجد مهام متأخرة',
      icon: AlertTriangle,
      iconBg: counts.overdue > 0 ? 'bg-[#FDF2F2]' : 'bg-[#F1F5F9]',
      iconColor: counts.overdue > 0 ? 'text-[#C23434]' : 'text-[#64748B]',
      activeBorder: 'border-[#C23434] ring-2 ring-[#C23434]/15',
      alertBorder: counts.overdue > 0 ? 'border-[#F8D7D7]' : undefined,
    },
    {
      key: 'completed',
      label: 'المهام المكتملة',
      value: counts.completed,
      hint:
        counts.total > 0
          ? `أُنجز ${counts.completed} من أصل ${counts.total}`
          : 'لم تُنجز مهام بعد',
      icon: CheckCircle2,
      iconBg: 'bg-[#EDF7F2]',
      iconColor: 'text-[#1E7E52]',
      activeBorder: 'border-[#1E7E52] ring-2 ring-[#1E7E52]/15',
    },
  ];

  return (
    <section aria-label="ملخص المهام" className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.key;
        const borderClass = isActive
          ? card.activeBorder
          : card.alertBorder ?? 'border-[#E2E6ED] hover:border-[#CBD5E1]';

        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelectFilter(isActive ? 'all' : card.key)}
            aria-pressed={isActive}
            className={`group flex items-center gap-4 rounded-2xl border bg-white p-4 sm:p-5 text-start transition-all duration-150 shadow-[0_1px_3px_rgba(28,31,38,0.04)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_-2px_rgba(28,31,38,0.07)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#1E3A5F]/25 cursor-pointer ${borderClass}`}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[#535D6C]">{card.label}</p>
              <p className="mt-0.5 text-2xl font-bold text-[#191C22] tabular-nums leading-tight">
                {card.value}
              </p>
              <p className="mt-0.5 truncate text-xs text-[#535D6C] tabular-nums">
                {card.hint}
              </p>
            </div>
          </button>
        );
      })}
    </section>
  );
}
