export default function StatCard({ title, value, icon, tone = 'primary' }) {
  const toneClass = {
    primary: 'bg-teal-50 text-primary',
    neutral: 'bg-slate-100 text-slate-700',
  }[tone];

  return (
    <div className="card p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-semibold ${toneClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
