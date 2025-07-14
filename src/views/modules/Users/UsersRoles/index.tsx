import {
  Drawer,
  Button,
  Form,
  Input,
  Switch,
  message,
  Table,
  Tooltip,
  Space,
  Tag,
  Popconfirm,
  Card,
  Row,
  Col,
} from 'antd';
import { useEffect, useState } from 'react';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/app';
import {
  getRolesList,
  addRole,
  updateRole,
  deleteRole,
} from '@/views/modules/Users/utils/usersSlice';

interface RolesDrawerProps {
  openRolesDrawer: boolean;
  handleRolesDrawer: () => void;
}

interface RolesItem {
  key?: string;
  roleId?: string;
  roleName: string;
  desc?: string;
  active?: boolean;
  isNew?: boolean;
}

const UsersRoles: React.FC<RolesDrawerProps> = ({
  openRolesDrawer,
  handleRolesDrawer,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<RolesItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [newRoleVisible, setNewRoleVisible] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    const res = await dispatch(getRolesList());
    if (res?.isSuccess && Array.isArray(res?.data)) {
      setRoles(res.data);
    } else {
      message.error('Failed to load roles');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (openRolesDrawer) fetchRoles();
  }, [openRolesDrawer]);

  const handleEdit = (record: RolesItem) => {
    form.setFieldsValue(record);
    setEditingRoleId(record.roleId || null);
  };

  const handleCancelEdit = () => {
    setEditingRoleId(null);
    setNewRoleVisible(false);
    form.resetFields();
  };

  const handleSave = async (values: RolesItem) => {
    const payload = { ...values, roleId: editingRoleId };
    const res = editingRoleId
      ? await dispatch(updateRole(payload))
      : await dispatch(addRole(payload));

    if (res?.isSuccess) {
      message.success(editingRoleId ? 'Role updated' : 'Role added');
      setNewRoleVisible(false);
      setEditingRoleId(null);
      form.resetFields();
      fetchRoles();
    } else {
      message.error('Operation failed');
    }
  };

  const handleDelete = async (roleId: string) => {
    const res = await dispatch(deleteRole(roleId));
    if (res?.isSuccess) {
      message.success('Role deleted');
      fetchRoles();
    } else {
      message.error('Delete failed');
    }
  };

  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'roleName',
      key: 'roleName',
      render: (text: string) =>
        text?.length > 20 ? (
          <Tooltip title={text}>{text.slice(0, 20)}...</Tooltip>
        ) : (
          text
        ),
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      key: 'desc',
      render: (text: string) =>
        text?.length > 30 ? (
          <Tooltip title={text}>{text.slice(0, 30)}...</Tooltip>
        ) : (
          text
        ),
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'blue' : 'red'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: RolesItem) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Do you really want to delete this role?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDelete(record.roleId!)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" className="cancel-btn" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Drawer
      title="Manage User Roles"
      open={openRolesDrawer}
      onClose={handleRolesDrawer}
      width={900}
      extra={
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => {
            form.resetFields();
            setNewRoleVisible(true);
            setEditingRoleId(null);
          }}
        >
          Add Role
        </Button>
      }
    >
      {(newRoleVisible || editingRoleId) && (
        <Card className="filterForm p-0">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{ active: true }}
          >
            <Row gutter={[20, 10]} align={'middle'}>
              <Col xs={12} className="text-left">
                <strong>Create New Role</strong>
              </Col>
              <Col xs={12} className="text-right">
                <Space>
                  <Button type="primary" htmlType="submit">
                    {editingRoleId ? 'Update Role' : 'Create Role'}
                  </Button>
                  <Button
                    type="primary"
                    htmlType="reset"
                    className="cancel-btn"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </Space>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Role Name"
                  name="roleName"
                  rules={[
                    { required: true, message: 'Please enter role name' },
                  ]}
                >
                  <Input placeholder="Enter role name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={12}>
                <Form.Item
                  label="Description"
                  name="desc"
                  rules={[
                    { required: true, message: 'Please enter description' },
                  ]}
                >
                  <Input placeholder="Enter description" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={4}>
                <Form.Item label="Active" name="active" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      )}

      <Table
        columns={columns}
        dataSource={roles}
        rowKey="roleId"
        loading={loading}
        pagination={false}
      />
    </Drawer>
  );
};

export default UsersRoles;
