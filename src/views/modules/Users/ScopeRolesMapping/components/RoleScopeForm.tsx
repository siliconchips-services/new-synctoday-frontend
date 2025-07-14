import { InputBox } from '@/components/AntdAddons';
import { Col, Row, Typography } from 'antd';
import React, { useEffect } from 'react';

interface RoleScopeFormProps {
  role: {
    roleId: string;
    roleName: string;
    scopes: Array<{
      scopeName: string;
      displayName: string;
      scopeId: string;
      isChecked: boolean;
    }>;
  };
  form: any;
}

const RoleScopeForm: React.FC<RoleScopeFormProps> = ({ role, form }) => {
  // Group scopes by prefix (before first dot)
  const groupScopes = (
    scopes: Array<{ scopeName: string; displayName: string; scopeId: string }>,
  ) => {
    const groups: {
      [prefix: string]: Array<{
        label: React.ReactNode;
        value: string;
      }>;
    } = {};
    scopes.forEach((scope) => {
      const prefix = scope.scopeName.split('.')[0];
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix].push({
        label: (
          <>
            <strong>{scope.scopeName}</strong>
            <small>{scope.displayName}</small>
          </>
        ),
        value: scope.scopeId,
      });
    });
    return groups;
  };

  useEffect(() => {
    if (role?.scopes?.length > 0) {
      const checkedScopeIds = role.scopes
        .filter((s) => s.isChecked)
        .map((s) => s.scopeId);

      const initialValues: Record<string, string[]> = {
        [role.roleId]: checkedScopeIds,
      };

      const grouped = groupScopes(role.scopes);
      for (const [prefix, options] of Object.entries(grouped)) {
        const selected = options
          .filter((opt) => checkedScopeIds.includes(opt.value))
          .map((opt) => opt.value);
        initialValues[`${role.roleId}_${prefix}`] = selected;
      }

      form.setFieldsValue(initialValues);
    }
  }, [role, form]);

  const groupedOptions = groupScopes(role.scopes);

  return (
    <>
      {/* <Typography.Title level={4}>{role.roleName}</Typography.Title> */}
      <Row gutter={[10, 10]}>
        {Object.entries(groupedOptions).map(([groupName, options]) => (
          <Col xs={24} md={12} key={groupName}>
            <Typography.Title level={5}>{groupName}</Typography.Title>

            <InputBox.Checkbox
              name={`${role.roleId}_${groupName}`}
              className="roleScope"
              options={{
                list: options || [],
                valueKey: 'value',
                textKey: 'label',
              }}
              onChange={(checkedValues) => {
                const allGroupValues = Object.entries(groupedOptions).reduce(
                  (acc, [g]) => {
                    const groupValue =
                      g === groupName
                        ? checkedValues
                        : form.getFieldValue(`${role.roleId}_${g}`) || [];
                    return [...acc, ...groupValue];
                  },
                  [] as string[],
                );

                form.setFieldsValue({
                  [`${role.roleId}_${groupName}`]: checkedValues,
                  [role.roleId]: allGroupValues, // ✅ Update the main field
                });
              }}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default RoleScopeForm;
