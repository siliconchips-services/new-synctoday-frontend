import React, { useEffect, useState } from 'react';
import { Drawer, Button, Space, Form } from 'antd';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/app';
import { getAssignUserRole, updateAssignUserRole } from '../utils/usersSlice';
import { FormBox, InputBox } from '@/components/AntdAddons';
import PageSpinner from '@/components/PageSpinner/PageSpinner';
import { checkEditPermission } from '@/config/global';

interface AssignUserRoleProps {
  open: boolean;
  onClose: () => void;
  userDetails: any;
}

const AssignUserRole: React.FC<AssignUserRoleProps> = (props) => {
  const { open, onClose, userDetails } = props;
  const { userId, fullName } = userDetails;

  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();
  // const { assignRolesList, isLoading } = useSelector(
  //   (state: RootState) => state.USERS,
  // );
  const [assignRolesList, setAssignRolesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open && userId) {
      form.resetFields();
      setIsLoading(true);
      dispatch(getAssignUserRole(userId))
        .then((res: any) => {
          setAssignRolesList(res.data || []);
        })
        .catch((error) => {
          console.warn('Error: ', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open, userId]);

  const handleSubmit = (values: any) => {
    const payload = {
      userId,
      roleIds: values.roles || [],
    };
    setIsLoading(true);
    dispatch(updateAssignUserRole(payload)).finally(() => setIsLoading(false));
  };

  const permissionLevel = checkEditPermission('User');

  return (
    <Drawer
      title={`Assign User Roles: ${fullName}`}
      open={open}
      onClose={onClose}
      width={650}
      footer={
        <div className="text-right">
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={isLoading}
              disabled={permissionLevel === 'read'}
            >
              Save Roles
            </Button>
          </Space>
        </div>
      }
    >
      {isLoading ? (
        <PageSpinner card={true} />
      ) : assignRolesList?.length > 0 ? (
        <FormBox
          form={form}
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
          initialValues={{
            roles: assignRolesList
              ?.filter((r) => r.isChecked)
              .map((r) => r.roleId),
          }}
          disabled={permissionLevel === 'read'}
        >
          <InputBox.Checkbox
            name={`roles`}
            label="Select Roles"
            className="roleScope"
            options={{
              list: assignRolesList || [],
              valueKey: 'roleId',
              textKey: 'roleName',
            }}
          />
        </FormBox>
      ) : null}
    </Drawer>
  );
};

export default AssignUserRole;
