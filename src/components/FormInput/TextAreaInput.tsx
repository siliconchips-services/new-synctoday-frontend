import React from 'react';
import { Input, Skeleton, Form } from 'antd';

const { TextArea } = Input;

interface TextAreaInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  validationRules?: any[];
  loading?: boolean;
  [key: string]: any; // Allow additional props
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
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
      <TextArea
        placeholder={placeholder}
        status={rest[`aria-invalid`] && 'error'}
        variant="underlined"
        {...rest}
      />
    )}
  </Form.Item>
);

export default TextAreaInput;
