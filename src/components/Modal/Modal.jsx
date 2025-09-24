import React from 'react';
import './Modal.module.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  className = '',
  ...props 
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    small: 'modal-sm',
    medium: '',
    large: 'modal-lg',
    xl: 'modal-xl'
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }} {...props}>
      <div className={`modal-dialog ${sizeClasses[size]} ${className}`}>
        <div className="modal-content">
          {title && (
            <div className="modal-header">
              <h4 className="modal-title">{title}</h4>
              <button
                type="button"
                className="close"
                onClick={onClose}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          )}
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </div>
  );
};

export default Modal;
