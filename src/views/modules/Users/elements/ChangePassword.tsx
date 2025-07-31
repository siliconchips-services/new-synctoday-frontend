import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Col, Form, Row } from 'antd';
import { FormBox, InputBox } from '@/components/AntdAddons';
import { AppDispatch } from '@/store/app';
import { regexPatterns, validations } from '@/config/validations/validations';
import { changeUserPassword } from '../utils/usersSlice';
import { checkPermission } from '@/config/global';
import { getCookie } from '@/utils/cookie';

interface ChangePasswordProps {
  userID?: string | any;
}

const ChangePassword: React.FC<ChangePasswordProps> = (props) => {
  const { userID } = props;
  const [form] = Form.useForm();
  const dispatch: AppDispatch = useDispatch();

  const [disabled, setDisabled] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const handleChange = () => {
    form
      .validateFields()
      .then(() => setDisabled(false))
      .catch(() => setDisabled(true));
  };
  const handleFinish = async (data: any) => {
    setSaving(true);
    const tenantID = getCookie('tenantID');
    const payload = {
      tenantId: tenantID,
      userId: userID,
      password: data?.password,
    };
    await dispatch(changeUserPassword(payload))
      .then(() => {})
      .catch((error: any) => {
        console.warn('Error: ', error);
      })
      .finally(() => {
        setSaving(false);
      });
  };
  const canResetPassword = checkPermission('User', 'ResetPassword');
  return (
    <>
      <FormBox
        form={form}
        onFinish={handleFinish}
        onFinishFailed={handleChange}
        validateTrigger={['onBlur', 'onInput']}
        disabled={!canResetPassword}
      >
        <Row gutter={[10, 10]}>
          <Col xs={24} md={12} lg={8} xl={6}>
            <InputBox.Password
              name="password"
              label="Password"
              placeholder={'Enter Password'}
              onChange={handleChange}
              rules={[
                validations.required.text(),
                validations.pattern.password('Password'),
                validations.pattern.whitespace,
              ]}
            />
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <InputBox.Password
              name="confirmPassword"
              label="Confirm Password"
              placeholder={'Enter Password Again'}
              onChange={handleChange}
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password',
                },
                {
                  pattern: regexPatterns.whitespace,
                  message: 'Whitespace is not allowed.',
                },
                {
                  validator: (_, value) => {
                    if (value && form.getFieldValue('password') !== value) {
                      return Promise.reject(
                        new Error('Passwords do not match'),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            />
          </Col>
          <Col xs={24} className="pt-20 text-left">
            <Button
              loading={saving}
              disabled={disabled}
              type="primary"
              htmlType="submit"
            >
              {'Change Password'}
            </Button>
          </Col>
        </Row>
      </FormBox>
    </>
  );
};
export default ChangePassword;
