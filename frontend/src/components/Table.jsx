export default function Table({ columns, data, renderActions }) {
  return (
    <div className="overflow-x-auto card">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.className}>
                {col.title}
              </th>
            ))}
            {renderActions && <th className="w-32">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center text-slate-500 py-6">
                Tidak ada data
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="border-b border-slate-100">
                {columns.map((col) => (
                  <td key={`${row.id}-${col.key}`} className={col.className}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {renderActions && <td className="space-x-2 whitespace-nowrap">{renderActions(row)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
