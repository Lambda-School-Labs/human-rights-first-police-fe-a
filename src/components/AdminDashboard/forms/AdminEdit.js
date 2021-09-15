import React from 'react';
import { Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;

function AdminEdit(props) {
  const [form] = Form.useForm();
  console.log(form);
  const handleFinish = vals => {};

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item name="title" label="Title of Incident">
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description of Incident">
        <Input />
      </Form.Item>
      <Form.Item label="Location">
        <Input.Group compact>
          <Form.Item name="city" label="City" noStyle>
            <Input style={{ width: '50%' }} placeholder="City" />
          </Form.Item>
          <Form.Item name="state" label="State" noStyle>
            <Input style={{ width: '50%' }} placeholder="State" />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item name="incident_date" label="Date">
        <DatePicker
          style={{ width: '100%' }}
          disabledDate={picked => {
            return moment() < picked;
          }}
        />
      </Form.Item>
      <Form.Item name="force_rank" label="Force Rank">
        <Select placeholder="Select a Force Rank">
          <Option value="Rank 0">Rank 0 - No Police Presence</Option>
          <Option value="Rank 1">Rank 1 - Police Presence</Option>
          <Option value="Rank 2">Rank 2 - Empty-hand</Option>
          <Option value="Rank 3">Rank 3 - Blunt Force</Option>
          <Option value="Rank 4">Rank 4 - Chemical &amp; Electric</Option>
          <Option value="Rank 5">Rank 5 - Lethal Force</Option>
        </Select>
      </Form.Item>
      <Form.Item name="src" label="Sources">
        <Input />
      </Form.Item>
    </Form>
  );
}

export default AdminEdit;
