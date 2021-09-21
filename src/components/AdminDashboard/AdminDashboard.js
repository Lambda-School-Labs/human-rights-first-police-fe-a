import React, { useState, useEffect } from 'react';

import './AdminDashboard.css';

import AddIncident from './AddIncident';
import DashboardTop from './DashboardTop';
import Welcome from './Welcome';
import useOktaAxios from '../../hooks/useOktaAxios';
import IncidentStatus from './IncidentStatus';
import AntTable from './AntTableComponents/AntTable';
import {
  putIncidents,
  getLatAndLong,
  getApprovedIncidents,
  getPendingIncidents,
  getFormResponses,
} from '../../utils/DashboardHelperFunctions.js';


const AdminDashboard = () => {
  /** List of selected (checked) incident_ids */
  const [selectedIds, setSelectedIds] = useState([]);

  // The three categories of incidents
  const [formResponses, setFormResponses] = useState([]);
  const [pendingIncidents, setPendingIncidents] = useState([]);
  const [approvedIncidents, setApprovedIncidents] = useState([]);

  // The incident tab to display: 'pending', 'approved', 'form-responses'
  const [listType, setListType] = useState('pending');

  // returns the corrent incidents array for the current tab
  const getCurrentList = () => {
    switch (listType) {
      case 'pending':
        return pendingIncidents;
      case 'approved':
        return approvedIncidents;
      case 'form-responses':
        return formResponses;
      default:
        return [];
    }
  };

  // resets the selected incidents when switching tabs
  useEffect(() => {
    setSelectedIds([]);
  }, [listType]);

  // gives the active tab a different color
  const selectedTabButtonStyle = {
    background: '#095fab'
  };

  // toggles whether or not the addIncident popup is displayed
  const [adding, setAdding] = useState(false);

  // toggling rendering of AddIncident pop up modal
  const toggleAddIncident = evt => {
    evt.preventDefault();
    setAdding(true);
  };

  // authorized axios
  const oktaAxios = useOktaAxios();

  // downloads all incident data
  const fetchIncidents = () => {
    getApprovedIncidents(oktaAxios)
      .then(setApprovedIncidents)
      .catch(console.log);

    getPendingIncidents(oktaAxios)
      .then(setPendingIncidents)
      .catch(console.log);

    getFormResponses(oktaAxios)
      .then(setFormResponses)
      .catch(console.log);
  };

  // loads incident data on first render
  useEffect(() => {
    fetchIncidents();
  }, []);

  // approves or rejects the selected incidents
  const approveAndRejectHandler = async (newStatus) => {
    const currentList = getCurrentList();
    const selected = currentList.filter(inc => selectedIds.includes(inc.incident_id));

    // setting lat and long for approved incidents
    if (newStatus === 'approved') {
      for (const inc of selected) {
        if (inc.city && inc.state) {
          try {
            const latAndLong = await getLatAndLong(inc);
            inc.lat = latAndLong[0];
            inc.long = latAndLong[1];
          } catch (err) {
            console.log(err);
          }
        }
      }
    }

    putIncidents(oktaAxios, selected, newStatus)
      .then(res => {
        setSelectedIds([]);
        fetchIncidents();
      })
      .catch(err => {
        console.log(err);
        // TODO: Better error handling!
      });
  };

  return (
    <>
      {/* Welcome message */}
      <Welcome pendingCount={pendingIncidents.length} />

      {/* Incident "tabs" - unapproved, approved, form responses */}
      <div className="dashboard-buttons-container">
        <div className="incident-btn-container">
          <button
            className="approve-btn"
            style={listType === 'pending' ? selectedTabButtonStyle : {}}
            onClick={() => setListType('pending')}
          >
            Pending Incidents
          </button>
          <button
            className="approve-btn"
            style={listType === 'approved' ? selectedTabButtonStyle : {}}
            onClick={() => setListType('approved')}
          >
            Approved Incidents
          </button>
          <button
            className="approve-btn"
            style={listType === 'form-responses' ? selectedTabButtonStyle : {}}
            onClick={() => setListType('form-responses')}
          >
            Form Responses
          </button>
        </div>
      </div>

      <div className="dashboard-container">
        <DashboardTop
          unapprovedIncidents={pendingIncidents}
          toggleAddIncident={toggleAddIncident}
          listType={listType}
        />

        {selectedIds.length > 0 &&
          <span>{selectedIds.length} selected</span>
        }

        {/* Controls for setting the status of selected incidents (unapproved, pending, approved) */}
        <IncidentStatus
          isActive={selectedIds.length > 0}
          listType={listType}
          onStatusConfirm={approveAndRejectHandler}
        />

        {/* modal popup for adding a new incident */}
        {adding &&
          <AddIncident
            setAdding={setAdding}
          />
        }

        {listType === 'pending' &&
          <div className="incidents">
            <AntTable
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              incidents={pendingIncidents}
              showConfidence={true}
            />
          </div>
        }

        {listType === 'approved' &&
          <div className="incidents">
            <AntTable
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              incidents={approvedIncidents}
            />
          </div>
        }

        {listType === 'form-responses' &&
          <div className="incidents">
            <AntTable
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              incidents={formResponses}
            />
          </div>
        }

      </div>
    </>
  );
};
export default AdminDashboard;
