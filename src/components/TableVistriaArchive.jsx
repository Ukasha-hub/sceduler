import React, { useEffect, useRef, useState } from 'react';

const TableVistriaArchive = ({ RazunaData ,setRazunaData, loadingAPI, setLoadingAPI ,selectedSource, setSelectedSource, filteredDataRazuna , setFilteredDataRazuna , onMoveRow, from }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  
  // default checked
  const [selectedFilter, setSelectedFilter] = useState(""); 
 // ✅ Loading state
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, row: null });
  const [metadataModal, setMetadataModal] = useState({ visible: false, row: null });


 

  // Clear table when Vistria is selected
  useEffect(() => {
    if (selectedSource !== "Razuna") {
      setRazunaData([]);
      setFilteredDataRazuna([]);
      setLoadingAPI(false); // no loading for Vistria
    }
  }, [selectedSource]);

 

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("rowData", JSON.stringify(item));
    e.dataTransfer.setData("fromTable", from);
  };

  
    const containerRef = useRef(null);
    const [isNarrow, setIsNarrow] = useState(false);
   
  
    const resizeObserverRef = useRef(null);

    useEffect(() => {
      if (resizeObserverRef.current) return; // ✅ Ensure only one observer is attached
    
      resizeObserverRef.current = new ResizeObserver((entries) => {
        const newWidth = entries[0].contentRect.width;
        setIsNarrow(prev => {
          const newValue = newWidth < 300;
          return prev !== newValue ? newValue : prev;
        });
      });
    
      if (containerRef.current) {
        resizeObserverRef.current.observe(containerRef.current);
      }
    
      return () => resizeObserverRef.current?.disconnect();
    }, []);

    

    useEffect(() => {
      setFilteredDataRazuna(
        RazunaData.filter((row) => {
          const matchesSearch =
            row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(row.size).toLowerCase().includes(searchTerm.toLowerCase());
  
          const matchesFilter =
            selectedFilter === "" || selectedFilter === "All" || row.type === selectedFilter;
  
          return matchesSearch && matchesFilter;
        })
      );
    }, [searchTerm, selectedFilter, RazunaData]);

    const getRowColor = (type) => {
      switch (type) {
        case "PGM": return "bg-blue-100";
        case "COM": return "bg-yellow-100";
        case "FILLER": return "bg-purple-100";
        case "COM-GFX": return "bg-pink-100";
        case "GFX": return "bg-orange-100";
        case "PROMO": return "bg-teal-100";
        case "TEASER": return "bg-indigo-100";
        default: return "bg-gray-100"; // fallback
      }
    };

    const handleContextMenu = (e, row) => {
      e.preventDefault();
    
      setContextMenu({
        visible: true,
        x: e.clientX, // relative to viewport
        y: e.clientY,
        row
      });
    };
    
    
    
    
    const handleDownload = (row) => {
      console.log("Downloading:", row);
      // Example download logic:
      // window.open(`/api/v1/media/download/${row.id}`, "_blank");
    
      setContextMenu({ ...contextMenu, visible: false });
    };
    
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };

  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
    >
       {/* ✅ Table Heading */}
    <div className="px-3 py-3 border-b bg-gray-50">
      <h2 className="text-md font-bold text-gray-700">Search Asset</h2>
    </div>
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
  value={selectedFilter}
  onChange={(e) => setSelectedFilter(e.target.value)}
>
              <option value="">Filter By:</option>
              <option value="All">All</option>
              <option value="PGM">PGM</option>
              <option value="COM">COM</option>
              <option value="FILLER">FILLER</option>
              <option value="COM-GFX">COM-GFX</option>
              <option value="GFX">GFX</option>
              <option value="PROMO">PROMO</option>
              <option value="TEASER">TEASER</option>
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
      <div className="overflow-x-auto relative">
      <div className="max-h-[73vh] overflow-y-auto">
      {loadingAPI ? (
          <div className="flex flex-col justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        ) : (
          <table className="w-full text-xs text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-2 py-2 max-w-[150px]  whitespace-normal break-words">Name</th>
                <th className="px-2 py-2 max-w-[100px] whitespace-normal break-words">Asset ID</th>
                <th className="px-2 py-2 max-w-[50px] whitespace-normal break-words">Duration</th>
                <th className="px-2 py-2 max-w-[100px] whitespace-normal break-words">Size(GB)</th>
              </tr>
            </thead>
            <tbody>
              {filteredDataRazuna.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-500 italic">
                    No data
                  </td>
                </tr>
              ) : (
                filteredDataRazuna.map((row) => (
                  <tr
                    key={row.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, row)}
                    onContextMenu={(e) => handleContextMenu(e, row)}
                    className={`border-b hover:bg-gray-50 cursor-move ${getRowColor(row.type)}`}
                  >
                    <td className="px-2 py-2 text-blue-600 font-medium max-w-[150px] whitespace-normal break-words">
                      <a href="#">{row.name}</a>
                    </td>
                    <td className="px-2 py-2 max-w-[100px] whitespace-normal break-words">{row.id}</td>
                    <td className="px-2 py-2 max-w-[50px] whitespace-normal break-words">{row.duration}</td>
                    <td className="px-2 py-2 max-w-[100px] whitespace-normal break-words">{row.size}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
        
      </div>
      {metadataModal.visible && (
  <div
    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    onClick={() => setMetadataModal({ visible: false, row: null })}
  >
    <div
      className="bg-white rounded-lg p-4 w-[80vw] lg:w-[40vw]"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="font-bold text-md mb-2">Metadata Info</h3>
      <div className="text-sm space-y-1">
        <div className="break-words"><strong>Name:</strong> {metadataModal.row.name}</div>
        <div className="break-words"><strong>ID:</strong> {metadataModal.row.id}</div>
        <div><strong>Duration:</strong> {metadataModal.row.duration}</div>
        <div><strong>Create Date:</strong> {metadataModal.row.createDate}</div>
        <div><strong>Duration (s):</strong> {metadataModal.row.duration_seconds}</div>
        <div><strong>FPS:</strong> {metadataModal.row.fps}</div>
        <div><strong>Height:</strong> {metadataModal.row.height}</div>
        <div><strong>Width:</strong> {metadataModal.row.width}</div>
        <div><strong>Size:</strong> {metadataModal.row.size}</div>
        <div><strong>Type:</strong> {metadataModal.row.type}</div>
        <div><strong>Bitrate:</strong> {metadataModal.row.bitrate}</div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => setMetadataModal({ visible: false, row: null })}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      {contextMenu.visible && (
  <div className="fixed inset-0 z-40" onClick={() => setContextMenu({ visible: false })}>
    <div
      className="absolute bg-white shadow-lg border rounded text-xs z-50"
      style={{ top: contextMenu.y, left: contextMenu.x }}
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking menu
    >
      <button
        className="px-4 py-2 hover:bg-gray-100 w-full text-left"
        onClick={() => handleDownload(contextMenu.row)}
      >
        Download
      </button>
      <button
    className="px-4 py-2 hover:bg-gray-100 w-full text-left"
    onClick={() => {
      setMetadataModal({ visible: true, row: contextMenu.row });
      setContextMenu({ ...contextMenu, visible: false });
    }}
  >
    Metadata
  </button>
    </div>
  </div>
)}

    </div>
  );
};

export default TableVistriaArchive;
