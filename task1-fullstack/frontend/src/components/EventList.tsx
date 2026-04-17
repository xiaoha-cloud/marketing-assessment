import { formatDateOrDateTime } from "../utils/formatDate.js";
import type { Event } from "../types/campaign.js";

type EventListProps = {
  events: Event[];
};

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return <p className="event-list-empty">No events scheduled.</p>;
  }

  return (
    <ul className="event-list" role="list">
      {events.map((event) => (
        <li key={event.id} className="event-list__item">
          <div className="event-list__title">{event.name}</div>
          <div className="event-list__meta">
            <span>{formatDateOrDateTime(event.eventDate)}</span>
            <span className="event-list__meta-sep" aria-hidden="true">
              ·
            </span>
            <span>{event.location}</span>
            <span className="event-list__meta-sep" aria-hidden="true">
              ·
            </span>
            <span>Capacity {event.capacity}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
