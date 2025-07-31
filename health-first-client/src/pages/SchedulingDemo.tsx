import React from 'react';
import { Layout, Typography, Card, Row, Col, Button, Space, Divider, Menu } from 'antd';
import { 
  CalendarOutlined, 
  UserOutlined, 
  BookOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { Link } from '@tanstack/react-router';

const { Content, Header } = Layout;
const { Title, Text, Paragraph } = Typography;

const SchedulingDemo: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Top Navigation Bar */}
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Row justify="space-between" align="middle" style={{ height: '100%' }}>
          <Col>
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              <CalendarOutlined style={{ marginRight: 8 }} />
              HealthFirst
            </Title>
          </Col>
          <Col>
            <Space size="large">
              <Link to="/login">
                <Button type="primary" icon={<UserOutlined />}>
                  Provider Login
                </Button>
              </Link>
              <Link to="/patient/login">
                <Button icon={<LoginOutlined />}>
                  Patient Login
                </Button>
              </Link>
            </Space>
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: '24px', width: '100%', maxWidth: 'none' }}>
        <div style={{ width: '100%', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Title level={1} style={{ marginBottom: 16 }}>
              Healthcare Scheduling System
            </Title>
            <Text type="secondary" style={{ fontSize: 18 }}>
              Comprehensive appointment management for healthcare providers and patients
            </Text>
          </div>

          {/* Feature Overview */}
          <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
            <Col xs={24} md={12}>
              <Card>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    <UserOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                    <Title level={3}>For Healthcare Providers</Title>
                  </div>
                  <Paragraph>
                    Manage your availability, set appointment slots, and handle your schedule efficiently.
                  </Paragraph>
                  <ul>
                    <li>Interactive calendar view</li>
                    <li>Create and edit time slots</li>
                    <li>Set recurring appointments</li>
                    <li>Manage pricing and availability</li>
                    <li>Real-time conflict detection</li>
                  </ul>
                  <Link to="/provider/availability">
                    <Button type="primary" size="large" block>
                      <CalendarOutlined /> Manage Availability
                    </Button>
                  </Link>
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    <BookOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
                    <Title level={3}>For Patients</Title>
                  </div>
                  <Paragraph>
                    Find healthcare providers, view available appointments, and book your visits easily.
                  </Paragraph>
                  <ul>
                    <li>Search by specialization</li>
                    <li>Filter by location and price</li>
                    <li>View provider ratings</li>
                    <li>Book appointments online</li>
                    <li>Timezone conversion</li>
                  </ul>
                  <Link to="/patient/booking">
                    <Button type="primary" size="large" block>
                      <SearchOutlined /> Book Appointment
                    </Button>
                  </Link>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Key Features */}
          <Card title="Key Features" style={{ marginBottom: 48 }}>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} md={8}>
                <Space direction="vertical" size={8}>
                  <ClockCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <Title level={4}>Real-time Availability</Title>
                  <Text type="secondary">
                    Live updates of available slots with instant booking confirmation
                  </Text>
                </Space>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Space direction="vertical" size={8}>
                  <DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                  <Title level={4}>Flexible Pricing</Title>
                  <Text type="secondary">
                    Set different prices for different appointment types and durations
                  </Text>
                </Space>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Space direction="vertical" size={8}>
                  <CalendarOutlined style={{ fontSize: 24, color: '#faad14' }} />
                  <Title level={4}>Recurring Slots</Title>
                  <Text type="secondary">
                    Create repeating appointment slots for regular patients
                  </Text>
                </Space>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Space direction="vertical" size={8}>
                  <UserOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                  <Title level={4}>Provider Profiles</Title>
                  <Text type="secondary">
                    Detailed provider information with ratings and specializations
                  </Text>
                </Space>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Space direction="vertical" size={8}>
                  <SearchOutlined style={{ fontSize: 24, color: '#13c2c2' }} />
                  <Title level={4}>Advanced Search</Title>
                  <Text type="secondary">
                    Filter by date, specialization, location, and insurance
                  </Text>
                </Space>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Space direction="vertical" size={8}>
                  <BookOutlined style={{ fontSize: 24, color: '#eb2f96' }} />
                  <Title level={4}>Easy Booking</Title>
                  <Text type="secondary">
                    Simple booking process with confirmation and reminders
                  </Text>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Demo Navigation */}
          <Card title="Try the Demo" style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Provider Demo">
                  <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    <Text>Experience the provider interface:</Text>
                    <ul>
                      <li>View calendar with existing slots</li>
                      <li>Add new availability slots</li>
                      <li>Edit and delete appointments</li>
                      <li>Set recurring schedules</li>
                    </ul>
                    <Link to="/provider/availability">
                      <Button type="primary" block>
                        Launch Provider Demo
                      </Button>
                    </Link>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Patient Demo">
                  <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    <Text>Experience the patient interface:</Text>
                    <ul>
                      <li>Search for providers</li>
                      <li>Filter by criteria</li>
                      <li>View available slots</li>
                      <li>Book appointments</li>
                    </ul>
                    <Link to="/patient/booking">
                      <Button type="primary" block>
                        Launch Patient Demo
                      </Button>
                    </Link>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>

          {/* Technical Details */}
          <Card title="Technical Implementation">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Title level={5}>Frontend Technologies</Title>
                <ul>
                  <li>React 18 with TypeScript</li>
                  <li>Ant Design for UI components</li>
                  <li>TanStack Router for navigation</li>
                  <li>Day.js for date/time handling</li>
                </ul>
              </Col>
              <Col xs={24} md={8}>
                <Title level={5}>Key Features</Title>
                <ul>
                  <li>Responsive design</li>
                  <li>Real-time validation</li>
                  <li>Timezone support</li>
                  <li>Conflict detection</li>
                </ul>
              </Col>
              <Col xs={24} md={8}>
                <Title level={5}>Architecture</Title>
                <ul>
                  <li>Component-based structure</li>
                  <li>Shared utilities</li>
                  <li>Mock data integration</li>
                  <li>API-ready design</li>
                </ul>
              </Col>
            </Row>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default SchedulingDemo; 