import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Rooms from './pages/Rooms.jsx';
import RoomDetail from './pages/RoomDetail.jsx';
import Bookings from './pages/Bookings.jsx';
import Housekeeping from './pages/Housekeeping.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
      <Navbar title="Hotel Dashboard" />
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/housekeeping" element={<Housekeeping />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
