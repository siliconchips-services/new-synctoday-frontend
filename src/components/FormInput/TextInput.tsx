import React from 'react';
import { Input, Skeleton, Form } from 'antd';

interface TextInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  validationRules?: any[];
  loading?: boolean;
  required?: boolean;
  validationMessage?: string;
  [key: string]: any; // Allow additional props
}

const TextInput: React.FC<TextInputProps> = ({
  name,
  label,
  placeholder,
  // validationRules,
  validationMessage,
  required,
  loading,
  ...rest
}) => (
  // <Form.Item name={name} label={label} rules={validationRules}>
  <Form.Item
    name={name}
    label={label}
    rules={[{ required, message: validationMessage }]}
  >
    {loading ? (
      <Skeleton.Input active />
    ) : (
      <Input
        placeholder={placeholder}
        status={rest[`aria-invalid`] && 'error'}
        variant="underlined"
        {...rest}
      />
    )}
  </Form.Item>
);

export default TextInput;
