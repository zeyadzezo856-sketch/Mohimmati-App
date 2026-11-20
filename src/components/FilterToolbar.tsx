import { ArrowUpDown, BookOpen, Search, X } from 'lucide-react';
import type { TaskCounts, TaskFilter, TaskSort } from '../types/task';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  courseFilter: string;
  onCourseFilterChange: (course: string) => void;
  courses: string[];
  sort: TaskSort;
  onSortChange: (sort: TaskSort) => void;
  counts: TaskCounts;
}

export function FilterToolbar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  courseFilter,
  onCourseFilterChange,
  courses,
  sort,
  onSortChange,
  counts,
}: FilterToolbarProps) {
  const filterOptions: Array<{
    key: TaskFilter;
    label: string;
    count: number;
  }> = [
    { key: 'all', label: 'الكل', count: counts.total },
    { key: 'upcoming', label: 'القادمة', count: counts.upcoming },
    { key: 'overdue', label: 'متأخرة', count: counts.overdue },
    { key: 'in_progress', label: 'قيد التنفيذ', count: counts.inProgress },
    { key: 'not_started', label: 'لم تبدأ', count: counts.notStarted },
    { key: 'completed', label: 'مكتملة', count: counts.completed },
  ];

  return (
    <section aria-label="البحث والتصفية" className="space-y-3.5">
      {/* Search + Secondary Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#535D6C]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بعنوان المهمة أو اسم المقرر..."
            aria-label="ابحث بعنوان المهمة أو اسم المقرر"
            className="h-11 w-full rounded-xl border border-[#E2E6ED] bg-white pr-10 pl-10 text-sm text-[#191C22] placeholder:text-[#8C96A5] transition-colors focus:border-[#1E3A5F] focus:outline-none focus:ring-3 focus:ring-[#1E3A5F]/15"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="مسح نص البحث"
              className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#535D6C] transition-colors hover:bg-[#F1F3F7] hover:text-[#191C22] cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Course Filter & Sort Selectors */}
        <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
          <div className="relative flex-1 sm:flex-initial">
            <BookOpen
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#535D6C]"
              aria-hidden="true"
            />
            <select
              value={courseFilter}
              onChange={(e) => onCourseFilterChange(e.target.value)}
              disabled={courses.length === 0}
              aria-label="تصفية حسب المقرر"
              className="h-11 w-full appearance-none rounded-xl border border-[#E2E6ED] bg-white pr-9 pl-7 text-sm font-medium text-[#191C22] transition-colors focus:border-[#1E3A5F] focus:outline-none focus:ring-3 focus:ring-[#1E3A5F]/15 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer sm:w-auto"
            >
              <option value="">كل المقررات</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 sm:flex-initial">
            <ArrowUpDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#535D6C]"
              aria-hidden="true"
            />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as TaskSort)}
              aria-label="ترتيب المهام"
              className="h-11 w-full appearance-none rounded-xl border border-[#E2E6ED] bg-white pr-9 pl-7 text-sm font-medium text-[#191C22] transition-colors focus:border-[#1E3A5F] focus:outline-none focus:ring-3 focus:ring-[#1E3A5F]/15 cursor-pointer sm:w-auto"
            >
              <option value="due_asc">الأقرب موعداً</option>
              <option value="due_desc">الأبعد موعداً</option>
              <option value="created_desc">المضافة حديثاً</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Filter Tabs */}
      <div
        role="tablist"
        aria-label="تصفية المهام حسب الحالة"
        className="flex items-center gap-2 overflow-x-auto pb-1"
      >
        {filterOptions.map((option) => {
          const isActive = activeFilter === option.key;
          const isOverdueActive = isActive && option.key === 'overdue';

          return (
            <button
              key={option.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(option.key)}
              className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#1E3A5F]/20 ${
                isOverdueActive
                  ? 'border-[#C23434] bg-[#C23434] text-white font-semibold'
                  : isActive
                    ? 'border-[#1E3A5F] bg-[#1E3A5F] text-white font-semibold'
                    : 'border-[#E2E6ED] bg-white text-[#535D6C] hover:border-[#CBD5E1] hover:text-[#191C22]'
              }`}
            >
              <span>{option.label}</span>
              <span
                className={`tabular-nums text-xs ${
                  isActive ? 'text-white/90' : 'text-[#535D6C]'
                }`}
              >
                ({option.count})
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
