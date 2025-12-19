import { useEffect, useState } from 'react';
import { fetchOverview } from '../api/requests';
import StatCard from '../components/StatCard.jsx';

export default function Dashboard() {
  const [data, setData] = useState({ total: 0, waiting: 0, inProgress: 0, finished: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchOverview();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <p className="text-slate-600">Memuat ringkasan...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500">Ringkasan kinerja pelayanan administrasi.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Permohonan" value={data.total} icon="📑" />
        <StatCard title="Menunggu" value={data.waiting} icon="⏳" />
        <StatCard title="Sedang Diproses" value={data.inProgress} icon="⚙️" />
        <StatCard title="Selesai" value={data.finished} icon="✅" tone="neutral" />
      </div>
      <div className="card p-6 space-y-3">
        <h3 className="text-lg font-semibold text-slate-800">Catatan</h3>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
          <li>Gunakan menu "Permohonan Layanan" untuk melihat daftar lengkap.</li>
          <li>Semua aksi CRUD tersedia tanpa reload halaman.</li>
          <li>Pastikan konfigurasi API pada file .env sesuai dengan server backend.</li>
        </ul>
      </div>
    </div>
  );
}
