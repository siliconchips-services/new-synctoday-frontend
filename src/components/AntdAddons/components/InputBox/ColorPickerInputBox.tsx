import React from 'react';
import { InputWrapper, SplitInputWrapperProps } from '../../functions';
import { ColorPicker } from 'antd';

const ColorPickerInputBox: React.FC<any> = (props) => {
  const { formProps, inputProps } = SplitInputWrapperProps(props);

  return (
    <InputWrapper {...formProps} className="color-picker-input-design">
      <ColorPicker
        popup
        onColorResult={(color: { rgb: any }) => color.rgb}
        {...inputProps}
      />
    </InputWrapper>
  );
};

export default ColorPickerInputBox;
