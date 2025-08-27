import React from 'react';
import { Input, Skeleton, Form } from 'antd';

interface PasswordInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  validationRules?: any[];
  loading?: boolean;
  [key: string]: any; // Allow additional props
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  label,
  placeholder,
  validationRules,
  loading,
  ...rest
}) => (
  <Form.Item name={name} label={label} rules={validationRules}>
    {loading ? (
      <Skeleton.Input active />
    ) : (
      <Input.Password
        placeholder={placeholder}
        status={rest[`aria-invalid`] && 'error'}
        variant="underlined"
        {...rest}
      />
    )}
  </Form.Item>
);

export default PasswordInput;
