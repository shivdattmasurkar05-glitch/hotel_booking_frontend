import StatusBadge from './StatusBadge.jsx';

// Props: task (object), onStatusChange (function(id, newStatus))
export default function TaskCard({ task, onStatusChange }) {
  return (
    <div className={`card priority-${task.priority}`}>
      <h3>Room {task.room ? task.room.number : task.roomId} - {task.task}</h3>
      <p className="muted">Assigned to: {task.assignedTo} · Priority: {task.priority}</p>
      <StatusBadge status={task.status} />{' '}
      {task.status === 'pending' && (
        <button onClick={() => onStatusChange(task.id, 'in-progress')}>Start</button>
      )}
      {task.status === 'in-progress' && (
        <button onClick={() => onStatusChange(task.id, 'done')}>Mark done</button>
      )}
    </div>
  );
}
