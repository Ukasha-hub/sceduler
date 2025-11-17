import React, { useContext, useEffect, useMemo } from 'react';
import FolderCard from '../../../components/dam/FolderCard'


import MoveFileFolderModal from '../../../components/Modal/dam/MoveFileFolderModal'

import DeleteFileFolderModal from '../../../components/Modal/dam/DeleteFileFolderModal'
import useFileFolderManager from '../../../hooks/dam/useFileFolderManager'
import { Link, useLocation, useNavigate } from 'react-router-dom'



import RenameFolderModal from '../../../components/Modal/dam/RenameFolderModal'
import { useState } from 'react'
import TopbarInsideTabs from '../../../components/dam/TopbarInsideTabs'
import Breadcrumb from '../../../components/dam/Breadcrumb';
import Tabs from '../../../components/dam/Tabs';
import PageHeader from '../../../components/dam/PageHeader';
import AddFileModal from '../../../components/Modal/dam/AddFileModal';
import ContextMenu from '../../../components/dam/ContextMenu';
import axios from 'axios';
import FileCard from '../../../components/dam/FileCard';
import MainLayout from '../../../layouts/MainLayout';
import { SearchContext } from '../../../context/dam/SearchContext';
import API from '../../../API';




function DAM() {
  const { handleDrop,  clipboard, setClipboard,   contextMenu, setContextMenu, showMoveModal, setShowMoveModal, 
     itemToMove, setItemToMove,  
     cards, setCards,  topLevelItems, navigate, handleOpenMetadata,
    handleOpenFileItems, folders, activeTab, setActiveTab,   handleMove,  handleCopy, } = useFileFolderManager();

    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    

    const [showAddFileModal, setShowAddFileModal] = useState(false);

    const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { searchResults } = useContext(SearchContext);
  
  const [selectedItems, setSelectedItems] = useState([]);

 

  
  useEffect(() => {
    // Replace with your API endpoint
    const fetchVideos = async () => {
      try {
        const response = await API.get("/api/v1/videos");
        setVideos(response.data.videos || []); // assuming response.data has the same structure
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to fetch videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);
  
  useEffect(() => {
    if (searchResults.length > 0) {
      setVideos(searchResults);
      
    } else {
      // If search results are empty, re-fetch the initial list or handle it as needed
      // For now, let's keep the current videos state, so the list doesn't get cleared
      // unless the user initiates a new search
    }
  }, [searchResults]);

   
  
 

  const itemsToRender = searchResults.length > 0 ? searchResults : videos;

  const handleSelectAll = (items) => {
    if (!Array.isArray(items) || items.length === 0) return;
  
    setSelectedItems((prevSelected) => {
      if (prevSelected.length === items.length) {
        return []; // Deselect all
      } else {
        return items.map(item => ({ ...item })); // Select all
      }
    });
  };


  const handleSelectItem = (item, { forceSelect = false } = {}) => {
    setSelectedItems((prevSelected) => {
      const exists = prevSelected.find(i => i.asset_id === item.asset_id);
  
      if (exists) {
        if (forceSelect) {
          return prevSelected; // already selected, keep it
        } else {
          // normal click: toggle off
          return prevSelected.filter(i => i.asset_id !== item.asset_id);
        }
      } else {
        // select the item
        return [...prevSelected, item];
      }
    });
  };
  
  
  
  

  const handleRightClick = (e, item) => {
    e.preventDefault();
  
    handleSelectItem(item,{ forceSelect: true }); // use updated handler
  
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      type: item.folderORfile,
      item: item,
    });
  };


    // sort state
const [sortBy, setSortBy] = useState("file_name"); // default: by file name
const [sortOrder, setSortOrder] = useState("asc");  // asc | desc

// call this from your TopbarInsideTabs (e.g., handleSort("file_name"))
const handleSort = (criteria) => {
  const normalized = criteria === "name" ? "file_name" : criteria;
  if (sortBy === normalized) {
    setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
  } else {
    setSortBy(normalized);
    setSortOrder("asc");
  }
};

// sorted list for rendering + select-all
const sortedItems = useMemo(() => {
  const list = Array.isArray(itemsToRender) ? [...itemsToRender] : [];
  const key = sortBy === "name" ? "file_name" : sortBy;
  return list.sort((a, b) => {
    const A = (a?.[key] ?? "").toString();
    const B = (b?.[key] ?? "").toString();
    const cmp = A.localeCompare(B, undefined, { numeric: true, sensitivity: "base" });
    return sortOrder === "asc" ? cmp : -cmp;
  });
}, [itemsToRender, sortBy, sortOrder]);


//Pagination handling 

const [currentPage, setCurrentPage] = useState(1);
        
const [itemsPerPage, setItemsPerPage] = useState(30);



const totalPages = Math.ceil(sortedItems.length / itemsPerPage);; // Calculate total pages
  // Calculate start and end indices for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
const currentItems = sortedItems.slice(startIndex, endIndex);


// Change page function
const changePage = (page) => {
  if (page > 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};

const handleItemsPerPageChange = (count) => {
  // Ensure count is between 10 and 30
  const clampedCount = Math.min(Math.max(count, 10), 30);
  setItemsPerPage(clampedCount);
  setCurrentPage(1); // Reset to page 1 when changing items per page
};

const [showRenameModal, setShowRenameModal] = useState(false);
      const [itemToRename, setItemToRename] = useState(null);

      const handleRenameHomePage = (item, newName) => {
        // update videos list
        setVideos(prev =>
          prev.map(i =>
            i.asset_id === item.asset_id
              ? { ...i, file_name: newName, title: newName } // keep both keys in sync
              : i
          )
        );
      
        // update selectedItems if needed
        setSelectedItems(prev =>
          prev.map(si =>
            si.asset_id === item.asset_id
              ? { ...si, file_name: newName, title: newName }
              : si
          )
        );
      };

      const [showDeleteModal, setShowDeleteModal] = useState(false);
      const [itemToDelete, setItemToDelete] = useState(null);

      const confirmDelete = (item) => {
        setItemToDelete(Array.isArray(item) ? item : [item]);
        setShowDeleteModal(true);
      };
      
      const handleDelete = async () => {
        // Normalize selected items as array
        const items = Array.isArray(itemToDelete) ? itemToDelete : [itemToDelete];
      
        const idsToDelete = items.map(item => item.asset_id);
      
        // OPTION 1: If you have a DELETE API, uncomment this block:
       // try {
        //  for (const id of idsToDelete) {
         //   await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/videos/${id}`);
         // }
      //  } catch (error) {
    //      console.error("Error deleting from server:", error);
    //    }
      
        // Update UI (remove from videos state)
        setVideos(prev => prev.filter(item => !idsToDelete.includes(item.asset_id)));
      
        // Clear selection & close modal
        setSelectedItems([]);
        setShowDeleteModal(false);
        setItemToDelete(null);
      };
      
    
      const cancelDelete = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
      };


      const [showCopyModal, setShowCopyModal] = useState(false);
        const [itemToCopy, setItemToCopy] = useState(null);


        // COPY SELECTED ITEMS (Called from ContextMenu -> setItemToCopy)
// COPY SELECTED ITEMS (Temporary - no backend interaction)
const handleCopySelection = () => {
  if (!selectedItems.length) return;

  // Deep clone to ensure no reactive/proxy objects
  const cleanCopy = selectedItems.map(item => structuredClone(item)); 

  setClipboard(cleanCopy);
  // localStorage.setItem("clipboard", JSON.stringify(cleanCopy)); 
};


const pasteClipboardItems = () => {
  if (!clipboard || !clipboard.length) return;

  const newCopies = clipboard.map(item => ({
    ...item,
    asset_id: `${item.asset_id}`, // temporary unique ID
    file_name: item.file_name + " (copy)",
    title: item.title + " (copy)",
  }));

  setVideos(prev => [...prev, ...newCopies]);

  // ✅ Clear clipboard from memory AND localStorage
  setClipboard([]);
  localStorage.removeItem("clipboard"); // <-- this line ensures nothing is restored on refresh

  // ✅ Also clear selected items after pasting
  setSelectedItems([]);

  // ✅ Close context menu
  setContextMenu(prev => ({ ...prev, visible: false }));   
};

const createFolderInHomepage = async () => {
  const id = Date.now(); // numeric id used by FolderItems
  const newFolder = {
    id, // numeric id (FolderItems does parseInt)
    asset_id: `folder_${id}`, // optional string id for other logic
    title: `New Folder ${String(id).slice(-4)}`,
    file_name: `New Folder ${String(id).slice(-4)}`,
    folderORfile: "folder",
    thumbnail_url: "https://www.iconpacks.net/icons/2/free-folder-icon-1485-thumb.png",
    duration: 0,
    category: null,
    folderItems: [], // child item ids
  };

  // show immediately in the UI list of "videos/folders"
  setVideos(prev => [newFolder, ...prev]);

  // Persist to the same store FolderItems reads (cards)
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  cards.push(newFolder);
  localStorage.setItem("cards", JSON.stringify(cards));

  // Close context menu and navigate into the new folder
  setContextMenu(prev => ({ ...prev, visible: false }));
  
};

const FolderCard = ({ item, onRightClick, onSelect, isSelected, onDrop }) => {
  const navigate = useNavigate();

  const handleDoubleClick = () => {
    const isFolder =
      item.folderORfile === "folder" ||
      Array.isArray(item.folderItems) ||
      (item.asset_id && String(item.asset_id).startsWith("folder_")) ||
      (typeof item.id === "number");
  
    if (isFolder) {
      // Prefer numeric id param if available (FolderItems expects numeric id)
      const folderParam = item.id ?? item.asset_id;
      navigate(`/folderitem/${folderParam}`);
    } else {
      navigate(`/api/v1/assets/single?asset_id=${item.asset_id}`);
    }
  };
  return (
    <div onDoubleClick={handleDoubleClick}>...</div>
  );
};


  
  
if (loading) return <p>Loading videos...</p>;
if (error) return <p>{error}</p>;
  
  return (
    
      <div>
     {/* Page Header */}
     <PageHeader></PageHeader>

      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          {/* Tabs */}
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "folder-content" && (
              <div className="tab-pane fade show active p-4">
                <TopbarInsideTabs
                  location={location}
                  pathnames={pathnames}
                  navigate={navigate}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  handleSort={handleSort}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  handleItemsPerPageChange={handleItemsPerPageChange}
                  itemsPerPage={itemsPerPage}
                  handleSelectAll={handleSelectAll}
                  items={sortedItems} 
                  showAddFileModal={showAddFileModal}
                  onOpenAddFileModal={() => setShowAddFileModal(true)}
                  onCloseAddFileModal={() => setShowAddFileModal(false)}
                />
                {showAddFileModal && (
                  <AddFileModal onClose={() => setShowAddFileModal(false)} />
                )}

                {/* Folder grid + context menu */}
                <div
                  className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-10"
                  onContextMenu={(e) => {
                    if (e.target === e.currentTarget) {
                      e.preventDefault();
                      setContextMenu({
                        visible: true,
                        x: e.clientX,
                        y: e.clientY,
                        type: "blank",
                        item: null,
                      });
                    }
                  }}
                >
                  {currentItems.map((item) => (
    <div key={item.asset_id} className="border-b-2 border-dotted border-gray-300 pb-4">
      <FileCard
      key={item.asset_id}
         item={item}
         onRightClick={(e, item) => handleRightClick(e, item)}
         onSelect={(item) => handleSelectItem(item)}
         isSelected={selectedItems.some(
          (i) => i.asset_id === item.asset_id 
        )}
         onDrop={handleDrop}
      />
    </div>
  ))}
   {/*currentItems.map((item) => (
    <div key={item.id} className="border-b-2 border-dotted border-gray-300 pb-4">
      <FolderCard
        item={item}
        onRightClick={handleRightClick}
        onSelect={handleSelectItem}
        isSelected={selectedItems.some((i) => i.id === item.id)}
        onDrop={handleDrop}
      />
    </div>
  ))*/}

                  {/* Context Menu */}
                  <ContextMenu
  contextMenu={contextMenu}
  clipboard={clipboard}
  selectedItems={selectedItems}
  onCreateFolder={createFolderInHomepage}
  onPaste={() => pasteClipboardItems()}
  onOpenFileItems={handleOpenFileItems}
  onOpenMetadata={handleOpenMetadata}
  setItemToMove={setItemToMove}
  setShowMoveModal={setShowMoveModal}
  setItemToCopy={() => handleCopySelection()}
  setClipboard={setClipboard}
  setContextMenu={setContextMenu}
  setItemToRename={setItemToRename}
  setShowRenameModal={setShowRenameModal}
  confirmDelete={confirmDelete}
/>

                </div>
              </div>
            )}

            {activeTab === "videos" && (
              <div className="tab-pane fade show active p-4">
                <TopbarInsideTabs
                  location={location}
                  pathnames={pathnames}
                  navigate={navigate}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  handleSort={handleSort}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  handleItemsPerPageChange={handleItemsPerPageChange}
                  itemsPerPage={itemsPerPage}
                  handleSelectAll={handleSelectAll}
                  showAddFileModal={showAddFileModal}
                  onOpenAddFileModal={() => setShowAddFileModal(true)}
                  onCloseAddFileModal={() => setShowAddFileModal(false)}
                />
                {showAddFileModal && (
                  <AddFileModal onClose={() => setShowAddFileModal(false)} />
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-10"
                
                >
                  
                  {currentItems
                    .filter((item) => item.folderORfile === "file")
                    .map((item) => (
                      <FolderCard
                        key={item.id}
                        item={item}
                        onRightClick={handleRightClick}
                        onSelect={handleSelectItem}
                        isSelected={selectedItems.some((i) => i.id === item.id)}
                      />
                    ))}
                     {/* Context Menu */}
                     <ContextMenu
  contextMenu={contextMenu}
  clipboard={clipboard}
  selectedItems={selectedItems}
  onCreateFolder={createFolderInHomepage}
  onPaste={() => pasteClipboardItems(null)}
  onOpenFileItems={handleOpenFileItems}
  onOpenMetadata={handleOpenMetadata}
  setItemToMove={setItemToMove}
  setShowMoveModal={setShowMoveModal}
  setItemToCopy={setItemToCopy}
  setClipboard={setClipboard}
  setContextMenu={setContextMenu}
  setItemToRename={setItemToRename}
  setShowRenameModal={setShowRenameModal}
  confirmDelete={confirmDelete}
/>

                </div>
              </div>
            )}
            {activeTab === "category" && (
              <div className="tab-pane fade show active p-4">
                <TopbarInsideTabs
                  location={location}
                  pathnames={pathnames}
                  navigate={navigate}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  handleSort={handleSort}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  handleItemsPerPageChange={handleItemsPerPageChange}
                  itemsPerPage={itemsPerPage}
                  handleSelectAll={handleSelectAll}
                  showAddFileModal={showAddFileModal}
                  onOpenAddFileModal={() => setShowAddFileModal(true)}
                  onCloseAddFileModal={() => setShowAddFileModal(false)}
                />
                {showAddFileModal && (
                  <AddFileModal onClose={() => setShowAddFileModal(false)} />
                )}
                <div className=" gap-4 p-10"
                
                >
                  <div className=' w-full'>
                      <div className='flex flex-col gap-3'>
                        <div className='text-2xl font-bold'><h1>dubbed seial</h1></div> 
                        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2'>
                        {currentItems.filter(item =>
                              item.folderORfile === "file" && item.category === "Dubbed serial"
                            ).length > 0 ? (
                              currentItems
                                .filter(item => item.folderORfile === "file" && item.category === "Dubbed serial")
                                .map(item => (
                                  <FolderCard
                                    key={item.id}
                                    item={item}
                                    onRightClick={handleRightClick}
                                    onSelect={handleSelectItem}
                                    isSelected={selectedItems.some(i => i.id === item.id)}
                                  />
                                ))
                            ) : (
                              <p className="text-gray-400 italic">No files in this category</p>
                            )}
                        </div>
                    </div> 
                      <div className='flex flex-col mt-3'>
                          <div className='text-2xl font-bold'><h1>Cartoon</h1></div> 
                          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2'>
                            {currentItems.filter(item =>
                              item.folderORfile === "file" && item.category === "cartoon"
                            ).length > 0 ? (
                              currentItems
                                .filter(item => item.folderORfile === "file" && item.category === "cartoon")
                                .map(item => (
                                  <FolderCard
                                    key={item.id}
                                    item={item}
                                    onRightClick={handleRightClick}
                                    onSelect={handleSelectItem}
                                    isSelected={selectedItems.some(i => i.id === item.id)}
                                  />
                                ))
                            ) : (
                              <p className="text-gray-400 italic">No files in this category</p>
                            )}
                          </div>
                        </div>
                    
                 </div>
                     {/* Context Menu */}
                     <ContextMenu
  contextMenu={contextMenu}
  clipboard={clipboard}
  selectedItems={selectedItems}
  onCreateFolder={createFolderInHomepage}
  onPaste={() => pasteClipboardItems(null)}
  onOpenFileItems={handleOpenFileItems}
  onOpenMetadata={handleOpenMetadata}
  setItemToMove={setItemToMove}
  setShowMoveModal={setShowMoveModal}
  setItemToCopy={setItemToCopy}
  setClipboard={setClipboard}
  setContextMenu={setContextMenu}
  setItemToRename={setItemToRename}
  setShowRenameModal={setShowRenameModal}
  confirmDelete={confirmDelete}
/>

                </div>
              </div>
            )

            }
          </div>
        </div>

        {/* Modals */}
        <MoveFileFolderModal
          isOpen={showMoveModal}
          onClose={() => setShowMoveModal(false)}
          onMove={handleMove}
          folders={folders}
          item={itemToMove}
        />
        <DeleteFileFolderModal
          show={showDeleteModal}
          item={itemToDelete?.length === 1 ? itemToDelete[0] : { title: `${itemToDelete?.length} items` }}
          onDelete={handleDelete}
          onCancel={cancelDelete}
        />
        <RenameFolderModal
          isOpen={showRenameModal}
          item={itemToRename}
          onClose={() => setShowRenameModal(false)}
          onRename={handleRenameHomePage}
        />
      </section>


    </div>
   
    
  );
}
 
export default DAM;