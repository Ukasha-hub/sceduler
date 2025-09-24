import React from 'react';
import './Card.module.css';

const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  headerActions,
  ...props 
}) => {
  return (
    <div className={`card ${className}`} {...props}>
      {(title || subtitle || headerActions) && (
        <div className="card-header">
          <div className="card-title-container">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {headerActions && (
            <div className="card-tools">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;
