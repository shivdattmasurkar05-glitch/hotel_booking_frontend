import { useEffect, useState } from 'react';
import { addTask, getRooms, getTasks, updateTaskStatus } from '../api.js';
import TaskCard from '../components/TaskCard.jsx';

const emptyForm = { roomId: '', task: '', assignedTo: '', priority: 'medium' };

export default function Housekeeping() {
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Rooms are needed once for the dropdown
  useEffect(() => {
    getRooms().then(setRooms);
  }, []);

  // Re-fetch tasks when the filter changes
  useEffect(() => {
    setLoading(true);
    getTasks(filter)
      .then(setTasks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filter]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTask(form);
      setForm(emptyForm);
      setTasks(await getTasks(filter));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Passed down to TaskCard as a prop
  const handleStatusChange = async (id, status) => {
    try {
      await updateTaskStatus(id, status);
      setTasks(await getTasks(filter));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Housekeeping</h2>

      <form className="card form" onSubmit={handleSubmit}>
        <h3>Assign a task</h3>
        <select name="roomId" value={form.roomId} onChange={handleChange} required>
          <option value="">-- select room --</option>
          {rooms.map((r) => <option key={r.id} value={r.id}>Room {r.number}</option>)}
        </select>
        <input name="task" placeholder="Task (e.g. Change linen)" value={form.task} onChange={handleChange} required />
        <input name="assignedTo" placeholder="Staff member" value={form.assignedTo} onChange={handleChange} required />
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Add task</button>
      </form>

      <div className="filters">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All tasks</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      {loading ? <p>Loading...</p> : tasks.length === 0 ? (
        <p className="muted">No tasks found.</p>
      ) : (
        tasks.map((t) => <TaskCard key={t.id} task={t} onStatusChange={handleStatusChange} />)
      )}
    </div>
  );
}
