import React from 'react';


function Home() {


    
   

    

    

  return (
    <div>
     {/* <PageHeader></PageHeader>

      
      <section className="content">
        <div className="container-fluid">
          
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        
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
                  showAddFileModal={showAddFileModal}
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
                  {currentItems.map((item) => (
    <div key={item.id} className="border-b-2 border-dotted border-gray-300 pb-4">
      <FolderCard
        item={item}
        onRightClick={handleRightClick}
        onSelect={handleSelectItem}
        isSelected={selectedItems.some((i) => i.id === item.id)}
        onDrop={handleDrop}
      />
    </div>
  ))}

                 
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
      </section> */}


     


    </div>
  );
}
 
export default Home;