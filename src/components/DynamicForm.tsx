import React from 'react';
import { Form, Button, Row, Col } from 'antd';
import FormInput from '@/components/FormInput';

interface DynamicFormProps {
  fields: any[] | null;
  onFinish: (data: any) => void;
  btnLoading?: boolean;
  [key: string]: any;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onFinish,
  layout = 'vertical',
  btnSize = 'middle',
  column = 12,
  btnLoading,
  ...rest
}) => {
  const [form] = Form.useForm();

  const handleValuesChange = (changedValues: any) => {
    form.validateFields(Object.keys(changedValues)).catch(() => {});
  };

  return (
    <Form
      form={form}
      layout={layout}
      onFinish={onFinish}
      onValuesChange={handleValuesChange}
      {...rest}
    >
      <Row gutter={[20, 20]}>
        {fields
          ? fields.map((input: any, index: number) => (
              <Col
                key={index}
                xs={24}
                md={input?.type === 'textarea' ? 24 : column ? column : 12}
              >
                <FormInput {...input} />
              </Col>
            ))
          : null}
        <Col xs={24}>
          <Button
            type="primary"
            htmlType="submit"
            size={btnSize}
            loading={btnLoading}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default DynamicForm;
