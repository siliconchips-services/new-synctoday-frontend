import {
  Collapse,
  Table,
  Input,
  Switch,
  Button,
  Space,
  message,
  Drawer,
  Card,
  Form,
  Row,
  Col,
  Tooltip,
  Tag,
} from 'antd';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/app';
import {
  getUserScope,
  addUserScope,
  editUserScope,
} from '@/views/modules/Users/utils/usersSlice';
import PageSpinner from '@/components/PageSpinner/PageSpinner';
import { CONSTANT } from '@/config/Constant';
import DataNotFound from '@/views/errors/DataNotFound';

interface ScopeItem {
  scopeId?: string;
  scopeName: string;
  displayName: string;
  desc?: string;
  active?: boolean;
  isNew?: boolean;
}

interface ScopeGroup {
  title: string;
  scopes: ScopeItem[];
}

interface ScopeDrawerProps {
  openScopeDrawer: boolean;
  handleScopeDrawer: () => void;
}

const UsersScope: React.FC<ScopeDrawerProps> = (props) => {
  const { handleScopeDrawer, openScopeDrawer } = props;

  const dispatch: AppDispatch = useDispatch();
  const [groups, setGroups] = useState<ScopeGroup[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newScopeGroup, setNewScopeGroup] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newScope, setNewScope] = useState<ScopeItem | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (openScopeDrawer) {
      fetchScopes();
    }
  }, [openScopeDrawer]);

  const fetchScopes = async () => {
    setLoading(true);
    await dispatch(getUserScope())
      .then((res: any) => {
        setGroups((res.data as ScopeGroup[]) || []);
      })
      .catch((error) => {
        console.warn('Error: ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const isEditing = (record: ScopeItem) =>
    record.scopeId === editingKey || record.isNew;

  const edit = (record: ScopeItem) => {
    setEditingKey(record.scopeId || '');
  };

  const cancel = () => {
    if (newScopeGroup) {
      const updatedGroups = groups.map((group) => {
        if (group.title === newScopeGroup) {
          return {
            ...group,
            scopes: group.scopes.filter((scope) => !scope.isNew),
          };
        }
        return group;
      });
      setGroups(updatedGroups);
      setNewScopeGroup(null);
    }
    setEditingKey(null);
    setNewScope(null);
  };

  const save = async (record: ScopeItem) => {
    if (!record.scopeName || !record.displayName) {
      message.error('Please fill all fields');
      return;
    }
    setSaving(true);
    const payload = { ...record, desc: record.desc || record.displayName };
    delete payload?.isNew;

    const res = record.isNew
      ? await dispatch(addUserScope(payload))
      : await dispatch(editUserScope(record.scopeId!, payload));

    if (res.isSuccess) {
      fetchScopes();
      cancel();
      setSaving(false);
    } else {
      message.error('Save failed');
      setSaving(false);
    }
  };

  const handleFieldChange = (
    title: string,
    key: string,
    field: keyof ScopeItem,
    value: any,
  ) => {
    const updatedGroups = groups.map((group) => {
      if (group.title === title) {
        const updatedScopes = group.scopes.map((scope) => {
          if ((scope.scopeId || 'new') === key) {
            return { ...scope, [field]: value };
          }
          return scope;
        });
        return { ...group, scopes: updatedScopes };
      }
      return group;
    });
    setGroups(updatedGroups);
  };

  const addNewScope = (title: string) => {
    if (newScopeGroup) {
      message.warning('You can only add one new scope at a time');
      return;
    }

    const updatedGroups = groups.map((group) => {
      if (group.title === title) {
        return {
          ...group,
          scopes: [
            {
              scopeId: undefined,
              scopeName: '',
              displayName: '',
              isNew: true,
              active: true,
            },
            ...group.scopes,
          ],
        };
      }
      return group;
    });

    setGroups(updatedGroups);
    setNewScopeGroup(title);
    setEditingKey('new');
  };

  const onFieldChange = (
    scopeId: string,
    field: keyof ScopeItem,
    value: any,
  ) => {
    const updatedGroups = groups.map((group) => {
      const updatedScopes = group.scopes.map((scope) => {
        if (scope.scopeId === scopeId) {
          return { ...scope, [field]: value };
        }
        return scope;
      });
      return { ...group, scopes: updatedScopes };
    });
    setGroups(updatedGroups);
  };

  const columns = (title: string) => [
    {
      title: 'Scope Name',
      dataIndex: 'scopeName',
      width: 200,
      render: (_: any, record: ScopeItem) => {
        const scopeNameText =
          record.scopeName?.length > 25 ? (
            <Tooltip title={record.scopeName}>
              {record.scopeName.slice(0, 25)}...
            </Tooltip>
          ) : (
            record.scopeName
          );

        return isEditing(record) ? (
          <Input
            value={record.scopeName}
            onChange={(e) =>
              handleFieldChange(
                title,
                record.scopeId || 'new',
                'scopeName',
                e.target.value,
              )
            }
          />
        ) : (
          scopeNameText
        );
      },
    },
    {
      title: 'Display Name',
      dataIndex: 'displayName',
      width: 200,
      render: (_: any, record: ScopeItem) => {
        const displayNameText =
          record.displayName?.length > 25 ? (
            <Tooltip title={record.displayName}>
              {record.displayName.slice(0, 25)}...
            </Tooltip>
          ) : (
            record.displayName
          );

        return isEditing(record) ? (
          <Input
            value={record.displayName}
            onChange={(e) =>
              handleFieldChange(
                title,
                record.scopeId || 'new',
                'displayName',
                e.target.value,
              )
            }
          />
        ) : (
          displayNameText
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      width: 100,
      render: (val: boolean, record: ScopeItem) => {
        const status = (
          <Tag color={val ? 'blue' : 'red'}>{val ? 'Active' : 'Inactive'}</Tag>
        );
        return isEditing(record) ? (
          <Switch
            checked={record.active}
            onChange={(checked) =>
              onFieldChange(record.scopeId!, 'active', checked)
            }
          />
        ) : (
          status
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'actions',
      width: 160,
      render: (_: any, record: ScopeItem) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button type="link" loading={saving} onClick={() => save(record)}>
              Save
            </Button>
            <Button type="link" className="cancel-btn ml-5" onClick={cancel}>
              Cancel
            </Button>
          </Space>
        ) : (
          <Button type="link" onClick={() => edit(record)}>
            Edit
          </Button>
        );
      },
    },
  ];

  const handleSaveNewScope = async () => {
    if (!newScope?.scopeName || !newScope.displayName || !newScope.desc) {
      return message.error('All fields are required.');
    }

    setSaving(true);
    try {
      const payload = {
        scopeName: newScope.scopeName,
        displayName: newScope.displayName,
        desc: newScope.desc,
        active: newScope.active,
      };
      const res = await dispatch(addUserScope(payload));
      if (res.isSuccess) {
        message.success('Scope created successfully');
        setNewScope(null); // Hide form
        fetchScopes(); // Refresh list
      } else {
        message.error('Failed to create scope');
        setSaving(false);
      }
    } catch (err) {
      console.error(err);
      message.error('Error while saving scope');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      title="Manage Users Scopes"
      open={openScopeDrawer}
      width={900}
      onClose={handleScopeDrawer}
      extra={
        !newScope && (
          <Button
            type="primary"
            onClick={() =>
              setNewScope({
                scopeName: '',
                displayName: '',
                desc: '',
                active: true,
                isNew: true,
              })
            }
          >
            Add New Scope
          </Button>
        )
      }
    >
      {newScope && (
        <Card className="mb-10 filterForm p-0">
          <Form layout="vertical">
            <Row gutter={[20, 10]} align={'middle'}>
              <Col xs={12} className="text-left"></Col>
              <Col xs={12} className="text-right">
                <Button
                  type="primary"
                  loading={saving}
                  onClick={() => handleSaveNewScope()}
                >
                  Create
                </Button>
                <Button
                  type="primary"
                  className="cancel-btn ml-5"
                  onClick={cancel}
                >
                  Cancel
                </Button>
              </Col>
              <Col xs={24} md={12} lg={12}>
                <Form.Item label="Scope Name" required>
                  <Input
                    value={newScope.scopeName}
                    onChange={(e) =>
                      setNewScope({ ...newScope, scopeName: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={12}>
                <Form.Item label="Display Name" required>
                  <Input
                    value={newScope.displayName}
                    onChange={(e) =>
                      setNewScope({ ...newScope, displayName: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={12}>
                <Form.Item label="Description" required>
                  <Input
                    value={newScope.desc}
                    onChange={(e) =>
                      setNewScope({ ...newScope, desc: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={12}>
                <Form.Item label="Status">
                  <Switch
                    checked={newScope.active}
                    onChange={(val) =>
                      setNewScope({ ...newScope, active: val })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      )}

      {!loading ? (
        groups?.length > 0 ? (
          <Collapse accordion defaultActiveKey={groups?.[0]?.title}>
            {groups?.map((group) => (
              <Collapse.Panel header={group?.title} key={group?.title}>
                <Button
                  type="primary"
                  onClick={() => addNewScope(group?.title)}
                  style={{ marginBottom: 16 }}
                >
                  Add New Scope
                </Button>
                <Table
                  rowKey={(record) => record?.scopeId || 'new'}
                  // loading={loading}
                  dataSource={group?.scopes}
                  columns={columns(group?.title)}
                  pagination={false}
                />
              </Collapse.Panel>
            ))}
          </Collapse>
        ) : (
          <DataNotFound title={CONSTANT.NO_DATA_FOUND_TITLE} />
        )
      ) : (
        <PageSpinner card={true} />
      )}
    </Drawer>
  );
};

export default UsersScope;
