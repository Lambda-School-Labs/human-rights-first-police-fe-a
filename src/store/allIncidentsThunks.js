import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/apiHelpers';
import { splitIncidentsByIds } from '../utils/DashboardHelperFunctions';

/**
 * This Thunk fetches all incident data
 */
const fetchAllIncidentsThunk = createAsyncThunk(
  'dashboard/fetchAllIncidents',
  async (oktaAxios, thunkAPI) => {
    const approved = await api.getApprovedIncidents(oktaAxios);
    const pending = await api.getPendingIncidents(oktaAxios);
    const formResponses = await api.getFormResponses(oktaAxios);

    return { approved, pending, formResponses };
  }
);

/**
 * this will be called when the fetchAllIncidents thunk is fulfilled
 * because we are using Redux Toolkit, we can safely modify state from within a reducer
 *  @type {import('@reduxjs/toolkit').CaseReducer<AllIncidentsState>}
 */
const fetchAllReducer = (state, action) => {
  const { approved, pending, formResponses } = action.payload;
  state.approvedIncidents = approved;
  state.pendingIncidents = pending;
  state.formResponses = formResponses;
};

/**
 * This Thunk changes the status for the specified incidents
 */
const setStatusThunk = createAsyncThunk(
  'dashboard/changeStatus',
  async (payload, thunkAPI) => {
    const { oktaAxios, incidentIds, newStatus } = payload;
    return await api.changeIncidentsStatus(oktaAxios, incidentIds, newStatus);
  }
);

/**
 * this will be called when the setStatus thunk is fulfilled
 * because we are using Redux Toolkit, we can safely modify state from within a reducer
 *  @type {import('@reduxjs/toolkit').CaseReducer<AllIncidentsState>}
 */
const setStatusReducer = (state, action) => {
  const { incidentIds, oldStatus, newStatus } = action.meta.arg;

  // incidents have just been PUT to the server with the status property changed
  // locally, those incidents need to be moved from one list to another
  // ie: after approving incident_id:8003, it should be removed from pendingIncidents and inserted into approvedIncidents

  // if you having trouble keeping local state in sync with the server
  // this can be removed, and instead re-fetch all incident data after any changes are made.


  // removing the specified incidents from their original list
  let split;
  if (oldStatus === 'pending') {
    split = splitIncidentsByIds(state.pendingIncidents, incidentIds);
    state.pendingIncidents = split.source;
  }
  else if (oldStatus === 'approved') {
    split = splitIncidentsByIds(state.approvedIncidents, incidentIds);
    state.approvedIncidents = split.source;
  }

  // adding the specified incidents to their new list (unless they have been rejected)
  if (newStatus !== 'rejected') {
    const newList = selectListByStatus(newStatus, state);

    split.selected.forEach(inc => {
      inc.status = newStatus;
      newList.push(inc);
    });

    newList?.sort((a, b) => a.incident_date > b.incident_date);
  }
};

/**
 * This thunk is used for editing the properties of an incident
 */
const editIncidentThunk = createAsyncThunk(
  'dashboard/editIncident',
  async (payload, thunkAPI) => {
    const { oktaAxios, incident } = payload;

    return await oktaAxios
      .put('dashboard/incidents', incident);
  }
);

/**
 * this will be called after an incidents properties are edited
 * because we are using Redux Toolkit, we can safely modify state from within a reducer
 *  @type {import('@reduxjs/toolkit').CaseReducer<AllIncidentsState>}
 */
const editIncidentReducer = (state, action) => {
  console.log(action.payload);

  // So an incident has just been PUT to the incidents endpoint sucessfully
  // locally, state needs to be updated with the incident's new values

  // if you having trouble keeping local state in sync with the server
  // this can be removed, and instead re-fetch all incident data after any changes are made.

  /** @type {Incident} */
  const incident = action.payload.incident;
  const list = selectListByStatus(incident.status, state);
  const index = list.findIndex(inc => inc.incident_id === incident.inciden_id);

  if (index !== -1) {
    list[index] = incident;
  }
  else {
    throw Error("something wierd happened....");
  };
};

/**
 *
 * @param {string} status
 * @param {AllIncidentsState} state
 * @returns {Incident[]}
 */
function selectListByStatus(status, state) {
  switch (status) {
    case 'pending':
      return state.pendingIncidents;
    case 'approved':
      return state.approvedIncidents;
    case 'form-responses':
      return state.formResponses;
    default:
      return null;
  }
}

export const fetchAll = { thunk: fetchAllIncidentsThunk, reducer: fetchAllReducer };
export const setStatus = { thunk: setStatusThunk, reducer: setStatusReducer };
export const editIncident = { thunk: editIncidentThunk, reducer: editIncidentReducer };
