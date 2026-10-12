import StatusBadge from './StatusBadge.jsx';

// Props: booking (object), onStatusChange (function(id, newStatus))
export default function BookingRow({ booking, onStatusChange }) {
  return (
    <tr>
      <td>{booking.guestName}</td>
      <td>{booking.room ? booking.room.number : booking.roomId}</td>
      <td>{booking.checkIn}</td>
      <td>{booking.checkOut}</td>
      <td><StatusBadge status={booking.status} /></td>
      <td>
        {booking.status === 'reserved' && (
          <>
            <button onClick={() => onStatusChange(booking.id, 'checked-in')}>Check in</button>{' '}
            <button className="danger" onClick={() => onStatusChange(booking.id, 'cancelled')}>Cancel</button>
          </>
        )}
        {booking.status === 'checked-in' && (
          <button onClick={() => onStatusChange(booking.id, 'checked-out')}>Check out</button>
        )}
      </td>
    </tr>
  );
}
