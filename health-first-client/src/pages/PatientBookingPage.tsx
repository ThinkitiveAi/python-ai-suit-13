import React, { useState } from 'react';
import { Layout, Typography, Breadcrumb, Space, Card, Row, Col, message } from 'antd';
import { 
  SearchOutlined, 
  UserOutlined, 
  CalendarOutlined,
  BookOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Link } from '@tanstack/react-router';
import SearchForm from '../components/patient/SearchForm';
import ProviderList from '../components/patient/ProviderList';
import SlotBookingModal from '../components/patient/SlotBookingModal';

const { Content } = Layout;
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

interface SearchFilters {
  dateRange: [any, any] | null;
  specialization: string[];
  location: string[];
  appointmentType: string[];
  maxPrice: number | null;
  insuranceAccepted: boolean;
  providerName: string;
  timezone: string;
  availability: string;
}

const PatientBookingPage: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  // Mock providers data - replace with API call
  const mockProviders: Provider[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      specialization: ['Cardiology', 'Internal Medicine'],
      experience: 15,
      rating: 4.8,
      reviewCount: 127,
      clinic: 'HeartCare Medical Center',
      location: 'New York, NY',
      phone: '+1 (555) 123-4567',
      email: 'dr.johnson@heartcare.com',
      insuranceAccepted: true,
      bio: 'Board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases.'
    },
    {
      id: '2',
      name: 'Michael Chen',
      specialization: ['Dermatology'],
      experience: 12,
      rating: 4.9,
      reviewCount: 89,
      clinic: 'SkinCare Dermatology',
      location: 'Los Angeles, CA',
      phone: '+1 (555) 234-5678',
      email: 'dr.chen@skincare.com',
      insuranceAccepted: true,
      bio: 'Specialized in cosmetic dermatology and skin cancer treatment.'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      specialization: ['Pediatrics', 'Family Medicine'],
      experience: 8,
      rating: 4.7,
      reviewCount: 156,
      clinic: 'Children\'s Health Clinic',
      location: 'Chicago, IL',
      phone: '+1 (555) 345-6789',
      email: 'dr.rodriguez@childrenshealth.com',
      insuranceAccepted: true,
      bio: 'Dedicated pediatrician with expertise in child development and preventive care.'
    }
  ];

  const handleSearch = async (filters: SearchFilters) => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter providers based on search criteria
      let filteredProviders = mockProviders;
      
      if (filters.providerName) {
        filteredProviders = filteredProviders.filter(provider =>
          provider.name.toLowerCase().includes(filters.providerName.toLowerCase())
        );
      }
      
      if (filters.specialization.length > 0) {
        filteredProviders = filteredProviders.filter(provider =>
          provider.specialization.some(spec => 
            filters.specialization.includes(spec)
          )
        );
      }
      
      if (filters.maxPrice) {
        // In a real app, you'd filter by actual slot prices
        filteredProviders = filteredProviders.filter(provider =>
          provider.insuranceAccepted // Simplified filtering
        );
      }
      
      if (filters.insuranceAccepted) {
        filteredProviders = filteredProviders.filter(provider =>
          provider.insuranceAccepted
        );
      }
      
      setProviders(filteredProviders);
      
      if (filteredProviders.length === 0) {
        message.info('No providers found matching your criteria. Try adjusting your search filters.');
      } else {
        message.success(`Found ${filteredProviders.length} provider${filteredProviders.length > 1 ? 's' : ''} matching your criteria.`);
      }
    } catch (error) {
      message.error('Failed to search for providers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = (providerId: string, slotId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return;

    // Mock slot data - replace with API call
    const slot: Slot = {
      id: slotId,
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
    };

    setSelectedProvider(provider);
    setSelectedSlot(slot);
    setBookingModalVisible(true);
  };

  const handleConfirmBooking = async (bookingData: any) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success('Appointment booked successfully! You will receive a confirmation email shortly.');
      setBookingModalVisible(false);
      setSelectedProvider(null);
      setSelectedSlot(null);
      
      // Refresh provider list to update availability
      // In a real app, you'd refetch the providers data
    } catch (error) {
      message.error('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5', width: '100vw' }}>
      <Content style={{ padding: '24px', width: '100%', maxWidth: 'none', margin: 0 }}>
        <div style={{ width: '100%', margin: 0 }}>
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
                <Link to="/patient/booking" style={{ color: '#1890ff' }}>
                  Book Appointment
                </Link>
              </Breadcrumb.Item>
            </Breadcrumb>
            
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Col>
                <Title level={2} style={{ margin: 0 }}>
                  <BookOutlined style={{ marginRight: 8 }} />
                  Book Appointment
                </Title>
                <Text type="secondary">
                  Find and book appointments with healthcare providers
                </Text>
              </Col>
            </Row>
          </div>

          {/* Search Form */}
          <SearchForm onSearch={handleSearch} loading={loading} />

          {/* Results Section */}
          <Card style={{ width: '100%' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Col>
                <Title level={4} style={{ margin: 0 }}>
                  <UserOutlined style={{ marginRight: 8 }} />
                  Available Providers
                </Title>
                <Text type="secondary">
                  {providers.length} provider{providers.length !== 1 ? 's' : ''} found
                </Text>
              </Col>
              <Col>
                <Space>
                  <CalendarOutlined />
                  <Text>Showing available appointments</Text>
                </Space>
              </Col>
            </Row>

            <ProviderList
              providers={providers}
              loading={loading}
              onBookSlot={handleBookSlot}
            />
          </Card>

          {/* Booking Modal */}
          {selectedProvider && selectedSlot && (
            <SlotBookingModal
              visible={bookingModalVisible}
              provider={selectedProvider}
              slot={selectedSlot}
              onClose={() => {
                setBookingModalVisible(false);
                setSelectedProvider(null);
                setSelectedSlot(null);
              }}
              onConfirm={handleConfirmBooking}
              loading={loading}
            />
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default PatientBookingPage; 