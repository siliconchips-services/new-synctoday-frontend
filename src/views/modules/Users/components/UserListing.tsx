import React from 'react';
import { Space, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { CONSTANT } from '@/config/Constant';
import DataTable from '@/components/DataTable';
import PageSpinner from '@/components/PageSpinner/PageSpinner';
import IconButton from '@/components/IconButton';

import { EditOutlined, SafetyCertificateFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  checkEditPermission,
  dateFormatter,
  trimIdNumber,
} from '@/config/global';

interface DataType {
  key?: string;
  id?: string | any;
  userId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  emailId: string;
  createdBy: string;
  createdDateTime: string;
  lastUpdatedBy: string;
  lastUpdatedDateTime: string;
  active: boolean;
  profileImage: string;
}

interface ListingProps<T = any> {
  dataList: DataType[];
  tableLoading: boolean;
  loading: boolean;
  totalData: number;
  payloadData: T;
  setPayloadData: React.Dispatch<React.SetStateAction<T>>;
  paginationData: T;
  setPaginationData: React.Dispatch<React.SetStateAction<T>>;
  handleList: (params) => void;
  handleOpenEditTenant?: (params) => void;
  handleOpenTenantOwner?: (params) => void;
  handleOpenAppMap?: (params) => void;
  handleOpenHQDrawer?: (params) => void;
  handleUserProfileDrawer?: (params) => void;
  handleAssignUserRoleDrawer?: (params) => void;
}
const Listing: React.FC<ListingProps> = (props) => {
  const {
    dataList,
    tableLoading,
    totalData,
    loading,
    payloadData,
    setPayloadData,
    paginationData,
    setPaginationData,
    handleList,
    handleUserProfileDrawer,
    handleAssignUserRoleDrawer,
  } = props;

  const data: DataType[] = dataList?.map((item, index) => ({
    key: index?.toString(),
    id: item?.id,
    userId: item?.userId,
    fullName: `${item?.firstName} ${item?.lastName}`,
    firstName: item?.firstName,
    emailId: item?.emailId,
    lastName: item?.lastName,
    createdBy: item?.createdBy,
    createdDateTime: item?.createdDateTime,
    lastUpdatedBy: item?.lastUpdatedBy,
    lastUpdatedDateTime: item?.lastUpdatedDateTime,
    active: item?.active,
    profileImage: item?.profileImage,
  }));

  const permissionLevel = checkEditPermission('User');

  const columns: ColumnsType<DataType> = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 150,
      fixed: 'left',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => (a.userId || '').localeCompare(b.userId || ''),
      render: (_, record) => {
        const userID =
          record?.userId && record?.userId != ''
            ? trimIdNumber(record?.userId, 4)
            : CONSTANT.NO_DATA_FOUND;
        return userID;
      },
    },
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
      //minWidth:: 200,
      sortDirections: ['descend', 'ascend'],
      // fixed: 'left',
      sorter: (a, b) => (a.fullName || '').localeCompare(b.fullName || ''),
      render: (_, record) => {
        const fullName =
          record?.fullName && record?.fullName !== '' ? (
            record.fullName?.length > 20 ? (
              <Tooltip title={record.fullName}>
                {record.fullName.slice(0, 20)}...
              </Tooltip>
            ) : (
              record.fullName
            )
          ) : (
            CONSTANT.NO_DATA_FOUND
          );

        return fullName;
      },
    },
    {
      title: 'Email ID',
      dataIndex: 'emailId',
      key: 'emailId',
      width: 200,
      //minWidth:: 200,
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => (a.emailId || '').localeCompare(b.emailId || ''),
      render: (_, record) => {
        const emailID =
          record?.emailId && record?.emailId !== '' ? (
            record.emailId?.length > 20 ? (
              <Tooltip title={record.emailId}>
                {record?.emailId.slice(0, 20)}...
              </Tooltip>
            ) : (
              <Tooltip title={record.emailId}>{record?.emailId}</Tooltip>
            )
          ) : (
            CONSTANT.NO_DATA_FOUND
          );

        return emailID;
      },
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      width: 100,
      //minWidth:: 100,
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) =>
        (a.active || '').toString().localeCompare((b.active || '').toString()),
      render: (_, record) => {
        return record.active ? (
          <Tag color={'blue'}>Active</Tag>
        ) : (
          <Tag color={'red'}>Inactive</Tag>
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdDateTime',
      key: 'createdDateTime',
      width: 180,
      //minWidth:: 180,
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) =>
        (a.createdDateTime || '')
          .toString()
          .localeCompare((b.createdDateTime || '').toString()),
      render: (_, record) => {
        const dateTime = dateFormatter(record?.createdDateTime);

        const text = (
          <div>
            <div className="mt-5">
              <strong>{record.createdBy}</strong>
            </div>
            <small>{dateTime}</small>
          </div>
        );
        return text;
      },
    },
    {
      title: 'Modified',
      dataIndex: 'lastUpdatedDateTime',
      key: 'lastUpdatedDateTime',
      width: 180,
      //minWidth:: 180,
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) =>
        (a.lastUpdatedDateTime || '')
          .toString()
          .localeCompare((b.lastUpdatedDateTime || '').toString()),
      render: (_, record) => {
        const dateTime = dateFormatter(record?.lastUpdatedDateTime);

        const text = (
          <div>
            {record.lastUpdatedBy ? (
              <div className="mt-5">
                <strong>{record.lastUpdatedBy}</strong>
              </div>
            ) : null}
            <small>{dateTime}</small>
          </div>
        );
        return text;
      },
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 100,
      //minWidth:: 150,
      render: (_, record, index) => {
        return (
          <Space size={10}>
            <IconButton
              key={index + 1}
              size="small"
              btnType="iconOnly"
              color="secondary"
              icon={<EditOutlined />}
              text="Edit"
              tooltip="Edit User"
              disabled={permissionLevel === 'none'}
              onClick={() => {
                if (permissionLevel !== 'none') {
                  handleUserProfileDrawer(record);
                }
              }}
            />

            <IconButton
              key={index + 2}
              size="small"
              btnType="iconOnly"
              color="secondary"
              icon={<SafetyCertificateFilled />}
              text="Assign Role"
              tooltip="Assign Role"
              disabled={permissionLevel === 'none'}
              onClick={() => {
                if (permissionLevel !== 'none') {
                  handleAssignUserRoleDrawer(record);
                }
              }}
            />
          </Space>
        );
      },
    },
  ];

  return !loading ? (
    <DataTable
      data={data}
      columns={columns}
      tableLoading={tableLoading}
      totalData={totalData}
      payloadData={payloadData}
      setPayloadData={setPayloadData}
      paginationData={paginationData}
      setPaginationData={setPaginationData}
      getListFunc={handleList}
    />
  ) : (
    <PageSpinner card={true} />
  );
};

export default Listing;
