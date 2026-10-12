import { NavLink } from 'react-router-dom';

// Props: title (string)
export default function Navbar({ title }) {
  return (
    <nav className="navbar">
      <h1>{title}</h1>
      <NavLink to="/" end>Dashboard</NavLink>
      <NavLink to="/rooms">Rooms</NavLink>
      <NavLink to="/bookings">Bookings</NavLink>
      <NavLink to="/housekeeping">Housekeeping</NavLink>
    </nav>
  );
}
