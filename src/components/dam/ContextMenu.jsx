import React from "react";

const ContextMenu = ({
  contextMenu,
  clipboard,
  selectedItems,
  onCreateFolder,
  onPaste,
  onOpenFileItems,
  onOpenMetadata,
  setItemToMove,
  setShowMoveModal,
  setItemToCopy,
  setClipboard,
  setContextMenu,
  setItemToRename,
  setShowRenameModal,
  confirmDelete,
}) => {
  if (!contextMenu.visible) return null;

  return (
    <ul
      className="fixed bg-white border p-1 flex flex-col rounded shadow-lg text-sm z-[9999]"
      style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
    >
      {contextMenu.type === "blank" ? (
        <>
          <li
            className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
            onClick={onCreateFolder}
          >
            ➕ Create New Folder
          </li>
          <hr className="text-gray-300" />
          {clipboard && clipboard.length > 0 && (
            <li
              className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
              onClick={onPaste}
            >
              Paste
            </li>
          )}
        </>
      ) : (
        <>
          {contextMenu.type === "folder" && (
            <li
              className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
              onClick={onOpenFileItems}
            >
              Open Folder
              <hr className="text-gray-300" />
            </li>
          )}
          {contextMenu.type === "file" && (
            <li
              className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
              onClick={onOpenMetadata}
            >
              Open Meta
              <hr className="text-gray-300" />
            </li>
          )}
          <li
            className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
            onClick={() => {
              const items = selectedItems.length
                ? selectedItems
                : [contextMenu.item];
              setItemToMove(items);
              setShowMoveModal(true);
            }}
          >
            Move {contextMenu.type === "folder" ? "Folder" : "File"}
          </li>
          <hr className="text-gray-300" />

          <li
            className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
            onClick={() => {
              setItemToCopy(
                selectedItems.length ? selectedItems : [contextMenu.item]
              );
              setClipboard(
                selectedItems.length ? selectedItems : [contextMenu.item]
              );
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
          >
            Copy
          </li>
          <hr className="text-gray-300" />

          <li
            className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
            onClick={() => {
              const item = selectedItems.length
                ? selectedItems[0]
                : contextMenu.item;
              setItemToRename(item);
              setShowRenameModal(true);
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
          >
            Rename
          </li>
          <hr className="text-gray-300" />

          <li
            className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
            onClick={() => confirmDelete(selectedItems)}
          >
            Delete
          </li>
        </>
      )}
    </ul>
  );
};

export default ContextMenu;
