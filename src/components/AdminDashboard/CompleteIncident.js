import React, { useState } from 'react';
import { Button } from 'antd';
import { nanoid } from 'nanoid';

import AntModal from './AntModalComponent/AntModal';
import { getData } from '../../utils/DashboardHelperFunctions';
import AdminEdit from './forms/AdminEdit';

import './CompleteIncident.css';

/**
 * @typedef CompleteIncidentProps
 * @property {any} incident - incident data
 */

/**
 * Component for displaying/editing incident details on the admin dashboard
 * @param {CompleteIncidentProps} props
 * @returns {JSX.Element} the CompleteIncident component
 */
const CompleteIncident = props => {
  const {
    incident,
  } = props;

  const formatDate = (inputData) => {
    const [year, month, day] = inputData.incident_date.split('-');
    return `${month}/${day.slice(0, 2)}/${year}`;
  };

  const formattedDate = formatDate(incident);

  // setting state to toggle "editing mode"
  const [editing, setEditing] = useState(false);

  // toggle "editing mode"
  const toggleEditor = () => {
    setEditing(!editing);
  };

  // form control functions
  const onFormSubmit = () => {
    setEditing(false);
  };

  return (
    <div className="complete-incident">
      {editing ? (
        <AdminEdit
          initialValues={incident}
          cancel={toggleEditor}
          cleanup={onFormSubmit}
        />
      ) : (
        <div className="complete-incident-dropdown">
          {/* Title */}
          <div className="dropdown-text-wrap">
            <p className="complete-incident-dropdown-titles-bold">Title:</p>
            <p>{incident.title || '(none)'}</p>
          </div>

          {/* Description */}
          <div className="dropdown-text-wrap">
            <p className="complete-incident-dropdown-titles-bold">
              Description:
            </p>
            <p>{incident.description}</p>
          </div>

          {/* Location */}
          <div className="dropdown-text-wrap">
            <p className="complete-incident-dropdown-titles-bold">Location:</p>
            <p className="location-dropdown-wrap">
              {incident.city}, {incident.state}
            </p>
          </div>

          {/* Date */}
          <div className="dropdown-text-wrap">
            <p className="complete-incident-dropdown-titles-bold">Date:</p>
            <p>{formattedDate}</p>
          </div>

          {/* Force Rank */}
          <div className="dropdown-text-wrap">
            <p className="complete-incident-dropdown-titles-bold">
              Force Rank:
            </p>
            <p>{incident.force_rank}</p>
          </div>

          {/* Confidence Rating: */}
          <div className="dropdown-text-wrap">
            <p className="complete-incident-dropdown-titles-bold">
              Confidence Rating:
            </p>
            <p>{(incident.confidence * 100).toFixed(2)}%</p>
          </div>

          {/* Sources */}
          <div className="dropdown-text-wrap">
            <p className="complete-incident-dropdown-titles-bold">Source(s)</p>
            <div>
              {incident.src.map(source => (
                <div key={nanoid()}>
                  <a href={source} rel="noreferrer" target="_blank">
                    {source}
                  </a>
                  <br />
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="dropdown-text-wrap">
            <p className="complete-incident-dropdown-titles-bold">Tags</p>
            <div>{incident.tags ? incident.tags.join(', ') : ''}</div>
          </div>

          {/* Edit button */}
          <Button
            id="dropdown-edit-button"
            className="approve-reject-select"
            onClick={toggleEditor}
          >
            Edit
          </Button>

          {/* Request More Info button */}
          <AntModal incident={incident} />
        </div>
      )}
    </div>
  );
};

export default CompleteIncident;
