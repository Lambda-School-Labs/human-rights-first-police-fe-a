import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/apiHelpers';
import { splitIncidentsByIds } from '../utils/DashboardHelperFunctions';
import { editIncident, fetchAll, setStatus } from './allIncidentsThunks';

/**
 * @typedef Incident
 * @property {number} incident_id
 * @property {string} incident_date
 * @property {string} tweet_id
 * @property {string} user_name
 * @property {string} description
 * @property {string | null} city
 * @property {string | null} state
 * @property {number | null} lat
 * @property {number | null} long
 * @property {string | null} title
 * @property {string} force_rank
 * @property {'pending' | 'approved' | 'rejected' } status
 * @property {number} confidence
 * @property {string[]} tags
 * @property {string[]} src
 */

/**
 * @typedef AllIncidentsState
 * @property {boolean} isLoading
 * @property {string} errorMessage
 * @property {Incident[]} approvedIncidents
 * @property {Incident[]} pendingIncidents
 * @property {Incident[]} formResponses
 */

/** @type {AllIncidentsState} */
const initialState = {
  isLoading: false,
  errorMessage: '',
  approvedIncidents: [],
  pendingIncidents: [],
  formResponses: [],
};

// These 'matcher' functions are used by the reducer to match thunk lifecycle events
const isPendingAction = (action) => action.type.endsWith('/pending');
const isFulfilledAction = (action) => action.type.endsWith('/fulfilled');
const isRejectedAction = (action) => action.type.endsWith('/rejected');

// https://redux-toolkit.js.org/api/createSlice
export const slice = createSlice({
  name: 'allIncident',
  initialState,
  reducers: {
    // since all the actions here are async thunks, there are no reducers here
  },
  extraReducers: (builder) => {
    // these set up the case reducers for each thunk, called after they successfully complete
    // https://redux-toolkit.js.org/api/createreducer/#builderaddcase
    builder.addCase(fetchAll.thunk.fulfilled, fetchAll.reducer);
    builder.addCase(setStatus.thunk.fulfilled, setStatus.reducer);
    builder.addCase(editIncident.thunk.fulfilled, editIncident.reducer);


    // in Redux Toolkit, thunks created with createAsyncThunk will generate 3 actions representing
    // the lifecycle of an async thunk: pending, fulfilled, and rejected
    // https://redux-toolkit.js.org/api/createAsyncThunk

    // For any thunk 'pending' actions, set isLoading to true
    builder.addMatcher(isPendingAction, (state, action) => {
      state.isLoading = true;
    });

    // For any thunk 'fulfilled' actions, set isLoading to false
    builder.addMatcher(isFulfilledAction, (state, action) => {
      state.isLoading = false;
    });

    // For any thunk 'rejected' actions, set errorMessage and isLoading to false
    builder.addMatcher(isRejectedAction, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    });
  }
});

/**
 *
 * @returns {{state: AllIncidentsState, dispatch: import('redux').Dispatch<any>}}
 */
export const useAllIncidents = () => {
  const state = useSelector(state => state.allIncidents);
  const dispatch = useDispatch();

  return { state, dispatch };
};

export const useEasyMode = (oktaAxios) => {
  const { state, dispatch } = useAllIncidents();

  const easyMode = {
    state,
    fetchAll: () => {
      dispatch(fetchAll.thunk(oktaAxios));
    },
    /**
     * Say cheese
     * @param {Incident[]} incidents
     * @returns {Promise<void>}
     */
    modifyIncidents: (incidents) => {
      return dispatch(editIncident.thunk({ oktaAxios, incidents }));
    },
    changeIncidentsStatus: (incidentIds, oldStatus, newStatus) => {
      return dispatch(setStatus.thunk({ oktaAxios, incidentIds, oldStatus, newStatus }));
    }
  };

  return easyMode;
};
