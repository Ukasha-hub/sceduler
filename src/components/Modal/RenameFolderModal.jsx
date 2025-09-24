// Components/RenameFolderModal.jsx
import React, { useState, useEffect } from 'react';

const RenameFolderModal = ({ isOpen, item, onClose, onRename }) => {
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (item) {
      setNewName(item.title);
    }
  }, [item]);

  const handleRename = () => {
    if (newName.trim()) {
      onRename(item, newName.trim());
      onClose();
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-80">
        <h2 className="text-lg font-semibold mb-3">Rename Folder/File</h2>
        <input
          type="text"
          className="input input-bordered w-full mb-4"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="btn btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-sm btn-primary" onClick={handleRename}>Rename</button>
        </div>
      </div>
    </div>
  );
};

export default RenameFolderModal;
