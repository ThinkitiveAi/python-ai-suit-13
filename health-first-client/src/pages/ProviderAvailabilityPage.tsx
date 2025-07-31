import React from 'react';
import { Layout, Typography, Breadcrumb, Space, Card, Row, Col, Statistic } from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  DollarOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Link } from '@tanstack/react-router';
import AvailabilityCalendar from '../components/provider/AvailabilityCalendar';

const { Content } = Layout;
const { Title, Text } = Typography;

const ProviderAvailabilityPage: React.FC = () => {
  // Mock statistics - replace with API data
  const stats = {
    totalSlots: 24,
    availableSlots: 18,
    bookedSlots: 6,
    totalRevenue: 2400,
    thisWeekSlots: 8,
    nextWeekSlots: 12
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content style={{ padding: '24px', width: '100%', maxWidth: 'none' }}>
        <div style={{ width: '100%', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <Breadcrumb style={{ marginBottom: 16 }}>
              <Breadcrumb.Item>
                <Link to="/scheduling-demo" style={{ color: '#1890ff' }}>
                  <HomeOutlined style={{ marginRight: 4 }} />
                  Home
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/provider/availability" style={{ color: '#1890ff' }}>
                  Availability
                </Link>
              </Breadcrumb.Item>
            </Breadcrumb>
            
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Col>
                <Title level={2} style={{ margin: 0 }}>
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  Manage Availability
                </Title>
                <Text type="secondary">
                  Set your available time slots for patient bookings
                </Text>
              </Col>
            </Row>
          </div>

          {/* Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Slots"
                  value={stats.totalSlots}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Available Slots"
                  value={stats.availableSlots}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Booked Slots"
                  value={stats.bookedSlots}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Revenue"
                  value={stats.totalRevenue}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                  suffix="USD"
                />
              </Card>
            </Col>
          </Row>

          {/* Quick Stats */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} md={12}>
              <Card size="small" title="This Week">
                <Space direction="vertical" size={8}>
                  <Text>Available slots: {stats.thisWeekSlots}</Text>
                  <Text type="secondary">Next 7 days</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" title="Next Week">
                <Space direction="vertical" size={8}>
                  <Text>Available slots: {stats.nextWeekSlots}</Text>
                  <Text type="secondary">Following 7 days</Text>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Main Calendar Component */}
          <Card>
            <AvailabilityCalendar providerId="current-provider" />
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default ProviderAvailabilityPage; 