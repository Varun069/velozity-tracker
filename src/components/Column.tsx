import { TaskCard } from './TaskCard';
import type { Status, Task, UserPresence } from '../types';

interface ColumnProps {
  status: Status;
  title: string;
  tasks: Task[];
  users: UserPresence[];
  draggedTaskId: string | null;
  dragOverStatus: Status | null;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  onDragOverColumn: (status: Status) => void;
  onDropToColumn: (status: Status) => void;
}

export function Column({
  status,
  title,
  tasks,
  users,
  draggedTaskId,
  dragOverStatus,
  onDragStart,
  onDragEnd,
  onDragOverColumn,
  onDropToColumn,
}: ColumnProps) {
  const showOverlay = dragOverStatus === status && Boolean(draggedTaskId);

  return (
    <section
      className={`board-column ${showOverlay ? 'board-column-active' : ''}`}
      onDragOver={(event) => {
        event.preventDefault();
        onDragOverColumn(status);
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDropToColumn(status);
      }}
    >
      <div className="column-header">
        <h3>{title}</h3>
        <span>{tasks.length}</span>
      </div>

      {showOverlay && <div className="vision-overlay">Drop task here</div>}

      <div className="column-body">
        {tasks.length === 0 && <div className="empty-state">No tasks in this column.</div>}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            assignee={users.find((user) => user.id === task.assigneeId)}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={task.id === draggedTaskId}
          />
        ))}
      </div>
    </section>
  );
}