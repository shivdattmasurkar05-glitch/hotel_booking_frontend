// Set USE_MOCK = false to call your ISA-II Node/Sequelize backend instead.
// Expected endpoints:
//   GET  /rooms?status=&type=     GET /rooms/:id  (room + bookings + tasks)
//   GET  /bookings                POST /bookings          PATCH /bookings/:id  {status}
//   GET  /housekeeping?status=    POST /housekeeping      PATCH /housekeeping/:id {status}
const USE_MOCK = true;
const BASE = 'http://localhost:5000/api';

// ---------- mock data (same shape the backend should return) ----------
const rooms = [
  { id: 1, number: '101', type: 'single', floor: 1, price: 2500, status: 'occupied' },
  { id: 2, number: '102', type: 'single', floor: 1, price: 2500, status: 'available' },
  { id: 3, number: '103', type: 'double', floor: 1, price: 3500, status: 'cleaning' },
  { id: 4, number: '104', type: 'double', floor: 1, price: 3500, status: 'maintenance' },
  { id: 5, number: '201', type: 'double', floor: 2, price: 3800, status: 'available' },
  { id: 6, number: '202', type: 'double', floor: 2, price: 3800, status: 'occupied' },
  { id: 7, number: '203', type: 'single', floor: 2, price: 2700, status: 'available' },
  { id: 8, number: '301', type: 'suite', floor: 3, price: 7500, status: 'available' },
];
const bookings = [
  { id: 1, roomId: 1, guestName: 'Rahul Sharma', checkIn: '2026-10-11', checkOut: '2026-10-14', status: 'checked-in' },
  { id: 2, roomId: 6, guestName: 'Emily Clark', checkIn: '2026-10-10', checkOut: '2026-10-13', status: 'checked-in' },
  { id: 3, roomId: 5, guestName: 'Meera Joshi', checkIn: '2026-10-15', checkOut: '2026-10-17', status: 'reserved' },
];
const tasks = [
  { id: 1, roomId: 3, task: 'Full cleaning after checkout', assignedTo: 'Sunita', priority: 'high', status: 'pending' },
  { id: 2, roomId: 4, task: 'Fix AC and deep clean', assignedTo: 'Raju', priority: 'medium', status: 'in-progress' },
  { id: 3, roomId: 1, task: 'Restock towels', assignedTo: 'Sunita', priority: 'low', status: 'pending' },
];

// fake network delay so loading states are visible
const delay = (data) => new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), 400));
const fail = (msg) => Promise.reject(new Error(msg));

const roomInfo = (id) => rooms.find((r) => r.id === Number(id));
const withRoom = (item) => ({ ...item, room: roomInfo(item.roomId) });

async function request(path, method = 'GET', body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || (data.errors && data.errors[0].msg) || 'Request failed');
  return data;
}

// ---------- Rooms ----------
export const getRooms = (status = '', type = '') => {
  if (!USE_MOCK) return request(`/rooms?status=${status}&type=${type}`);
  return delay(rooms.filter((r) => (!status || r.status === status) && (!type || r.type === type)));
};

export const getRoom = (id) => {
  if (!USE_MOCK) return request(`/rooms/${id}`);
  const room = roomInfo(id);
  if (!room) return fail('Room not found');
  return delay({
    ...room,
    bookings: bookings.filter((b) => b.roomId === room.id),
    tasks: tasks.filter((t) => t.roomId === room.id),
  });
};

// ---------- Bookings ----------
export const getBookings = () =>
  USE_MOCK ? delay(bookings.map(withRoom)) : request('/bookings');

export const addBooking = (data) => {
  if (!USE_MOCK) return request('/bookings', 'POST', data);
  const room = roomInfo(data.roomId);
  if (!room) return fail('Room not found');
  if (room.status !== 'available') return fail(`Room ${room.number} is not available`);
  if (data.checkOut <= data.checkIn) return fail('Check-out must be after check-in');
  const booking = { id: Date.now(), ...data, roomId: Number(data.roomId), status: 'reserved' };
  bookings.push(booking);
  return delay(booking);
};

export const updateBookingStatus = (id, status) => {
  if (!USE_MOCK) return request(`/bookings/${id}`, 'PATCH', { status });
  const booking = bookings.find((b) => b.id === id);
  if (!booking) return fail('Booking not found');
  booking.status = status;
  const room = roomInfo(booking.roomId);
  if (status === 'checked-in') room.status = 'occupied';
  if (status === 'checked-out') {
    // checkout makes the room dirty and creates a housekeeping task
    room.status = 'cleaning';
    tasks.push({ id: Date.now(), roomId: room.id, task: 'Full cleaning after checkout', assignedTo: 'Unassigned', priority: 'high', status: 'pending' });
  }
  return delay(booking);
};

// ---------- Housekeeping ----------
export const getTasks = (status = '') => {
  if (!USE_MOCK) return request(`/housekeeping?status=${status}`);
  return delay(tasks.filter((t) => !status || t.status === status).map(withRoom));
};

export const addTask = (data) => {
  if (!USE_MOCK) return request('/housekeeping', 'POST', data);
  if (!roomInfo(data.roomId)) return fail('Room not found');
  const task = { id: Date.now(), ...data, roomId: Number(data.roomId), status: 'pending' };
  tasks.push(task);
  return delay(task);
};

export const updateTaskStatus = (id, status) => {
  if (!USE_MOCK) return request(`/housekeeping/${id}`, 'PATCH', { status });
  const task = tasks.find((t) => t.id === id);
  if (!task) return fail('Task not found');
  task.status = status;
  const room = roomInfo(task.roomId);
  // finished cleaning -> room becomes available again
  if (status === 'done' && room.status === 'cleaning') room.status = 'available';
  return delay(task);
};
