import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, DatePicker, Checkbox, Typography, message, Modal, Row, Col } from 'antd';
import { InboxOutlined, UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, HeartTwoTone, HomeOutlined, ContactsOutlined } from '@ant-design/icons';
import { Link as RouterLink } from '@tanstack/react-router';

const { Title, Text } = Typography;
const { Option } = Select;

const PRIMARY_BLUE = '#3b82f6';
const SOFT_GREEN = '#10b981';
const WARM_GRAY = '#f3f4f6';

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const RELATIONSHIPS = ['Spouse', 'Parent', 'Sibling', 'Friend', 'Other'];
const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'India', 'Other'];
const STATES = ['California', 'Texas', 'New York', 'Florida', 'Other'];

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

const PatientRegistration: React.FC = () => {
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
        boxShadow: '0 4px 24px rgba(37,99,235,0.08)',
        padding: 32,
        maxWidth: 600,
        width: '100%',
        margin: '32px auto',
        zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <HeartTwoTone twoToneColor={SOFT_GREEN} style={{ fontSize: 40, marginBottom: 8 }} />
          <Title level={2} style={{ color: PRIMARY_BLUE, marginBottom: 0 }}>Patient Registration</Title>
          <Text type="secondary">Create your healthcare account</Text>
        </div>
        <Form
          form={form}
          name="patient_registration"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="on"
          style={{ width: '100%' }}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>Personal Information</Title>
              <Form.Item name="profilePhoto" label="Profile Photo (optional)" valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList} style={{ marginBottom: 16 }}>
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
              <Form.Item name="dob" label="Date of Birth" rules={[{ required: true, message: 'Please select your date of birth' }]} style={{ marginBottom: 8 }}>
                <DatePicker style={{ width: '100%' }} size="large" format="YYYY-MM-DD" placeholder="Select date of birth" />
              </Form.Item>
              <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select your gender' }]} style={{ marginBottom: 8 }}>
                <Select size="large" placeholder="Select gender">
                  {GENDERS.map(gender => <Option key={gender} value={gender}>{gender}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>Address Information</Title>
              <Form.Item name="street" label="Street Address" rules={[{ required: true, message: 'Please enter your street address' }]} style={{ marginBottom: 8 }}>
                <Input size="large" prefix={<HomeOutlined />} placeholder="Street Address" />
              </Form.Item>
              <Form.Item name="city" label="City" rules={[{ required: true, message: 'Please enter your city' }]} style={{ marginBottom: 8 }}>
                <Input size="large" placeholder="City" />
              </Form.Item>
              <Form.Item name="state" label="State/Province" rules={[{ required: true, message: 'Please enter your state or province' }]} style={{ marginBottom: 8 }}>
                <Input size="large" placeholder="State/Province" />
              </Form.Item>
              <Form.Item name="zip" label="ZIP/Postal Code" rules={[{ required: true, message: 'Please enter your ZIP or postal code' }]} style={{ marginBottom: 8 }}>
                <Input size="large" placeholder="ZIP/Postal Code" />
              </Form.Item>
              <Form.Item name="country" label="Country" rules={[{ required: true, message: 'Please select your country' }]} style={{ marginBottom: 8 }}>
                <Select size="large" placeholder="Select country">
                  {COUNTRIES.map(country => <Option key={country} value={country}>{country}</Option>)}
                </Select>
              </Form.Item>
              <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>Emergency Contact</Title>
              <Form.Item name="emergencyName" label="Emergency Contact Name" rules={[{ required: true, message: 'Please enter emergency contact name' }]} style={{ marginBottom: 8 }}>
                <Input size="large" prefix={<ContactsOutlined />} placeholder="Emergency Contact Name" />
              </Form.Item>
              <Form.Item name="relationship" label="Relationship" rules={[{ required: true, message: 'Please select relationship' }]} style={{ marginBottom: 8 }}>
                <Select size="large" placeholder="Select relationship">
                  {RELATIONSHIPS.map(rel => <Option key={rel} value={rel}>{rel}</Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="emergencyPhone" label="Emergency Phone Number" rules={[{ validator: validatePhone }]} hasFeedback style={{ marginBottom: 8 }}>
                <Input size="large" prefix={<PhoneOutlined />} placeholder="Emergency Phone Number" autoComplete="tel" />
              </Form.Item>
              <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>Account Security</Title>
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
          <RouterLink to="/patient/login" style={{ color: PRIMARY_BLUE }} tabIndex={0}>Login</RouterLink>
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

export default PatientRegistration; 