import React, { useEffect, useState } from 'react';
import { AppDispatch } from '@/store/app';
import { useDispatch } from 'react-redux';
import PageHeader from '@/components/PageHeader';
import { UsersBreadcrumb } from '@/config/BreadcrumbConfig';
import { Button, Card } from 'antd';
import { getUsersList } from './utils/usersSlice';
import Listing from './components/UserListing';
import EditUserDetails from './components/EditUserDetails';
import AddUserDetails from './components/AddUserDetails';
import { CONSTANT } from '@/config/Constant';

// import ScopeRolesMapping from './ScopeRolesMapping';
// import AssignUserRole from './AssignUserRole';
// import {
//   checkAddPermission,
//   checkEditPermission,
//   checkPermission,
// } from '@/config/global';
import RestrictedAccessPage from '@/views/errors/RestrictedAccessPage';
import { getCookie } from '@/utils/cookie';

const Users: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [dataList, setDataList] = useState<any[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [paginationData, setPaginationData] = useState<any>({
    current: CONSTANT.DEFAULT_PAGE_NUMBER,
    pageSize: CONSTANT.DEFAULT_PAGE_SIZE,
  });
  const [payloadData, setPayloadData] = useState<any>({});
  const [userDetails, setUserDetails] = useState<any>({});
  const [openUserProfile, setOpenUserProfile] = useState<boolean>(false);
  const [openNewUserProfile, setOpenNewUserProfile] = useState<boolean>(false);
  const [openAssignUserRole, setOpenAssignUserRole] = useState<boolean>(false);

  const tenantID = getCookie('tenantID');

  const handleNewUserProfileDrawer = () => {
    setOpenNewUserProfile(!openNewUserProfile);
  };

  const handleUserProfileDrawer = (userDetails?: any) => {
    setUserDetails(userDetails ? userDetails : {});
    setOpenUserProfile(!openUserProfile);
  };

  const handleAssignUserRoleDrawer = (userDetails?: any) => {
    setUserDetails(userDetails ? userDetails : {});
    setOpenAssignUserRole(!openAssignUserRole);
  };

  const handleUsersList = async (data?: any) => {
    setTableLoading(true);
    setLoading(true);

    const pageNumber = data?.current ?? paginationData?.current;
    const pageSize = data?.pageSize ?? paginationData?.pageSize;
    const payload = {
      ...data,
      tenantId: tenantID,
      pageNumber,
      pageSize,
    };
    delete payload?.current;
    if (payload) {
      dispatch(getUsersList(payload))
        .then((res: any) => {
          setDataList(res?.data);
          setTotalData(res?.totalCount);
        })
        .catch((error) => {
          setDataList([]);
          setTotalData(0);
          console.warn('Error: ', error);
        })
        .finally(() => {
          setTableLoading(false);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    handleUsersList();
  }, []);

  // const canEdit = checkEditPermission('User');
  // const canAdd = checkAddPermission('User');
  // const canManage = checkPermission('User', 'All');

  const canEdit = true;
  const canAdd = true;
  const canManage = true;

  const headerButtons = (
    <div className="headerButtons">
      {(canAdd || canManage) && (
        <Button
          type="primary"
          onClick={handleNewUserProfileDrawer}
          disabled={loading}
        >
          Add New
        </Button>
      )}
    </div>
  );

  return (
    <>
      <PageHeader
        breadcrumbs={UsersBreadcrumb}
        title={UsersBreadcrumb.title}
        children={headerButtons}
      />
      {canEdit || canAdd ? (
        <Card className="mainContent box">
          <Listing
            dataList={dataList}
            tableLoading={tableLoading}
            totalData={totalData}
            loading={loading}
            payloadData={payloadData}
            setPayloadData={setPayloadData}
            paginationData={paginationData}
            setPaginationData={setPaginationData}
            handleList={handleUsersList}
            handleUserProfileDrawer={handleUserProfileDrawer}
            handleAssignUserRoleDrawer={handleAssignUserRoleDrawer}
          />
        </Card>
      ) : (
        <RestrictedAccessPage />
      )}
      {openUserProfile ? (
        <EditUserDetails
          openUserProfile={openUserProfile}
          userDetails={userDetails}
          handleUserProfileDrawer={handleUserProfileDrawer}
          handleUsersList={handleUsersList}
        />
      ) : null}

      {openNewUserProfile ? (
        <AddUserDetails
          openNewUserProfile={openNewUserProfile}
          handleNewUserProfileDrawer={handleNewUserProfileDrawer}
          handleUsersList={handleUsersList}
        />
      ) : null}
    </>
  );
};

export default Users;
