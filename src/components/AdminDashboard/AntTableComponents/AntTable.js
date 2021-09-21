import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import CompleteIncident from '../CompleteIncident';
import { DateTime } from 'luxon';

//https://ant.design/components/table/ <---documentation on the table

/**
 * @typedef AntTableProps
 * @property {any[]} incidents - incident data
 * @property {number[]} selectedIds - an aray of the currently selected incident IDs
 * @property {React.Dispatch<React.SetStateAction<number[]>} setSelectedIds - setter for selected IDs
 * @property {boolean} showConfidence - shows a column for incident confidence
 */

/**
 * Component for rendering a list of incident data on the AdminDashboard
 *
 * @param {AntTableProps} props
 * @returns {JSX.Element} the AntTable component
 */
function AntTable(props) {
  const { selectedIds, setSelectedIds, incidents, showConfidence } = props;

  const [selectedRows, setSelectedRows] = useState([]);

  // formats the date in the table
  function renderDate(date) {
    return DateTime.fromISO(date)
      .plus({ days: 1 })
      .toLocaleString(DateTime.DATETIME_MED);
  }

  const onSelect = selectedIncidents => {
    if (setSelectedIds !== undefined) {
      setSelectedIds(selectedIncidents);
    } else {
      setSelectedRows(selectedIncidents);
    }
  };

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      fixed: 'top',
      width: '50%'
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      align: 'left',
      fixed: 'top',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      fixed: 'top',
    },
    {
      title: 'Date',
      dataIndex: 'incident_date',
      key: 'incident_date',
      fixed: 'top',
      defaultSortOrder: 'descend',
      sorter: (a, b) => {
        let aTime = DateTime.fromISO(a.incident_date.slice(0.1));
        let bTime = DateTime.fromISO(b.incident_date.slice(0, 10));

        return aTime - bTime;
      },
      render: renderDate
    },
  ];

  if (showConfidence) {
    const confidenceColumn = {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      render: c => `${(c * 100).toFixed(3)}%`,
    };

    // Juggling columns to insert confidence column
    const date = columns.pop();
    columns.push(confidenceColumn);
    columns.push(date);
  }

  return (
    <div>
      <Table
        columns={columns}
        dataSource={incidents}
        rowKey={'incident_id'}
        expandable={{
          expandedRowRender: incident => {
            incident.src = Object.values(incident.src); //changes structure of payload returned from initial GET request to match other listTypes' payload structure
            incident.tags = Object.values(incident.tags); //changes structure of payload returned from initial GET request to match other listTypes' payload structure
            return (
              <CompleteIncident incident={incident} />
            );
          },
          rowExpandable: data => data.id !== null,
        }}
        rowSelection={{
          selectedRowKeys: selectedIds !== undefined ? selectedIds : selectedRows,
          onChange: onSelect,
        }}
        pagination={{
          position: ['bottomCenter', 'topRight'],
          total: incidents ? incidents.length : 0,
          showTotal(total, range) {
            return `${range[0]}-${range[1]} of ${total} items`;
          },
        }}
      />
    </div>
  );
}

export default AntTable;
