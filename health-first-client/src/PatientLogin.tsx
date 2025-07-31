import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, HeartTwoTone } from '@ant-design/icons';
import { Link as RouterLink } from '@tanstack/react-router';

const { Title, Text } = Typography;

const PRIMARY_BLUE = '#3b82f6';
const SOFT_GREEN = '#10b981';
const WARM_NEUTRAL = '#f3f4f6';

const validateEmailOrPhone = (_: any, value: string) => {
  if (!value) return Promise.reject('Please enter your email or phone number');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?\d{10,15}$/;
  if (emailRegex.test(value) || phoneRegex.test(value)) return Promise.resolve();
  return Promise.reject('Enter a valid email or phone number');
};

const PatientLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (values.password === 'patient123') {
        message.success('Welcome back! Redirecting to your dashboard...');
      } else {
        message.error('Invalid credentials. Please try again or reset your password.');
      }
    }, 1500);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #f3f4f6 100%)',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 32px rgba(59,130,246,0.10)',
        padding: 32,
        maxWidth: 400,
        width: '100%',
        margin: 16,
        zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <HeartTwoTone twoToneColor={SOFT_GREEN} style={{ fontSize: 48, marginBottom: 8 }} />
          <Title level={2} style={{ color: PRIMARY_BLUE, marginBottom: 0 }}>Patient Login</Title>
          <Text type="secondary" style={{ fontSize: 16 }}>Welcome back! Please sign in to your account</Text>
        </div>
        <Form
          name="patient_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="on"
        >
          <Form.Item
            name="credential"
            label="Email or Phone Number"
            rules={[{ validator: validateEmailOrPhone }]}
            hasFeedback
          >
            <Input
              size="large"
              placeholder="e.g. john@email.com or +1234567890"
              prefix={<UserOutlined style={{ color: PRIMARY_BLUE }} />}
              autoComplete="username"
              aria-label="Email or Phone Number"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }, { min: 8, message: 'Password must be at least 8 characters' }]}
            hasFeedback
          >
            <Input.Password
              size="large"
              placeholder="Enter password"
              prefix={<LockOutlined style={{ color: PRIMARY_BLUE }} />}
              iconRender={visible => visible ? <EyeTwoTone twoToneColor={PRIMARY_BLUE} /> : <EyeInvisibleOutlined />}
              autoComplete="current-password"
              aria-label="Password"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox aria-label="Remember Me" style={{ color: PRIMARY_BLUE, fontSize: 16 }}>Remember Me</Checkbox>
              </Form.Item>
              <RouterLink to="/patient/forgot-password" style={{ color: SOFT_GREEN, fontSize: 16 }}>Forgot Password?</RouterLink>
            </div>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{ background: PRIMARY_BLUE, borderColor: PRIMARY_BLUE, fontSize: 18, height: 48 }}
              aria-label="Login"
              disabled={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text>New patient? </Text>
          <RouterLink to="/register" style={{ color: PRIMARY_BLUE, fontSize: 16 }}>Register</RouterLink>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <RouterLink to="/help" style={{ color: '#888', fontSize: 14 }}>Help & Support</RouterLink> |{' '}
          <RouterLink to="/contact" style={{ color: '#888', fontSize: 14 }}>Contact Us</RouterLink>
        </div>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#888' }}>
          <Text>Privacy & Security assured. &copy; {new Date().getFullYear()} HealthFirst</Text>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin; 