import React, { useState } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Divider,
  Alert,
  Card,
  Tag,
  message
} from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  EnvironmentOutlined,
  DollarOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  BookOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Provider {
  id: string;
  name: string;
  specialization: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  clinic: string;
  location: string;
  phone: string;
  email: string;
  insuranceAccepted: boolean;
  avatar?: string;
  bio?: string;
}

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
  bookedAppointments: number;
  notes?: string;
  timezone: string;
}

interface BookingData {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientNotes: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

interface SlotBookingModalProps {
  visible: boolean;
  provider: Provider;
  slot: Slot;
  onClose: () => void;
  onConfirm: (bookingData: BookingData) => void;
  loading?: boolean;
}

const SlotBookingModal: React.FC<SlotBookingModalProps> = ({
  visible,
  provider,
  slot,
  onClose,
  onConfirm,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const formatTime = (time: string, timezone: string) => {
    const timeInProviderTz = dayjs(`2000-01-01 ${time}`, timezone);
    return timeInProviderTz.format('h:mm A');
  };

  const formatDate = (date: string) => {
    return dayjs(date).format('MMM DD, YYYY');
  };

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'Emergency':
        return 'red';
      case 'Consultation':
        return 'blue';
      case 'Follow-up':
        return 'green';
      case 'Telemedicine':
        return 'purple';
      default:
        return 'default';
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'Telemedicine':
        return <EnvironmentOutlined style={{ color: '#1890ff' }} />;
      case 'Home Visit':
        return <EnvironmentOutlined style={{ color: '#52c41a' }} />;
      case 'Mobile Clinic':
        return <EnvironmentOutlined style={{ color: '#faad14' }} />;
      default:
        return <EnvironmentOutlined style={{ color: '#666' }} />;
    }
  };

