const variants = {
  Menunggu: 'bg-amber-100 text-amber-700 border-amber-200',
  Proses: 'bg-blue-100 text-blue-700 border-blue-200',
  Selesai: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Ditolak: 'bg-rose-100 text-rose-700 border-rose-200',
  default: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function Badge({ children }) {
  const cls = variants[children] || variants.default;
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${cls}`}>{children}</span>;
}
