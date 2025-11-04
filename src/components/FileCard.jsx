import React from "react";
import { useNavigate } from "react-router-dom";

const FileCard = ({ item, onRightClick, onSelect, isSelected, onDrop }) => {
  const navigate = useNavigate();

  // Format duration function
  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return [
      hrs > 0 ? String(hrs).padStart(2, "0") : null, // hide 00h if not needed
      String(mins).padStart(2, "0"),
      String(secs).padStart(2, "0"),
    ]
      .filter(Boolean) // removes null if hrs = 0
      .join(":");
  };

  // Handle double click
  const handleDoubleClick = () => {
    navigate(`/api/v1/assets/single?asset_id=${item.asset_id}`);
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("application/json", JSON.stringify(item));
        console.log("Dragging:", item);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const draggedItem = JSON.parse(e.dataTransfer.getData("application/json"));
        if (onDrop) onDrop(draggedItem, item);
        console.log("Dropped on:", item);
      }}
    >
      <div className="relative">
        {/* Selection checkbox */}
        <input
          type="checkbox"
          className="absolute top-2 left-2 z-10 w-4 h-4"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation(); // stop parent div click
            onSelect(item);
          }}
        />

        {/* Folder/file card */}
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            onRightClick(e, item);
          }}
          onClick={(e) => {
            e.stopPropagation(); // prevent bubbling
            if (e.target.type !== "checkbox") {
              onSelect(item);}
          }}
          onDoubleClick={handleDoubleClick}
          className="max-w-[190px] max-h-[250px] rounded-md shadow-sm border relative cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-36 bg-gray-50 rounded-t-md">
            <img src={item.thumbnail_url} alt="" className="w-30 h-full object-cover rounded-t-md" />
          </div>
          <div className="flex flex-col justify-between p-6 space-y-8">
            <div className="space-y-2">
              <p className="text-sm dark:text-gray-800 truncate w-full" title={item.file_name}>
                {item.file_name}
              </p>
              <p className="text-sm dark:text-gray-800">
                <span>Duration:</span> {formatDuration(item.duration)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
