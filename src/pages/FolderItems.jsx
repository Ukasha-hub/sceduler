
import React, { useEffect, useState } from 'react'
import {  useParams } from 'react-router-dom';
import FolderCard from '../components/FolderCard';
import MoveFileFolderModal from '../components/Modal/MoveFileFolderModal';

import DeleteFileFolderModal from '../components/Modal/DeleteFileFolderModal';

import useFileFolderManager from '../hooks/useFileFolderManager';
import { Link, useLocation } from 'react-router-dom'

import PaginationComponent from '../components/PaginationComponent';
import Breadcrumb from '../components/Breadcrumb';
import RenameFolderModal from '../components/Modal/RenameFolderModal';
import TopbarInsideTabs from '../components/TopbarInsideTabs';
import Tabs from '../components/Tabs';
import PageHeader from '../components/PageHeader';
import AddFileModal from '../components/Modal/AddFileModal';
import ContextMenu from '../components/ContextMenu';


const FolderItems = () => {


  const {createFolderInFolders,handleDrop ,itemToRename, setItemToRename, showRenameModal, setShowRenameModal, handleSelectAll, pasteClipboardItems, clipboard, setClipboard, handleItemsPerPageChangeinFiles , changePageinFiles ,paginatedTopLevelItemsinFiles,currentItemsinFiles,totalPagesinFiles,itemsPerPageinFiles, setItemsPerPageinFiles, currentPageinFiles, setCurrentPageinFiles,handleSortinFiles,sortOrderinFiles, setSortOrderinFiles, sortByinFiles, setSortByinFiles,sortedItemsinFiles,items, setItems, itemsPerPage,handleItemsPerPageChange ,handleSort,sortBy, sortOrder,currentPage, setCurrentPage, changePage,totalPages,currentItems,paginatedTopLevelItems, activeTab, setActiveTab, contextMenu, setContextMenu, showMoveModal, setShowMoveModal, showCopyModal, setShowCopyModal, 
    itemToCopy, setItemToCopy, itemToMove, setItemToMove, selectedItems, setSelectedItems, showDeleteModal, setShowDeleteModal, 
    itemToDelete, setItemToDelete, cards, setCards,  handleSelectItem, navigate, handleRightClick, handleOpenMetadata,
    handleOpenFileItems, folders,  confirmDelete, handleDelete, handleMoveInFolders, cancelDelete, handleCopy} = useFileFolderManager();

  const { id } = useParams();
  const [folder, setFolder] = useState(null);

  const [showAddFileModal, setShowAddFileModal] = useState(false);
  
  
    
  const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);
 
    const handleRenameFolders = (item, newName) => {
      const data = JSON.parse(localStorage.getItem("cards")) || [];
      const index = data.findIndex(i => i.id === item.id);
      if (index !== -1) {
        data[index].title = newName;
        localStorage.setItem("cards", JSON.stringify(data));
        setCards(data);
    
        // Optional: update items in current folder
        const parentFolderIndex = data.findIndex(i => i.id === parseInt(id));
        const updatedChildItems = data.filter(i =>
          data[parentFolderIndex]?.folderItems.includes(i.id)
        );
        setItems(updatedChildItems);
      }
    };


  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cards")) || [];
    const targetFolder = data.find(item => item.id === parseInt(id) && item.folderORfile === "folder");
    setFolder(targetFolder);

    if (targetFolder) {
        const childItems = data.filter(item =>
            targetFolder.folderItems.includes(item.id) || 
            targetFolder.folderItems.includes(String(item.id))
          )
      setItems(childItems);
    }
  }, [id]);

  if (!folder) return <div className="p-4">Folder not found.</div>;



  if (items.length === 0) return( 
    <>
               {/* Page Header */}
               <PageHeader></PageHeader> 
                <div className="p-4" onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({
                    visible: true,
                    x: e.clientX,
                    y: e.clientY,
                    type: 'blank',
                    item: null,
                  });
                }}
              >                
                <div className=' h-20 '>
                          {/* name of each tab group should be unique */}
                          <div className="tabs tabs-lift">  
                          <div className='tab-content bg-base-100 border-base-300 p-4'>
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
                          handleItemsPerPageChange={handleItemsPerPageChange } 
                          itemsPerPage={itemsPerPage} 
                          handleSelectAll={handleSelectAll} 
                          onOpenAddFileModal={() => setShowAddFileModal(true)} 
                          onCloseAddFileModal={() => setShowAddFileModal(false)}>

                          </TopbarInsideTabs>
                          {showAddFileModal && (
                                <AddFileModal onClose={() => setShowAddFileModal(false)} />
                            )}

              {/*buttons and paginations */}
              <div className='border-2 '>

                <div className='flex justify-center border-2 pb-50'><div className='pb-30'>Folder is empty</div></div>
                {/* Context menu */}
                <ContextMenu
                  contextMenu={contextMenu}
                  clipboard={clipboard}
                  selectedItems={selectedItems}
                  onCreateFolder={() => createFolderInFolders(id)}   // note: pass id here
                  onPaste={() => pasteClipboardItems(id)}
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
                           
                
              </div>
              </div>
              </div>
              </>
  )
 
  return (
    <div>

               {/* Page Header */}
               <PageHeader></PageHeader>
       
   <section className="content">
       <div className=' container-fluid '>
           
            {/* Tabs Header (like Homepage) */}
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === "folder-content" && (
                <div className="tab-pane fade show active p-4">
                  {/* Your Folder Content Grid */}
                  <TopbarInsideTabs
                    location={location}
                    pathnames={pathnames}
                    navigate={navigate}
                    currentPage={currentPageinFiles}
                    totalPages={totalPagesinFiles}
                    setCurrentPage={setCurrentPageinFiles}
                    sortBy={sortByinFiles}
                    sortOrder={sortOrderinFiles}
                    handleSort={handleSortinFiles}
                    handleItemsPerPageChange={handleItemsPerPageChangeinFiles}
                    itemsPerPage={itemsPerPageinFiles}
                    handleSelectAll={handleSelectAll}
                    onOpenAddFileModal={() => setShowAddFileModal(true)}
                   onCloseAddFileModal={() => setShowAddFileModal(false)}
                  />
                  {showAddFileModal && (
                  <AddFileModal onClose={() => setShowAddFileModal(false)} />
                )}
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
                    {currentItemsinFiles.map(item => (
                        <div key={item.id} className="border-b-2 border-dotted border-gray-300 pb-4">
                        <FolderCard item={item} onRightClick={handleRightClick} onSelect={handleSelectItem}
                        isSelected={selectedItems.some(i => i.id === item.id)}  onDrop={handleDrop}/>
                        </div>
                      ))}
                  </div>
                </div>
              )}
               {/* Context menu */}
               <ContextMenu
                contextMenu={contextMenu}
                clipboard={clipboard}
                selectedItems={selectedItems}
                onCreateFolder={() => createFolderInFolders(id)}
                onPaste={() => pasteClipboardItems(id)}
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

              {activeTab === "videos" && (
                <div className="tab-pane fade show active p-4">
                   <TopbarInsideTabs
                     location={location}
                     pathnames={pathnames}
                     navigate={navigate}
                     currentPage={currentPageinFiles}
                     totalPages={totalPagesinFiles}
                     setCurrentPage={setCurrentPageinFiles}
                     sortBy={sortByinFiles}
                     sortOrder={sortOrderinFiles}
                     handleSort={handleSortinFiles}
                     handleItemsPerPageChange={handleItemsPerPageChangeinFiles}
                     itemsPerPage={itemsPerPageinFiles}
                     handleSelectAll={handleSelectAll}
                     onOpenAddFileModal={() => setShowAddFileModal(true)}
                    onCloseAddFileModal={() => setShowAddFileModal(false)}
                  />
                  {showAddFileModal && (
                  <AddFileModal onClose={() => setShowAddFileModal(false)} />
                )}
                  <div
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-10"
                    >
                     {currentItemsinFiles
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
                      onCreateFolder={() => createFolderInFolders(id)}
                      onPaste={() => pasteClipboardItems(id)}
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
                    currentPage={currentPageinFiles}
                    totalPages={totalPagesinFiles}
                    setCurrentPage={setCurrentPageinFiles}
                    sortBy={sortByinFiles}
                    sortOrder={sortOrderinFiles}
                    handleSort={handleSortinFiles}
                    handleItemsPerPageChange={handleItemsPerPageChangeinFiles}
                    itemsPerPage={itemsPerPageinFiles}
                    handleSelectAll={handleSelectAll}
                    onOpenAddFileModal={() => setShowAddFileModal(true)}
                   onCloseAddFileModal={() => setShowAddFileModal(false)}
                  />
                  {showAddFileModal && (
                  <AddFileModal onClose={() => setShowAddFileModal(false)} />
                )}
                <div className=" gap-4 p-10"
                
                >
                  <div className='w-full'>
                      <div className='flex flex-col gap-3'>
                        <div className='text-2xl font-bold'><h1>dubbed seial</h1></div> 
                        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2'>
                        {currentItemsinFiles.filter(item =>
                              item.folderORfile === "file" && item.category === "Dubbed serial"
                            ).length > 0 ? (
                              currentItemsinFiles
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
                        {currentItemsinFiles.filter(item =>
                              item.folderORfile === "file" && item.category === "cartoon"
                            ).length > 0 ? (
                              currentItemsinFiles
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
                      onCreateFolder={() => createFolderInFolders(id)}
                      onPaste={() => pasteClipboardItems(id)}
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
          

            <MoveFileFolderModal
                        isOpen={showMoveModal}
                        onClose={() => setShowMoveModal(false)}
                        onMove={handleMoveInFolders}
                        folders={folders}
                        item={itemToMove}></MoveFileFolderModal>

            

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
            onRename={handleRenameFolders} // pass current item and folder ID
          />


      
      </section>  
    </div>  

     
  )
}

export default FolderItems