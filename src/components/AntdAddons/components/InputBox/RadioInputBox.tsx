import React from 'react';
import { Radio } from 'antd';
import {
  defaultOptionKeys,
  defaultSeparator,
  InputWrapper,
  SplitInputWrapperProps,
} from '../../functions';
import { RadioInputBoxProps } from './interface';

const RadioInputBox: React.FC<RadioInputBoxProps> = (props) => {
  const { formProps, inputProps } = SplitInputWrapperProps(props);
  const { options, type, ...rest } = inputProps;

  const valueKey = options?.valueKey || defaultOptionKeys.value;
  const textKey = options?.textKey || defaultOptionKeys.text;
  const separator = options?.separator || defaultSeparator;
  let textKeys: any[] = [];
  if (Array.isArray(options?.textKey)) {
    textKeys = options?.textKey;
  }

  const renderOptions = options?.list?.map((option: any) => {
    if (
      options?.rejectedValues &&
      options?.rejectedValues.includes(option[valueKey]) &&
      !options?.requiredValues.includes(option[valueKey])
    ) {
      return null;
    }
    const renderOptionText =
      textKeys.length <= 0
        ? option[textKey]
        : textKeys
            .map((text_key) => option[text_key] || text_key)
            .join(separator);
    if (type === 'button') {
      return (
        <Radio.Button key={option[valueKey]} value={option[valueKey]}>
          {renderOptionText}
        </Radio.Button>
      );
    } else {
      return (
        <Radio key={option[valueKey]} value={option[valueKey]}>
          {renderOptionText}
        </Radio>
      );
    }
  });

  return (
    <InputWrapper {...formProps}>
      <Radio.Group {...rest}>{renderOptions}</Radio.Group>
    </InputWrapper>
  );
};

export default RadioInputBox;
