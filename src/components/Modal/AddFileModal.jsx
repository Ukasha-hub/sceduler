import React, { useState } from 'react';
import axios from "axios";
import API from '../../API';

const AddFileModal = ({ onClose }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileProgress, setFileProgress] = useState({});

 // const handleFileChange = (event) => {
  //  const newFiles = Array.from(event.target.files);
  //  setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  //  event.target.value = ""; // reset so same file can be reselected
//  };

const handleFileChange = (event) => {
  const newFiles = Array.from(event.target.files).map(file => ({
    file,
    status: "Idle",       // Idle | Uploading | Success | Error
    progress: 0
  }));
  setFiles(prev => [...prev, ...newFiles]);
};

  

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const newFiles = Array.from(e.dataTransfer.files).map(file => ({
      file,
      status: "Idle",
      progress: 0
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
  
    const updatedFiles = [...files];
  
    for (let i = 0; i < updatedFiles.length; i++) {
      const current = updatedFiles[i];
      updatedFiles[i] = { ...current, status: "Uploading", progress: 0 };
      setFiles([...updatedFiles]);
  
      try {
        const formData = new FormData();
        for (let [key, value] of formData.entries()) {
  console.log(key, value);
}
        formData.append("files", current.file);
  
        await API.post("/api/v1/upload", formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            updatedFiles[i] = { ...current, status: "Uploading", progress };
            setFiles([...updatedFiles]);
          },
        });
  
        updatedFiles[i] = { ...current, status: "Success", progress: 100 };
      } catch (error) {
        updatedFiles[i] = { ...current, status: "Error", progress: 0 };
      }
  
      setFiles([...updatedFiles]);
    }
  };

  const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);


  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-[9999]">
      <div className="relative bg-white p-6 rounded-lg shadow-xl w-[70%] max-w-4xl max-h-[90vh]  overflow-y-auto">
        
        {/* Heading */}
        <div className="flex font-bold text-sm lg:text-lg flex-row justify-between mb-4">
          <h1>Add File(s)</h1>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-lg font-bold"
          >
            ✖
          </button>
        </div>

        <div className="border-2 bg-base-100 border-base-300 p-6">
          <h1 className="text-sm lg:text-lg font-bold">Select files</h1>

          {/* File Upload Field with Drag & Drop */}
          <div
            className={`w-full space-y-2 p-4 border-2 rounded-md bg-gray-100 ${isDragging ? 'border-dashed border-blue-500' : 'border-solid border-transparent'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex items-center justify-between p-2 text-xs  rounded-md bg-gray-300">
              <span>Filename</span><span className=''>Size</span><span>Status</span><span>  </span>
            </div>

            <div className="flex flex-col gap-2">
              <input
                type="file"
                id="fileInput"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Drag and drop text */}
              <p className="text-center text-gray-500 italic">Drag and drop files here</p>

              {/* Display Selected Files */}
              <div className="mt-2 space-y-1">
                {files.length === 0 ? (
                  <p className="text-sm text-gray-500">No files selected.</p>
                ) : (
                  files.map((fileObj, index) => (
                    <div key={index} className="flex flex-col border rounded-md p-2 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-sm w-32 truncate">{fileObj.file.name}</span>
                        <span>({(fileObj.file.size / (1024 ** 3)).toFixed(2)} GB)</span>
                        <span className="ml-2 text-xs">
                          {fileObj.status} <span>{fileObj.progress}%</span>
                        </span>
                        <button
                          onClick={() => removeFile(index)}
                          className="btn btn-xs btn-circle bg-red-700 text-white"
                          disabled={fileObj.status === "Uploading"}
                        >
                          x
                        </button>
                      </div>
                  
                      {/* Progress bar */}
                      {fileObj.status === "Uploading" && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                            style={{ width: `${fileObj.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Buttons + Status */}
          <div className="flex flex-col lg:flex-row justify-between mt-4">
            <div className="flex gap-2">
              <label htmlFor="fileInput" className="btn btn-sm rounded-2 bg-gray-300">Select Files</label>
              
            </div>
            <div className="flex gap-2">
              <div>Total Size: {(totalSize / (1024 ** 3)).toFixed(2)} GB</div>
            </div>
            
          </div>

          {/* {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )} */}
          

          {/* Options */}
          <div className="flex flex-row mt-4">
            <input type="checkbox" defaultChecked className="checkbox" />
            <h3 className="ml-2">Extract zip-archive and save folder structures.</h3>
          </div>

          <div className="mt-10 flex justify-center">
          <label
                className="btn btn-sm bg-gray-300 rounded-2"
                onClick={handleUpload}
                disabled={files.length === 0 || uploading}
              >
                Start Upload
              </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFileModal;
