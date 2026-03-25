import { useMemo, useState } from 'react';
import type {
  SortDirection,
  SortKey,
  Status,
  Task,
  UserPresence,
} from '../types';

interface ListViewProps {
  tasks: Task[];
  users: UserPresence[];
  onStatusChange: (taskId: string, status: Status) => void;
}

const ROW_HEIGHT = 58;
const VIEWPORT_HEIGHT = 420;
const BUFFER = 5;

const priorityRank: Record<Task['priority'], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const statuses: Status[] = ['todo', 'inprogress', 'inreview', 'done'];

function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDueLabel(endDate: string) {
  const today = stripTime(new Date());
  const due = stripTime(new Date(endDate));
  const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) {
    return { text: 'Due Today', className: 'due-today' };
  }

  if (diff < 0) {
    const overdueDays = Math.abs(diff);
    return {
      text: overdueDays > 7 ? `${overdueDays} days overdue` : `Overdue by ${overdueDays} day${overdueDays > 1 ? 's' : ''}`,
      className: 'due-danger',
    };
  }

  return {
    text: new Date(endDate).toLocaleDateString(),
    className: '',
  };
}

export function ListView({ tasks, users, onStatusChange }: ListViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>('endDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [scrollTop, setScrollTop] = useState(0);

  const sortedTasks = useMemo(() => {
    const nextTasks = [...tasks];

    nextTasks.sort((a, b) => {
      let result = 0;

      if (sortKey === 'title') {
        result = a.title.localeCompare(b.title);
      } else if (sortKey === 'priority') {
        result = priorityRank[a.priority] - priorityRank[b.priority];
      } else {
        result = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      }

      return sortDirection === 'asc' ? result : result * -1;
    });

    return nextTasks;
  }, [tasks, sortKey, sortDirection]);

  const visibleCount = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT);
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex = Math.min(sortedTasks.length, startIndex + visibleCount + BUFFER * 2);

  const visibleTasks = sortedTasks.slice(startIndex, endIndex);
  const topSpacerHeight = startIndex * ROW_HEIGHT;
  const bottomSpacerHeight = Math.max(0, (sortedTasks.length - endIndex) * ROW_HEIGHT);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(key);
    setSortDirection('asc');
  };

  return (
    <section className="list-view">
      <div className="list-header-row">
        <button type="button" className="sort-button" onClick={() => handleSort('title')}>
          Title {sortKey === 'title' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
        </button>

        <button type="button" className="sort-button" onClick={() => handleSort('priority')}>
          Priority {sortKey === 'priority' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
        </button>

        <div className="list-head-cell">Assignee</div>

        <button type="button" className="sort-button" onClick={() => handleSort('endDate')}>
          Due Date {sortKey === 'endDate' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
        </button>

        <div className="list-head-cell">Status</div>
      </div>

      <div
        className="list-viewport"
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        <div style={{ height: topSpacerHeight }} />

        {visibleTasks.length === 0 ? (
          <div className="empty-state">No tasks match the selected filters.</div>
        ) : (
          visibleTasks.map((task) => {
            const assignee = users.find((user) => user.id === task.assigneeId);
            const dueInfo = getDueLabel(task.endDate);

            return (
              <div key={task.id} className="list-row" style={{ height: ROW_HEIGHT }}>
                <div className="list-title-cell">
                  <strong>{task.title}</strong>
                  <span>{task.description}</span>
                </div>

                <div>
                  <span className={`priority-pill priority-${task.priority}`}>{task.priority}</span>
                </div>

                <div className="card-assignee">
                  <span className="task-avatar">{assignee?.avatar ?? 'NA'}</span>
                  <span>{assignee?.name ?? 'Unassigned'}</span>
                </div>

                <div className={dueInfo.className}>{dueInfo.text}</div>

                <select
                  className="status-select"
                  value={task.status}
                  onChange={(event) =>
                    onStatusChange(task.id, event.target.value as Status)
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            );
          })
        )}

        <div style={{ height: bottomSpacerHeight }} />
      </div>
    </section>
  );
}