import React, { useState, useEffect, useCallback, useRef } from 'react';
import './DataTable.css';

const DataTable = ({ 
  data, 
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
  fillHeight = true // New prop to enable/disable dynamic height
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [containerHeight, setContainerHeight] = useState('auto');
  const containerRef = useRef(null);

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
    >
      {/* Header with Search */}
      <div className="datatable-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0 text-rundown">
          <i className="fas fa-table mr-2"></i>
          Programme Schedule
        </h6>
        
        <div className="datatable-search">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search programmes..."
            value={localSearchValue}
            onChange={(e) => setLocalSearchValue(e.target.value)}
          />
          <i className="fas fa-search search-icon"></i>
        </div>
      </div>

      {/* Table Body with Fixed Height and Scroll */}
      <div className="datatable-body">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        <table className="datatable-table table table-hover">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: column.width || 'auto', cursor: column.sortable ? 'pointer' : 'default' }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  {column.title}
                  {column.sortable && getSortIcon(column.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => {
                const baseClassName = onRowClick ? 'clickable' : '';
                const customClassName = getRowClassName ? getRowClassName(item) : '';
                const rowClassName = `${baseClassName} ${customClassName}`.trim();
                
                return (
                  <tr 
                    key={item.id || index}
                    className={rowClassName}
                    onClick={() => onRowClick && onRowClick(item)}
                  >
                    {columns.map((column) => (
                      <td key={`${item.id || index}-${column.key}`}>
                        {renderCellContent(item, column)}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-muted">
                  {loading ? 'Loading...' : 'No data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      <div className="datatable-footer">
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

export default DataTable;
