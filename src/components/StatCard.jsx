// Props: label (string), value (number)
export default function StatCard({ label, value }) {
  return (
    <div className="card stat">
      <p className="muted">{label}</p>
      <p className="big">{value}</p>
    </div>
  );
}
