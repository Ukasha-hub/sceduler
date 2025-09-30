import React, { useEffect, useState } from 'react'


const TableVistriaArchive = ({ data, onMoveRow, from }) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);

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

  //const handleDrop = (e) => {
   // e.preventDefault();
  //  const rowData = e.dataTransfer.getData("rowData");
  //  if (!rowData) return; 
  //  const item = JSON.parse(rowData);
  //  const fromTable = e.dataTransfer.getData("fromTable");

  //  if (fromTable !== from) {
  //    onMoveRow(item, fromTable, from);
  //  }
  //};
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden"
    onDragOver={(e) => e.preventDefault()}
      //onDrop={handleDrop}
      >
      {/* Header */}
      <div className="flex flex-col items-center justify-between px-4 py-3 border-b">
        {/* Left: Select + Checkboxes */}
        <div className="flex items-center space-x-4">
         

          {/* Two Checkboxes */}
          <label className="flex items-center space-x-1 text-xs text-gray-600">
            <input type="checkbox" className="form-checkbox text-blue-600" />
            <span>Vistria</span>
          </label>
          <label className="flex items-center space-x-1 text-xs text-gray-600">
            <input type="checkbox" className="form-checkbox text-blue-600" />
            <span>Archive</span>
          </label>
        </div>


         {/* Search Bar */}
         <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1 text-xs w-full md:w-64"
          />
        </div>

        

        {/* Tools */}
       
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Size</th>
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
                  <td className="px-4 py-3">{row.size}</td>
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
  )
}

export default TableVistriaArchive
