import axios from 'axios';

export const putIncidents = (oktaAxios, incidents, status) => {
  const reviewedIncidents = incidents.map(incident => {
    return {
      status: status,
      city: incident.city,
      state: incident.state,
      force_rank: incident.force_rank,
      lat: incident.lat,
      long: incident.long,
      incident_id: incident.incident_id,
    };
  });

  oktaAxios
    .put('dashboard/incidents', reviewedIncidents)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
};

export const sortApproved = (unapprovedIncidents, selected) => {
  const reviewedData = [];
  const unreviewedData = [];
  unapprovedIncidents.forEach(dataObj => {
    if (selected.includes(dataObj.incident_id)) {
      reviewedData.push(dataObj);
    } else {
      unreviewedData.push(dataObj);
    }
  });
  return [reviewedData, unreviewedData];
};

export const getData = (oktaAxios, setUnapprovedIncidents) => {
  oktaAxios
    .get('/dashboard/incidents')
    .then(res => {
      setUnapprovedIncidents(res.data);
    })
    .catch(err => {
      console.log(err);
    });
};

// CompleteIncident.js
export const applyEdits = (oktaAxios, formValues, incident) => {
  const [month, day, year] = formValues.incident_date.split('/');
  const [date, time] = incident.incident_date.split('T');
  const newDate = `${year}-${month}-${day}T${time}`;
  const updatedIncident = {
    ...formValues,
    tags: formValues.tags
      .split(',')
      .map(t => t.trim())
      .sort(),
    incident_date: newDate,
  };
  const putRequest = new Promise((resolve, reject) => {
    oktaAxios
      .put('/dashboard/incidents', [{ ...updatedIncident }])
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
  return putRequest;
};

// MapQuest API to get Latitude/Longitude used in clusters (Clusters.js)
export const getLatAndLong = formValues => {
  const getRequest = new Promise((resolve, reject) => {
    const { city, state } = formValues;

    if (!city || !state) {
      throw new Error('Missing city or state');
    } else {
      city.toLowerCase();
      state.toLowerCase();
    }

    const mapQuestURL = `https://open.mapquestapi.com/geocoding/v1/address?key=
      ${process.env.REACT_APP_MAPQUEST_API_KEY}&location=${city},${state}`;

    axios
      .get(mapQuestURL)
      .then(res => {
        const { lat, lng } = res.data.results[0].locations[0].latLng;
        resolve([lat, lng]);
      })
      .catch(err => {
        console.log('Error: ', err);
        reject([null, null]);
      });
  });
  return getRequest;
};

export const postIncident = (oktaAxios, newIncident) => {
  const postRequest = new Promise((resolve, reject) => {
    oktaAxios
      .post('/dashboard/incidents', newIncident)
      .then(res => {
        resolve('New incident added successfully');
      })
      .catch(err => {
        reject('Something went wrong');
      });
  });
  return postRequest;
};

export const formatDate = date => {
  const [month, day, year] = date.split('/');
  return `${year}-${month}-${day}`;
};
