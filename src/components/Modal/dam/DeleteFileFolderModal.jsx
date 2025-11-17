import React from 'react';

const DeleteFileFolderModal = ({ show, item, onDelete, onCancel }) => {
  if (!show) return null;

  // Determine the message
  const itemName =
    Array.isArray(item) && item.length > 1
      ? `${item.length} items`
      : item?.title;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md text-center w-80">
        <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
        <p className="mb-6">
          This action will permanently delete <strong>{itemName}</strong>.
        </p>
        <div className="flex justify-around">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onDelete}
          >
            Delete
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFileFolderModal;
