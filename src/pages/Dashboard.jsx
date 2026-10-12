import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBookings, getRooms, getTasks } from '../api.js';
import StatCard from '../components/StatCard.jsx';

export default function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Runs once when the page mounts
  useEffect(() => {
    Promise.all([getRooms(), getBookings(), getTasks()])
      .then(([r, b, t]) => {
        setRooms(r);
        setBookings(b);
        setTasks(t);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  const roomCount = (s) => rooms.filter((r) => r.status === s).length;
  const occupancy = rooms.length ? Math.round((roomCount('occupied') / rooms.length) * 100) : 0;

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="grid">
        <StatCard label="Total rooms" value={rooms.length} />
        <StatCard label="Available" value={roomCount('available')} />
        <StatCard label="Occupied" value={roomCount('occupied')} />
        <StatCard label="Being cleaned" value={roomCount('cleaning')} />
        <StatCard label="Maintenance" value={roomCount('maintenance')} />
        <StatCard label="Occupancy %" value={occupancy} />
        <StatCard label="Upcoming arrivals" value={bookings.filter((b) => b.status === 'reserved').length} />
        <StatCard label="Pending cleaning tasks" value={tasks.filter((t) => t.status !== 'done').length} />
      </div>
      <p>
        <Link to="/bookings">Manage bookings →</Link> · <Link to="/housekeeping">Housekeeping →</Link>
      </p>
    </div>
  );
}
