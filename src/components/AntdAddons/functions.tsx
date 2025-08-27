import React from 'react';
import { FormItemProps, Form } from 'antd';

const InputWrapperTypes = [
  'name',
  'label',
  'rules',
  'prefixCls',
  'noStyle',
  'style',
  'className',
  'id',
  'hasFeedback',
  'validateStatus',
  'required',
  'hidden',
  'initialValue',
  'messageVariables',
  'tooltip',
  'fieldKey',
  'colon',
  'htmlFor',
  'labelAlign',
  'labelCol',
  'requiredMark',
  'required',
  'wrapperCol',
  'help',
  'extra',
  'status',
  'dependencies',
  'getValueFromEvent',
  'name',
  'normalize',
  'rules',
  'shouldUpdate',
  'trigger',
  'validateTrigger',
  'validateFirst',
  'valuePropName',
  'getValueProps',
  'messageVariables',
  'initialValue',
  'onReset',
  'preserve',
  'isListField',
  'isList',
  'fieldContext',
];

export const defaultOptionKeys = {
  value: 'id',
  text: 'name',
  disabled: 'disabled',
};
export const defaultSeparator = '';

export const SplitInputWrapperProps = (props: any) => {
  const modifiedProps: any = { formProps: {}, inputProps: {} };
  Object.keys(props).forEach((key) => {
    if (InputWrapperTypes.includes(key)) {
      modifiedProps.formProps[key] = props[key];
    } else {
      modifiedProps.inputProps[key] = props[key];
    }
  });
  return modifiedProps;
};

export const InputWrapper: React.FC<FormItemProps> = ({
  children,
  ...rest
}) => {
  return <Form.Item {...rest}>{children}</Form.Item>;
};
