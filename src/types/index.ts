export type Status = 'todo' | 'inprogress' | 'inreview' | 'done';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type ViewMode = 'kanban' | 'list' | 'timeline';
export type SortKey = 'title' | 'priority' | 'endDate';
export type SortDirection = 'asc' | 'desc';

export type UserPresence = {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  status: Status;
  priority: Priority;
  progress: number;
  startDate: string | null;
  endDate: string;
};

export type Filters = {
  statuses: Status[];
  priorities: Priority[];
  assigneeIds: string[];
  dateFrom: string;
  dateTo: string;
};

export type DragState = {
  taskId: string | null;
  overStatus: Status | null;
};