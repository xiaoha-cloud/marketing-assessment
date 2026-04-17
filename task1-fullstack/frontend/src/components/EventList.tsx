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
        <li key={event.id}>
          <strong>{event.name}</strong>
          <span>
            {" "}
            — {event.eventDate} @ {event.location}
          </span>
          <span> (capacity {event.capacity})</span>
        </li>
      ))}
    </ul>
  );
}
