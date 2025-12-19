import { NavLink } from 'react-router-dom';

const menu = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/requests', label: 'Permohonan Layanan', icon: '📑' },
];

const navClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium ${
    isActive ? 'bg-teal-50 text-primary' : 'text-slate-600 hover:bg-slate-100'
  }`;

export default function Sidebar() {
  return (
    <aside className="hidden md:block w-64 bg-white min-h-screen border-r border-slate-200 sticky top-0">
      <div className="px-4 py-6 border-b border-slate-200">
        <p className="text-sm uppercase text-slate-500 tracking-wide">SIMAPAN</p>
        <h1 className="text-xl font-bold text-slate-800">Admin Panel</h1>
      </div>
      <nav className="p-4 space-y-1">
        {menu.map((item) => (
          <NavLink key={item.to} to={item.to} className={navClass}>
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
