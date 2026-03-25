import { useEffect, useMemo, useState } from 'react';
import { AvatarBar } from './components/AvatarBar';
import { Board } from './components/Board';
import { FiltersBar } from './components/FiltersBar';
import { ListView } from './components/ListView';
import { Timeline } from './components/Timeline';
import { ViewTabs } from './components/ViewTabs';
import { tasks as initialTasks, users } from './data/mockData';
import type {
  DragState,
  Filters,
  Priority,
  Status,
  Task,
  ViewMode,
} from './types';

const allStatuses: Status[] = ['todo', 'inprogress', 'inreview', 'done'];
const allPriorities: Priority[] = ['critical', 'high', 'medium', 'low'];

const defaultFilters: Filters = {
  statuses: [],
  priorities: [],
  assigneeIds: [],
  dateFrom: '',
  dateTo: '',
};

function parseFiltersFromUrl(): Filters {
  const params = new URLSearchParams(window.location.search);

  const statusParam = params.get('status')?.split(',').filter(Boolean) ?? [];
  const priorityParam = params.get('priority')?.split(',').filter(Boolean) ?? [];
  const assigneeParam = params.get('assignee')?.split(',').filter(Boolean) ?? [];

  return {
    statuses: statusParam.filter((item): item is Status =>
      allStatuses.includes(item as Status),
    ),
    priorities: priorityParam.filter((item): item is Priority =>
      allPriorities.includes(item as Priority),
    ),
    assigneeIds: assigneeParam,
    dateFrom: params.get('from') ?? '',
    dateTo: params.get('to') ?? '',
  };
}

function parseViewFromUrl(): ViewMode {
  const value = new URLSearchParams(window.location.search).get('view');
  return value === 'list' || value === 'timeline' ? value : 'kanban';
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filters, setFilters] = useState<Filters>(() => parseFiltersFromUrl());
  const [view, setView] = useState<ViewMode>(() => parseViewFromUrl());
  const [dragState, setDragState] = useState<DragState>({
    taskId: null,
    overStatus: null,
  });

  useEffect(() => {
    const params = new URLSearchParams();

    if (view !== 'kanban') params.set('view', view);
    if (filters.statuses.length) params.set('status', filters.statuses.join(','));
    if (filters.priorities.length) params.set('priority', filters.priorities.join(','));
    if (filters.assigneeIds.length) params.set('assignee', filters.assigneeIds.join(','));
    if (filters.dateFrom) params.set('from', filters.dateFrom);
    if (filters.dateTo) params.set('to', filters.dateTo);

    const query = params.toString();
    const nextUrl = query ? `?${query}` : window.location.pathname;

    window.history.replaceState(null, '', nextUrl);
  }, [filters, view]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const statusMatch =
        filters.statuses.length === 0 || filters.statuses.includes(task.status);

      const priorityMatch =
        filters.priorities.length === 0 || filters.priorities.includes(task.priority);

      const assigneeMatch =
        filters.assigneeIds.length === 0 || filters.assigneeIds.includes(task.assigneeId);

      const dueTime = new Date(task.endDate).getTime();
      const fromTime = filters.dateFrom ? new Date(filters.dateFrom).getTime() : null;
      const toTime = filters.dateTo ? new Date(filters.dateTo).getTime() : null;

      const fromMatch = fromTime === null || dueTime >= fromTime;
      const toMatch = toTime === null || dueTime <= toTime;

      return statusMatch && priorityMatch && assigneeMatch && fromMatch && toMatch;
    });
  }, [tasks, filters]);

  const handleTaskStatusChange = (taskId: string, status: Status) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      ),
    );
  };

  const handleDragStart = (taskId: string) => {
    setDragState({ taskId, overStatus: null });
  };

  const handleDragEnd = () => {
    setDragState({ taskId: null, overStatus: null });
  };

  const handleDragOverColumn = (status: Status) => {
    setDragState((current) => ({ ...current, overStatus: status }));
  };

  const handleDropToColumn = (status: Status) => {
    if (!dragState.taskId) return;

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === dragState.taskId ? { ...task, status } : task,
      ),
    );

    setDragState({ taskId: null, overStatus: null });
  };

  return (
    <main className="app-shell">
      <AvatarBar users={users} />

      <ViewTabs value={view} onChange={setView} />

      <FiltersBar filters={filters} users={users} onChange={setFilters} />

      {view === 'kanban' && (
        <Board
          tasks={filteredTasks}
          users={users}
          dragState={dragState}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOverColumn={handleDragOverColumn}
          onDropToColumn={handleDropToColumn}
        />
      )}

      {view === 'list' && (
        <ListView
          tasks={filteredTasks}
          users={users}
          onStatusChange={handleTaskStatusChange}
        />
      )}

      {view === 'timeline' && <Timeline tasks={filteredTasks} />}
    </main>
  );
}