import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  DatePicker, 
  TimePicker, 
  Select, 
  Input, 
  InputNumber, 
  Checkbox, 
  Button, 
  Row, 
  Col, 
  Divider,
  Typography,
  message,
  Alert
} from 'antd';
import { 
  ClockCircleOutlined, 
  EnvironmentOutlined, 
  DollarOutlined,
  CalendarOutlined,
  TagOutlined
} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  appointmentType: string;
  location: string;
  price: number;
  currency: string;
  maxAppointments: number;
  notes?: string;
  isRecurring: boolean;
  recurrenceRule?: string;
  timezone: string;
  slotDuration: number;
  breakDuration: number;
  insuranceAccepted: boolean;
  room?: string;
  address?: string;
}

interface SlotFormModalProps {
  visible: boolean;
  date: Dayjs | null;
  slot?: Slot | null;
  onClose: () => void;
  onSave: (slotData: Partial<Slot>) => void;
  loading?: boolean;
}

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

const LOCATION_TYPES = [
  'In-person',
  'Telemedicine',
  'Home Visit',
  'Mobile Clinic'
];

const RECURRENCE_OPTIONS = [
  { value: 'none', label: 'No Recurrence' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
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

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

const SlotFormModal: React.FC<SlotFormModalProps> = ({
  visible,
  date,
  slot,
  onClose,
  onSave,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [isRecurring, setIsRecurring] = useState(false);
  const [locationType, setLocationType] = useState<string>('In-person');
  const [conflicts, setConflicts] = useState<string[]>([]);

  useEffect(() => {
    if (visible && slot) {
      form.setFieldsValue({
        date: dayjs(slot.date),
        startTime: dayjs(`2000-01-01 ${slot.startTime}`),
        endTime: dayjs(`2000-01-01 ${slot.endTime}`),
        appointmentType: slot.appointmentType,
        location: slot.location,
        price: slot.price,
        currency: slot.currency,
        maxAppointments: slot.maxAppointments,
        notes: slot.notes,
        isRecurring: slot.isRecurring,
        recurrenceRule: slot.recurrenceRule,
        timezone: slot.timezone,
        slotDuration: slot.slotDuration,
        breakDuration: slot.breakDuration,
        insuranceAccepted: slot.insuranceAccepted,
        room: slot.room,
        address: slot.address
      });
      setIsRecurring(slot.isRecurring);
      setLocationType(slot.location);
    } else if (visible && date) {
      form.setFieldsValue({
        date: date,
        timezone: 'America/New_York',
        currency: 'USD',
        maxAppointments: 1,
        slotDuration: 30,
        breakDuration: 15,
        insuranceAccepted: false,
        isRecurring: false
      });
    }
  }, [visible, slot, date, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Check for time conflicts
      const startTime = values.startTime.format('HH:mm');
      const endTime = values.endTime.format('HH:mm');
      
      if (startTime >= endTime) {
        message.error('End time must be after start time');
        return;
      }

      const slotData: Partial<Slot> = {
        date: values.date.format('YYYY-MM-DD'),
        startTime: startTime,
        endTime: endTime,
        appointmentType: values.appointmentType,
        location: values.location,
        price: values.price,
        currency: values.currency,
        maxAppointments: values.maxAppointments,
        notes: values.notes,
        isRecurring: values.isRecurring,
        recurrenceRule: values.recurrenceRule,
        timezone: values.timezone,
        slotDuration: values.slotDuration,
        breakDuration: values.breakDuration,
        insuranceAccepted: values.insuranceAccepted,
        room: values.room,
        address: values.address
      };

      onSave(slotData);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const validateTimeRange = (_: any, value: any) => {
    const startTime = form.getFieldValue('startTime');
    if (startTime && value && startTime.isAfter(value)) {
      return Promise.reject('End time must be after start time');
    }
    return Promise.resolve();
  };

  const validateSlotDuration = (_: any, value: number) => {
    if (value < 15 || value > 240) {
      return Promise.reject('Slot duration must be between 15 and 240 minutes');
    }
    return Promise.resolve();
  };

  const validateBreakDuration = (_: any, value: number) => {
    if (value < 0 || value > 60) {
      return Promise.reject('Break duration must be between 0 and 60 minutes');
    }
    return Promise.resolve();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title={slot ? 'Edit Availability Slot' : 'Add Availability Slot'}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={handleSubmit}
        >
          {slot ? 'Update' : 'Create'} Slot
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          timezone: 'America/New_York',
          currency: 'USD',
          maxAppointments: 1,
          slotDuration: 30,
          breakDuration: 15,
          insuranceAccepted: false,
          isRecurring: false
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="YYYY-MM-DD"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="timezone"
              label="Timezone"
              rules={[{ required: true, message: 'Please select timezone' }]}
            >
              <Select placeholder="Select timezone">
                {TIMEZONES.map(tz => (
                  <Option key={tz} value={tz}>{tz}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="startTime"
              label="Start Time"
              rules={[{ required: true, message: 'Please select start time' }]}
            >
              <TimePicker 
                format="HH:mm" 
                style={{ width: '100%' }}
                minuteStep={15}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="endTime"
              label="End Time"
              rules={[
                { required: true, message: 'Please select end time' },
                { validator: validateTimeRange }
              ]}
            >
              <TimePicker 
                format="HH:mm" 
                style={{ width: '100%' }}
                minuteStep={15}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Appointment Details</Divider>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="appointmentType"
              label="Appointment Type"
              rules={[{ required: true, message: 'Please select appointment type' }]}
            >
              <Select placeholder="Select appointment type">
                {APPOINTMENT_TYPES.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="maxAppointments"
              label="Max Appointments per Slot"
              rules={[{ required: true, message: 'Please enter max appointments' }]}
            >
              <InputNumber 
                min={1} 
                max={10} 
                style={{ width: '100%' }}
                placeholder="Number of patients per slot"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="slotDuration"
              label="Slot Duration (minutes)"
              rules={[
                { required: true, message: 'Please enter slot duration' },
                { validator: validateSlotDuration }
              ]}
            >
              <InputNumber 
                min={15} 
                max={240} 
                step={15}
                style={{ width: '100%' }}
                placeholder="Duration per appointment"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="breakDuration"
              label="Break Duration (minutes)"
              rules={[
                { required: true, message: 'Please enter break duration' },
                { validator: validateBreakDuration }
              ]}
            >
              <InputNumber 
                min={0} 
                max={60} 
                step={5}
                style={{ width: '100%' }}
                placeholder="Break between appointments"
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Location & Pricing</Divider>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="location"
              label="Location Type"
              rules={[{ required: true, message: 'Please select location type' }]}
            >
              <Select 
                placeholder="Select location type"
                onChange={(value) => setLocationType(value)}
              >
                {LOCATION_TYPES.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="room"
              label="Room/Area"
              rules={locationType === 'In-person' ? [{ required: true, message: 'Please enter room/area' }] : []}
            >
              <Input placeholder="Room number or area" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="address"
          label="Address"
          rules={locationType === 'In-person' ? [{ required: true, message: 'Please enter address' }] : []}
        >
          <TextArea 
            rows={2} 
            placeholder="Full address for in-person appointments"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <InputNumber 
                min={0} 
                step={0.01}
                style={{ width: '100%' }}
                placeholder="Appointment fee"
                prefix={<DollarOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="currency"
              label="Currency"
              rules={[{ required: true, message: 'Please select currency' }]}
            >
              <Select placeholder="Select currency">
                {CURRENCIES.map(curr => (
                  <Option key={curr} value={curr}>{curr}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="insuranceAccepted"
          valuePropName="checked"
        >
          <Checkbox>Insurance Accepted</Checkbox>
        </Form.Item>

        <Divider orientation="left">Recurrence</Divider>

        <Form.Item
          name="isRecurring"
          valuePropName="checked"
        >
          <Checkbox onChange={(e) => setIsRecurring(e.target.checked)}>
            Make this slot recurring
          </Checkbox>
        </Form.Item>

        {isRecurring && (
          <Form.Item
            name="recurrenceRule"
            label="Recurrence Pattern"
            rules={[{ required: true, message: 'Please select recurrence pattern' }]}
          >
            <Select placeholder="Select recurrence pattern">
              {RECURRENCE_OPTIONS.filter(option => option.value !== 'none').map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Divider orientation="left">Additional Information</Divider>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <TextArea 
            rows={3} 
            placeholder="Additional notes, special requirements, or instructions for patients"
          />
        </Form.Item>

        {conflicts.length > 0 && (
          <Alert
            message="Potential Conflicts"
            description={
              <ul>
                {conflicts.map((conflict, index) => (
                  <li key={index}>{conflict}</li>
                ))}
              </ul>
            }
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
      </Form>
    </Modal>
  );
};

export default SlotFormModal; 