import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';

// Props: room (object)
export default function RoomCard({ room }) {
  return (
    <div className="card">
      <h3>
        <Link to={`/rooms/${room.id}`}>Room {room.number}</Link>
      </h3>
      <p className="capitalize">{room.type} · Floor {room.floor}</p>
      <p>₹{room.price} / night</p>
      <StatusBadge status={room.status} />
    </div>
  );
}
