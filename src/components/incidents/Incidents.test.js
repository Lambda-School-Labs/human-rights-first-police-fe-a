import React, { useState, useEffect } from 'react';
import {
  // Imported render is customer function built in /utils/test-utils
  render,
  cleanup,
  screen,
  act,
} from '../../utils/test-utils';
import Incidents from './Incidents';
import userEvent from '@testing-library/user-event';
import store, { incidentActions } from '../../store';
import { useDispatch, Provider } from 'react-redux';

const { onInitialFetch } = incidentActions;

const testData = {};
for (let i = 1; i < 12; i++) {
  testData[i] = {
    incident_id: i,
    incident_date: '2021-07-29T00:00:00.000Z',
    tweet_id: '1',
    user_name: 'Test Twitter User',
    description: 'Test Description',
    city: 'Test City',
    state: 'Test State',
    lat: null,
    long: null,
    title: null,
    force_rank: 'Rank 1',
    status: 'approved',
    confidence: 1,
    tags: [],
    src: ['Test Source'],
    geoJSON: {
      type: 'Feature',
      incidentId: i,
      geometry: {
        type: 'Point',
        coordinates: [null, null],
      },
    },
  };
}
const Setup = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      onInitialFetch({
        incidents: testData,
        ids: Object.keys(testData),
        tagIndex: { a: 1 },
      })
    );
  }, [dispatch]);
  return <Incidents />;
};

const Tested = () => {
  return (
    <Provider store={store}>
      <Setup />
    </Provider>
  );
};

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('<Incidents />', () => {
  test('Component renders', async () => {
    const { container } = await render(<Tested />);
    expect(container).toContainElement(container.firstChild);
  });
});

describe('Incidents are displayed upon render', () => {
  test('displays unfiltered incidents', async () => {
    await render(<Tested />);
    const listedIncidents = screen.getAllByText(/add to list/i);
    expect(listedIncidents.length).toBeGreaterThanOrEqual(1);
  });
  test('Displays 2nd page of unfiltered incidents', async () => {
    await render(<Tested />);
    const page2 = screen.getByTitle('2');
    userEvent.click(page2);
    const listedIncidents = screen.getAllByText(/add to list/i);
    expect(listedIncidents.length).toEqual(1);
  });
});

describe('Filter functions by rank correctly', () => {
  test('Filter by rank displays events with specific rank', async () => {
    await render(<Tested />);
    const rankFilter = screen.getByText('Filter Incident Reports');
    userEvent.click(rankFilter);

    const selector = screen.getByText('Filter by Force Rank');
    await act(async () => {
      userEvent.click(selector);
    });

    const rank2 = screen.getByText('Rank 2 - Empty-hand');
    await act(async () => {
      userEvent.click(rank2);
    });
    const listedIncidents = screen.queryAllByText(/add to list/i);
    expect(listedIncidents.length).toEqual(0);
  });

  test('Filter by rank removes extra pages of results', async () => {
    const page2 = screen.queryByTitle('2');
    expect(page2).toBe(null);
  });
});
