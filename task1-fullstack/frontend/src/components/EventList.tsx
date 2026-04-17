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
    <ul className="event-list">
      {events.map((event) => (
        <li key={event.id} className="event-list__item">
          <span className="event-list__name">{event.name}</span>
          <span className="event-list__detail">
            {" "}
            — {formatDateOrDateTime(event.eventDate)} @ {event.location}
          </span>
          <span className="event-list__detail"> (capacity {event.capacity})</span>
        </li>
      ))}
    </ul>
  );
}
