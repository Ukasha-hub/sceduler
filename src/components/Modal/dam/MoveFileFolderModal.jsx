import React, { useState } from 'react';

const MoveFileFolderModal = ({ isOpen, onClose, onMove, folders, item }) => {
  const [selectedFolderId, setSelectedFolderId] = useState('');

  const handleMove = () => {
    const destination = selectedFolderId === "null" ? null : selectedFolderId;

    if (destination !== '') {
      const itemsToMove = Array.isArray(item) ? item : [item];

      itemsToMove.forEach(singleItem => {
        onMove(singleItem, destination);
      });

      onClose();
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  const isFolder = item?.folderORfile === 'folder';
  const currentFolderIds = Array.isArray(item) ? item.map(i => i.id) : [item?.id];

  return (
    <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-xl w-96 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Move {isFolder ? 'Folder(s)' : 'File(s)'}</h2>

        <select
          className="w-full p-2 mb-4 border rounded"
          value={selectedFolderId}
          onChange={(e) => setSelectedFolderId(e.target.value)}
        >
          <option value="">Select destination folder</option>
          <option value="null">Homepage</option>
          {folders
            .filter(folder => !currentFolderIds.includes(folder.id))
            .map(folder => (
              <option key={folder.id} value={folder.id}>{folder.title}</option>
            ))}
        </select>

        <div className="flex justify-end gap-2">
          <button className="btn btn-sm" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-sm btn-primary"
            disabled={!selectedFolderId}
            onClick={handleMove}
          >
            Move
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveFileFolderModal;
