import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Tag, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Badge,
  Divider,
  Empty,
  Alert
} from 'antd';
import { 
  ClockCircleOutlined, 
  EnvironmentOutlined, 
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  BookOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

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

interface SlotGroupProps {
  provider: Provider;
  slots: Slot[];
  onBookSlot: (slotId: string) => void;
}

const SlotGroup: React.FC<SlotGroupProps> = ({ 
  provider, 
  slots, 
  onBookSlot 
}) => {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [userTimezone] = useState('America/New_York'); // Get from user preferences

  const formatTime = (time: string, timezone: string) => {
    const timeInProviderTz = dayjs(`2000-01-01 ${time}`, timezone);
    const timeInUserTz = timeInProviderTz.tz(userTimezone);
    return timeInUserTz.format('h:mm A');
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

  const groupSlotsByDate = (slots: Slot[]) => {
    const grouped: { [key: string]: Slot[] } = {};
    slots.forEach(slot => {
      const date = slot.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });
    return grouped;
  };

  const getAvailabilityStatus = (slot: Slot) => {
    const available = slot.maxAppointments - slot.bookedAppointments;
    if (available === 0) return 'Fully Booked';
    if (available === 1) return 'Last Spot';
    return `${available} spots left`;
  };

  const getAvailabilityColor = (status: string) => {
    if (status === 'Fully Booked') return 'red';
    if (status === 'Last Spot') return 'orange';
    return 'green';
  };

  const handleBookSlot = (slot: Slot) => {
    setSelectedSlot(slot);
    onBookSlot(slot.id);
  };

  const availableSlots = slots.filter(slot => 
    slot.bookedAppointments < slot.maxAppointments
  );

  const groupedSlots = groupSlotsByDate(availableSlots);

  if (availableSlots.length === 0) {
    return (
      <Empty
        description="No available slots for this provider"
        style={{ margin: '20px 0' }}
      />
    );
  }

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={5} style={{ margin: 0 }}>
            Available Appointments
          </Title>
          <Text type="secondary">
            Showing {availableSlots.length} available slots
          </Text>
        </Col>
        <Col>
          <Space>
            <Text type="secondary">Your timezone: {userTimezone}</Text>
            <Tag color="blue">Times shown in your local timezone</Tag>
          </Space>
        </Col>
      </Row>

      {Object.entries(groupedSlots)
        .sort(([a], [b]) => dayjs(a).diff(dayjs(b)))
        .map(([date, dateSlots]) => (
          <Card 
            key={date} 
            size="small" 
            style={{ marginBottom: 16 }}
            title={
              <Space>
                <CalendarOutlined />
                <Text strong>{formatDate(date)}</Text>
                <Text type="secondary">({dateSlots.length} slots)</Text>
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              {dateSlots.map(slot => {
                const availabilityStatus = getAvailabilityStatus(slot);
                const isToday = dayjs(slot.date).isSame(dayjs(), 'day');
                const isTomorrow = dayjs(slot.date).isSame(dayjs().add(1, 'day'), 'day');

                return (
                  <Col xs={24} sm={12} md={8} key={slot.id}>
                    <Card
                      size="small"
                      style={{ 
                        border: isToday ? '2px solid #1890ff' : undefined,
                        height: '100%'
                      }}
                      bodyStyle={{ padding: 12 }}
                    >
                      <Space direction="vertical" size={8} style={{ width: '100%' }}>
                        <Space align="center">
                          <ClockCircleOutlined style={{ color: '#1890ff' }} />
                          <Text strong>
                            {formatTime(slot.startTime, slot.timezone)} - {formatTime(slot.endTime, slot.timezone)}
                          </Text>
                          {(isToday || isTomorrow) && (
                            <Badge 
                              status="processing" 
                              text={isToday ? 'Today' : 'Tomorrow'} 
                            />
                          )}
                        </Space>

                        <Space align="center">
                          {getLocationIcon(slot.location)}
                          <Text>{slot.location}</Text>
                        </Space>

                        <Space align="center">
                          <Tag color={getAppointmentTypeColor(slot.appointmentType)}>
                            {slot.appointmentType}
                          </Tag>
                          <Tag color={getAvailabilityColor(availabilityStatus)}>
                            {availabilityStatus}
                          </Tag>
                        </Space>

                        <Space align="center">
                          <DollarOutlined style={{ color: '#52c41a' }} />
                          <Text strong>
                            {slot.price} {slot.currency}
                          </Text>
                        </Space>

                        {slot.notes && (
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {slot.notes}
                          </Text>
                        )}

                        <Button
                          type="primary"
                          size="small"
                          icon={<BookOutlined />}
                          onClick={() => handleBookSlot(slot)}
                          disabled={availabilityStatus === 'Fully Booked'}
                          block
                        >
                          Book Now
                        </Button>
                      </Space>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Card>
        ))}

      {selectedSlot && (
        <Alert
          message="Booking Confirmation"
          description={
            <div>
              <p><strong>Provider:</strong> Dr. {provider.name}</p>
              <p><strong>Date:</strong> {formatDate(selectedSlot.date)}</p>
              <p><strong>Time:</strong> {formatTime(selectedSlot.startTime, selectedSlot.timezone)} - {formatTime(selectedSlot.endTime, selectedSlot.timezone)}</p>
              <p><strong>Type:</strong> {selectedSlot.appointmentType}</p>
              <p><strong>Location:</strong> {selectedSlot.location}</p>
              <p><strong>Price:</strong> {selectedSlot.price} {selectedSlot.currency}</p>
            </div>
          }
          type="success"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
};

export default SlotGroup; 