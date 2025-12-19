import { useLocation } from 'react-router-dom';

export default function Topbar() {
  const location = useLocation();
  const title =
    location.pathname === '/requests'
      ? 'Permohonan Layanan'
      : location.pathname === '/dashboard'
      ? 'Dashboard'
      : 'SIMAPAN';

  return (
    <header className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur border-b border-slate-200">
      <div className="flex items-center justify-between px-6 lg:px-8 py-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">SIMAPAN</p>
          <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
            SI
          </div>
          <div>
            <p className="text-sm font-semibold">Admin</p>
            <p className="text-xs text-slate-500">Sistem Informasi</p>
          </div>
        </div>
      </div>
    </header>
  );
}
