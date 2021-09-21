import { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { Divider, Popover, Button, Tag } from 'antd';
import sourceListHelper from '../../../utils/sourceListHelper';
import { nanoid } from 'nanoid';

// styled incident card on map
const MapIncidentInfo = styled.div`
  margin-left: '8%';
  @media (min-device-width: 800px) {
    margin-left: '0%';
  }
`;

const INCIDENT_ZOOM_LEVEL = 12;
// searches incident by cluster
export default function IncidentFocusCard({ id, zoomOnCluster }) {
  const incident = useSelector(state => state.incident.data[id]);
  const date = useMemo(() => {
    if (incident?.date) {
      const dt = DateTime.fromISO(incident.date);
      return dt.isValid
        ? dt.plus({ days: 1 }).toLocaleString(DateTime.DATE_MED)
        : '';
    } else {
      return '';
    }
  }, [incident]);

  const zoomOnIncident = useCallback(() => {
    zoomOnCluster(INCIDENT_ZOOM_LEVEL, incident.long, incident.lat);
  }, [incident, zoomOnCluster]);

  return (
    <div className="map-incident-card">
      <div className="card-title">
        <h4 className=".date">{date}</h4>
        <h4>
          <span className="location" onClick={zoomOnIncident}>
            {`${incident?.city}, ${incident?.state}`}
          </span>
        </h4>
      </div>
      <div className="incidentHeader">
        <h2>{incident?.title}</h2>
      </div>
      <h4>{incident?.force_rank}</h4>

      {incident?.categories
        ? incident.categories.map(cat => (
            <Tag key={nanoid()}>
              {cat.charAt(0).toUpperCase() + cat.slice(1).replaceAll('-', ' ')}
            </Tag>
          ))
        : ''}
      <MapIncidentInfo className="map-incident-info">
        <p className="incident-description">{incident?.desc}</p>
        <Popover content={sourceListHelper(incident?.src)} placement="rightTop">
          <Button
            type="primary"
            style={{ backgroundColor: '#2f54eb', border: 'none' }}
          >
            Sources
          </Button>
        </Popover>
      </MapIncidentInfo>
      <Divider style={{ borderWidth: '1px' }} />
    </div>
  );
}
