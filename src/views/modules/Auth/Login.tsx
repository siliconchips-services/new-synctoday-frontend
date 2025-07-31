import React, { useEffect, useState } from 'react';
import { Skeleton, Row, Col, message } from 'antd';
import DynamicForm from '@/components/DynamicForm';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/app';
import { decodeToken, doLogin, getUserPreference } from './utils/AuthSlice';
import { regexPatterns } from '@/config/validations/validations';
import path from '@/config/path';
// import { useModuleAccess } from '@/hooks/useModuleAccess';
import PageSpinner from '@/components/PageSpinner/PageSpinner';
import { setCookie } from '@/utils/cookie';

const Login: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [fields, setFields] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const [isShow, setIsShow] = useState<boolean>(false);
  const tenantID = import.meta.env.VITE_X_TENANT_ID;

  const formInputs = [
    {
      name: 'userId',
      label: 'Emp. ID/Email ID',
      type: 'text',
      placeholder: 'Enter User ID',
      required: true,
      regex: /^[a-zA-Z0-9@._-]{8,200}$/, // Only alphanumeric, 8-20 chars
      validationMessage: 'Please enter a valid Employee ID or Email ID.',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter password',
      required: true,
      regex: regexPatterns.password, // At least 7 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
      validationMessage:
        'Password should contain at least 7 to 15 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.',
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setFields(formInputs);
    }, 1000);
  });

  // // Call useModuleAccess hooks at the top level
  // const appModuleAccess = useModuleAccess(
  //   import.meta.env.VITE_APPLICATION_SERVICE_IDs,
  // );
  // const tenantModuleAccess = useModuleAccess(
  //   import.meta.env.VITE_TENANTS_SERVICE_IDs,
  // );
  // const coreModuleAccess = useModuleAccess(
  //   import.meta.env.VITE_CORE_SERVICE_IDs,
  // );
  // const userModuleAccess = useModuleAccess(
  //   import.meta.env.VITE_PLATFORM_IDENTITY_SERVICE_IDs,
  // );

  // useEffect(() => {
  //   const appToken = Cookies.get('token_apps');
  //   const coreToken = Cookies.get('token_core');
  //   const tenantToken = Cookies.get('token_tenants');
  //   const userToken = Cookies.get('token_user');
  //   if (appToken || coreToken || tenantToken || userToken) {
  //     setIsToken(true);
  //   }
  // }, [
  //   isToken,
  //   coreModuleAccess,
  //   tenantModuleAccess,
  //   appModuleAccess,
  //   userModuleAccess,
  // ]);

  const onFinish = async (data) => {
    setLoading(true);
    if (data) {
      const payload = {
        tenantId: tenantID,
        userId: data?.userId,
        password: data?.password,
      };
      await dispatch(doLogin(payload))
        .then((res: any) => {
          const token = res?.data?.token;
          if (token) {
            const userDetails = decodeToken(token);

            dispatch(getUserPreference(userDetails?.UserId, tenantID, token))
              .then((returnDetails: any) => {
                // returnDetails?.res &&
                setCookie(
                  'userPreference',
                  JSON.stringify(returnDetails?.res || {}),
                  {
                    expires: returnDetails?.expiresDate,
                  },
                );
                setLoading(false);
                navigate(path.dashboard);
                message.success('Login Successfully.');
              })
              .catch((error) => {
                console.warn('Error: ', error);
                setLoading(false);
                navigate(path.dashboard);
                message.success('Login Successfully.');
              });
          }
        })
        .catch((error) => {
          console.warn('Error: ', error);
          setLoading(false);
        });
    }
  };

  return tenantID ? (
    <>
      <div className="box">
        <h2 className="title">Login</h2>
        <Skeleton loading={!fields} round active>
          <Row gutter={[20, 20]}>
            {fields && (
              <Col xs={24}>
                <DynamicForm
                  name="loginForm"
                  className="loginForm"
                  fields={fields}
                  onFinish={onFinish}
                  colon={false}
                  layout={'vertical'}
                  column={24}
                  btnSize="large"
                  btnLoading={loading}
                />
              </Col>
            )}
          </Row>
        </Skeleton>
      </div>
    </>
  ) : (
    <PageSpinner card={false} />
  );
};

export default Login;
