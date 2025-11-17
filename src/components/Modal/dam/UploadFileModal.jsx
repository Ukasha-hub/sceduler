import React from 'react'

const UploadFileModal = ({  success, error, errorMessage }) => {
  
    

      if (success) {
        return (
          <div className="modal modal-open">
            <div className="modal-box">
              <h2 className="text-xl font-bold text-green-500">Upload Successful!</h2>
              <p>Your files have been uploaded successfully.</p>
              <div className="flex justify-center mt-4">
                <button className="btn btn-success" onClick={() => window.location.reload()}>Close</button>
              </div>
            </div>
          </div>
        );
      }

      if (error) {
        return (
          <div className="modal modal-open">
            <div className="modal-box">
              <h2 className="text-xl font-bold text-red-500">Upload Failed</h2>
              <p>{errorMessage}</p>
              <div className="flex justify-center mt-4">
                <button className="btn btn-error" onClick={() => window.location.reload()}>Close</button>
              </div>
            </div>
          </div>
        );
      }
}

export default UploadFileModal