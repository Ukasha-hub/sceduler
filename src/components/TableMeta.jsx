import React, { useCallback, useEffect, useRef, useState } from "react";

const TableMeta = ( {data, onMoveRow, from, 
  columns, 
  onSearch, 
  onSort, 
  onPageChange,
  onRowClick,
  totalRecords = 0,
  currentPage = 1,
  pageSize = 10,
  loading = false,
  searchValue = '',
  serverSide = true,
  getRowClassName, // New prop for custom row classes
  fillHeight = true  }) => {

  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [containerHeight, setContainerHeight] = useState('auto');
    const containerRef = useRef(null);
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
    // If dragging from Meta, remove immediately
  if (from === "meta") {
    onMoveRow(item, "meta", null); // 'to' can be null if it's going outside
  }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData("rowData"));
    const fromTable = e.dataTransfer.getData("fromTable");

    if (fromTable !== from) {
      onMoveRow(item, fromTable, from);
    }
  };
  
    // Debounced search
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (onSearch && localSearchValue !== searchValue) {
          onSearch(localSearchValue);
        }
      }, 500);
  
      return () => clearTimeout(timeoutId);
    }, [localSearchValue, onSearch, searchValue]);
  
    // Calculate dynamic height
    useEffect(() => {
      if (!fillHeight) return;
  
      const calculateHeight = () => {
        if (containerRef.current) {
          // For DataTable inside a card, use the parent container height
          const parentElement = containerRef.current.parentElement;
          if (parentElement) {
            const parentHeight = parentElement.clientHeight;
            setContainerHeight(`${parentHeight}px`);
          } else {
            // Fallback to viewport calculation
            const viewportHeight = window.innerHeight;
            const rect = containerRef.current.getBoundingClientRect();
            const offsetTop = rect.top + window.scrollY;
            const bottomMargin = 100;
            const availableHeight = viewportHeight - offsetTop - bottomMargin;
            const minHeight = 400;
            const finalHeight = Math.max(availableHeight, minHeight);
            setContainerHeight(`${finalHeight}px`);
          }
        }
      };
  
      // Calculate on mount and resize
      calculateHeight();
      window.addEventListener('resize', calculateHeight);
      
      // Recalculate after a short delay to account for layout changes
      const timeoutId = setTimeout(calculateHeight, 100);
  
      return () => {
        window.removeEventListener('resize', calculateHeight);
        clearTimeout(timeoutId);
      };
    }, [fillHeight]);
  
    const handleSort = useCallback((key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      
      setSortConfig({ key, direction });
      if (onSort) {
        onSort(key, direction);
      }
    }, [sortConfig, onSort]);
  
    const handlePageClick = useCallback((page) => {
      if (onPageChange && page !== currentPage) {
        onPageChange(page);
      }
    }, [currentPage, onPageChange]);
  
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startRecord = ((currentPage - 1) * pageSize) + 1;
    const endRecord = Math.min(currentPage * pageSize, totalRecords);
  
    const renderPagination = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      // Calculate start and end page numbers
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust startPage if we're near the end
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
  
      // Previous button
      pages.push(
        <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        </li>
      );
  
      // First page and ellipsis
      if (startPage > 1) {
        pages.push(
          <li key="1" className="page-item">
            <button className="page-link" onClick={() => handlePageClick(1)}>1</button>
          </li>
        );
        if (startPage > 2) {
          pages.push(
            <li key="ellipsis-start" className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          );
        }
      }
  
      // Page numbers
      for (let page = startPage; page <= endPage; page++) {
        pages.push(
          <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handlePageClick(page)}>
              {page}
            </button>
          </li>
        );
      }
  
      // Last page and ellipsis
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(
            <li key="ellipsis-end" className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          );
        }
        pages.push(
          <li key={totalPages} className="page-item">
            <button className="page-link" onClick={() => handlePageClick(totalPages)}>
              {totalPages}
            </button>
          </li>
        );
      }
  
      // Next button
      pages.push(
        <li key="next" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </li>
      );
  
      return pages;
    };
  
    const getSortIcon = (columnKey) => {
      if (sortConfig.key !== columnKey) {
        return <i className="fas fa-sort text-muted ml-1"></i>;
      }
      return sortConfig.direction === 'asc' 
        ? <i className="fas fa-sort-up ml-1"></i>
        : <i className="fas fa-sort-down ml-1"></i>;
    };
  
    const renderCellContent = (item, column) => {
      if (column.render) {
        return column.render(item[column.key], item);
      }
      return item[column.key];
    };
  
    return (
      <div 
        ref={containerRef}
        className="datatable-container" 
        style={{
          height: fillHeight ? containerHeight : 'auto'
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* Header with Search */}
        <div className="datatable-header d-flex justify-content-between px-2 py-2 align-items-center">
          <div className="mb-0 text-rundown">
            <i className="fas fa-table mr-2"></i>
            Programme Schedule
          </div>
          
          <div className="datatable-search">
            <ul className="flex gap-1">
            <i className="fas fa-search search-icon mt-2"></i>
          <i><input
              
              className="form-control form-control-sm"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            /></i>
            </ul>
          
            
            
          </div>
        </div>
  
        {/* Table Body with Fixed Height and Scroll */}
        <div className="datatable-body overflow-x-auto">

  <table className="datatable-table table table-hover w-full min-w-max">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-4 py-3 w-[80px]">ID</th>
        <th className="px-4 py-3 w-[140px]">Start Time</th>
        <th className="px-4 py-3 w-[140px]">End Time</th>
        <th className="px-4 py-3 w-[300px]">Programme Name</th>
        <th className="px-4 py-3">Type</th>
        <th className="px-4 py-3">Duration</th>
        <th className="px-4 py-3">L/P/D</th>
      </tr>
    </thead>
    <tbody>
      {filteredData.length === 0 ? (
        <tr>
          <td colSpan="6" className="px-4 py-6 text-center text-gray-500 italic">
            No data
          </td>
        </tr>
      ) : (
        filteredData.map((row) => (
          <tr
            key={row.id}
            draggable
            onDragStart={(e) => handleDragStart(e, row)}
          >
            <td className="px-4 py-3 w-[80px] text-blue-600 font-medium">{row.id}</td>
            <td className="px-4 py-3 w-[140px]">{row.startTime}</td>
            <td className="px-4 py-3 w-[140px]">{row.endTime}</td>
            <td className="px-4 py-3 w-[300px]">{row.name}</td>
            <td className="px-4 py-3">{row.type}</td>
            <td className="px-4 py-3">{row.duration}</td>
            <td className="px-4 py-3">{row.isPaid ? "Yes" : "No"}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>

</div>

{/* Footer stays under the table */}
<div className="datatable-footer bg-white border-t mt-2 p-2">
  <div className="datatable-info">
    Showing {totalRecords > 0 ? startRecord : 0} to {endRecord} of {totalRecords} entries
    {localSearchValue && ` (filtered from ${totalRecords} total entries)`}
  </div>
  {totalPages > 1 && (
    <nav>
      <ul className="datatable-pagination pagination pagination-sm">
        {renderPagination()}
      </ul>
    </nav>
  )}
</div>
  
        
      </div>
    );
};

export default TableMeta;
