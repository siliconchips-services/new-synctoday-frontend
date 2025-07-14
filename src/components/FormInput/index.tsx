import React from 'react';
import { Form, Switch } from 'antd';
import DateInput from './DateInput';
import DateRangeInput from './DateRangeInput';
import SelectInput from './SelectInput';
import TextInput from './TextInput';
import PasswordInput from './PasswordInput';
import TextAreaInput from './TextAreaInput';
import ImageUpload from './ImageUpload';

type FormInputType =
  | 'text'
  | 'password'
  | 'textarea'
  | 'date'
  | 'select'
  | 'switch'
  | 'upload'
  | 'dateRange';

interface FormInputProps {
  name: string;
  label?: string;
  type: FormInputType;
  options?: { label: string; value: string }[];
  required?: boolean;
  regex?: RegExp;
  validationMessage?: string | any;
  [key: string]: any; // To support ...rest props
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type,
  options,
  required,
  regex,
  validationMessage,
  ...rest
}) => {
  const rules = [];

  if (required) {
    rules.push(
      label !== undefined
        ? { required: true, message: `${label} is required` }
        : validationMessage,
    );
  }

  if (regex) {
    rules.push({
      pattern: regex,
      message: validationMessage || `Invalid ${label}`,
    });
  }

  return (
    <Form.Item name={name} label={label} rules={rules}>
      {type === 'text' && <TextInput name={name} {...rest} />}
      {type === 'password' && <PasswordInput name={name} {...rest} />}
      {type === 'textarea' && <TextAreaInput name={name} {...rest} />}
      {type === 'date' && (
        <DateInput
          name={name}
          disableFuture={rest?.disableFuture ?? false}
          disablePast={rest?.disablePast}
          pastDaysLimit={rest?.pastDaysLimit}
          {...rest}
          style={{ width: '100%' }}
        />
      )}
      {type === 'dateRange' && (
        <DateRangeInput
          name={name}
          disableFuture={rest?.disableFuture ?? false}
          disablePast={rest?.disablePast}
          pastDaysLimit={rest?.pastDaysLimit}
          {...rest}
          style={{ width: '100%' }}
        />
      )}
      {type === 'select' && (
        <SelectInput name={name} options={options} {...rest} />
      )}
      {type === 'switch' && (
        <Switch
          checkedChildren="True"
          unCheckedChildren="False"
          defaultChecked={rest.defaultChecked}
          onChange={(val) => rest?.onChange?.(val)}
        />
      )}
      {type === 'upload' && (
        <ImageUpload
          name={name}
          fileType={rest?.fileType}
          fileSizeLimitMB={rest?.fileSizeLimitMB}
          validationMessage={rest?.validationMessage}
          imageRatio={rest?.imageRatio}
          {...rest}
        />
      )}
    </Form.Item>
  );
};

export default FormInput;
