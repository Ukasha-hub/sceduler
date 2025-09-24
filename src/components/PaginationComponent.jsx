import React, { useState } from 'react'
import { FaStepBackward } from "react-icons/fa";
import { FaForwardStep } from "react-icons/fa6";

const PaginationComponent = ({ currentPage, totalPages, onPageChange, handleSort, sortBy, sortOrder ,handleItemsPerPageChange, itemsPerPage }) => {

  return (
    <div>
      
      <div>
      
     

      
    </div>

        <div className="flex flex-row gap-2">

        <div className="flex flex-row gap-1">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="join-item btn btn-xs lg:btn-lg"
                >
                   <FaStepBackward />
                </button>

                {/* Current Page Number */}
                <button className="join-item btn btn-xs btn-active" >
                    {currentPage}
                </button>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="join-item btn btn-xs lg:btn-lg"
                >
                    <FaForwardStep />
                </button>
        </div>
          
          <div className="">
            <ul
                tabIndex={0}
                className=" bg-base-100 rounded-box z-1 w-20 p-2 "
                >
                <li><button className='btn btn-xs bg-gray-300' onClick={() => handleSort("name")}>Name {sortBy === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</button></li>
                {/* Add more sort options here */}
            </ul>
          </div >

          

              <div className="form-group">
              
                <select
                  className="form-control w-30 lg:w-40 h-8 text-sm border rounded-md px-2"
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                >
                  {[5, 10, 15].map((count) => (
                    <option key={count} value={count}>
                      {count} per page
                    </option>
                  ))}
                </select>
              </div>
        </div>
     

      {/* Display the files/folders for the current page */}
      
    </div>
  )
}

export default PaginationComponent