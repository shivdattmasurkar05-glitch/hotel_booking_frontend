import { useEffect, useState } from 'react';
import { getRooms } from '../api.js';
import RoomCard from '../components/RoomCard.jsx';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Re-fetch whenever a filter changes
  useEffect(() => {
    setLoading(true);
    getRooms(status, type)
      .then(setRooms)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [status, type]);

  return (
    <div>
      <h2>Rooms</h2>
      <div className="filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="cleaning">Cleaning</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="suite">Suite</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : rooms.length === 0 ? (
        <p className="muted">No rooms match these filters.</p>
      ) : (
        <div className="grid">
          {rooms.map((r) => <RoomCard key={r.id} room={r} />)}
        </div>
      )}
    </div>
  );
}
