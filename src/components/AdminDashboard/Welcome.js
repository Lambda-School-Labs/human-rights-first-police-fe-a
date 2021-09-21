import React, { useEffect, useState } from 'react';
import './Welcome.css';

const Welcome = props => {
  const { pendingCount } = props;

  const [showModal, setShowModal] = useState(false);
  const HAS_VISITED_BEFORE = localStorage.getItem('hasVisitedBefore');

  useEffect(() => {
    const handleShowModal = () => {
      if (HAS_VISITED_BEFORE && HAS_VISITED_BEFORE > new Date()) {
        return;
      }
      if (!HAS_VISITED_BEFORE) {
        setShowModal(true);
        let expires = new Date();
        expires = expires.setHours(expires.getHours() + 24);
        localStorage.setItem('hasVisitedBefore', expires);
      }
    };
    window.setTimeout(handleShowModal, 2000);
    window.scrollTo(0, 0);
  }, [HAS_VISITED_BEFORE]);

  const modalHandler = () => {
    setShowModal(false);
  };

  return (
    <>
      {showModal &&
        <>
          <div className="back-drop"></div>

          <div
            className="modal-wrapper"
            style={{
              display: showModal ? 'block' : 'none',
            }}
          >
            <div className="modal-header">
              <p>Welcome</p>
            </div>
            <div className="modal-content">
              <div className="modal-body">
                <h4>Note: </h4>
                <p>
                  There are currently{' '}
                  <span
                    style={{
                      color: 'red',
                    }}
                  >
                    {pendingCount}
                  </span>{' '}
                  unapproved incidents are awaiting your review. 'Select All' to
                  approve all incidents with the click of a button or alternatively,
                  select 'More Info' to inspect, edit, approve or disapprove incidents
                  1 by 1.
                </p>
                <p>
                  You can manually create an incident by using the 'Create New
                  Incident' button
                </p>
              </div>
              <div className="modal-footer">
                <button onClick={modalHandler} className="btn-cancel">
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      }
    </>
  );
};

export default Welcome;
