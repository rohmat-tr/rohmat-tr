export default function Pagination({ page, total, limit, onChange }) {
  const totalPages = Math.ceil(total / limit) || 1;

  const move = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    onChange(nextPage);
  };

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-slate-600">
      <p>
        Menampilkan {(page - 1) * limit + 1} -
        {Math.min(page * limit, total)} dari {total} data
      </p>
      <div className="space-x-2">
        <button
          onClick={() => move(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-50"
        >
          Sebelumnya
        </button>
        <button
          onClick={() => move(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-50"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}
