import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Col,
  Form,
  Row,
  Image,
  Switch,
  Upload,
  GetProp,
  UploadFile,
  UploadProps,
  message,
  Spin,
} from 'antd';
import { FormBox, InputBox } from '@/components/AntdAddons';
import { AppDispatch, RootState } from '@/store/app';
import {
  maxName,
  minName,
  validations,
} from '@/config/validations/validations';
import ImgCrop from 'antd-img-crop';
import { getUserDetails } from '../utils/usersSlice';
import {
  base64ToImageSrc,
  binaryToBase64,
  checkAddPermission,
  checkEditPermission,
  dataToFormDataConverter,
} from '@/config/global';
import { getCookie } from '@/utils/cookie';

interface BasicProfileProps {
  userData?: any;
  userID?: string | any;
  isAdd?: boolean;
  isProfile?: boolean;
  btnLoading?: boolean;
  handleAddUser?: (params) => void;
  handleEditUser?: (paramsID, params) => void;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const BasicProfile: React.FC<BasicProfileProps> = (props) => {
  const {
    userData,
    userID,
    isAdd,
    isProfile,
    // handleAddUser,
    handleEditUser,
    btnLoading,
  } = props;
  const [form] = Form.useForm();
  const dispatch: AppDispatch = useDispatch();
  const userImg = useSelector((state: RootState) => state.AUTH.userImg);

  const [disabled, setDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [userDetails, setUserDetails] = useState<any>(userData ? userData : {});

  const handleChange = () => {
    form
      .validateFields()
      .then(() => setDisabled(false))
      .catch(() => setDisabled(true));
  };

  // When editing, pre-load the image
  useEffect(() => {
    if (userImg) {
      const base64Image = binaryToBase64(userImg, 'image/png');
      const imageUrl = base64Image ? base64Image : '';

      const file: UploadFile = {
        uid: '-1', // any negative UID to indicate "already uploaded"
        name: 'logo.png',
        status: 'done', // important, otherwise it will look like uploading
        url: imageUrl,
      };

      setFileList([file]);
      setDisabled(false);
    } else {
      setFileList([]);
    }
  }, [userImg]);

  const handleFinish = (data: any) => {
    const tenantID = getCookie('tenantID');
    const payload = {
      TenantId: tenantID,
      UserId: data?.userId ?? '',
      EmailId: data?.emailId ?? '',
      // Password: data?.password ?? '',
      FirstName: data?.firstName ?? '',
      LastName: data?.lastName ?? '',
      Active: true,
      ImageFile:
        fileList?.length > 0 && fileList?.[0]?.originFileObj
          ? fileList?.[0]?.originFileObj
          : null,
    };

    const formDataPayload = dataToFormDataConverter(payload);

    if (formDataPayload) {
      handleEditUser(data?.userId, formDataPayload);
    }
  };

  const onUploadChange: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
  };
  const onUploadPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src && file.originFileObj) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }

    setPreviewImage(src || '');
    setPreviewOpen(true);
  };

  const handleUserDetails = React.useCallback(
    async (userID: string) => {
      setLoading(true);
      dispatch(getUserDetails(userID))
        .then((res: any) => {
          setUserDetails(res?.data || {});
        })
        .catch((error) => {
          message.error('Failed to fetch user details.');
          console.warn('Error: ', error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [dispatch],
  );

  useEffect(() => {
    if (userDetails === null) {
      if (userID) {
        handleUserDetails(userID);
      }
    }
  }, [userID, userDetails, handleUserDetails]);

  const onUploadBeforeUpload = (file) => {
    const isSizeValid = file.size <= 1024 * 1024;

    if (!isSizeValid) {
      message.error('File must be smaller than 1MB.');
      setDisabled(true);
      return false;
    }
    const isTypeValid = ['image/jpeg', 'image/png'].includes(file.type);
    if (!isTypeValid) {
      message.error('You can only upload JPG, JPEG, or PNG files.');
      setDisabled(true);
      return false;
    }

    if (isSizeValid && isTypeValid) {
      setDisabled(false);
    }
    return true;
  };

  const permissionLevel = checkEditPermission('User');
  const canAdd = checkAddPermission('User');

  // When editing, pre-load the image
  useEffect(() => {
    if (userDetails?.profileImage) {
      const imageUrl = userDetails?.profileImage
        ? base64ToImageSrc(userDetails?.profileImage)
        : '';

      const file: UploadFile = {
        uid: '-1', // any negative UID to indicate "already uploaded"
        name: 'logo.png',
        status: 'done', // important, otherwise it will look like uploading
        url: imageUrl,
      };

      setFileList([file]);
      setDisabled(false);
    } else {
      setFileList([]);
    }
  }, [userDetails]);

  return !loading ? (
    <>
      <FormBox
        form={form}
        onFinish={handleFinish}
        onFinishFailed={handleChange}
        validateTrigger={['onBlur', 'onInput']}
        initialValues={
          isAdd
            ? {
                userId: '',
                firstName: '',
                lastName: '',
                emailId: '',
                active: true,
              }
            : {
                userId: isProfile ? userDetails?.UserId : userDetails?.userId,
                firstName: isProfile
                  ? userDetails?.UserFirstName
                  : userDetails?.firstName,
                lastName: isProfile
                  ? userDetails?.UserLastName
                  : userDetails?.lastName,
                emailId: isProfile
                  ? userDetails?.UserEmailId
                  : userDetails?.emailId,
                active: isProfile ? null : userDetails?.active,
              }
        }
        disabled={isAdd ? !canAdd : permissionLevel === 'read'}
        autoComplete="off"
        aria-autocomplete="none"
        autoFocus={true}
      >
        <Row gutter={[10, 10]}>
          <Col xs={24} md={6}>
            <Form.Item className="m-0" label="Profile Photo">
              <ImgCrop
                showReset
                rotationSlider
                aspect={1}
                modalTitle="Crop Profile Photo"
              >
                <Upload
                  listType="picture-circle"
                  accept=".jpg, .jpeg, .png"
                  maxCount={1}
                  fileList={fileList}
                  onChange={onUploadChange}
                  onPreview={onUploadPreview}
                  beforeUpload={(file: any) => {
                    onUploadBeforeUpload(file);
                  }}
                >
                  {fileList.length < 1 && (
                    <>
                      Upload
                      <br />
                      Photo
                    </>
                  )}
                </Upload>
              </ImgCrop>

              {previewImage && (
                <Image
                  wrapperStyle={{ display: 'none' }}
                  preview={{
                    visible: previewOpen,
                    src: previewImage,
                    mask: null,
                    toolbarRender: () => null,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) => {
                      if (!visible) setPreviewImage('');
                    },
                    imageRender: (originalDom) => {
                      return (
                        <div style={{ textAlign: 'center' }}>{originalDom}</div>
                      );
                    },
                  }}
                  src={previewImage}
                />
              )}
            </Form.Item>
            {isProfile ? (
              <Button
                type="primary"
                htmlType="submit"
                disabled={disabled}
                loading={btnLoading}
                className="mt-15"
              >
                Update Profile Photo
              </Button>
            ) : null}
          </Col>
          <Col xs={24} md={18}>
            <Row gutter={[10, 10]}>
              <Col xs={24} md={12}>
                <InputBox.Text
                  name="userId"
                  label="User ID"
                  rules={[
                    validations.required.text(),
                    validations.max.text(maxName),
                    validations.min.text(minName),
                    validations.pattern.whitespace,
                  ]}
                  onChange={handleChange}
                  autoComplete="off"
                  aria-autocomplete="none"
                  disabled={true}
                />
              </Col>
              <Col xs={24} md={12}>
                <InputBox.Text
                  name="emailId"
                  label="Email ID"
                  rules={[
                    validations.required.text(),
                    validations.pattern.email(),
                  ]}
                  // disabled={isProfile ? true : false}
                  onChange={handleChange}
                  disabled={true}
                />
              </Col>
              {isAdd ? (
                <Col xs={24} md={12}>
                  <InputBox.Password
                    name="password"
                    label="Password"
                    placeholder={'Enter Password'}
                    rules={[
                      validations.required.text(),
                      validations.pattern.password('Password'),
                      validations.pattern.whitespace,
                    ]}
                    // disabled={isProfile ? true : false}
                    onChange={handleChange}
                    disabled={true}
                  />
                </Col>
              ) : null}

              <Col xs={24} md={12}>
                <InputBox.Text
                  name="firstName"
                  label="First Name"
                  rules={[
                    validations.required.text(),
                    validations.max.text(maxName),
                    validations.min.text(minName),
                    validations.pattern.whitespace,
                  ]}
                  onChange={handleChange}
                  // disabled={isProfile ? true : false}
                  disabled={true}
                />
              </Col>
              <Col xs={24} md={12}>
                <InputBox.Text
                  name="lastName"
                  label="Last Name"
                  rules={[
                    validations.required.text(),
                    validations.max.text(maxName),
                    validations.pattern.whitespace,
                  ]}
                  onChange={handleChange}
                  // disabled={isProfile ? true : false}
                  disabled={true}
                />
              </Col>

              {!isProfile ? (
                <Col xs={24} md={12}>
                  <Form.Item
                    name="active"
                    label="Active"
                    valuePropName="checked"
                  >
                    <Switch disabled={true} />
                  </Form.Item>
                </Col>
              ) : null}
            </Row>
          </Col>
          {!isProfile ? (
            <Col xs={24} className="pt-10 text-left">
              <Button
                type="primary"
                htmlType="submit"
                disabled={disabled}
                loading={btnLoading}
              >
                Save Profile
              </Button>
            </Col>
          ) : null}
        </Row>
      </FormBox>
    </>
  ) : (
    <div className="text-center">
      <Spin size="large" />
    </div>
  );
};
export default BasicProfile;
