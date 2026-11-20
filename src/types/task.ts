export type TaskStatus = 'not_started' | 'in_progress' | 'completed';

export type TaskFilter =
  | 'all'
  | 'upcoming'
  | 'overdue'
  | 'in_progress'
  | 'not_started'
  | 'completed';

export type TaskSort = 'due_asc' | 'due_desc' | 'created_desc';

export interface Task {
  id: string;
  title: string;
  course: string;
  dueDate: string; // YYYY-MM-DD
  notes: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormValues {
  title: string;
  course: string;
  dueDate: string;
  notes: string;
  status: TaskStatus;
}

export interface TaskCounts {
  total: number;
  upcoming: number;
  overdue: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}

export interface FeedbackMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}
