/**
 * Returns a promise that resolves to an array of pending incidents
 *
 * @param {import('axios').AxiosInstance} oktaAxios
 * @returns {Promise<Incident[]>} all pending incidents
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
 * @returns {Promise<Incident[]>} all approved incidents
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
 * @returns {Promise<Incident[]>} all approved incidents
 */
export function getFormResponses(oktaAxios) {
  return oktaAxios.get('http://hrf-bw-labs37-dev.eba-hz3uh94j.us-east-1.elasticbeanstalk.com/to-approve')
    .then(res => {
      return res.data;
    });
}

/**
 * Changes the status of incidents specified by ID
 *
 * @param {import('axios').AxiosInstance} oktaAxios
 * @param {number[]} incidentsIds - the incident_ids to change
 * @param {'pending' | 'approved' | 'rejected'} status
 * @returns {Promise<void>}
 */
export const changeIncidentsStatus = (oktaAxios, incidentIds, status) => {
  // to change the incident status, you don't need the entire incident object
  // sending just the incident_id and the new status will just change the status
  const changes = incidentIds.map(incident_id => {
    return { incident_id, status };
  });

  return oktaAxios
    .put('dashboard/incidents', changes)
    .then(res => {
      console.log(res);
      return res;
    })
    .catch(err => {
      console.log(err);
    });
};

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

const api = {
  applyEdits, getApprovedIncidents, getFormResponses, getPendingIncidents, changeIncidentsStatus
};

export default api;
