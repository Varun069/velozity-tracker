import type { Task, UserPresence } from '../types';

interface TaskCardProps {
  task: Task;
  assignee?: UserPresence;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  isDragging?: boolean;
}

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
      text: overdueDays > 7 ? `${overdueDays} days overdue` : `Overdue`,
      className: 'due-danger',
    };
  }

  return {
    text: new Date(endDate).toLocaleDateString(),
    className: '',
  };
}

export function TaskCard({
  task,
  assignee,
  onDragStart,
  onDragEnd,
  isDragging = false,
}: TaskCardProps) {
  const dueInfo = getDueLabel(task.endDate);

  return (
    <article
      className={`rogers-card ${isDragging ? 'rogers-card-dragging' : ''}`}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', task.id);
        onDragStart(task.id);
      }}
      onDragEnd={onDragEnd}
    >
      <div className="card-top-row">
        <span className={`badge badge-${task.priority}`}>{task.priority}</span>
        <span>{task.progress}%</span>
      </div>

      <h3>{task.title}</h3>
      <p>{task.description}</p>

      <div className="card-footer-row">
        <div className="card-assignee">
          <span className="task-avatar">{assignee?.avatar ?? 'NA'}</span>
          <div>
            <small>Assignee</small>
            <strong>{assignee?.name ?? 'Unassigned'}</strong>
          </div>
        </div>

        <div>
          <small>Due</small>
          <strong className={dueInfo.className}>{dueInfo.text}</strong>
        </div>
      </div>
    </article>
  );
}