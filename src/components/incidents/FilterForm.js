import React from 'react';
import { Collapse, Form, Select, DatePicker } from 'antd';
import { useSelector } from 'react-redux';

const { Option } = Select;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

function FilterForm({ onValuesChange }) {
  const [form] = Form.useForm();
  const tags = useSelector(state => Object.keys(state.incident.tagIndex));

  const onChange = (changed, vals) => {
    // TODO make filtering work for the whole object instead of by one property
    // at a time, notice that vals is not being used here. vals is all of the
    // form values.
    const changedKey = Object.keys(changed)[0];
    onValuesChange(changedKey, changed[changedKey]);
  };
  return (
    <Collapse>
      <Panel header="Filter Incident Reports">
        <Form form={form} onValuesChange={onChange} layout="vertical">
          <Form.Item name="force_rank" label="Force Rank">
            <Select placeholder="Filter by Force Rank">
              <Option value="">Show All Force Ranks</Option>
              <Option value="Rank 1">Rank 1 - Police Presence</Option>
              <Option value="Rank 2">Rank 2 - Empty-hand</Option>
              <Option value="Rank 3">Rank 3 - Blunt Force</Option>
              <Option value="Rank 4">Rank 4 - Chemical &amp; Electric</Option>
              <Option value="Rank 5">Rank 5 - Lethal Force</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Location">
            {/* TODO make filtering by city work, then add a Form.Item and Input
             * or Autocomplete here */}
            <Form.Item name="state" noStyle>
              <Select showSearch placeholder="Filter by State">
                <Option value="">Show All States</Option>
                {states.map((state, index) => (
                  <Option key={index} value={state}>
                    {state}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Select mode="multiple" placeholder="Filter by Tags">
              {tags.map((tag, index) => (
                <Option key={index} value={tag}>
                  {tag}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="date_range" label="Date">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Panel>
    </Collapse>
  );
}

export default FilterForm;
