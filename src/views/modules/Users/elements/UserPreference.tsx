import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Col, Form, Row, Space, Spin } from 'antd';
import { FormBox, InputBox } from '@/components/AntdAddons';
import { AppDispatch } from '@/store/app';
import { validations } from '@/config/validations/validations';
import { ColorPickerProps, GetProp } from 'antd/lib';
import {
  editUserPreference,
  // getDateFormatsDD,
  // getLanguageDD,
  // getTimeFormatsDD,
  // getTimeZoneDD,
  getUserPreference,
} from '../utils/usersSlice';
import Cookies from 'js-cookie';
import { selectOptions } from '../utils/selectOptions';
import { DEFAULT_THEME } from '@/config/Constant';
import { useFetchTheme } from '@/hooks/useFetchTheme';
import { checkEditPermission } from '@/config/global';

interface UserPreferenceProps {
  activeTab?: string;
  userID?: string;
  isProfile?: boolean;
  isEdit?: boolean;
}

type Color = Extract<
  GetProp<ColorPickerProps, 'value'>,
  string | { cleared: any }
>;
type Format = GetProp<ColorPickerProps, 'format'>;

type ThemeData = {
  app_logo?: string;
  primary_font?: string;
  primary_color?: string;
  secondary_color?: string;
  [key: string]: any;
};

