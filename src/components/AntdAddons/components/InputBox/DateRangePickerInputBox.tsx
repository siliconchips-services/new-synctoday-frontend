import React from 'react';
import { DatePicker } from 'antd';
import { DateRangePickerInputBoxProps } from './interface';
import { SplitInputWrapperProps, InputWrapper } from '../../functions';
import { CONSTANT } from '@/config/Constant';

const DateRangePickerInputBox: React.FC<DateRangePickerInputBoxProps> = (
  props,
) => {
  const { formProps, inputProps } = SplitInputWrapperProps(props);
  return (
    <InputWrapper {...formProps}>
      <DatePicker.RangePicker format={CONSTANT.DATE_FORMAT} {...inputProps} />
    </InputWrapper>
  );
};

export default DateRangePickerInputBox;
