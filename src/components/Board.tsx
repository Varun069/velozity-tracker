import { Column } from './Column';
import type { DragState, Status, Task, UserPresence } from '../types';

interface BoardProps {
  tasks: Task[];
  users: UserPresence[];
  dragState: DragState;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  onDragOverColumn: (status: Status) => void;
  onDropToColumn: (status: Status) => void;
}

const columns: Array<{ key: Status; label: string }> = [
  { key: 'todo', label: 'Todo' },
  { key: 'inprogress', label: 'In Progress' },
  { key: 'inreview', label: 'In Review' },
  { key: 'done', label: 'Done' },
];

export function Board({
  tasks,
  users,
  dragState,
  onDragStart,
  onDragEnd,
  onDragOverColumn,
  onDropToColumn,
}: BoardProps) {
  return (
    <div id="stark-board" className="board-four">
      {columns.map((column) => (
        <Column
          key={column.key}
          status={column.key}
          title={column.label}
          tasks={tasks.filter((task) => task.status === column.key)}
          users={users}
          draggedTaskId={dragState.taskId}
          dragOverStatus={dragState.overStatus}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOverColumn={onDragOverColumn}
          onDropToColumn={onDropToColumn}
        />
      ))}
    </div>
  );
}