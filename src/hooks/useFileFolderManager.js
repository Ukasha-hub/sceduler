import { useNavigate } from "react-router-dom";
import cardData from "../services/CardData";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const useFileFolderManager = () =>{
       
      
        const [activeTab, setActiveTab] = useState("folder-content");  
        const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, type: null, item:null }); //right button menu
       const [showMoveModal, setShowMoveModal] = useState(false);
        
        const [showCopyModal, setShowCopyModal] = useState(false);
        const [itemToCopy, setItemToCopy] = useState(null);
        const [itemToMove, setItemToMove] = useState([]);
      
        const [selectedItems, setSelectedItems] = useState([]);
      
        const [showDeleteModal, setShowDeleteModal] = useState(false);
      const [itemToDelete, setItemToDelete] = useState(null);

      const [items, setItems] = useState([]);

      const [clipboard, setClipboard] = useState(null);

      const [showRenameModal, setShowRenameModal] = useState(false);
      const [itemToRename, setItemToRename] = useState(null);


      const [cards, setCards] = useState(() => {
        const saved = localStorage.getItem('cards');
        return saved ? JSON.parse(saved) : cardData;
      });


     

       //moved files or folders will be hidden from top level
       const topLevelItems = useMemo(() => {
        return cards.filter(item =>
          !cards.some(card =>
            card.folderORfile === 'folder' &&
            card.folderItems.includes(item.id)
          )
        );
      }, [cards]);


      useEffect(() => {
        if (clipboard) localStorage.setItem("clipboard", JSON.stringify(clipboard));
      }, [clipboard]);

      useEffect(() => {
        const storedClipboard = JSON.parse(localStorage.getItem("clipboard"));
        if (storedClipboard) setClipboard(storedClipboard);
      }, []);

     // Compute filtered items based on active tab
const filteredItems = useMemo(() => {
  if (activeTab === "videos") {
    return cards.filter(item => item.folderORfile === "file");
  } else if (activeTab === "category") {
    return cards.filter(item =>
      item.folderORfile === "file" &&
      (item.category === "Dubbed serial" || item.category === "cartoon")
    );
  }
  // default: all top-level items
  return cards.filter(item => !item.parent);
}, [cards, activeTab]);
    

    const [sortBy, setSortBy] = useState("name"); // default sort
const [sortOrder, setSortOrder] = useState("asc"); // ascending or descending

const sortedFilteredItems = useMemo(() => {
  return [...filteredItems].sort((a, b) => {
    if (sortBy === "name") {
      const nameA = a.title.toLowerCase();
      const nameB = b.title.toLowerCase();
      return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    }
    return 0;
  });
}, [filteredItems, sortBy, sortOrder]);

