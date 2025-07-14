import { AppDispatch, RootState } from '@/store/app';
import { Button, Drawer, Form, Space, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RoleScopeForm from './components/RoleScopeForm';
import {
  getScopeRolesMapping,
  updateScopeRolesMapping,
} from '../utils/usersSlice';
import { FormBox } from '@/components/AntdAddons';
import PageSpinner from '@/components/PageSpinner/PageSpinner';
import { checkEditPermission } from '@/config/global';

interface ScopeRolesMappingProps {
  open: boolean;
  onClose: () => void;
}

const ScopeRolesMapping: React.FC<ScopeRolesMappingProps> = ({
  open,
  onClose,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();
  const { scopeRolesList, isLoading } = useSelector(
    (state: RootState) => state.USERS,
  );

  const [saving, setSaving] = useState<boolean>(false);
  const [filteredRoleId] = useState<string>('ALL');

  const visibleRoles =
    filteredRoleId === 'ALL'
      ? scopeRolesList
      : scopeRolesList.filter((role) => role.roleId === filteredRoleId);

  const handleSubmit = (values: Record<string, unknown>) => {
    const grouped: Record<string, string[]> = {};

    Object.entries(values).forEach(([key, scopeIds]) => {
      const [roleId] = key.split('_');
      if (!grouped[roleId]) {
        grouped[roleId] = [];
      }

      // Safely cast to string[]
      const scopes = Array.isArray(scopeIds) ? (scopeIds as string[]) : [];

      grouped[roleId] = [...new Set([...grouped[roleId], ...scopes])];
    });

    const payload = Object.entries(grouped).map(([roleId, scopeIds]) => ({
      roleId,
      scopeIds,
    }));

    setSaving(true);
    dispatch(updateScopeRolesMapping({ scopeRoles: payload }))
      .catch((error) => {
        console.warn('Error: ', error);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  useEffect(() => {
    if (open) {
      dispatch(getScopeRolesMapping());
    }
  }, [open]);

  return (
    <Drawer
      title="Scope & Roles Mapping"
      open={open}
      onClose={onClose}
      width={900}
      destroyOnHidden
      footer={
        <div className="text-right">
          <Space>
            <Button onClick={onClose}>Close</Button>
            <Button
              type="primary"
              className="ml-2"
              onClick={() => form.submit()}
              loading={saving}
            >
              Save Mapping
            </Button>
          </Space>
        </div>
      }
    >
      {isLoading ? (
        <PageSpinner card />
      ) : (
        <FormBox
          form={form}
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
          validateTrigger={['onBlur', 'onInput']}
        >
          <Tabs
            tabPosition="left"
            className="mb-4"
            items={visibleRoles?.map((role) => ({
              key: role.roleId,
              label: role.roleName,
              forceRender: true,
              children: <RoleScopeForm role={role} form={form} />,
            }))}
          />
        </FormBox>
      )}
    </Drawer>
  );
};

export default ScopeRolesMapping;
