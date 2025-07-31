import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const PRIMARY_BLUE = '#2563eb';
const SECONDARY_GREEN = '#059669';

const validateEmailOrPhone = (_: any, value: string) => {
  if (!value) return Promise.reject('Please enter your email or phone number');
  // Simple email/phone validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?\d{10,15}$/;
  if (emailRegex.test(value) || phoneRegex.test(value)) return Promise.resolve();
  return Promise.reject('Enter a valid email or phone number');
};

const ProviderLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (values.password === 'password123') {
        message.success('Login successful! Redirecting...');
        // Simulate redirect
      } else {
        message.error('Invalid credentials. Please try again.');
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
        background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdfa 100%)',
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
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(37,99,235,0.08)',
        padding: 32,
        maxWidth: 400,
        width: '100%',
        margin: 16,
        zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/vite.svg" alt="App Logo" style={{ width: 48, marginBottom: 8 }} />
          <Title level={2} style={{ color: PRIMARY_BLUE, marginBottom: 0 }}>Provider Login</Title>
          <Text type="secondary">Sign in to your healthcare dashboard</Text>
        </div>
        <Form
          name="provider_login"
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
              placeholder="Enter email or phone number"
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
              iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              autoComplete="current-password"
              aria-label="Password"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox aria-label="Remember Me" style={{ color: PRIMARY_BLUE }}>Remember Me</Checkbox>
              </Form.Item>
              <Link href="#" style={{ color: SECONDARY_GREEN }} tabIndex={0}>Forgot Password?</Link>
            </div>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{ background: PRIMARY_BLUE, borderColor: PRIMARY_BLUE }}
              aria-label="Login"
              disabled={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text>New provider? </Text>
          <Link href="#" style={{ color: PRIMARY_BLUE }} tabIndex={0}>Register</Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Link href="#" style={{ color: '#888' }} tabIndex={0}>Support</Link> |{' '}
          <Link href="#" style={{ color: '#888' }} tabIndex={0}>Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default ProviderLogin; 