const handleSort = (criteria) => {
  if (sortBy === criteria) {
    // Toggle order if same sort clicked
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  } else {
    setSortBy(criteria);
    setSortOrder("asc"); // default to ascending on new sort
  }
};



 //Pagination handling 

 const [currentPage, setCurrentPage] = useState(1);
        
 const [itemsPerPage, setItemsPerPage] = useState(15);



 const totalPages = Math.ceil(sortedFilteredItems.length / itemsPerPage);; // Calculate total pages
   // Calculate start and end indices for current page
   const startIndex = (currentPage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;
 const currentItems = sortedFilteredItems.slice(startIndex, endIndex);
 const paginatedTopLevelItems = topLevelItems.slice(startIndex, endIndex);

 // Change page function
 const changePage = (page) => {
   if (page > 1 && page <= totalPages) {
     setCurrentPage(page);
   }
 };

 const handleItemsPerPageChange = (count) => {
  setItemsPerPage(count);
  setCurrentPage(1); // Reset to page 1 when changing items per page
};

//For folderItems
const [sortByinFiles, setSortByinFiles] = useState("name"); // default sort
const [sortOrderinFiles, setSortOrderinFiles] = useState("asc"); // ascending or descending

const sortedItemsinFiles = [...items].sort((a, b) => {
  if (sortByinFiles === "name") {
    const nameA = a.title.toLowerCase();
    const nameB = b.title.toLowerCase();
    return sortOrderinFiles === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  }
  // Add more sorting options here
  return 0;
});

const handleSortinFiles = (criteria) => {
  if (sortBy === criteria) {
    // Toggle order if same sort clicked
    setSortOrderinFiles((prev) => (prev === "asc" ? "desc" : "asc"));
  } else {
    setSortByinFiles(criteria);
    setSortOrderinFiles("asc"); // default to ascending on new sort
  }
};

const [currentPageinFiles, setCurrentPageinFiles] = useState(1);
        
 const [itemsPerPageinFiles, setItemsPerPageinFiles] = useState(15);
 const totalPagesinFiles = Math.ceil(sortedItemsinFiles .length / itemsPerPageinFiles); // Calculate total pages
   // Calculate start and end indices for current page
   const startIndexinFiles = (currentPageinFiles - 1) * itemsPerPageinFiles;
   const endIndexinFiles = startIndexinFiles + itemsPerPageinFiles;
 const currentItemsinFiles = sortedItemsinFiles.slice(startIndexinFiles, endIndexinFiles);
 const paginatedTopLevelItemsinFiles = items.slice(startIndexinFiles, endIndexinFiles);

  // Change page function
  const changePageinFiles = (page) => {
    if (page > 1 && page <= totalPagesinFiles) {
      setCurrentPageinFiles(page);
    }
  };
 
  const handleItemsPerPageChangeinFiles = (count) => {
   setItemsPerPageinFiles(count);
   setCurrentPageinFiles(1); // Reset to page 1 when changing items per page
 };


    useEffect(() => {
        localStorage.setItem('cards', JSON.stringify(cards));
      }, [cards]);

      const handleSelectItem = (item) => {
        setSelectedItems((prevSelected) => {
          const exists = prevSelected.find(i => i.id === item.id);
          if (exists) {
            return prevSelected.filter(i => i.id !== item.id);
          } else {
            return [...prevSelected, item];
          }
        });
      };
      
      

      
      
      const navigate = useNavigate(); 
      
       const handleRightClick = (e, item) => {
          e.preventDefault(); // prevent default context menu
      
        const isAlreadySelected = selectedItems.some(i => i.id === item.id);
      
        // If right-clicked item is not already selected, select only that one
        if (!isAlreadySelected) {
          setSelectedItems([item]);
        }
          setContextMenu({
              visible: true,
              x: e.clientX,
              y: e.clientY,
              type: item.folderORfile,  // 'folder' or 'file'
              item: item,
          });
        };
      
        //opening metadata using right button menu/context menu
        const handleOpenMetadata = () => {
          if (contextMenu.item && contextMenu.item.id) {
            navigate(`/metadata/${contextMenu.item.id}`);
          }
        };
      
        //opening Folder items using right button menu/context menu
        const handleOpenFileItems = () => {
          if (contextMenu.item && contextMenu.item.id) {
            navigate(`/folderitem/${contextMenu.item.id}`);
          }
        };
      
        // Close context/right button menu on outside click 
        useEffect(() => {
          const handleClick = () => setContextMenu({ ...contextMenu, visible: false });
          
      
          window.addEventListener('click', handleClick);
          
          return () => {
            window.removeEventListener('click', handleClick);
            
          };
        }, [contextMenu]);
      
        
      
        
        
        const handleMove = (itemsToMove, targetFolderId) => {
          const updatedCards = [...cards];
      
          const destinationFolder = updatedCards.find(
            card => card.id === parseInt(targetFolderId)
          );
        
          if (!destinationFolder || destinationFolder.folderORfile !== 'folder') return;
        
          const items = Array.isArray(itemsToMove) ? itemsToMove : [itemsToMove];
        
          items.forEach(item => {
            // Remove from any existing folders
            updatedCards.forEach(folder => {
              if (folder.folderItems) {
                folder.folderItems = folder.folderItems.filter(id => id !== item.id);
              }
            });
        
            // Add to destination folder
            destinationFolder.folderItems.push(item.id);
          });
        
          setCards(updatedCards);
          localStorage.setItem("cards", JSON.stringify(updatedCards));
          console.log(`Moved ${items.length} item(s) to folder ID: ${targetFolderId}`);
        };

        const handleMoveInFolders = (itemsToMove, targetFolderId) => {
            const updatedCards = [...cards];
          
            const items = Array.isArray(itemsToMove) ? itemsToMove : [itemsToMove];
          
            // Remove items from any existing folders
            updatedCards.forEach(folder => {
              if (folder.folderItems) {
                folder.folderItems = folder.folderItems.filter(
                  id => !items.some(item => item.id === id)
                );
              }
            });
          
            // If moving to a folder (not homepage)
            if (targetFolderId !== null) {
              const destinationFolder = updatedCards.find(
                card => card.id === parseInt(targetFolderId)
              );
          
              if (!destinationFolder || destinationFolder.folderORfile !== 'folder') return;
          
              items.forEach(item => {
                destinationFolder.folderItems.push(item.id);
              });
            }
          
            setCards(updatedCards);
            localStorage.setItem("cards", JSON.stringify(updatedCards));
            console.log(`Moved ${items.length} item(s) to ${targetFolderId === null ? 'Homepage' : 'folder ID: ' + targetFolderId}`);
          };
        
      
        
      
        const folders = cards.filter(f => f.folderORfile === 'folder');
      
        const confirmDelete = (item) => {
          setItemToDelete(item);
          setShowDeleteModal(true);
        };
        
        const handleDelete = () => {
          const itemIds = itemToDelete.map(item => item.id);
        
          const updatedCards = cards
            .filter(card => !itemIds.includes(card.id))
            .map(card => {
              if (card.folderItems) {
                return {
                  ...card,
                  folderItems: card.folderItems.filter(
                    id => !itemIds.includes(id) && !itemIds.includes(String(id))
                  ),
                };
              }
              return card;
            });
        
          setCards(updatedCards);
          localStorage.setItem("cards", JSON.stringify(updatedCards));
          setShowDeleteModal(false);
          setItemToDelete(null);
          setSelectedItems([]); // clear selection
          window.location.reload();
        };
        
      
        const cancelDelete = () => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        };

        
      
        

        const pasteClipboardItems = (parentId = null) => {
          if (!clipboard || clipboard.length === 0) return;
        
          const data = JSON.parse(localStorage.getItem("cards")) || [];
        
          const newItems = clipboard.map(item => {
            const newId = Date.now() + Math.floor(Math.random() * 1000);
            return {
              ...item,
              id: newId,
              title: item.title + " (copy)",
              parent: parentId ? parseInt(parentId) : null,
            };
          });
        
          const updated = [...data, ...newItems];
        
          if (parentId !== null && parentId !== undefined) {
            const parentFolderIndex = updated.findIndex(item => item.id === parseInt(parentId));
            if (parentFolderIndex !== -1) {
              const parentFolder = updated[parentFolderIndex];
              parentFolder.folderItems = parentFolder.folderItems || [];
              newItems.forEach(newItem => {
                parentFolder.folderItems.push(newItem.id);
              });
            }
          }
        
          localStorage.setItem("cards", JSON.stringify(updated));
          setCards(updated);
        
          if (parentId !== null && parentId !== undefined) {
            const parentFolder = updated.find(item => item.id === parseInt(parentId));
            const updatedChildItems = updated.filter(item =>
              parentFolder?.folderItems.includes(item.id)
            );
            setItems(updatedChildItems);
          } else {
            const topLevelItems = updated.filter(item => item.parent === null || item.parent === undefined);
            setItems(topLevelItems);
          }
        
          setClipboard(null);
          localStorage.removeItem("clipboard");
          setContextMenu(prev => ({ ...prev, visible: false }));
          {/*window.location.reload(); */}
          
        };

        
        
        const handleSelectAll = (items) => {
          if (Array.isArray(items)) {
            setSelectedItems((prevSelected) => {
              if (prevSelected.length === items.length) {
                return []; // Deselect all if all are already selected
              } else {
                return items.map(item => item); // Select all
              }
            });
          } else {
            console.error("Items is not an array", items);
          }
        }; 
        
        const handleRenameHomePage = (item, newName) => {
          const data = JSON.parse(localStorage.getItem("cards")) || [];
          const updatedData = data.map(i =>
            i.id === item.id ? { ...i, title: newName } : i
          );
          localStorage.setItem("cards", JSON.stringify(updatedData));
          setCards(updatedData);
        };

        useEffect(() => {
          const handleClickOutside = () => {
            if (contextMenu.visible) {
              setContextMenu(prev => ({ ...prev, visible: false }));
            }
          };
          window.addEventListener("click", handleClickOutside);
          return () => window.removeEventListener("click", handleClickOutside);
        }, [contextMenu.visible]);

        

        const handleDrop = (draggedItem, targetFolder) => {
          if (!targetFolder || targetFolder.folderORfile !== "folder") return;
        
          const updated = [...cards];
          const draggedIndex = updated.findIndex(i => i.id === draggedItem.id);
          const targetIndex = updated.findIndex(i => i.id === targetFolder.id);
        
          if (draggedIndex !== -1 && targetIndex !== -1) {
            const dragged = updated[draggedIndex];
            const target = updated[targetIndex];
        
            // Remove from old parent's folderItems (only if different from new parent)
            if (dragged.parent !== null && dragged.parent !== target.id) {
              const oldParentIndex = updated.findIndex(i => i.id === dragged.parent);
              if (oldParentIndex !== -1) {
                updated[oldParentIndex].folderItems = updated[oldParentIndex].folderItems?.filter(id => id !== dragged.id);
              }
            }
        
            // Set new parent
            dragged.parent = target.id;
        
            // Add to new parent's folderItems
            target.folderItems = target.folderItems || [];
            if (!target.folderItems.includes(dragged.id)) {
              target.folderItems.push(dragged.id);
            }
        
            // Save and update
            localStorage.setItem("cards", JSON.stringify(updated));
            setCards(updated);
        
            // Refresh view based on current location
            const currentFolderId = parseInt(window.location.pathname.split("/").pop());
            if (!isNaN(currentFolderId)) {
              const currentFolder = updated.find(item => item.id === currentFolderId);
              const currentItems = updated.filter(item => currentFolder?.folderItems?.includes(item.id));
              setItems(currentItems);
            } else {
              const topLevelItems = updated.filter(item => !item.parent);
              setItems(topLevelItems);
            }
        
            console.log("handleDrop called", dragged, target);
          }
        };

        const createFolderInHomepage = async () => {
          const data = JSON.parse(localStorage.getItem("cards")) || [];
      
          const newFolder = {
            id: Date.now(),
            title: `New Folder ${Date.now().toString().slice(-4)}`,
            folderORfile: "folder",
            image: "https://www.iconpacks.net/icons/2/free-folder-icon-1485-thumb.png",
            folderItems: [],
            
          };
      
          data.push(newFolder);
      
         
      
          localStorage.setItem("cards", JSON.stringify(data));
      
          // Update local state
          
          setContextMenu(prev => ({ ...prev, visible: false }));
          {/* */}
           {/*window.location.reload(); */}
        };

        const createFolderInFolders = async (id) => {
          const data = JSON.parse(localStorage.getItem("cards")) || [];
      
          const newFolder = {
            id: Date.now(),
            title: `New Folder ${Date.now().toString().slice(-4)}`,
            folderORfile: "folder",
            image: "https://www.iconpacks.net/icons/2/free-folder-icon-1485-thumb.png",
            folderItems: [],
            parent: parseInt(id), // current folder as parent
          };
      
          data.push(newFolder);
      
          const parentFolderIndex = data.findIndex(item => item.id === parseInt(id));
          if (parentFolderIndex !== -1) {
            const parentFolder = data[parentFolderIndex];
            parentFolder.folderItems = parentFolder.folderItems || [];
            parentFolder.folderItems.push(newFolder.id);
          }
      
          localStorage.setItem("cards", JSON.stringify(data));
      
          // Update local state
          setCards(data);
          const updatedChildItems = data.filter(item =>
            data[parentFolderIndex]?.folderItems.includes(item.id)
          );
          setItems(updatedChildItems);
          setContextMenu(prev => ({ ...prev, visible: false }));
          {/*window.location.reload(); */}
          
        };
      
        
        
        
        


        return{createFolderInFolders, createFolderInHomepage, handleDrop,  handleRenameHomePage,itemToRename, setItemToRename, showRenameModal, setShowRenameModal, handleSelectAll, pasteClipboardItems, clipboard, setClipboard, handleItemsPerPageChangeinFiles , changePageinFiles ,paginatedTopLevelItemsinFiles,currentItemsinFiles,totalPagesinFiles,itemsPerPageinFiles, setItemsPerPageinFiles, currentPageinFiles, setCurrentPageinFiles,handleSortinFiles,sortOrderinFiles, setSortOrderinFiles, sortByinFiles, setSortByinFiles,sortedItemsinFiles,items, setItems, itemsPerPage,handleItemsPerPageChange ,handleSort,sortBy, sortOrder,currentPage, setCurrentPage, changePage,totalPages,currentItems,paginatedTopLevelItems , activeTab,  setActiveTab, contextMenu, setContextMenu, showMoveModal, setShowMoveModal, showCopyModal, setShowCopyModal, 
            itemToCopy, setItemToCopy, itemToMove, setItemToMove, selectedItems, setSelectedItems, showDeleteModal, setShowDeleteModal, 
            itemToDelete, setItemToDelete, cards, setCards,  topLevelItems, handleSelectItem, navigate, handleRightClick, handleOpenMetadata,
            handleOpenFileItems, folders,  confirmDelete, handleDelete, handleMove,handleMoveInFolders, cancelDelete}


}

export default useFileFolderManager