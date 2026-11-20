import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, HardDrive, X } from 'lucide-react';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';
import { FeedbackToast } from './components/FeedbackToast';
import { FilterToolbar } from './components/FilterToolbar';
import { Header } from './components/Header';
import { SummaryMetrics } from './components/SummaryMetrics';
import { TaskCard } from './components/TaskCard';
import { TaskDetailModal } from './components/TaskDetailModal';
import { TaskDrawer } from './components/TaskDrawer';
import type {
  FeedbackMessage,
  Task,
  TaskFilter,
  TaskFormValues,
  TaskSort,
  TaskStatus,
} from './types/task';
import { getTodayLocalISO } from './utils/dateUtils';
import {
  STATUS_LABELS,
  computeTaskCounts,
  extractUniqueCourses,
  filterAndSortTasks,
  generateTaskId,
} from './utils/taskLogic';
import { loadTasksFromStorage, saveTasksToStorage } from './utils/taskStorage';

export default function App() {
  const [initialLoad] = useState(() => loadTasksFromStorage());
  const [tasks, setTasks] = useState<Task[]>(initialLoad.tasks);
  const [storageWarning, setStorageWarning] = useState<string | null>(
    initialLoad.error
  );

  const [todayISO, setTodayISO] = useState<string>(() => getTodayLocalISO());

  // P1 Search, Filter & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');
  const [courseFilter, setCourseFilter] = useState('');
  const [sort, setSort] = useState<TaskSort>('due_asc');

  // Modals & Drawers state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTaskId, setViewingTaskId] = useState<string | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Feedback toast state
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);

  const showFeedback = useCallback(
    (type: FeedbackMessage['type'], text: string) => {
      setFeedback({
        id: `${Date.now()}-${Math.random()}`,
        type,
        text,
      });
    },
    []
  );

  // Auto-dismiss feedback toast
  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => {
      setFeedback(null);
    }, 3800);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  // Keep local calendar date synced if user keeps browser tab open across midnight
  useEffect(() => {
    const syncToday = () => {
      const next = getTodayLocalISO();
      setTodayISO((prev) => (prev === next ? prev : next));
    };

    const interval = window.setInterval(syncToday, 60_000);
    window.addEventListener('focus', syncToday);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', syncToday);
    };
  }, []);

  const persistTasks = useCallback(
    (nextTasks: Task[]): boolean => {
      const result = saveTasksToStorage(nextTasks);
      if (!result.ok && result.error) {
        setStorageWarning(result.error);
        showFeedback('error', result.error);
        return false;
      }
      return true;
    },
    [showFeedback]
  );

  const counts = useMemo(
    () => computeTaskCounts(tasks, todayISO),
    [tasks, todayISO]
  );

  const existingCourses = useMemo(() => extractUniqueCourses(tasks), [tasks]);

  // Clear course filter if that course no longer exists after edit/delete
  useEffect(() => {
    if (courseFilter && !existingCourses.includes(courseFilter)) {
      setCourseFilter('');
    }
  }, [courseFilter, existingCourses]);

  const visibleTasks = useMemo(
    () =>
      filterAndSortTasks(tasks, {
        filter: activeFilter,
        searchQuery,
        courseFilter,
        sort,
        todayISO,
      }),
    [tasks, activeFilter, searchQuery, courseFilter, sort, todayISO]
  );

  const viewingTask = useMemo(
    () => tasks.find((t) => t.id === viewingTaskId) ?? null,
    [tasks, viewingTaskId]
  );

  const handleOpenAddDrawer = () => {
    setEditingTask(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (task: Task) => {
    setEditingTask(task);
    setIsDrawerOpen(true);
  };

  const handleSaveTask = (
    values: TaskFormValues,
    existingTaskId?: string
  ): boolean => {
    const nowISO = new Date().toISOString();

    if (existingTaskId) {
      const nextTasks = tasks.map((task) =>
        task.id === existingTaskId
          ? {
              ...task,
              title: values.title,
              course: values.course,
              dueDate: values.dueDate,
              notes: values.notes,
              status: values.status,
              updatedAt: nowISO,
            }
          : task
      );
      setTasks(nextTasks);
      if (persistTasks(nextTasks)) {
        showFeedback('success', 'تم تحديث المهمة بنجاح.');
      }
      return true;
    }

    const newTask: Task = {
      id: generateTaskId(),
      title: values.title,
      course: values.course,
      dueDate: values.dueDate,
      notes: values.notes,
      status: values.status,
      createdAt: nowISO,
      updatedAt: nowISO,
    };

    const nextTasks = [newTask, ...tasks];
    setTasks(nextTasks);
    if (persistTasks(nextTasks)) {
      showFeedback('success', 'تمت إضافة المهمة بنجاح.');
    }
    return true;
  };

  const handleChangeStatus = (task: Task, nextStatus: TaskStatus) => {
    if (task.status === nextStatus) return;

    const nowISO = new Date().toISOString();
    const nextTasks = tasks.map((item) =>
      item.id === task.id
        ? { ...item, status: nextStatus, updatedAt: nowISO }
        : item
    );
    setTasks(nextTasks);

    if (persistTasks(nextTasks)) {
      showFeedback(
        'success',
        `تم تغيير حالة «${task.title}» إلى ${STATUS_LABELS[nextStatus]}.`
      );
    }
  };

  const handleToggleComplete = (task: Task) => {
    const nextStatus: TaskStatus =
      task.status === 'completed' ? 'not_started' : 'completed';
    handleChangeStatus(task, nextStatus);
  };

  const handleConfirmDelete = (task: Task) => {
    const nextTasks = tasks.filter((item) => item.id !== task.id);
    setTasks(nextTasks);
    setDeletingTask(null);
    if (viewingTaskId === task.id) {
      setViewingTaskId(null);
    }

    if (persistTasks(nextTasks)) {
      showFeedback('success', `تم حذف المهمة «${task.title}».`);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveFilter('all');
    setCourseFilter('');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F9FF] text-[#191C22]">
      <Header todayISO={todayISO} onAddTask={handleOpenAddDrawer} />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Storage Warning / Corrupted Data Recovery Banner */}
          {storageWarning && (
            <div
              role="alert"
              className="flex items-start justify-between gap-3 rounded-2xl border border-[#F8D7D7] bg-[#FDF2F2] px-4 py-3.5 text-sm text-[#C23434]"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p className="font-medium leading-relaxed">{storageWarning}</p>
              </div>
              <button
                type="button"
                onClick={() => setStorageWarning(null)}
                aria-label="إغلاق تنبيه التخزين"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-black/5 cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Page Intro & Browser-Only Storage Context */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#191C22] leading-tight">
              مهامك الدراسية
            </h1>
            <p className="text-sm text-[#535D6C]">
              رتّب واجباتك ومواعيد التسليم حسب الأولوية — تُحفظ جميع المهام محلياً في هذا المتصفح فقط.
            </p>
          </div>

          {/* Summary Metrics (P1 Counts) */}
          <SummaryMetrics
            counts={counts}
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
          />

          {/* Search, Filter Tabs, Course Filter & Sort */}
          {tasks.length > 0 && (
            <FilterToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              courseFilter={courseFilter}
              onCourseFilterChange={setCourseFilter}
              courses={existingCourses}
              sort={sort}
              onSortChange={setSort}
              counts={counts}
            />
          )}

          {/* Task List / Empty / No-Results */}
          <section aria-label="قائمة المهام">
            {tasks.length === 0 ? (
              <EmptyState
                variant="empty"
                onAddTask={handleOpenAddDrawer}
                onResetFilters={handleResetFilters}
              />
            ) : visibleTasks.length === 0 ? (
              <EmptyState
                variant="no-results"
                onAddTask={handleOpenAddDrawer}
                onResetFilters={handleResetFilters}
              />
            ) : (
              <div className="space-y-3">
                {visibleTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    todayISO={todayISO}
                    onToggleComplete={handleToggleComplete}
                    onChangeStatus={handleChangeStatus}
                    onView={(t) => setViewingTaskId(t.id)}
                    onEdit={handleOpenEditDrawer}
                    onDelete={setDeletingTask}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Local-Only Persistence Notice Footer */}
      <footer className="border-t border-[#E2E6ED] bg-white/70">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-[#535D6C] sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-center sm:text-start">
            <HardDrive className="h-3.5 w-3.5 shrink-0 text-[#1E3A5F]" aria-hidden="true" />
            <span>
              تُحفظ بياناتك محلياً في هذا المتصفح فقط ولا تتم مزامنتها مع أجهزة أخرى.
            </span>
          </div>
          <span className="tabular-nums text-[#535D6C]">
            مهمّتي · {counts.total} {counts.total === 1 ? 'مهمة' : 'مهام'} محفوظة
          </span>
        </div>
      </footer>

      {/* Add / Edit Task Drawer */}
      <TaskDrawer
        isOpen={isDrawerOpen}
        editingTask={editingTask}
        todayISO={todayISO}
        existingCourses={existingCourses}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />

      {/* Task Details View Modal */}
      <TaskDetailModal
        task={viewingTask}
        todayISO={todayISO}
        onClose={() => setViewingTaskId(null)}
        onEdit={handleOpenEditDrawer}
        onDelete={setDeletingTask}
        onChangeStatus={handleChangeStatus}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        task={deletingTask}
        onCancel={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Success / Error Feedback Toast */}
      <FeedbackToast feedback={feedback} onDismiss={() => setFeedback(null)} />
    </div>
  );
}
