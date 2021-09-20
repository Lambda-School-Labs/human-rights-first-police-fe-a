import React from 'react';
import { render, cleanup } from '../../utils/test-utils';
import CompleteIncident from './CompleteIncident';

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

const props = {
  incident: {
    incident_id: 'example',
    src: ['https://www.example.com'],
    city: 'San Jose',
    state: 'California',
    lat: 37.33532,
    long: -121.88931,
    title: 'Example',
    desc: 'Example',
    date: '2000-01-01T06:00:00.000Z',
    force_rank: 'Rank 4',
    tags: ['test', 'testing', 'tests'],
  },
  formattedDate: null,
  unapprovedIncidents: [],
  setUnapprovedIncidents: jest.fn(),
};

describe('<CompleteIncident />', () => {
  test('Component renders', async () => {
    const { container } = await render(<CompleteIncident {...props} />);
    expect(container).toContainElement(container.firstChild);
  });
});
