import React from 'react';
import { Input } from 'antd';
import { SplitInputWrapperProps, InputWrapper } from '../../functions';
import { PasswordInputBoxProps } from './interface';

const PasswordInputBox: React.FC<PasswordInputBoxProps> = (props) => {
  const { formProps, inputProps } = SplitInputWrapperProps(props);
  return (
    <InputWrapper {...formProps}>
      <Input.Password {...inputProps} />
    </InputWrapper>
  );
};

export default PasswordInputBox;
