import React from 'react';
import { useNavigation } from '../hooks/useNavigation';
import { ROUTES } from '../routes';

const NavigationExample = () => {
  const { 
    goTo, 
    goBack, 
    isCurrentPath, 
    getCurrentPath,
    navigateToHome,
    navigateToHome2 
  } = useNavigation();

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Navigation Example</h3>
            </div>
            <div className="card-body">
              <p>Current path: <code>{getCurrentPath()}</code></p>
              
              <div className="btn-group" role="group">
                <button 
                  className={`btn ${isCurrentPath(ROUTES.HOME) ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={navigateToHome}
                >
                  Go to Home
                </button>
                <button 
                  className={`btn ${isCurrentPath(ROUTES.HOME2) ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={navigateToHome2}
                >
                  Go to Home2
                </button>
                <button 
                  className="btn btn-info"
                  onClick={() => goTo('/some-other-route')}
                >
                  Go to Custom Route
                </button>
                <button 
                  className="btn btn-warning"
                  onClick={goBack}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationExample;
