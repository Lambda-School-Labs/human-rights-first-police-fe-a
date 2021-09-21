import axios from 'axios';

export const putIncidents = (oktaAxios, incidents, status) => {
  const modifiedIncidents = incidents.map(inc => {
    return { ...inc, status };
  });

  return oktaAxios
    .put('dashboard/incidents', modifiedIncidents)
    .catch(err => {
      console.log(err);
    });
};

/**
 * This function finds the specified incidents within an array and returns two
 * new arrays: the selected incidents, and the source array WITHOUT the selected
 * incidents
 *
 * @param {any[]} incidents an array of incident data
 * @param {number[]} ids a list of the desired incident ids to extract
 *
 * @returns {{selected: any[], source: any[]}} two arrays of incident data
 */
export function splitIncidentsByIds(incidents, ids) {
  const selected = [];
  const source = [];

  incidents.forEach(inc => {
    if (ids.includes(inc.incident_id)) {
      selected.push(inc);
    }
    else {
      source.push(inc);
    }
  });

  return { selected, source };
}

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

/**
 * Returns a promise that resolves to an array of pending incidents
 *
 * @param {import('axios').AxiosInstance} oktaAxios
 * @returns {Promise<any[]>} all pending incidents
 */
export function getPendingIncidents(oktaAxios) {
  return oktaAxios.get('/dashboard/incidents')
    .then(res => {
      return res.data;
    });
}

/**
 * Returns a promise that resolves to an array of approved incidents
 *
 * @param {import('axios').AxiosInstance} oktaAxios
 * @returns {Promise<any[]>} all approved incidents
 */
export function getApprovedIncidents(oktaAxios) {
  return oktaAxios.get('/dashboard/incidents/approved')
    .then(res => {
      return res.data;
    });
}

/**
 * Returns a promise that resolves to an array of approved incidents
 *
 * @param {import('axios').AxiosInstance} oktaAxios
 * @returns {Promise<any[]>} all approved incidents
 */
export function getFormResponses(oktaAxios) {
  return oktaAxios.get('http://hrf-bw-labs37-dev.eba-hz3uh94j.us-east-1.elasticbeanstalk.com/to-approve')
    .then(res => {
      return res.data;
    });
}

// CompleteIncident.js
export const applyEdits = (oktaAxios, formValues, incident) => {
  const [month, day, year] = formValues.incident_date.split('/');
  const [date, time] = incident.incident_date.split('T');
  const newDate = `${year}-${month}-${day}T${time}`;
  const updatedIncident = {
    ...formValues,
    tags: formValues.tags.split(',').map(t => t.trim()).sort(),
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
