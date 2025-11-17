// Components/RenameFolderModal.jsx
import React, { useState, useEffect } from 'react';

const RenameFolderModal = ({ isOpen, item, onClose, onRename }) => {
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setNewName('');
      return;
    }
    if (item) {
      // support different name keys used in your app
      setNewName(item.file_name ?? item.title ?? item.name ?? '');
    } else {
      setNewName('');
    }
  }, [item, isOpen]);

  const handleRename = () => {
    const trimmed = newName.trim();
    if (!trimmed) return; // validation
    onRename(item, trimmed);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-80">
        <h2 className="text-lg font-semibold mb-3">Rename</h2>
        <input
          type="text"
          className="input input-bordered w-full mb-4"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button className="btn btn-sm" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-sm btn-primary"
            onClick={handleRename}
            disabled={!newName.trim()}
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameFolderModal;
