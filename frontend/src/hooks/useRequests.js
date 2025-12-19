import { useEffect, useState } from 'react';
import { createRequest, deleteRequest, fetchRequests, updateRequest } from '../api/requests';

export default function useRequests() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState({ q: '', status: '' });

  const load = async (params = {}) => {
    setLoading(true);
    try {
      const { data, meta: newMeta } = await fetchRequests({
        page: params.page || meta.page,
        limit: params.limit || meta.limit,
        ...filters,
        ...params,
      });
      setItems(data);
      setMeta(newMeta);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const addRequest = async (payload) => {
    const created = await createRequest(payload);
    setItems((prev) => [created, ...prev]);
    setMeta((prev) => ({ ...prev, total: prev.total + 1 }));
  };

  const editRequest = async (id, payload) => {
    const updated = await updateRequest(id, payload);
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const removeRequest = async (id) => {
    await deleteRequest(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
  };

  useEffect(() => {
    load({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return {
    items,
    loading,
    error,
    meta,
    filters,
    setFilters,
    load,
    addRequest,
    editRequest,
    removeRequest,
  };
}
