import React from 'react';
import { FormProps, Form } from 'antd';

const FormBox: React.FC<FormProps> = ({
  layout = 'vertical',
  autoComplete = 'off',
  // requiredMark = "optional",
  scrollToFirstError = { behavior: 'smooth' },
  children,
  disabled,
  ...rest
}) => {
  return (
    <Form
      layout={layout}
      autoComplete={autoComplete}
      requiredMark={false}
      scrollToFirstError={scrollToFirstError}
      disabled={disabled}
      {...rest}
    >
      {children as React.ReactNode}
    </Form>
  );
};

export default FormBox;
