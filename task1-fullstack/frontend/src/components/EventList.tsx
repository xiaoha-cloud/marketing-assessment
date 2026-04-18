import { formatDateOrDateTime } from "../utils/formatDate.js";
import type { Event } from "../types/campaign.js";

type EventListProps = {
  events: Event[];
};

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return <p className="m-0 text-[0.88rem] leading-snug text-muted">No events scheduled.</p>;
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-4 p-0" role="list">
      {events.map((event) => (
        <li
          key={event.id}
          className="border-b border-ink/10 pb-4 last:border-b-0 last:pb-0"
        >
          <div className="mb-1.5 text-[0.95rem] font-bold leading-snug text-ink">{event.name}</div>
          <div className="text-[0.82rem] leading-snug text-muted">
            <span>{formatDateOrDateTime(event.eventDate)}</span>
            <span className="mx-1.5" aria-hidden="true">
              ·
            </span>
            <span>{event.location}</span>
            <span className="mx-1.5" aria-hidden="true">
              ·
            </span>
            <span>Capacity {event.capacity}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
