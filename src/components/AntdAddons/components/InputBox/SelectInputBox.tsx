import React from 'react';
import { Select } from 'antd';
import {
  defaultOptionKeys,
  defaultSeparator,
  InputWrapper,
  SplitInputWrapperProps,
} from '../../functions';
import { SelectInputBoxProps } from './interface';

const SelectInputBox: React.FC<SelectInputBoxProps> = (props) => {
  const { formProps, inputProps } = SplitInputWrapperProps(props);
  const { options, disableOptions, ...rest } = inputProps;

  const valueKey = options?.valueKey || defaultOptionKeys.value;
  const textKey = options?.textKey || defaultOptionKeys.text;
  const alternativeTextKey =
    options?.alternativeTextKey || defaultOptionKeys.text;
  const disabledKey = options?.disabled || defaultOptionKeys.disabled;
  const separator = options?.separator || defaultSeparator;
  let textKeys: any[] = [];
  if (Array.isArray(options?.textKey)) {
    textKeys = options?.textKey;
  }

  const renderOptions = options?.list?.map((option: any, index: number) => {
    if (
      options?.rejectedValues &&
      options?.rejectedValues.includes(option[valueKey]) &&
      !options?.requiredValues.includes(option[valueKey])
    ) {
      return null;
    }

    return (
      <Select.Option
        key={option[valueKey] || index}
        value={option[valueKey]}
        disabled={
          (option[disabledKey] ||
            (disableOptions &&
              disableOptions.indexOf(option[valueKey]) >= 0)) ??
          false
        }
      >
        {textKeys.length <= 0
          ? (option[textKey] ?? option[alternativeTextKey])
          : textKeys
              .map((text_key) => option[text_key] || text_key)
              .join(separator)}
      </Select.Option>
    );
  });

  return (
    <InputWrapper {...formProps}>
      <Select
        filterOption={(input, option) =>
          (option?.children?.toString()?.toLowerCase() || '').includes(
            input.toLowerCase(),
          )
        }
        {...rest}
      >
        {renderOptions}
      </Select>
    </InputWrapper>
  );
};

export default SelectInputBox;
