import React from 'react';
import { Input } from 'antd';
import { SplitInputWrapperProps, InputWrapper } from '../../functions';
import { TextAreaBoxProps } from './interface';

const { TextArea } = Input;

const TextAreaInputBox: React.FC<TextAreaBoxProps> = ({
  rows = 4,
  ...rest
}) => {
  const { formProps, inputProps } = SplitInputWrapperProps(rest);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    setTimeout(() => {
      const textarea = e.target as HTMLTextAreaElement;
      let text = textarea.value;

      // Trim each line and remove empty lines
      text = text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line !== '')
        .join('\n');

      // Set the new cleaned value
      textarea.value = text;

      // Also fire onChange manually to update Form value
      if (inputProps?.onChange) {
        inputProps.onChange({
          ...e,
          target: {
            ...e.target,
            value: text,
          },
        });
      }
    }, 0);
  };

  return (
    <InputWrapper {...formProps}>
      <TextArea {...inputProps} rows={rows} onPaste={handlePaste} />
    </InputWrapper>
  );
};

export default TextAreaInputBox;