const UserPreference: React.FC<UserPreferenceProps> = ({
  activeTab,
  userID,
  isProfile,
  isEdit,
}) => {
  const [form] = Form.useForm();
  const dispatch: AppDispatch = useDispatch();

  const [primaryColorHex, setPrimaryColorHex] = useState<Color>('');
  const [primaryFormatHex, setPrimaryFormatHex] = useState<Format>('hex');
  const [secondaryColorHex, setSecondaryColorHex] = useState<Color>('');
  const [secondaryFormatHex, setSecondaryFormatHex] = useState<Format>('hex');

  const [disabled, setDisabled] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [languageLoading, setLanguageLoading] = useState<boolean>(false);
  const [timezoneLoading, setTimezoneLoading] = useState<boolean>(false);
  const [dateFormatLoading, setDateFormatLoading] = useState<boolean>(false);
  const [timeFormatLoading, setTimeFormatLoading] = useState<boolean>(false);
  const [userPrefLoading, setUserPrefLoading] = useState<boolean>(false);

  // const [userPreference, setUserPreference] = useState<any>({});
  const [languagesDD, setLanguagesDD] = useState<any[]>([]);
  const [timeZoneDD, setTimeZoneDD] = useState<any[]>([]);
  const [dateFormatDD, setDateFormatDD] = useState<any[]>([]);
  const [timeFormatDD, setTimeFormatDD] = useState<any[]>([]);
  const [loadTheme, setLoadTheme] = useState<boolean>(false);
  // Define ThemeData type or import it if available elsewhere

  const [dynamicTheme, setDynamicTheme] = useState<ThemeData | null>(null);
  useFetchTheme(dynamicTheme);

  const loadUserPreference = async () => {
    setUserPrefLoading(true);
    try {
      if (isProfile) {
        const json = Cookies.get('userPreference');
        const pref = json ? JSON.parse(json) : {};
        applyPreference(pref);
      } else if (isEdit && userID) {
        await dispatch(getUserPreference(userID))
          .then((returnDetails: any) => {
            const pref = returnDetails?.res || {};
            applyPreference(pref);
          })
          .catch(() => {
            applyPreference({});
          });
      }
    } finally {
      setUserPrefLoading(false);
    }
  };

  const applyPreference = (pref: any) => {
    const dl = pref?.languageCode ?? DEFAULT_THEME.LANGUAGE;
    const dtz = pref?.timezoneCode ?? DEFAULT_THEME.TIME_ZONE;
    const ddf = pref?.dateFormat ?? DEFAULT_THEME.DATE_FORMAT;
    const dtf = pref?.timeFormat ?? DEFAULT_THEME.TIME_FORMAT;

    const themeCode = pref?.themeCode ? JSON.parse(pref?.themeCode) : {};

    const pf = themeCode?.['primary-font'] ?? DEFAULT_THEME.PRIMARY_FONT;
    const pc =
      typeof themeCode === 'string'
        ? themeCode
        : themeCode?.['primary-color']
          ? themeCode?.['primary-color']
          : DEFAULT_THEME.PRIMARY_COLOR;

    const sc =
      typeof themeCode === 'string'
        ? themeCode
        : themeCode?.['secondary-color']
          ? themeCode?.['secondary-color']
          : DEFAULT_THEME.SECONDARY_COLOR;

    setPrimaryColorHex(pc);
    setSecondaryColorHex(sc);

    form.setFieldsValue({
      ...pref,
      languageCode: dl,
      timezoneCode: dtz,
      dateFormat: ddf,
      timeFormat: dtf,
      'primary-font': pf,
      'primary-color': pc,
      'secondary-color': sc,
    });

    // if (pref.timezoneCode) handleDateTimeList(pref.timezoneCode);
  };

  // const handleLanguageList = async () => {
  //   setLanguageLoading(true);
  //   await dispatch(getLanguageDD())
  //     .then((res) => setLanguagesDD(res?.data?.languages || []))
  //     .catch(console.warn)
  //     .finally(() => setLanguageLoading(false));
  // };

  // const handleTimeZoneList = async () => {
  //   setTimezoneLoading(true);
  //   await dispatch(getTimeZoneDD())
  //     .then((res) => setTimeZoneDD(res?.timezones || []))
  //     .catch(console.warn)
  //     .finally(() => setTimezoneLoading(false));
  // };

  // const handleDateTimeList = async (tz: string) => {
  //   setDateFormatLoading(true);
  //   setTimeFormatLoading(true);

  //   await dispatch(getDateFormatsDD(tz))
  //     .then((res) => setDateFormatDD(res?.data || []))
  //     .catch(console.warn)
  //     .finally(() => setDateFormatLoading(false));

  //   await dispatch(getTimeFormatsDD(tz))
  //     .then((res) => setTimeFormatDD(res?.data || []))
  //     .catch(console.warn)
  //     .finally(() => setTimeFormatLoading(false));
  // };

  useEffect(() => {
    if (activeTab === 'userPreference') {
      loadUserPreference();
      // handleLanguageList();
      // handleTimeZoneList();
    }
  }, [activeTab, isProfile, isEdit, userID]);

  const hexStringPrimary =
    typeof primaryColorHex === 'string'
      ? primaryColorHex
      : primaryColorHex?.toHexString();

  const hexStringSecondary =
    typeof secondaryColorHex === 'string'
      ? secondaryColorHex
      : secondaryColorHex?.toHexString();

  const handleChange = () => {
    form
      .validateFields()
      .then(() => setDisabled(false))
      .catch(() => setDisabled(true));
  };

  const handleFinish = async (data: any) => {
    setSaving(true);
    const themeInput = {
      'primary-font': data?.['primary-font'],
      'primary-color': hexStringPrimary,
      'secondary-color': hexStringSecondary,
    };
    const themeCodeString = JSON.stringify(themeInput);

    const payload = {
      userId: userID,
      languageCode: data?.languageCode,
      timezoneCode: data?.timezoneCode,
      dateFormat: data?.dateFormat,
      timeFormat: data?.timeFormat,
      // themeCode: hexStringPrimary,

      themeCode: themeCodeString,
    };

    await dispatch(editUserPreference(payload))
      .then((res: any) => {
        if (isProfile) {
          setLoadTheme(true);
          dispatch(getUserPreference(res?.data?.userId))
            .then((returnDetails: any) => {
              Cookies.remove('userPreference');
              Cookies.set(
                'userPreference',
                JSON.stringify(returnDetails?.res),
                {
                  expires: returnDetails?.expiresDate,
                },
              );

              if (returnDetails?.res?.themeCode) {
                const themeCode = returnDetails?.res?.themeCode
                  ? JSON.parse(returnDetails?.res?.themeCode)
                  : {};
                const theme = {
                  app_logo: DEFAULT_THEME.APP_LOGO,
                  primary_font: themeCode?.['primary-font'],
                  primary_color: themeCode?.['primary-color'],
                  secondary_color: themeCode?.['secondary-color'],
                };

                setDynamicTheme(theme);
              }
            })
            .catch((error) => {
              console.warn('Error: ', error);
            })
            .finally(() => {
              setLoadTheme(false);
            });
        }
      })
      .catch((error: any) => {
        console.warn('Error: ', error);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const permissionLevel = checkEditPermission('User');

  return (
    <FormBox
      form={form}
      onFinish={handleFinish}
      onFinishFailed={handleChange}
      validateTrigger={['onBlur', 'onInput']}
      disabled={permissionLevel === 'read'}
    >
      <Spin spinning={userPrefLoading}>
        <Row gutter={[10, 10]}>
          <Col xs={24} md={12} lg={8} xl={6}>
            <InputBox.Select
              name="languageCode"
              label="Language"
              placeholder="Select Language"
              loading={languageLoading}
              allowClear
              showSearch
              onChange={handleChange}
              notFoundContent={languagesDD?.length === 0 ? <Spin /> : null}
              // onFocus={() => languagesDD?.length === 0 && handleLanguageList()}
              options={{ list: languagesDD, valueKey: 'code', textKey: 'name' }}
              rules={[validations.required.select()]}
            />
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <InputBox.Select
              name="timezoneCode"
              label="Time Zone"
              placeholder="Select Time Zone"
              loading={timezoneLoading}
              allowClear
              showSearch
              onChange={(val: string) => {
                handleChange();
                // handleDateTimeList(val);
              }}
              notFoundContent={timeZoneDD?.length === 0 ? <Spin /> : null}
              // onFocus={() => timeZoneDD?.length === 0 && handleTimeZoneList()}
              options={{ list: timeZoneDD, valueKey: 'code', textKey: 'name' }}
              rules={[validations.required.select()]}
            />
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <InputBox.Select
              name="dateFormat"
              label="Date Format"
              placeholder="Select Date Format"
              loading={dateFormatLoading}
              allowClear
              showSearch
              onChange={handleChange}
              options={{
                list: dateFormatDD,
                valueKey: 'code',
                textKey: 'name',
              }}
              disabled={permissionLevel === 'read' || !dateFormatDD?.length}
              rules={[validations.required.select()]}
            />
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <InputBox.Select
              name="timeFormat"
              label="Time Format"
              placeholder="Select Time Format"
              loading={timeFormatLoading}
              allowClear
              showSearch
              onChange={handleChange}
              options={{
                list: timeFormatDD,
                valueKey: 'code',
                textKey: 'name',
              }}
              disabled={permissionLevel === 'read' || !timeFormatDD?.length}
              rules={[validations.required.select()]}
            />
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <InputBox.Select
              name="primary-font"
              label="Primary Font"
              placeholder="Select Primary Font"
              allowClear
              showSearch
              onChange={handleChange}
              initialValue="Poppins"
              options={{
                list: selectOptions.primaryFont,
                valueKey: 'code',
                textKey: 'name',
              }}
              rules={[validations.required.select()]}
            />
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item name="primary-color" label="Primary Color">
              <Space>
                <InputBox.ColorPicker
                  name="primary-color"
                  placeholder="Select Primary Color"
                  value={primaryColorHex}
                  onChange={(val: any) => {
                    handleChange();
                    setPrimaryColorHex(val);
                  }}
                  onFormatChange={setPrimaryFormatHex}
                  format={primaryFormatHex}
                  disabledAlpha
                />
                <span>{hexStringPrimary}</span>
              </Space>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} xl={6}>
            <Form.Item name="secondary-color" label="Secondary Color">
              <Space>
                <InputBox.ColorPicker
                  name="secondary-color"
                  placeholder="Select Secondary Color"
                  value={secondaryColorHex}
                  onChange={(val: any) => {
                    handleChange();
                    setSecondaryColorHex(val);
                  }}
                  onFormatChange={setSecondaryFormatHex}
                  format={secondaryFormatHex}
                  disabledAlpha
                />
                <span>{hexStringSecondary}</span>
              </Space>
            </Form.Item>
          </Col>
          <Col xs={24} className="pt-20 text-left">
            <Button
              loading={saving}
              disabled={disabled}
              type="primary"
              htmlType="submit"
            >
              Save User Preference
            </Button>
          </Col>
        </Row>
      </Spin>
      {loadTheme ? <Spin size="large" fullscreen={true} /> : null}
    </FormBox>
  );
};

export default UserPreference;
