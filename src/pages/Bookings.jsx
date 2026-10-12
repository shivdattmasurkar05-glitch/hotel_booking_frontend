import { useEffect, useState } from 'react';
import { addBooking, getBookings, getRooms, updateBookingStatus } from '../api.js';
import BookingRow from '../components/BookingRow.jsx';

const emptyForm = { guestName: '', roomId: '', checkIn: '', checkOut: '' };

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Loads both lists (called on mount and after every change)
  const loadData = async () => {
    try {
      const [b, r] = await Promise.all([getBookings(), getRooms('available')]);
      setBookings(b);
      setAvailableRooms(r);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBooking(form);
      setForm(emptyForm);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Passed down to BookingRow as a prop
  const handleStatusChange = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Bookings</h2>

      <form className="card form" onSubmit={handleSubmit}>
        <h3>New booking</h3>
        <input name="guestName" placeholder="Guest name" value={form.guestName} onChange={handleChange} required />
        <select name="roomId" value={form.roomId} onChange={handleChange} required>
          <option value="">-- select available room --</option>
          {availableRooms.map((r) => (
            <option key={r.id} value={r.id}>Room {r.number} ({r.type}, ₹{r.price})</option>
          ))}
        </select>
        <label>Check-in <input type="date" name="checkIn" value={form.checkIn} onChange={handleChange} required /></label>
        <label>Check-out <input type="date" name="checkOut" value={form.checkOut} onChange={handleChange} required /></label>
        <button type="submit">Book room</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? <p>Loading...</p> : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr><th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <BookingRow key={b.id} booking={b} onStatusChange={handleStatusChange} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
