import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const Table = ({ data = [], columns = [], onView, onEdit, onDelete, showActions = true, }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const safeData = Array.isArray(data) ? data : [];
  const safeColumns = Array.isArray(columns) ? columns : [];

  const filteredData = safeData.filter((row) =>
    safeColumns.some((col) => {
      const v = row?.[col.accessor];
      return v !== undefined && v !== null && v.toString().toLowerCase().includes(search.toLowerCase());
    })
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / Math.max(1, rowsPerPage)));
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, rowsPerPage]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="overflow-hidden rounded-t-xl">
          <div className="bg-[#7F9AE5] text-white p-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-black text-sm">Afficher par page</span>
              <div className="relative group">
                <button className="px-2 py-0.5 bg-[#7F9AE5] text-sm text-black border border-gray-600 rounded-md shadow-md cursor-pointer">
                  {rowsPerPage}
                </button>
                <div className="absolute right-0 top-full w-10 bg-[#7F9AE5] border border-gray-600 rounded-md shadow-md hidden group-hover:block z-10">
                  {[10, 20, 30].map((value) => (
                    <div
                      key={value}
                      onClick={() => setRowsPerPage(value)}
                      className={`px-2 py-1 text-xs cursor-pointer hover:bg-[#425CA3] hover:text-white ${rowsPerPage === value ? 'bg-[#425CA3] text-white' : 'text-black'}`}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <input
              type="text"
              placeholder="🔍 Recherche"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-600 dark:border-gray-300 rounded-full px-2 py-1 bg-[#1D2635] dark:bg-[#B9C7F0] text-sm shadow-[4px_4px_10px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-2 focus:ring-blue-400 text-white dark:text-black placeholder:text-gray-400 dark:placeholder:text-gray-700 w-full md:w-1/3"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className={`px-2 py-0.5 text-sm rounded-md border border-gray-600 bg-[#7F9AE5] shadow-[4px_4px_10px_rgba(0,0,0,0.5)] hover:-translate-y-[2px] transition-transform ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentPage === 1}
              >
                {'<'}
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-2 py-0.5 text-sm rounded-md border border-gray-600 shadow-[4px_4px_10px_rgba(0,0,0,0.5)] hover:-translate-y-[2px] transition-transform ${currentPage === i + 1 ? 'bg-[#425CA3] text-white' : 'bg-[#7F9AE5] text-black'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className={`px-2 py-0.5 text-sm rounded-md border border-gray-600 bg-[#7F9AE5] shadow-[4px_4px_10px_rgba(0,0,0,0.5)] hover:-translate-y-[2px] transition-transform ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentPage === totalPages}
              >
                {'>'}
              </button>
            </div>
          </div>

          <table className="min-w-full table-fixed border-collapse">
            <thead className="bg-[#425CA3] text-white">
              <tr>
                {safeColumns.map((col) => (
                  <th key={col.accessor} className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
                {showActions && (
                  <th className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={index} className="hover:bg-[#425CA3]/30 dark:hover:bg-[#7F9AE5]/30">
                  {safeColumns.map((col) => (
                    <td key={col.accessor} className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">
                      {row?.[col.accessor] ?? ''}
                    </td>
                  ))}
                  {showActions && (
                    <td className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <Eye
                          size={18}
                          className="text-gray-500 cursor-pointer"
                          onClick={() => {
                            if (onView) onView(row);
                          }}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              ))}

              {!paginatedData.length && (
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-sm text-gray-500" colSpan={showActions ? safeColumns.length + 1 : safeColumns.length}>
                    Aucune donnée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-[#7F9AE5] text-white p-2 flex justify-between items-center rounded-b-xl">
          <div className="flex items-center gap-2">
            <span className="text-black text-sm">Afficher par page</span>
            <div className="relative group">
              <button className="px-2 py-0.5 bg-[#7F9AE5] text-sm text-black border border-gray-600 rounded-md shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)] cursor-pointer">
                {rowsPerPage}
              </button>
              <div className="absolute right-0 bottom-full w-10 bg-[#7F9AE5] border border-gray-600 rounded-md shadow-[4px_4px_10px_rgba(0,0,0,0.5)] hidden group-hover:block">
                {[10, 20, 30].map((value) => (
                  <div
                    key={value}
                    onClick={() => setRowsPerPage(value)}
                    className={`px-2 py-1 text-xs cursor-pointer hover:bg-[#425CA3] hover:text-white ${rowsPerPage === value ? 'bg-[#425CA3] text-white' : 'text-black'}`}
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className={`px-2 py-0.5 text-sm rounded-md border border-gray-600 bg-[#7F9AE5] shadow-[4px_4px_10px_rgba(0,0,0,0.5)] hover:-translate-y-[2px] transition-transform ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentPage === 1}
            >
              {'<'}
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-2 py-0.5 text-sm rounded-md border border-gray-600 shadow-[4px_4px_10px_rgba(0,0,0,0.5)] hover:-translate-y-[2px] transition-transform ${currentPage === i + 1 ? 'bg-[#425CA3] text-white' : 'bg-[#7F9AE5] text-black'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className={`px-2 py-0.5 text-sm rounded-md border border-gray-600 bg-[#7F9AE5] shadow-[4px_4px_10px_rgba(0,0,0,0.5)] hover:-translate-y-[2px] transition-transform ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentPage === totalPages}
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
