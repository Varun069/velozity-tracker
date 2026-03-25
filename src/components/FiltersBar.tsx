import type { Filters, Priority, Status, UserPresence } from '../types';

interface FiltersBarProps {
  filters: Filters;
  users: UserPresence[];
  onChange: (filters: Filters) => void;
}

const statuses: Status[] = ['todo', 'inprogress', 'inreview', 'done'];
const priorities: Priority[] = ['critical', 'high', 'medium', 'low'];

function toggleValue<T extends string>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function FiltersBar({ filters, users, onChange }: FiltersBarProps) {
  const hasActiveFilters =
    filters.statuses.length > 0 ||
    filters.priorities.length > 0 ||
    filters.assigneeIds.length > 0 ||
    Boolean(filters.dateFrom) ||
    Boolean(filters.dateTo);

  return (
    <div className="cage-filters">
      <div className="filter-group">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            className={filters.statuses.includes(status) ? 'storm-chip' : ''}
            onClick={() =>
              onChange({
                ...filters,
                statuses: toggleValue(filters.statuses, status),
              })
            }
          >
            {status}
          </button>
        ))}
      </div>

      <div className="filter-group">
        {priorities.map((priority) => (
          <button
            key={priority}
            type="button"
            className={filters.priorities.includes(priority) ? 'storm-chip' : ''}
            onClick={() =>
              onChange({
                ...filters,
                priorities: toggleValue(filters.priorities, priority),
              })
            }
          >
            {priority}
          </button>
        ))}
      </div>

      <div className="filter-group">
        {users.map((user) => (
          <button
            key={user.id}
            type="button"
            className={filters.assigneeIds.includes(user.id) ? 'storm-chip' : ''}
            onClick={() =>
              onChange({
                ...filters,
                assigneeIds: toggleValue(filters.assigneeIds, user.id),
              })
            }
          >
            {user.avatar}
          </button>
        ))}
      </div>

      <input
        type="date"
        value={filters.dateFrom}
        onChange={(event) => onChange({ ...filters, dateFrom: event.target.value })}
      />

      <input
        type="date"
        value={filters.dateTo}
        onChange={(event) => onChange({ ...filters, dateTo: event.target.value })}
      />

      {hasActiveFilters && (
        <button
          type="button"
          className="xavier-clear"
          onClick={() =>
            onChange({
              statuses: [],
              priorities: [],
              assigneeIds: [],
              dateFrom: '',
              dateTo: '',
            })
          }
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}