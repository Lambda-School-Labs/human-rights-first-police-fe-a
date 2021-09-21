import React from 'react';

const DashboardTop = props => {
  const {
    unapprovedIncidents,
    toggleAddIncident,
    unapproved,
    listType,
  } = props;
  return (
    <div>
      {listType === 'pending' && (
        <h2 id="admin-dashboard-title">
          {' '}
          Pending Incidents: {unapprovedIncidents.length}
        </h2>
      )}
      {listType === 'approved' && (
        <h2 id="admin-dashboard-title"> Approved Incidents</h2>
      )}
      {listType === 'form-responses' && (
        <h2 id="admin-dashboard-title">Form Responses</h2>
      )}

      <div className="confirmation-message-div">
        <div className="incidents-wrap">
          {listType !== 'form-responses' && (
            <button id="create-incident-button" onClick={toggleAddIncident}>
              Create New Incident
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTop;
