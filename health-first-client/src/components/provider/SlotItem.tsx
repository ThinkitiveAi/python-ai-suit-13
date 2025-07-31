import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Tag, 
  Typography, 
  Space, 
  Modal, 
  message,
  Popconfirm,
  Row,
  Col,
  Badge
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  ClockCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

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

interface SlotItemProps {
  slot: Slot;
  onEdit: (slot: Slot) => void;
  onDelete: (slotId: string) => void;
  loading?: boolean;
}

const SlotItem: React.FC<SlotItemProps> = ({ 
  slot, 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const formatTime = (time: string) => {
    return dayjs(`2000-01-01 ${time}`).format('h:mm A');
  };

  const formatDate = (date: string) => {
    return dayjs(date).format('MMM DD, YYYY');
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

  const handleDelete = async () => {
    try {
      await onDelete(slot.id);
      setDeleteModalVisible(false);
      message.success('Slot deleted successfully');
    } catch (error) {
      message.error('Failed to delete slot');
    }
  };

  const isToday = dayjs(slot.date).isSame(dayjs(), 'day');
  const isPast = dayjs(slot.date).isBefore(dayjs(), 'day');

  return (
    <>
      <Card
        size="small"
        style={{ 
          marginBottom: 8,
          border: isToday ? '2px solid #1890ff' : undefined,
          opacity: isPast ? 0.6 : 1
        }}
        bodyStyle={{ padding: 12 }}
      >
        <Row gutter={[8, 8]} align="middle">
          <Col xs={24} sm={16}>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Space align="center">
                <ClockCircleOutlined style={{ color: '#1890ff' }} />
                <Text strong>
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </Text>
                {isToday && (
                  <Badge status="processing" text="Today" />
                )}
              </Space>
              
              <Space align="center">
                <CalendarOutlined style={{ color: '#666' }} />
                <Text type="secondary">{formatDate(slot.date)}</Text>
              </Space>

              <Space align="center">
                {getLocationIcon(slot.location)}
                <Text>{slot.location}</Text>
                {slot.room && (
                  <Text type="secondary">• Room {slot.room}</Text>
                )}
              </Space>

              <Space align="center">
                <Tag color={getAppointmentTypeColor(slot.appointmentType)}>
                  {slot.appointmentType}
                </Tag>
                {slot.isRecurring && (
                  <Tag color="orange">Recurring</Tag>
                )}
                {slot.insuranceAccepted && (
                  <Tag color="green">Insurance</Tag>
                )}
              </Space>

              <Space align="center">
                <DollarOutlined style={{ color: '#52c41a' }} />
                <Text strong>
                  {slot.price} {slot.currency}
                </Text>
                <Text type="secondary">
                  • {slot.maxAppointments} patient{slot.maxAppointments > 1 ? 's' : ''} max
                </Text>
              </Space>

              {slot.notes && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {slot.notes}
                </Text>
              )}
            </Space>
          </Col>

          <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
            <Space direction="vertical" size={4}>
              <Button
                type="text"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit(slot)}
                disabled={loading}
              >
                Edit
              </Button>
              <Popconfirm
                title="Delete Slot"
                description="Are you sure you want to delete this slot? This action cannot be undone."
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
                placement="left"
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  disabled={loading}
                >
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          </Col>
        </Row>
      </Card>

      <Modal
        title="Delete Slot"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={handleDelete}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this slot?</p>
        <p><strong>Date:</strong> {formatDate(slot.date)}</p>
        <p><strong>Time:</strong> {formatTime(slot.startTime)} - {formatTime(slot.endTime)}</p>
        <p><strong>Type:</strong> {slot.appointmentType}</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default SlotItem; 