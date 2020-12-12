import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { options, createData, defaultData } from '../assets';

import { DateTime } from 'luxon';

const LineGraph = ({ monthlyData, today }) => {
  const [data, setData] = useState(defaultData);
  const [monthsInMilliseconds] = useState(28927182167); // 11 Months
  const [start] = useState(today - monthsInMilliseconds);

  useEffect(() => {
    // Test to see if monthlyData is empty, if it's not, then do stuff
    if (
      !(
        Object.keys(monthlyData).length === 0 &&
        monthlyData.constructor === Object
      )
    ) {
      // Create the template for the data to be stored in:
      // Dynamically create labels denoting every month in my dataset:
      let months = [];
      let firstMonth = DateTime.fromMillis(start).toFormat('MMM');
      let month = start;
      months.push(firstMonth);

      while (month <= today - 2592000000) {
        month += 2592000000;
        months.push(DateTime.fromMillis(month).toFormat('MMM'));
      }

      const incidentCategories = {
        labels: months,
        datasets: [],
      };

      incidentCategories.datasets.push(createData(monthlyData));
      setData(incidentCategories);
    }
  }, [monthlyData, setData, start, today]);

  return (
    <div
      style={{
        backgroundColor: '#191A1A',
        margin: '0 auto',
        maxWidth: '1550px',
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default LineGraph;