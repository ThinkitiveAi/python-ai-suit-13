import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, Checkbox, Typography, message, Modal, Row, Col } from 'antd';
import { InboxOutlined, UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, IdcardOutlined, HomeOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Text, Link } = Typography;
const { Option } = Select;

const PRIMARY_BLUE = '#2563eb';
const SECONDARY_GREEN = '#059669';

const SPECIALIZATIONS = [
  'Cardiology', 'Dermatology', 'Pediatrics', 'Neurology', 'Oncology', 'Orthopedics', 'Psychiatry', 'Radiology', 'General Medicine', 'Other',
];

const validateEmail = (_: any, value: string) => {
  if (!value) return Promise.reject('Please enter your email address');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(value)) return Promise.resolve();
  return Promise.reject('Enter a valid email address');
};

const validatePhone = (_: any, value: string) => {
  if (!value) return Promise.reject('Please enter your phone number');
  const phoneRegex = /^\+?\d{10,15}$/;
  if (phoneRegex.test(value)) return Promise.resolve();
  return Promise.reject('Enter a valid phone number');
};

const validatePassword = (_: any, value: string) => {
  if (!value) return Promise.reject('Please enter a password');
  if (value.length < 8) return Promise.reject('Password must be at least 8 characters');
  if (!/[A-Z]/.test(value)) return Promise.reject('Password must contain an uppercase letter');
  if (!/[a-z]/.test(value)) return Promise.reject('Password must contain a lowercase letter');
  if (!/[0-9]/.test(value)) return Promise.reject('Password must contain a number');
  if (!/[!@#$%^&*]/.test(value)) return Promise.reject('Password must contain a special character');
  return Promise.resolve();
};

const ProviderRegistration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Registration successful! Please check your email for verification.');
      form.resetFields();
    }, 2000);
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
        maxWidth: 800,
        width: '100%',
        margin: 16,
        zIndex: 1,
        overflow: 'visible',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <SafetyCertificateOutlined style={{ fontSize: 40, color: PRIMARY_BLUE, marginBottom: 8 }} />
          <Title level={2} style={{ color: PRIMARY_BLUE, marginBottom: 0 }}>Provider Registration</Title>
          <Text type="secondary">Create your healthcare provider profile</Text>
        </div>
        <Form
          form={form}
          name="provider_registration"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="on"
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Title level={4} style={{ marginTop: 0 }}>Personal Information</Title>
              <Form.Item name="profilePhoto" label="Profile Photo" valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList} style={{ marginBottom: 16 }}>
                <Upload.Dragger name="files" listType="picture" maxCount={1} beforeUpload={() => false} accept="image/*">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ color: PRIMARY_BLUE }} />
                  </p>
                  <p className="ant-upload-text">Click or drag photo to upload</p>
                </Upload.Dragger>
              </Form.Item>
              <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Please enter your first name' }]} style={{ marginBottom: 8 }}>
                <Input size="large" prefix={<UserOutlined />} placeholder="First Name" autoComplete="given-name" />
              </Form.Item>
              <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Please enter your last name' }]} style={{ marginBottom: 8 }}>
                <Input size="large" prefix={<UserOutlined />} placeholder="Last Name" autoComplete="family-name" />
              </Form.Item>
              <Form.Item name="email" label="Email Address" rules={[{ validator: validateEmail }]} hasFeedback style={{ marginBottom: 8 }}>
                <Input size="large" prefix={<MailOutlined />} placeholder="Email Address" autoComplete="email" />
              </Form.Item>
              <Form.Item name="phone" label="Phone Number" rules={[{ validator: validatePhone }]} hasFeedback style={{ marginBottom: 8 }}>
                <Input size="large" prefix={<PhoneOutlined />} placeholder="Phone Number" autoComplete="tel" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Title level={4} style={{ marginTop: 0 }}>Professional & Practice Information</Title>
              <Form.Item name="license" label="Medical License Number" rules={[{ required: true, message: 'Please enter your medical license number' }]} style={{ marginBottom: 8 }}>
                <Input size="large" prefix={<IdcardOutlined />} placeholder="Medical License Number" />
              </Form.Item>
              <Form.Item name="specialization" label="Specialization" rules={[{ required: true, message: 'Please select your specialization' }]} style={{ marginBottom: 8 }}>
                <Select
                  showSearch
                  placeholder="Select specialization"
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.children as string).toLowerCase().includes(input.toLowerCase())}
                  size="large"
                >
                  {SPECIALIZATIONS.map(spec => <Option key={spec} value={spec}>{spec}</Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="clinicName" label="Clinic/Hospital Name" rules={[{ required: true, message: 'Please enter your clinic or hospital name' }]} style={{ marginBottom: 8 }}>
                <Input size="large" prefix={<HomeOutlined />} placeholder="Clinic/Hospital Name" />
              </Form.Item>
              <Title level={4} style={{ marginTop: 24 }}>Account Security</Title>
              <Form.Item name="password" label="Password" rules={[{ validator: validatePassword }]} hasFeedback style={{ marginBottom: 8 }}>
                <Input.Password size="large" prefix={<LockOutlined />} placeholder="Password" autoComplete="new-password" />
              </Form.Item>
              <Form.Item name="confirmPassword" label="Confirm Password" dependencies={["password"]} hasFeedback rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Passwords do not match');
                  },
                }),
              ]} style={{ marginBottom: 8 }}>
                <Input.Password size="large" prefix={<LockOutlined />} placeholder="Confirm Password" autoComplete="new-password" />
              </Form.Item>
              <Form.Item name="terms" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('You must accept the terms and conditions') }]} style={{ marginBottom: 16 }}>
                <Checkbox aria-label="Accept Terms" onClick={() => setTermsVisible(true)}>
                  I accept the <span style={{ color: PRIMARY_BLUE, cursor: 'pointer' }}>Terms & Conditions</span>
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  style={{ background: PRIMARY_BLUE, borderColor: PRIMARY_BLUE }}
                  aria-label="Register"
                  disabled={loading}
                >
                  Register
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text>Already have an account? </Text>
          <Link href="/login" style={{ color: PRIMARY_BLUE }} tabIndex={0}>Login</Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Text type="secondary">Support: support@healthfirst.com</Text>
        </div>
        <Modal
          title="Terms & Conditions"
          open={termsVisible}
          onCancel={() => setTermsVisible(false)}
          footer={null}
        >
          <p>Terms and conditions content goes here...</p>
        </Modal>
      </div>
    </div>
  );
};

export default ProviderRegistration; 