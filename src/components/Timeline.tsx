import { useMemo, useState } from 'react';
import type { Task } from '../types';

interface TimelineProps {
  tasks: Task[];
}

const ROW_HEIGHT = 56;
const VIEWPORT_HEIGHT = 360;
const BUFFER = 4;

function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dayDiff(from: Date, to: Date) {
  return Math.round(
    (stripTime(to).getTime() - stripTime(from).getTime()) / (1000 * 60 * 60 * 24),
  );
}

export function Timeline({ tasks }: TimelineProps) {
  const [scrollTop, setScrollTop] = useState(0);

  const today = stripTime(new Date());
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const dayCount = monthEnd.getDate();

  const visibleCount = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT);
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex = Math.min(tasks.length, startIndex + visibleCount + BUFFER * 2);

  const visibleTasks = tasks.slice(startIndex, endIndex);
  const topSpacerHeight = startIndex * ROW_HEIGHT;
  const bottomSpacerHeight = Math.max(0, (tasks.length - endIndex) * ROW_HEIGHT);

  const days = useMemo(
    () =>
      Array.from({ length: dayCount }, (_, index) => {
        const date = new Date(monthStart);
        date.setDate(monthStart.getDate() + index);
        return date;
      }),
    [dayCount, monthStart],
  );

  const todayOffset = dayDiff(monthStart, today);

  return (
    <section className="thor-timeline">
      <div className="timeline-header">
        <div>
          <p className="eyebrow">Timeline view</p>
          <h2>Current month delivery plan</h2>
        </div>
        <p>{tasks.length} filtered tasks</p>
      </div>

      <div className="timeline-scroll-x">
        <div className="timeline-canvas">
          <div className="timeline-grid-header">
            <div className="timeline-title-col">Task</div>
            <div className="timeline-days-col">
              {days.map((day) => (
                <span key={day.toISOString()}>{day.getDate()}</span>
              ))}
            </div>
          </div>

          <div
            className="pym-viewport"
            onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
          >
            <div className="wasp-spacer" style={{ height: topSpacerHeight }} />

            {visibleTasks.map((task) => {
              const effectiveStart = task.startDate ? new Date(task.startDate) : new Date(task.endDate);
              const startOffset = Math.max(0, dayDiff(monthStart, effectiveStart));
              const endOffset = Math.max(startOffset + 1, dayDiff(monthStart, new Date(task.endDate)) + 1);

              const left = (startOffset / dayCount) * 100;
              const width = Math.max((1 / dayCount) * 100, ((endOffset - startOffset) / dayCount) * 100);

              return (
                <div key={task.id} className="antman-row" style={{ height: ROW_HEIGHT }}>
                  <div className="timeline-title-col">
                    <strong>{task.title}</strong>
                    <span>{task.priority} priority</span>
                  </div>

                  <div className="timeline-days-col row-track">
                    <div
                      className="today-line"
                      style={{ left: `${(todayOffset / dayCount) * 100}%` }}
                    />

                    <div
                      className={`timeline-bar ${task.priority}`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      {task.id}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="wasp-spacer" style={{ height: bottomSpacerHeight }} />
          </div>
        </div>
      </div>
    </section>
  );
}