  const handleStep1Submit = async () => {
    try {
      const values = await form.validateFields();
      setBookingData(values);
      setStep(2);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleConfirmBooking = () => {
    if (bookingData) {
      onConfirm(bookingData);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleClose = () => {
    setStep(1);
    form.resetFields();
    setBookingData(null);
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      title={
        <Space>
          <BookOutlined />
          <span>Book Appointment</span>
          {step === 2 && <Tag color="blue">Step 2 of 2</Tag>}
        </Space>
      }
      width={800}
      footer={null}
    >
      {step === 1 ? (
        <div>
          <Alert
            message="Appointment Details"
            description="Please review the appointment details and provide your information"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card size="small" title="Provider Information">
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <Space>
                    <UserOutlined />
                    <Text strong>Dr. {provider.name}</Text>
                  </Space>
                  <Text type="secondary">{provider.specialization.join(', ')}</Text>
                  <Space>
                    <EnvironmentOutlined />
                    <Text>{provider.clinic}</Text>
                  </Space>
                  <Space>
                    <PhoneOutlined />
                    <Text>{provider.phone}</Text>
                  </Space>
                  <Space>
                    <MailOutlined />
                    <Text>{provider.email}</Text>
                  </Space>
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card size="small" title="Appointment Details">
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <Space>
                    <CalendarOutlined />
                    <Text strong>{formatDate(slot.date)}</Text>
                  </Space>
                  <Space>
                    <ClockCircleOutlined />
                    <Text>
                      {formatTime(slot.startTime, slot.timezone)} - {formatTime(slot.endTime, slot.timezone)}
                    </Text>
                  </Space>
                  <Space>
                    {getLocationIcon(slot.location)}
                    <Text>{slot.location}</Text>
                  </Space>
                  <Space>
                    <Tag color={getAppointmentTypeColor(slot.appointmentType)}>
                      {slot.appointmentType}
                    </Tag>
                  </Space>
                  <Space>
                    <DollarOutlined />
                    <Text strong>{slot.price} {slot.currency}</Text>
                  </Space>
                </Space>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              insuranceProvider: '',
              insuranceNumber: '',
              emergencyContact: '',
              emergencyPhone: ''
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="patientName"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter your full name' }]}
                >
                  <Input placeholder="Enter your full name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="patientPhone"
                  label="Phone Number"
                  rules={[
                    { required: true, message: 'Please enter your phone number' },
                    { pattern: /^[\+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number' }
                  ]}
                >
                  <Input placeholder="Enter your phone number" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="patientEmail"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter your email address' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input placeholder="Enter your email address" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="insuranceProvider"
                  label="Insurance Provider (Optional)"
                >
                  <Input placeholder="Enter insurance provider name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="insuranceNumber"
                  label="Insurance Number (Optional)"
                >
                  <Input placeholder="Enter insurance number" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="emergencyContact"
                  label="Emergency Contact (Optional)"
                >
                  <Input placeholder="Enter emergency contact name" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="emergencyPhone"
              label="Emergency Contact Phone (Optional)"
            >
              <Input placeholder="Enter emergency contact phone" />
            </Form.Item>

            <Form.Item
              name="patientNotes"
              label="Notes for Provider (Optional)"
            >
              <TextArea 
                rows={3} 
                placeholder="Any specific concerns, symptoms, or information you'd like to share with the provider"
              />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Space>
                <Button onClick={handleClose}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  onClick={handleStep1Submit}
                  loading={loading}
                >
                  Continue to Confirmation
                </Button>
              </Space>
            </div>
          </Form>
        </div>
      ) : (
        <div>
          <Alert
            message="Booking Confirmation"
            description="Please review all details before confirming your appointment"
            type="success"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card size="small" title="Provider Information">
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <Space>
                    <UserOutlined />
                    <Text strong>Dr. {provider.name}</Text>
                  </Space>
                  <Text type="secondary">{provider.specialization.join(', ')}</Text>
                  <Space>
                    <EnvironmentOutlined />
                    <Text>{provider.clinic}</Text>
                  </Space>
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card size="small" title="Appointment Details">
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <Space>
                    <CalendarOutlined />
                    <Text strong>{formatDate(slot.date)}</Text>
                  </Space>
                  <Space>
                    <ClockCircleOutlined />
                    <Text>
                      {formatTime(slot.startTime, slot.timezone)} - {formatTime(slot.endTime, slot.timezone)}
                    </Text>
                  </Space>
                  <Space>
                    {getLocationIcon(slot.location)}
                    <Text>{slot.location}</Text>
                  </Space>
                  <Space>
                    <Tag color={getAppointmentTypeColor(slot.appointmentType)}>
                      {slot.appointmentType}
                    </Tag>
                  </Space>
                  <Space>
                    <DollarOutlined />
                    <Text strong>{slot.price} {slot.currency}</Text>
                  </Space>
                </Space>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Card size="small" title="Your Information">
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Text><strong>Name:</strong> {bookingData?.patientName}</Text>
              <Text><strong>Phone:</strong> {bookingData?.patientPhone}</Text>
              <Text><strong>Email:</strong> {bookingData?.patientEmail}</Text>
              {bookingData?.insuranceProvider && (
                <Text><strong>Insurance:</strong> {bookingData.insuranceProvider}</Text>
              )}
              {bookingData?.emergencyContact && (
                <Text><strong>Emergency Contact:</strong> {bookingData.emergencyContact}</Text>
              )}
              {bookingData?.patientNotes && (
                <Text><strong>Notes:</strong> {bookingData.patientNotes}</Text>
              )}
            </Space>
          </Card>

          <Alert
            message="Important Information"
            description={
              <div>
                <p>• Please arrive 10 minutes before your appointment time</p>
                <p>• Bring a valid ID and insurance card (if applicable)</p>
                <p>• For telemedicine appointments, ensure you have a stable internet connection</p>
                <p>• You will receive a confirmation email with appointment details</p>
              </div>
            }
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={handleBack}>
                Back
              </Button>
              <Button 
                type="primary" 
                onClick={handleConfirmBooking}
                loading={loading}
                icon={<BookOutlined />}
              >
                Confirm Booking
              </Button>
            </Space>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SlotBookingModal; 