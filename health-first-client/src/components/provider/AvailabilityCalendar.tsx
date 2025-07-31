import React, { useState, useEffect } from 'react';
import { Calendar, Button, Badge, Modal, message, Row, Col, Card, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import SlotFormModal from './SlotFormModal';
import SlotItem from './SlotItem';

const { Title, Text } = Typography;

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
}

interface AvailabilityCalendarProps {
  providerId?: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ providerId }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with API call
  useEffect(() => {
    const mockSlots: Slot[] = [
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
        notes: 'General consultation',
        isRecurring: false,
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
        notes: 'Follow-up appointment',
        isRecurring: false,
        timezone: 'America/New_York'
      }
    ];
    setSlots(mockSlots);
  }, []);

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
    setEditingSlot(null);
    setModalOpen(true);
  };

  const handleSlotEdit = (slot: Slot) => {
    setEditingSlot(slot);
    setSelectedDate(dayjs(slot.date));
    setModalOpen(true);
  };

  const handleSlotDelete = async (slotId: string) => {
    try {
      setLoading(true);
      // API call to delete slot
      setSlots(prev => prev.filter(slot => slot.id !== slotId));
      message.success('Slot deleted successfully');
    } catch (error) {
      message.error('Failed to delete slot');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSave = async (slotData: Partial<Slot>) => {
    try {
      setLoading(true);
      if (editingSlot) {
        // Update existing slot
        setSlots(prev => prev.map(slot => 
          slot.id === editingSlot.id ? { ...slot, ...slotData } : slot
        ));
        message.success('Slot updated successfully');
      } else {
        // Create new slot
        const newSlot: Slot = {
          id: Date.now().toString(),
          ...slotData as Slot
        };
        setSlots(prev => [...prev, newSlot]);
        message.success('Slot created successfully');
      }
      setModalOpen(false);
      setEditingSlot(null);
    } catch (error) {
      message.error('Failed to save slot');
    } finally {
      setLoading(false);
    }
  };

  const getSlotsForDate = (date: Dayjs) => {
    return slots.filter(slot => dayjs(slot.date).isSame(date, 'day'));
  };

  const dateCellRender = (date: Dayjs) => {
    const daySlots = getSlotsForDate(date);
    
    return (
      <div style={{ minHeight: 60 }}>
        {daySlots.map(slot => (
          <div key={slot.id} style={{ marginBottom: 2 }}>
            <Badge 
              color="blue" 
              text={
                <Text style={{ fontSize: '10px' }}>
                  {slot.startTime} - {slot.appointmentType}
                </Text>
              }
            />
          </div>
        ))}
      </div>
    );
  };

  const monthCellRender = (date: Dayjs) => {
    const daySlots = getSlotsForDate(date);
    
    return (
      <div style={{ minHeight: 40 }}>
        {daySlots.length > 0 && (
          <Badge count={daySlots.length} style={{ backgroundColor: '#52c41a' }}>
            <div style={{ width: 8, height: 8 }} />
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={16}>
          <Title level={3}>Manage Availability</Title>
          <Text type="secondary">Set your available time slots for patient bookings</Text>
        </Col>
        <Col xs={24} md={8} style={{ textAlign: 'right' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedDate(dayjs());
              setEditingSlot(null);
              setModalOpen(true);
            }}
            size="large"
          >
            Add Availability
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card style={{ width: '100%' }}>
            <Calendar
              fullscreen={true}
              onSelect={handleDateSelect}
              dateCellRender={dateCellRender}
              monthCellRender={monthCellRender}
              headerRender={({ value, onChange }) => (
                <div style={{ padding: '8px 0' }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Button.Group>
                        <Button onClick={() => onChange(value.clone().subtract(1, 'month'))}>
                          Previous
                        </Button>
                        <Button onClick={() => onChange(dayjs())}>
                          Today
                        </Button>
                        <Button onClick={() => onChange(value.clone().add(1, 'month'))}>
                          Next
                        </Button>
                      </Button.Group>
                    </Col>
                    <Col>
                      <Title level={4} style={{ margin: 0 }}>
                        {value.format('MMMM YYYY')}
                      </Title>
                    </Col>
                  </Row>
                </div>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Quick Actions" style={{ marginBottom: 16 }}>
            <Button 
              block 
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
              style={{ marginBottom: 8 }}
            >
              Add Slot
            </Button>
            <Button 
              block 
              icon={<EditOutlined />}
              onClick={() => {
                if (slots.length > 0) {
                  handleSlotEdit(slots[0]);
                }
              }}
              disabled={slots.length === 0}
            >
              Edit Slot
            </Button>
          </Card>

          <Card title="Today's Slots">
            {getSlotsForDate(dayjs()).length > 0 ? (
              getSlotsForDate(dayjs()).map(slot => (
                <SlotItem
                  key={slot.id}
                  slot={slot}
                  onEdit={() => handleSlotEdit(slot)}
                  onDelete={() => handleSlotDelete(slot.id)}
                  loading={loading}
                />
              ))
            ) : (
              <Text type="secondary">No slots scheduled for today</Text>
            )}
          </Card>
        </Col>
      </Row>

      <SlotFormModal
        visible={modalOpen}
        date={selectedDate}
        slot={editingSlot}
        onClose={() => {
          setModalOpen(false);
          setEditingSlot(null);
        }}
        onSave={handleSlotSave}
        loading={loading}
      />
    </div>
  );
};

export default AvailabilityCalendar; 