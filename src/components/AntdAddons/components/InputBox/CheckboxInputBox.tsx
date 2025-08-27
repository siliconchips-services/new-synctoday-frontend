import { Checkbox } from 'antd';
import React from 'react';
import {
  defaultOptionKeys,
  defaultSeparator,
  InputWrapper,
  SplitInputWrapperProps,
} from '../../functions';
import { CheckboxInputBoxProps } from './interface';

const CheckboxInputBox: React.FC<CheckboxInputBoxProps> = (props) => {
  const { formProps, inputProps } = SplitInputWrapperProps(props);
  const { options, ...rest } = inputProps;

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

    return (
      <Checkbox
        key={formProps?.name + '--' + option[valueKey]}
        value={option[valueKey]}
      >
        {renderOptionText}
      </Checkbox>
    );
  });

  return (
    <InputWrapper {...formProps} key={formProps?.name}>
      <Checkbox.Group {...rest} key={formProps?.name}>
        {renderOptions}
      </Checkbox.Group>
    </InputWrapper>
  );
};

export default CheckboxInputBox;
