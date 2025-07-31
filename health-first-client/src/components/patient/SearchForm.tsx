import React, { useState } from 'react';
import { 
  Form, 
  DatePicker, 
  Select, 
  InputNumber, 
  Button, 
  Row, 
  Col, 
  Card, 
  Typography,
  Checkbox,
  Input,
  Space,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface SearchFilters {
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  specialization: string[];
  location: string[];
  appointmentType: string[];
  maxPrice: number | null;
  insuranceAccepted: boolean;
  providerName: string;
  timezone: string;
  availability: string;
}

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
}

const SPECIALIZATIONS = [
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Psychiatry',
  'Radiology',
  'General Medicine',
  'Emergency Medicine',
  'Family Medicine',
  'Internal Medicine'
];

const LOCATIONS = [
  'In-person',
  'Telemedicine',
  'Home Visit',
  'Mobile Clinic'
];

const APPOINTMENT_TYPES = [
  'Consultation',
  'Follow-up',
  'Emergency',
  'Routine Check',
  'Specialist Consultation',
  'Telemedicine',
  'Physical Therapy',
  'Laboratory Test'
];

const AVAILABILITY_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'this_week', label: 'This Week' },
  { value: 'next_week', label: 'Next Week' },
  { value: 'this_month', label: 'This Month' }
];

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney'
];

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading = false }) => {
  const [form] = Form.useForm();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSubmit = (values: any) => {
    const filters: SearchFilters = {
      dateRange: values.dateRange || null,
      specialization: values.specialization || [],
      location: values.location || [],
      appointmentType: values.appointmentType || [],
      maxPrice: values.maxPrice || null,
      insuranceAccepted: values.insuranceAccepted || false,
      providerName: values.providerName || '',
      timezone: values.timezone || 'America/New_York',
      availability: values.availability || 'this_week'
    };
    onSearch(filters);
  };

  const handleReset = () => {
    form.resetFields();
    onSearch({
      dateRange: null,
      specialization: [],
      location: [],
      appointmentType: [],
      maxPrice: null,
      insuranceAccepted: false,
      providerName: '',
      timezone: 'America/New_York',
      availability: 'this_week'
    });
  };

  return (
    <Card style={{ marginBottom: 24, width: '100%' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          timezone: 'America/New_York',
          availability: 'this_week',
          insuranceAccepted: false
        }}
        style={{ width: '100%' }}
      >
        <Row gutter={[16, 16]}>
          {/* Basic Search */}
          <Col xs={24} md={8}>
            <Form.Item
              name="providerName"
              label="Provider Name"
            >
              <Input 
                placeholder="Search by provider name"
                prefix={<UserOutlined />}
                allowClear
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={8}>
            <Form.Item
              name="specialization"
              label="Specialization"
            >
              <Select
                mode="multiple"
                placeholder="Select specializations"
                allowClear
                showSearch
                optionFilterProp="children"
                style={{ width: '100%' }}
              >
                {SPECIALIZATIONS.map(spec => (
                  <Option key={spec} value={spec}>{spec}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="dateRange"
              label="Date Range"
            >
              <RangePicker 
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                placeholder={['Start Date', 'End Date']}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item
              name="appointmentType"
              label="Appointment Type"
            >
              <Select
                mode="multiple"
                placeholder="Select appointment types"
                allowClear
                style={{ width: '100%' }}
              >
                {APPOINTMENT_TYPES.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="location"
              label="Location Type"
            >
              <Select
                mode="multiple"
                placeholder="Select location types"
                allowClear
                style={{ width: '100%' }}
              >
                {LOCATIONS.map(location => (
                  <Option key={location} value={location}>{location}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="maxPrice"
              label="Max Price"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Maximum price"
                min={0}
                step={10}
                prefix={<DollarOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <>
            <Divider orientation="left">Advanced Filters</Divider>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="availability"
                  label="Availability"
                >
                  <Select placeholder="Select availability" style={{ width: '100%' }}>
                    {AVAILABILITY_OPTIONS.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="timezone"
                  label="Timezone"
                >
                  <Select placeholder="Select timezone" style={{ width: '100%' }}>
                    {TIMEZONES.map(tz => (
                      <Option key={tz} value={tz}>{tz}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="insuranceAccepted"
                  valuePropName="checked"
                >
                  <Checkbox>Insurance Accepted Only</Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {/* Action Buttons */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} md={12}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SearchOutlined />}
                loading={loading}
                size="large"
              >
                Search Providers
              </Button>
              <Button 
                onClick={handleReset}
                size="large"
              >
                Reset
              </Button>
            </Space>
          </Col>
          
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Button
              type="text"
              icon={<FilterOutlined />}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default SearchForm; 