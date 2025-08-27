import React from 'react';
import { DatePicker } from 'antd';
import { DatePickerInputBoxProps } from './interface';
import { SplitInputWrapperProps, InputWrapper } from '../../functions';
import { CONSTANT } from '@/config/Constant';

const DateTimePickerInputBox: React.FC<DatePickerInputBoxProps> = (props) => {
  const { formProps, inputProps } = SplitInputWrapperProps(props);
  return (
    <InputWrapper {...formProps}>
      <DatePicker format={CONSTANT.DATE_TIME_FORMAT} showTime {...inputProps} />
    </InputWrapper>
  );
};

export default DateTimePickerInputBox;
