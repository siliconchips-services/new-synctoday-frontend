import React from 'react';
import { Select, Skeleton, Form, Spin } from 'antd';

const { Option } = Select;

interface SelectInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  options?: { label: string; value: string | number }[];
  validationRules?: any[];
  loading?: boolean;
  required?: boolean;
  validationMessage?: string;
  [key: string]: any; // Allow additional props
}

const SelectInput: React.FC<SelectInputProps> = ({
  name,
  label,
  placeholder,
  options,
  // validationRules,
  validationMessage,
  required,
  loading,
  ...rest
}) => {
  return (
    // <Form.Item name={name} label={label} rules={validationRules}>
    <Form.Item
      name={name}
      label={label}
      rules={[{ required, message: validationMessage }]}
    >
      {loading ? (
        <Skeleton.Input active />
      ) : (
        <Select
          placeholder={placeholder}
          showSearch
          defaultValue={rest?.defaultValue}
          allowClear={rest?.allowClear ?? true}
          status={rest[`aria-invalid`] && 'error'}
          variant="underlined"
          maxTagCount={rest[`mode`] && 1}
          mode={rest?.mode}
          onClear={rest?.onClear}
          onDeselect={rest?.onClear}
          notFoundContent={options?.length > 0 ? null : <Spin />}
          {...rest}
        >
          {(options || []).map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
      )}
    </Form.Item>
  );
};

export default SelectInput;
