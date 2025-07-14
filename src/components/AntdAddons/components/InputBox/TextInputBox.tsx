import React from 'react';
import { Input } from 'antd';
import { SplitInputWrapperProps, InputWrapper } from '../../functions';
import { InputBoxProps } from './interface';

const TextInputBox: React.FC<InputBoxProps> = (props) => {
  const { formProps, inputProps } = SplitInputWrapperProps(props);
  return (
    <InputWrapper {...formProps}>
      <Input placeholder={formProps?.label} {...inputProps} />
    </InputWrapper>
  );
};

export default TextInputBox;
