import React from 'react';
import { Alert, Typography, Space, Button, Collapse, List, Tag } from 'antd';
import { 
  ExclamationCircleOutlined, 
  ClockCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  WarningOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { Panel } = Collapse;

interface Conflict {
  id: string;
  type: 'overlap' | 'double_booking' | 'break_violation' | 'time_limit';
  severity: 'low' | 'medium' | 'high';
  message: string;
  conflictingSlots?: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    appointmentType: string;
    providerName?: string;
  }>;
  suggestedResolutions?: string[];
}

interface ConflictWarningProps {
  conflicts: Conflict[];
  onResolve?: (conflictId: string, resolution: string) => void;
  onIgnore?: (conflictId: string) => void;
  showDetails?: boolean;
}

const ConflictWarning: React.FC<ConflictWarningProps> = ({
  conflicts,
  onResolve,
  onIgnore,
  showDetails = false
}) => {
  const getConflictIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'medium':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      default:
        return <ExclamationCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getConflictTypeColor = (type: string) => {
    switch (type) {
      case 'overlap':
        return 'red';
      case 'double_booking':
        return 'orange';
      case 'break_violation':
        return 'yellow';
      case 'time_limit':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getConflictTypeLabel = (type: string) => {
    switch (type) {
      case 'overlap':
        return 'Time Overlap';
      case 'double_booking':
        return 'Double Booking';
      case 'break_violation':
        return 'Break Violation';
      case 'time_limit':
        return 'Time Limit';
      default:
        return 'Conflict';
    }
  };

  const formatTime = (time: string) => {
    return dayjs(`2000-01-01 ${time}`).format('h:mm A');
  };

  const formatDate = (date: string) => {
    return dayjs(date).format('MMM DD, YYYY');
  };

  const getSeverityType = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  if (conflicts.length === 0) {
    return null;
  }

  const highSeverityConflicts = conflicts.filter(c => c.severity === 'high');
  const mediumSeverityConflicts = conflicts.filter(c => c.severity === 'medium');
  const lowSeverityConflicts = conflicts.filter(c => c.severity === 'low');

  return (
    <div>
      {highSeverityConflicts.length > 0 && (
        <Alert
          message="Critical Scheduling Conflicts"
          description={`${highSeverityConflicts.length} critical conflict${highSeverityConflicts.length > 1 ? 's' : ''} detected`}
          type="error"
          showIcon
          icon={getConflictIcon('high')}
          style={{ marginBottom: 16 }}
        />
      )}

      {mediumSeverityConflicts.length > 0 && (
        <Alert
          message="Warning: Potential Conflicts"
          description={`${mediumSeverityConflicts.length} potential conflict${mediumSeverityConflicts.length > 1 ? 's' : ''} detected`}
          type="warning"
          showIcon
          icon={getConflictIcon('medium')}
          style={{ marginBottom: 16 }}
        />
      )}

      {lowSeverityConflicts.length > 0 && (
        <Alert
          message="Information: Minor Conflicts"
          description={`${lowSeverityConflicts.length} minor conflict${lowSeverityConflicts.length > 1 ? 's' : ''} detected`}
          type="info"
          showIcon
          icon={getConflictIcon('low')}
          style={{ marginBottom: 16 }}
        />
      )}

      {showDetails && (
        <Collapse defaultActiveKey={['conflicts']} style={{ marginTop: 16 }}>
          <Panel 
            header={
              <Space>
                <WarningOutlined />
                <Text>View Conflict Details ({conflicts.length})</Text>
              </Space>
            } 
            key="conflicts"
          >
            <List
              dataSource={conflicts}
              renderItem={(conflict) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                      <Space align="center">
                        {getConflictIcon(conflict.severity)}
                        <Title level={5} style={{ margin: 0 }}>
                          {getConflictTypeLabel(conflict.type)}
                        </Title>
                        <Tag color={getConflictTypeColor(conflict.type)}>
                          {conflict.type.replace('_', ' ').toUpperCase()}
                        </Tag>
                        <Tag color={conflict.severity === 'high' ? 'red' : conflict.severity === 'medium' ? 'orange' : 'blue'}>
                          {conflict.severity.toUpperCase()}
                        </Tag>
                      </Space>

                      <Text>{conflict.message}</Text>

                      {conflict.conflictingSlots && conflict.conflictingSlots.length > 0 && (
                        <div>
                          <Text strong>Conflicting Slots:</Text>
                          <List
                            size="small"
                            dataSource={conflict.conflictingSlots}
                            renderItem={(slot) => (
                              <List.Item>
                                <Space>
                                  <CalendarOutlined />
                                  <Text>{formatDate(slot.date)}</Text>
                                  <ClockCircleOutlined />
                                  <Text>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</Text>
                                  <Tag color="blue">{slot.appointmentType}</Tag>
                                  {slot.providerName && (
                                    <Space>
                                      <UserOutlined />
                                      <Text>{slot.providerName}</Text>
                                    </Space>
                                  )}
                                </Space>
                              </List.Item>
                            )}
                          />
                        </div>
                      )}

                      {conflict.suggestedResolutions && conflict.suggestedResolutions.length > 0 && (
                        <div>
                          <Text strong>Suggested Resolutions:</Text>
                          <List
                            size="small"
                            dataSource={conflict.suggestedResolutions}
                            renderItem={(resolution, index) => (
                              <List.Item>
                                <Space>
                                  <Text>{index + 1}.</Text>
                                  <Text>{resolution}</Text>
                                  {onResolve && (
                                    <Button 
                                      size="small" 
                                      type="primary"
                                      onClick={() => onResolve(conflict.id, resolution)}
                                    >
                                      Apply
                                    </Button>
                                  )}
                                </Space>
                              </List.Item>
                            )}
                          />
                        </div>
                      )}

                      <Space>
                        {onResolve && (
                          <Button 
                            size="small" 
                            type="primary"
                            onClick={() => onResolve(conflict.id, 'manual')}
                          >
                            Resolve Manually
                          </Button>
                        )}
                        {onIgnore && (
                          <Button 
                            size="small"
                            onClick={() => onIgnore(conflict.id)}
                          >
                            Ignore
                          </Button>
                        )}
                      </Space>
                    </Space>
                  </div>
                </List.Item>
              )}
            />
          </Panel>
        </Collapse>
      )}
    </div>
  );
};

export default ConflictWarning; 