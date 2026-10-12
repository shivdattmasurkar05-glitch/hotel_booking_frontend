import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getRoom } from '../api.js';
import StatusBadge from '../components/StatusBadge.jsx';

export default function RoomDetail() {
  const { id } = useParams();          // from the route /rooms/:id
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Re-fetch whenever the :id changes
  useEffect(() => {
    setLoading(true);
    getRoom(id)
      .then(setRoom)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error} <Link to="/rooms">Back</Link></p>;

  return (
    <div>
      <Link to="/rooms">← All rooms</Link>
      <h2>Room {room.number} <StatusBadge status={room.status} /></h2>
      <p className="capitalize">{room.type} · Floor {room.floor} · ₹{room.price} / night</p>

      <h3>Bookings</h3>
      {room.bookings.length === 0 ? <p className="muted">No bookings.</p> : (
        <ul>
          {room.bookings.map((b) => (
            <li key={b.id}>{b.guestName}: {b.checkIn} → {b.checkOut} <StatusBadge status={b.status} /></li>
          ))}
        </ul>
      )}

      <h3>Housekeeping tasks</h3>
      {room.tasks.length === 0 ? <p className="muted">No tasks.</p> : (
        <ul>
          {room.tasks.map((t) => (
            <li key={t.id}>{t.task} ({t.assignedTo}) <StatusBadge status={t.status} /></li>
          ))}
        </ul>
      )}
    </div>
  );
}
