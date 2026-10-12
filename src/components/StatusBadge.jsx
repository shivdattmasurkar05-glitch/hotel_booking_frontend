// Props: status (string) - works for room, booking and task statuses
export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}
