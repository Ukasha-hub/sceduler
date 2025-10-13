import React, { useEffect, useRef, useState } from 'react';

const TableVistriaArchive = ({ data, onMoveRow, from }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [selectedSource, setSelectedSource] = useState('Razuna'); // default checked

  useEffect(() => {
    // Filter data based on search term
    setFilteredData(
      data.filter(
        (row) =>
          row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data]);

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("rowData", JSON.stringify(item));
    e.dataTransfer.setData("fromTable", from);
  };

  
    const containerRef = useRef(null);
    const [isNarrow, setIsNarrow] = useState(false);
  
    useEffect(() => {
      const observer = new ResizeObserver((entries) => {
        const width = entries[0].contentRect.width;
        setIsNarrow(width < 600); // 🔧 Adjust threshold as needed
      });
  
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
  
      return () => observer.disconnect();
    }, []);

  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div
      ref={containerRef}
      className={`flex flex-wrap px-4 py-3 border-b gap-2 ${
        isNarrow ? "justify-center" : "justify-between"
      }`}
    >
        {/* Checkboxes */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-1 text-xs text-gray-600">
            <input
              type="checkbox"
              className="form-checkbox text-blue-600"
              checked={selectedSource === 'Razuna'}
              onChange={() => setSelectedSource('Razuna')}
            />
            <span>Razuna</span>
          </label>
          <label className="flex items-center space-x-1 text-xs text-gray-600">
            <input
              type="checkbox"
              className="form-checkbox text-blue-600"
              checked={selectedSource === 'Vistria'}
              onChange={() => setSelectedSource('Vistria')}
            />
            <span>Vistria</span>
          </label>
        </div>

        {/* Search Bar */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              className="border rounded px-1 py-0.5 text-[10px] w-full md:w-32"
              id="slot"
            >
              <option value="">Filter By:</option>
              <option value="Slot 1">COM</option>
              <option value="Slot 2">PGM</option>
              <option value="Slot 3">Slot 3</option>
            </select>

            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-1 py-0.5 text-[10px] w-full md:w-40"
            />
          </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Asset ID</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-4 py-6 text-center text-gray-500 italic">
                  No data
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr
                  key={row.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, row)}
                  className={`border-b hover:bg-gray-50 cursor-move ${
                    row.status === "Not Okay" ? "bg-red-100" : "bg-green-100"
                  }`}
                >
                  <td className="px-4 py-3 text-blue-600 font-medium">
                    <a href="#">{row.name}</a>
                  </td>
                  <td className="px-4 py-3">{row.id}</td>
                  <td className="px-4 py-3">{row.duration}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        row.status === "Okay"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableVistriaArchive;
