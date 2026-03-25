import type { ViewMode } from '../types';

interface ViewTabsProps {
  value: ViewMode;
  onChange: (view: ViewMode) => void;
}

const views: Array<{ label: string; value: ViewMode }> = [
  { label: 'Kanban', value: 'kanban' },
  { label: 'List', value: 'list' },
  { label: 'Timeline', value: 'timeline' },
];

export function ViewTabs({ value, onChange }: ViewTabsProps) {
  return (
    <div className="view-tabs">
      {views.map((view) => (
        <button
          key={view.value}
          type="button"
          className={`view-tab ${value === view.value ? 'active' : ''}`}
          onClick={() => onChange(view.value)}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}