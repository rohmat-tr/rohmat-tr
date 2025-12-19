import { useMemo, useState } from 'react';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import FormField from '../components/FormField.jsx';
import Modal from '../components/Modal.jsx';
import Pagination from '../components/Pagination.jsx';
import Table from '../components/Table.jsx';
import useRequests from '../hooks/useRequests.js';

const defaultForm = {
  reference_no: '',
  applicant_name: '',
  service_type: '',
  status: 'Menunggu',
  notes: '',
};

export default function Requests() {
  const { items, loading, meta, filters, setFilters, load, addRequest, editRequest, removeRequest } = useRequests();
  const [form, setForm] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const validate = () => {
    const errors = {};
    if (!form.reference_no) errors.reference_no = 'Nomor referensi wajib diisi';
    if (!form.applicant_name) errors.applicant_name = 'Nama pemohon wajib diisi';
    if (!form.service_type) errors.service_type = 'Jenis layanan wajib diisi';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingId) {
      await editRequest(editingId, form);
    } else {
      await addRequest(form);
    }

    setOpenModal(false);
    setEditingId(null);
    setForm(defaultForm);
    load();
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      reference_no: item.reference_no,
      applicant_name: item.applicant_name,
      service_type: item.service_type,
      status: item.status,
      notes: item.notes || '',
    });
    setOpenModal(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    await removeRequest(confirmId);
    setConfirmId(null);
    load();
  };

  const columns = useMemo(
    () => [
      { key: 'reference_no', title: 'No. Referensi', className: 'whitespace-nowrap' },
      { key: 'applicant_name', title: 'Nama Pemohon' },
      { key: 'service_type', title: 'Jenis Layanan' },
      {
        key: 'status',
        title: 'Status',
        className: 'whitespace-nowrap',
        render: (value) => <Badge>{value}</Badge>,
      },
      {
        key: 'submitted_at',
        title: 'Dibuat',
        className: 'whitespace-nowrap text-sm text-slate-500',
        render: (value) => new Date(value).toLocaleString('id-ID'),
      },
      { key: 'notes', title: 'Catatan', className: 'text-sm text-slate-600' },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Permohonan Layanan</h2>
          <p className="text-sm text-slate-500">Kelola data permohonan administrasi secara real-time.</p>
        </div>
        <Button onClick={openCreate}>+ Tambah Permohonan</Button>
      </div>

      <div className="card p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          className="input md:w-72"
          placeholder="Cari referensi atau pemohon..."
          value={filters.q}
          onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
        />
        <div className="flex gap-2 items-center">
          <select
            className="input md:w-48"
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Proses">Proses</option>
            <option value="Selesai">Selesai</option>
            <option value="Ditolak">Ditolak</option>
          </select>
          <Button variant="ghost" onClick={() => load({ page: 1 })}>
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-600">Memuat data...</p>
      ) : (
        <Table
          columns={columns}
          data={items}
          renderActions={(row) => (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => openEdit(row)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => setConfirmId(row.id)}>
                Hapus
              </Button>
            </div>
          )}
        />
      )}

      <Pagination page={meta.page} total={meta.total} limit={meta.limit} onChange={(page) => load({ page })} />

      <Modal open={openModal} title={editingId ? 'Edit Permohonan' : 'Tambah Permohonan'} onClose={() => setOpenModal(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormField label="No. Referensi" error={formErrors.reference_no}>
            <input
              className="input"
              value={form.reference_no}
              onChange={(e) => setForm({ ...form, reference_no: e.target.value })}
            />
          </FormField>
          <FormField label="Nama Pemohon" error={formErrors.applicant_name}>
            <input
              className="input"
              value={form.applicant_name}
              onChange={(e) => setForm({ ...form, applicant_name: e.target.value })}
            />
          </FormField>
          <FormField label="Jenis Layanan" error={formErrors.service_type}>
            <input
              className="input"
              value={form.service_type}
              onChange={(e) => setForm({ ...form, service_type: e.target.value })}
            />
          </FormField>
          <FormField label="Status">
            <select
              className="input"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Menunggu">Menunggu</option>
              <option value="Proses">Proses</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </FormField>
          <FormField label="Catatan">
            <textarea
              className="input"
              rows="3"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </FormField>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setOpenModal(false)}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(confirmId)} title="Hapus permohonan" onClose={() => setConfirmId(null)}>
        <p className="text-sm text-slate-600">Data akan dihapus secara permanen. Lanjutkan?</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmId(null)}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  );
}
