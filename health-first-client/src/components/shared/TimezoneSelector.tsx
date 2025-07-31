import React, { useState, useEffect } from 'react';
import { Select, Typography, Space, Tag, Tooltip } from 'antd';
import { GlobalOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;
const { Text } = Typography;

interface TimezoneSelectorProps {
  value?: string;
  onChange?: (timezone: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  showCurrentTime?: boolean;
}

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)', offset: -5 },
  { value: 'America/Chicago', label: 'Central Time (CT)', offset: -6 },
  { value: 'America/Denver', label: 'Mountain Time (MT)', offset: -7 },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: -8 },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)', offset: -9 },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)', offset: -10 },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)', offset: 0 },
  { value: 'Europe/Paris', label: 'Central European Time (CET)', offset: 1 },
  { value: 'Europe/Berlin', label: 'Central European Time (CET)', offset: 1 },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)', offset: 9 },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)', offset: 8 },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)', offset: 5.5 },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)', offset: 10 },
  { value: 'Pacific/Auckland', label: 'New Zealand Standard Time (NZST)', offset: 12 }
];

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  value,
  onChange,
  placeholder = 'Select timezone',
  style,
  disabled = false,
  showCurrentTime = false
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    if (showCurrentTime) {
      const updateTime = () => {
        const now = dayjs();
        setCurrentTime(now.format('h:mm A'));
      };
      
      updateTime();
      const interval = setInterval(updateTime, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [showCurrentTime]);

  const getCurrentTimezone = () => {
    try {
      return dayjs.tz.guess();
    } catch {
      return 'America/New_York';
    }
  };

  const formatTimezoneOption = (tz: typeof TIMEZONES[0]) => {
    const now = dayjs();
    const offset = now.tz(tz.value).format('Z');
    const currentTimeInTz = now.tz(tz.value).format('h:mm A');
    
    return (
      <Space>
        <Text>{tz.label}</Text>
        <Text type="secondary">({offset})</Text>
        {showCurrentTime && (
          <Text type="secondary">{currentTimeInTz}</Text>
        )}
      </Space>
    );
  };

  const getTimezoneOffset = (timezone: string) => {
    try {
      const now = dayjs();
      return now.tz(timezone).format('Z');
    } catch {
      return '';
    }
  };

  const isCurrentTimezone = (timezone: string) => {
    return timezone === getCurrentTimezone();
  };

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={style}
      disabled={disabled}
      showSearch
      optionFilterProp="children"
      dropdownRender={(menu) => (
        <div>
          {menu}
          <div style={{ padding: '8px 12px', borderTop: '1px solid #f0f0f0' }}>
            <Space>
              <GlobalOutlined />
              <Text type="secondary">Current timezone: {getCurrentTimezone()}</Text>
              {showCurrentTime && (
                <Tag color="blue">
                  <ClockCircleOutlined /> {currentTime}
                </Tag>
              )}
            </Space>
          </div>
        </div>
      )}
    >
      {TIMEZONES.map(tz => (
        <Option key={tz.value} value={tz.value}>
          <Space>
            {formatTimezoneOption(tz)}
            {isCurrentTimezone(tz.value) && (
              <Tag color="green" size="small">Current</Tag>
            )}
          </Space>
        </Option>
      ))}
    </Select>
  );
};

export default TimezoneSelector; 