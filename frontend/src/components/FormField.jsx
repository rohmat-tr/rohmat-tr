export default function FormField({ label, children, error }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </label>
  );
}
