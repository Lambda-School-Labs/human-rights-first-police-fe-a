import React, { useState, createRef } from 'react';
import useOktaAxios from '../../hooks/useOktaAxios';
import { Modal, Form, Select, Input, DatePicker } from 'antd';
import moment from 'moment';

import {
  getLatAndLong,
  postIncident,
} from '../../utils/DashboardHelperFunctions';

const Required = props => {
  // This makes a required form item without the little red star
  return (
    <Form.Item label={props.label}>
      <Form.Item
        noStyle
        {...props}
        rules={[{ required: true, message: props.reqMessage }]}
      />
    </Form.Item>
  );
};

const { Option } = Select;

const initialFormValues = {
  city: null,
  confidence: 0,
  description: '',
  force_rank: '',
  incident_date: '',
  lat: null,
  long: null,
  src: '',
  state: null,
  status: 'pending',
  tags: [],
  title: '',
  tweet_id: null,
};

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

const AddIncident = props => {
  // setting state for form management
  const [form] = Form.useForm();

  // setting state for add incident pop up
  const [modalText, setModalText] = useState('');
  const [visible, setVisible] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { setAdding, setPageNumber } = props;

  const oktaAxios = useOktaAxios();

  //   form management functions
  const handleCancel = () => {
    setVisible(false);
    setAdding(false);
  };

  const handleFinish = async vals => {
    setConfirmLoading(true);

    // formatting date
    let newDateString;
    if (vals.incident_date == null) {
      newDateString = new Date().toJSON();
    } else {
      newDateString =
        vals.incident_date.format('YYYY-MM-DD') + 'T00:00:00.000Z';
    }

    // getting coordinates
    const [lat, long] = await getLatAndLong(vals);

    // creating new incident object to be posted
    const newIncident = {
      ...initialFormValues,
      ...vals,
      incident_date: newDateString,
      src: [vals.src],
      lat,
      long,
    };

    // posting new incident to database
    const modalMessage = await postIncident(oktaAxios, newIncident);

    setModalText(modalMessage);

    setTimeout(() => {
      // modal is unmounted, admin is redirected to first page of dashboard
      setVisible(false);
      setConfirmLoading(false);
      setAdding(false);
    }, 1750);
  };

  const wrapper = createRef();

  return (
    <div ref={wrapper}>
      {/* The above div removes the "findDomNode" warning */}
      <Modal
        title="Create New Incident"
        visible={visible}
        okText="Submit"
        onOk={form.submit}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Required
            name="title"
            label="Title of Incident"
            reqMessage="Title is Required"
          >
            <Input placeholder="Input the title of the incident" />
          </Required>
          <Form.Item name="description" label="Description of Incident">
            <Input />
          </Form.Item>
          <Form.Item label="Location">
            <Input.Group compact>
              <Form.Item name="city" label="City" noStyle>
                <Input style={{ width: '50%' }} placeholder="City" />
              </Form.Item>
              <Form.Item name="state" label="State" noStyle>
                <Select style={{ width: '50%' }} placeholder="State">
                  {states.map(state => (
                    <Option value={state} key={state}>
                      {state}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item name="incident_date" label="Date">
            <DatePicker
              style={{ width: '100%' }}
              disabledDate={picked => {
                return moment() < picked; // only allow dates before now
              }}
            />
          </Form.Item>
          <Required
            name="force_rank"
            label="Force Rank"
            reqMessage="Force Rank is Required"
          >
            <Select placeholder="Select a Force Rank">
              <Option value="Rank 0">Rank 0 - No Police Presence</Option>
              <Option value="Rank 1">Rank 1 - Police Presence</Option>
              <Option value="Rank 2">Rank 2 - Empty-hand</Option>
              <Option value="Rank 3">Rank 3 - Blunt Force</Option>
              <Option value="Rank 4">Rank 4 - Chemical &amp; Electric</Option>
              <Option value="Rank 5">Rank 5 - Lethal Force</Option>
            </Select>
          </Required>
          <Form.Item name="src" label="Sources">
            <Input />
          </Form.Item>
        </Form>
        {modalText || ''}
      </Modal>
    </div>
  );
};
export default AddIncident;
