import type { Task, UserPresence } from '../types';

export const users: UserPresence[] = [
  { id: 'u1', name: 'Tony Stark', avatar: 'TS', online: true },
  { id: 'u2', name: 'Steve Rogers', avatar: 'SR', online: true },
  { id: 'u3', name: 'Natasha Romanoff', avatar: 'NR', online: true },
  { id: 'u4', name: 'Bruce Banner', avatar: 'BB', online: false },
  { id: 'u5', name: 'Wanda Maximoff', avatar: 'WM', online: true },
];

const statuses: Task['status'][] = ['todo', 'inprogress', 'inreview', 'done'];
const priorities: Task['priority'][] = ['critical', 'high', 'medium', 'low'];

const titles = [
  'User research synthesis',
  'Refactor header navigation',
  'Payment retry flow',
  'New onboarding screen',
  'Bug bash checklist',
  'Analytics tracking cleanup',
  'Lead dashboard filters',
  'Invoice export API',
  'Performance audit',
  'QA regression pack',
  'Customer support workflow',
  'Billing settings refresh',
];

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

const baseDate = new Date('2026-03-01T00:00:00');

export const tasks: Task[] = Array.from({ length: 520 }, (_, index) => {
  const startShift = (index * 3) % 40 - 12;
  const duration = (index % 6) + 1;

  const start = addDays(baseDate, startShift);
  const due = addDays(start, duration);

  return {
    id: `task-${index + 1}`,
    title: `${titles[index % titles.length]} #${index + 1}`,
    description: 'Frontend task for planning, delivery and QA tracking.',
    assigneeId: users[index % users.length].id,
    status: statuses[index % statuses.length],
    priority: priorities[index % priorities.length],
    progress: ((index * 11) % 91) + 5,
    startDate: index % 8 === 0 ? null : start.toISOString(),
    endDate: due.toISOString(),
  };
});