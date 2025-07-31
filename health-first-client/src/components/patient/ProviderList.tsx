import React, { useState } from 'react';
import { 
  List, 
  Card, 
  Avatar, 
  Button, 
  Tag, 
  Typography, 
  Row, 
  Col, 
  Space, 
  Rate, 
  Divider,
  Badge,
  Empty,
  Spin
} from 'antd';
import { 
  UserOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined,
  DollarOutlined,
  StarOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import SlotGroup from './SlotGroup';

const { Title, Text, Paragraph } = Typography;

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
  education?: string[];
  certifications?: string[];
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

interface ProviderListProps {
  providers: Provider[];
  loading?: boolean;
  onBookSlot: (providerId: string, slotId: string) => void;
}

const ProviderList: React.FC<ProviderListProps> = ({ 
  providers, 
  loading = false, 
  onBookSlot 
}) => {
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);

  const formatTime = (time: string) => {
    return dayjs(`2000-01-01 ${time}`).format('h:mm A');
  };

  const formatDate = (date: string) => {
    return dayjs(date).format('MMM DD, YYYY');
  };

  const getSpecializationColor = (spec: string) => {
    const colors = ['blue', 'green', 'purple', 'orange', 'red', 'cyan'];
    return colors[spec.length % colors.length];
  };

  const getAvailabilityStatus = (slots: Slot[]) => {
    const availableSlots = slots.filter(slot => 
      slot.bookedAppointments < slot.maxAppointments
    );
    
    if (availableSlots.length === 0) return 'No Availability';
    if (availableSlots.length <= 2) return 'Limited Availability';
    return 'Available';
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'No Availability':
        return 'red';
      case 'Limited Availability':
        return 'orange';
      default:
        return 'green';
    }
  };

  // Mock slots data - replace with API call
  const getProviderSlots = (providerId: string): Slot[] => {
    return [
      {
        id: '1',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '10:00',
        appointmentType: 'Consultation',
        location: 'Main Clinic',
        price: 150,
        currency: 'USD',
        maxAppointments: 1,
        bookedAppointments: 0,
        timezone: 'America/New_York'
      },
      {
        id: '2',
        date: '2024-01-15',
        startTime: '14:00',
        endTime: '15:00',
        appointmentType: 'Follow-up',
        location: 'Main Clinic',
        price: 100,
        currency: 'USD',
        maxAppointments: 1,
        bookedAppointments: 0,
        timezone: 'America/New_York'
      },
      {
        id: '3',
        date: '2024-01-16',
        startTime: '10:00',
        endTime: '11:00',
        appointmentType: 'Consultation',
        location: 'Telemedicine',
        price: 120,
        currency: 'USD',
        maxAppointments: 1,
        bookedAppointments: 1,
        timezone: 'America/New_York'
      }
    ];
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Searching for providers...</Text>
        </div>
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <Empty
        description="No providers found matching your criteria"
        style={{ margin: '50px 0' }}
      />
    );
  }

  return (
    <List
      dataSource={providers}
      loading={loading}
      renderItem={(provider) => {
        const slots = getProviderSlots(provider.id);
        const availabilityStatus = getAvailabilityStatus(slots);
        const isExpanded = expandedProvider === provider.id;

        return (
          <List.Item>
            <Card 
              style={{ width: '100%', marginBottom: 16 }}
              bodyStyle={{ padding: 24 }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    <Space align="center">
                      <Avatar 
                        size={64} 
                        src={provider.avatar}
                        icon={<UserOutlined />}
                      />
                      <div>
                        <Title level={4} style={{ margin: 0 }}>
                          Dr. {provider.name}
                        </Title>
                        <Text type="secondary">{provider.specialization.join(', ')}</Text>
                      </div>
                    </Space>

                    <Space direction="vertical" size={8}>
                      <Space>
                        <Rate 
                          disabled 
                          defaultValue={provider.rating} 
                          style={{ fontSize: 14 }}
                        />
                        <Text type="secondary">
                          ({provider.reviewCount} reviews)
                        </Text>
                      </Space>
                      
                      <Text>
                        <StarOutlined style={{ color: '#faad14' }} /> {provider.experience} years experience
                      </Text>
                    </Space>

                    <Space direction="vertical" size={4}>
                      <Space>
                        <EnvironmentOutlined />
                        <Text>{provider.clinic}</Text>
                      </Space>
                      <Space>
                        <EnvironmentOutlined />
                        <Text type="secondary">{provider.location}</Text>
                      </Space>
                    </Space>

                    <Space direction="vertical" size={4}>
                      <Space>
                        <PhoneOutlined />
                        <Text>{provider.phone}</Text>
                      </Space>
                      <Space>
                        <MailOutlined />
                        <Text>{provider.email}</Text>
                      </Space>
                    </Space>
                  </Space>
                </Col>

                <Col xs={24} md={16}>
                  <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Space direction="vertical" size={8}>
                          <Title level={5} style={{ margin: 0 }}>
                            Available Slots
                          </Title>
                          <Space>
                            <Badge 
                              status={getAvailabilityColor(availabilityStatus) as any}
                              text={availabilityStatus}
                            />
                            <Text type="secondary">
                              {slots.filter(s => s.bookedAppointments < s.maxAppointments).length} slots available
                            </Text>
                          </Space>
                        </Space>
                      </Col>
                      <Col>
                        <Button
                          type={isExpanded ? 'default' : 'primary'}
                          onClick={() => setExpandedProvider(
                            isExpanded ? null : provider.id
                          )}
                        >
                          {isExpanded ? 'Hide' : 'View'} Slots
                        </Button>
                      </Col>
                    </Row>

                    {provider.bio && (
                      <Paragraph type="secondary" style={{ margin: 0 }}>
                        {provider.bio}
                      </Paragraph>
                    )}

                    <Space wrap>
                      {provider.specialization.map(spec => (
                        <Tag 
                          key={spec} 
                          color={getSpecializationColor(spec)}
                        >
                          {spec}
                        </Tag>
                      ))}
                      {provider.insuranceAccepted && (
                        <Tag color="green">Insurance Accepted</Tag>
                      )}
                    </Space>

                    {isExpanded && (
                      <div style={{ marginTop: 16 }}>
                        <Divider />
                        <SlotGroup
                          provider={provider}
                          slots={slots}
                          onBookSlot={(slotId) => onBookSlot(provider.id, slotId)}
                        />
                      </div>
                    )}
                  </Space>
                </Col>
              </Row>
            </Card>
          </List.Item>
        );
      }}
    />
  );
};

export default ProviderList; 